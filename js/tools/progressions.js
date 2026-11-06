/**
 * KESARE Piano Studio — Interactive Chord Progressions Player
 * Common harmonic sequences, key transposition, and rhythmic progression playback.
 */

import { CHORD_PROGRESSIONS, ROOT_NOTES, getChordMidiNotes, getChordDisplayName } from "../config/chords-scales.js";
import { audioEngine } from "../audio/audio-engine.js";

export class ProgressionPlayer {
    constructor(pianoKeyboard) {
        this.keyboard = pianoKeyboard;
        this.selectedProgId = CHORD_PROGRESSIONS[0].id;
        this.selectedKey = 0; // C
        this.isPlaying = false;
        this.currentStep = 0;
        this.timer = null;
    }

    init() {
        this.setupUI();
        this.updateDisplay();
    }

    setupUI() {
        const progSelect = document.getElementById("progressionSelect");
        const keySelect = document.getElementById("progressionKeySelect");
        const playBtn = document.getElementById("playProgressionBtn");

        if (progSelect) {
            progSelect.innerHTML = CHORD_PROGRESSIONS.map(p => `<option value="${p.id}">${p.name} (${p.roman})</option>`).join("");
            progSelect.value = this.selectedProgId;
            progSelect.addEventListener("change", (e) => {
                this.selectedProgId = e.target.value;
                this.updateDisplay();
            });
        }

        if (keySelect) {
            keySelect.innerHTML = ROOT_NOTES.map(r => `<option value="${r.pitch}">${r.name}</option>`).join("");
            keySelect.value = "0";
            keySelect.addEventListener("change", (e) => {
                this.selectedKey = Number(e.target.value);
                this.updateDisplay();
            });
        }

        if (playBtn) {
            playBtn.addEventListener("click", () => {
                if (this.isPlaying) {
                    this.stop();
                    playBtn.innerHTML = `<span>▶</span> Play Sequence`;
                } else {
                    this.play();
                    playBtn.innerHTML = `<span>⏹</span> Stop`;
                }
            });
        }
    }

    getProgression() {
        return CHORD_PROGRESSIONS.find(p => p.id === this.selectedProgId) || CHORD_PROGRESSIONS[0];
    }

    updateDisplay() {
        const prog = this.getProgression();
        const cardsContainer = document.getElementById("progressionChordsList");
        const descEl = document.getElementById("progressionDesc");

        if (descEl) descEl.textContent = prog.description;

        if (cardsContainer) {
            cardsContainer.innerHTML = prog.chords.map((chord, idx) => {
                const rootPitch = (this.selectedKey + chord.rootOffset) % 12;
                const displayName = getChordDisplayName(rootPitch, chord.type);

                return `
                <div class="prog-chord-card ${idx === this.currentStep && this.isPlaying ? 'active' : ''}" data-step="${idx}">
                    <span class="prog-degree">${chord.degree}</span>
                    <strong class="prog-chord-name">${displayName}</strong>
                </div>
                `;
            }).join("");
        }
    }

    play() {
        this.stop();
        this.isPlaying = true;
        this.currentStep = 0;
        this.runStep();
    }

    stop() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.keyboard.renderer.clearHighlights("highlight-chord");
        this.updateDisplay();
    }

    runStep() {
        if (!this.isPlaying) return;
        const prog = this.getProgression();

        if (this.currentStep >= prog.chords.length) {
            this.currentStep = 0; // Loop or finish
        }

        this.updateDisplay();
        const chordDef = prog.chords[this.currentStep];
        const rootPitch = (this.selectedKey + chordDef.rootOffset) % 12;
        const midiNotes = getChordMidiNotes(rootPitch, chordDef.type, 4);

        // Highlight and sound chord
        this.keyboard.renderer.clearHighlights("highlight-chord");
        midiNotes.forEach(m => {
            this.keyboard.renderer.highlightNote(m, "highlight-chord");
            audioEngine.playNote(m, 0.85);
            this.keyboard.renderer.setKeyPressed(m, true);
        });

        // Release chord before next beat
        setTimeout(() => {
            midiNotes.forEach(m => {
                audioEngine.stopNote(m);
                this.keyboard.renderer.setKeyPressed(m, false);
            });
        }, 1100);

        this.timer = setTimeout(() => {
            this.currentStep++;
            this.runStep();
        }, 1300);
    }
}

