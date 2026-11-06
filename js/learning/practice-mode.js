/**
 * KESARE Piano Studio — Interactive Music Practice & Note Detection
 * Listen mode, "Wait-for-me" note guide, and tempo play-along evaluation.
 */

import { audioEngine } from "../audio/audio-engine.js";
import { getNoteName } from "../config/keyboard-map.js";

export const PRACTICE_MODES = {
    LISTEN: "listen",
    PRACTICE: "practice", // Wait for user
    PLAYALONG: "playalong"
};

export class PracticeController {
    constructor(pianoKeyboard, sheetViewer) {
        this.keyboard = pianoKeyboard;
        this.sheetViewer = sheetViewer;

        this.currentSong = null;
        this.currentMode = PRACTICE_MODES.PRACTICE;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.playbackRate = 1.0;

        // Scoring & accuracy for Playalong mode
        this.score = { hits: 0, misses: 0, streak: 0, maxStreak: 0 };

        // Timeouts
        this.timer = null;

        // UI callback
        this.onProgressUpdate = null;
        this.onFeedback = null; // (text, type: 'good' | 'warn' | 'info')

        // Listen to user piano inputs
        this.keyboard.addNoteOnListener((midi, velocity, source) => {
            this.handleUserNote(midi);
        });
    }

    setSong(song) {
        this.stop();
        this.currentSong = song;
        this.currentIndex = 0;
        this.resetScore();
        if (this.sheetViewer && this.currentSong) {
            this.sheetViewer.renderSongScore(this.currentSong, 0);
        }
        this.highlightCurrentTarget();
        this.notifyProgress();
    }

    setMode(mode) {
        this.stop();
        this.currentMode = mode;
        this.currentIndex = 0;
        this.highlightCurrentTarget();
    }

    setPlaybackRate(rate) {
        this.playbackRate = Number(rate) || 1.0;
    }

    resetScore() {
        this.score = { hits: 0, misses: 0, streak: 0, maxStreak: 0 };
    }

    start() {
        if (!this.currentSong) return;
        this.isPlaying = true;

        if (this.currentMode === PRACTICE_MODES.LISTEN) {
            this.runListenMode();
        } else if (this.currentMode === PRACTICE_MODES.PLAYALONG) {
            this.runPlayAlongMode();
        } else {
            // Practice mode: wait for user
            this.highlightCurrentTarget();
        }
    }

    stop() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.keyboard.renderer.clearHighlights();
    }

    reset() {
        this.stop();
        this.currentIndex = 0;
        this.resetScore();
        if (this.sheetViewer && this.currentSong) {
            this.sheetViewer.renderSongScore(this.currentSong, 0);
        }
        this.highlightCurrentTarget();
        this.notifyProgress();
    }

    // -------------------------------------------------------------
    // LISTEN MODE (Auto demonstration)
    // -------------------------------------------------------------
    runListenMode() {
        if (!this.isPlaying || !this.currentSong) return;
        const notes = this.currentSong.notes;

        if (this.currentIndex >= notes.length) {
            this.stop();
            if (this.onFeedback) this.onFeedback("Lesson playback complete!", "info");
            return;
        }

        const currentNote = notes[this.currentIndex];
        const nextNote = notes[this.currentIndex + 1];

        // Play sound & highlight
        audioEngine.playNote(currentNote.midi, 0.8);
        this.keyboard.renderer.setKeyPressed(currentNote.midi, true);
        this.keyboard.renderer.highlightNote(currentNote.midi, "highlight-guide");

        if (this.sheetViewer) {
            this.sheetViewer.renderSongScore(this.currentSong, this.currentIndex);
        }
        this.notifyProgress();

        // Release note
        setTimeout(() => {
            audioEngine.stopNote(currentNote.midi);
            this.keyboard.renderer.setKeyPressed(currentNote.midi, false);
            this.keyboard.renderer.clearHighlights("highlight-guide");
        }, Math.max(100, currentNote.duration / this.playbackRate));

        // Schedule next note
        const delay = nextNote ? (nextNote.time - currentNote.time) / this.playbackRate : 1000;
        this.timer = setTimeout(() => {
            this.currentIndex++;
            this.runListenMode();
        }, Math.max(150, delay));
    }

    // -------------------------------------------------------------
    // PRACTICE MODE (Wait-for-me Note Detection)
    // -------------------------------------------------------------
    highlightCurrentTarget() {
        this.keyboard.renderer.clearHighlights();
        if (!this.currentSong || !this.currentSong.notes) return;

        const currentNote = this.currentSong.notes[this.currentIndex];
        if (currentNote) {
            this.keyboard.renderer.highlightNote(currentNote.midi, "highlight-guide");
            if (this.sheetViewer) {
                this.sheetViewer.renderSongScore(this.currentSong, this.currentIndex);
            }
        }
    }

    handleUserNote(midi) {
        if (!this.currentSong || this.currentMode === PRACTICE_MODES.LISTEN) return;

        const notes = this.currentSong.notes;
        if (this.currentIndex >= notes.length) return;

        const targetNote = notes[this.currentIndex];

        if (midi === targetNote.midi) {
            // Hit!
            this.score.hits++;
            this.score.streak++;
            if (this.score.streak > this.score.maxStreak) {
                this.score.maxStreak = this.score.streak;
            }

            if (this.onFeedback) {
                const msgs = ["Perfect!", "Great!", "Excellent!", "Bravo!"];
                const msg = this.score.streak > 3 ? `${msgs[Math.floor(Math.random() * msgs.length)]} (${this.score.streak}x)` : "Correct!";
                this.onFeedback(msg, "good");
            }

            this.currentIndex++;

            if (this.currentIndex >= notes.length) {
                // Completed song!
                this.stop();
                if (this.onFeedback) {
                    this.onFeedback("Mastery Achieved! Completed song!", "good");
                }
            } else {
                this.highlightCurrentTarget();
            }
        } else {
            // Miss!
            this.score.misses++;
            this.score.streak = 0;
            if (this.onFeedback) {
                this.onFeedback(`Play ${getNoteName(targetNote.midi)}`, "warn");
            }
        }

        this.notifyProgress();
    }

    // -------------------------------------------------------------
    // PLAY-ALONG MODE
    // -------------------------------------------------------------
    runPlayAlongMode() {
        if (!this.isPlaying || !this.currentSong) return;
        const notes = this.currentSong.notes;

        if (this.currentIndex >= notes.length) {
            this.stop();
            const total = this.score.hits + this.score.misses;
            const accuracy = total > 0 ? Math.round((this.score.hits / total) * 100) : 0;
            if (this.onFeedback) {
                this.onFeedback(`Song Finished! Accuracy: ${accuracy}%`, "info");
            }
            return;
        }

        this.highlightCurrentTarget();
        this.notifyProgress();

        const currentNote = notes[this.currentIndex];
        const nextNote = notes[this.currentIndex + 1];
        const delay = nextNote ? (nextNote.time - currentNote.time) / this.playbackRate : 1200;

        this.timer = setTimeout(() => {
            this.currentIndex++;
            this.runPlayAlongMode();
        }, Math.max(120, delay));
    }

    notifyProgress() {
        if (!this.onProgressUpdate || !this.currentSong) return;
        const total = this.currentSong.notes.length;
        const targetNote = this.currentSong.notes[this.currentIndex] || null;
        const percent = total > 0 ? Math.round((this.currentIndex / total) * 100) : 0;

        this.onProgressUpdate({
            currentIndex: this.currentIndex,
            totalNotes: total,
            percent,
            targetNote,
            score: this.score
        });
    }
}
