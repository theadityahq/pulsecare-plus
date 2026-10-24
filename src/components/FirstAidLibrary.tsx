import React, { useState, useEffect, useRef } from 'react';
import { FIRST_AID_GUIDES } from '../data/mockData';
import { FirstAidGuide } from '../types';
import { HeartPulse, Play, Square, AlertTriangle, X } from 'lucide-react';

interface Props {
  onClose?: () => void;
}

export const FirstAidLibrary: React.FC<Props> = ({ onClose }) => {
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
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#C4A66B]/35 shadow-xl space-y-6 text-[#173E35]">
      
      {/* Header with Metronome & Close Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#C4A66B]/25">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#7A5E2E] uppercase tracking-wider block">
            Emergency Medical Action
          </span>
          <h3 className="text-lg font-black text-[#173E35] mt-0.5">Interactive First-Aid Protocols</h3>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* CPR Metronome Bar if guide has metronome */}
          {selectedGuide.hasMetronome && (
            <div className="flex items-center space-x-3 bg-[#FAF8F5] p-2 px-3.5 rounded-2xl border border-[#C4A66B]/35 shadow-xs">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-75 ${
                    beatVisual
                      ? 'bg-[#CC3B2D] shadow-[0_0_12px_#CC3B2D] scale-125'
                      : 'bg-[#173E35]'
                  }`}
                />
                <span className="text-xs font-mono font-bold text-[#173E35]">
                  110 BPM CPR RHYTHM
                </span>
              </div>
              <button
                onClick={() => setMetronomeActive(!metronomeActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-xs ${
                  metronomeActive
                    ? 'bg-[#CC3B2D] text-white shadow'
                    : 'bg-[#173E35] hover:bg-[#1F4D43] text-[#F1F0E9]'
                }`}
              >
                {metronomeActive ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                <span>{metronomeActive ? 'Stop Pulse' : 'Start Beat'}</span>
              </button>
            </div>
          )}

          {/* Dedicated Close Tab Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] transition-all border border-[#C4A66B]/40 shadow-md flex items-center gap-1.5 text-xs font-bold"
              aria-label="Close Tab"
              title="Close First-Aid Protocols"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close Tab</span>
            </button>
          )}
        </div>
      </div>

      {/* Guide Category Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FIRST_AID_GUIDES.map((guide) => {
          const isSelected = selectedGuide.id === guide.id;
          return (
            <button
              key={guide.id}
              onClick={() => {
                setSelectedGuide(guide);
                setMetronomeActive(false);
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all shadow-xs ${
                isSelected
                  ? 'bg-[#FAF8F5] border-[#173E35] ring-2 ring-[#173E35]/20 shadow-md'
                  : 'bg-white border-[#C4A66B]/35 hover:border-[#173E35]/60 text-[#173E35]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full ${
                    guide.urgency === 'CRITICAL'
                      ? 'bg-red-50 text-[#CC3B2D] border border-[#CC3B2D]/40'
                      : 'bg-[#FAF8F5] text-[#7A5E2E] border border-[#C4A66B]/40'
                  }`}
                >
                  {guide.urgency}
                </span>
              </div>
              <h4 className="text-xs font-black line-clamp-1 text-[#173E35]">
                {guide.title.split('(')[0]}
              </h4>
              <span className="text-[10px] text-[#7A5E2E] font-mono font-medium mt-1 block">Est: {guide.estimatedTime}</span>
            </button>
          );
        })}
      </div>

      {/* Step by Step Interactive Flow */}
      <div className="space-y-4 bg-[#FAF8F5] p-5 md:p-6 rounded-3xl border border-[#C4A66B]/30 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#C4A66B]/25">
          <h4 className="text-sm font-black text-[#173E35]">{selectedGuide.title}</h4>
          <span className="text-xs text-[#7A5E2E] font-mono font-bold">
            {selectedGuide.steps.length} Critical Actions
          </span>
        </div>

        <div className="space-y-3.5">
          {selectedGuide.steps.map((step) => (
            <div
              key={step.number}
              className="p-4 rounded-2xl bg-white border border-[#C4A66B]/35 flex items-start space-x-3.5 shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#173E35] text-[#F1F0E9] font-black text-xs flex items-center justify-center shrink-0 font-mono shadow-xs">
                {step.number}
              </div>
              <div className="space-y-1 flex-1">
                <h5 className="text-xs font-black text-[#173E35]">{step.title}</h5>
                <p className="text-xs text-[#173E35]/85 leading-relaxed font-medium">{step.description}</p>
                {step.caution && (
                  <div className="mt-2 text-[11px] text-[#CC3B2D] bg-red-50 p-2.5 rounded-xl border border-[#CC3B2D]/40 flex items-start gap-1.5 font-medium">
                    <AlertTriangle className="w-4 h-4 text-[#CC3B2D] shrink-0 mt-0.5" />
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
