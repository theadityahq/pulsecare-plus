import React, { useState } from 'react';
import { EMERGENCY_CONTACTS, AED_LOCATIONS } from '../data/mockData';
import { Users, Phone, Zap, MessageSquare, X } from 'lucide-react';

interface Props {
  onClose?: () => void;
}

export const CommunityAndContacts: React.FC<Props> = ({ onClose }) => {
  const [contacts] = useState(EMERGENCY_CONTACTS);

  return (
    <div className="space-y-6 text-[#1D2521]">
      {/* Top Banner with Close Tab */}
      <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-[#C4A66B]/35 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase tracking-wider block">
            Civic Emergency Readiness
          </span>
          <h3 className="text-base font-black text-[#163C32] mt-0.5">Emergency Contacts & Verified AED Registry</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#163C32] text-[#F1F0E9] hover:bg-[#B82819] transition-all border border-[#C4A66B]/40 shadow-md flex items-center gap-1.5 text-xs font-bold"
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
        <div className="bg-[#FAF8F5] rounded-3xl p-6 md:p-7 border border-[#C4A66B]/35 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#C4A66B]/25">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase tracking-wider block">
                Trusted In Case of Emergency (I.C.E.)
              </span>
              <h3 className="text-base font-black text-[#163C32] mt-0.5">Designated Emergency Contacts</h3>
            </div>
            <span className="text-xs font-mono text-[#7A5E2E] bg-[#F1F0E9] px-3 py-1 rounded-full border border-[#C4A66B]/40 font-bold">
              {contacts.length} Configured
            </span>
          </div>

          <div className="space-y-3">
            {contacts.map((contact) => {
              const cleanPhone = contact.phone.replace(/[^0-9+]/g, '');
              const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(
                `PulseCare+ Alert: I am reaching out regarding an emergency situation. Please check in with me.`
              )}`;

              return (
                <div
                  key={contact.id}
                  className="p-4 rounded-2xl bg-white border border-[#C4A66B]/35 hover:border-[#163C32]/50 flex items-center justify-between gap-3 transition-colors shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        contact.isPrimary
                          ? 'bg-[#163C32] text-[#F1F0E9] shadow-xs'
                          : 'bg-[#F1F0E9] text-[#163C32] border border-[#C4A66B]/40'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-[#163C32]">{contact.name}</h4>
                        {contact.isPrimary && (
                          <span className="text-[9px] font-mono font-black bg-[#B82819] text-white px-2 py-0.5 rounded-full shadow-xs">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#1D2521]/75 mt-0.5 font-medium">
                        {contact.relationship} • {contact.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={smsUrl}
                      className="px-3 py-1.5 rounded-xl bg-[#F1F0E9] hover:bg-[#FAF8F5] border border-[#C4A66B]/40 text-[#163C32] text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      title="Compose Direct SMS"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#163C32]" />
                      <span className="hidden sm:inline">SMS</span>
                    </a>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="p-2 rounded-xl bg-[#163C32] hover:bg-[#1E4D40] text-[#F1F0E9] transition-colors shadow-xs"
                      title="Call Contact"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community AED Beacons */}
        <div className="bg-[#FAF8F5] rounded-3xl p-6 md:p-7 border border-[#C4A66B]/35 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#C4A66B]/25">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase tracking-wider block">
                Civic Defibrillator Registry
              </span>
              <h3 className="text-base font-black text-[#163C32] mt-0.5">Public Automated External Defibrillators</h3>
            </div>
            <span className="text-xs font-mono text-[#7A5E2E] bg-[#F1F0E9] border border-[#C4A66B]/40 px-3 py-0.5 rounded-full font-bold">
              Verified Public Registry
            </span>
          </div>

          <div className="space-y-3">
            {AED_LOCATIONS.map((aed) => (
              <div
                key={aed.id}
                className="p-4 rounded-2xl bg-white border border-[#C4A66B]/35 flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-[#163C32] text-[#F1F0E9] shrink-0 mt-0.5 shadow-xs">
                    <Zap className="w-4 h-4 text-[#C4A66B]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#163C32]">{aed.name}</h4>
                    <p className="text-[11px] text-[#1D2521]/75 mt-0.5 font-medium">{aed.locationDetails}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-emerald-950 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 font-bold">
                        {aed.accessStatus}
                      </span>
                      <span className="text-[9px] font-mono text-[#7A5E2E]">
                        Source: {aed.source}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-black text-[#B82819] block">
                    {aed.distance}
                  </span>
                  <span className="text-[10px] text-[#7A5E2E] font-mono font-semibold">Straight-line</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
