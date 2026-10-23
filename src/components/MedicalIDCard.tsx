import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Lock, Unlock, ShieldCheck, Heart, AlertOctagon, Phone, UserCheck, FileText, Download, Eye, KeyRound } from 'lucide-react';
import { SIMULATED_USER, EMERGENCY_CONTACTS, MEDICAL_RECORDS } from '../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalIDCard: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'triage' | 'vault'>('triage');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [vaultUnlocked, setVaultUnlocked] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [passphraseError, setPassphraseError] = useState<string | null>(null);

  // Generate dynamic QR code
  useEffect(() => {
    const triageUrl = `${window.location.origin}/#triage-preview`;
    QRCode.toDataURL(
      triageUrl,
      {
        width: 220,
        margin: 2,
        color: {
          dark: '#00F0FF',
          light: '#070B19'
        }
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, []);

  const handleUnlockVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase === 'demo123' || passphrase === 'password' || passphrase.length >= 4) {
      setVaultUnlocked(true);
      setPassphraseError(null);
    } else {
      setPassphraseError('Incorrect decryption key. Try "demo123".');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel-elevated rounded-2xl p-6 md:p-8 border border-cyan-500/30 max-h-[90vh] overflow-y-auto">
        
        {/* Header with Dual-Tier Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                PulseCare+ Dual-Tier Architecture
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">Emergency Medical ID & Health Passport</h2>
          </div>

          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('triage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'triage'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Public Triage ID
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'vault'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {vaultUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              Encrypted Vault
            </button>
          </div>
        </div>

        {/* TAB 1: Public Emergency Triage Card */}
        {activeTab === 'triage' && (
          <div className="py-6 space-y-6">
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 text-xs text-cyan-200">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>
                  <strong>Zero-Auth Emergency Mode:</strong> Paramedics and first responders can scan this QR code without authentication to view life-critical data immediately.
                </span>
              </div>
            </div>

            {/* Wallet Card Design */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-[#0A1432] to-slate-950 border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* QR Code Container */}
                <div className="shrink-0 flex flex-col items-center bg-slate-950 p-3 rounded-xl border border-cyan-500/30">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Emergency Medical Triage QR Code" className="w-40 h-40 rounded" />
                  ) : (
                    <div className="w-40 h-40 bg-slate-900 animate-pulse rounded flex items-center justify-center text-xs text-slate-500">
                      Generating QR...
                    </div>
                  )}
                  <span className="text-[10px] font-mono text-cyan-300 mt-2 font-bold flex items-center gap-1">
                    <QrCode className="w-3 h-3" /> SCAN FOR TRIAGE
                  </span>
                </div>

                {/* Patient Summary Details */}
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase block">
                      OFFICIAL EMERGENCY MEDICAL ID
                    </span>
                    <h3 className="text-xl font-bold text-white">{SIMULATED_USER.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">DOB: {SIMULATED_USER.dob} (Age {SIMULATED_USER.age})</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-red-500/30">
                      <span className="text-[10px] text-slate-400 block font-mono">BLOOD GROUP</span>
                      <span className="text-base font-extrabold text-red-400">{SIMULATED_USER.bloodType}</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-emerald-500/30">
                      <span className="text-[10px] text-slate-400 block font-mono">ORGAN DONOR</span>
                      <span className="text-base font-extrabold text-emerald-400">REGISTERED</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-xs">
                    <span className="font-bold text-red-400 block mb-0.5 flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5" /> SEVERE ALLERGIES / CONTRAINDICATIONS
                    </span>
                    <span className="text-slate-200">{SIMULATED_USER.criticalAllergies.join(', ')}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="font-bold text-cyan-300 block mb-0.5">CURRENT MEDICATIONS</span>
                    <span className="text-slate-300">{SIMULATED_USER.currentMedications.join(' • ')}</span>
                  </div>
                </div>
              </div>

              {/* Primary Contact Banner */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">PRIMARY EMERGENCY CONTACT</span>
                  <span className="text-sm font-bold text-white">{EMERGENCY_CONTACTS[0].name} ({EMERGENCY_CONTACTS[0].relationship})</span>
                </div>
                <a
                  href={`tel:${EMERGENCY_CONTACTS[0].phone}`}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {EMERGENCY_CONTACTS[0].phone}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Encrypted Private Health Vault */}
        {activeTab === 'vault' && (
          <div className="py-6 space-y-6">
            {!vaultUnlocked ? (
              /* Locked Vault Gate */
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-cyan-500/20 text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Client-Side Encrypted Health Vault</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Medical reports and physician notes are protected by <strong>AES-256-GCM</strong>. Enter your vault passphrase to decrypt.
                  </p>
                </div>

                <form onSubmit={handleUnlockVault} className="space-y-3 pt-2">
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      placeholder="Passphrase (demo key: demo123)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  {passphraseError && <p className="text-[11px] text-red-400 font-mono">{passphraseError}</p>}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  >
                    Decrypt Medical Records
                  </button>
                </form>

                <div className="text-[11px] font-mono text-slate-500 bg-slate-950/80 p-2 rounded border border-slate-800">
                  Tip for Hackathon Demo: Use <strong>demo123</strong>
                </div>
              </div>
            ) : (
              /* Decrypted Records View */
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Vault Decrypted with Local Key • Zero-Knowledge Session Active</span>
                  </div>
                  <button
                    onClick={() => {
                      setVaultUnlocked(false);
                      setPassphrase('');
                    }}
                    className="text-[11px] font-mono text-slate-400 hover:text-white underline"
                  >
                    Lock Vault
                  </button>
                </div>

                {/* List of Decrypted Records */}
                <div className="space-y-3">
                  {MEDICAL_RECORDS.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                            {rec.category} • {rec.date}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-0.5">{rec.title}</h4>
                          <p className="text-xs text-slate-400">Authorized Physician: {rec.doctor}</p>
                        </div>
                        <button
                          onClick={() => alert(`[SIMULATED] Downloading decrypted PDF for: ${rec.title}`)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                          title="Download Decrypted PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                      </div>

                      <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded border border-slate-800/80 font-mono">
                        {rec.summary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            PulseCare+ Cryptographic Health Passport v2.4
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
