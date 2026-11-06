/**
 * KESARE Piano Studio — Music Learning Hub Coordinator
 * Searchable song library, difficulty filter, lesson interface management.
 */

import { SONGS_DATABASE, SONG_CATEGORIES, SONG_DIFFICULTIES } from "../config/songs-library.js";
import { PracticeController, PRACTICE_MODES } from "./practice-mode.js";
import { SheetViewer } from "./sheet-viewer.js";
import { getNoteName } from "../config/keyboard-map.js";

export class LessonPlayer {
    constructor(pianoKeyboard) {
        this.keyboard = pianoKeyboard;
        this.sheetViewer = null;
        this.practice = null;

        this.selectedCategory = "all";
        this.selectedDifficulty = "all";
        this.searchQuery = "";
        this.activeSong = SONGS_DATABASE[0];
    }

    init() {
        const sheetContainer = document.getElementById("sheetViewerContainer");
        if (sheetContainer) {
            this.sheetViewer = new SheetViewer(sheetContainer);
        }

        this.practice = new PracticeController(this.keyboard, this.sheetViewer);
        this.setupEventListeners();
        this.renderSongLibrary();

        // Load default song
        if (this.activeSong) {
            this.selectSong(this.activeSong.id);
        }
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById("songSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.renderSongLibrary();
            });
        }

        // Category filter
        const categorySelect = document.getElementById("songCategoryFilter");
        if (categorySelect) {
            categorySelect.addEventListener("change", (e) => {
                this.selectedCategory = e.target.value;
                this.renderSongLibrary();
            });
        }

        // Difficulty filter
        const diffSelect = document.getElementById("songDiffFilter");
        if (diffSelect) {
            diffSelect.addEventListener("change", (e) => {
                this.selectedDifficulty = e.target.value;
                this.renderSongLibrary();
            });
        }

        // Mode toggles (Listen, Practice, Play-along)
        const modeBtns = document.querySelectorAll("[data-lesson-mode]");
        modeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                modeBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const mode = btn.dataset.lessonMode;
                this.practice.setMode(mode);
                this.updateModeUI(mode);
            });
        });

        // Practice Controls
        const playBtn = document.getElementById("lessonPlayBtn");
        if (playBtn) {
            playBtn.addEventListener("click", () => {
                if (this.practice.isPlaying) {
                    this.practice.stop();
                    playBtn.innerHTML = `<span>▶</span> Start`;
                    playBtn.classList.remove("active");
                } else {
                    this.practice.start();
                    playBtn.innerHTML = `<span>⏸</span> Pause`;
                    playBtn.classList.add("active");
                }
            });
        }

        const resetBtn = document.getElementById("lessonResetBtn");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                this.practice.reset();
                if (playBtn) {
                    playBtn.innerHTML = `<span>▶</span> Start`;
                    playBtn.classList.remove("active");
                }
            });
        }

        // Speed selector
        const speedSelect = document.getElementById("lessonSpeed");
        if (speedSelect) {
            speedSelect.addEventListener("change", (e) => {
                this.practice.setPlaybackRate(Number(e.target.value));
            });
        }

        // Feedback and progress hook
        const feedbackEl = document.getElementById("lessonFeedback");
        this.practice.onFeedback = (text, type) => {
            if (!feedbackEl) return;
            feedbackEl.textContent = text;
            feedbackEl.className = `lesson-feedback feedback-${type}`;
            feedbackEl.classList.remove("pop");
            void feedbackEl.offsetWidth;
            feedbackEl.classList.add("pop");
        };

        const progressBar = document.getElementById("lessonProgressBar");
        const noteGuideEl = document.getElementById("lessonTargetNote");
        this.practice.onProgressUpdate = (stats) => {
            if (progressBar) {
                progressBar.style.width = `${stats.percent}%`;
            }
            if (noteGuideEl && stats.targetNote) {
                const name = getNoteName(stats.targetNote.midi);
                noteGuideEl.innerHTML = `Target: <strong>${name}</strong> (Note ${stats.currentIndex + 1}/${stats.totalNotes})`;
            }
        };
    }

    renderSongLibrary() {
        const listContainer = document.getElementById("songListContainer");
        if (!listContainer) return;

        const filtered = SONGS_DATABASE.filter(song => {
            const matchCategory = this.selectedCategory === "all" || song.category === this.selectedCategory;
            const matchDiff = this.selectedDifficulty === "all" || song.difficulty === this.selectedDifficulty;
            const matchSearch = !this.searchQuery ||
                song.title.toLowerCase().includes(this.searchQuery) ||
                song.composer.toLowerCase().includes(this.searchQuery);
            return matchCategory && matchDiff && matchSearch;
        });

        if (filtered.length === 0) {
            listContainer.innerHTML = `<div class="empty-list-msg">No pieces found matching your criteria.</div>`;
            return;
        }

        listContainer.innerHTML = filtered.map(song => {
            const isSelected = this.activeSong && this.activeSong.id === song.id;
            const diffClass = song.difficulty === "beginner" ? "badge-green" :
                              song.difficulty === "intermediate" ? "badge-amber" : "badge-purple";

            return `
            <div class="song-card ${isSelected ? 'active' : ''}" data-song-id="${song.id}">
                <div class="song-card-header">
                    <h4>${song.title}</h4>
                    <span class="badge ${diffClass}">${song.difficulty.toUpperCase()}</span>
                </div>
                <div class="song-card-meta">
                    <span>${song.composer}</span>
                    <span>•</span>
                    <span>${song.key}</span>
                    <span>•</span>
                    <span>${song.notes.length} notes</span>
                </div>
                <p class="song-card-desc">${song.description}</p>
            </div>
            `;
        }).join("");

        // Attach click listeners to cards
        listContainer.querySelectorAll(".song-card").forEach(card => {
            card.addEventListener("click", () => {
                const id = card.dataset.songId;
                this.selectSong(id);
            });
        });
    }

    selectSong(songId) {
        const song = SONGS_DATABASE.find(s => s.id === songId);
        if (!song) return;

        this.activeSong = song;
        this.practice.setSong(song);

        // Update active card styling
        const cards = document.querySelectorAll(".song-card");
        cards.forEach(c => c.classList.toggle("active", c.dataset.songId === songId));

        // Update Header & Meta
        const titleEl = document.getElementById("activeSongTitle");
        const composerEl = document.getElementById("activeSongComposer");
        const keyEl = document.getElementById("activeSongKey");
        if (titleEl) titleEl.textContent = song.title;
        if (composerEl) composerEl.textContent = song.composer;
        if (keyEl) keyEl.textContent = `${song.key} • ${song.timeSignature} • ${song.bpm} BPM`;

        // Reset play button
        const playBtn = document.getElementById("lessonPlayBtn");
        if (playBtn) {
            playBtn.innerHTML = `<span>▶</span> Start`;
            playBtn.classList.remove("active");
        }
    }

    updateModeUI(mode) {
        const tipEl = document.getElementById("lessonModeTip");
        if (!tipEl) return;

        if (mode === PRACTICE_MODES.LISTEN) {
            tipEl.textContent = "Listen & observe the notes playing on the virtual piano and score.";
        } else if (mode === PRACTICE_MODES.PRACTICE) {
            tipEl.textContent = "Wait-for-me mode: Press the highlighted glowing key to advance.";
        } else {
            tipEl.textContent = "Play-along mode: Play the notes in rhythm at the selected tempo.";
        }
    }
}
