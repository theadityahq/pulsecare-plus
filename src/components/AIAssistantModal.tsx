import React, { useState } from 'react';
import {
  Send,
  AlertTriangle,
  X,
  Phone,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { PulseCareEmblem } from './PulseCareEmblem';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSOS: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isEmergencyAlert?: boolean;
  actionHint?: string;
  recommendedStep?: string;
}

const CLINICAL_PRESETS = [
  'Sudden Sharp Chest Pain radiating to arm',
  'Acute breathing difficulty & wheezing',
  'Deep laceration with arterial bleeding',
  'Head trauma with disorientation & vomiting',
  'Severe pediatric fever above 39.5°C'
];

export const AIAssistantModal: React.FC<Props> = ({ isOpen, onClose, onTriggerSOS }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: 'Welcome to PulseCare Triage. I provide clinical first-aid guidance and symptom assessment protocols. If this is an active life-threatening crisis, call 112 immediately or trigger the Emergency SOS button.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = '';
      let isEmergency = false;
      let actionHint = '';
      let recommendedStep = '';

      const lower = text.toLowerCase();

      if (lower.includes('chest pain') || lower.includes('heart') || lower.includes('arm')) {
        isEmergency = true;
        actionHint = 'Emergency Evaluation Required — Call 112';
        recommendedStep = 'Keep patient seated, loosen tight collar, do not exert. Administer 300mg chewable aspirin if not allergic and advised by emergency dispatch.';
        aiText = 'RED FLAG ALERT: Sudden central chest pressure or pain radiating to the left arm or jaw is a potential Myocardial Infarction (Heart Attack). This requires immediate emergency paramedic care.';
      } else if (lower.includes('breath') || lower.includes('asthma') || lower.includes('wheezing') || lower.includes('choking')) {
        isEmergency = true;
        actionHint = 'Acute Respiratory Distress — Act Immediately';
        recommendedStep = 'If choking with inability to speak, perform Heimlich abdominal thrusts. If severe asthma, administer 4-10 puffs of rescue inhaler with spacer.';
        aiText = 'CRITICAL RESPIRATORY PROTOCOL: Severe airway constriction or inability to complete sentences indicates compromised oxygenation. Immediately position upright and call 112.';
      } else if (lower.includes('bleed') || lower.includes('cut') || lower.includes('laceration') || lower.includes('blood')) {
        actionHint = 'Direct Pressure & Hemostasis';
        recommendedStep = 'Apply continuous unyielding pressure with sterile gauze. Never lift the pad to peek. Elevate wound above heart level.';
        aiText = 'TRAUMA BLEEDING CONTROL: Maintain direct manual pressure for at least 10 uninterrupted minutes. If blood spurts rhythmically (arterial), apply a commercial tourniquet 2-3 inches above the wound on the extremity.';
      } else if (lower.includes('allergic') || lower.includes('anaphylaxis') || lower.includes('swelling')) {
        isEmergency = true;
        actionHint = 'Anaphylaxis Protocol — Inject EpiPen';
        recommendedStep = 'Inject Epinephrine auto-injector into mid-outer thigh. Hold 3 seconds. Call 112 immediately.';
        aiText = 'SEVERE ALLERGIC REACTION: Facial swelling, tongue enlargement, or sudden hives combined with breathing difficulty is an acute medical emergency.';
      } else if (lower.includes('head') || lower.includes('concussion') || lower.includes('vomit')) {
        actionHint = 'Neurological Assessment';
        recommendedStep = 'Keep neck immobilized if fall from height. Do not administer sedatives or aspirin.';
        aiText = 'HEAD TRAUMA TRIAGE: Rest immediately. Red flag symptoms requiring emergency CT scan include: recurrent vomiting, pupil asymmetry, progressive confusion, or fluid draining from ear/nose.';
      } else {
        aiText = 'I have analyzed your symptom description against standard emergency triage indices. If symptoms worsen, pain intensifies, or neurological symptoms emerge, please consult an emergency department without delay.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiText,
          isEmergencyAlert: isEmergency,
          actionHint,
          recommendedStep
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2720]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="triage-title"
    >
      <div className="relative w-full max-w-2xl clinic-panel-elevated rounded-3xl flex flex-col h-[640px] border border-[#C7AE7B]/40 overflow-hidden shadow-2xl">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#F4F0E6]/10 bg-[#0E2720]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#163C32] border border-[#C7AE7B]/40 flex items-center justify-center">
              <PulseCareEmblem size={32} />
            </div>
            <div>
              <h3 id="triage-title" className="text-sm font-bold text-[#F4F0E6] flex items-center gap-2">
                PulseCare Triage Intelligence
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#163C32] text-[#C7AE7B] border border-[#C7AE7B]/30 font-semibold">
                  Clinical Protocol
                </span>
              </h3>
              <p className="text-[11px] text-[#F4F0E6]/70">
                Evidence-based emergency guidance & triage decision support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#F4F0E6]/60 hover:text-[#F4F0E6] p-2 rounded-xl hover:bg-[#163C32] transition-colors"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Clinical Disclaimer Banner */}
        <div className="px-5 py-2.5 bg-[#163C32]/70 border-b border-[#C7AE7B]/25 flex items-center space-x-2.5 text-xs text-[#F4F0E6]/90">
          <AlertTriangle className="w-4 h-4 text-[#C7AE7B] shrink-0" />
          <p className="text-[11px] leading-snug">
            <strong>Clinical Disclaimer:</strong> Health information assistant — provides general guidance, not clinical diagnosis. In any life-threatening situation, place a direct call to 112 immediately.
          </p>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#F4F0E6] text-[#1D2521] font-medium rounded-br-xs shadow-md'
                    : m.isEmergencyAlert
                    ? 'bg-[#0E2720] border-2 border-[#D94736] text-[#F4F0E6] rounded-bl-xs shadow-lg'
                    : 'bg-[#163C32]/90 text-[#F4F0E6] border border-[#C7AE7B]/25 rounded-bl-xs'
                }`}
              >
                {m.isEmergencyAlert && (
                  <div className="flex items-center gap-2 text-[#D94736] font-bold text-xs uppercase tracking-wide mb-2 pb-1.5 border-b border-[#D94736]/30">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Emergency Red Flag Detected</span>
                  </div>
                )}

                <p className="whitespace-pre-line">{m.text}</p>

                {m.recommendedStep && (
                  <div className="mt-3 p-3 rounded-xl bg-[#0E2720]/80 border border-[#C7AE7B]/30 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#C7AE7B] block">
                      Immediate Clinical Action:
                    </span>
                    <p className="text-[11px] text-[#F4F0E6]/90">{m.recommendedStep}</p>
                  </div>
                )}

                {m.actionHint && (
                  <div className="mt-3 pt-2.5 border-t border-[#F4F0E6]/15 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono text-[#D94736] font-bold uppercase">
                      {m.actionHint}
                    </span>
                    <div className="flex items-center space-x-2">
                      <a
                        href="tel:112"
                        className="px-3 py-1.5 rounded-xl bg-[#D94736] hover:bg-[#C63929] text-white font-bold text-[11px] flex items-center space-x-1 shadow-sm"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call 112</span>
                      </a>
                      <button
                        onClick={() => {
                          onClose();
                          onTriggerSOS();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#163C32] border border-[#C7AE7B]/40 hover:border-[#C7AE7B] text-[#C7AE7B] font-mono text-[11px]"
                      >
                        Open SOS Pass
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-[#C7AE7B] bg-[#163C32] p-3 rounded-2xl w-36 border border-[#C7AE7B]/30 animate-pulse font-mono">
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </div>
          )}
        </div>

        {/* Clinical Scenario Quick Buttons */}
        <div className="p-3 border-t border-[#F4F0E6]/10 bg-[#0E2720]/80 overflow-x-auto whitespace-nowrap space-x-2">
          {CLINICAL_PRESETS.map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(scenario)}
              className="inline-block px-3 py-1.5 rounded-xl bg-[#163C32] hover:bg-[#1D4A3E] border border-[#C7AE7B]/30 text-xs text-[#F4F0E6] transition-colors font-mono"
            >
              {scenario}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="p-4 bg-[#0E2720] border-t border-[#F4F0E6]/15 flex items-center space-x-2.5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe symptoms, injury onset, or medication query..."
            className="flex-1 bg-[#163C32] border border-[#C7AE7B]/30 rounded-2xl px-4 py-3 text-xs text-[#F4F0E6] placeholder-[#F4F0E6]/50 focus:outline-none focus:border-[#C7AE7B] transition-colors"
          />
          <button
            onClick={() => handleSend()}
            className="p-3 rounded-2xl bg-[#F4F0E6] hover:bg-white text-[#1D2521] transition-all font-bold shadow-md"
            aria-label="Send Symptom Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
