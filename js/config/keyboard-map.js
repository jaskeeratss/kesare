/**
 * KESARE Piano Studio — Keyboard Configuration & Note Mapping
 * Professional 61-key (MIDI 36–96) & 88-key (MIDI 21–108) configurations.
 */

export const NOTE_NAMES = [
    "C", "C♯", "D", "D♯", "E", "F",
    "F♯", "G", "G♯", "A", "A♯", "B"
];

export const NOTE_NAMES_FLAT = [
    "C", "D♭", "D", "E♭", "E", "F",
    "G♭", "G", "A♭", "A", "B♭", "B"
];

export const SOLFEGE_NAMES = [
    "Do", "Do♯", "Re", "Re♯", "Mi", "Fa",
    "Fa♯", "Sol", "Sol♯", "La", "La♯", "Si"
];

// Semitone positions of white keys in an octave (0 = C, 2 = D, 4 = E, 5 = F, 7 = G, 9 = A, 11 = B)
export const WHITE_NOTES = [0, 2, 4, 5, 7, 9, 11];

// Default physical keyboard mapping for 61-key piano (centered around Middle C / C4 = MIDI 60)
// Preserves the exact user-specified mapping:
export const DEFAULT_WHITE_SHORTCUTS = {
    48: "q", 50: "w", 52: "e", 53: "r", 55: "t",
    57: "y", 59: "u", 60: "i", 62: "o", 64: "p",
    65: "z", 67: "x", 69: "c", 71: "v", 72: "b",
    74: "n", 76: "m", 77: ",", 79: ".", 81: "/"
};

export const DEFAULT_BLACK_SHORTCUTS = {
    49: "2", 51: "3", 54: "5", 56: "6", 58: "7",
    61: "9", 63: "0", 66: "s", 68: "d", 70: "f",
    73: "h", 75: "j", 78: "l", 80: ";", 82: "'"
};

// Keyboard modes
export const KEYBOARD_MODES = {
    STANDARD_61: {
        id: "61",
        label: "61 Keys (C2 – C7)",
        startMidi: 36,
        endMidi: 96,
        whiteKeyCount: 36,
        blackKeyCount: 25
    },
    FULL_88: {
        id: "88",
        label: "88 Keys (A0 – C8)",
        startMidi: 21,
        endMidi: 108,
        whiteKeyCount: 52,
        blackKeyCount: 36
    }
};

/**
 * Returns formatted note name with octave (e.g. "C4", "F♯3")
 */
export function getNoteName(midi, useFlats = false, useSolfege = false) {
    const pitch = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    let name;
    if (useSolfege) {
        name = SOLFEGE_NAMES[pitch];
    } else {
        name = useFlats ? NOTE_NAMES_FLAT[pitch] : NOTE_NAMES[pitch];
    }
    return `${name}${octave}`;
}

/**
 * Calculate pitch frequency in Hz from MIDI note number
 * Standard A4 = 440 Hz tuning by default, or user-calibrated baseFreq
 */
export function midiToFrequency(midi, a4Freq = 440) {
    return a4Freq * Math.pow(2, (midi - 69) / 12);
}

/**
 * Check if a MIDI note is a white key
 */
export function isWhiteKey(midi) {
    return WHITE_NOTES.includes(midi % 12);
}

