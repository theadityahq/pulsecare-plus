import React, { useState, lazy, Suspense } from 'react';
import {
  Home,
  Bell,
  MapPin,
  Bot,
  PlusSquare,
  FileText,
  Users,
  Search,
  Sparkles,
  Sun,
  Leaf,
  Phone,
  ArrowRight,
  Cross,
  Pill,
  Siren,
  Building2,
  Shield,
  Flame,
  Truck,
  ShieldAlert,
  Radio,
  X,
  User,
  HeartPulse,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
  Clock,
  Compass
} from 'lucide-react';

// Code-split dynamic chunks
const SpatialHealthGlobe = lazy(() =>
  import('./components/SpatialHealthGlobe').then((m) => ({ default: m.SpatialHealthGlobe }))
);
const EmergencySOSModal = lazy(() =>
  import('./components/EmergencySOSModal').then((m) => ({ default: m.EmergencySOSModal }))
);
const MedicalIDCard = lazy(() =>
  import('./components/MedicalIDCard').then((m) => ({ default: m.MedicalIDCard }))
);
const AIAssistantModal = lazy(() =>
  import('./components/AIAssistantModal').then((m) => ({ default: m.AIAssistantModal }))
);
const VitalsMonitorModal = lazy(() =>
  import('./components/VitalsMonitorModal').then((m) => ({ default: m.VitalsMonitorModal }))
);
const PharmaciesModal = lazy(() =>
  import('./components/PharmaciesModal').then((m) => ({ default: m.PharmaciesModal }))
);
const EmergencyPrepModal = lazy(() =>
  import('./components/EmergencyPrepModal').then((m) => ({ default: m.EmergencyPrepModal }))
);
const LiveServicesTrackerModal = lazy(() =>
  import('./components/LiveServicesTrackerModal').then((m) => ({ default: m.LiveServicesTrackerModal }))
);
const FirstAidLibrary = lazy(() =>
  import('./components/FirstAidLibrary').then((m) => ({ default: m.FirstAidLibrary }))
);
const HospitalLocator = lazy(() =>
  import('./components/HospitalLocator').then((m) => ({ default: m.HospitalLocator }))
);
const CommunityAndContacts = lazy(() =>
  import('./components/CommunityAndContacts').then((m) => ({ default: m.CommunityAndContacts }))
);

import {
  HolographicHeart,
  HolographicBrain,
  HolographicShield,
  HolographicCommunity
} from './components/HolographicVisuals';
import { PulseCareEmblem } from './components/PulseCareEmblem';
import { Hospital } from './types';
import { HOSPITALS, SIMULATED_USER } from './data/mockData';

export function App() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(HOSPITALS[0]);
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>('Home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isMedicalIdOpen, setIsMedicalIdOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isVitalsOpen, setIsVitalsOpen] = useState<boolean>(false);
  const [isPharmaciesOpen, setIsPharmaciesOpen] = useState<boolean>(false);
  const [isPrepOpen, setIsPrepOpen] = useState<boolean>(false);
  const [liveTrackerService, setLiveTrackerService] = useState<string | null>(null);

  const handleNavClick = (label: string) => {
    setActiveNav(label);
    if (label === 'Emergency') setIsSosModalOpen(true);
    if (label === 'AI Health') setIsAiModalOpen(true);
    if (label === 'Health Records') setIsMedicalIdOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0E2720] text-[#F4F0E6] flex font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden selection:bg-[#C7AE7B]/30 selection:text-[#F4F0E6]">
      
      {/* 1. LEFT NAVIGATION RAIL (Future Clinic Architecture) */}
      <aside className="w-64 shrink-0 bg-[#0E2720]/95 backdrop-blur-xl border-r border-[#C7AE7B]/20 p-5 flex flex-col justify-between hidden lg:flex h-screen sticky top-0 z-30 shadow-2xl">
        <div className="space-y-6">
          {/* Logo & Clinical Brand Mark */}
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-[#163C32] border border-[#C7AE7B]/40 flex items-center justify-center">
              <PulseCareEmblem size={26} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-[#F4F0E6] flex items-center">
                PulseCare<span className="text-[#C7AE7B] font-serif text-xl ml-0.5">+</span>
              </h1>
              <span className="text-[10px] font-mono tracking-widest text-[#C7AE7B]/80 uppercase block">
                Emergency Health
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold" aria-label="Main Navigation">
            {[
              { id: 'Home', label: 'Home', icon: Home },
              { id: 'Emergency', label: 'Emergency', icon: Bell },
              { id: 'Find Help', label: 'Find Help', icon: MapPin },
              { id: 'AI Health', label: 'AI Health', icon: Sparkles },
              { id: 'First Aid', label: 'First Aid', icon: PlusSquare },
              { id: 'Health Records', label: 'Health Records', icon: FileText },
              { id: 'Community', label: 'Community', icon: Users },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.label)}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-[#163C32] text-[#F4F0E6] font-bold border border-[#C7AE7B]/60 shadow-md ring-1 ring-[#C7AE7B]/30'
                      : 'text-[#F4F0E6]/75 hover:text-[#F4F0E6] hover:bg-[#163C32]/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C7AE7B]' : 'text-[#F4F0E6]/60'}`} />
                  <span className="tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Telemetry Indicator */}
        <div className="space-y-3 pt-4 border-t border-[#C7AE7B]/20">
          {/* Objective Status Badge (Honest status, no false safety claims) */}
          <div className="clinic-panel p-3 rounded-2xl flex items-center justify-between border-[#C7AE7B]/20">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-[#F4F0E6]">Location Active</span>
              </div>
              <p className="text-[10px] text-[#C7AE7B] font-mono">Delhi Capital Region</p>
            </div>
            <div className="p-2 rounded-xl bg-[#163C32] text-[#C7AE7B] border border-[#C7AE7B]/30">
              <Compass className="w-4 h-4" />
            </div>
          </div>

          {/* User Profile Card */}
          <div
            onClick={() => setIsMedicalIdOpen(true)}
            className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-[#163C32]/60 cursor-pointer transition-colors border border-transparent hover:border-[#C7AE7B]/30"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsMedicalIdOpen(true)}
            title="Open Medical ID Pass"
          >
            <div className="w-10 h-10 rounded-full bg-[#163C32] border border-[#C7AE7B]/50 p-0.5 shrink-0 flex items-center justify-center text-[#C7AE7B] font-bold text-xs shadow-inner">
              AS
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#F4F0E6] truncate">{SIMULATED_USER.name}</h4>
              <p className="text-[10px] text-[#C7AE7B] font-mono">{SIMULATED_USER.bloodType} • Medical Pass</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C7AE7B]/60" />
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEW CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-[#0E2720]/90 backdrop-blur-xl border-b border-[#C7AE7B]/20 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Search Bar with keyboard shortcut */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-[#C7AE7B] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals, symptoms, medications, or first aid..."
              className="w-full bg-[#163C32]/80 border border-[#C7AE7B]/30 rounded-2xl py-2 pl-10 pr-12 text-xs text-[#F4F0E6] placeholder-[#F4F0E6]/50 focus:outline-none focus:border-[#C7AE7B] shadow-inner font-sans transition-colors"
            />
            <span className="hidden sm:inline-block absolute right-3.5 top-2.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E2720] border border-[#C7AE7B]/30 text-[#C7AE7B]">
              /
            </span>
          </div>

          {/* Environmental Health Widget */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="hidden sm:flex items-center space-x-3 clinic-panel px-4 py-2 rounded-2xl border-[#C7AE7B]/25">
              <div>
                <div className="flex items-center space-x-1.5 text-[11px] text-[#F4F0E6]/75 font-medium">
                  <span>New Delhi</span>
                  <MapPin className="w-3 h-3 text-[#C7AE7B]" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-base font-extrabold text-[#F4F0E6]">28°C</span>
                  <span className="text-xs text-[#F4F0E6]/70">Clear</span>
                  <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '24s' }} />
                </div>
              </div>
              <div className="h-6 w-[1px] bg-[#C7AE7B]/30 mx-1" />
              <div className="flex items-center space-x-1 text-[11px] text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2 py-1 rounded-xl font-mono">
                <Leaf className="w-3 h-3 text-emerald-400" />
                <span>AQI 92 · Moderate</span>
              </div>
            </div>

            {/* Mobile Emergency SOS Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-[#D94736] text-white shadow-lg active:scale-95 transition-transform"
              title="Emergency SOS"
              aria-label="Emergency SOS"
            >
              <Siren className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          
          {/* Active SOS Urgent Banner if triggered */}
          {sosActive && (
            <div className="bg-[#D94736] text-white p-4 rounded-2xl flex items-center justify-between font-bold text-xs animate-pulse shadow-2xl border border-white/20">
              <div className="flex items-center space-x-2.5">
                <Radio className="w-5 h-5 animate-ping shrink-0" />
                <span>[SIMULATION] EMERGENCY SOS ACTIVE • LOCAL RESCUE CIRCLE NOTIFIED WITH GPS COORDINATES</span>
              </div>
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#0E2720] text-white rounded-xl text-xs font-mono hover:bg-black transition-colors"
              >
                Manage
              </button>
            </div>
          )}

          {/* HERO SECTION GRID (Future Clinic Master Architecture) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* HERO LEFT COLUMN (Editorial Headline, Call 112 CTA, 4 Action Cards) - 4 Cols */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#163C32] border border-[#C7AE7B]/40 text-[11px] font-mono text-[#C7AE7B]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Always Here For You</span>
              </div>

              {/* Main Editorial Headline */}
              <div className="space-y-1.5">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F4F0E6] leading-tight font-sans">
                  Care, clarity,<br />
                  <span className="font-editorial italic font-normal text-[#C7AE7B]">
                    when it matters.
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-[#F4F0E6]/80 leading-relaxed pt-1">
                  Trusted health information and a clearer path to help. Fast emergency triage, verified hospital telemetry, and zero-knowledge medical records.
                </p>
              </div>

              {/* Prominent Emergency Action Button (Call 112 with direct carrier link & disclaimer) */}
              <div className="pt-1 space-y-2">
                <a
                  href="tel:112"
                  className="w-full relative group p-4 rounded-2xl btn-vermilion flex items-center justify-between text-white active:scale-95 transition-all block"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
                      <Phone className="w-5 h-5 fill-current animate-pulse" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-black tracking-wide block uppercase font-mono text-white">
                        Emergency Help — Call 112
                      </span>
                      <span className="text-[11px] text-white font-medium">
                        Instant direct telephone connection
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </a>

                {/* Explicit Carrier Call Disclaimer */}
                <p className="text-[10px] text-[#F4F0E6]/60 leading-tight px-1 font-mono">
                  * Calls place directly through your device's cellular dialer to 112. PulseCare+ does not automatically dispatch vehicles.
                </p>
              </div>

              {/* 4 Quick Action Cards (Find Hospitals, First Aid, Pharmacies, Medical ID) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 pt-1">
                <button
                  onClick={() => setActiveNav('Find Help')}
                  className="clinic-panel p-3 rounded-2xl flex flex-col items-center text-center space-y-2 hover:border-[#C7AE7B] hover:scale-105 transition-all shadow-sm group"
                >
                  <div className="p-2 rounded-xl bg-[#163C32] text-[#C7AE7B] border border-[#C7AE7B]/30 group-hover:bg-[#C7AE7B] group-hover:text-[#0E2720] transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#F4F0E6]">Find Hospitals</span>
                </button>

                <button
                  onClick={() => setActiveNav('First Aid')}
                  className="clinic-panel p-3 rounded-2xl flex flex-col items-center text-center space-y-2 hover:border-[#C7AE7B] hover:scale-105 transition-all shadow-sm group"
                >
                  <div className="p-2 rounded-xl bg-[#163C32] text-[#D94736] border border-[#D94736]/30 group-hover:bg-[#D94736] group-hover:text-white transition-colors">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#F4F0E6]">First Aid Guide</span>
                </button>

                <button
                  onClick={() => setIsPharmaciesOpen(true)}
                  className="clinic-panel p-3 rounded-2xl flex flex-col items-center text-center space-y-2 hover:border-[#C7AE7B] hover:scale-105 transition-all shadow-sm group"
                >
                  <div className="p-2 rounded-xl bg-[#163C32] text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-[#0E2720] transition-colors">
                    <Pill className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#F4F0E6]">24/7 Pharmacies</span>
                </button>

                <button
                  onClick={() => setIsMedicalIdOpen(true)}
                  className="clinic-panel p-3 rounded-2xl flex flex-col items-center text-center space-y-2 hover:border-[#C7AE7B] hover:scale-105 transition-all shadow-sm group"
                >
                  <div className="p-2 rounded-xl bg-[#163C32] text-[#C7AE7B] border border-[#C7AE7B]/30 group-hover:bg-[#C7AE7B] group-hover:text-[#0E2720] transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#F4F0E6]">Medical ID Pass</span>
                </button>
              </div>
            </div>

            {/* HERO CENTER COLUMN (Geometric Emblem Dialogue & 3D Spatial Health Globe) - 5 Cols */}
            <div className="lg:col-span-5 space-y-4 relative flex flex-col items-center">
              
              {/* Refined PulseCare Emblem & Conversational Speech Bubble */}
              <div className="relative w-full flex items-center justify-center">
                <PulseCareEmblem size={110} />

                {/* Floating Dialogue Bubble in Warm Ivory / Champagne */}
                <div
                  onClick={() => setIsAiModalOpen(true)}
                  className="absolute right-0 sm:right-4 top-2 max-w-[220px] clinic-panel-elevated p-3 rounded-2xl border-[#C7AE7B]/40 cursor-pointer hover:scale-105 transition-all shadow-xl flex items-center justify-between space-x-2"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setIsAiModalOpen(true)}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#F4F0E6] flex items-center gap-1.5">
                      PulseCare Triage
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C7AE7B] animate-ping" />
                    </p>
                    <p className="text-[10px] text-[#F4F0E6]/80 leading-tight">
                      Instant clinical triage, symptom analysis & first-aid steps.
                    </p>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#F4F0E6] text-[#1D2521] shrink-0 shadow">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* 3D SPATIAL HEALTH GLOBE CENTREPIECE */}
              <div className="w-full">
                <Suspense
                  fallback={
                    <div className="w-full h-[400px] sm:h-[460px] rounded-3xl clinic-panel flex flex-col items-center justify-center space-y-3 text-[#C7AE7B] font-mono text-xs border border-[#C7AE7B]/30">
                      <div className="w-8 h-8 rounded-full border-2 border-[#C7AE7B] border-t-transparent animate-spin" />
                      <span>INITIALIZING SPATIAL HEALTH GLOBE...</span>
                    </div>
                  }
                >
                  <SpatialHealthGlobe
                    selectedHospital={selectedHospital}
                    onSelectHospital={(h) => setSelectedHospital(h)}
                    sosActive={sosActive}
                  />
                </Suspense>
              </div>
            </div>

            {/* HERO RIGHT COLUMN (Nearby Verified Emergency Facilities with Sync Focus) - 3 Cols */}
            <div className="lg:col-span-3 space-y-4">
              <div className="clinic-panel-elevated p-5 rounded-3xl border-[#C7AE7B]/25 space-y-4 shadow-xl">
                
                {/* Header */}
                <div className="flex items-center space-x-3 pb-3 border-b border-[#F4F0E6]/10">
                  <div className="p-2.5 rounded-2xl bg-[#163C32] text-[#C7AE7B] border border-[#C7AE7B]/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#F4F0E6]">Nearby Facilities</h3>
                    <p className="text-[10px] text-[#C7AE7B] font-mono">Syncs with 3D Globe</p>
                  </div>
                </div>

                {/* Filterable / Selectable Hospital Cards */}
                <div className="space-y-2.5" role="list">
                  {HOSPITALS.slice(0, 4).map((hosp) => {
                    const isSelected = selectedHospital?.id === hosp.id;
                    return (
                      <div
                        key={hosp.id}
                        onClick={() => setSelectedHospital(hosp)}
                        className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between transition-all border ${
                          isSelected
                            ? 'bg-[#163C32] border-[#C7AE7B] ring-1 ring-[#C7AE7B]/40 shadow-md'
                            : 'bg-[#0E2720]/80 border-[#F4F0E6]/10 hover:border-[#C7AE7B]/50'
                        }`}
                        role="listitem"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedHospital(hosp)}
                      >
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-mono font-bold text-[#C7AE7B] uppercase">
                              {hosp.category === 'Trauma Center Level 1' ? 'Trauma L1' : hosp.category}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D94736] animate-pulse" />
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-[#F4F0E6] truncate">{hosp.name}</h4>
                          <p className="text-[10px] text-[#F4F0E6]/70 font-mono">
                            {hosp.icuBedsAvailable} ICU beds • {hosp.erWaitTime}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-[#FF8A7A] block">
                            {hosp.driveTime}
                          </span>
                          <span className="text-[10px] text-[#F4F0E6]/80 font-mono">
                            {hosp.distance}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Demo Data Disclaimer */}
                <div className="p-3 rounded-2xl bg-[#0E2720]/80 border border-[#C7AE7B]/20 text-[10px] text-[#C7AE7B] font-mono text-center">
                  * Demo data — simulated response times & bed occupancy
                </div>
              </div>
            </div>
          </section>

          {/* 3. BOTTOM SPATIAL FEATURE DECK (Purposeful Asymmetry) */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#C7AE7B] font-bold">
                Clinical Modules & Community Safety Network
              </h3>
              <span className="text-[11px] text-[#F4F0E6]/70 font-mono hidden sm:inline">
                Dual-Tier Zero-Knowledge Passports & Offline Responders
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* CARD 1: Health Check (Vitals & Biometrics) */}
              <div
                onClick={() => setIsVitalsOpen(true)}
                className="clinic-panel p-5 rounded-3xl border border-[#D94736]/30 hover:border-[#D94736] hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsVitalsOpen(true)}
              >
                <div>
                  <HolographicHeart />
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#F4F0E6]">Vitals & Telemetry</h4>
                    <p className="text-xs text-[#F4F0E6]/75 mt-0.5">Biometric monitoring & heart rhythm</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4F0E6]/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#FF8A7A] font-semibold">ECG & SpO2 Sync</span>
                  <div className="w-7 h-7 rounded-full bg-[#163C32] text-[#F4F0E6] flex items-center justify-center group-hover:translate-x-1 transition-transform border border-[#C7AE7B]/30">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* CARD 2: AI Symptom Checker */}
              <div
                onClick={() => setIsAiModalOpen(true)}
                className="clinic-panel p-5 rounded-3xl border border-[#C7AE7B]/30 hover:border-[#C7AE7B] hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsAiModalOpen(true)}
              >
                <div>
                  <HolographicBrain />
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#F4F0E6]">Symptom Checker</h4>
                    <p className="text-xs text-[#F4F0E6]/75 mt-0.5">Conversational emergency triage</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4F0E6]/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#C7AE7B] font-semibold">Evidence-Based</span>
                  <div className="w-7 h-7 rounded-full bg-[#163C32] text-[#F4F0E6] flex items-center justify-center group-hover:translate-x-1 transition-transform border border-[#C7AE7B]/30">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* CARD 3: Emergency Preparation (Go-Bag & Drills) */}
              <div
                onClick={() => setIsPrepOpen(true)}
                className="clinic-panel p-5 rounded-3xl border border-[#C7AE7B]/30 hover:border-[#C7AE7B] hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsPrepOpen(true)}
              >
                <div>
                  <HolographicShield />
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#F4F0E6]">Crisis Preparation</h4>
                    <p className="text-xs text-[#F4F0E6]/75 mt-0.5">Go-bag checklists & trauma readiness</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4F0E6]/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#C7AE7B] font-semibold">Protocols</span>
                  <div className="w-7 h-7 rounded-full bg-[#163C32] text-[#F4F0E6] flex items-center justify-center group-hover:translate-x-1 transition-transform border border-[#C7AE7B]/30">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* CARD 4: Community Help (AED Beacons) */}
              <div
                onClick={() => setActiveNav('Community')}
                className="clinic-panel p-5 rounded-3xl border border-[#C7AE7B]/30 hover:border-[#C7AE7B] hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveNav('Community')}
              >
                <div>
                  <HolographicCommunity />
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#F4F0E6]">Community Help</h4>
                    <p className="text-xs text-[#F4F0E6]/75 mt-0.5">Public AED beacons & volunteer responders</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4F0E6]/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#C7AE7B] font-semibold">AED Network</span>
                  <div className="w-7 h-7 rounded-full bg-[#163C32] text-[#F4F0E6] flex items-center justify-center group-hover:translate-x-1 transition-transform border border-[#C7AE7B]/30">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Expanded Navigation Sections */}
          <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-[#C7AE7B]">Loading module...</div>}>
            {activeNav === 'Find Help' && (
              <div className="pt-6">
                <HospitalLocator
                  selectedHospital={selectedHospital}
                  onSelectHospital={(h) => setSelectedHospital(h)}
                />
              </div>
            )}

            {activeNav === 'First Aid' && (
              <div className="pt-6">
                <FirstAidLibrary />
              </div>
            )}

            {activeNav === 'Community' && (
              <div className="pt-6">
                <CommunityAndContacts />
              </div>
            )}
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#C7AE7B]/20 bg-[#0E2720] py-6 px-8 text-xs text-[#F4F0E6]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="font-bold text-[#F4F0E6]">PulseCare+ Emergency Health Platform</p>
            <p className="font-mono text-[11px] text-[#C7AE7B]">
              Dual-Tier Zero-Knowledge Architecture • 3D Spatial Health Globe • Offline Emergency Passes
            </p>
          </div>
          <div className="flex items-center space-x-3 font-mono text-[11px] text-[#F4F0E6]/80">
            <button onClick={() => setIsMedicalIdOpen(true)} className="hover:text-[#C7AE7B] transition-colors">
              Medical ID Pass
            </button>
            <span>•</span>
            <button onClick={() => setIsAiModalOpen(true)} className="hover:text-[#C7AE7B] transition-colors">
              AI Triage
            </button>
            <span>•</span>
            <button onClick={() => setIsSosModalOpen(true)} className="text-[#FF8A7A] hover:underline font-bold">
              Emergency SOS
            </button>
          </div>
        </footer>
      </div>

      {/* ALL MODALS (Lazy Loaded) */}
      <Suspense fallback={null}>
        <EmergencySOSModal
          isOpen={isSosModalOpen}
          onClose={() => setIsSosModalOpen(false)}
          sosActive={sosActive}
          setSosActive={setSosActive}
          onOpenMedicalId={() => setIsMedicalIdOpen(true)}
        />

        <MedicalIDCard
          isOpen={isMedicalIdOpen}
          onClose={() => setIsMedicalIdOpen(false)}
        />

        <AIAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onTriggerSOS={() => {
            setIsSosModalOpen(true);
          }}
        />

        <VitalsMonitorModal
          isOpen={isVitalsOpen}
          onClose={() => setIsVitalsOpen(false)}
        />

        <PharmaciesModal
          isOpen={isPharmaciesOpen}
          onClose={() => setIsPharmaciesOpen(false)}
        />

        <EmergencyPrepModal
          isOpen={isPrepOpen}
          onClose={() => setIsPrepOpen(false)}
          onOpenMedicalId={() => setIsMedicalIdOpen(true)}
        />

        <LiveServicesTrackerModal
          isOpen={Boolean(liveTrackerService)}
          onClose={() => setLiveTrackerService(null)}
          serviceType={liveTrackerService || 'Ambulance'}
        />
      </Suspense>
    </div>
  );
}

export default App;
