import React, { useState } from 'react';
import { EMERGENCY_CONTACTS, AED_LOCATIONS } from '../data/mockData';
import { Users, Phone, Zap, Heart, CheckCircle2, Send, MapPin, Shield } from 'lucide-react';

export const CommunityAndContacts: React.FC = () => {
  const [contacts, setContacts] = useState(EMERGENCY_CONTACTS);
  const [testSentId, setTestSentId] = useState<string | null>(null);

  const sendTestAlert = (id: string, name: string) => {
    setTestSentId(id);
    setTimeout(() => {
      setTestSentId(null);
      alert(`[SIMULATION]: Verified test notification sent to ${name}. Telemetry & Medical ID links delivered.`);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Emergency Contacts Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Trusted SOS Circle
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">Emergency Contacts Network</h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            {contacts.length} Active
          </span>
        </div>

        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${contact.isPrimary ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{contact.name}</h4>
                    {contact.isPrimary && (
                      <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{contact.relationship} • {contact.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => sendTestAlert(contact.id, contact.name)}
                  disabled={testSentId === contact.id}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1"
                  title="Simulate SMS Alert"
                >
                  <Send className={`w-3 h-3 ${testSentId === contact.id ? 'animate-spin text-cyan-400' : ''}`} />
                  <span className="hidden sm:inline">Test Alert</span>
                </button>
                <a
                  href={`tel:${contact.phone}`}
                  className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
                  title="Call Contact"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community AED Beacons & Blood Bank */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              Civic Defense Network
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">Verified AED Defibrillator Beacons</h3>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded">
            Public Registry
          </span>
        </div>

        <div className="space-y-3">
          {AED_LOCATIONS.map((aed) => (
            <div
              key={aed.id}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{aed.name}</h4>
                  <p className="text-[11px] text-slate-400">{aed.locationDetails}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {aed.accessStatus}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-amber-300 bg-slate-950 px-2 py-1 rounded border border-amber-500/30">
                  {aed.distance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
