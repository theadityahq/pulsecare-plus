import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Lock,
  Unlock,
  ShieldCheck,
  Heart,
  AlertOctagon,
  Phone,
  UserCheck,
  FileText,
  Download,
  Eye,
  KeyRound,
  X,
  Upload,
  HardDrive,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { SIMULATED_USER, EMERGENCY_CONTACTS, MEDICAL_RECORDS } from '../data/mockData';
import {
  exportEncryptedBackup,
  importEncryptedBackup,
  getStorageInspectSummary,
  deleteAccountData
} from '../services/db';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accountId?: string;
}

export const MedicalIDCard: React.FC<Props> = ({ isOpen, onClose, accountId = 'local-default' }) => {
  const [activeTab, setActiveTab] = useState<'triage' | 'vault' | 'storage'>('triage');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [vaultUnlocked, setVaultUnlocked] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [passphraseError, setPassphraseError] = useState<string | null>(null);

  // Storage breakdown state
  const [storageInfo, setStorageInfo] = useState<{
    profileExists: boolean;
    recordsCount: number;
    contactsCount: number;
    estimatedBytes: number;
  } | null>(null);

  const [backupNotice, setBackupNotice] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Generate dynamic QR code in authentic Warm Ivory / Charcoal
  useEffect(() => {
    const triagePayload = `PULSECARE-PASS: ${SIMULATED_USER.name} | ${SIMULATED_USER.bloodType} | Allergies: ${SIMULATED_USER.criticalAllergies.join(', ')} | Emergency: +91 98765 43210`;
    QRCode.toDataURL(
      triagePayload,
      {
        width: 200,
        margin: 2,
        color: {
          dark: '#18231F',
          light: '#F1F0E9'
        }
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (activeTab === 'storage') {
      getStorageInspectSummary(accountId).then(setStorageInfo);
    }
  }, [activeTab, accountId]);

  if (!isOpen) return null;

  const handleUnlockVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim().length >= 4) {
      setVaultUnlocked(true);
      setPassphraseError(null);
    } else {
      setPassphraseError('Passphrase must be at least 4 characters.');
    }
  };

  const handleExportBackup = async () => {
    try {
      const pass = prompt('Enter an encryption passphrase for this offline backup file:');
      if (!pass || pass.length < 4) {
        alert('Backup requires a passphrase of at least 4 characters.');
        return;
      }
      const backupJson = await exportEncryptedBackup(accountId, pass);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pulsecare-backup-${new Date().toISOString().slice(0, 10)}.pcpass`;
      a.click();
      URL.revokeObjectURL(url);
      setBackupNotice('✓ Encrypted backup exported successfully.');
      setTimeout(() => setBackupNotice(null), 3000);
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    }
  };

  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pcpass,.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const pass = prompt('Enter the decryption passphrase for this backup:');
      if (!pass) return;

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const content = reader.result as string;
          await importEncryptedBackup(content, pass, accountId);
          setBackupNotice('✓ Backup imported and verified into IndexedDB.');
          setTimeout(() => setBackupNotice(null), 3000);
        } catch (err: any) {
          alert(`Restore failed: ${err.message}`);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleDeleteAll = async () => {
    await deleteAccountData(accountId);
    setConfirmDelete(false);
    setBackupNotice('✓ All local data deleted from this browser profile.');
    setTimeout(() => setBackupNotice(null), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173E35]/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="medical-id-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 border-2 border-[#C4A66B]/40 max-h-[90vh] overflow-y-auto shadow-2xl text-[#173E35]">
        
        {/* Header with Title, Close Button, and Dual-Tier Tab Switcher */}
        <div className="flex flex-col gap-4 pb-4 border-b border-[#C4A66B]/25">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase tracking-wider block">
                Dual-Tier Health Passport
              </span>
              <h2 id="medical-id-title" className="text-base sm:text-lg font-black text-[#173E35] tracking-tight">
                Emergency Medical ID & Encrypted Vault
              </h2>
            </div>

            {/* Dedicated Top-Right Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] transition-all border border-[#C4A66B]/40 shadow-md flex items-center justify-center group"
              aria-label="Close medical ID dialog"
              title="Close dialog"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <div className="flex bg-[#FAF8F5] p-1 rounded-2xl border border-[#C4A66B]/30 self-start">
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'triage'
                  ? 'bg-[#173E35] text-[#F1F0E9] font-bold border border-[#C4A66B]/40 shadow-sm'
                  : 'text-[#173E35] hover:bg-white'
              }`}
            >
              Public Triage
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'vault'
                  ? 'bg-[#173E35] text-[#F1F0E9] font-bold border border-[#C4A66B]/40 shadow-sm'
                  : 'text-[#173E35] hover:bg-white'
              }`}
            >
              {vaultUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-[#7A5E2E]" />}
              <span>Encrypted Vault</span>
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'storage'
                  ? 'bg-[#173E35] text-[#F1F0E9] font-bold border border-[#C4A66B]/40 shadow-sm'
                  : 'text-[#173E35] hover:bg-white'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-[#7A5E2E]" />
              <span>Storage</span>
            </button>
          </div>
        </div>

        {/* Global Action feedback notice */}
        {backupNotice && (
          <div className="my-3 p-3 rounded-xl bg-emerald-50 border border-emerald-500/40 text-xs font-mono text-emerald-800 font-bold">
            {backupNotice}
          </div>
        )}

        {/* TAB 1: Public Emergency Triage Card */}
        {activeTab === 'triage' && (
          <div className="py-4 space-y-5">
            <div className="p-3.5 rounded-2xl bg-[#173E35]/70 border border-[#C4A66B]/25 flex items-center space-x-2.5 text-xs text-[#F1F0E9]/90">
              <ShieldCheck className="w-5 h-5 text-[#C4A66B] shrink-0" />
              <p className="text-[11px] leading-relaxed">
                <strong>Zero-Auth Emergency Access:</strong> Paramedics and bystanders can scan this QR code without passwords to read life-critical allergies and emergency contacts immediately.
              </p>
            </div>

            {/* Printable Emergency Passport Card */}
            <div className="rounded-3xl p-6 bg-[#F1F0E9] text-[#18231F] border-2 border-[#C4A66B] shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#18231F]/15">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA3B2E] font-bold block">
                    EMERGENCY MEDICAL IDENTIFICATION
                  </span>
                  <h3 className="text-xl font-black text-[#18231F] mt-0.5">{SIMULATED_USER.name}</h3>
                  <p className="text-xs text-[#18231F]/75">
                    DOB: {SIMULATED_USER.dob} (Age {SIMULATED_USER.age})
                  </p>
                </div>

                {/* QR Code in Warm Ivory / Charcoal */}
                {qrDataUrl && (
                  <div className="p-2 rounded-2xl bg-white border border-[#C4A66B]/40 shadow-inner flex flex-col items-center shrink-0">
                    <img src={qrDataUrl} alt="Emergency Medical Triage QR Code" className="w-28 h-28 rounded-lg" />
                    <span className="text-[9px] font-mono text-[#18231F]/70 mt-1 uppercase font-bold">
                      Scan in Emergency
                    </span>
                  </div>
                )}
              </div>

              {/* Critical Triage Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/70 border border-[#18231F]/10">
                  <span className="text-[10px] font-mono text-[#BA3B2E] font-bold uppercase block mb-1">
                    BLOOD GROUP
                  </span>
                  <span className="text-base font-black text-[#18231F]">{SIMULATED_USER.bloodType}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/70 border border-[#18231F]/10">
                  <span className="text-[10px] font-mono text-[#18231F]/70 font-bold uppercase block mb-1">
                    ORGAN DONOR STATUS
                  </span>
                  <span className="text-sm font-bold text-emerald-800">
                    {SIMULATED_USER.organDonor ? 'Yes (Self-Declared)' : 'No'}
                  </span>
                </div>
              </div>

              {/* Lethal Allergies Warning */}
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                <span className="text-[10px] font-mono text-[#BA3B2E] font-bold uppercase block mb-1">
                  CRITICAL ALLERGIES (ANAPHYLAXIS RISK)
                </span>
                <p className="font-bold text-rose-950">
                  {SIMULATED_USER.criticalAllergies.join(' • ')}
                </p>
              </div>

              {/* Emergency Contacts */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-mono text-[#18231F]/70 font-bold uppercase block">
                  EMERGENCY CONTACTS
                </span>
                {EMERGENCY_CONTACTS.slice(0, 2).map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-white/60 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#18231F]">{c.name}</span>
                      <span className="text-[10px] text-[#18231F]/60 block">{c.relationship}</span>
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-[#173E35] text-[#F1F0E9] text-xs font-mono font-bold"
                    >
                      {c.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Print & Download Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#C4A66B] font-mono">
                Store as Lockscreen or Print for Wallet
              </span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#F1F0E9] hover:bg-white text-[#18231F] text-xs font-bold font-mono flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Wallet Pass</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Encrypted Vault */}
        {activeTab === 'vault' && (
          <div className="py-4 space-y-5">
            {!vaultUnlocked ? (
              <form onSubmit={handleUnlockVault} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 text-center max-w-md mx-auto space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[#173E35] border border-[#C4A66B]/40 text-[#F1F0E9] flex items-center justify-center mx-auto shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#173E35]">Unlock Encrypted Health Records</h4>
                  <p className="text-xs text-[#173E35]/75 mt-1 font-medium">
                    Client-side Web Crypto AES-GCM decryption with PBKDF2 key derivation.
                  </p>
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter vault passphrase (min 4 chars)..."
                    className="w-full bg-white border border-[#C4A66B]/30 rounded-xl p-2.5 text-xs text-[#173E35] focus:outline-none focus:border-[#173E35] text-center shadow-xs"
                  />
                  {passphraseError && (
                    <p className="text-xs text-[#CC3B2D] font-bold">{passphraseError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#173E35] hover:bg-[#0E2721] text-[#F1F0E9] font-bold text-xs shadow-md transition-all"
                >
                  Decrypt & Unlock Vault
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#C4A66B]/20">
                  <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
                    <Unlock className="w-3.5 h-3.5" /> Vault Decrypted (AES-GCM 256)
                  </span>
                  <button
                    onClick={() => setVaultUnlocked(false)}
                    className="text-xs text-[#173E35] hover:text-[#CC3B2D] hover:underline font-mono font-bold"
                  >
                    Lock Vault
                  </button>
                </div>

                <div className="space-y-3">
                  {MEDICAL_RECORDS.map((rec) => (
                    <div key={rec.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#7A5E2E] font-bold uppercase">
                          {rec.category} • {rec.date}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">Zero-Knowledge Validated</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#173E35]">{rec.title}</h4>
                      <p className="text-xs text-[#173E35]/80">{rec.summary}</p>
                      <p className="text-[10px] text-[#7A5E2E] font-mono pt-1">Physician: {rec.doctor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Local Storage & Backup Management */}
        {activeTab === 'storage' && (
          <div className="py-4 space-y-5">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-3 shadow-xs">
              <h4 className="text-xs font-mono font-bold uppercase text-[#173E35] tracking-wider">
                What is stored on this device?
              </h4>
              <p className="text-xs text-[#173E35]/80 leading-relaxed">
                PulseCare+ is a local-first application. Your health records and emergency contacts are stored in your browser's IndexedDB database (<code className="text-[#173E35] font-bold">pulsecare_local_db</code>). Browser storage is local to this computer and browser profile; clearing site data in browser settings will remove local records unless exported to an encrypted backup.
              </p>
              {storageInfo && (
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#C4A66B]/30 shadow-xs">
                    <span className="text-[10px] text-[#7A5E2E] block font-mono font-bold">RECORDS</span>
                    <span className="font-bold text-[#173E35] text-sm">{storageInfo.recordsCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#C4A66B]/30 shadow-xs">
                    <span className="text-[10px] text-[#7A5E2E] block font-mono font-bold">CONTACTS</span>
                    <span className="font-bold text-[#173E35] text-sm">{storageInfo.contactsCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#C4A66B]/30 shadow-xs">
                    <span className="text-[10px] text-[#7A5E2E] block font-mono font-bold">DATA SIZE</span>
                    <span className="font-bold text-[#173E35] text-sm">~{Math.round(storageInfo.estimatedBytes / 1024)} KB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Backup & Restore Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportBackup}
                className="p-3.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#C4A66B]/30 text-left transition-all flex items-center space-x-3 shadow-xs group"
              >
                <Download className="w-5 h-5 text-[#173E35] shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-[#173E35]">Export Encrypted Backup</h5>
                  <p className="text-[10px] text-[#173E35]/70">Password-protected .pcpass file</p>
                </div>
              </button>

              <button
                onClick={handleImportBackup}
                className="p-3.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#C4A66B]/30 text-left transition-all flex items-center space-x-3 shadow-xs group"
              >
                <Upload className="w-5 h-5 text-[#173E35] shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-[#173E35]">Restore from Backup</h5>
                  <p className="text-[10px] text-[#173E35]/70">Decrypt & restore into IndexedDB</p>
                </div>
              </button>
            </div>

            {/* Confirmed Delete Local Data */}
            <div className="p-4 rounded-2xl bg-red-50 border border-[#CC3B2D]/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#CC3B2D]">Delete All Local Health Data</h5>
                  <p className="text-[10px] text-[#CC3B2D]/80">
                    Irrevocably deletes profile, vault, and contacts from this browser.
                  </p>
                </div>
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-[#CC3B2D]/50 text-[#CC3B2D] hover:bg-[#CC3B2D] hover:text-white text-xs font-mono font-bold transition-all shadow-xs"
                  >
                    Delete Data
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-2.5 py-1 rounded-xl bg-white border border-[#173E35]/30 text-xs text-[#173E35] font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAll}
                      className="px-3 py-1 rounded-xl bg-[#CC3B2D] text-white text-xs font-bold font-mono shadow-sm"
                    >
                      Confirm Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer with Dedicated Close Button */}
        <div className="mt-6 pt-4 border-t border-[#C4A66B]/20 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#7A5E2E] font-bold">
            Local-First Zero-Knowledge Architecture
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] text-xs font-mono font-bold transition-all shadow-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
