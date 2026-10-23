/**
 * PulseCare+ Trustworthy Location Telemetry Service
 * Respects user privacy, permission boundaries, and provides robust manual fallbacks.
 */

export type LocationPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface LocationTelemetry {
  lat: number;
  lng: number;
  accuracyMeters: number | null;
  lastUpdated: string | null;
  source: 'gps' | 'manual' | 'default';
  locationName: string;
  isStale: boolean;
}

export const PRESET_REGIONS = [
  { name: 'Delhi NCR (Central)', lat: 28.5672, lng: 77.2100 },
  { name: 'Mumbai (South / Coastal)', lat: 18.9894, lng: 72.8286 },
  { name: 'Bengaluru (Tech Corridor)', lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata (Metro Hub)', lat: 22.5726, lng: 88.3639 },
  { name: 'London (UK NHS Triage)', lat: 51.4988, lng: -0.1186 },
  { name: 'Geneva (WHO Health Cluster)', lat: 46.2044, lng: 6.1432 }
];

export const DEFAULT_FALLBACK_LOCATION: LocationTelemetry = {
  lat: 28.5672,
  lng: 77.2100,
  accuracyMeters: null,
  lastUpdated: null,
  source: 'default',
  locationName: 'Delhi Capital Region (Default Fallback)',
  isStale: false
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
      // Some browsers (like Safari) throw on query for geolocation
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
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const telemetry: LocationTelemetry = {
        lat: latitude,
        lng: longitude,
        accuracyMeters: Math.round(accuracy),
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'gps',
        locationName: `GPS Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        isStale: false
      };
      onSuccess(telemetry);
    },
    (err) => {
      let message = 'Unable to acquire location.';
      if (err.code === err.PERMISSION_DENIED) {
        message = 'Location access was denied in browser permissions.';
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        message = 'Location information is currently unavailable.';
      } else if (err.code === err.TIMEOUT) {
        message = 'Location request timed out. Please try again or use manual region.';
      }
      onError(message, err.code);
    },
    options
  );
}
