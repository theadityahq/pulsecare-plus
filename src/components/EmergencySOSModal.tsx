import React, { useState, useEffect } from 'react';
import { AlertCircle, PhoneCall, ShieldAlert, Radio, Send, CheckCircle2, XCircle, MapPin, HeartPulse, User } from 'lucide-react';
import { EMERGENCY_CONTACTS, SIMULATED_USER } from '../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sosActive: boolean;
  setSosActive: (active: boolean) => void;
  onOpenMedicalId: () => void;
}

export const EmergencySOSModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sosActive,
  setSosActive,
  onOpenMedicalId
}) => {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [contactsNotified, setContactsNotified] = useState(false);
  const [smsLog, setSmsLog] = useState<string[]>([]);

  // 3-second hold to activate SOS
  useEffect(() => {
    let interval: any;
    if (isHolding && !sosActive) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            triggerSosActivation();
            return 100;
          }
          return prev + 5; // 20 intervals = ~1 second
        });
      }, 50);
    } else {
      setHoldProgress(0);
    }

    return () => clearInterval(interval);
  }, [isHolding, sosActive]);

  const triggerSosActivation = () => {
    setSosActive(true);
    // Simulate notifying emergency contacts with coordinates
    setContactsNotified(true);
    setSmsLog([
      `[SIMULATED] Automated SMS sent to Dr. Priya Sharma (+91 98765 43210): "EMERGENCY ALERT: Aditya Sharma triggered SOS at GPS (28.6139, 77.2090). Medical ID: https://pulsecare.plus/triage/demo-aditya"`,
      `[SIMULATED] Automated SMS sent to Rajesh Sharma (+91 98111 22334): "EMERGENCY ALERT: Aditya Sharma triggered SOS. Medical ID: O+ Positive, Severe Penicillin Allergy."`,
      `[SIMULATED] Nearby AED Beacon broadcasted to 2 certified first responders.`
    ]);
  };

  const disarmSos = () => {
    setSosActive(false);
    setHoldProgress(0);
    setContactsNotified(false);
    setSmsLog([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel-elevated rounded-2xl p-6 md:p-8 border border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.25)] overflow-hidden">
        
        {/* Urgent Simulated Disclaimer Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 flex items-start space-x-3 text-red-200">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold tracking-wide uppercase text-red-300 block">
              Simulated Safety Demonstration Notice
            </span>
            <p className="text-slate-200">
              This platform provides emergency workflow simulations. <strong>Live 911 / 112 emergency services have NOT been contacted.</strong> In a real life-threatening emergency, always dial your official emergency dispatch service directly on your phone.
            </p>
          </div>
        </div>

        {/* SOS Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl ${sosActive ? 'bg-red-500 text-white animate-pulse' : 'bg-red-500/20 text-red-400'}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                Emergency SOS Dispatch
                {sosActive && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                    ACTIVE
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">Rapid Triage & Trusted Contact Beacon</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <span className="sr-only">Close</span>
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* SOS Action State */}
        {!sosActive ? (
          <div className="py-8 flex flex-col items-center text-center">
            <p className="text-sm text-slate-300 max-w-md mb-6">
              Press and hold the button below for <strong>2 seconds</strong> to trigger an emergency broadcast to your trusted contacts and generate emergency triage telemetry.
            </p>

            {/* Hold to Activate Button */}
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-red-500 transition-all duration-75"
                  strokeWidth="8"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * holdProgress) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <button
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-rose-700 text-white font-extrabold text-lg flex flex-col items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.6)] active:scale-95 transition-all select-none"
              >
                <Radio className="w-6 h-6 mb-1 animate-pulse" />
                <span>HOLD SOS</span>
                <span className="text-[10px] font-mono opacity-80">{holdProgress > 0 ? `${holdProgress}%` : 'HOLD 2s'}</span>
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm">
              <a
                href="tel:112"
                className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-red-500 text-white font-semibold text-xs transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call 112 (India / EU)</span>
              </a>
              <a
                href="tel:911"
                className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-red-500 text-white font-semibold text-xs transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call 911 (US / CA)</span>
              </a>
            </div>
          </div>
        ) : (
          /* Active SOS Telemetry Screen */
          <div className="py-6 space-y-6">
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Emergency Beacon Transmitting</h4>
                  <p className="text-xs text-red-300 font-mono">GPS: 28.6139° N, 77.2090° E (Altitude: 216m)</p>
                </div>
              </div>
              <button
                onClick={disarmSos}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700"
              >
                Disarm SOS
              </button>
            </div>

            {/* Quick Triage Summary Bar */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-bold">
                  Patient Emergency Triage Snapshot
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenMedicalId();
                  }}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <User className="w-3.5 h-3.5" />
                  View Full Medical ID Pass
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">BLOOD GROUP</span>
                  <span className="text-sm font-extrabold text-red-400">{SIMULATED_USER.bloodType}</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">ORGAN DONOR</span>
                  <span className="text-sm font-extrabold text-emerald-400">YES</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">AGE / DOB</span>
                  <span className="text-sm font-extrabold text-slate-200">{SIMULATED_USER.age} yrs</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-red-950/30 p-2.5 rounded border border-red-500/20">
                <strong className="text-red-400">Severe Allergies:</strong> {SIMULATED_USER.criticalAllergies.join(', ')}
              </div>
            </div>

            {/* Simulated Automated Alerts Feed */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Simulated Automated Notification Log
              </span>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                {smsLog.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-slate-300">
                    <Send className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
