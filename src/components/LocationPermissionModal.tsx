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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173E35]/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-dialog-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border-2 border-[#C4A66B]/40 shadow-2xl overflow-hidden text-[#173E35]">
        
        {/* Header with High-Contrast Deep Green Text and Dedicated Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C4A66B]/25">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#F1F0E9] shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 id="location-dialog-title" className="text-base sm:text-lg font-black text-[#173E35] tracking-tight">
                Location & Dispatch Radar
              </h3>
              <p className="text-xs text-[#7A5E2E] font-mono font-semibold">
                Status: {currentLocation.source === 'gps' ? 'GPS Active' : 'Manual Fallback'}
              </p>
            </div>
          </div>

          {/* Prominent Dedicated Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] transition-all border border-[#C4A66B]/40 shadow-md flex items-center justify-center group"
            aria-label="Close location dialog"
            title="Close dialog"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Privacy Notice Banner in Clean Warm Beige Container */}
        <div className="my-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-1.5 text-xs text-[#173E35]">
          <div className="flex items-center space-x-2 text-[#173E35] font-bold">
            <Shield className="w-4 h-4 shrink-0 text-[#7A5E2E]" />
            <span>Honest Privacy Architecture</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#173E35]/80">
            Coordinates are used strictly to calculate exact drive-times to trauma facilities and orient the 3D city. Your location is processed locally in your browser and is never uploaded to analytics or ad trackers.
          </p>
        </div>

        {/* Error message if denied/failed */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-[#CC3B2D]/40 text-xs text-[#CC3B2D] flex items-center space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action 1: Request GPS */}
        <div className="space-y-4">
          <button
            onClick={handleRequestGps}
            disabled={isAcquiring}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#173E35] hover:bg-[#0E2721] text-[#F1F0E9] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${isAcquiring ? 'animate-spin' : ''}`} />
            <span>{isAcquiring ? 'Acquiring GPS Telemetry...' : 'Use My Exact Browser GPS Location'}</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="w-full border-t border-[#C4A66B]/25" />
            <span className="absolute bg-white px-3 py-0.5 rounded-full border border-[#C4A66B]/30 text-[10px] font-mono text-[#7A5E2E] font-bold uppercase tracking-wider">
              Or Choose Manual Region
            </span>
          </div>

          {/* Preset Regions Grid with High-Contrast Text */}
          <div className="grid grid-cols-2 gap-2.5">
            {PRESET_REGIONS.map((region) => {
              const isCurrent = currentLocation.locationName.includes(region.name.split(' ')[0]);
              return (
                <button
                  key={region.name}
                  onClick={() => handleSelectPreset(region)}
                  className={`p-3 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-[#173E35] border-[#C4A66B] text-[#F1F0E9] font-bold shadow-md ring-2 ring-[#C4A66B]/40'
                      : 'bg-[#FAF8F5] border-[#C4A66B]/30 text-[#173E35] hover:border-[#173E35] hover:bg-white font-semibold'
                  }`}
                >
                  <span className="truncate">{region.name}</span>
                  {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#C4A66B] shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info & Dedicated Bottom Dismiss Button */}
        <div className="mt-6 pt-4 border-t border-[#C4A66B]/20 flex items-center justify-between">
          <div className="text-[11px] font-mono text-[#173E35]/80">
            <span className="font-bold">Active:</span> {currentLocation.locationName}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] text-xs font-mono font-bold transition-all shadow-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
