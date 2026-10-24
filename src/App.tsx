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
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  Snowflake,
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
  Download,
  Stethoscope
} from 'lucide-react';

// Code-split dynamic chunks
const SpatialMedicalCity = lazy(() =>
  import('./components/SpatialMedicalCity').then((m) => ({ default: m.SpatialMedicalCity }))
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

import { EducationalAnatomyPanel } from './components/EducationalAnatomyPanel';
import { AIHealthHologram } from './components/AIHealthHologram';
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
  estimateDriveTime,
  getHospitalsForLocation
} from './services/locationService';
import {
  NotificationPermissionStatus,
  getNotificationPermissionStatus
} from './services/notificationService';
import {
  WeatherTelemetry,
  fetchLiveWeather,
  getFallbackWeather
} from './services/weatherService';
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

  // Dynamic regional hospitals & live weather telemetry
  const [activeHospitals, setActiveHospitals] = useState<Hospital[]>(() => {
    return getHospitalsForLocation(
      DEFAULT_FALLBACK_LOCATION.lat,
      DEFAULT_FALLBACK_LOCATION.lng,
      DEFAULT_FALLBACK_LOCATION.locationName
    ).hospitals;
  });
  const [weather, setWeather] = useState<WeatherTelemetry>(() =>
    getFallbackWeather(DEFAULT_FALLBACK_LOCATION.lat, DEFAULT_FALLBACK_LOCATION.lng)
  );

  // Notification Permission State (Separated from location)
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermissionStatus>('default');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(activeHospitals[0] || HOSPITALS[0]);
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

  // Dynamically update regional hospitals and live weather whenever location changes
  useEffect(() => {
    const { hospitals: newHospitals } = getHospitalsForLocation(
      currentLocation.lat,
      currentLocation.lng,
      currentLocation.locationName
    );
    setActiveHospitals(newHospitals);
    setSelectedHospital(newHospitals[0]);

    let cancelled = false;
    fetchLiveWeather(currentLocation.lat, currentLocation.lng).then((res) => {
      if (!cancelled) {
        setWeather(res);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [currentLocation.lat, currentLocation.lng, currentLocation.locationName]);

  const renderWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) {
      return <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '24s' }} />;
    }
    if (code === 2 || code === 3) {
      return <CloudSun className="w-3.5 h-3.5 text-amber-500" />;
    }
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return <CloudRain className="w-3.5 h-3.5 text-blue-500" />;
    }
    if (code >= 71 && code <= 77) {
      return <Snowflake className="w-3.5 h-3.5 text-sky-400" />;
    }
    if (code >= 95) {
      return <CloudLightning className="w-3.5 h-3.5 text-amber-500" />;
    }
    return <Cloud className="w-3.5 h-3.5 text-[#173E35]/60" />;
  };

  const handleNavClick = (label: string) => {
    setActiveNav(label);
    if (label === 'Emergency') setIsSosModalOpen(true);
    if (label === 'AI Health') setIsAiModalOpen(true);
    if (label === 'Health Records') setIsMedicalIdOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F1F0E9] text-[#173E35] flex font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden selection:bg-[#C4A66B]/30 selection:text-[#173E35]">
      
      {/* 1. LEFT NAVIGATION RAIL (Future Clinic Light Architecture) */}
      <aside className="w-64 shrink-0 bg-[#FAF8F5] border-r border-[#C4A66B]/25 p-5 flex flex-col justify-between hidden lg:flex h-screen sticky top-0 z-30 shadow-sm">
        <div className="space-y-6">
          {/* Logo & Brand Mark */}
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center shadow-xs">
              <PulseCareEmblem size={26} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-[#173E35] flex items-center">
                PulseCare<span className="text-[#C4A66B] font-serif text-xl ml-0.5">+</span>
              </h1>
              <span className="text-[10px] font-mono tracking-widest text-[#173E35]/70 uppercase block font-semibold">
                Emergency Health
              </span>
              <div className="flex items-center space-x-1.5 mt-1.5" title="Palette: Deep Forest Green (#173E35), Vermilion Coral (#D44A3C), Champagne Gold (#C4A66B) on Warm Ivory (#F1F0E9)">
                <span className="w-2.5 h-2.5 rounded-full bg-[#173E35] border border-[#C4A66B]/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D44A3C]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#C4A66B]" />
              </div>
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
                      ? 'bg-[#173E35] text-[#F1F0E9] font-bold border border-[#C4A66B]/60 shadow-md ring-1 ring-[#C4A66B]/30'
                      : 'text-[#173E35]/80 hover:text-[#173E35] hover:bg-[#EAE6DC]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C4A66B]' : 'text-[#173E35]/70'}`} />
                  <span className="tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Honest Telemetry Indicator */}
        <div className="space-y-3 pt-4 border-t border-[#C4A66B]/20">
          
          {/* Honest Location Status Badge */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="w-full bg-white p-3 rounded-2xl flex items-center justify-between border border-[#C4A66B]/25 text-left hover:border-[#173E35] transition-all shadow-xs"
            title="Configure Location Source"
          >
            <div className="space-y-0.5 min-w-0 pr-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentLocation.source === 'gps'
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-[#C4A66B]'
                  }`}
                />
                <span className="text-xs font-bold text-[#173E35] truncate">
                  {currentLocation.source === 'gps' ? 'GPS Active' : 'Manual Location'}
                </span>
              </div>
              <p className="text-[10px] text-[#173E35]/70 font-mono truncate">
                {currentLocation.locationName}
              </p>
            </div>
            <div className="p-1.5 rounded-xl bg-[#F1F0E9] text-[#173E35] border border-[#C4A66B]/30 shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* User Profile Summary */}
          <button
            onClick={() => setIsHealthProfileOpen(true)}
            className="w-full bg-white p-3 rounded-2xl border border-[#C4A66B]/25 flex items-center justify-between hover:border-[#173E35] transition-all text-left shadow-xs"
            title="Open Health Profile & Directives"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#173E35] text-[#F1F0E9] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C4A66B]/30">
                AS
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#173E35] truncate">{userProfile.name}</p>
                <p className="text-[10px] font-mono text-[#CC3B2D] font-bold">
                  {userProfile.bloodType} • Profile
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#173E35]/50" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT & HEADER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP BAR / HEADER */}
        <header className="h-20 border-b border-[#C4A66B]/20 px-4 sm:px-8 flex items-center justify-between bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-20 shadow-xs">
          
          {/* Search Input with Clean Architectural Border */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#173E35]/50" />
            <input
              type="text"
              placeholder="Search hospitals, symptoms, medications, or first aid..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#C4A66B]/30 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-[#173E35] placeholder-[#173E35]/50 focus:outline-hidden focus:border-[#173E35] focus:ring-1 focus:ring-[#173E35] transition-all shadow-xs"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#173E35]/50 bg-[#F1F0E9] px-1.5 py-0.5 rounded border border-[#C4A66B]/30">
              /
            </div>
          </div>

          {/* Right Header Status Controls */}
          <div className="flex items-center space-x-3 ml-auto sm:ml-4">
            
            {/* Notification Center Trigger */}
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="relative p-2.5 rounded-2xl bg-white border border-[#C4A66B]/30 text-[#173E35] hover:bg-[#F1F0E9] transition-colors shadow-xs"
              title="Notification Settings"
              aria-label="Notification Settings"
            >
              <Bell className="w-4 h-4" />
              {notificationStatus === 'granted' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 ring-2 ring-white" />
              )}
            </button>

            {/* Weather & Environmental Telemetry Pill */}
            <div className="hidden sm:flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl border border-[#C4A66B]/30 shadow-xs">
              <div>
                <div className="flex items-center space-x-1.5 text-[11px] text-[#173E35]/75 font-medium">
                  <span className="truncate max-w-[110px]">
                    {currentLocation.locationName.replace(/GPS:\s*/i, '').split(',')[0].trim()}
                  </span>
                  <MapPin className="w-3 h-3 text-[#C4A66B]" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-base font-extrabold text-[#173E35]">{weather.temperature}°C</span>
                  <span className="text-xs text-[#173E35]/70">{weather.condition}</span>
                  {renderWeatherIcon(weather.weatherCode)}
                </div>
              </div>
              <div className="h-6 w-[1px] bg-[#C4A66B]/30 mx-1" />
              <div className={`flex items-center space-x-1 text-[11px] px-2 py-1 rounded-xl font-mono font-medium border ${
                weather.aqi <= 50
                  ? 'text-emerald-800 bg-emerald-50 border-emerald-300/60'
                  : weather.aqi <= 100
                  ? 'text-amber-800 bg-amber-50 border-amber-300/60'
                  : 'text-[#B82819] bg-red-50 border-[#B82819]/40'
              }`}>
                <Leaf className="w-3 h-3 text-emerald-600" />
                <span>AQI {weather.aqi} · {weather.aqiCategory}</span>
              </div>
            </div>

            {/* Custom Palette Swatch Indicator */}
            <div className="hidden xl:flex items-center space-x-2.5 px-3 py-2 rounded-2xl bg-white border border-[#C4A66B]/30 text-[11px] font-mono shadow-xs" title="Site Color Swatch: Deep Forest Green (#173E35), Vermilion Coral (#D44A3C), Champagne Gold (#C4A66B) on Warm Ivory (#F1F0E9)">
              <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-[#F1F0E9] shadow-inner">
                <span className="w-2.5 h-2.5 rounded-full bg-[#173E35]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D44A3C]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#C4A66B]" />
              </div>
              <span className="text-[#173E35] font-bold tracking-wide">Palette Active</span>
            </div>

            {/* Mobile Emergency SOS Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-[#CC3B2D] text-white shadow-lg active:scale-95 transition-transform"
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
            <div className="bg-[#CC3B2D] text-white p-4 rounded-2xl flex items-center justify-between font-bold text-xs animate-pulse shadow-xl border border-white/30">
              <div className="flex items-center space-x-2.5">
                <Radio className="w-5 h-5 animate-ping shrink-0" />
                <span>[SIMULATION] EMERGENCY SOS ACTIVE • LOCAL RESCUE CIRCLE NOTIFIED WITH GPS COORDINATES</span>
              </div>
              <button
                onClick={() => setIsSosModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#173E35] text-white rounded-xl text-xs font-mono hover:bg-[#0E2721] transition-colors"
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
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#C4A66B]/40 text-[11px] font-mono text-[#173E35] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold">Always Here For You</span>
              </div>

              {/* Main Editorial Headline */}
              <div className="space-y-1.5">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#173E35] leading-tight font-sans">
                  Care, clarity,<br />
                  <span className="font-editorial italic font-normal text-[#7A5E2E]">
                    when it matters.
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-[#173E35] leading-relaxed pt-1 font-medium">
                  Trusted health information and a clearer path to help. Fast emergency triage, verified hospital telemetry, and zero-knowledge medical records.
                </p>
              </div>

              {/* Prominent Emergency Action Button (Call 112 with direct carrier link & disclaimer) */}
              <div className="pt-1 space-y-2">
                <a
                  href="tel:112"
                  className="w-full relative group p-4 rounded-2xl btn-vermilion flex items-center justify-between text-white active:scale-95 transition-all block shadow-lg"
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
                <p className="text-[10px] text-[#173E35]/85 leading-tight px-1 font-mono font-medium">
                  * Calls place directly through your device's cellular dialer to 112. PulseCare+ does not automatically dispatch vehicles.
                </p>
              </div>

              {/* 4 Quick Action Cards (Find Hospitals, First Aid, Pharmacies, Medical ID) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 pt-1">
                <button
                  onClick={() => setActiveNav('Find Help')}
                  className="bg-white p-3 rounded-2xl flex flex-col items-center text-center space-y-2 border border-[#C4A66B]/30 hover:border-[#173E35] hover:scale-105 transition-all shadow-xs group"
                >
                  <div className="p-2 rounded-xl bg-[#F1F0E9] text-[#173E35] border border-[#C4A66B]/30 group-hover:bg-[#173E35] group-hover:text-[#F1F0E9] transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#173E35]">Find Hospitals</span>
                </button>

                <button
                  onClick={() => setActiveNav('First Aid')}
                  className="bg-white p-3 rounded-2xl flex flex-col items-center text-center space-y-2 border border-[#C4A66B]/30 hover:border-[#173E35] hover:scale-105 transition-all shadow-xs group"
                >
                  <div className="p-2 rounded-xl bg-[#F1F0E9] text-[#173E35] border border-[#C4A66B]/30 group-hover:bg-[#173E35] group-hover:text-[#F1F0E9] transition-colors">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#173E35]">First Aid Guide</span>
                </button>

                <button
                  onClick={() => setIsPharmaciesOpen(true)}
                  className="bg-white p-3 rounded-2xl flex flex-col items-center text-center space-y-2 border border-[#C4A66B]/30 hover:border-[#173E35] hover:scale-105 transition-all shadow-xs group"
                >
                  <div className="p-2 rounded-xl bg-[#F1F0E9] text-[#173E35] border border-[#C4A66B]/30 group-hover:bg-[#173E35] group-hover:text-[#F1F0E9] transition-colors">
                    <Pill className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#173E35]">24/7 Pharmacies</span>
                </button>

                <button
                  onClick={() => setIsMedicalIdOpen(true)}
                  className="bg-white p-3 rounded-2xl flex flex-col items-center text-center space-y-2 border border-[#C4A66B]/30 hover:border-[#173E35] hover:scale-105 transition-all shadow-xs group"
                >
                  <div className="p-2 rounded-xl bg-[#F1F0E9] text-[#173E35] border border-[#C4A66B]/30 group-hover:bg-[#173E35] group-hover:text-[#F1F0E9] transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-[#173E35]">Medical ID Pass</span>
                </button>
              </div>
            </div>

            {/* HERO RIGHT COLUMN: INTERACTIVE 3D MEDICAL CITY HERO - 8 Cols */}
            <div className="lg:col-span-8 space-y-4">
              <Suspense
                fallback={
                  <div className="w-full h-[400px] sm:h-[460px] rounded-3xl bg-white flex flex-col items-center justify-center space-y-3 text-[#173E35] font-mono text-xs border border-[#C4A66B]/30">
                    <div className="w-8 h-8 rounded-full border-2 border-[#173E35] border-t-transparent animate-spin" />
                    <span>INITIALIZING 3D SPATIAL MEDICAL CITY...</span>
                  </div>
                }
              >
                <SpatialMedicalCity
                  selectedHospital={selectedHospital}
                  onSelectHospital={(h) => setSelectedHospital(h)}
                  sosActive={sosActive}
                  hospitals={activeHospitals}
                  currentLocation={currentLocation}
                />
              </Suspense>
            </div>
          </section>

          {/* SECONDARY PANELS ROW (Educational Anatomy & AI Health Hologram + Nearby Facilities) */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Panel 1: Educational Anatomy (5 Cols) */}
            <div className="lg:col-span-5">
              <EducationalAnatomyPanel />
            </div>

            {/* Panel 2: AI Health Hologram (3 Cols) */}
            <div className="lg:col-span-3">
              <AIHealthHologram onOpenAssistant={() => setIsAiModalOpen(true)} />
            </div>

            {/* Panel 3: Nearby Facilities Live Feed (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-3xl bg-[#FAF8F5] border border-[#C4A66B]/30 p-5 shadow-xl space-y-4">
                
                {/* Header */}
                <div className="flex items-center space-x-3 pb-3 border-b border-[#C4A66B]/20">
                  <div className="p-2.5 rounded-2xl bg-[#173E35] text-[#C4A66B] border border-[#C4A66B]/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#173E35]">Nearby Facilities</h3>
                    <p className="text-[10px] text-[#173E35]/70 font-mono">
                      Calculated from {currentLocation.source === 'gps' ? 'GPS' : 'Active Region'}
                    </p>
                  </div>
                </div>

                {/* Filterable / Selectable Hospital Cards with Real Dynamic Distances */}
                <div className="space-y-2.5" role="list">
                  {activeHospitals.slice(0, 4).map((hosp) => {
                    const isSelected = selectedHospital?.id === hosp.id;
                    return (
                      <div
                        key={hosp.id}
                        onClick={() => setSelectedHospital(hosp)}
                        className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between transition-all border ${
                          isSelected
                            ? 'bg-[#173E35] border-[#C4A66B] ring-1 ring-[#C4A66B]/40 shadow-md text-[#F1F0E9]'
                            : 'bg-white border-[#C4A66B]/20 hover:border-[#173E35] text-[#173E35]'
                        }`}
                        role="listitem"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedHospital(hosp)}
                      >
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-[#F1F0E9]' : 'text-[#7A5E2E]'}`}>
                              {hosp.category === 'Trauma Center Level 1' ? 'Trauma L1' : hosp.category}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#BA3B2E] animate-pulse" />
                            )}
                          </div>
                          <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-[#F1F0E9]' : 'text-[#173E35]'}`}>{hosp.name}</h4>
                          <p className={`text-[10px] font-mono ${isSelected ? 'text-[#F1F0E9]/90' : 'text-[#173E35]/85'}`}>
                            {hosp.icuBedsAvailable} ICU beds • {hosp.erWaitTime}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-xs font-mono font-bold block ${isSelected ? 'text-[#F1F0E9]' : 'text-[#B82819]'}`}>
                            {hosp.driveTime}
                          </span>
                          <span className={`text-[10px] font-mono ${isSelected ? 'text-[#F1F0E9]/90' : 'text-[#173E35]/85'}`}>
                            {hosp.distance}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Honest Telemetry Note */}
                <div className="p-3 rounded-2xl bg-white border border-[#C4A66B]/20 text-[10px] text-[#173E35]/75 font-mono text-center">
                  * Dynamic distances computed via browser Haversine geodesics
                </div>
              </div>
            </div>
          </section>

          {/* LOWER SECTION: 4 ESSENTIAL CLINICAL MODULES (Truthful, non-fabricated) */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#173E35] font-bold">
                Clinical Modules & Community Safety Network
              </h3>
              <span className="text-[11px] text-[#173E35]/70 font-mono hidden sm:inline">
                Dual-Tier Zero-Knowledge Passports & Offline Responders
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* CARD 1: Emergency Health Profile & Care Directives */}
              <div
                onClick={() => setIsHealthProfileOpen(true)}
                className="bg-white p-5 rounded-3xl border border-[#C4A66B]/30 hover:border-[#173E35] hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsHealthProfileOpen(true)}
              >
                <div>
                  <HolographicHeart />
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#173E35]">Health Profile</h4>
                    <p className="text-xs text-[#173E35]/75 mt-0.5">Critical allergies, blood type & directives</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#C4A66B]/20 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#173E35] font-bold">IndexedDB Encrypted</span>
                  <div className="w-7 h-7 rounded-full bg-[#173E35] text-[#F1F0E9] flex items-center justify-center group-hover:translate-x-1 transition-transform border border-[#C4A66B]/30">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* CARD 2: AI Health Information Assistant */}
              <div
                onClick={() => setIsAiModalOpen(true)}
                className="bg-white p-5 rounded-3xl border border-[#C4A66B]/30 hover:border-[#173E35] hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsAiModalOpen(true)}
              >
                <div>
                  <HolographicBrain />
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#173E35]">Symptom Guidance</h4>
                    <p className="text-xs text-[#173E35]/75 mt-0.5">Evidence-based triage support</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#C4A66B]/20 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#173E35] font-bold">WHO Protocols</span>
                  <div className="w-7 h-7 rounded-full bg-[#173E35] text-[#F1F0E9] flex items-center justify-center group-hover:translate-x-1 transition-transform border border-[#C4A66B]/30">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* CARD 3: Emergency Preparation (Go-Bag & Drills) */}
              <div
                onClick={() => setIsPrepOpen(true)}
                className="bg-white p-5 rounded-3xl border border-[#C4A66B]/30 hover:border-[#173E35] hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsPrepOpen(true)}
              >
                <div>
                  <HolographicShield />
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#173E35]">Crisis Preparation</h4>
                    <p className="text-xs text-[#173E35]/75 mt-0.5">72-hour survival checklist & plan</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#C4A66B]/20 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#173E35] font-bold">72h Checklist</span>
                  <div className="w-7 h-7 rounded-full bg-[#173E35] text-[#F1F0E9] flex items-center justify-center group-hover:translate-x-1 transition-transform border border-[#C4A66B]/30">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* CARD 4: Community Help (AED Beacons) */}
              <div
                onClick={() => setActiveNav('Community')}
                className="bg-white p-5 rounded-3xl border border-[#C4A66B]/30 hover:border-[#173E35] hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveNav('Community')}
              >
                <div>
                  <HolographicCommunity />
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#173E35]">Community Help</h4>
                    <p className="text-xs text-[#173E35]/75 mt-0.5">Public AED beacons & volunteer circle</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#C4A66B]/20 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#173E35] font-bold">AED Network</span>
                  <div className="w-7 h-7 rounded-full bg-[#173E35] text-[#F1F0E9] flex items-center justify-center group-hover:translate-x-1 transition-transform border border-[#C4A66B]/30">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Expanded Navigation Sections */}
          {activeNav !== 'Home' && (
            <div className="pt-6">
              <div className="p-4 rounded-2xl bg-white border-2 border-[#173E35] flex items-center justify-between shadow-md mb-2">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-[#7A5E2E] uppercase">
                    Active View:
                  </span>
                  <span className="text-sm font-black text-[#173E35]">
                    {activeNav}
                  </span>
                </div>
                <button
                  onClick={() => setActiveNav('Home')}
                  className="px-4 py-2 rounded-xl bg-[#173E35] hover:bg-[#CC3B2D] text-[#F1F0E9] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Close Tab & Return Home</span>
                </button>
              </div>
            </div>
          )}

          <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-[#173E35]">Loading module...</div>}>
            {activeNav === 'Find Help' && (
              <div className="pt-2">
                <HospitalLocator
                  selectedHospital={selectedHospital}
                  onSelectHospital={(h) => setSelectedHospital(h)}
                  onClose={() => setActiveNav('Home')}
                  hospitals={activeHospitals}
                  currentLocationName={currentLocation.locationName}
                />
              </div>
            )}

            {activeNav === 'First Aid' && (
              <div className="pt-2">
                <FirstAidLibrary onClose={() => setActiveNav('Home')} />
              </div>
            )}

            {activeNav === 'Community' && (
              <div className="pt-2">
                <CommunityAndContacts onClose={() => setActiveNav('Home')} />
              </div>
            )}
          </Suspense>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-[#C4A66B]/25 bg-[#FAF8F5] py-6 px-8 text-xs text-[#173E35]/85 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-bold text-[#173E35]">PulseCare+ Emergency Health Platform</p>
            <p className="font-mono text-[11px] text-[#173E35]/85 font-medium">
              Future Clinic Architecture • Zero-Knowledge Private Vault • W3C Web Crypto Standards
            </p>
          </div>
          <div className="flex items-center space-x-3 font-mono text-[11px] text-[#173E35] font-semibold">
            <button onClick={() => setIsMedicalIdOpen(true)} className="hover:text-[#CC3B2D] hover:underline transition-colors">
              Medical ID
            </button>
            <span>•</span>
            <button onClick={() => setIsHealthProfileOpen(true)} className="hover:text-[#CC3B2D] hover:underline transition-colors">
              Directives
            </button>
            <span>•</span>
            <button onClick={() => setIsAiModalOpen(true)} className="hover:text-[#CC3B2D] hover:underline transition-colors">
              AI Triage
            </button>
          </div>
        </footer>
      </div>

      {/* 3. MODALS (All Encrypted & Truthful) */}
      <Suspense fallback={null}>
        {/* Emergency SOS Modal */}
        <EmergencySOSModal
          isOpen={isSosModalOpen}
          onClose={() => setIsSosModalOpen(false)}
          sosActive={sosActive}
          setSosActive={setSosActive}
          onOpenMedicalId={() => setIsMedicalIdOpen(true)}
        />

        {/* Emergency Medical ID Card & Vault Modal */}
        <MedicalIDCard
          isOpen={isMedicalIdOpen}
          onClose={() => setIsMedicalIdOpen(false)}
          accountId={activeAccount}
        />

        {/* Health Profile & Care Directives Modal */}
        <HealthProfileModal
          isOpen={isHealthProfileOpen}
          onClose={() => setIsHealthProfileOpen(false)}
          accountId={activeAccount}
          onProfileUpdated={(updated: UserProfile) => setUserProfile(updated)}
        />

        {/* AI Health Assistant Modal */}
        <AIAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onTriggerSOS={() => {
            setIsSosModalOpen(true);
            setSosActive(true);
          }}
        />

        {/* 24/7 Pharmacies Modal */}
        <PharmaciesModal
          isOpen={isPharmaciesOpen}
          onClose={() => setIsPharmaciesOpen(false)}
        />

        {/* Emergency Preparedness Modal */}
        <EmergencyPrepModal
          isOpen={isPrepOpen}
          onClose={() => setIsPrepOpen(false)}
          onOpenMedicalId={() => setIsMedicalIdOpen(true)}
        />

        {/* Live Services Tracker Modal */}
        <LiveServicesTrackerModal
          isOpen={liveTrackerService !== null}
          onClose={() => setLiveTrackerService(null)}
          serviceType={liveTrackerService || ''}
        />

        {/* Location Permission & Region Selection Modal */}
        <LocationPermissionModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          permissionState={locationPermission}
          currentLocation={currentLocation}
          onLocationUpdated={(loc: LocationTelemetry) => {
            setCurrentLocation(loc);
            setLocationPermission('granted');
          }}
        />

        {/* Notification Preferences Modal */}
        <NotificationSettingsModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
        />
      </Suspense>
    </div>
  );
}
export default App;
