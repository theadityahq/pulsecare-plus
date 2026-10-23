import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  Heart,
  Pill,
  Shield,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Cpu,
  Info,
  Save
} from 'lucide-react';
import { UserProfile, getLocalProfile, saveLocalProfile } from '../services/db';
import { SIMULATED_USER } from '../data/mockData';

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
    name: SIMULATED_USER.name,
    age: SIMULATED_USER.age,
    dob: SIMULATED_USER.dob,
    bloodType: SIMULATED_USER.bloodType,
    organDonor: SIMULATED_USER.organDonor,
    criticalAllergies: [...SIMULATED_USER.criticalAllergies],
    chronicConditions: [...SIMULATED_USER.chronicConditions],
    currentMedications: [...SIMULATED_USER.currentMedications],
    emergencyNotes: SIMULATED_USER.emergencyNotes,
    insurance: { ...SIMULATED_USER.insurance },
    lastUpdated: new Date().toISOString()
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMed, setNewMed] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    getLocalProfile(accountId).then((stored) => {
      if (stored) {
        setProfile(stored);
      }
    });
  }, [isOpen, accountId]);

  if (!isOpen) return null;

  const handleSave = async () => {
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
      criticalAllergies: profile.criticalAllergies.filter((_, i) => i !== index)
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
      currentMedications: profile.currentMedications.filter((_, i) => i !== index)
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2721]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="relative w-full max-w-2xl clinic-panel-elevated rounded-3xl p-6 md:p-8 border border-[#C4A66B]/40 max-h-[88vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F0E9]/10">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#C4A66B]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="profile-modal-title" className="text-base font-bold text-[#F1F0E9]">
                Emergency Health Profile & Directives
              </h3>
              <p className="text-xs text-[#C4A66B] font-mono">
                Stored in Local IndexedDB on this Device
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#F1F0E9]/60 hover:text-[#F1F0E9] hover:bg-[#173E35] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Truthful Device Integration Notice (No false ECG/SpO2 claims) */}
        <div className="my-4 p-4 rounded-2xl bg-[#173E35]/70 border border-[#C4A66B]/25 flex items-start space-x-3 text-xs text-[#F1F0E9]/90">
          <Cpu className="w-5 h-5 text-[#C4A66B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#C4A66B] block font-mono">
              Hardware Sensor Policy Notice
            </span>
            <p className="text-[11px] leading-relaxed text-[#F1F0E9]/80">
              PulseCare+ does not estimate, simulate, or fabricate vital signs (ECG, SpO2, heart rate) using software alone. Clinical biometrics require authorized external medical sensors. Direct Bluetooth Health Device Profile (HDP) synchronization is supported in native medical client builds.
            </p>
          </div>
        </div>

        {/* Core Medical Details */}
        <div className="space-y-5">
          
          {/* Blood Type & Donor Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#0E2721]/80 border border-[#F1F0E9]/10 space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase text-[#C4A66B] block">
                Blood Group (Verified)
              </label>
              <select
                value={profile.bloodType}
                onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                className="w-full bg-[#173E35] border border-[#C4A66B]/30 rounded-xl p-2.5 text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C4A66B]"
              >
                {['O+ Positive', 'O- Negative', 'A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'AB+ Positive', 'AB- Negative'].map((bt) => (
                  <option key={bt} value={bt} className="bg-[#0E2721]">
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E2721]/80 border border-[#F1F0E9]/10 flex items-center justify-between">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase text-[#C4A66B] block">
                  Organ Donor Directive
                </label>
                <p className="text-xs text-[#F1F0E9]">Registered on National Registry</p>
              </div>
              <input
                type="checkbox"
                checked={profile.organDonor}
                onChange={(e) => setProfile({ ...profile, organDonor: e.target.checked })}
                className="w-5 h-5 accent-[#C4A66B] rounded"
              />
            </div>
          </div>

          {/* Critical Allergies */}
          <div className="p-4 rounded-2xl bg-[#0E2721]/80 border border-[#F1F0E9]/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold uppercase text-[#F79488] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Critical Allergies (Anaphylaxis Risk)
              </label>
              <span className="text-[10px] text-[#C4A66B] font-mono">
                {profile.criticalAllergies.length} Listed
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.criticalAllergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-[#173E35] border border-[#D44A3C]/40 text-[#F1F0E9] text-xs flex items-center gap-2"
                >
                  <span>{allergy}</span>
                  <button
                    onClick={() => removeAllergy(idx)}
                    className="text-[#F79488] hover:text-white"
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
                className="flex-1 bg-[#173E35] border border-[#C4A66B]/30 rounded-xl px-3 py-2 text-xs text-[#F1F0E9] placeholder-[#F1F0E9]/50 focus:outline-none focus:border-[#C4A66B]"
              />
              <button
                onClick={addAllergy}
                className="px-3 py-2 rounded-xl bg-[#173E35] border border-[#C4A66B]/40 hover:border-[#C4A66B] text-[#C4A66B] text-xs font-mono flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Active Medications */}
          <div className="p-4 rounded-2xl bg-[#0E2721]/80 border border-[#F1F0E9]/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold uppercase text-[#C4A66B] flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5" />
                Active Prescriptions & Dosages
              </label>
              <span className="text-[10px] text-[#C4A66B] font-mono">
                {profile.currentMedications.length} Prescriptions
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.currentMedications.map((med, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-[#173E35] border border-[#C4A66B]/30 text-[#F1F0E9] text-xs flex items-center gap-2"
                >
                  <span>{med}</span>
                  <button
                    onClick={() => removeMed(idx)}
                    className="text-[#C4A66B] hover:text-white"
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
                className="flex-1 bg-[#173E35] border border-[#C4A66B]/30 rounded-xl px-3 py-2 text-xs text-[#F1F0E9] placeholder-[#F1F0E9]/50 focus:outline-none focus:border-[#C4A66B]"
              />
              <button
                onClick={addMed}
                className="px-3 py-2 rounded-xl bg-[#173E35] border border-[#C4A66B]/40 hover:border-[#C4A66B] text-[#C4A66B] text-xs font-mono flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Emergency Medical Notes */}
          <div className="p-4 rounded-2xl bg-[#0E2721]/80 border border-[#F1F0E9]/10 space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase text-[#C4A66B] block">
              Emergency Directives & Physician Notes
            </label>
            <textarea
              rows={3}
              value={profile.emergencyNotes}
              onChange={(e) => setProfile({ ...profile, emergencyNotes: e.target.value })}
              className="w-full bg-[#173E35] border border-[#C4A66B]/30 rounded-xl p-3 text-xs text-[#F1F0E9] placeholder-[#F1F0E9]/50 focus:outline-none focus:border-[#C4A66B] resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#F1F0E9]/10 flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#C4A66B]">
            {savedSuccess ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved to IndexedDB
              </span>
            ) : (
              <span>Last synced: {new Date(profile.lastUpdated).toLocaleDateString()}</span>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#173E35] border border-[#C4A66B]/30 hover:border-[#C4A66B] text-xs text-[#F1F0E9]"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#F1F0E9] hover:bg-white text-[#18231F] font-bold text-xs flex items-center gap-1.5 shadow"
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
