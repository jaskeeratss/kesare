/**
 * KESARE Piano Studio — Master Application Bootstrap
 * Professional online virtual piano, recording studio, and music learning platform.
 */

import { audioEngine } from "./audio/audio-engine.js";
import { PianoKeyboard } from "./piano/keyboard.js";
import { StudioRecorder } from "./recording/recorder.js";
import { LessonPlayer } from "./learning/lesson-player.js";
import { StudioMetronome, getTempoName } from "./tools/metronome.js";
import { ChordFinder } from "./tools/chord-finder.js";
import { ScaleFinder } from "./tools/scale-finder.js";
import { ProgressionPlayer } from "./tools/progressions.js";
import { MusicNotepad } from "./tools/notepad.js";
import { MidiManager } from "./midi/midi-manager.js";
import { AudioVisualizer } from "./visualizer/visualizer.js";
import { ControlCentre } from "./ui/control-centre.js";
import { StudioNavigation } from "./ui/navigation.js";
import { SettingsModal } from "./ui/settings-modal.js";
import { InstrumentBrowser } from "./ui/instrument-browser.js";

class KesareApp {
    constructor() {
        this.keyboard = null;
        this.recorder = null;
        this.learning = null;
        this.metronome = null;
        this.chordFinder = null;
        this.scaleFinder = null;
        this.progressionPlayer = null;
        this.notepad = null;
        this.midi = null;
        this.visualizer = null;
        this.controlCentre = null;
        this.navigation = null;
        this.settingsModal = null;
        this.instrumentBrowser = null;
    }

    async init() {
        console.log("Initializing KESARE Piano Studio...");

        // 1. Initialize Piano Keyboard
        const scrollContainer = document.getElementById("keyboardScrollContainer");
        const keysContainer = document.getElementById("keyboardKeysContainer");
        this.keyboard = new PianoKeyboard(scrollContainer, keysContainer);

        // 2. Initialize Visualizer
        const canvas = document.getElementById("audioVisualizerCanvas");
        this.visualizer = new AudioVisualizer(canvas);
        this.visualizer.init();

        // 3. Initialize Studio Recorder
        this.recorder = new StudioRecorder(this.keyboard);

        // 4. Initialize Learning Hub
        this.learning = new LessonPlayer(this.keyboard);
        this.learning.init();

        // 5. Initialize Music Tools
        this.metronome = new StudioMetronome();
        this.setupMetronomeUI();

        this.chordFinder = new ChordFinder(this.keyboard);
        this.chordFinder.init();

        this.scaleFinder = new ScaleFinder(this.keyboard);
        this.scaleFinder.init();

        this.progressionPlayer = new ProgressionPlayer(this.keyboard);
        this.progressionPlayer.init();

        this.notepad = new MusicNotepad();
        this.notepad.init();

        // 6. Initialize UI & Navigation
        this.controlCentre = new ControlCentre(this.keyboard);
        this.controlCentre.init();

        this.instrumentBrowser = new InstrumentBrowser();
        this.instrumentBrowser.init();

        this.navigation = new StudioNavigation(this.recorder);
        this.navigation.init();

        this.settingsModal = new SettingsModal(this.keyboard, this.visualizer);
        this.settingsModal.init();

        // 7. Initialize Web MIDI
        this.midi = new MidiManager(this.keyboard);
        this.setupMidiUI();

        // 8. Global First-Interaction Audio Unlock
        const unlockAudio = () => {
            audioEngine.initContext();
            window.removeEventListener("pointerdown", unlockAudio);
            window.removeEventListener("keydown", unlockAudio);
        };
        window.addEventListener("pointerdown", unlockAudio, { once: true });
        window.addEventListener("keydown", unlockAudio, { once: true });

        console.log("KESARE Piano Studio ready.");
    }

    setupMetronomeUI() {
        const toggleBtn = document.getElementById("metroToggleBtn");
        const quickMetroBtn = document.getElementById("quickMetroBtn");
        const quickMetroStrip = document.getElementById("quickMetroStrip");
        const quickMetroMinusBtn = document.getElementById("quickMetroMinusBtn");
        const quickMetroPlusBtn = document.getElementById("quickMetroPlusBtn");
        const quickMetroBpmDisplay = document.getElementById("quickMetroBpmDisplay");
        const openFullMetroBtn = document.getElementById("openFullMetroBtn");

        const bpmSlider = document.getElementById("metroBpmSlider");
        const bpmDisplay = document.getElementById("metroBpmDisplay");
        const tempoNameDisplay = document.getElementById("metroTempoName");
        const tapBtn = document.getElementById("metroTapBtn");
        const timeSigSelect = document.getElementById("metroTimeSigSelect");
        const soundSelect = document.getElementById("metroSoundSelect");
        const dotsContainer = document.getElementById("metroBeatDots");

        const updateDots = (beatCount) => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = Array.from({ length: beatCount }, (_, i) => `
                <div class="metro-dot ${i === 0 ? 'downbeat-dot' : ''}" data-beat="${i}"></div>
            `).join("");
        };

        updateDots(this.metronome.beatsPerBar);

        const syncAllDisplays = () => {
            const bpm = this.metronome.bpm;
            if (bpmSlider) bpmSlider.value = bpm;
            if (bpmDisplay) bpmDisplay.textContent = bpm;
            if (quickMetroBpmDisplay) quickMetroBpmDisplay.textContent = `${bpm} BPM`;
            if (tempoNameDisplay) tempoNameDisplay.textContent = `${getTempoName(bpm)} (${bpm})`;
        };

        syncAllDisplays();

        const handleMetroToggle = async () => {
            await this.metronome.toggle();
        };

        if (toggleBtn) toggleBtn.addEventListener("click", handleMetroToggle);
        if (quickMetroBtn) quickMetroBtn.addEventListener("click", handleMetroToggle);

        if (quickMetroMinusBtn) {
            quickMetroMinusBtn.addEventListener("click", () => {
                this.metronome.setBpm(this.metronome.bpm - 5);
                syncAllDisplays();
            });
        }

        if (quickMetroPlusBtn) {
            quickMetroPlusBtn.addEventListener("click", () => {
                this.metronome.setBpm(this.metronome.bpm + 5);
                syncAllDisplays();
            });
        }

        if (openFullMetroBtn) {
            openFullMetroBtn.addEventListener("click", () => {
                if (this.navigation) {
                    this.navigation.switchView("tools");
                    this.navigation.switchTool("metronome");
                }
            });
        }

        if (bpmSlider) {
            bpmSlider.addEventListener("input", (e) => {
                const bpm = Number(e.target.value);
                this.metronome.setBpm(bpm);
                syncAllDisplays();
            });
        }

        // BPM step buttons (-5, -1, +1, +5)
        document.querySelectorAll("[data-bpm-step]").forEach(btn => {
            btn.addEventListener("click", () => {
                const step = Number(btn.dataset.bpmStep);
                this.metronome.setBpm(this.metronome.bpm + step);
                syncAllDisplays();
            });
        });

        // Italian tempo preset buttons
        document.querySelectorAll("[data-bpm-preset]").forEach(btn => {
            btn.addEventListener("click", () => {
                const targetBpm = Number(btn.dataset.bpmPreset);
                this.metronome.setBpm(targetBpm);
                syncAllDisplays();
            });
        });

        if (tapBtn) {
            tapBtn.addEventListener("click", () => {
                this.metronome.tap();
                syncAllDisplays();
            });
        }

        if (timeSigSelect) {
            timeSigSelect.addEventListener("change", (e) => {
                const beats = Number(e.target.value);
                this.metronome.setTimeSignature(beats);
                updateDots(beats);
            });
        }

        if (soundSelect) {
            soundSelect.addEventListener("change", (e) => {
                this.metronome.setSoundType(e.target.value);
            });
        }

        // Metronome beat ticks (visual animation synchronized to Web Audio clock)
        this.metronome.onBeatTick = (beatNumber, isDownbeat) => {
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll(".metro-dot");
                dots.forEach((dot, idx) => {
                    dot.classList.toggle("active", idx === beatNumber);
                });
            }

            // Pulse top toolbar button
            if (quickMetroBtn) {
                quickMetroBtn.classList.remove("beat-flash", "downbeat-flash");
                void quickMetroBtn.offsetWidth;
                quickMetroBtn.classList.add(isDownbeat ? "downbeat-flash" : "beat-flash");
            }
        };

        // State change listener
        this.metronome.onStateChange = () => {
            const isRunning = this.metronome.isRunning;

            if (toggleBtn) {
                toggleBtn.classList.toggle("active", isRunning);
                toggleBtn.innerHTML = isRunning ? `<span>⏹</span> Stop Metronome` : `<span>▶</span> Start Metronome`;
            }

            if (quickMetroBtn) {
                quickMetroBtn.classList.toggle("active", isRunning);
            }

            if (quickMetroStrip) {
                quickMetroStrip.classList.toggle("is-active", isRunning);
            }

            syncAllDisplays();
        };
    }

    async setupMidiUI() {
        const midiPill = document.getElementById("midiStatusPill");
        const midiSupported = await this.midi.init();

        const updateMidiPill = (devices) => {
            if (!midiPill) return;
            if (!midiSupported) {
                midiPill.textContent = "MIDI Unavailable";
                midiPill.className = "status-pill pill-neutral";
                midiPill.title = "Web MIDI API not supported in this browser (Chrome / Edge recommended)";
            } else if (devices && devices.length > 0) {
                midiPill.textContent = `MIDI Connected (${devices.length})`;
                midiPill.className = "status-pill pill-success";
                midiPill.title = `Connected: ${devices.map(d => d.name).join(", ")}`;
            } else {
                midiPill.textContent = "MIDI Ready";
                midiPill.className = "status-pill pill-ready";
                midiPill.title = "No MIDI keyboard connected yet. Plug in any USB MIDI keyboard!";
            }
        };

        updateMidiPill(this.midi.connectedDevices);
        this.midi.onDevicesChanged = (devices) => {
            updateMidiPill(devices);
        };
    }
}

// Instantiate and launch when DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    const app = new KesareApp();
    app.init();
    window.__KESARE__ = app; // Expose for testing and debugging
});

