/**
 * KESARE Piano Studio — Studio Music Notepad
 * Songwriting ideas, chord chart sketchpad, and local persistence.
 */

const STORAGE_KEY = "kesare_music_notepad_v1";

export class MusicNotepad {
    constructor() {
        this.notes = [];
        this.activeNoteId = null;
    }

    init() {
        this.loadNotes();
        this.setupUI();
        if (this.notes.length === 0) {
            this.createNote("Melody Ideas in C", "Intro:\n[C] [G] [Am] [F]\n\nVerse 1:\nWalking down the evening street\nMelody beneath my feet\n[Dm7] [G7] [C]\n\nChorus:\nSing it loud, sing it clear\n[Am] [F] [G] [C]");
        } else {
            this.selectNote(this.notes[0].id);
        }
    }

    loadNotes() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            this.notes = raw ? JSON.parse(raw) : [];
        } catch {
            this.notes = [];
        }
    }

    saveNotes() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes));
        } catch {}
    }

    setupUI() {
        const titleInput = document.getElementById("notepadTitle");
        const textarea = document.getElementById("notepadTextarea");
        const newBtn = document.getElementById("notepadNewBtn");
        const deleteBtn = document.getElementById("notepadDeleteBtn");
        const exportBtn = document.getElementById("notepadExportBtn");
        const chordPills = document.querySelectorAll(".notepad-chord-pill");

        if (titleInput) {
            titleInput.addEventListener("input", (e) => {
                const note = this.getActiveNote();
                if (note) {
                    note.title = e.target.value || "Untitled Note";
                    note.updatedAt = Date.now();
                    this.saveNotes();
                    this.renderNoteList();
                }
            });
        }

        if (textarea) {
            textarea.addEventListener("input", (e) => {
                const note = this.getActiveNote();
                if (note) {
                    note.content = e.target.value;
                    note.updatedAt = Date.now();
                    this.saveNotes();
                }
            });
        }

        if (newBtn) {
            newBtn.addEventListener("click", () => {
                this.createNote();
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener("click", () => {
                if (confirm("Delete this musical note?")) {
                    this.deleteActiveNote();
                }
            });
        }

        if (exportBtn) {
            exportBtn.addEventListener("click", () => {
                this.exportActiveNote();
            });
        }

        // Quick chord insert pills
        chordPills.forEach(pill => {
            pill.addEventListener("click", () => {
                const chord = pill.dataset.chord;
                if (!textarea) return;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const text = textarea.value;
                const insert = `[${chord}] `;
                textarea.value = text.substring(0, start) + insert + text.substring(end);
                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = start + insert.length;

                const note = this.getActiveNote();
                if (note) {
                    note.content = textarea.value;
                    this.saveNotes();
                }
            });
        });
    }

    createNote(title = "New Song Sketch", content = "") {
        const newNote = {
            id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            title,
            content,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        this.notes.unshift(newNote);
        this.saveNotes();
        this.selectNote(newNote.id);
    }

    deleteActiveNote() {
        if (!this.activeNoteId) return;
        this.notes = this.notes.filter(n => n.id !== this.activeNoteId);
        this.saveNotes();
        if (this.notes.length > 0) {
            this.selectNote(this.notes[0].id);
        } else {
            this.createNote();
        }
    }

    selectNote(id) {
        this.activeNoteId = id;
        const note = this.getActiveNote();
        const titleInput = document.getElementById("notepadTitle");
        const textarea = document.getElementById("notepadTextarea");

        if (note) {
            if (titleInput) titleInput.value = note.title;
            if (textarea) textarea.value = note.content;
        }

        this.renderNoteList();
    }

    getActiveNote() {
        return this.notes.find(n => n.id === this.activeNoteId) || null;
    }

    renderNoteList() {
        const listEl = document.getElementById("notepadNotesList");
        if (!listEl) return;

        listEl.innerHTML = this.notes.map(note => {
            const isActive = note.id === this.activeNoteId;
            const dateStr = new Date(note.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" });
            return `
            <div class="notepad-item ${isActive ? 'active' : ''}" data-id="${note.id}">
                <strong class="notepad-item-title">${note.title || 'Untitled Note'}</strong>
                <span class="notepad-item-date">${dateStr}</span>
            </div>
            `;
        }).join("");

        listEl.querySelectorAll(".notepad-item").forEach(item => {
            item.addEventListener("click", () => {
                this.selectNote(item.dataset.id);
            });
        });
    }

    exportActiveNote() {
        const note = this.getActiveNote();
        if (!note) return;

        const blob = new Blob([`${note.title}\n\n${note.content}`], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, "_") || "music_note"}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
}
