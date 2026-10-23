import React, { useState } from 'react';
import {
  MapPin,
  Shield,
  Compass,
  CheckCircle2,
  AlertCircle,
  X,
  Navigation,
  Globe
} from 'lucide-react';
import {
  LocationTelemetry,
  LocationPermissionState,
  PRESET_REGIONS,
  requestBrowserCoordinates
} from '../services/locationService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  permissionState: LocationPermissionState;
  currentLocation: LocationTelemetry;
  onLocationUpdated: (telemetry: LocationTelemetry) => void;
}

export const LocationPermissionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  permissionState,
  currentLocation,
  onLocationUpdated
}) => {
  const [isAcquiring, setIsAcquiring] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customSearch, setCustomSearch] = useState('');

  if (!isOpen) return null;

  const handleRequestGps = () => {
    setIsAcquiring(true);
    setErrorMessage(null);

    requestBrowserCoordinates(
      (telemetry) => {
        setIsAcquiring(false);
        onLocationUpdated(telemetry);
        onClose();
      },
      (error) => {
        setIsAcquiring(false);
        setErrorMessage(error);
      }
    );
  };

  const handleSelectPreset = (region: { name: string; lat: number; lng: number }) => {
    const telemetry: LocationTelemetry = {
      lat: region.lat,
      lng: region.lng,
      accuracyMeters: null,
      lastUpdated: new Date().toLocaleTimeString(),
      source: 'manual',
      locationName: region.name,
      isStale: false
    };
    onLocationUpdated(telemetry);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2720]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-dialog-title"
    >
      <div className="relative w-full max-w-lg clinic-panel-elevated rounded-3xl p-6 md:p-8 border border-[#C7AE7B]/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4F0E6]/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#163C32] border border-[#C7AE7B]/40 flex items-center justify-center text-[#C7AE7B]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 id="location-dialog-title" className="text-base font-bold text-[#F4F0E6]">
                Location & Emergency Dispatch Radar
              </h3>
              <p className="text-xs text-[#C7AE7B] font-mono">
                Status: {currentLocation.source === 'gps' ? 'GPS Active' : 'Manual / Fallback'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#F4F0E6]/60 hover:text-[#F4F0E6] hover:bg-[#163C32] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Notice Banner */}
        <div className="my-4 p-4 rounded-2xl bg-[#163C32]/70 border border-[#C7AE7B]/25 space-y-2 text-xs text-[#F4F0E6]/90">
          <div className="flex items-center space-x-2 text-[#C7AE7B] font-bold">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Honest Privacy Architecture</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#F4F0E6]/80">
            Coordinates are used strictly to calculate exact drive-times to trauma facilities and orient the 3D globe. Your location is processed locally in your browser and is never uploaded to analytics or ad trackers.
          </p>
        </div>

        {/* Error message if denied/failed */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#0E2720] border border-[#D94736]/60 text-xs text-[#FF8A7A] flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FF8A7A]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action 1: Request GPS */}
        <div className="space-y-4">
          <button
            onClick={handleRequestGps}
            disabled={isAcquiring}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#F4F0E6] hover:bg-white text-[#1D2521] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${isAcquiring ? 'animate-spin' : ''}`} />
            <span>{isAcquiring ? 'Acquiring GPS Telemetry...' : 'Use My Exact Browser GPS Location'}</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-[#F4F0E6]/10" />
            <span className="absolute bg-[#163C32] px-3 text-[10px] font-mono text-[#C7AE7B] uppercase tracking-wider">
              Or Choose Manual Region
            </span>
          </div>

          {/* Preset Regions Grid */}
          <div className="grid grid-cols-2 gap-2">
            {PRESET_REGIONS.map((region) => {
              const isCurrent = currentLocation.locationName.includes(region.name.split(' ')[0]);
              return (
                <button
                  key={region.name}
                  onClick={() => handleSelectPreset(region)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-[#163C32] border-[#C7AE7B] text-[#F4F0E6] ring-1 ring-[#C7AE7B]'
                      : 'bg-[#0E2720]/70 border-[#F4F0E6]/10 text-[#F4F0E6]/80 hover:border-[#C7AE7B]/50'
                  }`}
                >
                  <span className="truncate">{region.name}</span>
                  {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#C7AE7B] shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-3 border-t border-[#F4F0E6]/10 flex items-center justify-between text-[10px] font-mono text-[#C7AE7B]">
          <span>Current: {currentLocation.locationName}</span>
          {currentLocation.accuracyMeters && (
            <span>Accuracy: ±{currentLocation.accuracyMeters}m</span>
          )}
        </div>
      </div>
    </div>
  );
};
