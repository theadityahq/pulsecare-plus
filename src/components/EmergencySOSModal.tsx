import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  PhoneCall,
  ShieldAlert,
  Radio,
  Send,
  CheckCircle2,
  XCircle,
  MapPin,
  HeartPulse,
  User,
  X
} from 'lucide-react';
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

  // 2-second hold to activate SOS simulation
  useEffect(() => {
    let interval: any;
    if (isHolding && !sosActive) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            triggerSosActivation();
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    } else {
      setHoldProgress(0);
    }

    return () => clearInterval(interval);
  }, [isHolding, sosActive]);

  const triggerSosActivation = () => {
    setSosActive(true);
    setContactsNotified(true);
    setSmsLog([
      `[SIMULATED] Automated SMS dispatched to Dr. Priya Sharma (+91 98765 43210): "EMERGENCY ALERT: Aditya Sharma triggered SOS at GPS (28.5672, 77.2100). Medical ID: https://pulsecare.plus/triage/aditya"`,
      `[SIMULATED] Automated SMS dispatched to Rajesh Sharma (+91 98111 22334): "EMERGENCY ALERT: Aditya Sharma triggered SOS. Medical ID: O+ Positive, Severe Penicillin Allergy."`,
      `[SIMULATED] Nearby AED Beacon broadcasted to 2 certified local first responders.`
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2721]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-title"
    >
      <div className="relative w-full max-w-xl clinic-panel-elevated rounded-3xl p-6 md:p-8 border border-[#BA3B2E]/50 shadow-2xl overflow-hidden max-h-[88vh] overflow-y-auto">
        
        {/* Urgent Simulated Disclaimer Banner */}
        <div className="mb-5 p-4 rounded-2xl bg-[#0E2721] border border-[#BA3B2E]/60 flex items-start space-x-3 text-[#F1F0E9]">
          <AlertCircle className="w-5 h-5 text-[#F79488] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold tracking-wide uppercase text-[#F79488] block font-mono">
              Emergency Simulation Notice
            </span>
            <p className="text-[11px] text-[#F1F0E9]/85 leading-relaxed">
              This triggers a demo emergency workflow simulation. <strong>Live 112 emergency services are NOT automatically dispatched by this button.</strong> In an active emergency, always place a direct telephone call to <strong>112</strong> using your device dialer.
            </p>
          </div>
        </div>

        {/* SOS Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F0E9]/10">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl ${sosActive ? 'bg-[#BA3B2E] text-white animate-pulse' : 'bg-[#173E35] text-[#F79488]'}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="sos-title" className="text-lg font-bold text-[#F1F0E9] flex items-center gap-2">
                Emergency SOS Beacon
                {sosActive && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#BA3B2E] text-white animate-pulse">
                    ACTIVE
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#C4A66B] font-mono">Rapid Triage & Trusted Circle Alert</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#F1F0E9]/60 hover:text-[#F1F0E9] p-2 rounded-xl hover:bg-[#173E35] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SOS Action State */}
        {!sosActive ? (
          <div className="py-6 flex flex-col items-center text-center">
            <p className="text-xs text-[#F1F0E9]/80 max-w-md mb-6 leading-relaxed">
              Press and hold the button below for <strong>2 seconds</strong> to trigger a simulated emergency broadcast to your trusted circle and lockscreen triage pass.
            </p>

            {/* Hold to Activate Button */}
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-[#173E35]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-[#C4A66B] transition-all duration-75"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * holdProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>

              <button
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-[#9C2A1E] to-[#BA3B2E] hover:from-[#BA3B2E] hover:to-[#D44A3C] text-white font-black text-sm tracking-widest flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform select-none"
              >
                <Radio className="w-7 h-7 mb-1 animate-pulse" />
                <span>HOLD SOS</span>
                <span className="text-[9px] font-mono font-normal opacity-80">2 SECONDS</span>
              </button>
            </div>

            {/* Immediate Direct 112 Phone Call link */}
            <div className="mt-8 pt-4 border-t border-[#F1F0E9]/10 w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[#F1F0E9]/70">Need immediate emergency assistance?</span>
              <a
                href="tel:112"
                className="px-4 py-2 rounded-xl bg-[#BA3B2E] hover:bg-[#9C2A1E] text-white font-bold text-xs flex items-center gap-2 shadow"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 112 Directly</span>
              </a>
            </div>
          </div>
        ) : (
          /* ACTIVE SOS STATE */
          <div className="py-4 space-y-5">
            <div className="p-4 rounded-2xl bg-[#0E2721] border border-[#BA3B2E] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#BA3B2E] animate-ping shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-[#F1F0E9]">SOS BROADCAST TRANSMITTED</h3>
                  <p className="text-[10px] text-[#C4A66B] font-mono">Location coordinates synced to contacts</p>
                </div>
              </div>
              <button
                onClick={disarmSos}
                className="px-3.5 py-1.5 rounded-xl bg-[#173E35] border border-[#C4A66B]/40 hover:border-[#C4A66B] text-xs font-mono text-[#F1F0E9]"
              >
                Disarm SOS
              </button>
            </div>

            {/* Quick Triage Summary Bar */}
            <div className="p-4 rounded-2xl bg-[#173E35]/80 border border-[#C4A66B]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C4A66B] uppercase tracking-wider font-bold">
                  Patient Emergency Triage Snapshot
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenMedicalId();
                  }}
                  className="text-xs text-[#F1F0E9] hover:text-[#C4A66B] hover:underline flex items-center gap-1 font-mono font-semibold"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Full Medical ID Pass &rarr;</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#0E2721] p-2.5 rounded-xl border border-[#F1F0E9]/10">
                  <span className="text-[10px] text-[#C4A66B] block font-mono">BLOOD GROUP</span>
                  <span className="text-sm font-extrabold text-[#F79488]">{SIMULATED_USER.bloodType}</span>
                </div>
                <div className="bg-[#0E2721] p-2.5 rounded-xl border border-[#F1F0E9]/10">
                  <span className="text-[10px] text-[#C4A66B] block font-mono">ORGAN DONOR</span>
                  <span className="text-sm font-extrabold text-emerald-400">YES</span>
                </div>
                <div className="bg-[#0E2721] p-2.5 rounded-xl border border-[#F1F0E9]/10">
                  <span className="text-[10px] text-[#C4A66B] block font-mono">AGE / DOB</span>
                  <span className="text-sm font-extrabold text-[#F1F0E9]">{SIMULATED_USER.age} yrs</span>
                </div>
              </div>

              <div className="text-xs text-[#F1F0E9] bg-[#0E2721] p-3 rounded-xl border border-[#BA3B2E]/40">
                <strong className="text-[#F79488]">Critical Allergies:</strong> {SIMULATED_USER.criticalAllergies.join(', ')}
              </div>
            </div>

            {/* Simulated Notification Log */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#C4A66B] uppercase tracking-wider block font-bold">
                Simulated Automated Notification Log
              </span>
              <div className="bg-[#0E2721] p-3.5 rounded-2xl border border-[#F1F0E9]/10 space-y-2 font-mono text-xs">
                {smsLog.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-[#F1F0E9]/80">
                    <Send className="w-3.5 h-3.5 text-[#C4A66B] shrink-0 mt-0.5" />
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
