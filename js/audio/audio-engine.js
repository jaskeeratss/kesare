/**
 * KESARE Piano Studio — Professional Audio Engine
 * High-performance Web Audio API synthesis engine with polyphonic voice management.
 */

import { INSTRUMENTS } from "./sound-profiles.js";
import { MasterChain } from "./effects.js";
import { midiToFrequency } from "../config/keyboard-map.js";

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterChain = null;
        this.currentInstrument = "acoustic";
        this.volume = 0.75;
        this.isMuted = false;
        this.sustain = false;
        this.a4Tuning = 440; // Standard A4 calibration

        this.activeVoices = new Map(); // midi -> Voice
        this.sustainBuffer = new Set(); // midi notes held by sustain pedal
        this.onStateChangeCallbacks = [];
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
        }

        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }

        return this.ctx;
    }

    setInstrument(instrumentId) {
        if (INSTRUMENTS[instrumentId]) {
            this.currentInstrument = instrumentId;
            const profile = INSTRUMENTS[instrumentId];
            if (this.masterChain && profile.reverbSend !== undefined) {
                this.masterChain.setReverbAmount(profile.reverbSend);
            }
        }
    }

    getInstrument() {
        return INSTRUMENTS[this.currentInstrument] || INSTRUMENTS.acoustic;
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
    playNote(midi, velocity = 0.8) {
        this.initContext();
        if (this.isMuted) return null;

        // If note already active, stop old instance cleanly
        if (this.activeVoices.has(midi)) {
            this.stopNote(midi, true);
        }

        // Voice stealing if maximum polyphony exceeded
        const profile = this.getInstrument();
        if (this.activeVoices.size >= profile.polyphony) {
            const oldestMidi = this.activeVoices.keys().next().value;
            this.stopNote(oldestMidi, true);
        }

        const now = this.ctx.currentTime;
        const fundamentalFreq = midiToFrequency(midi, this.a4Tuning);
        const voiceNodes = [];
        const oscillators = [];

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

        // Stereo Panning (spatial spread)
        let panner = null;
        if (typeof this.ctx.createStereoPanner === "function") {
            panner = this.ctx.createStereoPanner();
            panner.pan.setValueAtTime(MasterChain.getStereoPanForMidi(midi), now);
        }

        // Connect signal path: VoiceGain -> Filter -> (Panner) -> Master Chain
        if (panner) {
            voiceGain.connect(filter);
            filter.connect(panner);
            panner.connect(this.masterChain.inputGain);
            voiceNodes.push(panner);
        } else {
            voiceGain.connect(filter);
            filter.connect(this.masterChain.inputGain);
        }
        voiceNodes.push(voiceGain, filter);

        // Hammer strike / Key click transient (Acoustic / Organ)
        if (profile.hammerNoise) {
            this.createHammerTransient(now, voiceGain, midi, velocity);
        }

        // Synthesize Harmonics
        if (profile.id === "synth") {
            // Dual oscillator subtractive synth
            this.createSynthVoice(now, fundamentalFreq, profile, voiceGain, oscillators);
        } else {
            // Additive harmonic synthesis with physical inharmonicity
            this.createHarmonicVoice(now, fundamentalFreq, profile, velocity, voiceGain, oscillators);
        }

        // Envelope: Attack -> Decay -> Sustain
        const peakGain = 0.28 * velMultiplier;
        const attackTime = profile.attack || 0.01;
        const decayTime = profile.decay || 2.5;
        const sustainLvl = Math.max(0.0005, peakGain * profile.sustainLevel);

        voiceGain.gain.linearRampToValueAtTime(peakGain, now + attackTime);
        voiceGain.gain.exponentialRampToValueAtTime(sustainLvl, now + attackTime + decayTime);

        const voice = {
            midi,
            velocity,
            startTime: now,
            oscillators,
            voiceGain,
            voiceNodes,
            released: false
        };

        this.activeVoices.set(midi, voice);
        return voice;
    }

    /**
     * Additive harmonic generation with realistic dispersion
     */
    createHarmonicVoice(now, baseFreq, profile, velocity, voiceGain, oscillators) {
        const inharm = profile.inharmonicity || 0.0;

        profile.harmonics.forEach((h, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "sine";

            // Inharmonicity formula: f_n = n * f_0 * sqrt(1 + B * n^2)
            const n = h.mult;
            const inharmFactor = inharm > 0 ? Math.sqrt(1 + inharm * n * n) : 1.0;
            const freq = baseFreq * n * inharmFactor;

            if (freq > 20000) return; // Avoid aliasing beyond Nyquist

            osc.frequency.setValueAtTime(freq, now);

            // High harmonics decay faster
            const harmonicLevel = h.gain * (1 - (index * 0.08 * (1 - velocity)));
            gain.gain.setValueAtTime(Math.max(0.001, harmonicLevel), now);

            osc.connect(gain);
            gain.connect(voiceGain);

            osc.start(now);
            oscillators.push(osc);
        });
    }

    /**
     * Poly-synth voice generation
     */
    createSynthVoice(now, baseFreq, profile, voiceGain, oscillators) {
        // Oscillator 1: Sawtooth
        const osc1 = this.ctx.createOscillator();
        osc1.type = profile.waveType || "sawtooth";
        osc1.frequency.setValueAtTime(baseFreq, now);
        osc1.detune.setValueAtTime(profile.detuneCents || 0, now);

        // Oscillator 2: Sub/Detuned
        const osc2 = this.ctx.createOscillator();
        osc2.type = profile.subWaveType || "square";
        osc2.frequency.setValueAtTime(baseFreq, now);
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
     * Percussive hammer transient burst
     */
    createHammerTransient(now, targetGain, midi, velocity) {
        try {
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.015); // 15ms burst
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
        } catch {
            // Fallback gracefully
        }
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
        const profile = this.getInstrument();
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
