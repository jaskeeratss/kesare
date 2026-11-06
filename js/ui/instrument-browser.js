/**
 * KESARE Piano Studio — Professional Multi-Category Instrument Browser
 * Horizontal category tabs, responsive preset cards, favorites, recent history, and live preview.
 */

import { INSTRUMENT_CATEGORIES, INSTRUMENT_PRESETS, getInstrumentsByCategory, getInstrumentPreset } from "../audio/instrument-library.js";
import { audioEngine } from "../audio/audio-engine.js";
import { soundfontLoader } from "../audio/soundfont-loader.js";

const FAVORITES_STORAGE_KEY = "kesare_favorite_instruments_v1";
const RECENT_STORAGE_KEY = "kesare_recent_instruments_v1";

export class InstrumentBrowser {
    constructor() {
        this.selectedCategory = "piano";
        this.filterMode = "category"; // 'category' | 'favorites' | 'recent'
        this.favorites = new Set(["concert-grand", "electric-piano-1", "harpsichord", "church-organ", "clean-guitar", "slap-bass-1", "violin"]);
        this.recent = [];
        this.container = null;
    }

    init() {
        this.loadStorage();
        this.container = document.getElementById("instrumentBrowserContainer");
        if (!this.container) return;

        this.setupSoundfontStatusListener();
        this.render();

        // Listen for external instrument changes
        audioEngine.addInstrumentChangeListener((preset) => {
            this.handleInstrumentChanged(preset);
        });

        // Add default instrument to recent
        this.addToRecent(audioEngine.currentInstrument);
    }

    loadStorage() {
        try {
            const rawFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
            if (rawFavs) {
                this.favorites = new Set(JSON.parse(rawFavs));
            }
            const rawRecent = localStorage.getItem(RECENT_STORAGE_KEY);
            if (rawRecent) {
                this.recent = JSON.parse(rawRecent);
            }
        } catch {}
    }

    saveFavorites() {
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...this.favorites]));
        } catch {}
    }

    saveRecent() {
        try {
            localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(this.recent));
        } catch {}
    }

    addToRecent(instrumentId) {
        this.recent = [instrumentId, ...this.recent.filter(id => id !== instrumentId)].slice(0, 8);
        this.saveRecent();
    }

    toggleFavorite(instrumentId) {
        if (this.favorites.has(instrumentId)) {
            this.favorites.delete(instrumentId);
        } else {
            this.favorites.add(instrumentId);
        }
        this.saveFavorites();
        this.renderPresetsList();
    }

    setupSoundfontStatusListener() {
        const loadingIndicator = document.getElementById("instrumentLoadingBadge");
        soundfontLoader.addStatusListener((instrumentId, status, details) => {
            if (!loadingIndicator) return;
            if (status === "loading") {
                loadingIndicator.style.display = "inline-flex";
                loadingIndicator.textContent = "Loading Samples...";
                loadingIndicator.className = "inst-status-badge status-loading";
            } else if (status === "decoding") {
                loadingIndicator.style.display = "inline-flex";
                loadingIndicator.textContent = `Decoding (${details.progress || 50}%)`;
                loadingIndicator.className = "inst-status-badge status-loading";
            } else if (status === "ready") {
                loadingIndicator.style.display = "inline-flex";
                loadingIndicator.textContent = "Sampled (Studio HQ)";
                loadingIndicator.className = "inst-status-badge status-sampled";
                setTimeout(() => {
                    this.renderPresetsList();
                }, 100);
            } else if (status === "synthesis_ready") {
                loadingIndicator.style.display = "inline-flex";
                loadingIndicator.textContent = "Synthesized (Physical)";
                loadingIndicator.className = "inst-status-badge status-synth";
            }
        });
    }

    render() {
        if (!this.container) return;

        const currentPreset = audioEngine.getInstrument();
        const currentCat = INSTRUMENT_CATEGORIES.find(c => c.id === currentPreset.category) || INSTRUMENT_CATEGORIES[0];

        this.container.innerHTML = `
        <div class="inst-browser-card">
            <!-- Header bar with Active Instrument HUD & Quick Controls -->
            <div class="inst-browser-header">
                <div class="inst-active-hud">
                    <span class="inst-eyebrow">ACTIVE INSTRUMENT</span>
                    <div class="inst-title-row">
                        <h3 class="inst-active-name" id="browserActiveName">${currentPreset.name}</h3>
                        <span class="inst-category-pill" id="browserActiveCat">${currentCat.name}</span>
                        <span class="inst-status-badge status-ready" id="instrumentLoadingBadge">Synthesized / Ready</span>
                    </div>
                </div>

                <div class="inst-header-actions">
                    <button class="btn btn-sm btn-primary" id="previewActiveInstBtn" title="Audition this instrument with an arpeggio">
                        <span>▶</span> Preview
                    </button>
                    <div class="inst-filter-tabs">
                        <button class="filter-tab-btn ${this.filterMode === 'category' ? 'active' : ''}" data-filter-mode="category">Categories</button>
                        <button class="filter-tab-btn ${this.filterMode === 'favorites' ? 'active' : ''}" data-filter-mode="favorites">★ Favorites (${this.favorites.size})</button>
                        <button class="filter-tab-btn ${this.filterMode === 'recent' ? 'active' : ''}" data-filter-mode="recent">⏱ Recent</button>
                    </div>
                </div>
            </div>

            <!-- Horizontal Category Tabs Strip -->
            <div class="inst-categories-scroll" id="instCategoriesScroll">
                ${INSTRUMENT_CATEGORIES.map(cat => `
                    <button class="inst-category-btn ${this.selectedCategory === cat.id && this.filterMode === 'category' ? 'active' : ''}" data-category-id="${cat.id}">
                        <span class="cat-icon">${cat.icon}</span>
                        <span class="cat-name">${cat.name}</span>
                    </button>
                `).join("")}
            </div>

            <!-- Presets Grid -->
            <div class="inst-presets-grid" id="instPresetsGrid">
                <!-- Populated dynamically -->
            </div>
        </div>
        `;

        this.bindHeaderEvents();
        this.renderPresetsList();
    }

    bindHeaderEvents() {
        // Preview button
        const previewBtn = document.getElementById("previewActiveInstBtn");
        if (previewBtn) {
            previewBtn.addEventListener("click", () => {
                audioEngine.previewInstrument(audioEngine.currentInstrument);
            });
        }

        // Category buttons
        const catButtons = this.container.querySelectorAll("[data-category-id]");
        catButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                this.filterMode = "category";
                this.selectedCategory = btn.dataset.categoryId;
                this.updateCategoryTabs();
                this.renderPresetsList();
            });
        });

        // Filter tab buttons (Categories, Favorites, Recent)
        const filterButtons = this.container.querySelectorAll("[data-filter-mode]");
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                this.filterMode = btn.dataset.filterMode;
                filterButtons.forEach(b => b.classList.toggle("active", b === btn));
                if (this.filterMode !== "category") {
                    this.container.querySelectorAll("[data-category-id]").forEach(b => b.classList.remove("active"));
                } else {
                    this.updateCategoryTabs();
                }
                this.renderPresetsList();
            });
        });
    }

    updateCategoryTabs() {
        const catButtons = this.container.querySelectorAll("[data-category-id]");
        catButtons.forEach(btn => {
            btn.classList.toggle("active", this.filterMode === "category" && btn.dataset.categoryId === this.selectedCategory);
        });
    }

    renderPresetsList() {
        const grid = document.getElementById("instPresetsGrid");
        if (!grid) return;

        let presetsToShow = [];

        if (this.filterMode === "favorites") {
            presetsToShow = INSTRUMENT_PRESETS.filter(p => this.favorites.has(p.id));
            if (presetsToShow.length === 0) {
                grid.innerHTML = `<div class="empty-inst-msg">No favorite instruments added yet. Click the star (★) on any instrument card to pin it here!</div>`;
                return;
            }
        } else if (this.filterMode === "recent") {
            presetsToShow = this.recent.map(id => getInstrumentPreset(id)).filter(Boolean);
            if (presetsToShow.length === 0) {
                grid.innerHTML = `<div class="empty-inst-msg">No recently played instruments. Select an instrument to begin!</div>`;
                return;
            }
        } else {
            presetsToShow = getInstrumentsByCategory(this.selectedCategory);
        }

        grid.innerHTML = presetsToShow.map(preset => {
            const isSelected = audioEngine.currentInstrument === preset.id;
            const isFavorite = this.favorites.has(preset.id);
            const isSampled = soundfontLoader.hasSamples(preset.gmName);

            return `
            <div class="inst-preset-card ${isSelected ? 'active' : ''}" data-inst-id="${preset.id}">
                <div class="inst-card-top">
                    <span class="inst-gm-pill">GM ${preset.gmProgram}</span>
                    <button class="inst-star-btn ${isFavorite ? 'favorited' : ''}" data-favorite-id="${preset.id}" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                        ${isFavorite ? '★' : '☆'}
                    </button>
                </div>
                <strong class="inst-card-name">${preset.name}</strong>
                <p class="inst-card-desc">${preset.description}</p>
                <div class="inst-card-footer">
                    <span class="inst-type-badge ${isSampled ? 'badge-sample' : 'badge-synth'}">
                        ${isSampled ? 'Sampled' : 'Synth Model'}
                    </span>
                    <button class="inst-card-preview-btn" data-preview-id="${preset.id}" title="Audition ${preset.name}">▶</button>
                </div>
            </div>
            `;
        }).join("");

        // Bind preset click events
        grid.querySelectorAll(".inst-preset-card").forEach(card => {
            card.addEventListener("click", (e) => {
                // If star or preview button clicked, handle those separately
                if (e.target.closest(".inst-star-btn") || e.target.closest(".inst-card-preview-btn")) {
                    return;
                }
                const id = card.dataset.instId;
                this.selectInstrument(id);
            });
        });

        // Bind favorite buttons
        grid.querySelectorAll(".inst-star-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = btn.dataset.favoriteId;
                this.toggleFavorite(id);
            });
        });

        // Bind preview buttons
        grid.querySelectorAll(".inst-card-preview-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = btn.dataset.previewId;
                audioEngine.previewInstrument(id);
            });
        });
    }

    selectInstrument(instrumentId) {
        audioEngine.setInstrument(instrumentId);
        this.addToRecent(instrumentId);
    }

    handleInstrumentChanged(preset) {
        const nameEl = document.getElementById("browserActiveName");
        const catEl = document.getElementById("browserActiveCat");
        const loadingIndicator = document.getElementById("instrumentLoadingBadge");

        if (nameEl) nameEl.textContent = preset.name;
        if (catEl) {
            const cat = INSTRUMENT_CATEGORIES.find(c => c.id === preset.category) || INSTRUMENT_CATEGORIES[0];
            catEl.textContent = cat.name;
        }

        if (loadingIndicator) {
            const isSampled = soundfontLoader.hasSamples(preset.gmName);
            loadingIndicator.textContent = isSampled ? "Sampled (Studio HQ)" : "Synthesized / Ready";
            loadingIndicator.className = isSampled ? "inst-status-badge status-sampled" : "inst-status-badge status-synth";
        }

        // Also update standard dropdown if present
        const select = document.getElementById("instrumentSelect");
        if (select) {
            select.value = preset.id;
        }

        // Re-render preset highlights
        const cards = document.querySelectorAll(".inst-preset-card");
        cards.forEach(c => c.classList.toggle("active", c.dataset.instId === preset.id));
    }
}
