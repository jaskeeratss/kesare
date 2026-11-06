/**
 * KESARE Piano Studio — Piano Key Visual Renderer
 * Dynamically builds 61-key and 88-key piano keyboard layouts with accurate acoustic geometry.
 */

import {
    WHITE_NOTES,
    KEYBOARD_MODES,
    getNoteName,
    DEFAULT_WHITE_SHORTCUTS,
    DEFAULT_BLACK_SHORTCUTS
} from "../config/keyboard-map.js";

export class KeyRenderer {
    constructor(containerElement) {
        this.container = containerElement;
        this.mode = KEYBOARD_MODES.STANDARD_61;
        this.labelMode = "both"; // 'notes', 'shortcuts', 'solfege', 'both', 'none'
        this.whiteKeysMap = new Map(); // midi -> element
        this.blackKeysMap = new Map(); // midi -> element
    }

    setMode(modeKey) {
        this.mode = modeKey === "88" ? KEYBOARD_MODES.FULL_88 : KEYBOARD_MODES.STANDARD_61;
        this.render();
    }

    setLabelMode(labelMode) {
        this.labelMode = labelMode;
        this.updateLabels();
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = "";
        this.whiteKeysMap.clear();
        this.blackKeysMap.clear();

        const { startMidi, endMidi } = this.mode;

        // 1. Collect all white keys
        const whiteNotesList = [];
        for (let midi = startMidi; midi <= endMidi; midi++) {
            if (WHITE_NOTES.includes(midi % 12)) {
                whiteNotesList.push(midi);
            }
        }
        const totalWhiteKeys = whiteNotesList.length;

        // Container wrapper
        const keyboardWrapper = document.createElement("div");
        keyboardWrapper.className = `piano-keys-wrapper mode-${this.mode.id}`;

        // 2. Render White Keys
        whiteNotesList.forEach((midi, index) => {
            const keyEl = document.createElement("div");
            keyEl.className = "piano-key white-key";
            keyEl.dataset.midi = midi;
            keyEl.dataset.pitch = midi % 12;
            keyEl.dataset.type = "white";

            if (midi === 60) {
                keyEl.classList.add("middle-c");
            }

            keyEl.innerHTML = this.buildKeyInnerHtml(midi, "white");
            keyboardWrapper.appendChild(keyEl);
            this.whiteKeysMap.set(midi, keyEl);
        });

        // 3. Render Black Keys with exact acoustic spacing
        // Black key offsets relative to white key width
        const blackOffsets = {
            1: 0.64,  // C# (between C & D)
            3: 0.72,  // D# (between D & E)
            6: 0.62,  // F# (between F & G)
            8: 0.69,  // G# (between G & A)
            10: 0.75  // A# (between A & B)
        };

        for (let midi = startMidi; midi <= endMidi; midi++) {
            const pitch = midi % 12;
            if (WHITE_NOTES.includes(pitch)) continue;

            const precedingWhites = whiteNotesList.filter(n => n < midi).length;
            const offsetMultiplier = blackOffsets[pitch] || 0.68;

            const keyEl = document.createElement("div");
            keyEl.className = "piano-key black-key";
            keyEl.dataset.midi = midi;
            keyEl.dataset.pitch = pitch;
            keyEl.dataset.type = "black";

            // Percentage positioning across keyboard width
            const leftPercent = ((precedingWhites - 1 + offsetMultiplier) / totalWhiteKeys) * 100;
            keyEl.style.left = `${leftPercent}%`;

            keyEl.innerHTML = this.buildKeyInnerHtml(midi, "black");
            keyboardWrapper.appendChild(keyEl);
            this.blackKeysMap.set(midi, keyEl);
        }

        this.container.appendChild(keyboardWrapper);
    }

    buildKeyInnerHtml(midi, type) {
        const noteName = getNoteName(midi);
        const solfege = getNoteName(midi, false, true);
        const shortcut = type === "white" ? DEFAULT_WHITE_SHORTCUTS[midi] : DEFAULT_BLACK_SHORTCUTS[midi];

        let shortcutHtml = "";
        if (shortcut && (this.labelMode === "shortcuts" || this.labelMode === "both")) {
            shortcutHtml = `<span class="key-shortcut" title="Keyboard key: ${shortcut.toUpperCase()}">${shortcut.toUpperCase()}</span>`;
        }

        let noteHtml = "";
        if (this.labelMode === "solfege") {
            noteHtml = `<span class="key-note">${solfege}</span>`;
        } else if (this.labelMode === "notes" || this.labelMode === "both") {
            noteHtml = `<span class="key-note">${noteName}</span>`;
        }

        const middleCDot = midi === 60 ? `<span class="middle-c-marker" title="Middle C (C4)">C4</span>` : "";

        return `${shortcutHtml}${noteHtml}${middleCDot}`;
    }

    updateLabels() {
        this.whiteKeysMap.forEach((el, midi) => {
            el.innerHTML = this.buildKeyInnerHtml(midi, "white");
        });
        this.blackKeysMap.forEach((el, midi) => {
            el.innerHTML = this.buildKeyInnerHtml(midi, "black");
        });
    }

    setKeyPressed(midi, isPressed) {
        const el = this.whiteKeysMap.get(midi) || this.blackKeysMap.get(midi);
        if (el) {
            if (isPressed) {
                el.classList.add("is-pressed");
            } else {
                el.classList.remove("is-pressed");
            }
        }
    }

    highlightNote(midi, className = "highlight-guide") {
        const el = this.whiteKeysMap.get(midi) || this.blackKeysMap.get(midi);
        if (el) {
            el.classList.add(className);
        }
    }

    clearHighlights(className = "") {
        const selector = className ? `.${className}` : ".highlight-guide, .highlight-chord, .highlight-scale, .highlight-root";
        const highlighted = this.container.querySelectorAll(selector);
        highlighted.forEach(el => {
            if (className) {
                el.classList.remove(className);
            } else {
                el.classList.remove("highlight-guide", "highlight-chord", "highlight-scale", "highlight-root");
            }
        });
    }

    getKeyElement(midi) {
        return this.whiteKeysMap.get(midi) || this.blackKeysMap.get(midi) || null;
    }
}

