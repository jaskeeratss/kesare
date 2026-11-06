/**
 * KESARE Piano Studio — Interactive Piano Controller
 * Multi-touch, mouse glissando, physical keyboard mapping, and octave transposing.
 */

import { KeyRenderer } from "./key-renderer.js";
import {
    DEFAULT_WHITE_SHORTCUTS,
    DEFAULT_BLACK_SHORTCUTS
} from "../config/keyboard-map.js";
import { audioEngine } from "../audio/audio-engine.js";

export class PianoKeyboard {
    constructor(scrollContainer, keysContainer) {
        this.scrollContainer = scrollContainer;
        this.keysContainer = keysContainer;
        this.renderer = new KeyRenderer(keysContainer);

        this.octaveShift = 0; // -2 to +2 octaves (-24 to +24 semitones)
        this.velocityMode = "medium"; // 'soft' (0.5), 'medium' (0.8), 'hard' (1.0), 'dynamic'
        this.fixedVelocity = 0.8;

        this.activePointers = new Map(); // pointerId -> midi
        this.pressedPhysicalKeys = new Map(); // physical key string -> midi
        this.pressedMidis = new Set();

        // Callback listeners (for recorder, learning system, visualizer)
        this.noteOnListeners = new Set();
        this.noteOffListeners = new Set();

        this.init();
    }

    init() {
        this.renderer.render();
        this.setupPointerEvents();
        this.setupKeyboardEvents();
        this.setupSafetyListeners();

        // Initial horizontal centering on Middle C
        requestAnimationFrame(() => {
            this.centerOnMiddleC();
        });
    }

    /**
     * Subscribe to note on / off events
     */
    addNoteOnListener(fn) { this.noteOnListeners.add(fn); }
    removeNoteOnListener(fn) { this.noteOnListeners.delete(fn); }

    addNoteOffListener(fn) { this.noteOffListeners.add(fn); }
    removeNoteOffListener(fn) { this.noteOffListeners.delete(fn); }

    emitNoteOn(midi, velocity, source = "mouse") {
        audioEngine.playNote(midi, velocity);
        this.renderer.setKeyPressed(midi, true);
        this.pressedMidis.add(midi);

        this.noteOnListeners.forEach(fn => {
            try { fn(midi, velocity, source); } catch {}
        });
    }

    emitNoteOff(midi, source = "mouse") {
        audioEngine.stopNote(midi);
        this.renderer.setKeyPressed(midi, false);
        this.pressedMidis.delete(midi);

        this.noteOffListeners.forEach(fn => {
            try { fn(midi, source); } catch {}
        });
    }

    /**
     * Center the scrollable keyboard container on Middle C (MIDI 60)
     */
    centerOnMiddleC() {
        if (!this.scrollContainer) return;
        const middleCEl = this.renderer.getKeyElement(60);
        if (middleCEl) {
            const containerWidth = this.scrollContainer.clientWidth;
            const keyLeft = middleCEl.offsetLeft;
            const keyWidth = middleCEl.offsetWidth;
            const scrollTarget = keyLeft - (containerWidth / 2) + (keyWidth / 2);

            this.scrollContainer.scrollTo({
                left: Math.max(0, scrollTarget),
                behavior: "smooth"
            });
        }
    }

    setOctaveShift(shift) {
        const clamped = Math.max(-2, Math.min(2, shift));
        if (this.octaveShift !== clamped) {
            // Release any currently sounding notes before shifting
            this.releaseAll();
            this.octaveShift = clamped;
        }
        return this.octaveShift;
    }

    setVelocityMode(mode) {
        this.velocityMode = mode;
        if (mode === "soft") this.fixedVelocity = 0.55;
        else if (mode === "hard") this.fixedVelocity = 1.0;
        else this.fixedVelocity = 0.8;
    }

    calculateVelocity(event) {
        if (this.velocityMode !== "dynamic") return this.fixedVelocity;

        // Dynamic velocity simulation from click / touch position along key
        if (event && event.currentTarget && event.offsetY !== undefined) {
            const rect = event.currentTarget.getBoundingClientRect();
            // Hitting further down key = louder stroke
            const ratio = Math.max(0.2, Math.min(1.0, (event.clientY - rect.top) / rect.height));
            return 0.4 + (ratio * 0.6);
        }
        return this.fixedVelocity;
    }

    // -------------------------------------------------------------
    // POINTER & TOUCH HANDLING
    // -------------------------------------------------------------
    setupPointerEvents() {
        const container = this.keysContainer;

        const getMidiFromEvent = (e) => {
            const target = document.elementFromPoint(e.clientX, e.clientY);
            if (!target) return null;
            const keyEl = target.closest(".piano-key");
            return keyEl ? Number(keyEl.dataset.midi) : null;
        };

        container.addEventListener("pointerdown", (e) => {
            const keyEl = e.target.closest(".piano-key");
            if (!keyEl) return;
            e.preventDefault();

            const midi = Number(keyEl.dataset.midi);
            const velocity = this.calculateVelocity(e);

            this.activePointers.set(e.pointerId, midi);
            this.emitNoteOn(midi, velocity, "pointer");
        });

        // Glissando / slide across keys when dragging
        container.addEventListener("pointermove", (e) => {
            if (!this.activePointers.has(e.pointerId)) return;
            const currentMidi = this.activePointers.get(e.pointerId);
            const newMidi = getMidiFromEvent(e);

            if (newMidi && newMidi !== currentMidi) {
                this.emitNoteOff(currentMidi, "pointer");
                this.activePointers.set(e.pointerId, newMidi);
                this.emitNoteOn(newMidi, this.fixedVelocity, "pointer");
            }
        });

        const handlePointerEnd = (e) => {
            if (this.activePointers.has(e.pointerId)) {
                const midi = this.activePointers.get(e.pointerId);
                this.emitNoteOff(midi, "pointer");
                this.activePointers.delete(e.pointerId);
            }
        };

        window.addEventListener("pointerup", handlePointerEnd);
        window.addEventListener("pointercancel", handlePointerEnd);
    }

    // -------------------------------------------------------------
    // PHYSICAL COMPUTER KEYBOARD HANDLING
    // -------------------------------------------------------------
    setupKeyboardEvents() {
        // Build reverse lookup maps
        const baseKeyToMidi = new Map();
        Object.entries(DEFAULT_WHITE_SHORTCUTS).forEach(([midi, key]) => {
            baseKeyToMidi.set(key.toLowerCase(), Number(midi));
        });
        Object.entries(DEFAULT_BLACK_SHORTCUTS).forEach(([midi, key]) => {
            baseKeyToMidi.set(key.toLowerCase(), Number(midi));
        });

        window.addEventListener("keydown", (e) => {
            // Ignore keystrokes inside text inputs, textareas, or select dropdowns
            if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA" ||
                e.target.tagName === "SELECT" ||
                e.target.isContentEditable
            ) {
                return;
            }

            // Spacebar toggles sustain pedal
            if (e.code === "Space") {
                e.preventDefault();
                audioEngine.setSustain(!audioEngine.sustain);
                const sustainBtn = document.getElementById("sustainBtn");
                if (sustainBtn) sustainBtn.classList.toggle("active", audioEngine.sustain);
                return;
            }

            // Octave shift shortcuts: '[' to shift down, ']' to shift up
            if (e.key === "[") {
                e.preventDefault();
                this.setOctaveShift(this.octaveShift - 1);
                this.updateOctaveDisplay();
                return;
            }
            if (e.key === "]") {
                e.preventDefault();
                this.setOctaveShift(this.octaveShift + 1);
                this.updateOctaveDisplay();
                return;
            }

            const rawKey = e.key.toLowerCase();
            if (!baseKeyToMidi.has(rawKey)) return;

            // Prevent repetitive triggers when key is held down
            if (e.repeat) return;
            e.preventDefault();

            const baseMidi = baseKeyToMidi.get(rawKey);
            const shiftedMidi = baseMidi + (this.octaveShift * 12);

            // Bounds check
            if (shiftedMidi < this.renderer.mode.startMidi || shiftedMidi > this.renderer.mode.endMidi) {
                return;
            }

            this.pressedPhysicalKeys.set(rawKey, shiftedMidi);
            this.emitNoteOn(shiftedMidi, this.fixedVelocity, "keyboard");
        });

        window.addEventListener("keyup", (e) => {
            const rawKey = e.key.toLowerCase();
            if (this.pressedPhysicalKeys.has(rawKey)) {
                const midi = this.pressedPhysicalKeys.get(rawKey);
                this.emitNoteOff(midi, "keyboard");
                this.pressedPhysicalKeys.delete(rawKey);
            }
        });
    }

    updateOctaveDisplay() {
        const display = document.getElementById("octaveDisplay");
        if (display) {
            display.textContent = this.octaveShift > 0 ? `+${this.octaveShift}` : `${this.octaveShift}`;
        }
    }

    // -------------------------------------------------------------
    // SAFETY: PREVENT STUCK NOTES
    // -------------------------------------------------------------
    setupSafetyListeners() {
        // When tab is blurred, window loses focus, or app hidden: kill all notes
        const clearAll = () => this.releaseAll();
        window.addEventListener("blur", clearAll);
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) clearAll();
        });
    }

    releaseAll() {
        this.activePointers.clear();
        this.pressedPhysicalKeys.clear();

        this.pressedMidis.forEach(midi => {
            this.renderer.setKeyPressed(midi, false);
            audioEngine.stopNote(midi, true);
            this.noteOffListeners.forEach(fn => {
                try { fn(midi, "safety"); } catch {}
            });
        });
        this.pressedMidis.clear();
    }
}
