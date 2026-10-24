import React from 'react';
import { Truck, Phone, Siren, AlertCircle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
}

export const LiveServicesTrackerModal: React.FC<Props> = ({ isOpen, onClose, serviceType }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#163C32]/65 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracker-title"
    >
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-6 md:p-8 border border-[#C4A66B]/40 shadow-2xl text-[#1D2521]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C4A66B]/25">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#163C32] text-[#C4A66B] border border-[#C4A66B]/40 shadow-xs">
              <Siren className="w-6 h-6 animate-pulse text-[#C4A66B]" />
            </div>
            <div>
              <h3 id="tracker-title" className="text-base font-black text-[#163C32] flex items-center gap-2">
                Response Unit Telemetry
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                  Demo Simulation
                </span>
              </h3>
              <p className="text-xs text-[#7A5E2E] font-mono font-medium">
                {serviceType} • Interactive Workflow Demo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#163C32] text-[#F1F0E9] hover:bg-[#B82819] transition-all border border-[#C4A66B]/40 shadow-md flex items-center justify-center"
            aria-label="Close dialog"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Warning Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-[#1D2521] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#B82819] mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-[#B82819] uppercase tracking-wide font-mono text-[10px] block">
              Simulation Notice — No Active Dispatch
            </strong>
            <p className="text-[11px] leading-relaxed text-[#1D2521]/90">
              This screen is an interactive UI demonstration. No actual emergency vehicle is being tracked or dispatched. In an emergency, dial <strong>112</strong> immediately.
            </p>
          </div>
        </div>

        {/* Live Radar Dispatch Map Simulation in Warm Ivory & Champagne */}
        <div className="my-5 p-6 rounded-2xl bg-[#F1F0E9] border border-[#C4A66B]/30 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
          <div className="relative w-44 h-44 rounded-full border border-[#C4A66B]/40 flex items-center justify-center">
            <div className="absolute inset-4 rounded-full border border-[#C4A66B]/30 animate-ping opacity-25" />
            <div className="absolute inset-10 rounded-full border border-[#C4A66B]/35" />
            
            {/* Center target (User) */}
            <div className="w-4 h-4 rounded-full bg-[#163C32] shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F5]" />
            </div>

            {/* Approaching Unit marker */}
            <div className="absolute top-8 right-10 flex flex-col items-center animate-bounce">
              <span className="p-1.5 rounded-lg bg-[#B82819] text-white shadow-md">
                <Truck className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono font-bold text-[#B82819] mt-1 bg-white px-1.5 py-0.5 rounded border border-[#B82819]/40 shadow-xs">
                AMB-DEMO
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xl font-black text-[#163C32] font-mono">1.2 km • [Simulated Speed]</span>
            <p className="text-xs text-[#7A5E2E] mt-0.5 font-mono font-medium">
              Demo Simulation: Sample Tertiary Hospital • Not a Live Unit
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#C4A66B]/25 flex items-center space-x-3">
          <a
            href="tel:112"
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#B82819] hover:bg-[#9E2013] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Phone className="w-4 h-4" />
            <span>Call 112 Directly</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#163C32] hover:bg-[#1E4D40] text-[#F1F0E9] text-xs font-bold transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
