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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2720]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracker-title"
    >
      <div className="relative w-full max-w-lg clinic-panel-elevated rounded-3xl p-6 md:p-8 border border-[#C7AE7B]/40 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4F0E6]/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#163C32] text-[#C7AE7B] border border-[#C7AE7B]/30">
              <Siren className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 id="tracker-title" className="text-base font-bold text-[#F4F0E6]">
                Response Unit Telemetry
              </h3>
              <p className="text-xs text-[#C7AE7B] font-mono">
                {serviceType} • [Demo Simulation]
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#F4F0E6]/60 hover:text-[#F4F0E6] hover:bg-[#163C32] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Radar Dispatch Map Simulation in Warm Ivory & Champagne */}
        <div className="my-5 p-6 rounded-2xl bg-[#0E2720] border border-[#C7AE7B]/25 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-44 h-44 rounded-full border border-[#C7AE7B]/30 flex items-center justify-center">
            <div className="absolute inset-4 rounded-full border border-[#C7AE7B]/20 animate-ping opacity-30" />
            <div className="absolute inset-10 rounded-full border border-[#C7AE7B]/25" />
            
            {/* Center target (User) */}
            <div className="w-4 h-4 rounded-full bg-[#F4F0E6] shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1D2521]" />
            </div>

            {/* Approaching Ambulance Unit marker */}
            <div className="absolute top-8 right-10 flex flex-col items-center animate-bounce">
              <span className="p-1.5 rounded-lg bg-[#B82E1E] text-white shadow">
                <Truck className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono font-bold text-[#FF8A7A] mt-1 bg-[#0E2720] px-1.5 py-0.5 rounded border border-[#B82E1E]/40">
                AMB-104
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xl font-black text-emerald-400 font-mono">1.2 km • 2 MINS AWAY</span>
            <p className="text-xs text-[#F4F0E6]/70 mt-0.5 font-mono">
              Demo Simulation: Dispatched from AIIMS Trauma Center • Driver: Paramedic S. Verma
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#163C32]/70 border border-[#C7AE7B]/30 text-xs text-[#F4F0E6]/90 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C7AE7B]" />
          <span className="text-[11px] leading-tight">
            * Simulated response telemetry. In any real crisis, call <strong>112</strong> immediately.
          </span>
        </div>

        <div className="mt-6 pt-4 border-t border-[#F4F0E6]/10 flex items-center space-x-3">
          <a
            href="tel:112"
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#B82E1E] hover:bg-[#9E2517] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
          >
            <Phone className="w-4 h-4" />
            <span>Call 112 Directly</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#163C32] hover:bg-[#1D4A3E] text-[#F4F0E6] text-xs font-mono border border-[#C7AE7B]/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
