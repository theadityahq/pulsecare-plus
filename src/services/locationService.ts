/**
 * PulseCare+ Trustworthy Location Telemetry Service
 * Respects user privacy, permission boundaries, and provides robust multi-region hospital directories.
 * Strict provenance: Zero simulated hospitals, straight-line distance explicit labelling.
 */

import { Hospital } from '../types';
import { VERIFIED_REGIONAL_HOSPITALS } from '../data/hospitals';

export type LocationPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface LocationTelemetry {
  lat: number;
  lng: number;
  accuracyMeters: number | null;
  lastUpdated: string | null;
  source: 'gps' | 'manual' | 'default';
  locationName: string;
  isStale: boolean;
  regionId?: string;
}

export const PRESET_REGIONS = [
  { id: 'delhi', name: 'Delhi NCR (Central)', lat: 28.5672, lng: 77.2100 },
  { id: 'mumbai', name: 'Mumbai (South / Coastal)', lat: 18.9894, lng: 72.8286 },
  { id: 'bengaluru', name: 'Bengaluru (Tech Corridor)', lat: 12.9716, lng: 77.5946 },
  { id: 'kolkata', name: 'Kolkata (Metro Hub)', lat: 22.5726, lng: 88.3639 },
  { id: 'london', name: 'London (UK NHS Triage)', lat: 51.4988, lng: -0.1186 },
  { id: 'geneva', name: 'Geneva (WHO Health Cluster)', lat: 46.2044, lng: 6.1432 }
];

export const DEFAULT_FALLBACK_LOCATION: LocationTelemetry = {
  lat: 28.5672,
  lng: 77.2100,
  accuracyMeters: null,
  lastUpdated: null,
  source: 'default',
  locationName: 'Delhi Capital Region (Preset Directory)',
  isStale: false,
  regionId: 'delhi'
};

// Haversine formula to compute distance in km between two lat/long points
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

// Estimate drive time based on typical urban emergency speed (30 km/h)
export function estimateDriveTime(km: number): string {
  const minutes = Math.max(2, Math.round((km / 30) * 60));
  return `${minutes} mins`;
}

// ==========================================
// CALCULATE DYNAMIC HOSPITAL DISTANCES
// ==========================================
export function calculateDynamicHospitalDistances(userLat: number, userLng: number, hospitals: Hospital[]): Hospital[] {
  return hospitals.map((hosp) => {
    const distKm = calculateDistanceKm(userLat, userLng, hosp.latLong.lat, hosp.latLong.lng);
    return {
      ...hosp,
      distanceKm: distKm,
      distance: `≈ ${formatDistance(distKm)} (straight-line)`,
      driveTime: `est. ${estimateDriveTime(distKm)} at 30 km/h (not routed)`
    };
  }).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

// ==========================================
// DETECT REGION & FETCH HOSPITALS
// ==========================================
export function getHospitalsForLocation(
  lat: number,
  lng: number,
  _locationName?: string
): { regionId: string; hospitals: Hospital[]; message?: string } {
  // Proximity check to known presets (< 75 km)
  let closestPreset: typeof PRESET_REGIONS[0] | null = null;
  let minDistance = Infinity;

  for (const preset of PRESET_REGIONS) {
    const dist = calculateDistanceKm(lat, lng, preset.lat, preset.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestPreset = preset;
    }
  }

  if (closestPreset && minDistance < 75 && VERIFIED_REGIONAL_HOSPITALS[closestPreset.id]) {
    return {
      regionId: closestPreset.id,
      hospitals: calculateDynamicHospitalDistances(lat, lng, VERIFIED_REGIONAL_HOSPITALS[closestPreset.id])
    };
  }

  // Outside preset regions: return empty list with clear truthful messaging (never invent hospitals)
  return {
    regionId: 'unverified',
    hospitals: [],
    message: 'No verified hospital directory for this area yet. Only verified public registries are displayed.'
  };
}

// ==========================================
// REVERSE GEOCODING
// ==========================================
export async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<string> {
  // Check fast proximity to known presets (< 50 km) first
  for (const preset of PRESET_REGIONS) {
    if (calculateDistanceKm(lat, lng, preset.lat, preset.lng) < 50) {
      return preset.name;
    }
  }

  return `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

// ==========================================
// CITY SEARCH / GEOCODING (Open-Meteo)
// ==========================================
export interface SearchCityResult {
  name: string;
  lat: number;
  lng: number;
  country?: string;
  admin1?: string;
}

export async function searchCities(query: string): Promise<SearchCityResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  // Check matching presets first
  const presetMatches = PRESET_REGIONS.filter(p => p.name.toLowerCase().includes(trimmed.toLowerCase()))
    .map(p => ({
      name: p.name,
      lat: p.lat,
      lng: p.lng
    }));

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        const remoteResults = data.results.map((r: any) => ({
          name: `${r.name}${r.admin1 ? `, ${r.admin1}` : ''}${r.country ? `, ${r.country}` : ''}`,
          lat: r.latitude,
          lng: r.longitude,
          country: r.country,
          admin1: r.admin1
        }));
        
        // Deduplicate with preset matches
        const combined = [...presetMatches];
        for (const r of remoteResults) {
          if (!combined.some(c => Math.abs(c.lat - r.lat) < 0.1 && Math.abs(c.lng - r.lng) < 0.1)) {
            combined.push(r);
          }
        }
        return combined.slice(0, 6);
      }
    }
  } catch {
    // ignore
  }

  return presetMatches;
}

// Query browser permission status safely
export async function queryLocationPermission(): Promise<LocationPermissionState> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return 'unsupported';
  }

  if (navigator.permissions && navigator.permissions.query) {
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      return status.state as LocationPermissionState;
    } catch {
      return 'prompt';
    }
  }

  return 'prompt';
}

// Request actual Geolocation from browser
export function requestBrowserCoordinates(
  onSuccess: (telemetry: LocationTelemetry) => void,
  onError: (errorMsg: string, code?: number) => void
): void {
  if (!navigator.geolocation) {
    onError('Geolocation is not supported by your browser.', 0);
    return;
  }

  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  };

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      const resolvedName = await reverseGeocodeCoordinates(latitude, longitude);
      const { regionId } = getHospitalsForLocation(latitude, longitude, resolvedName);

      const telemetry: LocationTelemetry = {
        lat: latitude,
        lng: longitude,
        accuracyMeters: Math.round(accuracy),
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'gps',
        locationName: resolvedName.startsWith('GPS (') ? resolvedName : `GPS: ${resolvedName}`,
        isStale: false,
        regionId
      };
      onSuccess(telemetry);
    },
    (err) => {
      let message = 'Unable to acquire location.';
      if (err.code === err.PERMISSION_DENIED) {
        message = 'Location access was denied in browser permissions. Please choose a manual region or search your city.';
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        message = 'Location information is currently unavailable.';
      } else if (err.code === err.TIMEOUT) {
        message = 'Location request timed out. Please try again or search your city.';
      }
      onError(message, err.code);
    },
    options
  );
}
