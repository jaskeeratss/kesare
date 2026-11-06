/**
 * KESARE Piano Studio — Sound Profiles & Instrument Synthesis Models
 * High-fidelity physical models and synthesizer parameters for Web Audio API.
 */

export const INSTRUMENTS = {
    acoustic: {
        id: "acoustic",
        name: "Acoustic Grand",
        category: "Acoustic",
        description: "Rich concert grand with multi-harmonic inharmonicity, hammer strike, and soundboard resonance.",
        polyphony: 32,
        attack: 0.005,
        decay: 3.5,
        sustainLevel: 0.05,
        release: 0.45,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.55, decayMult: 0.85 },
            { mult: 3, gain: 0.28, decayMult: 0.65 },
            { mult: 4, gain: 0.14, decayMult: 0.45 },
            { mult: 5, gain: 0.07, decayMult: 0.35 },
            { mult: 6, gain: 0.035, decayMult: 0.25 }
        ],
        inharmonicity: 0.0002, // Piano wire stiffness factor
        hammerNoise: true,
        filterCutoffBase: 4200,
        filterQ: 1.2,
        reverbSend: 0.28
    },
    electric: {
        id: "electric",
        name: "Electric Piano",
        category: "Keyboard",
        description: "Classic vintage Rhodes/Wurlitzer tine tone with bell-like attack and mellow sustain.",
        polyphony: 24,
        attack: 0.012,
        decay: 2.8,
        sustainLevel: 0.18,
        release: 0.4,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.6, decayMult: 0.7 },
            { mult: 3, gain: 0.18, decayMult: 0.4 },
            { mult: 7, gain: 0.12, decayMult: 0.15 }, // Bell tine overtone
            { mult: 8, gain: 0.08, decayMult: 0.1 }
        ],
        inharmonicity: 0.0,
        hammerNoise: false,
        tremolo: true,
        tremoloRate: 4.8, // Hz
        tremoloDepth: 0.2,
        filterCutoffBase: 3600,
        filterQ: 0.8,
        reverbSend: 0.35
    },
    organ: {
        id: "organ",
        name: "Drawbar Organ",
        category: "Keyboard",
        description: "Hammond tonewheel organ emulation with authentic drawbars, key click, and constant sustain.",
        polyphony: 28,
        attack: 0.015,
        decay: 0.08,
        sustainLevel: 0.88,
        release: 0.12,
        // Tonewheel drawbar harmonic ratios: 16', 5 1/3', 8', 4', 2 2/3', 2', 1 3/5', 1 1/3', 1'
        harmonics: [
            { mult: 0.5, gain: 0.4, decayMult: 1.0 }, // 16'
            { mult: 1.0, gain: 0.9, decayMult: 1.0 }, // 8' (fundamental)
            { mult: 1.5, gain: 0.35, decayMult: 1.0 },// 5 1/3'
            { mult: 2.0, gain: 0.5, decayMult: 1.0 }, // 4'
            { mult: 3.0, gain: 0.25, decayMult: 1.0 },// 2 2/3'
            { mult: 4.0, gain: 0.2, decayMult: 1.0 }, // 2'
            { mult: 6.0, gain: 0.1, decayMult: 1.0 }  // 1 1/3'
        ],
        inharmonicity: 0.0,
        hammerNoise: true, // Key click transient
        filterCutoffBase: 5500,
        filterQ: 1.0,
        reverbSend: 0.32
    },
    synth: {
        id: "synth",
        name: "Poly Synthesizer",
        category: "Electronic",
        description: "Dual-oscillator subtractive analog poly-synth with 24dB ladder filter sweep and detune chorus.",
        polyphony: 16,
        attack: 0.03,
        decay: 1.8,
        sustainLevel: 0.55,
        release: 0.5,
        waveType: "sawtooth",
        subWaveType: "square",
        detuneCents: 9, // cents detune between osc 1 and 2
        subLevel: 0.45,
        filterCutoffBase: 1800,
        filterCutoffPeak: 6200,
        filterQ: 3.5,
        filterDecay: 1.2,
        reverbSend: 0.4
    },
    soft_piano: {
        id: "soft_piano",
        name: "Soft Felt Piano",
        category: "Acoustic",
        description: "Intimate, warm felt-damped piano with gentle hammer strike and atmospheric room acoustics.",
        polyphony: 32,
        attack: 0.025,
        decay: 3.0,
        sustainLevel: 0.04,
        release: 0.6,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.35, decayMult: 0.8 },
            { mult: 3, gain: 0.12, decayMult: 0.5 },
            { mult: 4, gain: 0.04, decayMult: 0.3 }
        ],
        inharmonicity: 0.0001,
        hammerNoise: false,
        filterCutoffBase: 1600, // Warm lowpass filter
        filterQ: 0.7,
        reverbSend: 0.48 // Deep ambient reverb
    }
};
