/**
 * KESARE Piano Studio — Studio Effects & Master Signal Chain
 * Convolver Reverb, Master Compressor/Limiter, and Stereo Spatialization.
 */

/**
 * Generate an algorithmic impulse response buffer for warm studio room acoustics
 */
export function createReverbImpulse(context, durationSeconds = 2.2, decayRate = 2.5, sampleRate = 44100) {
    const length = Math.floor(sampleRate * durationSeconds);
    const impulse = context.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        // Exponential decay envelope with high-frequency absorption
        const envelope = Math.exp(-decayRate * t);
        // Stereo decorrelation using subtle phase variance
        left[i] = (Math.random() * 2 - 1) * envelope;
        right[i] = (Math.random() * 2 - 1) * envelope;
    }

    return impulse;
}

/**
 * Create Master Bus with Reverb Send and Limiter / Compressor
 */
export class MasterChain {
    constructor(context) {
        this.ctx = context;

        // Master Gain
        this.inputGain = this.ctx.createGain();
        this.inputGain.gain.value = 1.0;

        // Limiter / Dynamics Compressor to prevent clipping
        this.limiter = this.ctx.createDynamicsCompressor();
        this.limiter.threshold.setValueAtTime(-1.5, this.ctx.currentTime);
        this.limiter.knee.setValueAtTime(6.0, this.ctx.currentTime);
        this.limiter.ratio.setValueAtTime(12.0, this.ctx.currentTime);
        this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.limiter.release.setValueAtTime(0.12, this.ctx.currentTime);

        // Master Volume Gain
        this.masterVolume = this.ctx.createGain();
        this.masterVolume.gain.value = 0.75;

        // Analyser Node for Visualizer
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.82;

        // Reverb Convolver & Reverb Return Gain
        this.convolver = this.ctx.createConvolver();
        this.convolver.buffer = createReverbImpulse(this.ctx, 2.0, 2.8, this.ctx.sampleRate);

        this.reverbReturn = this.ctx.createGain();
        this.reverbReturn.gain.value = 0.3;

        this.reverbSend = this.ctx.createGain();
        this.reverbSend.gain.value = 0.3;

        // Dry Bus
        this.dryGain = this.ctx.createGain();
        this.dryGain.gain.value = 0.85;

        // Routing:
        // Input -> DryGain -> Limiter -> MasterVolume -> Analyser -> Destination
        // Input -> ReverbSend -> Convolver -> ReverbReturn -> Limiter
        this.inputGain.connect(this.dryGain);
        this.dryGain.connect(this.limiter);

        this.inputGain.connect(this.reverbSend);
        this.reverbSend.connect(this.convolver);
        this.convolver.connect(this.reverbReturn);
        this.reverbReturn.connect(this.limiter);

        this.limiter.connect(this.masterVolume);
        this.masterVolume.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
    }

    setMasterVolume(val, rampTime = 0.03) {
        const clamped = Math.max(0, Math.min(1, val));
        this.masterVolume.gain.setTargetAtTime(clamped, this.ctx.currentTime, rampTime);
    }

    setReverbAmount(val) {
        const clamped = Math.max(0, Math.min(1, val));
        this.reverbReturn.gain.setTargetAtTime(clamped * 0.7, this.ctx.currentTime, 0.05);
    }

    /**
     * Stereo pan position (-1 to 1) based on keyboard position (MIDI 21 to 108)
     */
    static getStereoPanForMidi(midi, minMidi = 36, maxMidi = 96) {
        const normalized = (midi - minMidi) / (maxMidi - minMidi);
        // Low notes slightly left (-0.35), high notes slightly right (+0.35)
        return (normalized * 0.7) - 0.35;
    }
}

