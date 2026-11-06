/**
 * KESARE Piano Studio — Comprehensive Instrument Library
 * 49 Distinct Instruments across 7 General MIDI Categories.
 * Supports both on-demand SoundFont sample loading and high-fidelity physical synthesis.
 */

export const INSTRUMENT_CATEGORIES = [
    { id: "piano", name: "PIANO", icon: "🎹", description: "Acoustic concert grands, uprights, and vintage honky-tonk" },
    { id: "epiano", name: "ELECTRIC PIANO", icon: "⚡", description: "Rhodes, Wurlitzer, FM DX-7, and vintage electro-acoustic" },
    { id: "keys", name: "KEYS", icon: "🎼", description: "Harpsichord, clavinet, celesta, and tuned percussive keys" },
    { id: "organ", name: "ORGAN", icon: "⛪", description: "Tonewheel drawbars, cathedral pipe organs, and rock B3" },
    { id: "guitar", name: "GUITAR", icon: "🎸", description: "Acoustic nylon/steel, jazz electric, clean, and overdriven" },
    { id: "bass", name: "BASS", icon: "🎻", description: "Acoustic upright, electric fingered/picked, slap, and synth bass" },
    { id: "strings", name: "STRINGS", icon: "🎻", description: "Solo violin, cello, orchestral harp, tremolo, and string ensemble" }
];

export const INSTRUMENT_PRESETS = [
    // =========================================================================
    // 1. PIANO CATEGORY (5 Instruments)
    // =========================================================================
    {
        id: "concert-grand",
        name: "Concert Grand Piano",
        category: "piano",
        gmProgram: 0,
        gmName: "acoustic_grand_piano",
        description: "Full 9-foot concert grand with rich acoustic inharmonicity and soundboard depth.",
        volume: 1.0,
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
        inharmonicity: 0.00022,
        hammerNoise: true,
        filterCutoffBase: 4400,
        filterQ: 1.2,
        reverbSend: 0.3
    },
    {
        id: "grand-piano-1",
        name: "Grand Piano 1",
        category: "piano",
        gmProgram: 0,
        gmName: "acoustic_grand_piano",
        description: "Warm, balanced European studio grand piano with mellow dynamics.",
        volume: 1.0,
        polyphony: 32,
        attack: 0.008,
        decay: 3.2,
        sustainLevel: 0.04,
        release: 0.4,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.48, decayMult: 0.8 },
            { mult: 3, gain: 0.22, decayMult: 0.6 },
            { mult: 4, gain: 0.1, decayMult: 0.4 }
        ],
        inharmonicity: 0.00018,
        hammerNoise: true,
        filterCutoffBase: 3800,
        filterQ: 1.0,
        reverbSend: 0.32
    },
    {
        id: "grand-piano-2",
        name: "Grand Piano 2",
        category: "piano",
        gmProgram: 1,
        gmName: "bright_acoustic_piano",
        description: "Modern Japanese studio grand with punchy transient attack and clear projection.",
        volume: 1.0,
        polyphony: 32,
        attack: 0.004,
        decay: 3.6,
        sustainLevel: 0.06,
        release: 0.45,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.65, decayMult: 0.9 },
            { mult: 3, gain: 0.35, decayMult: 0.75 },
            { mult: 4, gain: 0.2, decayMult: 0.55 },
            { mult: 5, gain: 0.1, decayMult: 0.4 }
        ],
        inharmonicity: 0.00025,
        hammerNoise: true,
        filterCutoffBase: 5800,
        filterQ: 1.4,
        reverbSend: 0.25
    },
    {
        id: "bright-acoustic-piano",
        name: "Bright Acoustic Piano",
        category: "piano",
        gmProgram: 1,
        gmName: "bright_acoustic_piano",
        description: "Brilliant pop and rock acoustic piano that cuts effortlessly through any mix.",
        volume: 1.05,
        polyphony: 32,
        attack: 0.003,
        decay: 3.0,
        sustainLevel: 0.08,
        release: 0.35,
        harmonics: [
            { mult: 1, gain: 0.9, decayMult: 1.0 },
            { mult: 2, gain: 0.8, decayMult: 0.9 },
            { mult: 3, gain: 0.5, decayMult: 0.8 },
            { mult: 4, gain: 0.3, decayMult: 0.6 },
            { mult: 5, gain: 0.18, decayMult: 0.5 },
            { mult: 6, gain: 0.09, decayMult: 0.4 }
        ],
        inharmonicity: 0.0003,
        hammerNoise: true,
        filterCutoffBase: 7500,
        filterQ: 1.5,
        reverbSend: 0.22
    },
    {
        id: "honky-tonk-piano",
        name: "Honky-Tonk Piano",
        category: "piano",
        gmProgram: 3,
        gmName: "honkytonk_piano",
        description: "Vintage saloon upright piano with dual detuned strings and metallic hammer tack.",
        volume: 0.95,
        polyphony: 28,
        attack: 0.004,
        decay: 2.6,
        sustainLevel: 0.06,
        release: 0.3,
        detuneCents: 9, // Detuned unison strings
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.7, decayMult: 0.8 },
            { mult: 3, gain: 0.45, decayMult: 0.6 },
            { mult: 4, gain: 0.25, decayMult: 0.4 }
        ],
        inharmonicity: 0.0004,
        hammerNoise: true,
        filterCutoffBase: 6500,
        filterQ: 2.0,
        reverbSend: 0.35
    },

    // =========================================================================
    // 2. ELECTRIC PIANO CATEGORY (5 Instruments)
    // =========================================================================
    {
        id: "electric-grand",
        name: "Electric Grand Piano",
        category: "epiano",
        gmProgram: 2,
        gmName: "electric_grand_piano",
        description: "Yamaha CP-70 electro-acoustic grand with string pick-ups and punchy presence.",
        volume: 1.0,
        polyphony: 28,
        attack: 0.008,
        decay: 2.8,
        sustainLevel: 0.12,
        release: 0.35,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.55, decayMult: 0.75 },
            { mult: 3, gain: 0.25, decayMult: 0.5 },
            { mult: 4, gain: 0.12, decayMult: 0.35 }
        ],
        filterCutoffBase: 4800,
        filterQ: 1.0,
        reverbSend: 0.3
    },
    {
        id: "electric-piano-1",
        name: "Electric Piano 1 (Rhodes-style)",
        category: "epiano",
        gmProgram: 4,
        gmName: "electric_piano_1",
        description: "Classic vintage Mark I Rhodes tine tone with bell chime overtone and warm stereo tremolo.",
        volume: 1.0,
        polyphony: 24,
        attack: 0.012,
        decay: 2.8,
        sustainLevel: 0.18,
        release: 0.4,
        tremolo: true,
        tremoloRate: 4.8,
        tremoloDepth: 0.22,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.6, decayMult: 0.7 },
            { mult: 3, gain: 0.18, decayMult: 0.4 },
            { mult: 7, gain: 0.14, decayMult: 0.15 }, // Bell overtone
            { mult: 8, gain: 0.08, decayMult: 0.1 }
        ],
        filterCutoffBase: 3600,
        filterQ: 0.8,
        reverbSend: 0.35
    },
    {
        id: "electric-piano-2",
        name: "Electric Piano 2 (DX-style)",
        category: "epiano",
        gmProgram: 5,
        gmName: "electric_piano_2",
        description: "Yamaha DX7 crystal FM electric piano with crisp, glassy chime attack and lush sustain.",
        volume: 0.95,
        polyphony: 24,
        attack: 0.005,
        decay: 3.2,
        sustainLevel: 0.22,
        release: 0.45,
        harmonics: [
            { mult: 1, gain: 0.8, decayMult: 1.0 },
            { mult: 2, gain: 0.3, decayMult: 0.8 },
            { mult: 3, gain: 0.65, decayMult: 0.6 }, // Strong 3rd
            { mult: 5, gain: 0.35, decayMult: 0.4 },
            { mult: 7, gain: 0.25, decayMult: 0.25 },
            { mult: 9, gain: 0.15, decayMult: 0.15 }
        ],
        filterCutoffBase: 6800,
        filterQ: 1.5,
        reverbSend: 0.4
    },
    {
        id: "electric-piano-3",
        name: "Electric Piano 3",
        category: "epiano",
        gmProgram: 4,
        gmName: "electric_piano_1",
        description: "Warm Wurlitzer 200A reed electric piano with rich bark dynamics and soft drive.",
        volume: 1.0,
        polyphony: 24,
        attack: 0.015,
        decay: 2.4,
        sustainLevel: 0.15,
        release: 0.3,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.45, decayMult: 0.8 },
            { mult: 3, gain: 0.35, decayMult: 0.5 },
            { mult: 4, gain: 0.15, decayMult: 0.3 }
        ],
        tremolo: true,
        tremoloRate: 5.5,
        tremoloDepth: 0.15,
        filterCutoffBase: 3200,
        filterQ: 1.0,
        reverbSend: 0.3
    },
    {
        id: "clavinet-ep",
        name: "Clavinet-style Electric Piano",
        category: "epiano",
        gmProgram: 7,
        gmName: "clavinet",
        description: "Funky electro-mechanical keyboard with snappy rubber pad pluck and bright resonance.",
        volume: 1.05,
        polyphony: 24,
        attack: 0.003,
        decay: 0.8,
        sustainLevel: 0.08,
        release: 0.12,
        harmonics: [
            { mult: 1, gain: 0.7, decayMult: 1.0 },
            { mult: 2, gain: 0.9, decayMult: 0.85 },
            { mult: 3, gain: 0.6, decayMult: 0.7 },
            { mult: 4, gain: 0.4, decayMult: 0.5 },
            { mult: 5, gain: 0.25, decayMult: 0.35 }
        ],
        filterCutoffBase: 4200,
        filterQ: 3.5,
        reverbSend: 0.15
    },

    // =========================================================================
    // 3. KEYS CATEGORY (8 Instruments)
    // =========================================================================
    {
        id: "harpsichord",
        name: "Harpsichord",
        category: "keys",
        gmProgram: 6,
        gmName: "harpsichord",
        description: "Baroque plucking quill instrument with rich metallic partials and rapid acoustic decay.",
        volume: 0.95,
        polyphony: 32,
        attack: 0.003,
        decay: 1.2,
        sustainLevel: 0.05,
        release: 0.2,
        harmonics: [
            { mult: 1, gain: 0.8, decayMult: 1.0 },
            { mult: 2, gain: 0.85, decayMult: 0.8 },
            { mult: 3, gain: 0.7, decayMult: 0.6 },
            { mult: 4, gain: 0.5, decayMult: 0.4 },
            { mult: 5, gain: 0.35, decayMult: 0.3 },
            { mult: 6, gain: 0.2, decayMult: 0.2 }
        ],
        filterCutoffBase: 8000,
        filterQ: 1.5,
        reverbSend: 0.35
    },
    {
        id: "clavinet",
        name: "Clavinet",
        category: "keys",
        gmProgram: 7,
        gmName: "clavinet",
        description: "Iconic Hohner D6 clavinet for funk, soul, and reggae with sharp percussive bite.",
        volume: 1.05,
        polyphony: 24,
        attack: 0.002,
        decay: 0.5,
        sustainLevel: 0.02,
        release: 0.08,
        harmonics: [
            { mult: 1, gain: 0.6, decayMult: 1.0 },
            { mult: 2, gain: 1.0, decayMult: 0.8 },
            { mult: 3, gain: 0.7, decayMult: 0.6 },
            { mult: 4, gain: 0.5, decayMult: 0.4 }
        ],
        filterCutoffBase: 5000,
        filterQ: 4.0,
        reverbSend: 0.18
    },
    {
        id: "celesta",
        name: "Celesta",
        category: "keys",
        gmProgram: 8,
        gmName: "celesta",
        description: "Magical struck steel plate keyboard (Dance of the Sugar Plum Fairy) with pure bell sustain.",
        volume: 0.95,
        polyphony: 24,
        attack: 0.006,
        decay: 2.2,
        sustainLevel: 0.12,
        release: 0.5,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.4, decayMult: 0.7 },
            { mult: 4, gain: 0.15, decayMult: 0.4 }
        ],
        filterCutoffBase: 7000,
        filterQ: 1.2,
        reverbSend: 0.45
    },
    {
        id: "music-box",
        name: "Music Box",
        category: "keys",
        gmProgram: 10,
        gmName: "music_box",
        description: "Delicate tuned metallic comb teeth with crystal-clear high ping and gentle chime sustain.",
        volume: 0.9,
        polyphony: 20,
        attack: 0.002,
        decay: 1.8,
        sustainLevel: 0.08,
        release: 0.4,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.5, decayMult: 0.7 },
            { mult: 3, gain: 0.25, decayMult: 0.4 }
        ],
        filterCutoffBase: 9000,
        filterQ: 1.8,
        reverbSend: 0.4
    },
    {
        id: "vibraphone",
        name: "Vibraphone",
        category: "keys",
        gmProgram: 11,
        gmName: "vibraphone",
        description: "Tuned aluminium bars struck with yarn mallets, featuring motorized rotating butterfly tremolo.",
        volume: 1.0,
        polyphony: 24,
        attack: 0.01,
        decay: 3.5,
        sustainLevel: 0.2,
        release: 0.6,
        tremolo: true,
        tremoloRate: 5.2,
        tremoloDepth: 0.25,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 4, gain: 0.25, decayMult: 0.3 }
        ],
        filterCutoffBase: 4800,
        filterQ: 1.0,
        reverbSend: 0.38
    },
    {
        id: "marimba",
        name: "Marimba",
        category: "keys",
        gmProgram: 12,
        gmName: "marimba",
        description: "Rich rosewood acoustic bars with resonator pipes producing a warm, resonant wooden tone.",
        volume: 1.1,
        polyphony: 24,
        attack: 0.008,
        decay: 1.4,
        sustainLevel: 0.03,
        release: 0.25,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 4, gain: 0.18, decayMult: 0.3 },
            { mult: 10, gain: 0.08, decayMult: 0.1 }
        ],
        filterCutoffBase: 2400,
        filterQ: 1.2,
        reverbSend: 0.3
    },
    {
        id: "xylophone",
        name: "Xylophone",
        category: "keys",
        gmProgram: 13,
        gmName: "xylophone",
        description: "Bright hardwood bars struck with hard plastic mallets, cutting with high acoustic sharpness.",
        volume: 1.05,
        polyphony: 24,
        attack: 0.003,
        decay: 0.4,
        sustainLevel: 0.01,
        release: 0.1,
        harmonics: [
            { mult: 1, gain: 0.9, decayMult: 1.0 },
            { mult: 3, gain: 0.6, decayMult: 0.5 },
            { mult: 6, gain: 0.2, decayMult: 0.2 }
        ],
        filterCutoffBase: 7000,
        filterQ: 2.2,
        reverbSend: 0.2
    },
    {
        id: "glockenspiel",
        name: "Glockenspiel",
        category: "keys",
        gmProgram: 9,
        gmName: "glockenspiel",
        description: "Orchestral steel bells with a piercing, luminous chime and ringing upper resonance.",
        volume: 0.9,
        polyphony: 20,
        attack: 0.002,
        decay: 2.5,
        sustainLevel: 0.1,
        release: 0.5,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2.76, gain: 0.3, decayMult: 0.5 },
            { mult: 5.4, gain: 0.15, decayMult: 0.3 }
        ],
        filterCutoffBase: 10000,
        filterQ: 2.0,
        reverbSend: 0.45
    },

    // =========================================================================
    // 4. ORGAN CATEGORY (7 Instruments)
    // =========================================================================
    {
        id: "drawbar-organ",
        name: "Drawbar Organ",
        category: "organ",
        gmProgram: 16,
        gmName: "drawbar_organ",
        description: "Hammond tonewheel organ with standard jazz/soul drawbar configuration and key click.",
        volume: 0.95,
        polyphony: 28,
        attack: 0.015,
        decay: 0.08,
        sustainLevel: 0.88,
        release: 0.12,
        hammerNoise: true,
        harmonics: [
            { mult: 0.5, gain: 0.4, decayMult: 1.0 },
            { mult: 1.0, gain: 0.9, decayMult: 1.0 },
            { mult: 1.5, gain: 0.35, decayMult: 1.0 },
            { mult: 2.0, gain: 0.5, decayMult: 1.0 },
            { mult: 3.0, gain: 0.25, decayMult: 1.0 },
            { mult: 4.0, gain: 0.2, decayMult: 1.0 }
        ],
        filterCutoffBase: 5500,
        filterQ: 1.0,
        reverbSend: 0.3
    },
    {
        id: "percussive-organ",
        name: "Percussive Organ",
        category: "organ",
        gmProgram: 17,
        gmName: "percussive_organ",
        description: "Tonewheel organ with distinct 2nd-harmonic percussive punch at note attack.",
        volume: 1.0,
        polyphony: 28,
        attack: 0.005,
        decay: 0.15,
        sustainLevel: 0.75,
        release: 0.1,
        hammerNoise: true,
        harmonics: [
            { mult: 1.0, gain: 0.85, decayMult: 1.0 },
            { mult: 2.0, gain: 0.7, decayMult: 0.4 }, // Percussive decay
            { mult: 3.0, gain: 0.3, decayMult: 1.0 },
            { mult: 4.0, gain: 0.2, decayMult: 1.0 }
        ],
        filterCutoffBase: 6000,
        filterQ: 1.5,
        reverbSend: 0.28
    },
    {
        id: "rock-organ",
        name: "Rock Organ",
        category: "organ",
        gmProgram: 18,
        gmName: "rock_organ",
        description: "Aggressive full-drawbar Hammond with fast rotary speaker chorus and subtle tube grit.",
        volume: 1.0,
        polyphony: 24,
        attack: 0.01,
        decay: 0.05,
        sustainLevel: 0.95,
        release: 0.15,
        tremolo: true,
        tremoloRate: 6.2,
        tremoloDepth: 0.18,
        harmonics: [
            { mult: 0.5, gain: 0.6, decayMult: 1.0 },
            { mult: 1.0, gain: 1.0, decayMult: 1.0 },
            { mult: 1.5, gain: 0.5, decayMult: 1.0 },
            { mult: 2.0, gain: 0.8, decayMult: 1.0 },
            { mult: 3.0, gain: 0.4, decayMult: 1.0 },
            { mult: 4.0, gain: 0.5, decayMult: 1.0 },
            { mult: 6.0, gain: 0.3, decayMult: 1.0 }
        ],
        filterCutoffBase: 6500,
        filterQ: 1.4,
        reverbSend: 0.35
    },
    {
        id: "church-organ",
        name: "Church Organ",
        category: "organ",
        gmProgram: 19,
        gmName: "church_organ",
        description: "Cathedral pipe organ with majestic multi-rank mixture pipes and immense sacred hall resonance.",
        volume: 0.95,
        polyphony: 28,
        attack: 0.04,
        decay: 0.1,
        sustainLevel: 0.92,
        release: 0.5,
        harmonics: [
            { mult: 0.5, gain: 0.5, decayMult: 1.0 }, // 16'
            { mult: 1.0, gain: 0.85, decayMult: 1.0 },// 8'
            { mult: 2.0, gain: 0.6, decayMult: 1.0 }, // 4'
            { mult: 3.0, gain: 0.35, decayMult: 1.0 },// 2 2/3'
            { mult: 4.0, gain: 0.4, decayMult: 1.0 }, // 2'
            { mult: 5.0, gain: 0.2, decayMult: 1.0 }, // 1 3/5'
            { mult: 8.0, gain: 0.15, decayMult: 1.0 }  // 1'
        ],
        filterCutoffBase: 5000,
        filterQ: 0.9,
        reverbSend: 0.55 // Deep cathedral reverb
    },
    {
        id: "reed-organ",
        name: "Reed Organ",
        category: "organ",
        gmProgram: 20,
        gmName: "reed_organ",
        description: "Traditional pump harmonium / accordina with warm, vibrating brass reeds.",
        volume: 0.95,
        polyphony: 24,
        attack: 0.03,
        decay: 0.1,
        sustainLevel: 0.85,
        release: 0.2,
        harmonics: [
            { mult: 1.0, gain: 0.8, decayMult: 1.0 },
            { mult: 2.0, gain: 0.5, decayMult: 1.0 },
            { mult: 3.0, gain: 0.3, decayMult: 1.0 }
        ],
        filterCutoffBase: 3800,
        filterQ: 1.2,
        reverbSend: 0.3
    },
    {
        id: "pipe-organ",
        name: "Pipe Organ",
        category: "organ",
        gmProgram: 19,
        gmName: "church_organ",
        description: "Classical Baroque tracker pipe organ with pure flue pipes and brilliant harmonic mixtures.",
        volume: 0.95,
        polyphony: 28,
        attack: 0.025,
        decay: 0.08,
        sustainLevel: 0.9,
        release: 0.4,
        harmonics: [
            { mult: 1.0, gain: 0.9, decayMult: 1.0 },
            { mult: 2.0, gain: 0.6, decayMult: 1.0 },
            { mult: 3.0, gain: 0.4, decayMult: 1.0 },
            { mult: 4.0, gain: 0.3, decayMult: 1.0 }
        ],
        filterCutoffBase: 5400,
        filterQ: 1.1,
        reverbSend: 0.5
    },
    {
        id: "hammond-organ",
        name: "Hammond-style Organ",
        category: "organ",
        gmProgram: 16,
        gmName: "drawbar_organ",
        description: "Vintage B3 console with Jimmy Smith style registration and warm scanner vibrato.",
        volume: 0.95,
        polyphony: 28,
        attack: 0.012,
        decay: 0.06,
        sustainLevel: 0.88,
        release: 0.12,
        hammerNoise: true,
        tremolo: true,
        tremoloRate: 4.6,
        tremoloDepth: 0.12,
        harmonics: [
            { mult: 0.5, gain: 0.35, decayMult: 1.0 },
            { mult: 1.0, gain: 0.9, decayMult: 1.0 },
            { mult: 1.5, gain: 0.3, decayMult: 1.0 },
            { mult: 2.0, gain: 0.6, decayMult: 1.0 },
            { mult: 4.0, gain: 0.25, decayMult: 1.0 }
        ],
        filterCutoffBase: 5200,
        filterQ: 1.0,
        reverbSend: 0.32
    },

    // =========================================================================
    // 5. GUITAR CATEGORY (8 Instruments)
    // =========================================================================
    {
        id: "nylon-guitar",
        name: "Nylon String Guitar",
        category: "guitar",
        gmProgram: 24,
        gmName: "acoustic_guitar_nylon",
        description: "Classical acoustic guitar with intimate, warm nylon strings and wooden body resonance.",
        volume: 1.05,
        polyphony: 24,
        attack: 0.006,
        decay: 2.0,
        sustainLevel: 0.04,
        release: 0.3,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.45, decayMult: 0.7 },
            { mult: 3, gain: 0.2, decayMult: 0.45 },
            { mult: 4, gain: 0.08, decayMult: 0.3 }
        ],
        filterCutoffBase: 2600,
        filterQ: 1.2,
        reverbSend: 0.28
    },
    {
        id: "steel-guitar",
        name: "Steel String Guitar",
        category: "guitar",
        gmProgram: 25,
        gmName: "acoustic_guitar_steel",
        description: "Folk dreadnought guitar with bright, ringing bronze steel strings and crisp pick strumming.",
        volume: 1.05,
        polyphony: 24,
        attack: 0.004,
        decay: 2.4,
        sustainLevel: 0.05,
        release: 0.35,
        harmonics: [
            { mult: 1, gain: 0.9, decayMult: 1.0 },
            { mult: 2, gain: 0.7, decayMult: 0.8 },
            { mult: 3, gain: 0.45, decayMult: 0.6 },
            { mult: 4, gain: 0.25, decayMult: 0.45 },
            { mult: 5, gain: 0.15, decayMult: 0.3 }
        ],
        filterCutoffBase: 5200,
        filterQ: 1.6,
        reverbSend: 0.26
    },
    {
        id: "jazz-guitar",
        name: "Jazz Electric Guitar",
        category: "guitar",
        gmProgram: 26,
        gmName: "electric_guitar_jazz",
        description: "Hollow-body archtop electric guitar with smooth neck humbucker and warm rolled-off tone.",
        volume: 1.0,
        polyphony: 20,
        attack: 0.008,
        decay: 2.2,
        sustainLevel: 0.08,
        release: 0.3,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.38, decayMult: 0.7 },
            { mult: 3, gain: 0.12, decayMult: 0.4 }
        ],
        filterCutoffBase: 1800,
        filterQ: 0.9,
        reverbSend: 0.32
    },
    {
        id: "clean-guitar",
        name: "Clean Electric Guitar",
        category: "guitar",
        gmProgram: 27,
        gmName: "electric_guitar_clean",
        description: "Fender Stratocaster single-coil tone with crystalline high-end snap and funk clarity.",
        volume: 1.05,
        polyphony: 20,
        attack: 0.004,
        decay: 2.5,
        sustainLevel: 0.1,
        release: 0.35,
        harmonics: [
            { mult: 1, gain: 0.95, decayMult: 1.0 },
            { mult: 2, gain: 0.65, decayMult: 0.8 },
            { mult: 3, gain: 0.35, decayMult: 0.55 },
            { mult: 4, gain: 0.2, decayMult: 0.4 }
        ],
        filterCutoffBase: 4200,
        filterQ: 1.8,
        reverbSend: 0.3
    },
    {
        id: "muted-guitar",
        name: "Muted Electric Guitar",
        category: "guitar",
        gmProgram: 28,
        gmName: "electric_guitar_muted",
        description: "Palm-muted electric rhythm guitar with a chunky, percussive thud and short sustain.",
        volume: 1.1,
        polyphony: 20,
        attack: 0.003,
        decay: 0.15,
        sustainLevel: 0.01,
        release: 0.06,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.4, decayMult: 0.5 },
            { mult: 3, gain: 0.15, decayMult: 0.2 }
        ],
        filterCutoffBase: 2400,
        filterQ: 2.5,
        reverbSend: 0.15
    },
    {
        id: "overdriven-guitar",
        name: "Overdriven Guitar",
        category: "guitar",
        gmProgram: 29,
        gmName: "overdriven_guitar",
        description: "Classic rock tube-amp overdrive with warm saturation, harmonic singing sustain, and bite.",
        volume: 0.9,
        polyphony: 16,
        attack: 0.01,
        decay: 3.0,
        sustainLevel: 0.45,
        release: 0.3,
        drive: 0.45, // Soft saturation
        harmonics: [
            { mult: 1, gain: 0.8, decayMult: 1.0 },
            { mult: 2, gain: 0.6, decayMult: 0.9 },
            { mult: 3, gain: 0.45, decayMult: 0.8 },
            { mult: 4, gain: 0.3, decayMult: 0.7 }
        ],
        filterCutoffBase: 3800,
        filterQ: 2.2,
        reverbSend: 0.35
    },
    {
        id: "distortion-guitar",
        name: "Distortion Guitar",
        category: "guitar",
        gmProgram: 30,
        gmName: "distortion_guitar",
        description: "Heavy metal high-gain distortion with aggressive clipping harmonics and massive sustain.",
        volume: 0.85,
        polyphony: 16,
        attack: 0.008,
        decay: 3.5,
        sustainLevel: 0.65,
        release: 0.35,
        drive: 0.85, // Heavy distortion
        harmonics: [
            { mult: 1, gain: 0.7, decayMult: 1.0 },
            { mult: 2, gain: 0.6, decayMult: 0.9 },
            { mult: 3, gain: 0.55, decayMult: 0.85 },
            { mult: 4, gain: 0.4, decayMult: 0.75 },
            { mult: 5, gain: 0.3, decayMult: 0.7 }
        ],
        filterCutoffBase: 4200,
        filterQ: 3.0,
        reverbSend: 0.38
    },
    {
        id: "guitar-harmonics",
        name: "Harmonics Guitar",
        category: "guitar",
        gmProgram: 31,
        gmName: "guitar_harmonics",
        description: "Pure bell-like guitar string natural pinch harmonics sounding one octave higher.",
        volume: 0.95,
        polyphony: 20,
        attack: 0.005,
        decay: 2.5,
        sustainLevel: 0.08,
        release: 0.4,
        harmonics: [
            { mult: 2, gain: 1.0, decayMult: 1.0 },
            { mult: 4, gain: 0.5, decayMult: 0.7 },
            { mult: 6, gain: 0.25, decayMult: 0.4 }
        ],
        filterCutoffBase: 6500,
        filterQ: 1.5,
        reverbSend: 0.4
    },

    // =========================================================================
    // 6. BASS CATEGORY (8 Instruments)
    // =========================================================================
    {
        id: "acoustic-bass",
        name: "Acoustic Bass",
        category: "bass",
        gmProgram: 32,
        gmName: "acoustic_bass",
        description: "Warm, wooden upright double bass with deep acoustic chamber resonance and fingerboard click.",
        volume: 1.15,
        polyphony: 16,
        attack: 0.015,
        decay: 1.8,
        sustainLevel: 0.08,
        release: 0.25,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.5, decayMult: 0.6 },
            { mult: 3, gain: 0.15, decayMult: 0.3 }
        ],
        filterCutoffBase: 1200,
        filterQ: 1.4,
        reverbSend: 0.25
    },
    {
        id: "fingered-bass",
        name: "Fingered Electric Bass",
        category: "bass",
        gmProgram: 33,
        gmName: "electric_bass_finger",
        description: "Standard Fender Jazz/Precision bass played with fingers, delivering solid punchy low-mids.",
        volume: 1.15,
        polyphony: 16,
        attack: 0.01,
        decay: 2.2,
        sustainLevel: 0.12,
        release: 0.25,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.6, decayMult: 0.7 },
            { mult: 3, gain: 0.25, decayMult: 0.4 },
            { mult: 4, gain: 0.08, decayMult: 0.25 }
        ],
        filterCutoffBase: 1600,
        filterQ: 1.2,
        reverbSend: 0.2
    },
    {
        id: "picked-bass",
        name: "Picked Electric Bass",
        category: "bass",
        gmProgram: 34,
        gmName: "electric_bass_pick",
        description: "Electric bass struck with a heavy plectrum, featuring aggressive metallic pick attack.",
        volume: 1.15,
        polyphony: 16,
        attack: 0.005,
        decay: 2.0,
        sustainLevel: 0.1,
        release: 0.25,
        harmonics: [
            { mult: 1, gain: 0.9, decayMult: 1.0 },
            { mult: 2, gain: 0.7, decayMult: 0.8 },
            { mult: 3, gain: 0.4, decayMult: 0.6 },
            { mult: 4, gain: 0.2, decayMult: 0.4 }
        ],
        filterCutoffBase: 2600,
        filterQ: 1.8,
        reverbSend: 0.2
    },
    {
        id: "fretless-bass",
        name: "Fretless Bass",
        category: "bass",
        gmProgram: 35,
        gmName: "fretless_bass",
        description: "Jaco Pastorius style fretless bass with iconic blooming midrange 'mwah' tone and smooth sustain.",
        volume: 1.1,
        polyphony: 16,
        attack: 0.02,
        decay: 2.5,
        sustainLevel: 0.18,
        release: 0.35,
        harmonics: [
            { mult: 1, gain: 0.9, decayMult: 1.0 },
            { mult: 2, gain: 0.75, decayMult: 0.85 },
            { mult: 3, gain: 0.35, decayMult: 0.5 }
        ],
        filterCutoffBase: 1900,
        filterQ: 2.0,
        reverbSend: 0.3
    },
    {
        id: "slap-bass-1",
        name: "Slap Bass 1",
        category: "bass",
        gmProgram: 36,
        gmName: "slap_bass_1",
        description: "Funk thumb-slap bass with a percussive woody attack transient and deep low-end thump.",
        volume: 1.2,
        polyphony: 16,
        attack: 0.003,
        decay: 1.2,
        sustainLevel: 0.05,
        release: 0.15,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.8, decayMult: 0.7 },
            { mult: 3, gain: 0.4, decayMult: 0.4 },
            { mult: 4, gain: 0.2, decayMult: 0.2 }
        ],
        filterCutoffBase: 3500,
        filterQ: 2.5,
        reverbSend: 0.18
    },
    {
        id: "slap-bass-2",
        name: "Slap Bass 2",
        category: "bass",
        gmProgram: 37,
        gmName: "slap_bass_2",
        description: "Popped treble slap bass with a cutting high-frequency snap and sharp resonance.",
        volume: 1.15,
        polyphony: 16,
        attack: 0.002,
        decay: 0.9,
        sustainLevel: 0.03,
        release: 0.12,
        harmonics: [
            { mult: 1, gain: 0.7, decayMult: 1.0 },
            { mult: 2, gain: 0.9, decayMult: 0.8 },
            { mult: 3, gain: 0.6, decayMult: 0.6 },
            { mult: 4, gain: 0.35, decayMult: 0.4 }
        ],
        filterCutoffBase: 4800,
        filterQ: 3.0,
        reverbSend: 0.2
    },
    {
        id: "synth-bass-1",
        name: "Synth Bass 1",
        category: "bass",
        gmProgram: 38,
        gmName: "synth_bass_1",
        description: "Classic analog Minimoog bass with punchy 24dB resonant lowpass envelope filter sweep.",
        volume: 1.05,
        polyphony: 16,
        attack: 0.008,
        decay: 1.4,
        sustainLevel: 0.35,
        release: 0.2,
        waveType: "sawtooth",
        subWaveType: "square",
        detuneCents: 6,
        subLevel: 0.6,
        filterCutoffBase: 600,
        filterCutoffPeak: 4500,
        filterQ: 4.5,
        filterDecay: 0.8,
        reverbSend: 0.15
    },
    {
        id: "synth-bass-2",
        name: "Synth Bass 2",
        category: "bass",
        gmProgram: 39,
        gmName: "synth_bass_2",
        description: "Tight acid electro bass with hollow sub-octave square wave and snappy decay.",
        volume: 1.05,
        polyphony: 16,
        attack: 0.005,
        decay: 0.8,
        sustainLevel: 0.2,
        release: 0.15,
        waveType: "square",
        subWaveType: "triangle",
        subLevel: 0.8,
        filterCutoffBase: 800,
        filterCutoffPeak: 3800,
        filterQ: 3.5,
        filterDecay: 0.5,
        reverbSend: 0.18
    },

    // =========================================================================
    // 7. STRINGS CATEGORY (8 Instruments)
    // =========================================================================
    {
        id: "violin",
        name: "Violin",
        category: "strings",
        gmProgram: 40,
        gmName: "violin",
        description: "Solo concert violin with delicate bow attack, rich overtone body, and expressive vibrato.",
        volume: 0.95,
        polyphony: 24,
        attack: 0.06,
        decay: 0.15,
        sustainLevel: 0.85,
        release: 0.35,
        vibrato: true,
        vibratoRate: 5.6,
        vibratoDepth: 0.14,
        harmonics: [
            { mult: 1, gain: 0.85, decayMult: 1.0 },
            { mult: 2, gain: 0.7, decayMult: 1.0 },
            { mult: 3, gain: 0.45, decayMult: 1.0 },
            { mult: 4, gain: 0.3, decayMult: 1.0 },
            { mult: 5, gain: 0.2, decayMult: 1.0 }
        ],
        filterCutoffBase: 5000,
        filterQ: 1.4,
        reverbSend: 0.38
    },
    {
        id: "viola",
        name: "Viola",
        category: "strings",
        gmProgram: 41,
        gmName: "viola",
        description: "Mellow alto bowed orchestral string with warm wooden mid-range body resonance.",
        volume: 0.95,
        polyphony: 24,
        attack: 0.07,
        decay: 0.18,
        sustainLevel: 0.85,
        release: 0.4,
        vibrato: true,
        vibratoRate: 5.2,
        vibratoDepth: 0.12,
        harmonics: [
            { mult: 1, gain: 0.9, decayMult: 1.0 },
            { mult: 2, gain: 0.6, decayMult: 1.0 },
            { mult: 3, gain: 0.35, decayMult: 1.0 },
            { mult: 4, gain: 0.18, decayMult: 1.0 }
        ],
        filterCutoffBase: 3800,
        filterQ: 1.2,
        reverbSend: 0.4
    },
    {
        id: "cello",
        name: "Cello",
        category: "strings",
        gmProgram: 42,
        gmName: "cello",
        description: "Deep, lyrical solo violoncello with expressive bowed warmth and rich harmonic resonance.",
        volume: 1.0,
        polyphony: 24,
        attack: 0.08,
        decay: 0.2,
        sustainLevel: 0.88,
        release: 0.45,
        vibrato: true,
        vibratoRate: 4.8,
        vibratoDepth: 0.12,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.55, decayMult: 1.0 },
            { mult: 3, gain: 0.25, decayMult: 1.0 },
            { mult: 4, gain: 0.12, decayMult: 1.0 }
        ],
        filterCutoffBase: 2800,
        filterQ: 1.2,
        reverbSend: 0.42
    },
    {
        id: "contrabass",
        name: "Contrabass",
        category: "strings",
        gmProgram: 43,
        gmName: "contrabass",
        description: "Low orchestral double bass with heavy horsehair bow drag and powerful sub-bass foundation.",
        volume: 1.1,
        polyphony: 20,
        attack: 0.1,
        decay: 0.25,
        sustainLevel: 0.9,
        release: 0.5,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.45, decayMult: 1.0 },
            { mult: 3, gain: 0.18, decayMult: 1.0 }
        ],
        filterCutoffBase: 1600,
        filterQ: 1.1,
        reverbSend: 0.4
    },
    {
        id: "tremolo-strings",
        name: "Tremolo Strings",
        category: "strings",
        gmProgram: 44,
        gmName: "tremolo_strings",
        description: "Rapidly fluttering orchestral bow strokes creating dramatic cinematic suspense.",
        volume: 0.95,
        polyphony: 24,
        attack: 0.04,
        decay: 0.1,
        sustainLevel: 0.9,
        release: 0.4,
        tremolo: true,
        tremoloRate: 9.2, // Rapid tremolo bow
        tremoloDepth: 0.4,
        harmonics: [
            { mult: 1, gain: 0.9, decayMult: 1.0 },
            { mult: 2, gain: 0.65, decayMult: 1.0 },
            { mult: 3, gain: 0.4, decayMult: 1.0 }
        ],
        filterCutoffBase: 4200,
        filterQ: 1.2,
        reverbSend: 0.45
    },
    {
        id: "pizzicato-strings",
        name: "Pizzicato Strings",
        category: "strings",
        gmProgram: 45,
        gmName: "pizzicato_strings",
        description: "Orchestral string section plucked with fingertips, delivering crisp, buoyant, staccato notes.",
        volume: 1.1,
        polyphony: 24,
        attack: 0.003,
        decay: 0.45,
        sustainLevel: 0.01,
        release: 0.15,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.45, decayMult: 0.5 },
            { mult: 3, gain: 0.18, decayMult: 0.3 }
        ],
        filterCutoffBase: 3600,
        filterQ: 1.8,
        reverbSend: 0.3
    },
    {
        id: "orchestral-harp",
        name: "Orchestral Harp",
        category: "strings",
        gmProgram: 46,
        gmName: "orchestral_harp",
        description: "Concert pedal harp with warm plucked gut strings, delicate crystalline attack, and blooming decay.",
        volume: 1.05,
        polyphony: 28,
        attack: 0.006,
        decay: 3.2,
        sustainLevel: 0.06,
        release: 0.55,
        harmonics: [
            { mult: 1, gain: 1.0, decayMult: 1.0 },
            { mult: 2, gain: 0.5, decayMult: 0.75 },
            { mult: 3, gain: 0.22, decayMult: 0.5 },
            { mult: 4, gain: 0.1, decayMult: 0.35 }
        ],
        filterCutoffBase: 4400,
        filterQ: 1.2,
        reverbSend: 0.45
    },
    {
        id: "string-ensemble",
        name: "String Ensemble",
        category: "strings",
        gmProgram: 48,
        gmName: "string_ensemble_1",
        description: "Lush multi-instrument symphonic string section with rich stereo detuned chorus.",
        volume: 0.95,
        polyphony: 32,
        attack: 0.09,
        decay: 0.2,
        sustainLevel: 0.92,
        release: 0.6,
        detuneCents: 8,
        harmonics: [
            { mult: 1, gain: 0.8, decayMult: 1.0 },
            { mult: 2, gain: 0.65, decayMult: 1.0 },
            { mult: 3, gain: 0.4, decayMult: 1.0 },
            { mult: 4, gain: 0.25, decayMult: 1.0 }
        ],
        filterCutoffBase: 4800,
        filterQ: 1.0,
        reverbSend: 0.52
    }
];

export function getInstrumentPreset(id) {
    return INSTRUMENT_PRESETS.find(p => p.id === id) || INSTRUMENT_PRESETS[0];
}

export function getInstrumentsByCategory(categoryId) {
    return INSTRUMENT_PRESETS.filter(p => p.category === categoryId);
}

