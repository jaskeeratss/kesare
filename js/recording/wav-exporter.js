/**
 * KESARE Piano Studio — Professional WAV Audio Exporter
 * Renders performance offline via OfflineAudioContext and encodes to 16-bit PCM RIFF WAV.
 */

import { INSTRUMENTS } from "../audio/sound-profiles.js";
import { midiToFrequency } from "../config/keyboard-map.js";

/**
 * Encodes an AudioBuffer into standard 16-bit PCM Stereo WAV binary blob
 */
export function audioBufferToWavBlob(audioBuffer) {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const left = audioBuffer.getChannelData(0);
    const right = numChannels > 1 ? audioBuffer.getChannelData(1) : left;
    const numSamples = left.length;
    const dataByteLength = numSamples * blockAlign;
    const buffer = new ArrayBuffer(44 + dataByteLength);
    const view = new DataView(buffer);

    function writeString(offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    // RIFF chunk descriptor
    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataByteLength, true);
    writeString(8, "WAVE");

    // "fmt " sub-chunk
    writeString(12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, format, true); // AudioFormat 1 = PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);

    // "data" sub-chunk
    writeString(36, "data");
    view.setUint32(40, dataByteLength, true);

    // Interleave left and right channels to 16-bit signed PCM
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
        // Left channel sample
        let sLeft = Math.max(-1, Math.min(1, left[i]));
        view.setInt16(offset, sLeft < 0 ? sLeft * 0x8000 : sLeft * 0x7FFF, true);
        offset += 2;

        // Right channel sample
        let sRight = Math.max(-1, Math.min(1, right[i]));
        view.setInt16(offset, sRight < 0 ? sRight * 0x8000 : sRight * 0x7FFF, true);
        offset += 2;
    }

    return new Blob([buffer], { type: "audio/wav" });
}

/**
 * Render recorded notes into a WAV file using Web Audio OfflineAudioContext
 */
export async function exportToWav(notes, instrumentId = "acoustic", title = "KESARE_Performance") {
    if (!notes || notes.length === 0) {
        throw new Error("No notes to export");
    }

    const profile = INSTRUMENTS[instrumentId] || INSTRUMENTS.acoustic;
    const sampleRate = 44100;

    // Calculate total duration (in seconds) + release tail
    const lastNote = notes.reduce((max, n) => Math.max(max, (n.time + (n.duration || 500))), 0);
    const totalDuration = Math.min(600, Math.max(1, (lastNote / 1000) + 1.5)); // Up to 10 mins

    const OfflineAudioCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const offlineCtx = new OfflineAudioCtx(2, Math.ceil(sampleRate * totalDuration), sampleRate);

    // Master bus
    const masterGain = offlineCtx.createGain();
    masterGain.gain.value = 0.85;

    const compressor = offlineCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-2, 0);
    compressor.ratio.setValueAtTime(12, 0);

    masterGain.connect(compressor);
    compressor.connect(offlineCtx.destination);

    // Schedule all notes
    notes.forEach(note => {
        const startTime = Math.max(0, note.time / 1000);
        const duration = Math.max(0.1, (note.duration || 400) / 1000);
        const velocity = note.velocity || 0.8;
        const fundamentalFreq = midiToFrequency(note.midi, 440);

        const voiceGain = offlineCtx.createGain();
        voiceGain.gain.setValueAtTime(0.0001, startTime);

        const filter = offlineCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(profile.filterCutoffBase || 4000, startTime);

        voiceGain.connect(filter);
        filter.connect(masterGain);

        // Harmonics
        const inharm = profile.inharmonicity || 0.0;
        const harmonics = profile.harmonics || [{ mult: 1, gain: 1 }];

        harmonics.forEach(h => {
            const osc = offlineCtx.createOscillator();
            const gain = offlineCtx.createGain();
            osc.type = "sine";

            const n = h.mult;
            const factor = inharm > 0 ? Math.sqrt(1 + inharm * n * n) : 1.0;
            const freq = fundamentalFreq * n * factor;

            if (freq > 20000) return;

            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(h.gain * velocity, startTime);

            osc.connect(gain);
            gain.connect(voiceGain);

            osc.start(startTime);
            osc.stop(startTime + duration + (profile.release || 0.4));
        });

        // Envelope
        const attack = profile.attack || 0.01;
        const peakGain = 0.25 * velocity;
        const sustainLvl = Math.max(0.0001, peakGain * profile.sustainLevel);

        voiceGain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
        voiceGain.gain.exponentialRampToValueAtTime(sustainLvl, startTime + attack + (profile.decay || 2.0));

        // Note off release
        const stopTime = startTime + duration;
        voiceGain.gain.setValueAtTime(sustainLvl, stopTime);
        voiceGain.gain.exponentialRampToValueAtTime(0.0001, stopTime + (profile.release || 0.4));
    });

    // Render audio
    const renderedBuffer = await offlineCtx.startRendering();
    const wavBlob = audioBufferToWavBlob(renderedBuffer);

    // Trigger download
    const safeName = title.replace(/[^a-zA-Z0-9_-]/g, "_") || "KESARE_Recording";
    const downloadUrl = URL.createObjectURL(wavBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${safeName}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 4000);

    return true;
}
