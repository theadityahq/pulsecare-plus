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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173E35]/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prep-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border-2 border-[#C4A66B]/40 max-h-[85vh] overflow-y-auto shadow-2xl text-[#173E35]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C4A66B]/25">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#C4A66B]">
              <ShieldCheck className="w-5 h-5 text-[#C4A66B]" />
            </div>
            <div>
              <h3 id="prep-modal-title" className="text-base font-black text-[#173E35]">
                Emergency Readiness Protocol
              </h3>
              <p className="text-xs text-[#7A5E2E] font-mono font-medium">
                72-Hour Survival Go-Bag & Household Plan
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

        {/* Readiness Meter in Warm Ivory & Champagne */}
        <div className="my-5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#173E35]">Household Preparedness Score</span>
            <span className="font-mono text-[#7A5E2E] font-bold">{progressPercent}% Ready</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E8E6DD] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C4A66B] to-[#173E35] transition-all duration-300 rounded-full"
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
              className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 hover:border-[#173E35] cursor-pointer flex items-center space-x-3 transition-colors shadow-xs"
              role="checkbox"
              aria-checked={item.done}
              tabIndex={0}
              onKeyDown={(e) => e.key === ' ' && toggleCheck(item.id)}
            >
              {item.done ? (
                <CheckSquare className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-[#173E35]/40 shrink-0" />
              )}
              <span
                className={`text-xs ${
                  item.done ? 'text-[#173E35]/45 line-through font-normal' : 'text-[#173E35] font-semibold'
                }`}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#C4A66B]/25 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenMedicalId();
            }}
            className="text-xs text-[#173E35] hover:text-[#CC3B2D] font-mono font-bold flex items-center gap-1 underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open Medical ID Pass &rarr;</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#1F4D43] text-xs font-bold transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
