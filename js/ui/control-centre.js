/**
 * KESARE Piano Studio — Studio Control Centre & Top Toolbar
 * Coordinates instrument selection, volume, sustain pedal, octave shift, and HUD.
 */

import { audioEngine } from "../audio/audio-engine.js";
import { getNoteName, midiToFrequency } from "../config/keyboard-map.js";

export class ControlCentre {
    constructor(pianoKeyboard) {
        this.keyboard = pianoKeyboard;
    }

    init() {
        this.setupInstrumentSelector();
        this.setupVolumeAndMute();
        this.setupSustainPedal();
        this.setupOctaveControls();
        this.setupFullscreen();
        this.setupHud();
    }

    setupInstrumentSelector() {
        const select = document.getElementById("instrumentSelect");
        if (select) {
            select.addEventListener("change", (e) => {
                audioEngine.setInstrument(e.target.value);
            });
        }
    }

    setupVolumeAndMute() {
        const slider = document.getElementById("masterVolumeSlider");
        const muteBtn = document.getElementById("muteBtn");
        const valDisplay = document.getElementById("volumeValueDisplay");

        if (slider) {
            slider.addEventListener("input", (e) => {
                const vol = Number(e.target.value) / 100;
                audioEngine.setVolume(vol);
                if (valDisplay) valDisplay.textContent = `${Math.round(vol * 100)}%`;
                if (muteBtn && audioEngine.isMuted) {
                    audioEngine.setMute(false);
                    muteBtn.classList.remove("muted");
                }
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener("click", () => {
                const isMuted = !audioEngine.isMuted;
                audioEngine.setMute(isMuted);
                muteBtn.classList.toggle("muted", isMuted);
                muteBtn.title = isMuted ? "Unmute Studio" : "Mute Studio";
            });
        }
    }

    setupSustainPedal() {
        const btn = document.getElementById("sustainBtn");
        if (btn) {
            btn.addEventListener("click", () => {
                const active = !audioEngine.sustain;
                audioEngine.setSustain(active);
                btn.classList.toggle("active", active);
            });
        }
    }

    setupOctaveControls() {
        const downBtn = document.getElementById("octaveDownBtn");
        const upBtn = document.getElementById("octaveUpBtn");
        const display = document.getElementById("octaveDisplay");

        const updateUI = () => {
            const shift = this.keyboard.octaveShift;
            if (display) {
                display.textContent = shift > 0 ? `+${shift}` : `${shift}`;
            }
        };

        if (downBtn) {
            downBtn.addEventListener("click", () => {
                this.keyboard.setOctaveShift(this.keyboard.octaveShift - 1);
                updateUI();
            });
        }

        if (upBtn) {
            upBtn.addEventListener("click", () => {
                this.keyboard.setOctaveShift(this.keyboard.octaveShift + 1);
                updateUI();
            });
        }
    }

    setupFullscreen() {
        const fsBtn = document.getElementById("fullscreenBtn");
        if (fsBtn) {
            fsBtn.addEventListener("click", () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                    fsBtn.classList.add("active");
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen().catch(() => {});
                        fsBtn.classList.remove("active");
                    }
                }
            });

            document.addEventListener("fullscreenchange", () => {
                fsBtn.classList.toggle("active", !!document.fullscreenElement);
            });
        }
    }

    setupHud() {
        const noteEl = document.getElementById("currentNoteDisplay");
        const detailsEl = document.getElementById("noteDetailsDisplay");
        const indicator = document.getElementById("noteIndicator");

        this.keyboard.addNoteOnListener((midi) => {
            if (noteEl) noteEl.textContent = getNoteName(midi);
            if (detailsEl) {
                const freq = Math.round(midiToFrequency(midi, audioEngine.a4Tuning));
                detailsEl.textContent = `MIDI ${midi} • ${freq} Hz`;
            }
            if (indicator) {
                indicator.classList.remove("pulsing");
                void indicator.offsetWidth;
                indicator.classList.add("pulsing");
            }
        });
    }
}
