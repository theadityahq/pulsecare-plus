import React, { useState } from 'react';
import { EMERGENCY_CONTACTS, AED_LOCATIONS } from '../data/mockData';
import { Users, Phone, Zap, Heart, CheckCircle2, Send, MapPin, Shield } from 'lucide-react';

export const CommunityAndContacts: React.FC = () => {
  const [contacts, setContacts] = useState(EMERGENCY_CONTACTS);
  const [testSentId, setTestSentId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const sendTestAlert = (id: string, name: string) => {
    setTestSentId(id);
    setTimeout(() => {
      setTestSentId(null);
      setFeedbackMsg(`✓ Simulated verification SMS dispatched to ${name}.`);
      setTimeout(() => setFeedbackMsg(null), 3500);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Emergency Contacts Panel */}
      <div className="clinic-panel rounded-3xl p-6 border border-[#C7AE7B]/25 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4F0E6]/10">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#C7AE7B] uppercase tracking-wider block">
              Trusted Care Circle
            </span>
            <h3 className="text-base font-bold text-[#F4F0E6] mt-0.5">Emergency Contacts Network</h3>
          </div>
          <span className="text-xs font-mono text-[#C7AE7B] bg-[#0E2720] px-2.5 py-1 rounded-full border border-[#C7AE7B]/30">
            {contacts.length} Configured
          </span>
        </div>

        {feedbackMsg && (
          <div className="p-3 rounded-xl bg-[#163C32] border border-[#C7AE7B]/40 text-xs text-emerald-400 font-mono">
            {feedbackMsg}
          </div>
        )}

        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-2xl bg-[#0E2720]/80 border border-[#F4F0E6]/10 hover:border-[#C7AE7B]/40 flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    contact.isPrimary
                      ? 'bg-[#163C32] text-[#C7AE7B] border border-[#C7AE7B]/40'
                      : 'bg-[#163C32]/50 text-[#F4F0E6]/60'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#F4F0E6]">{contact.name}</h4>
                    {contact.isPrimary && (
                      <span className="text-[9px] font-mono font-bold bg-[#163C32] text-[#C7AE7B] border border-[#C7AE7B]/30 px-1.5 py-0.5 rounded">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#F4F0E6]/70 mt-0.5">
                    {contact.relationship} • {contact.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => sendTestAlert(contact.id, contact.name)}
                  disabled={testSentId === contact.id}
                  className="px-2.5 py-1.5 rounded-xl bg-[#163C32] hover:bg-[#1D4A3E] border border-[#C7AE7B]/30 text-[#F4F0E6] text-xs font-mono transition-colors flex items-center gap-1"
                  title="Simulate SMS Alert"
                >
                  <Send className={`w-3 h-3 ${testSentId === contact.id ? 'animate-spin text-[#C7AE7B]' : ''}`} />
                  <span className="hidden sm:inline">Test Alert</span>
                </button>
                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="p-2 rounded-xl bg-[#F4F0E6] text-[#1D2521] hover:bg-white transition-colors"
                  title="Call Contact"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community AED Beacons */}
      <div className="clinic-panel rounded-3xl p-6 border border-[#C7AE7B]/25 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4F0E6]/10">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#C7AE7B] uppercase tracking-wider block">
              Civic First-Aid Network
            </span>
            <h3 className="text-base font-bold text-[#F4F0E6] mt-0.5">Public AED Defibrillator Beacons</h3>
          </div>
          <span className="text-xs font-mono text-[#C7AE7B] bg-[#0E2720] border border-[#C7AE7B]/30 px-2.5 py-0.5 rounded-full">
            Delhi Transit Registry
          </span>
        </div>

        <div className="space-y-3">
          {AED_LOCATIONS.map((aed) => (
            <div
              key={aed.id}
              className="p-4 rounded-2xl bg-[#0E2720]/80 border border-[#F4F0E6]/10 flex items-start justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-[#163C32] text-[#C7AE7B] border border-[#C7AE7B]/30 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F4F0E6]">{aed.name}</h4>
                  <p className="text-[11px] text-[#F4F0E6]/70 mt-0.5">{aed.locationDetails}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono text-emerald-400 bg-[#163C32] px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {aed.accessStatus}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-[#FF8A7A] block">
                  {aed.distance}
                </span>
                <span className="text-[10px] text-[#C7AE7B] font-mono">Walk</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
