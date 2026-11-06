/**
 * KESARE Piano Studio — Web MIDI API Device Manager
 * Connects physical MIDI keyboards, synthesizers, and sustain pedals to the virtual studio.
 */

import { audioEngine } from "../audio/audio-engine.js";

export class MidiManager {
    constructor(pianoKeyboard) {
        this.keyboard = pianoKeyboard;
        this.midiAccess = null;
        this.isSupported = false;
        this.connectedDevices = [];
        this.onDevicesChanged = null;
    }

    async init() {
        if (!navigator.requestMIDIAccess) {
            this.isSupported = false;
            return false;
        }

        try {
            this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
            this.isSupported = true;

            // Handle device connection/disconnection
            this.midiAccess.onstatechange = () => {
                this.scanDevices();
            };

            this.scanDevices();
            return true;
        } catch (err) {
            console.warn("Web MIDI access declined or unavailable:", err);
            this.isSupported = false;
            return false;
        }
    }

    scanDevices() {
        if (!this.midiAccess) return;

        this.connectedDevices = [];
        const inputs = this.midiAccess.inputs.values();

        for (const input of inputs) {
            this.connectedDevices.push({
                id: input.id,
                name: input.name || "MIDI Keyboard",
                manufacturer: input.manufacturer || "Generic"
            });

            // Bind input message handler
            input.onmidimessage = (msg) => this.handleMidiMessage(msg);
        }

        if (this.onDevicesChanged) {
            this.onDevicesChanged(this.connectedDevices);
        }
    }

    handleMidiMessage(msg) {
        const [status, data1, data2] = msg.data;
        const command = status >> 4;
        const channel = status & 0x0F;

        // Command 9 = Note On (if velocity > 0)
        if (command === 9) {
            const midi = data1;
            const velocity = data2 / 127;

            if (data2 > 0) {
                this.keyboard.emitNoteOn(midi, velocity, "midi");
            } else {
                // Velocity 0 is Note Off
                this.keyboard.emitNoteOff(midi, "midi");
            }
        }
        // Command 8 = Note Off
        else if (command === 8) {
            const midi = data1;
            this.keyboard.emitNoteOff(midi, "midi");
        }
        // Command 11 = Control Change (CC)
        else if (command === 11) {
            const ccNumber = data1;
            const ccValue = data2;

            // CC 64 = Sustain Pedal (Damper)
            if (ccNumber === 64) {
                const sustainOn = ccValue >= 64;
                audioEngine.setSustain(sustainOn);
                const sustainBtn = document.getElementById("sustainBtn");
                if (sustainBtn) {
                    sustainBtn.classList.toggle("active", sustainOn);
                }
            }
        }
    }
}
