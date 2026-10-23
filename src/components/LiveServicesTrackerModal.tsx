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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl p-6 md:p-8 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Siren className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Live Unit Dispatch Radar</h3>
              <p className="text-xs text-slate-400">Unit: {serviceType} • High Priority Responder</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Radar Dispatch Map Simulation */}
        <div className="my-5 p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
          
          <div className="relative w-44 h-44 rounded-full border border-cyan-500/30 flex items-center justify-center">
            <div className="absolute inset-4 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
            <div className="absolute inset-10 rounded-full border border-cyan-500/25" />
            
            {/* Center target (User) */}
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#00F0FF] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>

            {/* Approaching Ambulance Unit marker */}
            <div className="absolute top-8 right-10 flex flex-col items-center animate-bounce">
              <span className="p-1.5 rounded-lg bg-red-600 text-white shadow-[0_0_12px_#ef4444]">
                <Truck className="w-3.5 h-3.5" />
              </span>
              <span className="text-[9px] font-mono font-bold text-red-400 mt-1 bg-slate-950 px-1 rounded border border-red-500/30">
                AMB-104
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-2xl font-black text-emerald-400 font-mono">1.2 km • 2 MINS AWAY</span>
            <p className="text-xs text-slate-400 mt-0.5">Dispatched from Apex Trauma Hub • Driver: Parametic S. Verma</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Simulated dispatch telemetry. Official emergency line remains 112 / 911.</span>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center space-x-3">
          <a
            href="tel:112"
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            <Phone className="w-4 h-4" />
            <span>Emergency Dispatch (112)</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
