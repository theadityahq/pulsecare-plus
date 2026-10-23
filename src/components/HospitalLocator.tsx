import React, { useState } from 'react';
import { HOSPITALS } from '../data/mockData';
import { Hospital } from '../types';
import { Building2, Navigation, Phone, Clock, Bed, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface Props {
  selectedHospital: Hospital | null;
  onSelectHospital: (hosp: Hospital) => void;
}

export const HospitalLocator: React.FC<Props> = ({ selectedHospital, onSelectHospital }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filtered = HOSPITALS.filter(h => {
    if (filterCategory === 'ALL') return true;
    return h.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            Emergency Triage Facilities
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">Hospital Locator & Live Bed Tracker</h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'Trauma', 'Cardiac', 'Pediatric'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                filterCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(hosp => {
          const isSelected = selectedHospital?.id === hosp.id;
          return (
            <div
              key={hosp.id}
              className={`p-5 rounded-2xl transition-all duration-200 border flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-cyan-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      {hosp.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">{hosp.name}</h4>
                    <p className="text-xs text-slate-400">{hosp.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-cyan-500/30">
                      {hosp.distance}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1 font-mono">~{hosp.driveTime}</span>
                  </div>
                </div>

                {/* Specialties Tag Cloud */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hosp.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-950/80 text-slate-300 border border-slate-800 px-2 py-0.5 rounded font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Real-time stats & Actions */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> ER Wait
                    </span>
                    <span className="font-bold text-emerald-400">{hosp.erWaitTime}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-cyan-400" /> ICU Beds
                    </span>
                    <span className="font-bold text-cyan-300">{hosp.icuBedsAvailable} Free</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => onSelectHospital(hosp)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                        : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Focused on 3D City' : 'Focus on 3D Map'}</span>
                  </button>

                  <a
                    href={`tel:${hosp.phone}`}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call ER</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
