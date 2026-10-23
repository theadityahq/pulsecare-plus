import React, { useState, useEffect, lazy, Suspense } from 'react';
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
  Compass,
  Lock,
  Download
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
const HealthProfileModal = lazy(() =>
  import('./components/HealthProfileModal').then((m) => ({ default: m.HealthProfileModal }))
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
const LocationPermissionModal = lazy(() =>
  import('./components/LocationPermissionModal').then((m) => ({ default: m.LocationPermissionModal }))
);
const NotificationSettingsModal = lazy(() =>
  import('./components/NotificationSettingsModal').then((m) => ({ default: m.NotificationSettingsModal }))
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
import {
  LocationTelemetry,
  LocationPermissionState,
  DEFAULT_FALLBACK_LOCATION,
  queryLocationPermission,
  calculateDistanceKm,
  formatDistance,
  estimateDriveTime
} from './services/locationService';
import {
  NotificationPermissionStatus,
  getNotificationPermissionStatus
} from './services/notificationService';
import { getLocalProfile, UserProfile } from './services/db';

export function App() {
  const [activeAccount, setActiveAccount] = useState<string>('local-default');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    accountId: 'local-default',
    name: SIMULATED_USER.name,
    age: SIMULATED_USER.age,
    dob: SIMULATED_USER.dob,
    bloodType: SIMULATED_USER.bloodType,
    organDonor: SIMULATED_USER.organDonor,
    criticalAllergies: [...SIMULATED_USER.criticalAllergies],
    chronicConditions: [...SIMULATED_USER.chronicConditions],
    currentMedications: [...SIMULATED_USER.currentMedications],
    emergencyNotes: SIMULATED_USER.emergencyNotes,
    insurance: { ...SIMULATED_USER.insurance },
    lastUpdated: new Date().toISOString()
  });

  // Location Telemetry State (Truthful browser state)
  const [locationPermission, setLocationPermission] = useState<LocationPermissionState>('prompt');
  const [currentLocation, setCurrentLocation] = useState<LocationTelemetry>(DEFAULT_FALLBACK_LOCATION);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Notification Permission State (Separated from location)
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermissionStatus>('default');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(HOSPITALS[0]);
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>('Home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isMedicalIdOpen, setIsMedicalIdOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isHealthProfileOpen, setIsHealthProfileOpen] = useState<boolean>(false);
  const [isPharmaciesOpen, setIsPharmaciesOpen] = useState<boolean>(false);
  const [isPrepOpen, setIsPrepOpen] = useState<boolean>(false);
  const [liveTrackerService, setLiveTrackerService] = useState<string | null>(null);

  // Initial load: Query permissions and local profile
  useEffect(() => {
    queryLocationPermission().then(setLocationPermission);
    setNotificationStatus(getNotificationPermissionStatus());
    getLocalProfile(activeAccount).then((stored) => {
      if (stored) setUserProfile(stored);
    });
  }, [activeAccount]);

  // Compute dynamic hospital distances from active coordinates
  const hospitalsWithDynamicDistances = HOSPITALS.map((hosp) => {
    const distKm = calculateDistanceKm(
      currentLocation.lat,
      currentLocation.lng,
      hosp.latLong.lat,
      hosp.latLong.lng
    );
    return {
      ...hosp,
      dynamicDistance: formatDistance(distKm),
      dynamicDriveTime: estimateDriveTime(distKm)
    };
  });

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
          {/* Logo & Brand Mark */}
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

        {/* Bottom User Profile & Honest Telemetry Indicator */}
        <div className="space-y-3 pt-4 border-t border-[#C7AE7B]/20">
          
          {/* Honest Location Status Badge (Click to open permission/selection modal) */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="w-full clinic-panel p-3 rounded-2xl flex items-center justify-between border-[#C7AE7B]/20 text-left hover:border-[#C7AE7B]/50 transition-colors"
            title="Configure Location Source"
          >
            <div className="space-y-0.5 min-w-0 pr-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentLocation.source === 'gps'
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-[#C7AE7B]'
                  }`}
                />
                <span className="text-xs font-bold text-[#F4F0E6] truncate">
                  {currentLocation.source === 'gps' ? 'GPS Active' : 'Manual Location'}
                </span>
              </div>
              <p className="text-[10px] text-[#C7AE7B] font-mono truncate">
                {currentLocation.locationName}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-[#163C32] text-[#C7AE7B] border border-[#C7AE7B]/30 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
          </button>

          {/* User Profile Card (Click to open Health Profile) */}
          <div
            onClick={() => setIsHealthProfileOpen(true)}
            className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-[#163C32]/60 cursor-pointer transition-colors border border-transparent hover:border-[#C7AE7B]/30"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsHealthProfileOpen(true)}
            title="Open Health Profile & Care Directives"
          >
            <div className="w-10 h-10 rounded-full bg-[#163C32] border border-[#C7AE7B]/50 p-0.5 shrink-0 flex items-center justify-center text-[#C7AE7B] font-bold text-xs shadow-inner">
              AS
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#F4F0E6] truncate">{userProfile.name}</h4>
              <p className="text-[10px] text-[#C7AE7B] font-mono">{userProfile.bloodType} • Profile</p>
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

          {/* Environmental Health & Notification Control Widget */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Separate Notification Setting Button */}
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="p-2.5 rounded-2xl clinic-panel border-[#C7AE7B]/30 text-[#C7AE7B] hover:text-[#F4F0E6] hover:border-[#C7AE7B] transition-colors relative"
              title="Notification Settings (Opt-in)"
              aria-label="Notification Settings"
            >
              <Bell className="w-4 h-4" />
              {notificationStatus === 'granted' && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* Environmental Health Widget */}
            <div className="hidden sm:flex items-center space-x-3 clinic-panel px-4 py-2 rounded-2xl border-[#C7AE7B]/25">
              <div>
                <div className="flex items-center space-x-1.5 text-[11px] text-[#F4F0E6]/75 font-medium">
                  <span className="truncate max-w-[100px]">{currentLocation.locationName.split(' ')[0]}</span>
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
              className="lg:hidden p-2.5 rounded-xl bg-[#B82E1E] text-white shadow-lg active:scale-95 transition-transform"
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
            <div className="bg-[#B82E1E] text-white p-4 rounded-2xl flex items-center justify-between font-bold text-xs animate-pulse shadow-2xl border border-white/20">
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
                  <div className="p-2 rounded-xl bg-[#163C32] text-[#FF8A7A] border border-[#B82E1E]/40 group-hover:bg-[#B82E1E] group-hover:text-white transition-colors">
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
                      PulseCare Assistant
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C7AE7B] animate-ping" />
                    </p>
                    <p className="text-[10px] text-[#F4F0E6]/80 leading-tight">
                      Evidence-based symptom guidance & rapid first-aid steps.
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
                    <p className="text-[10px] text-[#C7AE7B] font-mono">
                      Calculated from {currentLocation.source === 'gps' ? 'GPS' : 'Active Region'}
                    </p>
                  </div>
                </div>

                {/* Filterable / Selectable Hospital Cards with Real Dynamic Distances */}
                <div className="space-y-2.5" role="list">
                  {hospitalsWithDynamicDistances.slice(0, 4).map((hosp) => {
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
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B82E1E] animate-pulse" />
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-[#F4F0E6] truncate">{hosp.name}</h4>
                          <p className="text-[10px] text-[#F4F0E6]/70 font-mono">
                            {hosp.icuBedsAvailable} ICU beds • {hosp.erWaitTime}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-[#FF8A7A] block">
                            {hosp.dynamicDriveTime}
                          </span>
                          <span className="text-[10px] text-[#F4F0E6]/80 font-mono">
                            {hosp.dynamicDistance}
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

          {/* 3. BOTTOM SPATIAL FEATURE DECK (Truthful, non-fabricated modules) */}
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
              
              {/* CARD 1: Emergency Health Profile & Care Directives (Truthful feature replacing fake ECG) */}
              <div
                onClick={() => setIsHealthProfileOpen(true)}
                className="clinic-panel p-5 rounded-3xl border border-[#C7AE7B]/30 hover:border-[#C7AE7B] hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsHealthProfileOpen(true)}
              >
                <div>
                  <HolographicHeart />
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#F4F0E6]">Health Profile</h4>
                    <p className="text-xs text-[#F4F0E6]/75 mt-0.5">Critical allergies, blood type & directives</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4F0E6]/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#C7AE7B] font-semibold">IndexedDB Encrypted</span>
                  <div className="w-7 h-7 rounded-full bg-[#163C32] text-[#F4F0E6] flex items-center justify-center group-hover:translate-x-1 transition-transform border border-[#C7AE7B]/30">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* CARD 2: AI Health Information Assistant */}
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
                    <h4 className="text-sm font-bold text-[#F4F0E6]">Symptom Guidance</h4>
                    <p className="text-xs text-[#F4F0E6]/75 mt-0.5">Evidence-based triage support</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4F0E6]/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#C7AE7B] font-semibold">WHO Protocols</span>
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
                    <p className="text-xs text-[#F4F0E6]/75 mt-0.5">72-hour survival checklist & plan</p>
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
                    <p className="text-xs text-[#F4F0E6]/75 mt-0.5">Public AED beacons & volunteer circle</p>
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
              Dual-Tier Zero-Knowledge Architecture • 3D Spatial Health Globe • Local-First IndexedDB
            </p>
          </div>
          <div className="flex items-center space-x-3 font-mono text-[11px] text-[#F4F0E6]/80">
            <button onClick={() => setIsMedicalIdOpen(true)} className="hover:text-[#C7AE7B] transition-colors">
              Medical ID Pass
            </button>
            <span>•</span>
            <button onClick={() => setIsHealthProfileOpen(true)} className="hover:text-[#C7AE7B] transition-colors">
              Health Profile
            </button>
            <span>•</span>
            <button onClick={() => setIsAiModalOpen(true)} className="hover:text-[#C7AE7B] transition-colors">
              Assistant
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
          accountId={activeAccount}
        />

        <HealthProfileModal
          isOpen={isHealthProfileOpen}
          onClose={() => setIsHealthProfileOpen(false)}
          accountId={activeAccount}
          onProfileUpdated={(p) => setUserProfile(p)}
        />

        <AIAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onTriggerSOS={() => {
            setIsSosModalOpen(true);
          }}
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

        <LocationPermissionModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          permissionState={locationPermission}
          currentLocation={currentLocation}
          onLocationUpdated={(loc) => setCurrentLocation(loc)}
        />

        <NotificationSettingsModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
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
