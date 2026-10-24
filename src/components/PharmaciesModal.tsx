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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173E35]/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pharmacies-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border-2 border-[#C4A66B]/40 max-h-[85vh] overflow-y-auto shadow-2xl text-[#173E35]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C4A66B]/25">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#C4A66B]">
              <Pill className="w-5 h-5 text-[#C4A66B]" />
            </div>
            <div>
              <h3 id="pharmacies-title" className="text-base font-black text-[#173E35]">
                Nearby 24/7 Verified Pharmacies
              </h3>
              <p className="text-xs text-[#7A5E2E] font-mono font-medium">
                Emergency Prescription & Critical Stock Telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] transition-all border border-[#C4A66B]/40 shadow-md flex items-center justify-center group"
            aria-label="Close dialog"
            title="Close dialog"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Search Medicine Input */}
        <div className="my-4 relative">
          <Search className="w-4 h-4 text-[#7A5E2E] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine (e.g. EpiPen, Inhaler, Insulin, Gauze)..."
            className="w-full bg-[#FAF8F5] border border-[#C4A66B]/40 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-[#173E35] placeholder-[#173E35]/50 focus:outline-none focus:border-[#173E35] transition-colors shadow-xs"
          />
        </div>

        {/* Pharmacy Cards */}
        <div className="space-y-3.5">
          {filtered.map((ph) => (
            <div
              key={ph.id}
              className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-black text-[#173E35]">{ph.name}</h4>
                  <p className="text-xs text-[#173E35]/75 mt-0.5">{ph.address}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    {ph.hours}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-[#CC3B2D] block">
                    {ph.distance}
                  </span>
                  <span className="text-[10px] text-[#7A5E2E] font-mono font-semibold block">
                    ~{ph.driveTime} drive
                  </span>
                </div>
              </div>

              {/* Verified Stock Badges */}
              <div>
                <span className="text-[10px] font-mono text-[#7A5E2E] block mb-1 uppercase tracking-wider font-bold">
                  Verified In-Stock:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ph.inStock.map((med, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-white text-[#173E35] border border-[#C4A66B]/40 px-2 py-0.5 rounded-lg flex items-center gap-1 font-mono font-medium shadow-xs"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-700" /> {med}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center space-x-2 border-t border-[#C4A66B]/20">
                <a
                  href={`tel:${ph.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-[#F1F0E9] text-xs font-bold text-[#173E35] flex items-center justify-center gap-1.5 transition-colors border border-[#C4A66B]/40 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#173E35]" />
                  <span>Call Pharmacy</span>
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(ph.name + ' ' + ph.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 rounded-xl bg-[#173E35] hover:bg-[#1F4D43] text-[#F1F0E9] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Map Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Dedicated Bottom Close Button */}
        <div className="mt-5 pt-4 border-t border-[#C4A66B]/25 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#1F4D43] text-xs font-bold transition-all shadow-md"
          >
            Close Pharmacy Directory
          </button>
        </div>
      </div>
    </div>
  );
};
