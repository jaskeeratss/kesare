/**
 * KESARE Piano Studio — Studio View Navigation & Section Switcher
 * Manages view routing between Studio, Recording Hub, Learning, and Music Tools.
 */

import { recordingStorage } from "../recording/storage.js";
import { REC_STATES } from "../recording/recorder.js";

export class StudioNavigation {
    constructor(recorder) {
        this.recorder = recorder;
        this.currentView = "studio";
        this.currentTool = "metronome";
    }

    init() {
        this.setupViewTabs();
        this.setupToolTabs();
        this.setupRecordingStudioUI();
    }

    setupViewTabs() {
        const navButtons = document.querySelectorAll("[data-nav-view]");
        const viewPanels = document.querySelectorAll(".view-panel");

        navButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const view = btn.dataset.navView;
                this.switchView(view);
            });
        });
    }

    switchView(viewName) {
        this.currentView = viewName;

        // Update nav buttons
        document.querySelectorAll("[data-nav-view]").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.navView === viewName);
        });

        // Update view panels
        document.querySelectorAll(".view-panel").forEach(panel => {
            panel.classList.toggle("is-active", panel.id === `view-${viewName}`);
        });

        // When switching to recordings, refresh list
        if (viewName === "recordings") {
            this.refreshRecordingsList();
        }
    }

    setupToolTabs() {
        const toolButtons = document.querySelectorAll("[data-tool-tab]");
        toolButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const tool = btn.dataset.toolTab;
                this.switchTool(tool);
            });
        });
    }

    switchTool(toolName) {
        this.currentTool = toolName;

        document.querySelectorAll("[data-tool-tab]").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.toolTab === toolName);
        });

        document.querySelectorAll(".tool-panel").forEach(panel => {
            panel.classList.toggle("is-active", panel.id === `tool-${toolName}`);
        });
    }

    // -------------------------------------------------------------
    // RECORDING STUDIO UI CONTROLLER
    // -------------------------------------------------------------
    setupRecordingStudioUI() {
        if (!this.recorder) return;

        const mainRecBtn = document.getElementById("mainRecordBtn");
        const pauseRecBtn = document.getElementById("mainPauseRecBtn");
        const stopRecBtn = document.getElementById("mainStopRecBtn");
        const quickRecBtn = document.getElementById("quickRecordBtn");
        const timeDisplay = document.getElementById("recTimerDisplay");
        const statusBadge = document.getElementById("recStatusBadge");
        const noteCountDisplay = document.getElementById("recNoteCount");

        // Update timer clock while recording
        setInterval(() => {
            if (this.recorder.state === REC_STATES.RECORDING || this.recorder.state === REC_STATES.PAUSED) {
                const elapsedMs = this.recorder.getElapsedRecordingTime();
                const totalSeconds = Math.floor(elapsedMs / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                const tenths = Math.floor((elapsedMs % 1000) / 100);

                const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
                if (timeDisplay) timeDisplay.textContent = formatted;
            }
        }, 80);

        // State changes
        this.recorder.subscribe((state, stats) => {
            if (quickRecBtn) {
                quickRecBtn.classList.toggle("active", state === REC_STATES.RECORDING);
            }

            if (statusBadge) {
                statusBadge.textContent = state.toUpperCase();
                statusBadge.className = `rec-status-badge status-${state}`;
            }

            if (noteCountDisplay) {
                noteCountDisplay.textContent = `${stats.noteCount} notes`;
            }

            if (mainRecBtn) {
                if (state === REC_STATES.RECORDING) {
                    mainRecBtn.classList.add("recording");
                    mainRecBtn.innerHTML = `<span>●</span> Recording...`;
                } else {
                    mainRecBtn.classList.remove("recording");
                    mainRecBtn.innerHTML = `<span>●</span> Record Take`;
                }
            }

            if (pauseRecBtn) {
                pauseRecBtn.disabled = (state === REC_STATES.IDLE || state === REC_STATES.PLAYING);
                pauseRecBtn.textContent = (state === REC_STATES.PAUSED) ? "Resume" : "Pause";
            }

            if (stopRecBtn) {
                stopRecBtn.disabled = (state === REC_STATES.IDLE);
            }
        });

        // Button Clicks
        const handleRecordToggle = () => {
            if (this.recorder.state === REC_STATES.IDLE) {
                this.recorder.startRecording();
            } else {
                this.recorder.stopRecording(true).then(() => {
                    this.refreshRecordingsList();
                });
            }
        };

        if (mainRecBtn) mainRecBtn.addEventListener("click", handleRecordToggle);
        if (quickRecBtn) quickRecBtn.addEventListener("click", handleRecordToggle);

        if (pauseRecBtn) {
            pauseRecBtn.addEventListener("click", () => {
                if (this.recorder.state === REC_STATES.RECORDING) {
                    this.recorder.pauseRecording();
                } else if (this.recorder.state === REC_STATES.PAUSED) {
                    this.recorder.resumeRecording();
                }
            });
        }

        if (stopRecBtn) {
            stopRecBtn.addEventListener("click", () => {
                this.recorder.stopRecording(true).then(() => {
                    this.refreshRecordingsList();
                });
            });
        }

        this.refreshRecordingsList();
    }

    async refreshRecordingsList() {
        const listContainer = document.getElementById("recordingsListContainer");
        if (!listContainer) return;

        const recordings = await recordingStorage.getAll();

        if (recordings.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-recordings-msg">
                    <p>No takes recorded yet.</p>
                    <small>Hit the Record button above or in the top toolbar to capture your first piano performance.</small>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = recordings.map(rec => {
            const dateStr = new Date(rec.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
            const durationSec = Math.round((rec.duration || 0) / 1000);
            const durationFormatted = `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}`;

            return `
            <div class="recording-card" data-id="${rec.id}">
                <div class="rec-card-info">
                    <div class="rec-card-title-row">
                        <strong class="rec-title">${rec.title}</strong>
                        <button class="icon-btn rec-rename-btn" title="Rename Take">✎</button>
                    </div>
                    <div class="rec-meta">
                        <span>${dateStr}</span>
                        <span>•</span>
                        <span>${durationFormatted}</span>
                        <span>•</span>
                        <span>${rec.noteCount || rec.notes.length} notes</span>
                        <span>•</span>
                        <span>${rec.instrument || 'Acoustic'}</span>
                    </div>
                </div>
                <div class="rec-actions">
                    <button class="btn btn-sm btn-play rec-play-btn" data-id="${rec.id}">▶ Play</button>
                    <button class="btn btn-sm rec-wav-btn" data-id="${rec.id}">⬇ WAV</button>
                    <button class="btn btn-sm rec-midi-btn" data-id="${rec.id}">⬇ MIDI</button>
                    <button class="btn btn-sm btn-danger rec-del-btn" data-id="${rec.id}">✕</button>
                </div>
            </div>
            `;
        }).join("");

        // Attach listeners
        listContainer.querySelectorAll(".rec-play-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const rec = recordings.find(r => r.id === btn.dataset.id);
                if (rec) {
                    if (this.recorder.state === REC_STATES.PLAYING) {
                        this.recorder.stopPlayback();
                        btn.textContent = "▶ Play";
                    } else {
                        btn.textContent = "⏹ Stop";
                        this.recorder.playRecording(rec, null, () => {
                            btn.textContent = "▶ Play";
                        });
                    }
                }
            });
        });

        listContainer.querySelectorAll(".rec-wav-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const rec = recordings.find(r => r.id === btn.dataset.id);
                if (rec) {
                    btn.textContent = "Rendering...";
                    try {
                        await this.recorder.exportRecordingToWav(rec);
                    } catch (err) {
                        alert("WAV Export Error: " + err.message);
                    } finally {
                        btn.textContent = "⬇ WAV";
                    }
                }
            });
        });

        listContainer.querySelectorAll(".rec-midi-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const rec = recordings.find(r => r.id === btn.dataset.id);
                if (rec) {
                    try {
                        this.recorder.exportRecordingToMidi(rec);
                    } catch (err) {
                        alert("MIDI Export Error: " + err.message);
                    }
                }
            });
        });

        listContainer.querySelectorAll(".rec-rename-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const card = btn.closest(".recording-card");
                const id = card.dataset.id;
                const rec = recordings.find(r => r.id === id);
                if (rec) {
                    const newTitle = prompt("Enter new title for recording:", rec.title);
                    if (newTitle && newTitle.trim()) {
                        rec.title = newTitle.trim();
                        await recordingStorage.save(rec);
                        this.refreshRecordingsList();
                    }
                }
            });
        });

        listContainer.querySelectorAll(".rec-del-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                if (confirm("Delete this recorded take permanently?")) {
                    await recordingStorage.delete(btn.dataset.id);
                    this.refreshRecordingsList();
                }
            });
        });
    }
}
