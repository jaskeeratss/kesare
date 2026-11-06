/**
 * KESARE Piano Studio — Professional Audio Engine
 * Hybrid Web Audio synthesis and General MIDI SoundFont sample playback.
 * 49 distinct instrument configurations across 7 categories.
 */

import { INSTRUMENT_PRESETS, getInstrumentPreset } from "./instrument-library.js";
import { soundfontLoader } from "./soundfont-loader.js";
import { MasterChain } from "./effects.js";
import { midiToFrequency } from "../config/keyboard-map.js";

// Legacy ID mapping for backwards compatibility
const LEGACY_ID_MAP = {
    "acoustic": "concert-grand",
    "electric": "electric-piano-1",
    "organ": "drawbar-organ",
    "synth": "synth-bass-1",
    "soft_piano": "grand-piano-1"
};

// Distortion curves cache
let softDistortionCurve = null;
let hardDistortionCurve = null;

function getDistortionCurve(type = "soft") {
    if (type === "hard" && hardDistortionCurve) return hardDistortionCurve;
    if (type === "soft" && softDistortionCurve) return softDistortionCurve;

    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const amount = type === "hard" ? 65 : 22;
    const deg = Math.PI / 180;

    for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    if (type === "hard") hardDistortionCurve = curve;
    else softDistortionCurve = curve;

    return curve;
}

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterChain = null;
        this.currentInstrument = "concert-grand";
        this.volume = 0.75;
        this.isMuted = false;
        this.sustain = false;
        this.a4Tuning = 440; // Standard A4 calibration

        this.activeVoices = new Map(); // midi -> Voice
        this.sustainBuffer = new Set(); // midi notes held by sustain pedal
        this.instrumentChangeListeners = new Set();
    }

    /**
     * Lazy audio context initialization triggered by user gesture
     */
    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx({
                latencyHint: "interactive"
            });
            this.masterChain = new MasterChain(this.ctx);
            this.masterChain.setMasterVolume(this.isMuted ? 0 : this.volume);
            soundfontLoader.setAudioContext(this.ctx);
        }

        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }

        return this.ctx;
    }

    addInstrumentChangeListener(fn) {
        this.instrumentChangeListeners.add(fn);
    }

    removeInstrumentChangeListener(fn) {
        this.instrumentChangeListeners.delete(fn);
    }

    setInstrument(instrumentId) {
        const resolvedId = LEGACY_ID_MAP[instrumentId] || instrumentId;
        const preset = getInstrumentPreset(resolvedId);

        if (preset) {
            this.currentInstrument = preset.id;

            if (this.masterChain && preset.reverbSend !== undefined) {
                this.masterChain.setReverbAmount(preset.reverbSend);
            }

            // Attempt asynchronous on-demand sample loading in background
            if (this.ctx) {
                soundfontLoader.loadInstrument(preset).catch(() => {});
            }

            this.instrumentChangeListeners.forEach(fn => {
                try { fn(preset); } catch {}
            });
        }
    }

    getInstrument(customId = null) {
        const id = customId || this.currentInstrument;
        const resolvedId = LEGACY_ID_MAP[id] || id;
        return getInstrumentPreset(resolvedId);
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.masterChain && !this.isMuted) {
            this.masterChain.setMasterVolume(this.volume);
        }
    }

    setMute(muted) {
        this.isMuted = !!muted;
        if (this.masterChain) {
            this.masterChain.setMasterVolume(this.isMuted ? 0 : this.volume);
        }
    }

    setSustain(active) {
        this.sustain = !!active;
        if (!this.sustain) {
            // Release notes held in sustain buffer
            this.sustainBuffer.forEach(midi => {
                this.stopNote(midi, true);
            });
            this.sustainBuffer.clear();
        }
    }

    setA4Tuning(freq) {
        this.a4Tuning = Number(freq) || 440;
    }

    /**
     * Start playing a note with MIDI number and velocity (0.0 to 1.0)
     */
    playNote(midi, velocity = 0.8, instrumentId = null) {
        this.initContext();
        if (this.isMuted) return null;

        // If note already active, stop old instance cleanly
        if (this.activeVoices.has(midi)) {
            this.stopNote(midi, true);
        }

        const profile = this.getInstrument(instrumentId);

        // Voice stealing if maximum polyphony exceeded
        if (this.activeVoices.size >= profile.polyphony) {
            const oldestMidi = this.activeVoices.keys().next().value;
            this.stopNote(oldestMidi, true);
        }

        const now = this.ctx.currentTime;
        const fundamentalFreq = midiToFrequency(midi, this.a4Tuning);
        const voiceNodes = [];
        const oscillators = [];

        // Check if SoundFont sample buffer is available
        const sampleData = soundfontLoader.getSampleBuffer(profile.gmName, midi);

        // Voice output gain
        const voiceGain = this.ctx.createGain();
        voiceGain.gain.setValueAtTime(0.0001, now);

        // Low-pass Filter for velocity & pitch tracking
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";

        const velMultiplier = 0.4 + (velocity * 0.6);
        const filterCutoff = Math.min(18000, profile.filterCutoffBase * (1 + (midi / 60)) * velMultiplier);
        filter.frequency.setValueAtTime(filterCutoff, now);
        filter.Q.setValueAtTime(profile.filterQ || 1.0, now);

        // Envelope filter sweep (Synth bass, synth leads, clavinet)
        if (profile.filterCutoffPeak) {
            const peakCutoff = Math.min(18000, profile.filterCutoffPeak * velMultiplier);
            filter.frequency.setValueAtTime(profile.filterCutoffBase || 800, now);
            filter.frequency.exponentialRampToValueAtTime(peakCutoff, now + (profile.attack || 0.01) + 0.03);
            filter.frequency.exponentialRampToValueAtTime(
                Math.max(100, profile.filterCutoffBase * 1.2),
                now + (profile.attack || 0.01) + 0.03 + (profile.filterDecay || 0.8)
            );
        }

        // Stereo Panning (spatial spread)
        let panner = null;
        if (typeof this.ctx.createStereoPanner === "function") {
            panner = this.ctx.createStereoPanner();
            panner.pan.setValueAtTime(MasterChain.getStereoPanForMidi(midi), now);
        }

        // Connect filter & voice nodes
        voiceGain.connect(filter);
        voiceNodes.push(voiceGain, filter);

        let finalNode = filter;

        // Optional Drive / Distortion (Overdriven Guitar, Distortion Guitar, Rock Organ)
        if (profile.drive) {
            try {
                const shaper = this.ctx.createWaveShaper();
                shaper.curve = getDistortionCurve(profile.drive > 0.6 ? "hard" : "soft");
                shaper.oversample = "2x";
                finalNode.connect(shaper);
                finalNode = shaper;
                voiceNodes.push(shaper);
            } catch {}
        }

        // Connect to master chain (via panner if supported)
        if (panner) {
            finalNode.connect(panner);
            panner.connect(this.masterChain.inputGain);
            voiceNodes.push(panner);
        } else {
            finalNode.connect(this.masterChain.inputGain);
        }

        let sourceNode = null;

        // -----------------------------------------------------------------
        // PATH A: SAMPLE-BASED PLAYBACK (General MIDI SoundFont buffer)
        // -----------------------------------------------------------------
        if (sampleData && sampleData.buffer) {
            sourceNode = this.ctx.createBufferSource();
            sourceNode.buffer = sampleData.buffer;
            sourceNode.playbackRate.setValueAtTime(sampleData.playbackRate || 1.0, now);

            sourceNode.connect(voiceGain);
            sourceNode.start(now);
            oscillators.push(sourceNode);

            // Sample envelope
            const peakGain = 0.8 * velMultiplier * (profile.volume || 1.0);
            voiceGain.gain.setValueAtTime(0.0001, now);
            voiceGain.gain.linearRampToValueAtTime(peakGain, now + 0.005);
        }
        // -----------------------------------------------------------------
        // PATH B: PHYSICAL SYNTHESIS (Dedicated instrument modeling)
        // -----------------------------------------------------------------
        else {
            // Hammer strike / Key click transient (Acoustic Grands, Organ, Bass slap)
            if (profile.hammerNoise) {
                this.createHammerTransient(now, voiceGain, midi, velocity);
            }

            // Synthesizer voice vs Multi-Harmonic Physical Model
            if (profile.waveType) {
                this.createSynthVoice(now, fundamentalFreq, profile, voiceGain, oscillators);
            } else {
                this.createHarmonicVoice(now, fundamentalFreq, profile, velocity, voiceGain, oscillators);
            }

            // Vibrato LFO (Violin, Viola, Cello)
            if (profile.vibrato) {
                this.createVibratoLfo(now, fundamentalFreq, profile, oscillators);
            }

            // Tremolo LFO (Electric Piano, Vibraphone, Tremolo Strings)
            if (profile.tremolo) {
                this.createTremoloLfo(now, profile, voiceGain, oscillators);
            }

            // ADSR Envelope
            const peakGain = 0.28 * velMultiplier * (profile.volume || 1.0);
            const attackTime = profile.attack || 0.01;
            const decayTime = profile.decay || 2.5;
            const sustainLvl = Math.max(0.0005, peakGain * profile.sustainLevel);

            voiceGain.gain.setValueAtTime(0.0001, now);
            voiceGain.gain.linearRampToValueAtTime(peakGain, now + attackTime);
            voiceGain.gain.exponentialRampToValueAtTime(sustainLvl, now + attackTime + decayTime);
        }

        const voice = {
            midi,
            velocity,
            startTime: now,
            oscillators,
            voiceGain,
            voiceNodes,
            sourceNode,
            released: false,
            profile
        };

        this.activeVoices.set(midi, voice);
        return voice;
    }

    /**
     * Additive harmonic generation with realistic dispersion
     */
    createHarmonicVoice(now, baseFreq, profile, velocity, voiceGain, oscillators) {
        const inharm = profile.inharmonicity || 0.0;
        const detuneCents = profile.detuneCents || 0;

        profile.harmonics.forEach((h, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "sine";

            // Inharmonicity formula: f_n = n * f_0 * sqrt(1 + B * n^2)
            const n = h.mult;
            const inharmFactor = inharm > 0 ? Math.sqrt(1 + inharm * n * n) : 1.0;
            const freq = baseFreq * n * inharmFactor;

            if (freq > 20000) return; // Prevent Nyquist aliasing

            osc.frequency.setValueAtTime(freq, now);

            if (detuneCents > 0) {
                osc.detune.setValueAtTime((index % 2 === 0 ? 1 : -1) * detuneCents, now);
            }

            const harmonicLevel = h.gain * (1 - (index * 0.08 * (1 - velocity)));
            gain.gain.setValueAtTime(Math.max(0.001, harmonicLevel), now);

            osc.connect(gain);
            gain.connect(voiceGain);

            osc.start(now);
            oscillators.push(osc);
        });
    }

    /**
     * Dual-oscillator synth voice generation
     */
    createSynthVoice(now, baseFreq, profile, voiceGain, oscillators) {
        const osc1 = this.ctx.createOscillator();
        osc1.type = profile.waveType || "sawtooth";
        osc1.frequency.setValueAtTime(baseFreq, now);
        osc1.detune.setValueAtTime(profile.detuneCents || 0, now);

        const osc2 = this.ctx.createOscillator();
        osc2.type = profile.subWaveType || "square";
        osc2.frequency.setValueAtTime(baseFreq * (profile.subOctave || 1.0), now);
        osc2.detune.setValueAtTime(-(profile.detuneCents || 0), now);

        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime(profile.subLevel || 0.4, now);

        osc1.connect(voiceGain);
        osc2.connect(subGain);
        subGain.connect(voiceGain);

        osc1.start(now);
        osc2.start(now);
        oscillators.push(osc1, osc2);
    }

    /**
     * Pitch Vibrato LFO for Strings
     */
    createVibratoLfo(now, baseFreq, profile, oscillators) {
        try {
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();

            lfo.frequency.setValueAtTime(profile.vibratoRate || 5.2, now);
            // Delay vibrato onset slightly for natural acoustic expression
            lfoGain.gain.setValueAtTime(0.001, now);
            lfoGain.gain.linearRampToValueAtTime(baseFreq * (profile.vibratoDepth || 0.12) * 0.05, now + 0.25);

            oscillators.forEach(targetOsc => {
                if (targetOsc.frequency) {
                    lfo.connect(lfoGain);
                    lfoGain.connect(targetOsc.frequency);
                }
            });

            lfo.start(now);
            oscillators.push(lfo);
        } catch {}
    }

    /**
     * Tremolo Amplitude LFO for E-Piano, Vibraphone, Organ
     */
    createTremoloLfo(now, profile, voiceGain, oscillators) {
        try {
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();

            lfo.frequency.setValueAtTime(profile.tremoloRate || 5.0, now);
            lfoGain.gain.setValueAtTime(profile.tremoloDepth || 0.2, now);

            lfo.connect(lfoGain);
            lfoGain.connect(voiceGain.gain);

            lfo.start(now);
            oscillators.push(lfo);
        } catch {}
    }

    /**
     * Percussive attack noise transient burst
     */
    createHammerTransient(now, targetGain, midi, velocity) {
        try {
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.015);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = "bandpass";
            noiseFilter.frequency.setValueAtTime(800 + midi * 10, now);
            noiseFilter.Q.setValueAtTime(2.0, now);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.05 * velocity, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(targetGain);

            noise.start(now);
            noise.stop(now + 0.016);
        } catch {}
    }

    /**
     * Release note with graceful envelope decay
     */
    stopNote(midi, force = false) {
        if (!this.ctx) return;

        if (this.sustain && !force) {
            this.sustainBuffer.add(midi);
            return;
        }

        const voice = this.activeVoices.get(midi);
        if (!voice || voice.released) return;

        voice.released = true;
        this.sustainBuffer.delete(midi);

        const now = this.ctx.currentTime;
        const profile = voice.profile || this.getInstrument();
        const releaseTime = profile.release || 0.4;

        try {
            voice.voiceGain.gain.cancelScheduledValues(now);
            voice.voiceGain.gain.setValueAtTime(voice.voiceGain.gain.value, now);
            voice.voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

            setTimeout(() => {
                voice.oscillators.forEach(osc => {
                    try { osc.stop(); } catch {}
                    try { osc.disconnect(); } catch {}
                });
                voice.voiceNodes.forEach(node => {
                    try { node.disconnect(); } catch {}
                });
            }, Math.ceil((releaseTime + 0.1) * 1000));
        } catch {}

        this.activeVoices.delete(midi);
    }

    /**
     * Audition an instrument with an automated arpeggio
     */
    previewInstrument(instrumentId) {
        this.initContext();
        const chord = [60, 64, 67, 72]; // C - E - G - C
        chord.forEach((midi, idx) => {
            setTimeout(() => {
                this.playNote(midi, 0.85, instrumentId);
                setTimeout(() => {
                    this.stopNote(midi, true);
                }, 500);
            }, idx * 160);
        });
    }

    /**
     * Emergency mute / stop all active voices
     */
    stopAll() {
        this.activeVoices.forEach((_, midi) => {
            this.stopNote(midi, true);
        });
        this.activeVoices.clear();
        this.sustainBuffer.clear();
    }
}

// Global Audio Engine Instance
export const audioEngine = new AudioEngine();
