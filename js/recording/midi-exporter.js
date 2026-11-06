/**
 * KESARE Piano Studio — Standard MIDI File (SMF Format 0) Exporter
 * Generates valid .mid binary files with standard tempo, division, and note events.
 */

import { getInstrumentPreset } from "../audio/instrument-library.js";

/**
 * Encode an integer as a MIDI Variable-Length Quantity (VLQ) byte array
 */
function toVLQ(value) {
    let val = Math.max(0, Math.floor(value));
    const buffer = [];
    buffer.push(val & 0x7F);
    val >>= 7;

    while (val > 0) {
        buffer.unshift((val & 0x7F) | 0x80);
        val >>= 7;
    }
    return buffer;
}

/**
 * Export notes array to standard MIDI file and trigger browser download
 */
export function exportToMidi(notes, title = "KESARE_Performance", bpm = 120, instrumentId = "concert-grand") {
    if (!notes || notes.length === 0) {
        throw new Error("No notes to export");
    }

    const ppq = 480; // Ticks per quarter note
    const msPerQuarter = (60 / bpm) * 1000;
    const msToTicks = (ms) => Math.round((ms / msPerQuarter) * ppq);

    // Build timeline of events: Note-On (0x90) and Note-Off (0x80)
    const rawEvents = [];

    notes.forEach(n => {
        const startTick = msToTicks(n.time);
        const durationTicks = Math.max(20, msToTicks(n.duration || 400));
        const endTick = startTick + durationTicks;
        const vel = Math.max(1, Math.min(127, Math.round((n.velocity || 0.8) * 127)));
        const midi = Math.max(0, Math.min(127, n.midi));

        rawEvents.push({
            tick: startTick,
            type: 0x90, // Note On
            midi,
            velocity: vel
        });

        rawEvents.push({
            tick: endTick,
            type: 0x80, // Note Off
            midi,
            velocity: 64
        });
    });

    // Sort chronologically. If simultaneous, note-off comes before note-on
    rawEvents.sort((a, b) => {
        if (a.tick !== b.tick) return a.tick - b.tick;
        return a.type - b.type;
    });

    // Build track data bytes
    const trackBytes = [];

    // Helper to push bytes
    const pushBytes = (...bytes) => trackBytes.push(...bytes);

    // 1. Time Signature: 4/4 (Delta 0)
    pushBytes(0x00, 0xFF, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08);

    // 2. Set Tempo: 120 BPM (500,000 microseconds per quarter note) (Delta 0)
    const usPerBeat = Math.round(60000000 / bpm);
    pushBytes(
        0x00, 0xFF, 0x51, 0x03,
        (usPerBeat >> 16) & 0xFF,
        (usPerBeat >> 8) & 0xFF,
        usPerBeat & 0xFF
    );

    // 3. Track Name Meta Event
    const titleBytes = Array.from(new TextEncoder().encode(title.substring(0, 32)));
    pushBytes(0x00, 0xFF, 0x03, titleBytes.length, ...titleBytes);

    // 4. MIDI Program Change Event (Select GM Instrument, Delta 0)
    const preset = getInstrumentPreset(instrumentId);
    const gmProgram = preset ? preset.gmProgram : 0;
    pushBytes(0x00, 0xC0, gmProgram);

    // 5. Output Note Events with Delta Times
    let lastTick = 0;
    rawEvents.forEach(ev => {
        const delta = Math.max(0, ev.tick - lastTick);
        lastTick = ev.tick;

        const deltaVlq = toVLQ(delta);
        pushBytes(...deltaVlq, ev.type, ev.midi, ev.velocity);
    });

    // 5. End of Track Meta Event (Delta 0)
    pushBytes(0x00, 0xFF, 0x2F, 0x00);

    // Build complete MIDI file buffer
    const headerBytes = [
        0x4D, 0x54, 0x68, 0x64, // "MThd"
        0x00, 0x00, 0x00, 0x06, // Header length = 6
        0x00, 0x00,             // Format 0 (single track)
        0x00, 0x01,             // 1 Track
        (ppq >> 8) & 0xFF, ppq & 0xFF // Division (PPQ)
    ];

    const trackHeaderBytes = [
        0x4D, 0x54, 0x72, 0x6B, // "MTrk"
        (trackBytes.length >> 24) & 0xFF,
        (trackBytes.length >> 16) & 0xFF,
        (trackBytes.length >> 8) & 0xFF,
        trackBytes.length & 0xFF
    ];

    const fullMidiBytes = new Uint8Array([...headerBytes, ...trackHeaderBytes, ...trackBytes]);
    const midiBlob = new Blob([fullMidiBytes], { type: "audio/midi" });

    // Trigger download
    const safeName = title.replace(/[^a-zA-Z0-9_-]/g, "_") || "KESARE_Recording";
    const downloadUrl = URL.createObjectURL(midiBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${safeName}.mid`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 4000);

    return true;
}

