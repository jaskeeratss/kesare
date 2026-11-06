/**
 * KESARE Piano Studio — Settings & Preferences Manager
 * Local user configuration, tuning calibration, and keyboard modes.
 */

import { audioEngine } from "../audio/audio-engine.js";

const SETTINGS_KEY = "kesare_studio_settings_v1";

const DEFAULT_SETTINGS = {
    keyboardMode: "61",
    labelMode: "both",
    tuning: 440,
    velocityMode: "medium",
    reverb: 30,
    visualizerMode: "bars"
};

export class SettingsModal {
    constructor(pianoKeyboard, visualizer) {
        this.keyboard = pianoKeyboard;
        this.visualizer = visualizer;
        this.settings = { ...DEFAULT_SETTINGS };
        this.modalEl = null;
    }

    init() {
        this.loadSettings();
        this.modalEl = document.getElementById("settingsModal");
        this.setupEventListeners();
        this.applySettings();
    }

    loadSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (raw) {
                this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
            }
        } catch {
            this.settings = { ...DEFAULT_SETTINGS };
        }
    }

    saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
        } catch {}
    }

    setupEventListeners() {
        const openBtn = document.getElementById("openSettingsBtn");
        const closeBtn = document.getElementById("closeSettingsBtn");
        const backdrop = document.getElementById("settingsModalBackdrop");
        const resetBtn = document.getElementById("resetSettingsBtn");

        if (openBtn) {
            openBtn.addEventListener("click", () => this.open());
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", () => this.close());
        }

        if (backdrop) {
            backdrop.addEventListener("click", () => this.close());
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                if (confirm("Reset all studio settings to factory defaults?")) {
                    this.settings = { ...DEFAULT_SETTINGS };
                    this.saveSettings();
                    this.applySettings();
                    this.syncUI();
                }
            });
        }

        // Keyboard mode selector
        const modeSelect = document.getElementById("settingKeyboardMode");
        if (modeSelect) {
            modeSelect.addEventListener("change", (e) => {
                this.settings.keyboardMode = e.target.value;
                this.keyboard.renderer.setMode(this.settings.keyboardMode);
                this.keyboard.centerOnMiddleC();
                this.saveSettings();
            });
        }

        // Key labels selector
        const labelSelect = document.getElementById("settingKeyLabels");
        if (labelSelect) {
            labelSelect.addEventListener("change", (e) => {
                this.settings.labelMode = e.target.value;
                this.keyboard.renderer.setLabelMode(this.settings.labelMode);
                this.saveSettings();
            });
        }

        // Tuning calibration
        const tuningSelect = document.getElementById("settingTuning");
        if (tuningSelect) {
            tuningSelect.addEventListener("change", (e) => {
                this.settings.tuning = Number(e.target.value);
                audioEngine.setA4Tuning(this.settings.tuning);
                this.saveSettings();
            });
        }

        // Touch sensitivity
        const velSelect = document.getElementById("settingVelocity");
        if (velSelect) {
            velSelect.addEventListener("change", (e) => {
                this.settings.velocityMode = e.target.value;
                this.keyboard.setVelocityMode(this.settings.velocityMode);
                this.saveSettings();
            });
        }

        // Reverb slider
        const reverbSlider = document.getElementById("settingReverb");
        if (reverbSlider) {
            reverbSlider.addEventListener("input", (e) => {
                this.settings.reverb = Number(e.target.value);
                if (audioEngine.masterChain) {
                    audioEngine.masterChain.setReverbAmount(this.settings.reverb / 100);
                }
                this.saveSettings();
            });
        }

        // Visualizer Mode
        const visModeSelect = document.getElementById("settingVisMode");
        if (visModeSelect) {
            visModeSelect.addEventListener("change", (e) => {
                this.settings.visualizerMode = e.target.value;
                if (this.visualizer) {
                    this.visualizer.setMode(this.settings.visualizerMode);
                }
                this.saveSettings();
            });
        }
    }

    applySettings() {
        if (this.keyboard) {
            this.keyboard.renderer.setMode(this.settings.keyboardMode);
            this.keyboard.renderer.setLabelMode(this.settings.labelMode);
            this.keyboard.setVelocityMode(this.settings.velocityMode);
        }
        audioEngine.setA4Tuning(this.settings.tuning);
        if (audioEngine.masterChain) {
            audioEngine.masterChain.setReverbAmount(this.settings.reverb / 100);
        }
        if (this.visualizer) {
            this.visualizer.setMode(this.settings.visualizerMode);
        }
        this.syncUI();
    }

    syncUI() {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val;
        };
        setVal("settingKeyboardMode", this.settings.keyboardMode);
        setVal("settingKeyLabels", this.settings.labelMode);
        setVal("settingTuning", this.settings.tuning);
        setVal("settingVelocity", this.settings.velocityMode);
        setVal("settingReverb", this.settings.reverb);
        setVal("settingVisMode", this.settings.visualizerMode);
    }

    open() {
        if (this.modalEl) {
            this.modalEl.classList.add("is-visible");
            this.syncUI();
        }
    }

    close() {
        if (this.modalEl) {
            this.modalEl.classList.remove("is-visible");
        }
    }
}
