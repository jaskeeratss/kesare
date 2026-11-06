/**
 * KESARE Piano Studio — Precision Web Audio Metronome
 * Lookahead audio clock scheduling, anti-drift resync, tap tempo, and multi-sound presets.
 */

import { audioEngine } from "../audio/audio-engine.js";

export function getTempoName(bpm) {
    if (bpm < 60) return "Largo";
    if (bpm < 76) return "Adagio";
    if (bpm < 108) return "Andante";
    if (bpm < 120) return "Moderato";
    if (bpm < 168) return "Allegro";
    if (bpm < 200) return "Presto";
    return "Prestissimo";
}

export class StudioMetronome {
    constructor() {
        this.bpm = 100;
        this.beatsPerBar = 4;
        this.soundType = "woodblock"; // 'woodblock', 'beep', 'classic'
        this.volume = 0.85;

        this.isRunning = false;
        this.currentBeat = 0;
        this.nextBeatTime = 0.0;
        this.timerId = null;

        // Tap tempo history
        this.tapTimes = [];

        // Callbacks
        this.onBeatTick = null; // (beatNumber, isDownbeat)
        this.onStateChange = null; // ()
    }

    setBpm(newBpm) {
        this.bpm = Math.max(30, Math.min(280, Math.round(newBpm)));
        if (this.onStateChange) this.onStateChange();
    }

    setTimeSignature(beats) {
        this.beatsPerBar = Math.max(1, Math.min(12, Number(beats) || 4));
        this.currentBeat = 0;
        if (this.onStateChange) this.onStateChange();
    }

    setSoundType(type) {
        this.soundType = type;
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
    }

    tap() {
        const now = performance.now();
        this.tapTimes.push(now);

        // Keep last 5 taps
        if (this.tapTimes.length > 5) {
            this.tapTimes.shift();
        }

        if (this.tapTimes.length >= 2) {
            const intervals = [];
            for (let i = 1; i < this.tapTimes.length; i++) {
                const diff = this.tapTimes[i] - this.tapTimes[i - 1];
                if (diff < 2500 && diff > 150) {
                    intervals.push(diff);
                }
            }

            if (intervals.length > 0) {
                const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
                const calculatedBpm = Math.round(60000 / avgInterval);
                this.setBpm(calculatedBpm);
            }
        }
    }

    async start() {
        if (this.isRunning) return;

        const ctx = audioEngine.initContext();
        if (ctx.state === "suspended") {
            try {
                await ctx.resume();
            } catch (err) {
                console.warn("AudioContext resume error in metronome:", err);
            }
        }

        this.isRunning = true;
        this.currentBeat = 0;
        // Schedule first beat slightly in the future
        this.nextBeatTime = ctx.currentTime + 0.05;

        this.scheduler();
        if (this.onStateChange) this.onStateChange();
    }

    stop() {
        this.isRunning = false;
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        this.currentBeat = 0;
        if (this.onStateChange) this.onStateChange();
    }

    toggle() {
        if (this.isRunning) this.stop();
        else this.start();
    }

    scheduler() {
        if (!this.isRunning) return;

        const ctx = audioEngine.ctx;
        if (!ctx) return;

        // Anti-drift resync: If nextBeatTime lagged behind currentTime (e.g. background tab or CPU spike)
        if (this.nextBeatTime < ctx.currentTime) {
            this.nextBeatTime = ctx.currentTime + 0.02;
        }

        const scheduleAheadTime = 0.12; // Schedule 120ms ahead

        while (this.nextBeatTime < ctx.currentTime + scheduleAheadTime) {
            this.scheduleBeat(this.currentBeat, this.nextBeatTime);
            this.advanceBeat();
        }

        this.timerId = setTimeout(() => this.scheduler(), 25);
    }

    advanceBeat() {
        const secondsPerBeat = 60.0 / this.bpm;
        this.nextBeatTime += secondsPerBeat;
        this.currentBeat = (this.currentBeat + 1) % this.beatsPerBar;
    }

    scheduleBeat(beatNumber, time) {
        const ctx = audioEngine.ctx;
        if (!ctx) return;

        const isDownbeat = beatNumber === 0;
        // Ensure playTime is strictly >= current time to prevent AudioParam negative ramp errors
        const playTime = Math.max(ctx.currentTime + 0.002, time);

        // Visual notification synchronized to Web Audio clock
        const timeUntilBeat = Math.max(0, (playTime - ctx.currentTime) * 1000);
        setTimeout(() => {
            if (this.isRunning && this.onBeatTick) {
                this.onBeatTick(beatNumber, isDownbeat);
            }
        }, timeUntilBeat);

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const peakVol = (isDownbeat ? 0.95 : 0.75) * this.volume;

            if (this.soundType === "woodblock") {
                // Resonant acoustic woodblock with pitch drop
                osc.type = "sine";
                const startFreq = isDownbeat ? 1800 : 1250;
                const endFreq = isDownbeat ? 950 : 650;
                const dur = isDownbeat ? 0.065 : 0.045;

                osc.frequency.setValueAtTime(startFreq, playTime);
                osc.frequency.exponentialRampToValueAtTime(endFreq, playTime + dur);

                gain.gain.setValueAtTime(0.0001, playTime);
                gain.gain.linearRampToValueAtTime(peakVol, playTime + 0.002);
                gain.gain.exponentialRampToValueAtTime(0.0001, playTime + dur);

                osc.connect(gain);
                gain.connect(audioEngine.masterChain.inputGain);

                osc.start(playTime);
                osc.stop(playTime + dur + 0.01);
            } else if (this.soundType === "beep") {
                // High digital quartz beep
                osc.type = "sine";
                const freq = isDownbeat ? 1760 : 880; // A6 or A5
                const dur = isDownbeat ? 0.08 : 0.05;

                osc.frequency.setValueAtTime(freq, playTime);

                gain.gain.setValueAtTime(0.0001, playTime);
                gain.gain.linearRampToValueAtTime(peakVol * 0.8, playTime + 0.003);
                gain.gain.exponentialRampToValueAtTime(0.0001, playTime + dur);

                osc.connect(gain);
                gain.connect(audioEngine.masterChain.inputGain);

                osc.start(playTime);
                osc.stop(playTime + dur + 0.01);
            } else {
                // Classic mechanical metronome click (high-transient triangle)
                osc.type = "triangle";
                const freq = isDownbeat ? 2400 : 1500;
                const dur = isDownbeat ? 0.045 : 0.03;

                osc.frequency.setValueAtTime(freq, playTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.4, playTime + dur);

                gain.gain.setValueAtTime(0.0001, playTime);
                gain.gain.linearRampToValueAtTime(peakVol, playTime + 0.001);
                gain.gain.exponentialRampToValueAtTime(0.0001, playTime + dur);

                osc.connect(gain);
                gain.connect(audioEngine.masterChain.inputGain);

                osc.start(playTime);
                osc.stop(playTime + dur + 0.01);
            }

            // Cleanup nodes after playing
            osc.onended = () => {
                try {
                    osc.disconnect();
                    gain.disconnect();
                } catch {}
            };
        } catch (err) {
            console.warn("Metronome beat scheduling error:", err);
        }
    }
}
