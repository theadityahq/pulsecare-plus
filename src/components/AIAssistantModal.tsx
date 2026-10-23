import React, { useState } from 'react';
import {
  Send,
  AlertTriangle,
  X,
  Phone,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  HelpCircle
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
  sourceCitation?: string;
  followUpQuestions?: string[];
}

const COMMON_QUERIES = [
  'I have had a cough for 2 days',
  'Chest pain radiating to my left arm',
  'Sudden shortness of breath & wheezing',
  'Bleeding heavily from a deep forearm cut',
  'Signs of an allergic reaction'
];

export const AIAssistantModal: React.FC<Props> = ({ isOpen, onClose, onTriggerSOS }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: 'Hello, I am your Health Information Assistant. I provide evidence-based first-aid protocols and general health guidance. I do not provide clinical diagnosis or prescribe treatments. If you are experiencing a life-threatening crisis, call 112 immediately.',
      sourceCitation: 'WHO Health Guidelines & NHS First Aid Protocols (Reviewed: 2026)'
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
      let sourceCitation = '';
      let followUpQuestions: string[] | undefined = undefined;

      const lower = text.toLowerCase();

      // 1. CRITICAL EMERGENCY RED FLAGS (IMMEDIATE ESCALATION)
      if (lower.includes('chest pain') || (lower.includes('chest') && lower.includes('arm')) || lower.includes('heart attack')) {
        isEmergency = true;
        actionHint = 'Immediate Emergency Escalation — Call 112';
        recommendedStep = 'Sit comfortably upright on floor or chair, loosen restrictive clothing, and avoid any physical exertion. If instructed by emergency dispatch and not allergic, chew one 300mg adult aspirin.';
        aiText = 'CRITICAL EMERGENCY RED FLAG: Central chest pressure, tightness, or pain radiating to the left arm, neck, or jaw requires immediate paramedic care to rule out acute myocardial infarction (heart attack). Do not drive yourself to hospital.';
        sourceCitation = 'American Heart Association & Resuscitation Council UK (STEMI Guidelines)';
      } else if (lower.includes('short of breath') || lower.includes('cant breathe') || lower.includes('cannot breathe') || lower.includes('struggling to breathe') || (lower.includes('breath') && lower.includes('severe'))) {
        isEmergency = true;
        actionHint = 'Acute Respiratory Emergency — Call 112';
        recommendedStep = 'Sit upright. If diagnosed with asthma, take 2 to 4 puffs of rescue inhaler (Albuterol/Salbutamol) with spacer immediately. Repeat every 2 minutes up to 10 puffs if symptoms do not improve.';
        aiText = 'URGENT RESPIRATORY PROTOCOL: Severe breathlessness, blue lips/fingertips, or inability to complete a single sentence without gasping indicates acute hypoxia and requires immediate emergency medical evaluation.';
        sourceCitation = 'Global Initiative for Asthma (GINA) & British Thoracic Society';
      } else if (lower.includes('allergic') || lower.includes('anaphylaxis') || lower.includes('epipen') || (lower.includes('swelling') && lower.includes('tongue'))) {
        isEmergency = true;
        actionHint = 'Anaphylaxis Protocol — Inject EpiPen & Call 112';
        recommendedStep = 'Inject Epinephrine Auto-Injector (EpiPen) into the outer mid-thigh at a 90-degree angle. Hold firmly for 3 seconds. Massage site for 10 seconds. Keep patient lying flat with legs raised unless breathing is labored.';
        aiText = 'SEVERE ALLERGIC REACTION: Facial swelling, tongue enlargement, throat tightness, or widespread hives accompanied by dizziness is anaphylaxis, a rapidly progressing medical emergency.';
        sourceCitation = 'World Allergy Organization (WAO) Anaphylaxis Guidelines';
      } else if (lower.includes('bleed') || lower.includes('laceration') || lower.includes('spurting') || lower.includes('deep cut')) {
        isEmergency = true;
        actionHint = 'Trauma Hemostasis Protocol';
        recommendedStep = 'Apply hard, direct unyielding pressure with clean cloth or sterile gauze. Do not remove soaked gauze; add more layers on top. Elevate limb above heart level. If blood spurts rhythmically, apply a commercial tourniquet 2-3 inches above wound.';
        aiText = 'HEMORRHAGE CONTROL: Uncontrolled or spurting bleeding requires immediate hemostasis and emergency care.';
        sourceCitation = 'Stop the Bleed (American College of Surgeons) & AIIMS Trauma Manual';
      } else if (lower.includes('stroke') || lower.includes('face droop') || lower.includes('slurred speech') || lower.includes('arm weakness')) {
        isEmergency = true;
        actionHint = 'Stroke Emergency Protocol — Call 112 (FAST)';
        recommendedStep = 'Note the exact time symptoms started. Do not give the person food, water, or medication (no aspirin). Keep them resting comfortably.';
        aiText = 'STROKE RED FLAG (F.A.S.T.): Facial drooping, Arm weakness, and Speech slurring indicate potential acute ischemic stroke where every minute saved preserves brain tissue.';
        sourceCitation = 'World Stroke Organization (WSO) Guidelines';
      }

      // 2. COMMON SYMPTOMS (TARGETED CLINICAL FOLLOW-UPS & CAUTIOUS CARE)
      else if (lower.includes('cough')) {
        aiText = 'Cough is a natural reflex to clear airways, but guidance depends on key clinical factors:';
        followUpQuestions = [
          'Duration: Has the cough lasted under 3 weeks (acute) or over 3 weeks (persistent)?',
          'Associated Red Flags: Is there chest pain, high fever (>38.5°C), shortness of breath, or coughing up blood?',
          'Characteristics: Is it a dry throat tickle or a productive cough with thick green/yellow phlegm?'
        ];
        recommendedStep = 'General Supportive Care (Non-Diagnostic): Stay well-hydrated with warm water or herbal tea. Inhaling steam or using a cool-mist humidifier can relieve airway irritation. Adults and children over 1 year can take 1-2 teaspoons of honey to soothe throat irritation (never give honey to infants under 1 year due to botulism risk). If accompanied by breathing difficulty, high fever, or lasting over 3 weeks, consult a physician.';
        sourceCitation = 'UK NHS Guidelines & WHO Acute Respiratory Illness Protocols';
      } else if (lower.includes('fever') || lower.includes('temperature')) {
        aiText = 'Fever is the immune system’s response to infection. Observe these medical boundaries:';
        followUpQuestions = [
          'What is the measured oral/ear temperature?',
          'How many days has the fever been present?',
          'Are there associated symptoms like stiff neck, persistent vomiting, confusion, or a non-blanching rash?'
        ];
        recommendedStep = 'Supportive Measures: Drink plenty of fluids to prevent dehydration. Dress in light clothing and rest. Paracetamol/Acetaminophen may be used for comfort following package instructions if not contraindicated. Seek urgent care if fever exceeds 39.4°C (103°F), fails to respond to antipyretics, or is in an infant under 3 months.';
        sourceCitation = 'NICE Clinical Knowledge Summaries (Fever in Adults and Children)';
      } else if (lower.includes('medicine') || lower.includes('dosage') || lower.includes('prescribe') || lower.includes('pill')) {
        aiText = 'Medication Safety Notice: As a digital health assistant, I cannot prescribe pharmaceuticals, adjust dosages, or verify off-label drug combinations. Please consult your prescribing physician, pharmacist, or refer to the official package insert leaflet for verified dosing instructions.';
        sourceCitation = 'Good Medical Practice & Digital Health Information Governance';
      } else {
        // Fallback with specific guidance rather than generic vague filler
        aiText = 'I have noted your query. To provide accurate health information, please provide specific context such as the onset, exact bodily location, severity on a scale of 1-10, or associated symptoms.';
        followUpQuestions = [
          'When did the symptom begin?',
          'Does anything make the symptom better or worse?',
          'Are you currently taking any prescription medications or do you have chronic conditions?'
        ];
        recommendedStep = 'If you experience severe pain, difficulty breathing, altered consciousness, or progressive swelling, do not delay seeking immediate medical evaluation.';
        sourceCitation = 'Evidence-Based Emergency First-Aid Guidelines (AIIMS & WHO)';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiText,
          isEmergencyAlert: isEmergency,
          actionHint,
          recommendedStep,
          sourceCitation,
          followUpQuestions
        }
      ]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2721]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-modal-title"
    >
      <div className="relative w-full max-w-2xl clinic-panel-elevated rounded-3xl flex flex-col h-[660px] border border-[#C4A66B]/40 overflow-hidden shadow-2xl">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#F1F0E9]/10 bg-[#0E2721]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center">
              <PulseCareEmblem size={30} />
            </div>
            <div>
              <h3 id="assistant-modal-title" className="text-sm font-bold text-[#F1F0E9] flex items-center gap-2">
                PulseCare Health Information Assistant
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#173E35] text-[#C4A66B] border border-[#C4A66B]/30 font-semibold">
                  Offline Decision Engine
                </span>
              </h3>
              <p className="text-[11px] text-[#F1F0E9]/70">
                General health information & verified first-aid guidance • Not a clinical diagnosis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#F1F0E9]/60 hover:text-[#F1F0E9] p-2 rounded-xl hover:bg-[#173E35] transition-colors"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="px-5 py-2.5 bg-[#173E35]/80 border-b border-[#C4A66B]/25 flex items-center space-x-2 text-xs text-[#F1F0E9]/90">
          <AlertTriangle className="w-4 h-4 text-[#C4A66B] shrink-0" />
          <p className="text-[11px] leading-tight">
            <strong>Medical Disclaimer:</strong> Provides general health education and first-aid protocols. Not a medical doctor or diagnostic device. In life-threatening emergencies, call 112 immediately.
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
                className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#F1F0E9] text-[#18231F] font-medium rounded-br-xs shadow-md'
                    : m.isEmergencyAlert
                    ? 'bg-[#0E2721] border-2 border-[#D44A3C] text-[#F1F0E9] rounded-bl-xs shadow-lg'
                    : 'bg-[#173E35]/90 text-[#F1F0E9] border border-[#C4A66B]/25 rounded-bl-xs'
                }`}
              >
                {/* Emergency Red Flag Header */}
                {m.isEmergencyAlert && (
                  <div className="flex items-center gap-2 text-[#F79488] font-bold text-xs uppercase tracking-wide mb-2 pb-1.5 border-b border-[#D44A3C]/40">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-[#F79488]" />
                    <span>Priority Emergency Red Flag Detected</span>
                  </div>
                )}

                <p className="whitespace-pre-line font-sans">{m.text}</p>

                {/* Targeted Follow-up Questions for non-emergencies like cough */}
                {m.followUpQuestions && m.followUpQuestions.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-[#0E2721]/80 border border-[#C4A66B]/25 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#C4A66B] block">
                      Key Clinical Context Factors:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#F1F0E9]/90">
                      {m.followUpQuestions.map((q, qIdx) => (
                        <li key={qIdx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Immediate Clinical / First-aid action */}
                {m.recommendedStep && (
                  <div className="mt-3 p-3 rounded-xl bg-[#0E2721]/80 border border-[#C4A66B]/30 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#C4A66B] block">
                      Recommended Action:
                    </span>
                    <p className="text-[11px] text-[#F1F0E9]/90">{m.recommendedStep}</p>
                  </div>
                )}

                {/* Emergency Call Button if Red Flag */}
                {m.actionHint && (
                  <div className="mt-3 pt-2.5 border-t border-[#F1F0E9]/15 flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-[10px] font-mono text-[#F79488] font-bold uppercase">
                      {m.actionHint}
                    </span>
                    <div className="flex items-center space-x-2">
                      <a
                        href="tel:112"
                        className="px-3.5 py-1.5 rounded-xl bg-[#BA3B2E] hover:bg-[#9C2A1E] text-white font-bold text-[11px] flex items-center space-x-1.5 shadow"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call 112</span>
                      </a>
                      <button
                        onClick={() => {
                          onClose();
                          onTriggerSOS();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#173E35] border border-[#C4A66B]/40 hover:border-[#C4A66B] text-[#C4A66B] font-mono text-[11px]"
                      >
                        SOS Pass
                      </button>
                    </div>
                  </div>
                )}

                {/* Sourced Medical Reference Citation */}
                {m.sourceCitation && (
                  <div className="mt-3 pt-2 border-t border-[#F1F0E9]/10 flex items-center space-x-1.5 text-[10px] font-mono text-[#C4A66B]/80">
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span>Source: {m.sourceCitation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-[#C4A66B] bg-[#173E35] p-3 rounded-2xl w-36 border border-[#C4A66B]/30 animate-pulse font-mono">
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips (Wrapped with no clipping, accessible keyboard navigation) */}
        <div className="p-3 border-t border-[#F1F0E9]/10 bg-[#0E2721]/80">
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {COMMON_QUERIES.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(query)}
                className="px-2.5 py-1 rounded-xl bg-[#173E35] hover:bg-[#1F4D43] border border-[#C4A66B]/30 text-[11px] text-[#F1F0E9] transition-colors font-mono text-left focus:outline-none focus:ring-1 focus:ring-[#C4A66B]"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0E2721] border-t border-[#F1F0E9]/15 flex items-center space-x-2.5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe symptoms, duration, or first-aid query..."
            className="flex-1 bg-[#173E35] border border-[#C4A66B]/30 rounded-2xl px-4 py-3 text-xs text-[#F1F0E9] placeholder-[#F1F0E9]/50 focus:outline-none focus:border-[#C4A66B] transition-colors"
          />
          <button
            onClick={() => handleSend()}
            className="p-3 rounded-2xl bg-[#F1F0E9] hover:bg-white text-[#18231F] transition-all font-bold shadow-md"
            aria-label="Send Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
