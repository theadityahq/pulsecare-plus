import React, { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  Heart,
  AlertTriangle,
  Pill,
  Save,
  X,
  CheckCircle2,
  Cpu,
  Plus
} from 'lucide-react';
import { UserProfile, getLocalProfile, saveLocalProfile } from '../services/db';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accountId?: string;
  onProfileUpdated?: (p: UserProfile) => void;
}

export const HealthProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  accountId = 'local-default',
  onProfileUpdated
}) => {
  const [profile, setProfile] = useState<UserProfile>({
    accountId,
    name: 'Aditya Sharma',
    age: 26,
    dob: '1998-04-12',
    bloodType: 'O+ Positive',
    organDonor: true,
    criticalAllergies: ['Penicillin', 'Peanuts (Severe Anaphylaxis)'],
    chronicConditions: ['Mild Exercise-Induced Asthma'],
    currentMedications: ['Albuterol Inhaler (PRN)'],
    emergencyNotes: 'Carries EpiPen in emergency kit. No DNR directive.',
    insurance: {
      provider: 'National Health Triage Network',
      policyNumber: 'PC-IND-884920',
      groupNumber: 'GRP-9902'
    },
    lastUpdated: new Date().toISOString()
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMed, setNewMed] = useState('');

  useEffect(() => {
    if (isOpen) {
      getLocalProfile(accountId).then((stored) => {
        if (stored) setProfile(stored);
      });
    }
  }, [isOpen, accountId]);

  if (!isOpen) return null;

  const handleSave = async () => {
    profile.lastUpdated = new Date().toISOString();
    await saveLocalProfile(profile);
    setSavedSuccess(true);
    if (onProfileUpdated) onProfileUpdated(profile);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const addAllergy = () => {
    if (!newAllergy.trim()) return;
    setProfile({
      ...profile,
      criticalAllergies: [...profile.criticalAllergies, newAllergy.trim()]
    });
    setNewAllergy('');
  };

  const removeAllergy = (index: number) => {
    setProfile({
      ...profile,
      criticalAllergies: profile.criticalAllergies.filter((_: string, i: number) => i !== index)
    });
  };

  const addMed = () => {
    if (!newMed.trim()) return;
    setProfile({
      ...profile,
      currentMedications: [...profile.currentMedications, newMed.trim()]
    });
    setNewMed('');
  };

  const removeMed = (index: number) => {
    setProfile({
      ...profile,
      currentMedications: profile.currentMedications.filter((_: string, i: number) => i !== index)
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173E35]/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 border-2 border-[#C4A66B]/40 max-h-[88vh] overflow-y-auto shadow-2xl text-[#173E35]">
        
        {/* Header with High-Contrast Deep Green Text and Dedicated Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C4A66B]/25">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#F1F0E9] shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="profile-modal-title" className="text-base sm:text-lg font-black text-[#173E35] tracking-tight">
                Emergency Health Profile & Directives
              </h3>
              <p className="text-xs text-[#7A5E2E] font-mono font-semibold">
                Stored in Local IndexedDB on this Device
              </p>
            </div>
          </div>

          {/* Dedicated Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] transition-all border border-[#C4A66B]/40 shadow-md flex items-center justify-center group"
            aria-label="Close emergency health profile"
            title="Close dialog"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Truthful Device Integration Notice (No false ECG/SpO2 claims) */}
        <div className="my-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 flex items-start space-x-3 text-xs text-[#173E35]">
          <Cpu className="w-5 h-5 text-[#7A5E2E] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#173E35] block font-mono">
              Hardware Sensor Policy Notice
            </span>
            <p className="text-[11px] leading-relaxed text-[#173E35]/80">
              PulseCare+ does not estimate, simulate, or fabricate vital signs (ECG, SpO2, heart rate) using software alone. Clinical biometrics require authorized external medical sensors. Direct Bluetooth Health Device Profile (HDP) synchronization is supported in native medical client builds.
            </p>
          </div>
        </div>

        {/* Core Medical Details */}
        <div className="space-y-5">
          
          {/* Blood Type & Donor Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase text-[#163C32] block">
                Blood Group (Self-Reported)
              </label>
              <select
                value={profile.bloodType}
                onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                className="w-full bg-white border border-[#C4A66B]/30 rounded-xl p-2.5 text-xs text-[#173E35] font-semibold focus:outline-none focus:border-[#173E35] shadow-xs"
              >
                {['O+ Positive', 'O- Negative', 'A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'AB+ Positive', 'AB- Negative'].map((bt) => (
                  <option key={bt} value={bt} className="bg-white text-[#173E35]">
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 flex items-center justify-between">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-[#173E35] block">
                  Organ Donor Directive
                </label>
                <p className="text-xs text-[#173E35]/80 font-medium">Registered on National Registry</p>
              </div>
              <input
                type="checkbox"
                checked={profile.organDonor}
                onChange={(e) => setProfile({ ...profile, organDonor: e.target.checked })}
                className="w-5 h-5 accent-[#173E35] rounded"
              />
            </div>
          </div>

          {/* Critical Allergies */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold uppercase text-[#CC3B2D] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Critical Allergies (Anaphylaxis Risk)
              </label>
              <span className="text-[10px] text-[#7A5E2E] font-mono font-bold">
                {profile.criticalAllergies.length} Listed
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.criticalAllergies.map((allergy: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-red-50 border border-[#CC3B2D]/40 text-[#CC3B2D] font-bold text-xs flex items-center gap-2"
                >
                  <span>{allergy}</span>
                  <button
                    onClick={() => removeAllergy(idx)}
                    className="text-[#CC3B2D] hover:text-red-900"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
                placeholder="Add allergen (e.g. Latex, Penicillin)..."
                className="flex-1 bg-white border border-[#C4A66B]/30 rounded-xl px-3 py-2 text-xs text-[#173E35] placeholder-[#173E35]/50 focus:outline-none focus:border-[#173E35] shadow-xs"
              />
              <button
                onClick={addAllergy}
                className="px-3.5 py-2 rounded-xl bg-[#173E35] hover:bg-[#0E2721] text-[#F1F0E9] text-xs font-mono font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Active Medications */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold uppercase text-[#173E35] flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-emerald-700" />
                Active Prescriptions & Dosages
              </label>
              <span className="text-[10px] text-[#7A5E2E] font-mono font-bold">
                {profile.currentMedications.length} Prescriptions
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.currentMedications.map((med: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#C4A66B]/30 text-[#173E35] font-semibold text-xs flex items-center gap-2 shadow-xs"
                >
                  <span>{med}</span>
                  <button
                    onClick={() => removeMed(idx)}
                    className="text-[#173E35]/60 hover:text-[#CC3B2D]"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={newMed}
                onChange={(e) => setNewMed(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMed()}
                placeholder="Add medication (e.g. Albuterol 90mcg PRN)..."
                className="flex-1 bg-white border border-[#C4A66B]/30 rounded-xl px-3 py-2 text-xs text-[#173E35] placeholder-[#173E35]/50 focus:outline-none focus:border-[#173E35] shadow-xs"
              />
              <button
                onClick={addMed}
                className="px-3.5 py-2 rounded-xl bg-[#173E35] hover:bg-[#0E2721] text-[#F1F0E9] text-xs font-mono font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Emergency Medical Notes */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase text-[#173E35] block">
              Emergency Directives & Physician Notes
            </label>
            <textarea
              rows={3}
              value={profile.emergencyNotes}
              onChange={(e) => setProfile({ ...profile, emergencyNotes: e.target.value })}
              className="w-full bg-white border border-[#C4A66B]/30 rounded-xl p-3 text-xs text-[#173E35] placeholder-[#173E35]/50 focus:outline-none focus:border-[#173E35] resize-none shadow-xs"
            />
          </div>
        </div>

        {/* Footer Actions with Dedicated Close and Save Buttons */}
        <div className="mt-6 pt-4 border-t border-[#C4A66B]/20 flex items-center justify-between">
          <div className="text-[11px] font-mono text-[#173E35]/80">
            {savedSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved to IndexedDB
              </span>
            ) : (
              <span>Last synced: {new Date(profile.lastUpdated).toLocaleDateString()}</span>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#C4A66B]/40 hover:bg-[#CC3B2D] hover:text-white text-xs font-mono font-bold text-[#173E35] transition-all shadow-xs"
            >
              Close Window
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#173E35] hover:bg-[#0E2721] text-[#F1F0E9] font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
