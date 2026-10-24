import React, { useState } from 'react';
import {
  MapPin,
  Shield,
  Compass,
  CheckCircle2,
  AlertCircle,
  X,
  Navigation,
  Search,
  Loader2
} from 'lucide-react';
import {
  LocationTelemetry,
  LocationPermissionState,
  PRESET_REGIONS,
  requestBrowserCoordinates,
  searchCities,
  SearchCityResult,
  getHospitalsForLocation
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchCityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSelectPreset = (region: { id?: string; name: string; lat: number; lng: number }) => {
    const { regionId } = getHospitalsForLocation(region.lat, region.lng, region.name);
    const telemetry: LocationTelemetry = {
      lat: region.lat,
      lng: region.lng,
      accuracyMeters: null,
      lastUpdated: new Date().toLocaleTimeString(),
      source: 'manual',
      locationName: region.name,
      isStale: false,
      regionId
    };
    onLocationUpdated(telemetry);
    onClose();
  };

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setErrorMessage(null);
    try {
      const results = await searchCities(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setErrorMessage(`No matching cities found for "${searchQuery}". Try selecting from presets below.`);
      }
    } catch {
      setErrorMessage('Unable to search cities right now. Please select from presets.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: SearchCityResult) => {
    const { regionId } = getHospitalsForLocation(result.lat, result.lng, result.name);
    const telemetry: LocationTelemetry = {
      lat: result.lat,
      lng: result.lng,
      accuracyMeters: null,
      lastUpdated: new Date().toLocaleTimeString(),
      source: 'manual',
      locationName: result.name,
      isStale: false,
      regionId
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
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border-2 border-[#C4A66B]/40 shadow-2xl overflow-hidden text-[#173E35] max-h-[90vh] flex flex-col">
        
        {/* Header with High-Contrast Deep Green Text and Dedicated Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C4A66B]/25 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#F1F0E9] shadow-xs">
              <Compass className="w-5 h-5 text-[#C4A66B]" />
            </div>
            <div>
              <h3 id="location-dialog-title" className="text-base sm:text-lg font-black text-[#173E35] tracking-tight">
                Location & Dispatch Radar
              </h3>
              <p className="text-xs text-[#7A5E2E] font-mono font-semibold">
                Status: {currentLocation.source === 'gps' ? 'GPS Active' : 'Manual Region Selected'}
              </p>
            </div>
          </div>

          {/* Prominent Dedicated Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#B82819] transition-all border border-[#C4A66B]/40 shadow-md flex items-center justify-center group"
            aria-label="Close location dialog"
            title="Close dialog"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 py-3 flex-1 pr-1">
          {/* Active Location Banner */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/35 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <MapPin className="w-4 h-4 text-[#B82819] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase font-black text-[#7A5E2E] block">
                  Active Dispatch Hub
                </span>
                <span className="text-xs font-bold text-[#173E35] truncate block">
                  {currentLocation.locationName}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#173E35] text-[#F1F0E9] font-bold shrink-0">
              {currentLocation.source === 'gps' ? 'GPS' : 'Manual'}
            </span>
          </div>

          {/* Error message if denied/failed */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-[#B82819]/40 text-xs text-[#B82819] flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action 1: GPS Auto-Detect Button */}
          <button
            onClick={handleRequestGps}
            disabled={isAcquiring}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#173E35] hover:bg-[#0E2721] text-[#F1F0E9] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
          >
            {isAcquiring ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#C4A66B]" />
            ) : (
              <Navigation className="w-4 h-4 text-[#C4A66B]" />
            )}
            <span>
              {isAcquiring
                ? 'Acquiring GPS & Resolving City...'
                : 'Use My Exact Browser GPS Location'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="w-full border-t border-[#C4A66B]/25" />
            <span className="absolute bg-white px-3 py-0.5 rounded-full border border-[#C4A66B]/30 text-[10px] font-mono text-[#7A5E2E] font-bold uppercase tracking-wider">
              Or Enter Place / City
            </span>
          </div>

          {/* Custom Place / City Search Input */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-[#173E35]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city or area (e.g. Mumbai, Bengaluru, London, Pune, Chicago)..."
                className="w-full bg-[#FAF8F5] border-2 border-[#C4A66B]/35 rounded-2xl pl-10 pr-24 py-2.5 text-xs text-[#173E35] placeholder-[#173E35]/50 focus:outline-none focus:border-[#173E35] focus:bg-white transition-all shadow-xs"
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-1.5 px-3 py-1.5 rounded-xl bg-[#173E35] hover:bg-[#0E2721] text-[#F1F0E9] text-xs font-bold font-mono transition-all disabled:opacity-40"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Search Results Dropdown List */}
            {searchResults.length > 0 && (
              <div className="space-y-1.5 p-2 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 max-h-40 overflow-y-auto">
                <span className="text-[10px] font-mono uppercase text-[#7A5E2E] font-bold px-2 block">
                  Found Locations:
                </span>
                {searchResults.map((res, i) => (
                  <button
                    key={`${res.name}-${i}`}
                    type="button"
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full p-2.5 rounded-xl text-left hover:bg-white border border-transparent hover:border-[#173E35] transition-all flex items-center justify-between text-xs text-[#173E35]"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#B82819] shrink-0" />
                      <span className="font-bold truncate">{res.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#7A5E2E] shrink-0 font-medium">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Preset Regions Grid */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono uppercase text-[#7A5E2E] font-bold block">
              Quick Select Preset Regions:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_REGIONS.map((region) => {
                const isCurrent =
                  currentLocation.locationName.toLowerCase().includes(region.id) ||
                  currentLocation.locationName.toLowerCase().includes(region.name.split(' ')[0].toLowerCase());
                return (
                  <button
                    key={region.id}
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

          {/* Privacy Notice Banner */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-1 text-xs text-[#173E35]">
            <div className="flex items-center space-x-2 text-[#173E35] font-bold">
              <Shield className="w-3.5 h-3.5 shrink-0 text-[#7A5E2E]" />
              <span className="text-[11px]">Local-First Privacy Architecture</span>
            </div>
            <p className="text-[10px] leading-relaxed text-[#173E35]/80">
              Coordinates orient the 3D diorama and calculate emergency hospital drive times locally. No location data is sent to advertising networks or third-party trackers.
            </p>
          </div>
        </div>

        {/* Footer info & Dedicated Bottom Dismiss Button */}
        <div className="pt-3 border-t border-[#C4A66B]/20 flex items-center justify-between shrink-0">
          <div className="text-[11px] font-mono text-[#173E35]/85 truncate max-w-[260px]">
            <span className="font-bold">Active:</span> {currentLocation.locationName}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#B82819] text-xs font-mono font-bold transition-all shadow-xs"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
