/**
 * KESARE Piano Studio — Interactive Scale Explorer
 * Musical scale mapping across the entire keyboard with ascending/descending audio preview.
 */

import { ROOT_NOTES, SCALE_TYPES, getScaleMidiNotes } from "../config/chords-scales.js";
import { getNoteName } from "../config/keyboard-map.js";
import { audioEngine } from "../audio/audio-engine.js";

export class ScaleFinder {
    constructor(pianoKeyboard) {
        this.keyboard = pianoKeyboard;
        this.selectedRoot = 0; // C
        this.selectedType = "major";
        this.isPlaying = false;
        this.timer = null;
    }

    init() {
        this.setupUI();
        this.updateDisplay();
    }

    setupUI() {
        const rootSelect = document.getElementById("scaleRootSelect");
        const typeSelect = document.getElementById("scaleTypeSelect");
        const playBtn = document.getElementById("playScaleBtn");

        if (rootSelect) {
            rootSelect.innerHTML = ROOT_NOTES.map(r => `<option value="${r.pitch}">${r.name}</option>`).join("");
            rootSelect.value = "0";
            rootSelect.addEventListener("change", (e) => {
                this.selectedRoot = Number(e.target.value);
                this.updateDisplay();
            });
        }

        if (typeSelect) {
            typeSelect.innerHTML = SCALE_TYPES.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
            typeSelect.value = "major";
            typeSelect.addEventListener("change", (e) => {
                this.selectedType = e.target.value;
                this.updateDisplay();
            });
        }

        if (playBtn) {
            playBtn.addEventListener("click", () => this.playScale());
        }
    }

    getScaleNotes() {
        const { startMidi, endMidi } = this.keyboard.renderer.mode;
        return getScaleMidiNotes(this.selectedRoot, this.selectedType, startMidi, endMidi);
    }

    updateDisplay() {
        const scaleNotes = this.getScaleNotes();
        const rootObj = ROOT_NOTES.find(r => r.pitch === this.selectedRoot) || ROOT_NOTES[0];
        const scaleObj = SCALE_TYPES.find(s => s.id === this.selectedType) || SCALE_TYPES[0];

        // Clear previous highlights
        this.keyboard.renderer.clearHighlights("highlight-scale");
        this.keyboard.renderer.clearHighlights("highlight-root");

        // Highlight notes across piano
        scaleNotes.forEach(item => {
            if (item.isRoot) {
                this.keyboard.renderer.highlightNote(item.midi, "highlight-root");
            } else {
                this.keyboard.renderer.highlightNote(item.midi, "highlight-scale");
            }
        });

        // Update UI
        const nameEl = document.getElementById("scaleResultName");
        const formulaEl = document.getElementById("scaleResultFormula");
        const notesEl = document.getElementById("scaleResultNotes");
        const descEl = document.getElementById("scaleResultDesc");

        if (nameEl) nameEl.textContent = `${rootObj.name.split("/")[0].trim()} ${scaleObj.name}`;
        if (formulaEl) formulaEl.textContent = `Pattern: ${scaleObj.formula}`;

        // Get single octave notes
        const singleOctave = scaleNotes.filter(n => n.midi >= 60 && n.midi < 72 + scaleObj.intervals.length);
        if (notesEl) {
            const formatted = scaleObj.intervals.map(int => {
                const pitch = (this.selectedRoot + int) % 12;
                return ROOT_NOTES[pitch].name.split("/")[0].trim();
            }).join("  –  ");
            notesEl.innerHTML = `Degrees: <strong>${formatted}</strong>`;
        }
        if (descEl) descEl.textContent = scaleObj.description;
    }

    playScale() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        // Choose 1 octave starting at or near Middle C (60)
        let baseMidi = 60 + this.selectedRoot;
        if (baseMidi > 70) baseMidi -= 12;

        const scaleObj = SCALE_TYPES.find(s => s.id === this.selectedType) || SCALE_TYPES[0];
        const ascNotes = scaleObj.intervals.map(int => baseMidi + int);
        ascNotes.push(baseMidi + 12); // Add octave note

        // Play ascending then descending
        const sequence = [...ascNotes, ...ascNotes.slice(0, -1).reverse()];

        sequence.forEach((midi, idx) => {
            setTimeout(() => {
                audioEngine.playNote(midi, 0.85);
                this.keyboard.renderer.setKeyPressed(midi, true);

                setTimeout(() => {
                    audioEngine.stopNote(midi);
                    this.keyboard.renderer.setKeyPressed(midi, false);
                }, 280);

                if (idx === sequence.length - 1) {
                    this.isPlaying = false;
                }
            }, idx * 260);
        });
    }
}

