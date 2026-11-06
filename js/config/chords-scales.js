/**
 * KESARE Piano Studio — Musical Chords, Scales & Progressions Config
 */

export const ROOT_NOTES = [
    { name: "C", pitch: 0 },
    { name: "C♯ / D♭", pitch: 1 },
    { name: "D", pitch: 2 },
    { name: "D♯ / E♭", pitch: 3 },
    { name: "E", pitch: 4 },
    { name: "F", pitch: 5 },
    { name: "F♯ / G♭", pitch: 6 },
    { name: "G", pitch: 7 },
    { name: "G♯ / A♭", pitch: 8 },
    { name: "A", pitch: 9 },
    { name: "A♯ / B♭", pitch: 10 },
    { name: "B", pitch: 11 }
];

export const CHORD_TYPES = [
    {
        id: "maj",
        name: "Major",
        symbol: "",
        intervals: [0, 4, 7],
        formula: "1 - 3 - 5",
        description: "Bright, cheerful, resolved"
    },
    {
        id: "min",
        name: "Minor",
        symbol: "m",
        intervals: [0, 3, 7],
        formula: "1 - ♭3 - 5",
        description: "Sombre, emotional, reflective"
    },
    {
        id: "7",
        name: "Dominant 7th",
        symbol: "7",
        intervals: [0, 4, 7, 10],
        formula: "1 - 3 - 5 - ♭7",
        description: "Bluesy, energetic, driving resolution"
    },
    {
        id: "maj7",
        name: "Major 7th",
        symbol: "maj7",
        intervals: [0, 4, 7, 11],
        formula: "1 - 3 - 5 - 7",
        description: "Dreamy, lush, jazzy, relaxed"
    },
    {
        id: "min7",
        name: "Minor 7th",
        symbol: "m7",
        intervals: [0, 3, 7, 10],
        formula: "1 - ♭3 - 5 - ♭7",
        description: "Smooth, mellow, soulful"
    },
    {
        id: "dim",
        name: "Diminished",
        symbol: "dim",
        intervals: [0, 3, 6],
        formula: "1 - ♭3 - ♭5",
        description: "Tense, unstable, suspenseful"
    },
    {
        id: "dim7",
        name: "Diminished 7th",
        symbol: "dim7",
        intervals: [0, 3, 6, 9],
        formula: "1 - ♭3 - ♭5 - 𝄫7",
        description: "Dramatic tension, classic horror & drama"
    },
    {
        id: "aug",
        name: "Augmented",
        symbol: "aug",
        intervals: [0, 4, 8],
        formula: "1 - 3 - ♯5",
        description: "Mysterious, unresolved, floating"
    },
    {
        id: "sus2",
        name: "Suspended 2nd",
        symbol: "sus2",
        intervals: [0, 2, 7],
        formula: "1 - 2 - 5",
        description: "Open, modern, airy"
    },
    {
        id: "sus4",
        name: "Suspended 4th",
        symbol: "sus4",
        intervals: [0, 5, 7],
        formula: "1 - 4 - 5",
        description: "Anticipatory, anthemic, awaiting resolution"
    },
    {
        id: "add9",
        name: "Add 9",
        symbol: "add9",
        intervals: [0, 4, 7, 14],
        formula: "1 - 3 - 5 - 9",
        description: "Rich, modern acoustic color"
    },
    {
        id: "m7b5",
        name: "Half-Diminished (m7♭5)",
        symbol: "m7♭5",
        intervals: [0, 3, 6, 10],
        formula: "1 - ♭3 - ♭5 - ♭7",
        description: "Complex jazz tension, minor ii chord"
    }
];

export const SCALE_TYPES = [
    {
        id: "major",
        name: "Major (Ionian)",
        intervals: [0, 2, 4, 5, 7, 9, 11],
        formula: "W - W - H - W - W - W - H",
        description: "The fundamental foundation of Western music"
    },
    {
        id: "nat_minor",
        name: "Natural Minor (Aeolian)",
        intervals: [0, 2, 3, 5, 7, 8, 10],
        formula: "W - H - W - W - H - W - W",
        description: "Classic sad, poignant, epic minor tone"
    },
    {
        id: "harm_minor",
        name: "Harmonic Minor",
        intervals: [0, 2, 3, 5, 7, 8, 11],
        formula: "W - H - W - W - H - 1½ - H",
        description: "Exotic, neoclassical, dramatic eastern flavor"
    },
    {
        id: "mel_minor",
        name: "Melodic Minor (Jazz Minor)",
        intervals: [0, 2, 3, 5, 7, 9, 11],
        formula: "W - H - W - W - W - W - H",
        description: "Sophisticated jazz tension and resolution"
    },
    {
        id: "pent_major",
        name: "Major Pentatonic",
        intervals: [0, 2, 4, 7, 9],
        formula: "1 - 2 - 3 - 5 - 6",
        description: "Warm, universally melodic, sweet"
    },
    {
        id: "pent_minor",
        name: "Minor Pentatonic",
        intervals: [0, 3, 5, 7, 10],
        formula: "1 - ♭3 - 4 - 5 - ♭7",
        description: "Rock, blues, funk, essential soloing scale"
    },
    {
        id: "blues",
        name: "Blues Scale",
        intervals: [0, 3, 5, 6, 7, 10],
        formula: "1 - ♭3 - 4 - ♭5 - 5 - ♭7",
        description: "Authentic blues feeling with the iconic blue note"
    },
    {
        id: "dorian",
        name: "Dorian Mode",
        intervals: [0, 2, 3, 5, 7, 9, 10],
        formula: "1 - 2 - ♭3 - 4 - 5 - 6 - ♭7",
        description: "Cool jazz, funk, Santana style minor with major 6th"
    },
    {
        id: "mixolydian",
        name: "Mixolydian Mode",
        intervals: [0, 2, 4, 5, 7, 9, 10],
        formula: "1 - 2 - 3 - 4 - 5 - 6 - ♭7",
        description: "Classic rock, Southern blues, uplifting dominant sound"
    }
];

export const CHORD_PROGRESSIONS = [
    {
        id: "pop_axis",
        name: "Pop 4-Chord Axis",
        roman: "I – V – vi – IV",
        description: "The most famous progression in modern pop history",
        defaultKey: 0, // C
        chords: [
            { degree: "I", rootOffset: 0, type: "maj" },
            { degree: "V", rootOffset: 7, type: "maj" },
            { degree: "vi", rootOffset: 9, type: "min" },
            { degree: "IV", rootOffset: 5, type: "maj" }
        ]
    },
    {
        id: "jazz_ii_v_i",
        name: "Jazz Standard ii – V – I",
        roman: "ii7 – V7 – Imaj7",
        description: "The core cornerstone of jazz harmony and resolution",
        defaultKey: 0, // C
        chords: [
            { degree: "ii7", rootOffset: 2, type: "min7" },
            { degree: "V7", rootOffset: 7, type: "7" },
            { degree: "Imaj7", rootOffset: 0, type: "maj7" },
            { degree: "Imaj7", rootOffset: 0, type: "maj7" }
        ]
    },
    {
        id: "pachelbel",
        name: "Pachelbel's Sequence",
        roman: "I – V – vi – iii – IV – I – IV – V",
        description: "The timeless baroque sequence powering centuries of melody",
        defaultKey: 0, // C
        chords: [
            { degree: "I", rootOffset: 0, type: "maj" },
            { degree: "V", rootOffset: 7, type: "maj" },
            { degree: "vi", rootOffset: 9, type: "min" },
            { degree: "iii", rootOffset: 4, type: "min" },
            { degree: "IV", rootOffset: 5, type: "maj" },
            { degree: "I", rootOffset: 0, type: "maj" },
            { degree: "IV", rootOffset: 5, type: "maj" },
            { degree: "V", rootOffset: 7, type: "maj" }
        ]
    },
    {
        id: "blues_12_bar",
        name: "12-Bar Blues",
        roman: "I7 – IV7 – I7 – V7",
        description: "Standard 12-bar blues cycle with dominant 7th chords",
        defaultKey: 0, // C
        chords: [
            { degree: "I7", rootOffset: 0, type: "7" },
            { degree: "IV7", rootOffset: 5, type: "7" },
            { degree: "I7", rootOffset: 0, type: "7" },
            { degree: "V7", rootOffset: 7, type: "7" }
        ]
    },
    {
        id: "andalusian",
        name: "Andalusian Cadence",
        roman: "i – ♭VII – ♭VI – V",
        description: "Flamenco, dramatic passion, descending minor tetrachord",
        defaultKey: 9, // Am
        chords: [
            { degree: "i", rootOffset: 9, type: "min" },
            { degree: "♭VII", rootOffset: 7, type: "maj" },
            { degree: "♭VI", rootOffset: 5, type: "maj" },
            { degree: "V", rootOffset: 4, type: "maj" }
        ]
    }
];

const NOTE_NAMES_SHORT = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

/**
 * Get MIDI notes for a chord given a root pitch and chord type
 * Base octave defaults to 4 (Middle C octave)
 */
export function getChordMidiNotes(rootPitch, chordTypeId, baseOctave = 4, inversion = 0) {
    const chordType = CHORD_TYPES.find(c => c.id === chordTypeId) || CHORD_TYPES[0];
    const baseMidi = (baseOctave + 1) * 12 + rootPitch;
    let notes = chordType.intervals.map(interval => baseMidi + interval);

    // Apply inversion if specified
    if (inversion > 0 && inversion < notes.length) {
        for (let i = 0; i < inversion; i++) {
            const first = notes.shift();
            notes.push(first + 12);
        }
    }
    return notes;
}

/**
 * Get all MIDI notes across the entire keyboard that belong to a scale
 */
export function getScaleMidiNotes(rootPitch, scaleTypeId, startMidi = 36, endMidi = 96) {
    const scaleType = SCALE_TYPES.find(s => s.id === scaleTypeId) || SCALE_TYPES[0];
    const scaleNotes = [];
    for (let midi = startMidi; midi <= endMidi; midi++) {
        const interval = (midi - rootPitch + 1200) % 12;
        if (scaleType.intervals.includes(interval)) {
            scaleNotes.push({
                midi,
                isRoot: interval === 0,
                degree: scaleType.intervals.indexOf(interval) + 1
            });
        }
    }
    return scaleNotes;
}

/**
 * Format chord display string (e.g., "Cmaj7", "Am")
 */
export function getChordDisplayName(rootPitch, chordTypeId) {
    const rootName = NOTE_NAMES_SHORT[rootPitch % 12];
    const chordType = CHORD_TYPES.find(c => c.id === chordTypeId) || CHORD_TYPES[0];
    return `${rootName}${chordType.symbol}`;
}

