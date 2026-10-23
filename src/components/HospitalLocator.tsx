import React, { useState } from 'react';
import { HOSPITALS } from '../data/mockData';
import { Hospital } from '../types';
import { Building2, Navigation, Phone, Clock, Bed, ShieldAlert, Sparkles, Filter, ExternalLink } from 'lucide-react';

interface Props {
  selectedHospital: Hospital | null;
  onSelectHospital: (hosp: Hospital) => void;
}

export const HospitalLocator: React.FC<Props> = ({ selectedHospital, onSelectHospital }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filtered = HOSPITALS.filter((h) => {
    if (filterCategory === 'ALL') return true;
    return h.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  return (
    <div className="clinic-panel rounded-3xl p-6 border border-[#C7AE7B]/25 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4F0E6]/10">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#C7AE7B] uppercase tracking-wider block">
            Emergency Care Directory
          </span>
          <h3 className="text-base font-bold text-[#F4F0E6] mt-0.5">
            Hospital Locator & Trauma Facilities
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap bg-[#0E2720] p-1 rounded-2xl border border-[#C7AE7B]/30 text-xs">
          {['ALL', 'Trauma', 'Cardiac', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl transition-all font-semibold ${
                filterCategory === cat
                  ? 'bg-[#163C32] text-[#F4F0E6] font-bold border border-[#C7AE7B]/40 shadow-sm'
                  : 'text-[#F4F0E6]/70 hover:text-[#F4F0E6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((hosp) => {
          const isSelected = selectedHospital?.id === hosp.id;
          return (
            <div
              key={hosp.id}
              className={`p-5 rounded-2xl transition-all duration-200 border flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#163C32] border-[#C7AE7B] ring-1 ring-[#C7AE7B]/40 shadow-xl'
                  : 'bg-[#0E2720]/80 border-[#F4F0E6]/10 hover:border-[#C7AE7B]/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C7AE7B]">
                      {hosp.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#F4F0E6] mt-0.5">{hosp.name}</h4>
                    <p className="text-xs text-[#F4F0E6]/70">{hosp.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#FF8A7A] block">
                      {hosp.distance}
                    </span>
                    <span className="text-[10px] text-[#C7AE7B] font-mono block">
                      ~{hosp.driveTime}
                    </span>
                  </div>
                </div>

                {/* Specialties Tag Cloud */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hosp.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#163C32]/70 text-[#F4F0E6]/80 border border-[#C7AE7B]/20 px-2 py-0.5 rounded-lg font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Real-time stats & Actions */}
              <div className="mt-4 pt-4 border-t border-[#F4F0E6]/10 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0E2720] p-2 rounded-xl border border-[#F4F0E6]/10 flex items-center justify-between">
                    <span className="text-[#F4F0E6]/70 text-[11px] flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#C7AE7B]" /> ER Wait
                    </span>
                    <span className="font-bold text-emerald-400 font-mono text-[11px]">{hosp.erWaitTime}</span>
                  </div>
                  <div className="bg-[#0E2720] p-2 rounded-xl border border-[#F4F0E6]/10 flex items-center justify-between">
                    <span className="text-[#F4F0E6]/70 text-[11px] flex items-center gap-1 font-mono">
                      <Bed className="w-3.5 h-3.5 text-[#C7AE7B]" /> ICU Beds
                    </span>
                    <span className="font-bold text-[#F4F0E6] font-mono text-[11px]">{hosp.icuBedsAvailable} Free</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => onSelectHospital(hosp)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#F4F0E6] text-[#1D2521] shadow-md'
                        : 'bg-[#163C32] hover:bg-[#1D4A3E] text-[#F4F0E6] border border-[#C7AE7B]/40'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Focused on Globe' : 'Focus on 3D Globe'}</span>
                  </button>

                  <a
                    href={`tel:${hosp.phone.replace(/[^0-9+]/g, '')}`}
                    className="py-2 px-3 rounded-xl bg-[#163C32] hover:bg-[#1D4A3E] text-[#F4F0E6] border border-[#C7AE7B]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C7AE7B]" />
                    <span>Call</span>
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
