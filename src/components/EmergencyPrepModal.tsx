import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Square, Download, AlertOctagon, X, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenMedicalId: () => void;
}

export const EmergencyPrepModal: React.FC<Props> = ({ isOpen, onClose, onOpenMedicalId }) => {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Download Offline Emergency Medical ID Card', done: true },
    { id: 2, text: 'Store 3-Day Supply of Critical Prescription Medication (Inhaler, Insulin)', done: true },
    { id: 3, text: 'Pack Water (1 Gallon per person per day) & Non-perishables', done: false },
    { id: 4, text: 'Certified First-Aid Kit with Tourniquet, Gauze & Antiseptic', done: false },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel-elevated rounded-3xl p-6 md:p-8 border border-blue-500/30 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Emergency Readiness Protocol</h3>
              <p className="text-xs text-slate-400">72-Hour Survival Go-Bag & Family Action Plan</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Readiness Meter */}
        <div className="my-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">Family Readiness Score</span>
            <span className="font-mono text-cyan-300 font-bold">{progressPercent}% Prepared</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Interactive Checklist */}
        <div className="space-y-2.5">
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 cursor-pointer flex items-center space-x-3 transition-colors"
            >
              {item.done ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={`text-xs ${item.done ? 'text-slate-300 line-through opacity-70' : 'text-white font-medium'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenMedicalId();
            }}
            className="text-xs text-cyan-400 hover:underline font-semibold"
          >
            Export Offline Medical Pass
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
