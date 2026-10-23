import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Square, Download, AlertOctagon, X, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenMedicalId: () => void;
}

export const EmergencyPrepModal: React.FC<Props> = ({ isOpen, onClose, onOpenMedicalId }) => {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Download Offline Emergency Medical ID Pass', done: true },
    { id: 2, text: 'Store 3-Day Supply of Critical Prescription Medication (Inhaler, Insulin)', done: true },
    { id: 3, text: 'Pack Water (1 Gallon per person per day) & Non-perishables', done: false },
    { id: 4, text: 'Certified First-Aid Kit with Tourniquet, Sterile Gauze & Antiseptic', done: false },
    { id: 5, text: 'Portable Power Bank (10,000+ mAh) & Emergency Flashlight', done: true },
    { id: 6, text: 'Designate Primary Family Meeting Point & Out-of-Area Contact', done: false }
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  if (!isOpen) return null;

  const completedCount = checklist.filter(c => c.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2720]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prep-modal-title"
    >
      <div className="relative w-full max-w-xl clinic-panel-elevated rounded-3xl p-6 md:p-8 border border-[#C7AE7B]/40 max-h-[85vh] overflow-y-auto shadow-2xl">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4F0E6]/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#163C32] border border-[#C7AE7B]/40 flex items-center justify-center text-[#C7AE7B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="prep-modal-title" className="text-base font-bold text-[#F4F0E6]">
                Emergency Readiness Protocol
              </h3>
              <p className="text-xs text-[#C7AE7B] font-mono">
                72-Hour Survival Go-Bag & Household Plan
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

        {/* Readiness Meter in Warm Ivory & Champagne */}
        <div className="my-5 p-4 rounded-2xl bg-[#0E2720]/80 border border-[#C7AE7B]/25 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#F4F0E6]">Household Preparedness Score</span>
            <span className="font-mono text-[#C7AE7B] font-bold">{progressPercent}% Ready</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#163C32] overflow-hidden border border-[#C7AE7B]/20">
            <div
              className="h-full bg-gradient-to-r from-[#C7AE7B] to-[#F4F0E6] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Interactive Checklist */}
        <div className="space-y-2.5">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="p-3.5 rounded-2xl bg-[#163C32]/60 border border-[#F4F0E6]/10 hover:border-[#C7AE7B]/40 cursor-pointer flex items-center space-x-3 transition-colors"
              role="checkbox"
              aria-checked={item.done}
              tabIndex={0}
              onKeyDown={(e) => e.key === ' ' && toggleCheck(item.id)}
            >
              {item.done ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-[#F4F0E6]/40 shrink-0" />
              )}
              <span
                className={`text-xs ${
                  item.done ? 'text-[#F4F0E6]/50 line-through' : 'text-[#F4F0E6] font-medium'
                }`}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#F4F0E6]/10 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenMedicalId();
            }}
            className="text-xs text-[#C7AE7B] hover:underline font-mono flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open Medical ID Pass &rarr;</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#163C32] border border-[#C7AE7B]/30 hover:border-[#C7AE7B] text-[#F4F0E6] text-xs font-mono"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
