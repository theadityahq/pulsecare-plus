import React, { useState } from 'react';
import { Pill, Phone, Navigation, Clock, Search, CheckCircle, X, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PHARMACIES = [
  {
    id: 'ph-1',
    name: 'Apollo 24/7 Super Pharmacy',
    distance: '450m',
    driveTime: '2 mins',
    hours: 'Open 24 Hours',
    phone: '+91 1800 200 1234',
    address: 'Shop 12, South Extension Part 2, New Delhi',
    inStock: ['EpiPen Auto-Injector', 'Albuterol / Asthalin Inhaler', 'Insulin Glargine', 'Amoxicillin']
  },
  {
    id: 'ph-2',
    name: 'MedPlus Emergency Chemist',
    distance: '820m',
    driveTime: '4 mins',
    hours: 'Open 24 Hours',
    phone: '+91 1800 425 0000',
    address: 'Ring Road Junction, Near AIIMS Metro, New Delhi',
    inStock: ['Nebulizer Kits', 'Paracetamol 650', 'Digital Thermometers', 'Salbutamol Inhaler']
  },
  {
    id: 'ph-3',
    name: 'Guardian Lifecare 24/7 Night Counter',
    distance: '1.4 km',
    driveTime: '6 mins',
    hours: 'Open 24 Hours',
    phone: '+91 11 2654 9988',
    address: 'Opposite Safdarjung Emergency Gate, New Delhi',
    inStock: ['First Aid Trauma Kits', 'Hemostatic Gauze', 'Antihistamines (Cetirizine)']
  }
];

export const PharmaciesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = PHARMACIES.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.inStock.some((med) => med.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2721]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pharmacies-title"
    >
      <div className="relative w-full max-w-xl clinic-panel-elevated rounded-3xl p-6 md:p-8 border border-[#C4A66B]/40 max-h-[85vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F0E9]/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#C4A66B]">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 id="pharmacies-title" className="text-base font-bold text-[#F1F0E9]">
                Nearby 24/7 Verified Pharmacies
              </h3>
              <p className="text-xs text-[#C4A66B] font-mono">
                Emergency Prescription & Critical Stock Telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#F1F0E9]/60 hover:text-[#F1F0E9] hover:bg-[#173E35] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Medicine Input */}
        <div className="my-4 relative">
          <Search className="w-4 h-4 text-[#C4A66B] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine (e.g. EpiPen, Inhaler, Insulin, Gauze)..."
            className="w-full bg-[#173E35] border border-[#C4A66B]/30 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-[#F1F0E9] placeholder-[#F1F0E9]/50 focus:outline-none focus:border-[#C4A66B] transition-colors"
          />
        </div>

        {/* Pharmacy Cards */}
        <div className="space-y-3.5">
          {filtered.map((ph) => (
            <div
              key={ph.id}
              className="p-4 rounded-2xl bg-[#0E2721]/80 border border-[#C4A66B]/20 space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#F1F0E9]">{ph.name}</h4>
                  <p className="text-xs text-[#F1F0E9]/70 mt-0.5">{ph.address}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono font-bold text-emerald-400 bg-[#173E35] border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {ph.hours}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#F79488] block">
                    {ph.distance}
                  </span>
                  <span className="text-[10px] text-[#C4A66B] font-mono block">
                    ~{ph.driveTime} drive
                  </span>
                </div>
              </div>

              {/* Verified Stock Badges */}
              <div>
                <span className="text-[10px] font-mono text-[#C4A66B] block mb-1 uppercase tracking-wider font-bold">
                  Verified In-Stock:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ph.inStock.map((med, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-[#173E35] text-[#F1F0E9] border border-[#C4A66B]/30 px-2 py-0.5 rounded-lg flex items-center gap-1 font-mono"
                    >
                      <CheckCircle className="w-3 h-3 text-[#C4A66B]" /> {med}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center space-x-2 border-t border-[#F1F0E9]/10">
                <a
                  href={`tel:${ph.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#173E35] hover:bg-[#1F4D43] text-xs font-semibold text-[#F1F0E9] flex items-center justify-center gap-1.5 transition-colors border border-[#C4A66B]/30"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C4A66B]" />
                  <span>Call Pharmacy</span>
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(ph.name + ' ' + ph.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 rounded-xl bg-[#F1F0E9] hover:bg-white text-[#18231F] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Map Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
