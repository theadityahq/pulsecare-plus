import React from 'react';
import { Sparkles, Bot, ShieldCheck, ArrowRight, Activity, Stethoscope } from 'lucide-react';
import { PulseCareEmblem } from './PulseCareEmblem';

interface Props {
  onOpenAssistant: () => void;
}

export const AIHealthHologram: React.FC<Props> = ({ onOpenAssistant }) => {
  return (
    <div className="rounded-3xl bg-[#FAF8F5] border border-[#C4A66B]/30 p-5 shadow-xl space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#C4A66B]/20">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#C4A66B]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#173E35] uppercase font-mono tracking-wider">
              AI Health Hologram
            </h3>
            <p className="text-[10px] text-[#173E35]/70">
              Offline clinical guidance & evidence-based triage support
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#173E35] text-[#F1F0E9] border border-[#C4A66B]/30 font-bold">
          Verified
        </span>
      </div>

      {/* Center Holographic Stage */}
      <div
        onClick={onOpenAssistant}
        className="relative h-44 rounded-2xl bg-gradient-to-b from-[#F1F0E9] via-white to-[#F1F0E9] border border-[#C4A66B]/30 overflow-hidden flex flex-col items-center justify-center cursor-pointer group shadow-inner"
        role="button"
        tabIndex={0}
        aria-label="Decision Engine Active — Open AI Health Assistant"
      >
        {/* Ambient Hologram Glow Aura */}
        <div className="absolute inset-0 bg-radial from-[#C4A66B]/15 via-transparent to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-700" />

        {/* Outer Fine Telemetric Rotating Ring */}
        <div className="absolute w-36 h-36 rounded-full border border-dashed border-[#C4A66B]/50 animate-spin" style={{ animationDuration: '36s' }} />
        <div className="absolute w-28 h-28 rounded-full border border-[#173E35]/25 animate-ping" style={{ animationDuration: '4s' }} />

        {/* Central Emblem Crest */}
        <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-300">
          <PulseCareEmblem size={84} />
        </div>

        {/* Hologram Floating Status Badge */}
        <div className="absolute bottom-2.5 px-3 py-1 rounded-full bg-[#173E35] border border-[#C4A66B]/40 text-[10px] font-mono text-[#F1F0E9] flex items-center space-x-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Decision Engine Active</span>
        </div>
      </div>

      {/* Safety & Protocol Assurance */}
      <div className="space-y-2">
        <div className="p-3 rounded-2xl bg-white border border-[#C4A66B]/20 flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-[#173E35] shrink-0 mt-0.5" />
          <div className="text-[11px] text-[#173E35]/80 leading-snug">
            <span className="font-bold text-[#173E35]">Clinical Safety First:</span> Clarifying questions for cough, instant 112 escalation for chest pain & stroke.
          </div>
        </div>

        {/* Launch Assistant CTA Button */}
        <button
          onClick={onOpenAssistant}
          className="w-full py-2.5 px-4 rounded-xl bg-[#173E35] hover:bg-[#0E2721] text-[#F1F0E9] text-xs font-bold font-mono transition-all flex items-center justify-center space-x-2 shadow-md group"
        >
          <span>Ask Health Assistant</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C4A66B] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
