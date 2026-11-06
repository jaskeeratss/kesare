# KESARE Piano Studio

**KESARE Piano Studio** is a complete, production-ready browser-based virtual piano, multitrack recording studio, and interactive music learning platform.

Built with vanilla modern web technologies (**HTML5**, **CSS3**, **Vanilla ES6+ JavaScript**, **Web Audio API**, **Web MIDI API**, and **IndexedDB**), KESARE delivers a concert-grade digital audio workstation in the browser with **zero external paid dependencies, zero tracking, and zero framework overhead**.

---

## 🌟 Key Features

### 1. Concert-Grade Virtual Piano Keyboard
* **61-Key Default Mode (C2 – C7, MIDI 36–96)**: 36 white keys and 25 black keys with authentic acoustic piano geometry and spacing.
* **Full 88-Key Concert Grand Mode (A0 – C8, MIDI 21–108)**: Switchable anytime with smooth horizontal panning and Middle C centering.
* **Realistic 3D Key Mechanics**: Subtle bevels, realistic shadows, depth depression physics (`transform: translateY`), and active key lighting.
* **Multi-Input Support**:
  * **Computer Keyboard**: Pre-mapped 2-octave default layout centered on Middle C (C4 = `I`), with octave shift keys (`[` and `]`) and sustain pedal (`Spacebar`).
  * **Mouse Glissando**: Click and drag across keys for smooth continuous sliding glissando.
  * **Multi-Touch**: Responsive multi-finger chords on iPad, tablets, and smartphones.
  * **USB / Bluetooth MIDI**: Direct hardware integration via the Web MIDI API.
* **Anti-Stuck Protection**: Safe note disposal on window blur, pointer cancel, or tab backgrounding.
* **Key Label Modes**: Toggle between **Notes & Shortcuts**, **Notes Only**, **Shortcuts Only**, **Solfège (Do-Re-Mi)**, or **Clean Studio Aesthetic**.

### 2. High-Fidelity Audio Engine (Web Audio API)
* **5 Selectable Sound Profiles**:
  1. **Acoustic Grand**: Multi-harmonic additive synthesis with string inharmonicity dispersion (`f_n = n * f_0 * √(1 + B*n²)`), hammer strike transient impulse, pitch-tracked lowpass filtering, and soundboard resonance.
  2. **Electric Piano**: Vintage Rhodes/Wurlitzer tone with bell-like chime overtones and warm stereo tremolo.
  3. **Drawbar Organ**: Hammond tonewheel emulation with authentic drawbar partial ratios (16', 5 1/3', 8', 4', 2 2/3', 2', 1 1/3'), key click transient, and constant sustain.
  4. **Poly Synthesizer**: Dual-oscillator analog poly-synth (sawtooth + square sub) with 24dB resonant lowpass filter envelope sweep.
  5. **Soft Felt Piano**: Intimate, felt-damped upright piano with warm lowpass cutoff and rich room ambience.
* **Master Dynamics Limiter / Compressor**: Protects against digital clipping on dense polyphonic chords.
* **Convolution Reverb**: Algorithmically generated acoustic room impulse response with wet/dry send control.
* **Stereo Spatialization**: Low notes position subtly to the left, high notes position to the right, mirroring the player's perspective at an acoustic grand piano.
* **Master Tuning Calibration**: Switch between standard A4 = 440 Hz concert pitch and 432 Hz natural resonance.

### 3. Studio Recording Hub & Real Exporters
* **High-Precision Time Capture**: Preserves note-on, note-off, touch velocities, and timing without drift using `performance.now()`.
* **State Management**: Record, Pause, Resume, Playback, and Loop.
* **Browser Archive**: Persists takes in **IndexedDB** (with automatic localStorage fallback). Rename, play, or delete takes at any time.
* **Standard WAV Export**: Synthesizes the exact performance offline via `OfflineAudioContext` into an uncompressed 16-bit 44.1 kHz stereo PCM `.wav` file.
* **Standard MIDI Export (SMF Format 0)**: Generates valid `.mid` binary files with standard tempo, 480 PPQ division, and delta-time note events.

### 4. Interactive Music Learning Hub
* **Curated Repertoire**: Searchable library of public domain classical masterpieces, traditional folk melodies, and dexterity drills (*Für Elise*, *Ode to Joy*, *Clair de Lune*, *Canon in D*, *Twinkle Twinkle Little Star*, *Hanon Exercise No. 1*).
* **3 Practice Modes**:
  1. **Wait-for-Me Practice**: Pauses at each note/chord until the student hits the exact correct piano key. Target key glows on the piano with real-time feedback badges ("Perfect!", "Great!").
  2. **Listen Mode**: Demonstrates the song automatically with synchronized falling notes and glowing keys.
  3. **Play-Along Mode**: Plays at selectable tempo (0.5x, 0.75x, 1.0x, 1.25x) with accuracy scoring (hits, misses, streak).
* **Vector SVG Sheet Music Viewer**: Dynamically renders high-definition treble staff notation with synchronized cursor tracking.

### 5. Professional Music Tools Suite
* **Precision Metronome**: Lookahead Web Audio clock scheduling with adjustable BPM (30–260), time signatures (2/4, 3/4, 4/4, 5/4, 6/8), sound options (Woodblock, Beep, Classic), tap tempo, and visual pendulum dots.
* **Chord Finder**: Visualizes chords across all roots with formulas, note names, and inversions. "Play Chord" and "Arpeggiate" preview buttons.
* **Scale Explorer**: Explores Major, Minor, Harmonic/Melodic Minor, Pentatonics, Blues, and Modes across the keyboard with ascending/descending preview.
* **Harmonic Progressions**: Interactive player for famous progressions (Pop 4-Chord, Jazz ii–V–I, 12-Bar Blues, Pachelbel, Andalusian) with instant key transposition.
* **Music Notepad**: Built-in sketchpad for songwriting, lyrics, and chord charts with quick chord insertion buttons, local persistence, and `.txt` file export.

### 6. Real-Time Audio Visualizer & Web MIDI
* **Real-time Analyser**: 2048-point FFT canvas visualizer supporting **Frequency Spectrum Bars** and **Oscilloscope Waveform**.
* **Web MIDI API**: Plug-and-play detection of USB/Bluetooth MIDI controllers and sustain pedals (CC 64).

---

## 🎹 Computer Keyboard Mapping

Centered around Middle C (C4 = MIDI 60):

| Key | Note | MIDI | Key | Note | MIDI |
|:---:|:---:|:---:|:---:|:---:|:---:|
| `Q` | C3 | 48 | `2` | C♯3 | 49 |
| `W` | D3 | 50 | `3` | D♯3 | 51 |
| `E` | E3 | 52 | `5` | F♯3 | 54 |
| `R` | F3 | 53 | `6` | G♯3 | 56 |
| `T` | G3 | 55 | `7` | A♯3 | 58 |
| `Y` | A3 | 57 | `9` | C♯4 | 61 |
| `U` | B3 | 59 | `0` | D♯4 | 63 |
| **`I`** | **C4 (Middle C)** | **60** | `S` | F♯4 | 66 |
| `O` | D4 | 62 | `D` | G♯4 | 68 |
| `P` | E4 | 64 | `F` | A♯4 | 70 |
| `Z` | F4 | 65 | `H` | C♯5 | 73 |
| `X` | G4 | 67 | `J` | D♯5 | 75 |
| `C` | A4 (440Hz) | 69 | `L` | F♯5 | 78 |
| `V` | B4 | 71 | `;` | G♯5 | 80 |
| `B` | C5 | 72 | `'` | A♯5 | 82 |
| `N` | D5 | 74 | | | |
| `M` | E5 | 76 | | | |
| `,` | F5 | 77 | | | |
| `.` | G5 | 79 | | | |
| `/` | A5 | 81 | | | |

* **Sustain Pedal**: Press and hold or toggle with `Spacebar`.
* **Octave Down**: `[`
* **Octave Up**: `]`

---

## 📁 Project Architecture

```
piano/
├── index.html                   # Semantic HTML5 Studio Interface
├── package.json                 # Project descriptor & dev commands
├── _headers                     # Cloudflare Pages security & caching headers
├── assets/
│   └── favicon.svg              # Scalable SVG Piano Icon
├── css/
│   ├── main.css                 # Design system tokens, buttons, resets
│   ├── piano.css                # 3D acoustic keys & highlight overlays
│   ├── controls.css             # Navigation topbar, HUD & sliders
│   ├── studio.css               # Visualizer & recording studio views
│   ├── learning.css             # Song cards & interactive practice stage
│   ├── tools.css                # Metronome, chord/scale finders & notepad
│   └── modals.css               # Settings modal dialog & glassmorphism
└── js/
    ├── app.js                   # Master application bootstrapper
    ├── config/
    │   ├── keyboard-map.js      # Note mappings, shortcuts & frequencies
    │   ├── chords-scales.js     # Harmonic formulas, intervals & progressions
    │   └── songs-library.js     # Public domain song repertoire database
    ├── audio/
    │   ├── audio-engine.js      # Polyphonic Web Audio synthesis engine
    │   ├── sound-profiles.js    # Harmonic profiles & inharmonicity models
    │   └── effects.js           # Limiter, convolver reverb & panning
    ├── piano/
    │   ├── keyboard.js          # Multi-touch, mouse & physical key events
    │   └── key-renderer.js      # Dynamic 61/88-key layout generator
    ├── recording/
    │   ├── recorder.js          # Multitrack recorder & playback sequencer
    │   ├── storage.js           # IndexedDB archive with localStorage fallback
    │   ├── wav-exporter.js      # 16-bit PCM WAV audio offline renderer
    │   └── midi-exporter.js     # Standard MIDI File (.mid) binary encoder
    ├── learning/
    │   ├── lesson-player.js     # Library search, difficulty filter & UI
    │   ├── practice-mode.js     # "Wait-for-me" note detector & scorer
    │   └── sheet-viewer.js      # Vector SVG score notation renderer
    ├── tools/
    │   ├── metronome.js         # Precision lookahead clock metronome
    │   ├── chord-finder.js      # Interactive chord builder & player
    │   ├── scale-finder.js      # Scale explorer across all octaves
    │   ├── progressions.js      # Harmonic progression sequencer
    │   └── notepad.js           # Songwriting notepad & chord helper
    ├── midi/
    │   └── midi-manager.js      # Web MIDI hardware device coordinator
    ├── visualizer/
    │   └── visualizer.js        # 60fps spectrum & waveform canvas
    └── ui/
        ├── control-centre.js    # Master HUD, volume, sustain & octaves
        ├── navigation.js        # View routing & recording list UI
        └── settings-modal.js    # User preferences & tuning modal
```

---

## 🚀 Local Development Setup

No build step or dependencies required. KESARE runs on any standard HTTP server supporting ES6 modules:

### Option A: Python 3 (Installed by default on macOS/Linux)
```bash
python3 -m http.server 8000
```
Then open: [http://localhost:8000](http://localhost:8000)

### Option B: Node.js / npx
```bash
npx serve .
```

### Option C: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## 🌐 Free Online Deployment Guide

KESARE Piano Studio is built for 100% free static hosting:

### Deploying to Cloudflare Pages (Recommended)
1. Push your repository to **GitHub** or **GitLab**.
2. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages**.
3. Click **Create Application** → **Pages** → **Connect to Git**.
4. Select your `piano` repository.
5. In build settings:
   * **Framework preset**: `None`
   * **Build command**: *(leave empty)*
   * **Build output directory**: `/` *(root)*
6. Click **Save and Deploy**. Cloudflare automatically respects the `_headers` file and serves KESARE globally via CDN over HTTPS with free SSL!

### Deploying to GitHub Pages
1. In your GitHub repository, open **Settings** → **Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)`.
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo>/`.

---

## 🔒 Security & Privacy

* **Zero External Telemetry**: No third-party analytics, cookies, or tracking scripts.
* **100% Client-Side**: All audio synthesis, recording, WAV rendering, and MIDI generation happen entirely in your browser.
* **Persistent Local Storage**: Your recordings and notes never leave your personal computer.

---

## 📄 License

Open-source under the **MIT License**. Created for the love of music.
