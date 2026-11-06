/**
 * KESARE Piano Studio — IndexedDB Recording Storage & Persistence
 * Safe IndexedDB wrapper with localStorage fallback.
 */

const DB_NAME = "KESARE_PianoStudio_DB";
const DB_VERSION = 1;
const STORE_NAME = "recordings";

export class RecordingStorage {
    constructor() {
        this.db = null;
    }

    async init() {
        if (this.db) return this.db;
        if (!("indexedDB" in window)) {
            return null;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                    store.createIndex("createdAt", "createdAt", { unique: false });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.warn("IndexedDB error, falling back to localStorage:", event.target.error);
                resolve(null);
            };
        });
    }

    async getAll() {
        await this.init();
        if (this.db) {
            return new Promise((resolve) => {
                const tx = this.db.transaction(STORE_NAME, "readonly");
                const store = tx.objectStore(STORE_NAME);
                const req = store.getAll();
                req.onsuccess = () => {
                    const list = req.result || [];
                    list.sort((a, b) => b.createdAt - a.createdAt);
                    resolve(list);
                };
                req.onerror = () => resolve(this.getAllFallback());
            });
        }
        return this.getAllFallback();
    }

    async save(recording) {
        await this.init();
        if (this.db) {
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction(STORE_NAME, "readwrite");
                const store = tx.objectStore(STORE_NAME);
                const req = store.put(recording);
                req.onsuccess = () => resolve(recording);
                req.onerror = () => {
                    this.saveFallback(recording);
                    resolve(recording);
                };
            });
        }
        this.saveFallback(recording);
        return recording;
    }

    async delete(id) {
        await this.init();
        if (this.db) {
            return new Promise((resolve) => {
                const tx = this.db.transaction(STORE_NAME, "readwrite");
                const store = tx.objectStore(STORE_NAME);
                const req = store.delete(id);
                req.onsuccess = () => resolve(true);
                req.onerror = () => {
                    this.deleteFallback(id);
                    resolve(true);
                };
            });
        }
        this.deleteFallback(id);
        return true;
    }

    // -------------------------------------------------------------
    // LOCALSTORAGE FALLBACK
    // -------------------------------------------------------------
    getAllFallback() {
        try {
            const raw = localStorage.getItem("kesare_recordings");
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    saveFallback(recording) {
        try {
            const list = this.getAllFallback();
            const index = list.findIndex(r => r.id === recording.id);
            if (index >= 0) {
                list[index] = recording;
            } else {
                list.unshift(recording);
            }
            localStorage.setItem("kesare_recordings", JSON.stringify(list));
        } catch {}
    }

    deleteFallback(id) {
        try {
            const list = this.getAllFallback().filter(r => r.id !== id);
            localStorage.setItem("kesare_recordings", JSON.stringify(list));
        } catch {}
    }
}

export const recordingStorage = new RecordingStorage();

