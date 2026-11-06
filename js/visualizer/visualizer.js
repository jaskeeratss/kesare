/**
 * KESARE Piano Studio — High-Performance Audio Visualizer
 * Real-time Web Audio AnalyserNode rendering (Spectrum Bars & Oscilloscope Waveform).
 */

import { audioEngine } from "../audio/audio-engine.js";

export class AudioVisualizer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement ? canvasElement.getContext("2d") : null;
        this.mode = "bars"; // 'bars' | 'wave'
        this.isRunning = false;
        this.animationId = null;

        this.freqData = null;
        this.timeData = null;
        this.idleFrames = 0;
    }

    init() {
        if (!this.canvas) return;
        this.resize();
        window.addEventListener("resize", () => this.resize());
        this.start();
    }

    setMode(mode) {
        this.mode = mode;
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = Math.max(200, Math.floor(rect.width * dpr));
        this.canvas.height = Math.max(80, Math.floor(rect.height * dpr));
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.loop();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    loop() {
        if (!this.isRunning) return;
        this.render();
        this.animationId = requestAnimationFrame(() => this.loop());
    }

    render() {
        if (!this.canvas || !this.ctx) return;
        const analyser = audioEngine.masterChain ? audioEngine.masterChain.analyser : null;

        const width = this.canvas.width;
        const height = this.canvas.height;
        this.ctx.clearRect(0, 0, width, height);

        if (!analyser) {
            this.renderIdlePlaceholder(width, height);
            return;
        }

        if (!this.freqData) {
            this.freqData = new Uint8Array(analyser.frequencyBinCount);
            this.timeData = new Uint8Array(analyser.fftSize);
        }

        if (this.mode === "bars") {
            this.renderSpectrumBars(analyser, width, height);
        } else {
            this.renderWaveform(analyser, width, height);
        }
    }

    renderSpectrumBars(analyser, width, height) {
        analyser.getByteFrequencyData(this.freqData);

        // Check if signal has energy
        let totalEnergy = 0;
        const barCount = 48;
        const barWidth = width / barCount;
        const binStep = Math.floor(this.freqData.length / (barCount * 1.8));

        // Create vibrant studio gradient
        const gradient = this.ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, "rgba(53, 224, 193, 0.2)");
        gradient.addColorStop(0.6, "rgba(53, 224, 193, 0.85)");
        gradient.addColorStop(1, "rgba(146, 116, 255, 1.0)");

        this.ctx.fillStyle = gradient;

        for (let i = 0; i < barCount; i++) {
            const binIndex = Math.min(this.freqData.length - 1, i * binStep);
            const val = this.freqData[binIndex] / 255;
            totalEnergy += val;

            const barHeight = Math.max(3, val * height * 0.9);
            const x = i * barWidth;
            const y = height - barHeight;

            // Rounded top bar
            const radius = 2;
            const w = barWidth - 2;

            this.ctx.beginPath();
            this.ctx.moveTo(x, height);
            this.ctx.lineTo(x, y + radius);
            this.ctx.quadraticCurveTo(x, y, x + radius, y);
            this.ctx.lineTo(x + w - radius, y);
            this.ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
            this.ctx.lineTo(x + w, height);
            this.ctx.closePath();
            this.ctx.fill();
        }

        // Idle state indicator when silent
        if (totalEnergy < 0.2) {
            this.renderIdlePlaceholder(width, height);
        }
    }

    renderWaveform(analyser, width, height) {
        analyser.getByteTimeDomainData(this.timeData);

        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = "#35e0c1";
        this.ctx.shadowColor = "#35e0c1";
        this.ctx.shadowBlur = 8;

        this.ctx.beginPath();
        const sliceWidth = width / this.timeData.length;
        let x = 0;

        for (let i = 0; i < this.timeData.length; i++) {
            const v = this.timeData[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }

        this.ctx.stroke();
        this.ctx.shadowBlur = 0; // Reset
    }

    renderIdlePlaceholder(width, height) {
        this.ctx.fillStyle = "rgba(133, 141, 160, 0.25)";
        this.ctx.font = "12px 'DM Sans', sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText("KESARE Real-time Audio Engine Active", width / 2, height / 2 + 4);
    }
}

