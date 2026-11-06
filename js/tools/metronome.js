/**
 * KESARE Piano Studio — Precision Web Audio Metronome
 * Lookahead audio clock scheduling with tap tempo, time signatures, and visual pendulum dots.
 */

import { audioEngine } from "../audio/audio-engine.js";

export class StudioMetronome {
    constructor() {
        this.bpm = 100;
        this.beatsPerBar = 4;
        this.beatSubdivision = 1; // Quarter notes
        this.soundType = "woodblock"; // 'classic', 'woodblock', 'beep'

        this.isRunning = false;
        this.currentBeat = 0;
        this.nextBeatTime = 0.0;
        this.timerId = null;

        // Tap tempo history
        this.tapTimes = [];

        // Callbacks
        this.onBeatTick = null; // (beatNumber, isDownbeat)
        this.onStateChange = null;
    }

    setBpm(newBpm) {
        this.bpm = Math.max(30, Math.min(280, Math.round(newBpm)));
        if (this.onStateChange) this.onStateChange();
    }

    setTimeSignature(beats) {
        this.beatsPerBar = Number(beats) || 4;
        this.currentBeat = 0;
        if (this.onStateChange) this.onStateChange();
    }

    setSoundType(type) {
        this.soundType = type;
    }

    tap() {
        const now = performance.now();
        this.tapTimes.push(now);

        // Keep last 4 taps
        if (this.tapTimes.length > 5) {
            this.tapTimes.shift();
        }

        // Calculate average intervals
        if (this.tapTimes.length >= 2) {
            const intervals = [];
            for (let i = 1; i < this.tapTimes.length; i++) {
                const diff = this.tapTimes[i] - this.tapTimes[i - 1];
                // Ignore taps longer than 2.5 seconds
                if (diff < 2500) {
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

    start() {
        if (this.isRunning) return;
        const ctx = audioEngine.initContext();
        this.isRunning = true;
        this.currentBeat = 0;
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
        const scheduleAheadTime = 0.1; // Schedule 100ms ahead

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
        const isDownbeat = beatNumber === 0;

        // Visual notification synchronized to Web Audio clock
        const timeUntilBeat = Math.max(0, (time - ctx.currentTime) * 1000);
        setTimeout(() => {
            if (this.isRunning && this.onBeatTick) {
                this.onBeatTick(beatNumber, isDownbeat);
            }
        }, timeUntilBeat);

        // Synthesize precision click / woodblock / beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (this.soundType === "woodblock") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(isDownbeat ? 1400 : 980, time);
            osc.frequency.exponentialRampToValueAtTime(isDownbeat ? 800 : 550, time + 0.025);

            gain.gain.setValueAtTime(0.5, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);
            osc.stop(time + 0.04);
        } else if (this.soundType === "beep") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(isDownbeat ? 1760 : 880, time);
            gain.gain.setValueAtTime(0.35, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
            osc.stop(time + 0.075);
        } else {
            // Classic mechanical click
            osc.type = "triangle";
            osc.frequency.setValueAtTime(isDownbeat ? 1200 : 800, time);
            gain.gain.setValueAtTime(0.4, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
            osc.stop(time + 0.025);
        }

        osc.connect(gain);
        gain.connect(audioEngine.masterChain.inputGain);

        osc.start(time);
    }
}

