/**
 * KESARE Piano Studio — Interactive Chord Finder
 * Chord construction, piano key visualization, and arpeggiation.
 */

import { ROOT_NOTES, CHORD_TYPES, getChordMidiNotes, getChordDisplayName } from "../config/chords-scales.js";
import { getNoteName } from "../config/keyboard-map.js";
import { audioEngine } from "../audio/audio-engine.js";

export class ChordFinder {
    constructor(pianoKeyboard) {
        this.keyboard = pianoKeyboard;
        this.selectedRoot = 0; // C
        this.selectedType = "maj";
        this.inversion = 0; // 0 = root, 1 = 1st, 2 = 2nd
        this.baseOctave = 4; // C4
    }

    init() {
        this.setupUI();
        this.updateDisplay();
    }

    setupUI() {
        const rootSelect = document.getElementById("chordRootSelect");
        const typeSelect = document.getElementById("chordTypeSelect");
        const invSelect = document.getElementById("chordInversionSelect");
        const playBtn = document.getElementById("playChordBtn");
        const arpBtn = document.getElementById("arpeggiateChordBtn");

        if (rootSelect) {
            rootSelect.innerHTML = ROOT_NOTES.map(r => `<option value="${r.pitch}">${r.name}</option>`).join("");
            rootSelect.value = "0";
            rootSelect.addEventListener("change", (e) => {
                this.selectedRoot = Number(e.target.value);
                this.updateDisplay();
            });
        }

        if (typeSelect) {
            typeSelect.innerHTML = CHORD_TYPES.map(c => `<option value="${c.id}">${c.name} (${c.symbol || 'maj'})</option>`).join("");
            typeSelect.value = "maj";
            typeSelect.addEventListener("change", (e) => {
                this.selectedType = e.target.value;
                this.updateDisplay();
            });
        }

        if (invSelect) {
            invSelect.addEventListener("change", (e) => {
                this.inversion = Number(e.target.value);
                this.updateDisplay();
            });
        }

        if (playBtn) {
            playBtn.addEventListener("click", () => this.playChord(false));
        }

        if (arpBtn) {
            arpBtn.addEventListener("click", () => this.playChord(true));
        }
    }

    getCurrentNotes() {
        return getChordMidiNotes(this.selectedRoot, this.selectedType, this.baseOctave, this.inversion);
    }

    updateDisplay() {
        const notes = this.getCurrentNotes();
        const chordName = getChordDisplayName(this.selectedRoot, this.selectedType);
        const chordObj = CHORD_TYPES.find(c => c.id === this.selectedType) || CHORD_TYPES[0];

        // Highlight keys on piano
        this.keyboard.renderer.clearHighlights("highlight-chord");
        notes.forEach(midi => {
            this.keyboard.renderer.highlightNote(midi, "highlight-chord");
        });

        // Update UI labels
        const nameEl = document.getElementById("chordResultName");
        const formulaEl = document.getElementById("chordResultFormula");
        const notesEl = document.getElementById("chordResultNotes");
        const descEl = document.getElementById("chordResultDesc");

        if (nameEl) nameEl.textContent = chordName;
        if (formulaEl) formulaEl.textContent = `Formula: ${chordObj.formula}`;
        if (notesEl) {
            const formattedNotes = notes.map(m => getNoteName(m)).join("  –  ");
            notesEl.innerHTML = `Notes: <strong>${formattedNotes}</strong>`;
        }
        if (descEl) descEl.textContent = chordObj.description;
    }

    playChord(arpeggiated = false) {
        const notes = this.getCurrentNotes();
        if (notes.length === 0) return;

        if (!arpeggiated) {
            // Block chord
            notes.forEach(midi => {
                audioEngine.playNote(midi, 0.8);
                this.keyboard.renderer.setKeyPressed(midi, true);
                setTimeout(() => {
                    audioEngine.stopNote(midi);
                    this.keyboard.renderer.setKeyPressed(midi, false);
                }, 900);
            });
        } else {
            // Arpeggiated sequence
            notes.forEach((midi, idx) => {
                setTimeout(() => {
                    audioEngine.playNote(midi, 0.85);
                    this.keyboard.renderer.setKeyPressed(midi, true);
                    setTimeout(() => {
                        audioEngine.stopNote(midi);
                        this.keyboard.renderer.setKeyPressed(midi, false);
                    }, 500);
                }, idx * 180);
            });
        }
    }
}

