import React, { useState } from 'react';
import {
  Send,
  AlertTriangle,
  X,
  Phone,
  ShieldAlert,
  BookOpen,
  HeartHandshake
} from 'lucide-react';
import { PulseCareEmblem } from './PulseCareEmblem';
import { evaluateSymptomInput, SymptomGuidanceResult } from '../services/symptomGuidanceService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSOS: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  result?: SymptomGuidanceResult;
}

const COMMON_QUERIES = [
  'Chest pain radiating to my left arm',
  'Severe shortness of breath and wheezing',
  'Bleeding heavily from a deep cut',
  'Signs of an allergic reaction with throat swelling',
  'I have had a mild dry cough for 2 days'
];

export const AIAssistantModal: React.FC<Props> = ({ isOpen, onClose, onTriggerSOS }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: 'PulseCare+ Symptom Guidance is a deterministic, rule-based clinical first-aid decision engine based on published international emergency protocols (AHA, ERC, WHO). It is NOT an AI diagnostic chatbot and cannot replace professional emergency medical evaluation. If you are experiencing a life-threatening crisis, call 112 immediately.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text
    };

    const guidance = evaluateSymptomInput(text);
    const aiMsg: Message = {
      id: `g-${Date.now() + 1}`,
      sender: 'ai',
      text: guidance.guidanceText,
      result: guidance
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    if (!textToSend) setInputValue('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#163C32]/65 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl flex flex-col h-[660px] border border-[#C4A66B]/40 overflow-hidden shadow-2xl text-[#1D2521]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#C4A66B]/25 bg-[#F1F0E9] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#163C32] border border-[#C4A66B]/40 flex items-center justify-center shadow-xs">
              <PulseCareEmblem size={28} />
            </div>
            <div>
              <h3 id="assistant-modal-title" className="text-sm sm:text-base font-black text-[#163C32] flex items-center gap-2">
                Symptom Guidance
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#163C32] text-[#F1F0E9] border border-[#C4A66B]/30 font-bold">
                  Rule-based, not AI
                </span>
              </h3>
              <p className="text-[11px] text-[#1D2521]/75 font-medium">
                Deterministic first-aid protocols & clinical triage guidelines • Zero hallucination
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#163C32] text-[#F1F0E9] hover:bg-[#B82819] transition-all border border-[#C4A66B]/40 shadow-md flex items-center justify-center"
            aria-label="Close Symptom Guidance"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="px-5 py-2.5 bg-amber-50/80 border-b border-[#C4A66B]/25 flex items-center space-x-2 text-xs text-[#1D2521]">
          <AlertTriangle className="w-4 h-4 text-[#B82819] shrink-0" />
          <p className="text-[11px] leading-tight text-[#1D2521]/90">
            <strong>Medical Notice:</strong> Evidence-based triage rules. Never delays emergency escalation. In life-threatening emergencies, dial 112 immediately.
          </p>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAF8F5]">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            const res = m.result;
            const isEmergency = res?.isEmergency;
            const isMentalHealth = res?.category === 'MENTAL_HEALTH_CRISIS';

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#163C32] text-[#F1F0E9] font-medium rounded-br-xs shadow-md'
                      : isEmergency
                      ? 'bg-red-50/90 border-2 border-[#B82819] text-[#1D2521] rounded-bl-xs shadow-lg'
                      : 'bg-white text-[#1D2521] border border-[#C4A66B]/35 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {/* Emergency Header */}
                  {res && isEmergency && (
                    <div className="flex items-center gap-2 text-[#B82819] font-black text-xs uppercase tracking-wide mb-2 pb-1.5 border-b border-[#B82819]/30">
                      {isMentalHealth ? (
                        <HeartHandshake className="w-4 h-4 shrink-0 text-[#B82819]" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 shrink-0 text-[#B82819]" />
                      )}
                      <span>{res.title}</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line font-sans">{m.text}</p>

                  {/* Mental Health Helpline Links */}
                  {res?.helplines && res.helplines.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-red-100/70 border border-[#B82819]/40 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#B82819] block tracking-wide">
                        Verified Crisis Helplines (24/7):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {res.helplines.map((h, hIdx) => (
                          <a
                            key={hIdx}
                            href={`tel:${h.number}`}
                            className="p-2 rounded-lg bg-white border border-[#B82819]/30 hover:border-[#B82819] flex items-center justify-between text-xs font-bold text-[#1D2521] transition-all shadow-xs"
                          >
                            <div>
                              <div className="font-extrabold text-[#B82819]">{h.name}</div>
                              <div className="text-[10px] text-[#1D2521]/70 font-normal">{h.description}</div>
                            </div>
                            <span className="px-2 py-1 rounded bg-[#B82819] text-white text-[11px] font-mono shrink-0 ml-2">
                              {h.number}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action Steps */}
                  {res?.recommendedSteps && res.recommendedSteps.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-[#F1F0E9] border border-[#C4A66B]/40 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#163C32] block">
                        Action Protocol:
                      </span>
                      <ol className="list-decimal pl-4 space-y-1 text-[11px] text-[#1D2521] font-medium">
                        {res.recommendedSteps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Follow-up Questions for Non-Emergencies */}
                  {res?.followUpQuestions && res.followUpQuestions.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-[#C4A66B]/30 space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#7A5E2E] block">
                        Clinical Context Considerations:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#1D2521] font-medium">
                        {res.followUpQuestions.map((q, qIdx) => (
                          <li key={qIdx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Emergency Quick Action Callouts */}
                  {res?.actionHint && (
                    <div className="mt-3 pt-2.5 border-t border-[#C4A66B]/30 flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-[11px] font-mono text-[#B82819] font-bold">
                        {res.actionHint}
                      </span>
                      <div className="flex items-center space-x-2">
                        <a
                          href="tel:112"
                          className="px-3.5 py-1.5 rounded-xl bg-[#B82819] hover:bg-[#9E2013] text-white font-bold text-[11px] flex items-center space-x-1.5 shadow"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call 112</span>
                        </a>
                        <button
                          onClick={() => {
                            onClose();
                            onTriggerSOS();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#163C32] hover:bg-[#1E4D40] text-[#F1F0E9] font-mono text-[11px] font-bold shadow-xs"
                        >
                          SOS Pass
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clinical Citation */}
                  {res?.clinicalReference && (
                    <div className="mt-3 pt-2 border-t border-[#C4A66B]/25 flex items-center space-x-1.5 text-[10px] font-mono text-[#163C32]/80 font-medium">
                      <BookOpen className="w-3.5 h-3.5 shrink-0 text-[#163C32]" />
                      <span>
                        Source: {res.clinicalReference.source} ({res.clinicalReference.guideline}, rev. {res.clinicalReference.reviewedDate})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 border-t border-[#C4A66B]/25 bg-[#F1F0E9]">
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {COMMON_QUERIES.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(query)}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#C4A66B]/40 text-[11px] text-[#163C32] font-semibold transition-colors font-mono text-left focus:outline-none focus:ring-1 focus:ring-[#163C32] shadow-xs"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-[#F1F0E9] border-t border-[#C4A66B]/25 flex items-center space-x-2.5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Enter symptom or first-aid query (e.g. chest pain, nosebleed, burn)..."
            className="flex-1 bg-white border border-[#C4A66B]/40 rounded-2xl px-4 py-2.5 text-xs text-[#1D2521] placeholder-[#1D2521]/50 focus:outline-none focus:border-[#163C32] transition-colors shadow-xs"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2.5 rounded-2xl bg-[#163C32] hover:bg-[#1E4D40] text-[#F1F0E9] transition-all font-bold shadow-md flex items-center gap-1.5 text-xs"
            aria-label="Send Query"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-[#C4A66B]/40 hover:bg-[#FAF8F5] text-[#163C32] text-xs font-bold transition-all shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
