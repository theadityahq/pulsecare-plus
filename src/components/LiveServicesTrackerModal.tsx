import React from 'react';
import { Truck, Phone, Navigation, Shield, Siren, AlertCircle, X, Radio } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
}

export const LiveServicesTrackerModal: React.FC<Props> = ({ isOpen, onClose, serviceType }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173E35]/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracker-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border-2 border-[#C4A66B]/40 shadow-2xl text-[#173E35]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C4A66B]/25">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#173E35] text-[#C4A66B] border border-[#C4A66B]/40 shadow-xs">
              <Siren className="w-6 h-6 animate-pulse text-[#C4A66B]" />
            </div>
            <div>
              <h3 id="tracker-title" className="text-base font-black text-[#173E35]">
                Response Unit Telemetry
              </h3>
              <p className="text-xs text-[#7A5E2E] font-mono font-medium">
                {serviceType} • [Demo Simulation]
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

        {/* Live Radar Dispatch Map Simulation in Warm Ivory & Champagne */}
        <div className="my-5 p-6 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
          <div className="relative w-44 h-44 rounded-full border border-[#C4A66B]/40 flex items-center justify-center">
            <div className="absolute inset-4 rounded-full border border-[#C4A66B]/30 animate-ping opacity-25" />
            <div className="absolute inset-10 rounded-full border border-[#C4A66B]/35" />
            
            {/* Center target (User) */}
            <div className="w-4 h-4 rounded-full bg-[#173E35] shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]" />
            </div>

            {/* Approaching Ambulance Unit marker */}
            <div className="absolute top-8 right-10 flex flex-col items-center animate-bounce">
              <span className="p-1.5 rounded-lg bg-[#CC3B2D] text-white shadow-md">
                <Truck className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono font-bold text-[#CC3B2D] mt-1 bg-white px-1.5 py-0.5 rounded border border-[#CC3B2D]/40 shadow-xs">
                AMB-104
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xl font-black text-[#173E35] font-mono">1.2 km • 2 MINS AWAY</span>
            <p className="text-xs text-[#7A5E2E] mt-0.5 font-mono font-medium">
              Demo Simulation: Dispatched from AIIMS Trauma Center • Driver: Paramedic S. Verma
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-[#173E35] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
          <span className="text-[11px] leading-tight font-medium">
            * Simulated response telemetry. In any real crisis, call <strong>112</strong> immediately.
          </span>
        </div>

        <div className="mt-6 pt-4 border-t border-[#C4A66B]/25 flex items-center space-x-3">
          <a
            href="tel:112"
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#CC3B2D] hover:bg-[#B03326] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Phone className="w-4 h-4" />
            <span>Call 112 Directly</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#173E35] hover:bg-[#1F4D43] text-[#F1F0E9] text-xs font-bold transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
