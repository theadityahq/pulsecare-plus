# PulseCare+ (Emergency Preparedness & Health Triage Platform)

> **"Care, clarity, when it matters."**  
> An architectural, local-first emergency health and triage platform built for high-stakes medical preparedness, verified hospital directories, Google Satellite mapping, precision resuscitation pacing, and client-side encrypted medical IDs.

---

## 🎨 Art Direction: Future Clinic

PulseCare+ avoids generic AI tropes (no purple/magenta gradients, electric neon, or cyberpunk noise). Instead, it adopts a dignified, editorial, and tactile **Future Clinic** design language:

- **Warm Ivory (`#F1F0E9` / `#FAF8F5`)**: Architectural warmth and human clinical surfaces.
- **Deep Forest Green (`#163C32` / `#0E2721`)**: Grounding, calm, authoritative medical backdrop.
- **Restrained Vermilion (`#B82819` / `#9E2013` hover)**: Clear, decisive emergency action points and Level 1 Trauma beacons.
- **Muted Champagne Gold (`#C4A66B` / `#C7AE7B`)**: Navigational rings, graticule lines, and delicate architectural dividers.
- **Charcoal Ink (`#1D2521`)**: High-contrast, legible typography meeting WCAG 2.2 AA contrast standards.
- **Self-Hosted Editorial Typography**: `Newsreader` (humanistic serif), `Plus Jakarta Sans` (geometric sans), and `JetBrains Mono` (telemetry mono) bundled locally with zero external network leaks.

---

## 🏥 Spatial Telemetry & Mapping

PulseCare+ features a multi-mode spatial medical environment:

1. **Interactive 3D Miniature Medical Campus**:
   - Built with Three.js telephoto isometric projection (`FOV 32°`).
   - Detailed architectural medical city: Level 1 Trauma Center with helipad, ICU pavilions, landscaped courtyards, road networks, and ambulatory paths.
   - **Real-Time 3D-to-2D Screen-Projected HTML Labels**: Dynamic badges float directly above campus facilities showing hospital names, emergency categories, and licensed capacity references.
   - Smooth camera orbits, touch pinch-to-zoom, and raycast facility inspection.
   - Complete Three.js WebGL GPU resource disposal (`geometry.dispose()`, `material.dispose()`, `forceContextLoss()`).
2. **Google Satellite Hybrid Mapping (`SatelliteMapView.tsx`)**:
   - Real-world satellite photography with highway, road, and building overlays via Leaflet and Google Satellite Hybrid tiles.
   - Layer toggles for Google Satellite Hybrid, Pure Satellite, and Street mapping.
   - Live GPS user beacon, hospital coordinate markers, and emergency distance indications.
3. **2D Emergency Schematic Grid**:
   - High-contrast, accessible card layout for screen-reader compliant triage.

---

## ⚡ Core Capabilities & Truthful Architecture

1. **Universal Emergency Live Search**:
   - Real-time search dropdown in the header matching verified hospitals, emergency first-aid protocols, user medications, and critical allergies.
2. **Dedicated Emergency First Aid Responder (`FirstAidModal.tsx`)**:
   - Interactive triage window with instant symptom search ("What happened?").
   - 8 one-tap emergency protocols (CPR, Choking, Bleeding, Burns, Anaphylaxis, Seizure, Fracture, Snakebite).
   - **Sample-Accurate 110 BPM CPR Metronome**: Precision lookahead audio scheduling via Web Audio API oscillators (zero timer drift, not throttled in background).
   - **Tactile Pacing & Screen Wake Lock**: Device haptic vibration pulses and Screen Wake Lock API prevent screen timeout during life-saving chest compressions.
   - **Sticky Call 112 Button**: Mobile-optimized >= 56px sticky dialer button for immediate one-handed emergency escalation.
   - Clinical provenance citing AHA 2020/2025 updates, ERC 2021, and WHO Guidelines.
3. **Rule-Based Symptom Guidance (`symptomGuidanceService.ts`)**:
   - Deterministic, evidence-based triage engine (not an AI chatbot, zero hallucinations).
   - Immediate escalation for red-flag emergencies (unconscious, arrest, chest pain, stroke F.A.S.T., anaphylaxis, poisoning).
   - Dedicated suicide and self-harm crisis routing to **Tele-MANAS (14416 / 1800 891 4416)** and **112**.
   - Clinically distinct routing for heat stroke vs ischemic stroke and nosebleeds vs arterial hemorrhage.
4. **Verified Multi-Region Hospital Directories (`src/data/hospitals.ts`)**:
   - 29 verified medical centers across Delhi NCR, Mumbai, Bengaluru, Kolkata, London, and Geneva with official institutional directories and verification dates.
   - Strict E.164 phone numbers with 1-tap direct dialing (`tel:+911126588500`).
   - Straight-line distance explicitly labeled ("≈ X km straight-line", "est. at 30 km/h, not routed").
   - Zero invented hospitals or fabricated live bed availability.
5. **Dual-Tier Emergency Medical Passport (`db.ts`)**:
   - **Tier 1 (Public Triage Mode)**: Plaintext lock-screen card with blood group, anaphylaxis risks, and emergency contacts accessible by first responders without a password.
   - **Tier 2 (Zero-Knowledge Encrypted Vault)**: Full medical records encrypted client-side in IndexedDB via Web Crypto **PBKDF2 (600,000 iterations)** + **AES-GCM 256-bit**.
   - Strict Zod schema verification on backup import/export.
6. **Live Environmental & Weather Telemetry (`weatherService.ts`)**:
   - Queries Open-Meteo REST API for live temperature, weather code, and 6-tier US EPA Air Quality Index (AQI).
   - Strict truthfulness: returns unavailable state instead of synthesizing fake weather when offline.

---

## 🧪 Automated Test Suite

PulseCare+ includes 66+ automated Vitest tests covering:

- **Hospital Integrity (`tests/hospitals.test.ts`)**: Proximity, E.164 phone formatting, phone uniqueness, and provenance sources.
- **Symptom Guidance Triage (`tests/assistant.test.ts`)**: 46 clinical phrases covering crisis routing, stroke vs heat stroke, epistaxis, and negation checks.
- **Cryptographic Vault (`tests/db.test.ts`)**: 600,000 PBKDF2 iterations, AES-GCM 256-bit encryption/decryption, wrong-passphrase rejection, plaintext lock-screen card, and Zod backup schema enforcement.
- **Weather & AQI (`tests/weather.test.ts`)**: Full WMO weather code descriptions, 6 EPA categories, and zero-simulation offline behavior.
- **First Aid Mandates (`tests/firstAid.test.ts`)**: Critical protocol step 1 emergency call mandate, 110 BPM metronome range, and clinical citations.

```bash
# Run all automated tests
npx vitest run

# Run hospital verification audit script
npx tsx scripts/check-hospital-data.ts
```

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 19 + TypeScript strict
- **Bundler**: Vite 8 + Tailwind v4
- **3D Engine**: Three.js (isometric diorama with GPU resource disposal)
- **Satellite Mapping**: Leaflet (`leaflet` + `@types/leaflet`)
- **Validation**: Zod
- **Testing**: Vitest + Fake-IndexedDB
- **Cryptography**: W3C Web Cryptography API (PBKDF2 600k iters, AES-GCM 256-bit)
- **Local Storage**: IndexedDB (Zero-knowledge local persistence)
- **Weather API**: Open-Meteo (CORS-friendly, zero auth)

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server (runs on port 3333)
npm run dev

# 3. Run type check
npx tsc --noEmit

# 4. Run automated test suite
npx vitest run

# 5. Build optimized production bundle
npm run build

# 6. Preview production build
npm run preview
```

---

## 📋 Clinical Governance & Items Requiring Certified Human Sign-Off

In accordance with medical software safety principles (IEC 62304 / SaMD standards), PulseCare+ enforces strict truthfulness and demarcates automated software functions from certified human clinical decisions:

1. **Clinical Protocol Sign-Off**:
   - CPR, Choking, Anaphylaxis, Hemorrhage, and Stroke triage sequences strictly cite AHA (2020/2025 updates), ERC (2021), and WHO guidelines. Production deployment in health systems requires formal review and signature from a certified emergency medicine clinical advisory board.
2. **Institutional Telephone & Trauma Registry Verification**:
   - The directory in `src/data/hospitals.ts` contains 29 verified medical centers across Delhi, Mumbai, Bengaluru, Kolkata, London, and Geneva with source citations verified as of October 2026. Municipal rollout requires scheduled bi-annual registry audits to verify emergency direct-dial phone routing and licensed bed capacity references.
3. **National Mental Health Crisis Integration**:
   - Crisis triage routing to **Tele-MANAS (`14416` / `1800 891 4416`)** adheres to India's National Tele Mental Health Programme guidelines. Regional deployments in other jurisdictions must map and verify local statutory mental health helplines (e.g., 988 in the US/Canada, 111 in the UK).
4. **Data Privacy & Statutory Medical Records Compliance**:
   - Client-side IndexedDB encryption (PBKDF2 600,000 iterations + AES-GCM 256-bit) and plaintext lock-screen emergency card operate strictly on zero-knowledge architecture. Enterprise deployment requires formal review under HIPAA (US), GDPR (EU), or DPDP Act (India).

---

## ⚖️ Legal & Medical Disclaimer

PulseCare+ is an emergency preparedness, triage guidance, and health education platform. It does not provide clinical diagnoses, prescriptive medical treatment, or automatic emergency dispatch. In any life-threatening crisis, immediately place a direct telephone call to **112** (or your local emergency number: 999 in the UK, 911 in the US).
