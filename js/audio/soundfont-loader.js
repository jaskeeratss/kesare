/**
 * KESARE Piano Studio — General MIDI SoundFont Sample Loader
 * On-demand asynchronous sample streaming, decoding, and session caching.
 * Falls back gracefully to physical synthesis if offline or network is restricted.
 */

// Primary & mirror CDNs for public redistributable FluidR3_GM SoundFonts (MIT / Public Domain audio)
const SOUNDFONT_CDNS = [
    "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/",
    "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/"
];

class SoundfontLoader {
    constructor() {
        this.ctx = null;
        // In-memory cache: gmName -> Map<midiNote, AudioBuffer>
        this.cache = new Map();
        this.loadingPromises = new Map();
        this.statusListeners = new Set();
    }

    setAudioContext(context) {
        this.ctx = context;
    }

    addStatusListener(fn) {
        this.statusListeners.add(fn);
    }

    removeStatusListener(fn) {
        this.statusListeners.delete(fn);
    }

    notifyStatus(instrumentId, status, details = {}) {
        this.statusListeners.forEach(fn => {
            try { fn(instrumentId, status, details); } catch {}
        });
    }

    hasSamples(gmName) {
        return this.cache.has(gmName) && this.cache.get(gmName).size > 0;
    }

    getSampleBuffer(gmName, midi) {
        const instrumentMap = this.cache.get(gmName);
        if (!instrumentMap) return null;

        // Exact match
        if (instrumentMap.has(midi)) {
            return { buffer: instrumentMap.get(midi), playbackRate: 1.0 };
        }

        // Nearest neighbor pitch shift fallback
        let nearestMidi = -1;
        let minDiff = 999;
        instrumentMap.forEach((_, sampleMidi) => {
            const diff = Math.abs(sampleMidi - midi);
            if (diff < minDiff) {
                minDiff = diff;
                nearestMidi = sampleMidi;
            }
        });

        if (nearestMidi > 0 && minDiff <= 12) {
            // Pitch shift by semitone ratio
            const playbackRate = Math.pow(2, (midi - nearestMidi) / 12);
            return { buffer: instrumentMap.get(nearestMidi), playbackRate };
        }

        return null;
    }

    /**
     * Load SoundFont instrument on demand
     */
    async loadInstrument(instrumentPreset) {
        const gmName = instrumentPreset.gmName;
        const instrumentId = instrumentPreset.id;

        if (this.hasSamples(gmName)) {
            this.notifyStatus(instrumentId, "ready", { source: "cache" });
            return true;
        }

        if (this.loadingPromises.has(gmName)) {
            return await this.loadingPromises.get(gmName);
        }

        const loadPromise = this._fetchAndDecodeSoundfont(instrumentPreset);
        this.loadingPromises.set(gmName, loadPromise);

        try {
            const result = await loadPromise;
            return result;
        } finally {
            this.loadingPromises.delete(gmName);
        }
    }

    async _fetchAndDecodeSoundfont(instrumentPreset) {
        const { id, gmName } = instrumentPreset;
        this.notifyStatus(id, "loading", { progress: 10 });

        if (!this.ctx) {
            this.notifyStatus(id, "synthesis_ready", { source: "synthesis" });
            return false;
        }

        // Try primary CDN then mirror
        let rawData = null;
        for (const cdn of SOUNDFONT_CDNS) {
            try {
                const url = `${cdn}${gmName}-mp3.js`;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const scriptText = await response.text();
                    rawData = this._parseMidiJsSoundfont(scriptText);
                    if (rawData) break;
                }
            } catch (err) {
                // Try next CDN
            }
        }

        if (!rawData) {
            // Network unavailable or blocked: cleanly fall back to dedicated synthesis model
            this.notifyStatus(id, "synthesis_ready", { source: "synthesis", note: "Offline mode: Physical synthesis engine active" });
            return false;
        }

        this.notifyStatus(id, "decoding", { progress: 50 });

        // Decode audio buffers
        const bufferMap = new Map();
        const noteEntries = Object.entries(rawData);
        let decodedCount = 0;

        for (const [noteKey, base64Uri] of noteEntries) {
            const midi = noteNameToMidi(noteKey);
            if (midi !== null) {
                try {
                    const audioBytes = base64ToArrayBuffer(base64Uri.split(",")[1] || base64Uri);
                    const audioBuffer = await this.ctx.decodeAudioData(audioBytes);
                    bufferMap.set(midi, audioBuffer);
                } catch {
                    // Skip single corrupt note
                }
            }
            decodedCount++;
            if (decodedCount % 8 === 0) {
                const percent = Math.min(95, 50 + Math.floor((decodedCount / noteEntries.length) * 45));
                this.notifyStatus(id, "decoding", { progress: percent });
            }
        }

        if (bufferMap.size > 0) {
            this.cache.set(gmName, bufferMap);
            this.notifyStatus(id, "ready", { source: "soundfont", sampleCount: bufferMap.size });
            return true;
        } else {
            this.notifyStatus(id, "synthesis_ready", { source: "synthesis" });
            return false;
        }
    }

    _parseMidiJsSoundfont(scriptText) {
        try {
            // MIDI.js soundfont format: MIDI.Soundfont.instrument_name = { "A0": "data:audio/mp3;base64,...", ... };
            const jsonStart = scriptText.indexOf("{");
            const jsonEnd = scriptText.lastIndexOf("}");
            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonStr = scriptText.substring(jsonStart, jsonEnd + 1);
                return JSON.parse(jsonStr);
            }
        } catch {
            return null;
        }
        return null;
    }
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

const NOTE_NAME_MAP = {
    "C": 0, "Db": 1, "C#": 1, "D": 2, "Eb": 3, "D#": 3,
    "E": 4, "F": 5, "Gb": 6, "F#": 6, "G": 7, "Ab": 8, "G#": 8,
    "A": 9, "Bb": 10, "A#": 10, "B": 11
};

function noteNameToMidi(name) {
    const match = name.match(/^([A-G][b#]?)(-?\d+)$/);
    if (!match) return null;
    const note = match[1];
    const octave = parseInt(match[2], 10);
    const pitch = NOTE_NAME_MAP[note];
    if (pitch === undefined) return null;
    return (octave + 1) * 12 + pitch;
}

export const soundfontLoader = new SoundfontLoader();

