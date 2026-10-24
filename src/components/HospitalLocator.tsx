import React, { useState } from 'react';
import { HOSPITALS } from '../data/mockData';
import { Hospital } from '../types';
import { Building2, Navigation, Phone, Clock, Bed, Filter, X } from 'lucide-react';

interface Props {
  selectedHospital: Hospital | null;
  onSelectHospital: (hosp: Hospital) => void;
  onClose?: () => void;
  hospitals?: Hospital[];
  currentLocationName?: string;
}

export const HospitalLocator: React.FC<Props> = ({
  selectedHospital,
  onSelectHospital,
  onClose,
  hospitals,
  currentLocationName
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const hospitalList = hospitals && hospitals.length > 0 ? hospitals : HOSPITALS;

  const filtered = hospitalList.filter((h) => {
    if (filterCategory === 'ALL') return true;
    return h.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#C4A66B]/35 shadow-xl space-y-6 text-[#173E35]">
      
      {/* Top Header Bar with Filter and Dedicated Close Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#C4A66B]/25">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase tracking-wider block">
            Emergency Care Directory {currentLocationName ? `· ${currentLocationName}` : ''}
          </span>
          <h3 className="text-lg font-black text-[#173E35] mt-0.5">
            Hospital Locator & Trauma Facilities
          </h3>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#C4A66B]/35 text-xs shadow-xs">
            {['ALL', 'Trauma', 'Cardiac', 'General'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl transition-all font-bold ${
                  filterCategory === cat
                    ? 'bg-[#173E35] text-[#F1F0E9] shadow-xs'
                    : 'text-[#173E35]/70 hover:text-[#173E35]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dedicated Close Tab Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] transition-all border border-[#C4A66B]/40 shadow-md flex items-center gap-1.5 text-xs font-bold"
              aria-label="Close Tab"
              title="Close Hospital Directory"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close Tab</span>
            </button>
          )}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((hosp) => {
          const isSelected = selectedHospital?.id === hosp.id;
          return (
            <div
              key={hosp.id}
              className={`p-5 rounded-2xl transition-all duration-200 border-2 flex flex-col justify-between shadow-xs ${
                isSelected
                  ? 'bg-[#FAF8F5] border-[#173E35] ring-2 ring-[#173E35]/20 shadow-md'
                  : 'bg-white border-[#C4A66B]/35 hover:border-[#173E35]/60'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7A5E2E]">
                      {hosp.category}
                    </span>
                    <h4 className="text-sm font-black text-[#173E35] mt-0.5">{hosp.name}</h4>
                    <p className="text-xs text-[#173E35]/75">{hosp.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-[#CC3B2D] block">
                      {hosp.distance}
                    </span>
                    <span className="text-[10px] text-[#7A5E2E] font-mono font-semibold block">
                      ~{hosp.driveTime}
                    </span>
                  </div>
                </div>

                {/* Specialties Tag Cloud */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hosp.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#FAF8F5] text-[#173E35] border border-[#C4A66B]/35 px-2 py-0.5 rounded-lg font-mono font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Real-time stats & Actions */}
              <div className="mt-4 pt-4 border-t border-[#C4A66B]/25 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#C4A66B]/30 flex items-center justify-between">
                    <span className="text-[#173E35]/80 text-[11px] flex items-center gap-1 font-mono font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#7A5E2E]" /> ER Wait
                    </span>
                    <span className="font-black text-emerald-800 font-mono text-[11px]">{hosp.erWaitTime}</span>
                  </div>
                  <div className="bg-[#FAF8F5] p-2 rounded-xl border border-[#C4A66B]/30 flex items-center justify-between">
                    <span className="text-[#173E35]/80 text-[11px] flex items-center gap-1 font-mono font-medium">
                      <Bed className="w-3.5 h-3.5 text-[#7A5E2E]" /> ICU Beds
                    </span>
                    <span className="font-black text-[#173E35] font-mono text-[11px]">{hosp.icuBedsAvailable} Free</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => onSelectHospital(hosp)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                      isSelected
                        ? 'bg-[#173E35] text-[#F1F0E9] shadow-md'
                        : 'bg-white hover:bg-[#FAF8F5] text-[#173E35] border border-[#C4A66B]/40'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Focused in 3D City' : 'Focus in 3D City'}</span>
                  </button>

                  <a
                    href={`tel:${hosp.phone.replace(/[^0-9+]/g, '')}`}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#173E35] border border-[#C4A66B]/40 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#173E35]" />
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
