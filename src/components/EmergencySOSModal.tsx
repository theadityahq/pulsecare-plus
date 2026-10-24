import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  PhoneCall,
  ShieldAlert,
  Radio,
  Send,
  User,
  X,
  MessageSquare
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

  // 2-second hold to activate SOS mode
  useEffect(() => {
    let interval: any;
    if (isHolding && !sosActive) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSosActive(true);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    } else {
      setHoldProgress(0);
    }

    return () => clearInterval(interval);
  }, [isHolding, sosActive, setSosActive]);

  const disarmSos = () => {
    setSosActive(false);
    setHoldProgress(0);
  };

  if (!isOpen) return null;

  const primaryContact = EMERGENCY_CONTACTS.find((c) => c.isPrimary) || EMERGENCY_CONTACTS[0];
  const smsBody = encodeURIComponent(
    `EMERGENCY ALERT from PulseCare+: I require urgent assistance. Medical ID: ${SIMULATED_USER.name}, Blood Group: ${SIMULATED_USER.bloodType}, Critical Allergies: ${SIMULATED_USER.criticalAllergies.join(', ')}. Please contact me or dial 112.`
  );
  const smsHref = primaryContact ? `sms:${primaryContact.phone.replace(/[^0-9+]/g, '')}?body=${smsBody}` : '#';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#163C32]/65 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-title"
    >
      <div className="relative w-full max-w-xl bg-[#FAF8F5] rounded-3xl p-6 md:p-8 border border-[#B82819]/40 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-[#1D2521]">
        
        {/* Safety Disclaimer Banner */}
        <div className="mb-5 p-4 rounded-2xl bg-amber-50/80 border border-[#B82819]/30 flex items-start space-x-3 text-[#1D2521]">
          <AlertCircle className="w-5 h-5 text-[#B82819] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-black tracking-wide uppercase text-[#B82819] block font-mono">
              Emergency Dispatch Information
            </span>
            <p className="text-[11px] text-[#1D2521]/90 leading-relaxed font-medium">
              Web browsers cannot automatically transmit emergency SMS in the background without user intervention. <strong>In an immediate life-threatening emergency, always place a direct telephone call to 112.</strong>
            </p>
          </div>
        </div>

        {/* SOS Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C4A66B]/25">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl ${sosActive ? 'bg-[#B82819] text-white animate-pulse' : 'bg-[#163C32] text-[#F1F0E9]'}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="sos-title" className="text-lg font-black text-[#163C32] flex items-center gap-2">
                Emergency SOS Beacon
                {sosActive && (
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded-full bg-[#B82819] text-white animate-pulse">
                    ACTIVE
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#7A5E2E] font-mono font-medium">1-Tap Cellular Triage & Emergency Alert</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#163C32] text-[#F1F0E9] hover:bg-[#B82819] transition-all border border-[#C4A66B]/40 shadow-md flex items-center justify-center"
            aria-label="Close SOS Dialog"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SOS Action State */}
        {!sosActive ? (
          <div className="py-6 flex flex-col items-center text-center">
            <p className="text-xs text-[#1D2521] max-w-md mb-6 leading-relaxed font-medium">
              Press and hold the button below for <strong>2 seconds</strong> to activate the SOS beacon and open quick-dispatch options.
            </p>

            {/* Hold to Activate Button */}
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-[#E8E6DD]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="stroke-[#B82819] transition-all duration-75"
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
                className="absolute w-32 h-32 rounded-full bg-[#B82819] hover:bg-[#9E2013] text-white font-black text-sm tracking-widest flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform select-none"
              >
                <Radio className="w-7 h-7 mb-1 animate-pulse" />
                <span>HOLD SOS</span>
                <span className="text-[9px] font-mono font-bold opacity-90">2 SECONDS</span>
              </button>
            </div>

            {/* Immediate Direct 112 Phone Call link */}
            <div className="mt-8 pt-4 border-t border-[#C4A66B]/25 w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[#1D2521] font-medium">Need immediate medical assistance?</span>
              <a
                href="tel:112"
                className="px-5 py-2.5 rounded-xl bg-[#B82819] hover:bg-[#9E2013] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 112 Directly</span>
              </a>
            </div>
          </div>
        ) : (
          /* ACTIVE SOS STATE */
          <div className="py-4 space-y-5">
            <div className="p-4 rounded-2xl bg-red-50 border-2 border-[#B82819] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#B82819] animate-ping shrink-0" />
                <div>
                  <h3 className="text-xs font-black text-[#B82819]">SOS EMERGENCY MODE ENGAGED</h3>
                  <p className="text-[10px] text-[#1D2521] font-mono font-medium">Tap below to trigger direct cellular phone or SMS alerts</p>
                </div>
              </div>
              <button
                onClick={disarmSos}
                className="px-3.5 py-1.5 rounded-xl bg-[#163C32] hover:bg-[#1E4D40] text-xs font-mono font-bold text-[#F1F0E9] shadow-xs"
              >
                Disarm SOS
              </button>
            </div>

            {/* Direct Device Action Buttons (Truthful: real device triggers) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:112"
                className="p-3.5 rounded-2xl bg-[#B82819] hover:bg-[#9E2013] text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Dial 112 Emergency Call</span>
              </a>

              {primaryContact && (
                <a
                  href={smsHref}
                  className="p-3.5 rounded-2xl bg-[#163C32] hover:bg-[#1E4D40] text-[#F1F0E9] font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send SOS SMS to {primaryContact.name.split(' ')[0]}</span>
                </a>
              )}
            </div>

            {/* Quick Triage Summary Bar */}
            <div className="p-4 rounded-2xl bg-white border border-[#C4A66B]/40 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#7A5E2E] uppercase tracking-wider font-bold">
                  Medical ID Emergency Snapshot
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenMedicalId();
                  }}
                  className="text-xs text-[#163C32] hover:text-[#B82819] flex items-center gap-1 font-mono font-bold underline"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Full Medical ID Pass &rarr;</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#F1F0E9] p-2.5 rounded-xl border border-[#C4A66B]/30 shadow-xs">
                  <span className="text-[10px] text-[#7A5E2E] block font-mono font-semibold">BLOOD GROUP</span>
                  <span className="text-sm font-black text-[#B82819]">{SIMULATED_USER.bloodType}</span>
                </div>
                <div className="bg-[#F1F0E9] p-2.5 rounded-xl border border-[#C4A66B]/30 shadow-xs">
                  <span className="text-[10px] text-[#7A5E2E] block font-mono font-semibold">ORGAN DONOR</span>
                  <span className="text-sm font-black text-emerald-800">Self-Declared</span>
                </div>
                <div className="bg-[#F1F0E9] p-2.5 rounded-xl border border-[#C4A66B]/30 shadow-xs">
                  <span className="text-[10px] text-[#7A5E2E] block font-mono font-semibold">AGE</span>
                  <span className="text-sm font-black text-[#163C32]">{SIMULATED_USER.age} yrs</span>
                </div>
              </div>

              <div className="text-xs text-[#1D2521] bg-red-50 p-3 rounded-xl border border-[#B82819]/30">
                <strong className="text-[#B82819]">Critical Allergies:</strong> {SIMULATED_USER.criticalAllergies.join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Bottom Close Button */}
        <div className="mt-5 pt-4 border-t border-[#C4A66B]/25 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#163C32] text-[#F1F0E9] hover:bg-[#1E4D40] text-xs font-bold transition-all shadow-md"
          >
            Close SOS Window
          </button>
        </div>
      </div>
    </div>
  );
};
