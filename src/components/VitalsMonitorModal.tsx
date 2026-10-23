import React, { useState, useEffect } from 'react';
import { Activity, Heart, Wind, Thermometer, ShieldCheck, RefreshCw, X, Play, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VitalsMonitorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [heartRate, setHeartRate] = useState(74);
  const [spo2, setSpo2] = useState(98);
  const [bp, setBp] = useState('118/78');

  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            setIsScanning(false);
            setHeartRate(Math.floor(70 + Math.random() * 8));
            setSpo2(Math.floor(97 + Math.random() * 3));
            return 100;
          }
          return p + 10;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel-elevated rounded-3xl p-6 md:p-8 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Live Vitals & Health Telemetry</h3>
              <p className="text-xs text-slate-400">Continuous Biometric Analysis & Alerting</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live ECG Canvas Simulation */}
        <div className="my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LEAD II ECG TELEMETRY
            </span>
            <span>25 mm/s • 10 mm/mV</span>
          </div>

          <div className="h-20 w-full overflow-hidden flex items-center">
            <svg viewBox="0 0 600 80" className="w-full h-full stroke-red-500 fill-none drop-shadow-[0_0_10px_#ef4444]">
              <path
                d="M0 40 L60 40 L70 40 L75 30 L80 50 L85 10 L92 70 L98 32 L105 40 L160 40 L220 40 L230 40 L235 30 L240 50 L245 10 L252 70 L258 32 L265 40 L320 40 L380 40 L390 40 L395 30 L400 50 L405 10 L412 70 L418 32 L425 40 L480 40 L540 40 L550 40 L555 30 L560 50 L565 10 L572 70 L578 32 L585 40 L600 40"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono">HEART RATE</span>
              <Heart className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-xl font-black text-white">{heartRate} <span className="text-xs font-normal text-slate-400">BPM</span></div>
            <span className="text-[10px] text-emerald-400 font-mono">Normal (Resting)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono">BLOOD OXYGEN</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-black text-white">{spo2}% <span className="text-xs font-normal text-slate-400">SpO2</span></div>
            <span className="text-[10px] text-emerald-400 font-mono">Optimal</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono">BLOOD PRESSURE</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-black text-white">{bp}</div>
            <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono">TEMPERATURE</span>
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white">98.4°F</div>
            <span className="text-[10px] text-emerald-400 font-mono">Normal</span>
          </div>
        </div>

        {/* Calibration / Scan Action */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-mono">
            {isScanning ? `Analyzing sensors... ${scanProgress}%` : 'Last calibrated: 2 mins ago'}
          </span>
          <button
            onClick={startScan}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isScanning ? 'Scanning...' : 'Measure Vitals Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
