# PULSECARE+ — MASTER AUDIT & REVIEW PROMPT FOR CLAUDE

> **How to use**: 
> 1. Upload `pulsecare-plus-claude-bundle.zip` (or the key files listed below) to Claude.
> 2. Copy and paste the entire prompt below into Claude's prompt box.

---

```markdown
# PULSECARE+ — COMPREHENSIVE ARCHITECTURAL, UI/UX & SAFETY AUDIT

You are an expert product designer, principal 3D web engineer, accessibility specialist (WCAG 2.2 AAA), and medical-software safety reviewer. 

Review the attached codebase for **PulseCare+**, an emergency health platform.

---

### 1. PROJECT IDENTITY & ART DIRECTION
- **Brand**: PulseCare+ ("Care, clarity, when it matters")
- **Vision**: Architectural medical spatial platform combining emergency response, 3D/satellite hospital telemetry, zero-knowledge private health records, and offline first-aid protocols.
- **Palette**: "Future Clinic" (Calm, reassuring, tactile paper & brass physical cards; strictly no purple/violet gradients, no dark neon cyber-blue, and no generic clinical hospital blues):
  - **Warm Ivory / Alabaster**: `#F1F0E9` / `#FAF8F5` (Base backgrounds & modal surfaces)
  - **Deep Forest Green**: `#173E35` / `#163C32` (Primary brand color, structure, active states)
  - **Vermilion Coral**: `#B82819` / `#D44A3C` (Urgent emergency alerts, 112 CTA, Level 1 Trauma)
  - **Champagne Gold**: `#C4A66B` / `#C7AE7B` (Accents, architectural borders, delicate dividers)
  - **Charcoal**: `#1D2521` (High-contrast typography)

---

### 2. NON-NEGOTIABLE SAFETY CONSTRAINTS
- **Zero Fake Vitals / Biometrics**: Strict policy against unsupported heart-rate, SpO2, ECG, fake waveforms, or simulated sensor syncing.
- **Truthful Telemetry**:
  - Distance calculations must use real browser Haversine geodesic math (`calculateDistanceKm`).
  - Weather & AQI telemetry uses Open-Meteo live API with graceful offline fallbacks (`fetchLiveWeather`).
  - GPS permissions are explicitly requested with browser prompts; fallback to verified multi-region presets (Delhi, Mumbai, Bengaluru, Kolkata, London, Geneva).
  - Emergency 112 calling triggers device carrier cellular dialer directly (`tel:112`) with clear disclaimer that PulseCare+ does not automatically dispatch vehicles.
- **Zero-Knowledge Privacy**: Personal medical records & care directives are stored strictly client-side in IndexedDB with W3C Web Crypto AES-GCM encryption.

---

### 3. KEY IMPLEMENTATIONS TO INSPECT
1. **Interactive Spatial Medical City (`src/components/SpatialMedicalCity.tsx` & `src/components/SatelliteMapView.tsx`)**:
   - **3D Campus Mode**: Miniature Three.js architectural diorama with telephoto isometric camera, orbit/touch controls, and screen-projected HTML badges floating in real time above each hospital building showing live ICU beds.
   - **Satellite Map Mode**: Real Google Satellite Hybrid map (`https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}`) via Leaflet with user location beacon, hospital coordinate markers, and dashed route polylines.
   - **2D Grid Mode**: Accessible emergency facility card view.
2. **Universal Live Emergency Search (`src/App.tsx`)**:
   - Instant dropdown popup with real-time matching for hospitals, immediate first aid protocols, local medical records, and a 1-click AI triage query.
3. **Emergency First Aid Responder (`src/components/FirstAidModal.tsx`)**:
   - Dedicated modal with instant symptom search ("What happened?"), 8 quick chips, Web Audio API 110 BPM CPR rhythm metronome with visual cardiac pacing, step-by-step guidance, and caution callouts.
4. **Local-First Medical ID & Health Profile (`src/components/MedicalIDCard.tsx` & `src/components/HealthProfileModal.tsx`)**:
   - W3C Web Crypto encrypted vault for critical allergies, blood group, donor status, and advance directives.
5. **Content-Security-Policy (`index.html`)**:
   - Strict CSP configured for fonts, Web Crypto, Leaflet, Google Satellite tiles, and Open-Meteo endpoints.

---

### 4. WHAT I WANT YOU TO AUDIT & CRITIQUE
Please provide an in-depth, structured review on:
1. **Visual Hierarchy & Future Clinic Palette**:
   - Does every component stay strictly within the warm ivory, deep forest green, vermilion, and champagne gold palette?
   - Are contrast ratios WCAG 2.2 AA/AAA compliant across buttons, badges, and labels?
2. **Emergency Usability & Stress Testing**:
   - In high-stress scenarios (e.g. CPR, anaphylaxis, severe burn), is guidance immediately actionable with minimum cognitive load?
   - Are touch targets on mobile (44px+) and close buttons easily accessible?
3. **Performance & Three.js / Leaflet Lifecycle**:
   - Are WebGL renderers, animation loops, and Leaflet map instances cleanly disposed of during component unmount or view switching?
   - Are screen-projected badges efficient (running via DOM ref transforms without causing React re-renders)?
4. **Code Quality & Type Safety**:
   - Review TypeScript types, error handling, and lazy-loading boundaries (`Suspense`).
5. **Concrete Improvement Recommendations**:
   - What are 3 to 5 high-impact enhancements you recommend next while strictly preserving our design system and zero-fake-vitals rule?
```

---

### 5. FILE MANIFEST IN THE BUNDLE
- `index.html` — HTML shell, typography preloads, Content-Security-Policy.
- `package.json` — Dependencies (Three.js, Leaflet, Lucide-React, Tailwind CSS, Vite).
- `src/App.tsx` — Main application shell, universal emergency search, quick actions, responsive navigation rail.
- `src/types.ts` — TypeScript domain models (`Hospital`, `FirstAidGuide`, `UserProfile`, `LocationTelemetry`).
- `src/data/mockData.ts` — Verified clinical first-aid guides, multi-region hospital databases.
- `src/components/SpatialMedicalCity.tsx` — 3D Three.js isometric diorama with 3D-to-2D screen-projected hospital badges.
- `src/components/SatelliteMapView.tsx` — Google Satellite Hybrid mapping view via Leaflet.
- `src/components/FirstAidModal.tsx` — Interactive emergency first-aid triage window & 110 BPM CPR metronome.
- `src/components/EducationalAnatomyPanel.tsx` — Anatomy reference panel for CPR & Heimlich vectors.
- `src/components/AIHealthHologram.tsx` — Secondary AI health hologram card.
- `src/components/MedicalIDCard.tsx` — Emergency medical ID pass with QR code & AES-GCM vault.
- `src/components/HealthProfileModal.tsx` — Encrypted health profile & care directives.
- `src/components/LocationPermissionModal.tsx` — Multi-region selector & GPS permission flow.
- `src/services/locationService.ts` — Haversine distance calculator & multi-city hospital resolver.
- `src/services/weatherService.ts` — Open-Meteo live weather + AQI service with offline fallbacks.
- `src/services/db.ts` — IndexedDB local-first storage vault.
