import React, { useState, useEffect, useRef } from 'react';
import { FIRST_AID_GUIDES } from '../data/mockData';
import { FirstAidGuide } from '../types';
import { HeartPulse, Wind, Droplet, AlertTriangle, Play, Square, Activity, ChevronRight, Info, CheckCircle2 } from 'lucide-react';

export const FirstAidLibrary: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<FirstAidGuide>(FIRST_AID_GUIDES[0]);
  const [metronomeActive, setMetronomeActive] = useState<boolean>(false);
  const [beatVisual, setBeatVisual] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // CPR Metronome (110 BPM = ~545ms per beat)
  useEffect(() => {
    let interval: any;

    if (metronomeActive) {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const playBeep = () => {
        try {
          if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
          }
          if (audioCtxRef.current) {
            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(750, audioCtxRef.current.currentTime);
            gain.gain.setValueAtTime(0.2, audioCtxRef.current.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);
            osc.start();
            osc.stop(audioCtxRef.current.currentTime + 0.08);
          }
        } catch (e) {
          console.warn('Audio context restricted before user interaction', e);
        }

        setBeatVisual(true);
        setTimeout(() => setBeatVisual(false), 140);
      };

      playBeep();
      const intervalMs = Math.round(60000 / (selectedGuide.bpm || 110));
      interval = setInterval(playBeep, intervalMs);
    } else {
      setBeatVisual(false);
    }

    return () => clearInterval(interval);
  }, [metronomeActive, selectedGuide]);

  return (
    <div className="clinic-panel rounded-3xl p-6 border border-[#C4A66B]/25 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F0E9]/10">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#C4A66B] uppercase tracking-wider block">
            Emergency Medical Action
          </span>
          <h3 className="text-base font-bold text-[#F1F0E9] mt-0.5">Interactive First-Aid Protocols</h3>
        </div>

        {/* CPR Metronome Bar if guide has metronome */}
        {selectedGuide.hasMetronome && (
          <div className="flex items-center space-x-3 bg-[#0E2721] p-2 px-3.5 rounded-2xl border border-[#C4A66B]/30">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-75 ${
                  beatVisual
                    ? 'bg-[#C4A66B] shadow-[0_0_15px_#C4A66B] scale-125'
                    : 'bg-[#173E35]'
                }`}
              />
              <span className="text-xs font-mono font-bold text-[#C4A66B]">
                110 BPM CPR RHYTHM
              </span>
            </div>
            <button
              onClick={() => setMetronomeActive(!metronomeActive)}
              className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                metronomeActive
                  ? 'bg-[#BA3B2E] text-white shadow'
                  : 'bg-[#F1F0E9] hover:bg-white text-[#18231F] shadow'
              }`}
            >
              {metronomeActive ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{metronomeActive ? 'Stop Pulse' : 'Start CPR Beat'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Guide Category Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {FIRST_AID_GUIDES.map((guide) => {
          const isSelected = selectedGuide.id === guide.id;
          return (
            <button
              key={guide.id}
              onClick={() => {
                setSelectedGuide(guide);
                setMetronomeActive(false);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#173E35] border-[#C4A66B] ring-1 ring-[#C4A66B]/40 shadow-lg'
                  : 'bg-[#0E2721]/80 border-[#F1F0E9]/10 hover:border-[#C4A66B]/40 text-[#F1F0E9]/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                    guide.urgency === 'CRITICAL'
                      ? 'bg-[#0E2721] text-[#F79488] border border-[#BA3B2E]/50'
                      : 'bg-[#0E2721] text-[#C4A66B] border border-[#C4A66B]/30'
                  }`}
                >
                  {guide.urgency}
                </span>
              </div>
              <h4 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-[#F1F0E9]' : 'text-[#F1F0E9]/80'}`}>
                {guide.title.split('(')[0]}
              </h4>
              <span className="text-[10px] text-[#C4A66B] font-mono mt-1 block">Est: {guide.estimatedTime}</span>
            </button>
          );
        })}
      </div>

      {/* Step by Step Interactive Flow */}
      <div className="space-y-4 bg-[#0E2721]/80 p-5 rounded-3xl border border-[#C4A66B]/20">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#F1F0E9]">{selectedGuide.title}</h4>
          <span className="text-xs text-[#C4A66B] font-mono">
            {selectedGuide.steps.length} Critical Actions
          </span>
        </div>

        <div className="space-y-3">
          {selectedGuide.steps.map((step) => (
            <div
              key={step.number}
              className="p-4 rounded-2xl bg-[#173E35]/70 border border-[#F1F0E9]/10 flex items-start space-x-3.5"
            >
              <div className="w-7 h-7 rounded-xl bg-[#0E2721] text-[#C4A66B] font-bold text-xs flex items-center justify-center shrink-0 border border-[#C4A66B]/40 font-mono">
                {step.number}
              </div>
              <div className="space-y-1 flex-1">
                <h5 className="text-xs font-bold text-[#F1F0E9]">{step.title}</h5>
                <p className="text-xs text-[#F1F0E9]/80 leading-relaxed">{step.description}</p>
                {step.caution && (
                  <div className="mt-2 text-[11px] text-[#F79488] bg-[#0E2721] p-2.5 rounded-xl border border-[#BA3B2E]/40 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F79488] shrink-0 mt-0.5" />
                    <span>{step.caution}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
