import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hospital } from '../types';
import { LocationTelemetry } from '../services/locationService';
import {
  MapPin,
  Phone,
  RotateCcw,
  Navigation,
  Layers,
  Compass,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface Props {
  currentLocation: LocationTelemetry;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  onSelectHospital: (hosp: Hospital) => void;
}

type TileLayerMode = 'hybrid' | 'satellite' | 'street';

export const SatelliteMapView: React.FC<Props> = ({
  currentLocation,
  hospitals,
  selectedHospital,
  onSelectHospital
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [layerMode, setLayerMode] = useState<TileLayerMode>('hybrid');

  const getTileUrl = (mode: TileLayerMode) => {
    switch (mode) {
      case 'satellite':
        return 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
      case 'street':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'hybrid':
      default:
        // Google Satellite Hybrid (Satellite imagery + highways + roads + building labels)
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const lat = currentLocation.lat || 28.5672;
    const lng = currentLocation.lng || 77.2100;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // Add Tile Layer
    const tileLayer = L.tileLayer(getTileUrl(layerMode), {
      maxZoom: 20,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Custom User Location Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative; width: 22px; height: 22px;">
          <div style="position: absolute; inset: -8px; background: rgba(59, 130, 246, 0.35); border-radius: 9999px; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 22px; height: 22px; background: #2563EB; border: 3px solid #FFFFFF; border-radius: 9999px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);"></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    L.marker([lat, lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(`<strong>Your Location</strong><br>${currentLocation.locationName}`);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer Mode
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(getTileUrl(layerMode));
  }, [layerMode]);

  // Update Hospital Markers and Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    hospitals.forEach((hosp) => {
      const isSelected = selectedHospital?.id === hosp.id;
      const isTrauma = hosp.category === 'Trauma Center Level 1';

      const markerHtml = `
        <div style="position: relative; cursor: pointer; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center;">
          <div style="
            background: ${isSelected ? '#163C32' : 'white'};
            color: ${isSelected ? '#F4F0E6' : '#163C32'};
            border: 2px solid ${isSelected ? '#C7AE7B' : isTrauma ? '#B82819' : '#163C32'};
            border-radius: 12px;
            padding: 3px 8px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            gap: 5px;
          ">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: ${isTrauma ? '#B82819' : '#22C55E'};"></span>
            <span>${hosp.name.split(' ')[0]}</span>
            <span style="font-size: 9px; opacity: 0.8; font-family: monospace;">(${hosp.category === 'Trauma Center Level 1' ? 'Trauma L1' : 'Verified'})</span>
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid ${isSelected ? '#163C32' : 'white'};
            margin-top: -1px;
          "></div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'hospital-satellite-marker',
        html: markerHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([hosp.latLong.lat, hosp.latLong.lng], { icon })
        .addTo(map)
        .on('click', () => {
          onSelectHospital(hosp);
        });

      markersRef.current[hosp.id] = marker;
    });

    // If a hospital is selected, draw route polyline and center map
    if (selectedHospital) {
      const userCoord: [number, number] = [currentLocation.lat, currentLocation.lng];
      const hospCoord: [number, number] = [selectedHospital.latLong.lat, selectedHospital.latLong.lng];

      // Draw dashed emergency transit line
      const polyline = L.polyline([userCoord, hospCoord], {
        color: '#B82819',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.85
      }).addTo(map);
      routeLineRef.current = polyline;

      map.flyTo(hospCoord, 16, { duration: 1.2 });
    }
  }, [hospitals, selectedHospital, currentLocation]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([currentLocation.lat, currentLocation.lng], 14, { duration: 1 });
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] bg-[#163C32] select-none overflow-hidden">
      
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Layer Switcher (Google Hybrid / Satellite / Street) */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 p-1 rounded-2xl bg-white/95 backdrop-blur-md border border-[#C7AE7B]/40 shadow-xl text-xs font-mono font-bold text-[#163C32]">
        <button
          onClick={() => setLayerMode('hybrid')}
          className={`px-2.5 py-1.5 rounded-xl transition-all ${
            layerMode === 'hybrid'
              ? 'bg-[#163C32] text-[#F4F0E6] shadow-xs'
              : 'hover:bg-[#FAF8F5]'
          }`}
          title="Google Satellite Hybrid (Satellite Imagery + Highway & Street Overlay)"
        >
          Google Hybrid
        </button>
        <button
          onClick={() => setLayerMode('satellite')}
          className={`px-2.5 py-1.5 rounded-xl transition-all ${
            layerMode === 'satellite'
              ? 'bg-[#163C32] text-[#F4F0E6] shadow-xs'
              : 'hover:bg-[#FAF8F5]'
          }`}
          title="Pure Satellite Aerial Imagery"
        >
          Pure Satellite
        </button>
        <button
          onClick={() => setLayerMode('street')}
          className={`px-2.5 py-1.5 rounded-xl transition-all ${
            layerMode === 'street'
              ? 'bg-[#163C32] text-[#F4F0E6] shadow-xs'
              : 'hover:bg-[#FAF8F5]'
          }`}
          title="Standard Street Roadmap"
        >
          Street
        </button>
      </div>

      {/* Zoom & Recenter Controls */}
      <div className="absolute right-4 bottom-4 z-10 flex flex-col space-y-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#C7AE7B]/40 shadow-xl text-[#163C32]">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors font-bold text-base"
          title="Zoom In"
          aria-label="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors font-bold text-base"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          −
        </button>
        <div className="h-[1px] w-full bg-[#C7AE7B]/30 my-0.5" />
        <button
          onClick={handleRecenter}
          className="p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors"
          title="Recenter to Active Location"
          aria-label="Recenter"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Live Map Telemetry Badge */}
      <div className="absolute left-4 bottom-4 z-10 hidden sm:flex items-center space-x-2 p-2 px-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#C7AE7B]/40 text-[11px] font-mono shadow-xl text-[#163C32]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-bold">Satellite Telemetry Active:</span>
        <span className="text-[#7A5E2E]">{hospitals.length} Hospitals Mapped</span>
      </div>
    </div>
  );
};
