import React, { useState } from 'react';
import { Pill, Phone, Navigation, Clock, Search, CheckCircle, X, ShieldAlert } from 'lucide-react';

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
    address: 'Shop 12, Cyber Green Complex',
    inStock: ['EpiPen Auto-Injector', 'Albuterol / Asthalin Inhaler', 'Insulin Glargine', 'Amoxicillin']
  },
  {
    id: 'ph-2',
    name: 'MedPlus Emergency Drug Store',
    distance: '820m',
    driveTime: '4 mins',
    hours: 'Open 24 Hours',
    phone: '+91 1800 425 0000',
    address: 'Crossroad Junction, Block B',
    inStock: ['Nebulizer Kits', 'Paracetamol 650', 'Digital Oximeters', 'Salbutamol']
  },
  {
    id: 'ph-3',
    name: 'Guardian Lifecare Chemist',
    distance: '1.4 km',
    driveTime: '6 mins',
    hours: 'Closes at 11:00 PM',
    phone: '+91 11 2654 9988',
    address: 'Near Metro Pillar 44',
    inStock: ['First Aid Kits', 'Bandages & Gauze', 'Antihistamines (Cetirizine)']
  }
];

export const PharmaciesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = PHARMACIES.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.inStock.some(med => med.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel-elevated rounded-3xl p-6 md:p-8 border border-cyan-500/30 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nearby 24/7 Pharmacies</h3>
              <p className="text-xs text-slate-400">Emergency Medicine & Prescription Availability</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search medicine input */}
        <div className="my-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine (e.g. EpiPen, Inhaler, Insulin)..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="space-y-3.5">
          {filtered.map(ph => (
            <div key={ph.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{ph.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{ph.address}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {ph.hours}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-cyan-500/30">
                    {ph.distance}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1 font-mono">~{ph.driveTime}</span>
                </div>
              </div>

              {/* In-Stock Tag Badges */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">VERIFIED IN STOCK:</span>
                <div className="flex flex-wrap gap-1.5">
                  {ph.inStock.map((med, idx) => (
                    <span key={idx} className="text-[11px] bg-cyan-950/50 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1 font-mono">
                      <CheckCircle className="w-3 h-3 text-cyan-400" /> {med}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2 border-t border-slate-800/80">
                <a
                  href={`tel:${ph.phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Pharmacy</span>
                </a>
                <button
                  onClick={() => alert(`[SIMULATION]: Routing to ${ph.name}`)}
                  className="py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
