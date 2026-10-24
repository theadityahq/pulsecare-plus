import React, { useState } from 'react';
import { EMERGENCY_CONTACTS, AED_LOCATIONS } from '../data/mockData';
import { Users, Phone, Zap, Send, X } from 'lucide-react';

interface Props {
  onClose?: () => void;
}

export const CommunityAndContacts: React.FC<Props> = ({ onClose }) => {
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
    <div className="space-y-6 text-[#173E35]">
      {/* Top Banner with Close Tab */}
      <div className="bg-white rounded-3xl p-5 border-2 border-[#C4A66B]/35 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase tracking-wider block">
            Civic Resilience & Trusted Care
          </span>
          <h3 className="text-base font-black text-[#173E35] mt-0.5">Community Network & Emergency Dispatch</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] transition-all border border-[#C4A66B]/40 shadow-md flex items-center gap-1.5 text-xs font-bold"
            aria-label="Close Tab"
            title="Close Community Network"
          >
            <X className="w-4 h-4" />
            <span>Close Tab</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Contacts Panel */}
        <div className="bg-white rounded-3xl p-6 md:p-7 border-2 border-[#C4A66B]/35 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#C4A66B]/25">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase tracking-wider block">
                Trusted Care Circle
              </span>
              <h3 className="text-base font-black text-[#173E35] mt-0.5">Emergency Contacts Network</h3>
            </div>
            <span className="text-xs font-mono text-[#7A5E2E] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#C4A66B]/40 font-bold">
              {contacts.length} Configured
            </span>
          </div>

          {feedbackMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-mono font-bold">
              {feedbackMsg}
            </div>
          )}

          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/35 hover:border-[#173E35]/50 flex items-center justify-between gap-3 transition-colors shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      contact.isPrimary
                        ? 'bg-[#173E35] text-[#F1F0E9] shadow-xs'
                        : 'bg-white text-[#173E35] border border-[#C4A66B]/40'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-[#173E35]">{contact.name}</h4>
                      {contact.isPrimary && (
                        <span className="text-[9px] font-mono font-black bg-[#CC3B2D] text-white px-2 py-0.5 rounded-full shadow-xs">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#173E35]/75 mt-0.5 font-medium">
                      {contact.relationship} • {contact.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => sendTestAlert(contact.id, contact.name)}
                    disabled={testSentId === contact.id}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#C4A66B]/40 text-[#173E35] text-xs font-mono font-bold transition-colors flex items-center gap-1 shadow-xs"
                    title="Simulate SMS Alert"
                  >
                    <Send className={`w-3 h-3 ${testSentId === contact.id ? 'animate-spin text-[#CC3B2D]' : 'text-[#173E35]'}`} />
                    <span className="hidden sm:inline">Test Alert</span>
                  </button>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-2 rounded-xl bg-[#173E35] hover:bg-[#1F4D43] text-[#F1F0E9] transition-colors shadow-xs"
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
        <div className="bg-white rounded-3xl p-6 md:p-7 border-2 border-[#C4A66B]/35 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#C4A66B]/25">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase tracking-wider block">
                Civic First-Aid Network
              </span>
              <h3 className="text-base font-black text-[#173E35] mt-0.5">Public AED Defibrillator Beacons</h3>
            </div>
            <span className="text-xs font-mono text-[#7A5E2E] bg-[#FAF8F5] border border-[#C4A66B]/40 px-3 py-0.5 rounded-full font-bold">
              Delhi Transit Registry
            </span>
          </div>

          <div className="space-y-3">
            {AED_LOCATIONS.map((aed) => (
              <div
                key={aed.id}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/35 flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#173E35] text-[#F1F0E9] shrink-0 mt-0.5 shadow-xs">
                    <Zap className="w-4 h-4 text-[#C4A66B]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#173E35]">{aed.name}</h4>
                    <p className="text-[11px] text-[#173E35]/75 mt-0.5 font-medium">{aed.locationDetails}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 font-bold">
                      {aed.accessStatus}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-black text-[#CC3B2D] block">
                    {aed.distance}
                  </span>
                  <span className="text-[10px] text-[#7A5E2E] font-mono font-semibold">Walk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
