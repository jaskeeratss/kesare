/**
 * KESARE Piano Studio — Music Learning Repertoire Library
 * Curated public domain classical pieces, traditional folk melodies, and technical exercises.
 */

export const SONG_CATEGORIES = [
    { id: "all", label: "All Categories" },
    { id: "classical", label: "Classical" },
    { id: "traditional", label: "Traditional & Folk" },
    { id: "exercises", label: "Skill Exercises" }
];

export const SONG_DIFFICULTIES = [
    { id: "all", label: "All Levels" },
    { id: "beginner", label: "Beginner", badge: "badge-green" },
    { id: "intermediate", label: "Intermediate", badge: "badge-amber" },
    { id: "advanced", label: "Advanced", badge: "badge-purple" }
];

export const SONGS_DATABASE = [
    {
        id: "ode_to_joy",
        title: "Ode to Joy (Symphony No. 9)",
        composer: "Ludwig van Beethoven",
        category: "classical",
        difficulty: "beginner",
        bpm: 120,
        timeSignature: "4/4",
        key: "C Major",
        description: "The universally celebrated theme from Beethoven's final symphony. Ideal for beginners.",
        // Notes formatted as: [midi, startMs, durationMs, hand ('R' or 'L')]
        notes: [
            { midi: 64, time: 0, duration: 450, hand: "R" },    // E4
            { midi: 64, time: 500, duration: 450, hand: "R" },  // E4
            { midi: 65, time: 1000, duration: 450, hand: "R" }, // F4
            { midi: 67, time: 1500, duration: 450, hand: "R" }, // G4

            { midi: 67, time: 2000, duration: 450, hand: "R" }, // G4
            { midi: 65, time: 2500, duration: 450, hand: "R" }, // F4
            { midi: 64, time: 3000, duration: 450, hand: "R" }, // E4
            { midi: 62, time: 3500, duration: 450, hand: "R" }, // D4

            { midi: 60, time: 4000, duration: 450, hand: "R" }, // C4
            { midi: 60, time: 4500, duration: 450, hand: "R" }, // C4
            { midi: 62, time: 5000, duration: 450, hand: "R" }, // D4
            { midi: 64, time: 5500, duration: 450, hand: "R" }, // E4

            { midi: 64, time: 6000, duration: 700, hand: "R" }, // E4 (dotted)
            { midi: 62, time: 6750, duration: 250, hand: "R" }, // D4
            { midi: 62, time: 7000, duration: 900, hand: "R" }, // D4

            // Second phrase
            { midi: 64, time: 8000, duration: 450, hand: "R" }, // E4
            { midi: 64, time: 8500, duration: 450, hand: "R" }, // E4
            { midi: 65, time: 9000, duration: 450, hand: "R" }, // F4
            { midi: 67, time: 9500, duration: 450, hand: "R" }, // G4

            { midi: 67, time: 10000, duration: 450, hand: "R" }, // G4
            { midi: 65, time: 10500, duration: 450, hand: "R" }, // F4
            { midi: 64, time: 11000, duration: 450, hand: "R" }, // E4
            { midi: 62, time: 11500, duration: 450, hand: "R" }, // D4

            { midi: 60, time: 12000, duration: 450, hand: "R" }, // C4
            { midi: 60, time: 12500, duration: 450, hand: "R" }, // C4
            { midi: 62, time: 13000, duration: 450, hand: "R" }, // D4
            { midi: 64, time: 13500, duration: 450, hand: "R" }, // E4

            { midi: 62, time: 14000, duration: 700, hand: "R" }, // D4
            { midi: 60, time: 14750, duration: 250, hand: "R" }, // C4
            { midi: 60, time: 15000, duration: 900, hand: "R" }  // C4
        ]
    },
    {
        id: "fur_elise",
        title: "Für Elise (Bagatelle No. 25)",
        composer: "Ludwig van Beethoven",
        category: "classical",
        difficulty: "intermediate",
        bpm: 132,
        timeSignature: "3/8",
        key: "A Minor",
        description: "Beethoven's most recognized piano masterpiece with iconic alternating chromatic motive.",
        notes: [
            { midi: 64, time: 0, duration: 220, hand: "R" },    // E4
            { midi: 63, time: 240, duration: 220, hand: "R" },  // D#4
            { midi: 64, time: 480, duration: 220, hand: "R" },  // E4
            { midi: 63, time: 720, duration: 220, hand: "R" },  // D#4
            { midi: 64, time: 960, duration: 220, hand: "R" },  // E4
            { midi: 59, time: 1200, duration: 220, hand: "R" }, // B3
            { midi: 62, time: 1440, duration: 220, hand: "R" }, // D4
            { midi: 60, time: 1680, duration: 220, hand: "R" }, // C4
            { midi: 57, time: 1920, duration: 550, hand: "R" }, // A3

            // Left hand arpeggio
            { midi: 45, time: 2160, duration: 220, hand: "L" }, // A2
            { midi: 52, time: 2400, duration: 220, hand: "L" }, // E3
            { midi: 57, time: 2640, duration: 220, hand: "L" }, // A3

            // Right hand continuation
            { midi: 48, time: 2880, duration: 220, hand: "R" }, // C3
            { midi: 55, time: 3120, duration: 220, hand: "R" }, // G3
            { midi: 60, time: 3360, duration: 220, hand: "R" }, // C4
            { midi: 59, time: 3600, duration: 550, hand: "R" }, // B3

            { midi: 64, time: 4200, duration: 220, hand: "R" }, // E4
            { midi: 63, time: 4440, duration: 220, hand: "R" }, // D#4
            { midi: 64, time: 4680, duration: 220, hand: "R" }, // E4
            { midi: 63, time: 4920, duration: 220, hand: "R" }, // D#4
            { midi: 64, time: 5160, duration: 220, hand: "R" }, // E4
            { midi: 59, time: 5400, duration: 220, hand: "R" }, // B3
            { midi: 62, time: 5640, duration: 220, hand: "R" }, // D4
            { midi: 60, time: 5880, duration: 220, hand: "R" }, // C4
            { midi: 57, time: 6120, duration: 750, hand: "R" }  // A3
        ]
    },
    {
        id: "twinkle",
        title: "Twinkle, Twinkle, Little Star",
        composer: "Traditional (Mozart Variations)",
        category: "traditional",
        difficulty: "beginner",
        bpm: 100,
        timeSignature: "4/4",
        key: "C Major",
        description: "Classic nursery melody, simple interval jumps perfect for learning keyboard geography.",
        notes: [
            { midi: 60, time: 0, duration: 450, hand: "R" },    // C4
            { midi: 60, time: 500, duration: 450, hand: "R" },  // C4
            { midi: 67, time: 1000, duration: 450, hand: "R" }, // G4
            { midi: 67, time: 1500, duration: 450, hand: "R" }, // G4
            { midi: 69, time: 2000, duration: 450, hand: "R" }, // A4
            { midi: 69, time: 2500, duration: 450, hand: "R" }, // A4
            { midi: 67, time: 3000, duration: 900, hand: "R" }, // G4

            { midi: 65, time: 4000, duration: 450, hand: "R" }, // F4
            { midi: 65, time: 4500, duration: 450, hand: "R" }, // F4
            { midi: 64, time: 5000, duration: 450, hand: "R" }, // E4
            { midi: 64, time: 5500, duration: 450, hand: "R" }, // E4
            { midi: 62, time: 6000, duration: 450, hand: "R" }, // D4
            { midi: 62, time: 6500, duration: 450, hand: "R" }, // D4
            { midi: 60, time: 7000, duration: 900, hand: "R" }  // C4
        ]
    },
    {
        id: "canon_in_d",
        title: "Canon in D (Theme)",
        composer: "Johann Pachelbel",
        category: "classical",
        difficulty: "intermediate",
        bpm: 80,
        timeSignature: "4/4",
        key: "D Major",
        description: "Serene baroque progression with rich harmonic interplay and gentle walking bass.",
        notes: [
            // Melody (Transposed to C Major for easier beginner play)
            { midi: 72, time: 0, duration: 700, hand: "R" },    // C5
            { midi: 71, time: 750, duration: 700, hand: "R" },  // B4
            { midi: 69, time: 1500, duration: 700, hand: "R" }, // A4
            { midi: 67, time: 2250, duration: 700, hand: "R" }, // G4
            { midi: 65, time: 3000, duration: 700, hand: "R" }, // F4
            { midi: 64, time: 3750, duration: 700, hand: "R" }, // E4
            { midi: 65, time: 4500, duration: 700, hand: "R" }, // F4
            { midi: 67, time: 5250, duration: 700, hand: "R" }, // G4

            // Second measure
            { midi: 72, time: 6000, duration: 350, hand: "R" }, // C5
            { midi: 74, time: 6400, duration: 350, hand: "R" }, // D5
            { midi: 76, time: 6800, duration: 700, hand: "R" }, // E5
            { midi: 74, time: 7600, duration: 700, hand: "R" }, // D5
            { midi: 72, time: 8400, duration: 1200, hand: "R" } // C5
        ]
    },
    {
        id: "hanon_ex1",
        title: "Hanon Virtuoso Pianist — Exercise No. 1",
        composer: "Charles-Louis Hanon",
        category: "exercises",
        difficulty: "beginner",
        bpm: 100,
        timeSignature: "2/4",
        key: "C Major",
        description: "The classic finger independence drill: strengthening 4th and 5th fingers.",
        notes: [
            { midi: 60, time: 0, duration: 250, hand: "R" },    // C4
            { midi: 64, time: 300, duration: 250, hand: "R" },  // E4
            { midi: 65, time: 600, duration: 250, hand: "R" },  // F4
            { midi: 67, time: 900, duration: 250, hand: "R" },  // G4
            { midi: 69, time: 1200, duration: 250, hand: "R" }, // A4
            { midi: 67, time: 1500, duration: 250, hand: "R" }, // G4
            { midi: 65, time: 1800, duration: 250, hand: "R" }, // F4
            { midi: 64, time: 2100, duration: 250, hand: "R" }, // E4

            // Step up to D
            { midi: 62, time: 2400, duration: 250, hand: "R" }, // D4
            { midi: 65, time: 2700, duration: 250, hand: "R" }, // F4
            { midi: 67, time: 3000, duration: 250, hand: "R" }, // G4
            { midi: 69, time: 3300, duration: 250, hand: "R" }, // A4
            { midi: 71, time: 3600, duration: 250, hand: "R" }, // B4
            { midi: 69, time: 3900, duration: 250, hand: "R" }, // A4
            { midi: 67, time: 4200, duration: 250, hand: "R" }, // G4
            { midi: 65, time: 4500, duration: 250, hand: "R" }  // F4
        ]
    },
    {
        id: "clair_de_lune",
        title: "Clair de Lune (Suite Bergamasque)",
        composer: "Claude Debussy",
        category: "classical",
        difficulty: "advanced",
        bpm: 54,
        timeSignature: "9/8",
        key: "D♭ Major",
        description: "Impressionist masterpiece evoking shimmering moonlight with delicate rubato.",
        notes: [
            { midi: 65, time: 0, duration: 800, hand: "R" },    // F4
            { midi: 68, time: 900, duration: 800, hand: "R" },  // G#4 / Ab4
            { midi: 72, time: 1800, duration: 1200, hand: "R" },// C5
            { midi: 70, time: 3100, duration: 600, hand: "R" }, // Bb4
            { midi: 68, time: 3800, duration: 1400, hand: "R" },// Ab4
            { midi: 65, time: 5400, duration: 700, hand: "R" }, // F4
            { midi: 63, time: 6200, duration: 700, hand: "R" }, // Eb4
            { midi: 61, time: 7000, duration: 1600, hand: "R" } // Db4
        ]
    },
    {
        id: "moonlight_sonata",
        title: "Moonlight Sonata (Op. 27 No. 2)",
        composer: "Ludwig van Beethoven",
        category: "classical",
        difficulty: "intermediate",
        bpm: 60,
        timeSignature: "4/4",
        key: "C♯ Minor",
        description: "Beethoven's hypnotic, melancholic masterpiece built on continuous rolling triplet arpeggios.",
        notes: [
            // Left hand bass octave C#2 / C#3
            { midi: 49, time: 0, duration: 2800, hand: "L" },
            // Right hand triplets: G#3, C#4, E4
            { midi: 56, time: 0, duration: 250, hand: "R" },    // G#3
            { midi: 61, time: 250, duration: 250, hand: "R" },  // C#4
            { midi: 64, time: 500, duration: 250, hand: "R" },  // E4

            { midi: 56, time: 750, duration: 250, hand: "R" },  // G#3
            { midi: 61, time: 1000, duration: 250, hand: "R" }, // C#4
            { midi: 64, time: 1250, duration: 250, hand: "R" }, // E4

            { midi: 56, time: 1500, duration: 250, hand: "R" }, // G#3
            { midi: 61, time: 1750, duration: 250, hand: "R" }, // C#4
            { midi: 64, time: 2000, duration: 250, hand: "R" }, // E4

            // Melody note G#4 enters
            { midi: 68, time: 2250, duration: 1200, hand: "R" },// G#4
            { midi: 56, time: 2250, duration: 250, hand: "R" }, // G#3
            { midi: 61, time: 2500, duration: 250, hand: "R" }, // C#4
            { midi: 64, time: 2750, duration: 250, hand: "R" }, // E4

            // Measure 2: Bass B
            { midi: 47, time: 3000, duration: 2800, hand: "L" },
            { midi: 56, time: 3000, duration: 250, hand: "R" },
            { midi: 59, time: 3250, duration: 250, hand: "R" },
            { midi: 64, time: 3500, duration: 250, hand: "R" },
            { midi: 68, time: 3750, duration: 1500, hand: "R" }
        ]
    },
    {
        id: "minuet_in_g",
        title: "Minuet in G Major (BWV Anh. 114)",
        composer: "Christian Petzold / J.S. Bach",
        category: "classical",
        difficulty: "beginner",
        bpm: 126,
        timeSignature: "3/4",
        key: "G Major",
        description: "The timeless classical dance from the Notebook for Anna Magdalena Bach.",
        notes: [
            { midi: 67, time: 0, duration: 450, hand: "R" },    // D5
            { midi: 60, time: 480, duration: 220, hand: "R" },  // G4
            { midi: 62, time: 720, duration: 220, hand: "R" },  // A4
            { midi: 64, time: 960, duration: 220, hand: "R" },  // B4
            { midi: 65, time: 1200, duration: 220, hand: "R" }, // C5
            { midi: 67, time: 1440, duration: 450, hand: "R" }, // D5
            { midi: 60, time: 1920, duration: 450, hand: "R" }, // G4
            { midi: 60, time: 2400, duration: 450, hand: "R" }, // G4

            { midi: 69, time: 2880, duration: 450, hand: "R" }, // E5
            { midi: 65, time: 3360, duration: 220, hand: "R" }, // C5
            { midi: 67, time: 3600, duration: 220, hand: "R" }, // D5
            { midi: 69, time: 3840, duration: 220, hand: "R" }, // E5
            { midi: 71, time: 4080, duration: 220, hand: "R" }, // F#5
            { midi: 67, time: 4320, duration: 450, hand: "R" }, // G5
            { midi: 60, time: 4800, duration: 450, hand: "R" }  // G4
        ]
    },
    {
        id: "the_entertainer",
        title: "The Entertainer",
        composer: "Scott Joplin",
        category: "classical",
        difficulty: "intermediate",
        bpm: 140,
        timeSignature: "2/4",
        key: "C Major",
        description: "The quintessential American ragtime piano standard with syncopated jaunty swing.",
        notes: [
            { midi: 62, time: 0, duration: 180, hand: "R" },    // D4
            { midi: 63, time: 200, duration: 180, hand: "R" },  // D#4
            { midi: 64, time: 400, duration: 180, hand: "R" },  // E4
            { midi: 72, time: 600, duration: 380, hand: "R" },  // C5
            { midi: 64, time: 1000, duration: 180, hand: "R" }, // E4
            { midi: 72, time: 1200, duration: 480, hand: "R" }, // C5

            { midi: 62, time: 1800, duration: 180, hand: "R" }, // D4
            { midi: 63, time: 2000, duration: 180, hand: "R" }, // D#4
            { midi: 64, time: 2200, duration: 180, hand: "R" }, // E4
            { midi: 72, time: 2400, duration: 380, hand: "R" }, // C5
            { midi: 64, time: 2800, duration: 180, hand: "R" }, // E4
            { midi: 72, time: 3000, duration: 600, hand: "R" }, // C5

            { midi: 72, time: 3800, duration: 200, hand: "R" }, // C5
            { midi: 74, time: 4000, duration: 200, hand: "R" }, // D5
            { midi: 75, time: 4200, duration: 200, hand: "R" }, // D#5
            { midi: 76, time: 4400, duration: 200, hand: "R" }, // E5
            { midi: 72, time: 4600, duration: 200, hand: "R" }, // C5
            { midi: 74, time: 4800, duration: 200, hand: "R" }, // D5
            { midi: 76, time: 5000, duration: 500, hand: "R" }  // E5
        ]
    },
    {
        id: "greensleeves",
        title: "Greensleeves (What Child Is This)",
        composer: "Traditional (16th Century English)",
        category: "traditional",
        difficulty: "intermediate",
        bpm: 108,
        timeSignature: "6/8",
        key: "A Minor / Dorian",
        description: "Haunting Renaissance melody featuring gentle 6/8 lilt and Dorian modal color.",
        notes: [
            { midi: 57, time: 0, duration: 500, hand: "R" },    // A3
            { midi: 60, time: 550, duration: 900, hand: "R" },  // C4
            { midi: 62, time: 1500, duration: 450, hand: "R" }, // D4
            { midi: 64, time: 2000, duration: 700, hand: "R" }, // E4
            { midi: 65, time: 2750, duration: 250, hand: "R" }, // F4
            { midi: 64, time: 3000, duration: 900, hand: "R" }, // E4
            { midi: 62, time: 4000, duration: 450, hand: "R" }, // D4
            { midi: 59, time: 4500, duration: 900, hand: "R" }, // B3
            { midi: 55, time: 5500, duration: 450, hand: "R" }, // G3
            { midi: 57, time: 6000, duration: 700, hand: "R" }, // A3
            { midi: 59, time: 6750, duration: 250, hand: "R" }, // B3
            { midi: 60, time: 7000, duration: 1100, hand: "R" } // C4
        ]
    }
];

