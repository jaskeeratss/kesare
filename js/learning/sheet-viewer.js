/**
 * KESARE Piano Studio — Interactive Musical Score / Sheet Viewer
 * High-definition vector SVG music notation renderer for piano staff (Treble & Bass).
 */

import { getNoteName } from "../config/keyboard-map.js";

export class SheetViewer {
    constructor(containerElement) {
        this.container = containerElement;
    }

    renderSongScore(song, currentNoteIndex = 0) {
        if (!this.container || !song) return;

        const notes = song.notes || [];
        const width = Math.max(760, notes.length * 60 + 140);
        const height = 180;

        // Staff line positions (Treble Clef lines: E4=100, G4=90, B4=80, D5=70, F5=60)
        let svg = `
        <svg viewBox="0 0 ${width} ${height}" class="sheet-music-svg" xmlns="http://www.w3.org/2000/svg">
            <!-- Background & Title -->
            <rect width="100%" height="100%" fill="transparent"/>
            
            <!-- Staff Lines (Treble Clef: y = 50, 60, 70, 80, 90) -->
            <g class="staff-lines" stroke="rgba(255,255,255,0.25)" stroke-width="1.2">
                <line x1="40" y1="50" x2="${width - 30}" y2="50"/>
                <line x1="40" y1="60" x2="${width - 30}" y2="60"/>
                <line x1="40" y1="70" x2="${width - 30}" y2="70"/>
                <line x1="40" y1="80" x2="${width - 30}" y2="80"/>
                <line x1="40" y1="90" x2="${width - 30}" y2="90"/>
            </g>

            <!-- Treble Clef Graphic Symbol -->
            <text x="45" y="85" font-family="'DM Sans', serif" font-size="46" fill="#35e0c1" font-weight="bold">𝄞</text>
            
            <!-- Time Signature (e.g. 4/4) -->
            <g font-family="'DM Sans', sans-serif" font-weight="700" font-size="16" fill="#858da0" text-anchor="middle">
                <text x="80" y="66">4</text>
                <text x="80" y="84">4</text>
            </g>
        `;

        // Measure bar lines every 4 quarter notes
        let measureX = 100;

        // Compute Y coordinate on staff for given MIDI note
        // Middle C (C4 = 60) sits on ledger line at y=100
        // D4=62 -> 95, E4=64 -> 90 (line), F4=65 -> 85 (space), G4=67 -> 80 (line), A4=69 -> 75, B4=71 -> 70, C5=72 -> 65
        const getStaffY = (midi) => {
            const diatonicStep = midiToDiatonicOffset(midi);
            return 100 - (diatonicStep * 5);
        };

        // Render notes
        notes.forEach((n, idx) => {
            const x = 110 + idx * 52;
            const y = getStaffY(n.midi);
            const isCurrent = idx === currentNoteIndex;
            const isPast = idx < currentNoteIndex;
            const noteColor = isCurrent ? "#35e0c1" : isPast ? "rgba(255,255,255,0.4)" : "#ffffff";
            const noteGlow = isCurrent ? 'filter="drop-shadow(0 0 6px #35e0c1)"' : "";

            // Ledger line for Middle C or low/high notes
            let ledger = "";
            if (n.midi <= 60) {
                ledger = `<line x1="${x - 12}" y1="100" x2="${x + 12}" y2="100" stroke="${noteColor}" stroke-width="1.5"/>`;
            } else if (n.midi >= 81) {
                ledger = `<line x1="${x - 12}" y1="40" x2="${x + 12}" y2="40" stroke="${noteColor}" stroke-width="1.5"/>`;
            }

            // Note Head & Stem
            svg += `
            <g class="sheet-note ${isCurrent ? 'active-sheet-note' : ''}" ${noteGlow}>
                ${ledger}
                <!-- Note Head (rotated ellipse) -->
                <ellipse cx="${x}" cy="${y}" rx="6.5" ry="4.8" transform="rotate(-20 ${x} ${y})" fill="${noteColor}"/>
                <!-- Stem -->
                <line x1="${x + 5.5}" y1="${y}" x2="${x + 5.5}" y2="${y - 28}" stroke="${noteColor}" stroke-width="1.8"/>
                <!-- Note Label -->
                <text x="${x}" y="130" font-family="'DM Sans', sans-serif" font-size="11" font-weight="600" fill="${isCurrent ? '#35e0c1' : '#858da0'}" text-anchor="middle">
                    ${getNoteName(n.midi)}
                </text>
            </g>
            `;

            // Draw measure bar every 4 notes
            if ((idx + 1) % 4 === 0 && idx < notes.length - 1) {
                const barX = x + 26;
                svg += `<line x1="${barX}" y1="50" x2="${barX}" y2="90" stroke="rgba(255,255,255,0.18)" stroke-width="1.2"/>`;
            }
        });

        // End bar
        svg += `
            <line x1="${width - 35}" y1="50" x2="${width - 35}" y2="90" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
            <line x1="${width - 30}" y1="50" x2="${width - 30}" y2="90" stroke="rgba(255,255,255,0.6)" stroke-width="3"/>
        </svg>
        `;

        this.container.innerHTML = svg;

        // Auto-scroll the score viewer to current note
        const currentEl = this.container.querySelector(".active-sheet-note");
        if (currentEl) {
            const noteX = currentEl.querySelector("ellipse").getAttribute("cx");
            this.container.scrollTo({
                left: Math.max(0, Number(noteX) - 200),
                behavior: "smooth"
            });
        }
    }
}

function midiToDiatonicOffset(midi) {
    // Map MIDI note to diatonic scale steps relative to Middle C (C4 = 0)
    const octave = Math.floor(midi / 12) - 1;
    const pitch = midi % 12;
    // Map chromatic semitone to diatonic step: C=0, D=1, E=2, F=3, G=4, A=5, B=6
    const pitchToStep = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
    const octaveOffset = (octave - 4) * 7;
    return pitchToStep[pitch] + octaveOffset;
}
