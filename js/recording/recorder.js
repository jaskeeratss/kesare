/**
 * KESARE Piano Studio — Studio Recording & Playback Controller
 * High-precision note event recording, timing calculation, and session management.
 */

import { recordingStorage } from "./storage.js";
import { exportToWav } from "./wav-exporter.js";
import { exportToMidi } from "./midi-exporter.js";
import { audioEngine } from "../audio/audio-engine.js";

export const REC_STATES = {
    IDLE: "idle",
    RECORDING: "recording",
    PAUSED: "paused",
    PLAYING: "playing"
};

export class StudioRecorder {
    constructor(pianoKeyboard) {
        this.keyboard = pianoKeyboard;
        this.state = REC_STATES.IDLE;

        this.notes = [];
        this.activeNotes = new Map(); // midi -> { midi, time, velocity }

        this.recordStartTime = 0;
        this.pauseStartTime = 0;
        this.accumulatedPauseTime = 0;

        // Playback state
        this.playbackTimeouts = [];
        this.playbackActiveNotes = new Set();
        this.currentPlaybackRecording = null;

        // UI state change listeners
        this.listeners = new Set();

        // Connect keyboard hooks
        this.keyboard.addNoteOnListener((midi, velocity) => {
            this.handleNoteOn(midi, velocity);
        });

        this.keyboard.addNoteOffListener((midi) => {
            this.handleNoteOff(midi);
        });
    }

    subscribe(fn) {
        this.listeners.add(fn);
        fn(this.state, this.getStats());
    }

    notify() {
        this.listeners.forEach(fn => {
            try { fn(this.state, this.getStats()); } catch {}
        });
    }

    getStats() {
        return {
            noteCount: this.notes.length + this.activeNotes.size,
            durationMs: this.getElapsedRecordingTime(),
            instrument: audioEngine.currentInstrument
        };
    }

    getElapsedRecordingTime() {
        if (this.state === REC_STATES.IDLE) return 0;
        if (this.state === REC_STATES.PAUSED) {
            return this.pauseStartTime - this.recordStartTime - this.accumulatedPauseTime;
        }
        return performance.now() - this.recordStartTime - this.accumulatedPauseTime;
    }

    startRecording() {
        if (this.state === REC_STATES.PLAYING) {
            this.stopPlayback();
        }

        this.notes = [];
        this.activeNotes.clear();
        this.accumulatedPauseTime = 0;
        this.recordStartTime = performance.now();
        this.state = REC_STATES.RECORDING;
        this.notify();
    }

    pauseRecording() {
        if (this.state !== REC_STATES.RECORDING) return;
        this.pauseStartTime = performance.now();
        this.state = REC_STATES.PAUSED;
        this.notify();
    }

    resumeRecording() {
        if (this.state !== REC_STATES.PAUSED) return;
        this.accumulatedPauseTime += (performance.now() - this.pauseStartTime);
        this.state = REC_STATES.RECORDING;
        this.notify();
    }

    async stopRecording(save = true, customTitle = "") {
        if (this.state !== REC_STATES.RECORDING && this.state !== REC_STATES.PAUSED) {
            return null;
        }

        const elapsed = this.getElapsedRecordingTime();

        // Close any notes that were still sounding when recording ended
        this.activeNotes.forEach((pendingNote, midi) => {
            pendingNote.duration = Math.max(100, elapsed - pendingNote.time);
            this.notes.push(pendingNote);
        });
        this.activeNotes.clear();

        this.state = REC_STATES.IDLE;
        this.notify();

        if (!save || this.notes.length === 0) {
            return null;
        }

        // Generate default title
        const date = new Date();
        const defaultTitle = customTitle || `Studio Session ${date.toLocaleDateString([], { month: "short", day: "numeric" })} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

        const recordingRecord = {
            id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            title: defaultTitle,
            createdAt: Date.now(),
            duration: elapsed,
            noteCount: this.notes.length,
            instrument: audioEngine.currentInstrument,
            notes: [...this.notes]
        };

        await recordingStorage.save(recordingRecord);
        return recordingRecord;
    }

    handleNoteOn(midi, velocity) {
        if (this.state !== REC_STATES.RECORDING) return;

        const time = this.getElapsedRecordingTime();
        this.activeNotes.set(midi, {
            midi,
            time,
            velocity: velocity || 0.8,
            duration: 0,
            instrument: audioEngine.currentInstrument
        });
        this.notify();
    }

    handleNoteOff(midi) {
        if (this.state !== REC_STATES.RECORDING) return;

        const pending = this.activeNotes.get(midi);
        if (pending) {
            const currentTime = this.getElapsedRecordingTime();
            pending.duration = Math.max(80, currentTime - pending.time);
            this.notes.push(pending);
            this.activeNotes.delete(midi);
            this.notify();
        }
    }

    // -------------------------------------------------------------
    // PLAYBACK CONTROLLER
    // -------------------------------------------------------------
    playRecording(recording, onProgress = null, onFinish = null) {
        if (!recording || !recording.notes || recording.notes.length === 0) return;

        this.stopPlayback();
        this.state = REC_STATES.PLAYING;
        this.currentPlaybackRecording = recording;
        this.notify();

        const notes = recording.notes;
        const totalDuration = recording.duration || notes[notes.length - 1].time + 1000;
        const startTime = performance.now();

        // Schedule all note-on and note-off events
        notes.forEach(note => {
            // Note On
            const onId = setTimeout(() => {
                if (this.state !== REC_STATES.PLAYING) return;
                audioEngine.playNote(note.midi, note.velocity || 0.8, note.instrument || recording.instrument);
                this.keyboard.renderer.setKeyPressed(note.midi, true);
                this.playbackActiveNotes.add(note.midi);
            }, note.time);

            // Note Off
            const offId = setTimeout(() => {
                if (this.state !== REC_STATES.PLAYING) return;
                audioEngine.stopNote(note.midi);
                this.keyboard.renderer.setKeyPressed(note.midi, false);
                this.playbackActiveNotes.delete(note.midi);
            }, note.time + (note.duration || 400));

            this.playbackTimeouts.push(onId, offId);
        });

        // Finish timeout
        const finishId = setTimeout(() => {
            this.stopPlayback();
            if (onFinish) onFinish();
        }, totalDuration + 200);

        this.playbackTimeouts.push(finishId);
    }

    stopPlayback() {
        this.playbackTimeouts.forEach(id => clearTimeout(id));
        this.playbackTimeouts = [];

        this.playbackActiveNotes.forEach(midi => {
            audioEngine.stopNote(midi, true);
            this.keyboard.renderer.setKeyPressed(midi, false);
        });
        this.playbackActiveNotes.clear();

        if (this.state === REC_STATES.PLAYING) {
            this.state = REC_STATES.IDLE;
            this.currentPlaybackRecording = null;
            this.notify();
        }
    }

    // -------------------------------------------------------------
    // EXPORT HANDLERS
    // -------------------------------------------------------------
    async exportRecordingToWav(recording) {
        if (!recording || !recording.notes || recording.notes.length === 0) {
            throw new Error("No notes recorded");
        }
        return await exportToWav(recording.notes, recording.instrument || audioEngine.currentInstrument, recording.title);
    }

    exportRecordingToMidi(recording) {
        if (!recording || !recording.notes || recording.notes.length === 0) {
            throw new Error("No notes recorded");
        }
        return exportToMidi(recording.notes, recording.title, 120, recording.instrument || audioEngine.currentInstrument);
    }
}

