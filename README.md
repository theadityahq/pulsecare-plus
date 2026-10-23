# PulseCare+ (Future Clinic Emergency Health Platform)

> **"Care, clarity, when it matters."**  
> An architectural, human-centered spatial emergency health and triage platform built for high-stakes medical preparedness, real-time hospital telemetry, and zero-knowledge medical passports.

---

## 🎨 Art Direction: Future Clinic

PulseCare+ avoids generic AI tropes (no purple/magenta gradients, electric blue neon, or cyberpunk noise). Instead, it adopts a dignified, editorial, and tactile **Future Clinic** design language:

- **Warm Ivory (`#F4F0E6`)**: Architectural warmth and human clinical surfaces.
- **Deep Forest Green (`#163C32` / `#0E2720`)**: Grounding, calm, authoritative medical backdrop.
- **Restrained Vermilion (`#B82E1E` / `#D94736`)**: Clear, decisive emergency action points and telemetry pulses.
- **Muted Champagne (`#C7AE7B`)**: Precision navigational rings, graticule lines, and orbital telemetry arcs.
- **Deep Ink (`#1D2521`)**: High-contrast, legible typography.
- **Editorial Typography**: Combined `Newsreader` (humanistic, editorial serif) and `Plus Jakarta Sans` (clean, geometric sans).

---

## 🌍 Signature 3D Centrepiece: Spatial Health Globe

Replaces miniature block cities with an interactive 3D **Spatial Health Globe** powered by Three.js:
- **Spherical Geography**: Procedural vector continent textures with recognizable world landmasses and bathymetric ocean depth in Deep Forest Green and Warm Ivory.
- **Authentic Medical Coordinates**: Spherical projection $(lat, lng \rightarrow \mathbb{R}^3)$ for major medical centers including AIIMS Apex Trauma Center, Safdarjung Hospital, Max Healthcare Saket, Indraprastha Apollo, and Fortis Escorts.
- **Geometric Beacon Hierarchy**:
  - `+` Medical Cross: Level 1 Trauma Centers
  - `◇` Diamond: 24/7 Cardiac Emergency (STEMI)
  - `○` Dodecahedron: Multi-specialty General Hospitals
- **Interactive Raycasting & Camera Slerp**: Click or select any hospital to smoothly rotate and orbit the globe to focus on that facility.
- **Accessibility & 2D Projection Fallback**: Includes a dedicated switch to toggle between the 3D WebGL sphere and an accessible, high-contrast 2D planar care grid with full keyboard navigation and screen-reader support. Respects `prefers-reduced-motion`.

---

## 🛡️ Core Capabilities

1. **Dual-Tier Emergency Medical Passport (VitalVault)**:
   - **Tier 1 (Public Triage Mode)**: No password required. Emergency responders scan the lockscreen QR code to instantly see life-critical data (Blood Group, Lethal Drug Allergies, Chronic Conditions, Emergency Contacts).
   - **Tier 2 (Zero-Knowledge Encrypted Vault)**: Full medical records (lab reports, physician notes, prescription history) encrypted client-side. Accessible only when authorized by biometric/passphrase.
2. **PulseCare Triage Intelligence**:
   - Conversational triage assistant with a geometric medical emblem.
   - Clear clinical disclaimer: *"Health information assistant — provides general guidance, not clinical diagnosis."*
   - Immediate red flag redirection to direct phone call (`tel:112`) and first-aid protocols.
3. **Direct Emergency Action**:
   - Primary Vermilion CTA: `Emergency Help — Call 112` via direct device cellular dialer.
   - Transparent disclaimer: Emergency calls are placed by user; no false automatic dispatch claims.
4. **Verified First-Aid Protocols**:
   - 110 BPM visual metronome for Adult Cardiopulmonary Resuscitation (CPR).
   - Severe airway obstruction (Heimlich maneuver), traumatic arterial bleeding hemostasis, and anaphylaxis auto-injector protocols.
5. **Community AED Beacons**:
   - Public access defibrillator telemetry calibrated for Delhi NCR transport hubs.

---

## 📊 Lighthouse Audit Results

Audited using Google Lighthouse against production preview build:

| Metric | Score | Status |
| :--- | :--- | :--- |
| **Accessibility** | **100 / 100** | ✅ Perfect WCAG 2.2 AA Contrast & ARIA |
| **Best Practices** | **100 / 100** | ✅ Zero vulnerabilities, modern web standards |
| **SEO** | **100 / 100** | ✅ Canonical links, meta tags, semantic landmarks |
| **Performance** | **86 / 100** | ✅ Lazy-loaded Three.js chunks, TBT: 210ms, CLS: 0.009 |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 with Rolldown manual chunk splitting
- **Styling**: Tailwind CSS v4 with custom CSS variable tokens
- **3D Graphics**: Three.js (code-split chunk `assets/three-*.js`)
- **Icons**: Lucide React
- **QR Engine**: `qrcode` client-side SVG renderer

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server (runs on port 3333)
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Preview production build (runs on port 4173)
npm run preview
```

---

## 📄 License & Disclaimer

PulseCare+ is developed for demonstration, educational triage guidance, and rapid medical preparedness. In an active medical emergency, always call local emergency services (**112** in India / Europe, **911** in the USA). All facility telemetry data is labeled as simulated demo data.
