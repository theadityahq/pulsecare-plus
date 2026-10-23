import React, { useState, useEffect, useRef } from 'react';
import { FIRST_AID_GUIDES } from '../data/mockData';
import { FirstAidGuide } from '../types';
import { HeartPulse, Wind, Droplet, AlertTriangle, Play, Square, Activity, ChevronRight, Info } from 'lucide-react';

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
            osc.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
            gain.gain.setValueAtTime(0.3, audioCtxRef.current.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);
            osc.start();
            osc.stop(audioCtxRef.current.currentTime + 0.08);
          }
        } catch (e) {
          console.warn('Audio synthesis not permitted without interaction', e);
        }

        setBeatVisual(true);
        setTimeout(() => setBeatVisual(false), 150);
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
    <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            Rapid Response Protocol
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">Interactive First-Aid Library</h3>
        </div>

        {/* CPR Metronome Bar if guide has metronome */}
        {selectedGuide.hasMetronome && (
          <div className="flex items-center space-x-3 bg-slate-950 p-2 px-3 rounded-xl border border-cyan-500/30">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-75 ${
                  beatVisual
                    ? 'bg-cyan-400 shadow-[0_0_15px_#00F0FF] scale-125'
                    : 'bg-slate-700'
                }`}
              />
              <span className="text-xs font-mono font-bold text-cyan-300">
                110 BPM RHYTHM
              </span>
            </div>
            <button
              onClick={() => setMetronomeActive(!metronomeActive)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                metronomeActive
                  ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
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
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  guide.urgency === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                }`}>
                  {guide.urgency}
                </span>
              </div>
              <h4 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {guide.title.split('(')[0]}
              </h4>
              <span className="text-[10px] text-slate-500 mt-1 block">Est: {guide.estimatedTime}</span>
            </button>
          );
        })}
      </div>

      {/* Step by Step Interactive Flow */}
      <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-cyan-300">{selectedGuide.title}</h4>
          <span className="text-xs text-slate-400 font-mono">
            {selectedGuide.steps.length} Critical Actions
          </span>
        </div>

        <div className="space-y-3">
          {selectedGuide.steps.map((step) => (
            <div
              key={step.number}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex items-start space-x-3.5"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 border border-cyan-500/40">
                {step.number}
              </div>
              <div className="space-y-1 flex-1">
                <h5 className="text-xs font-bold text-white">{step.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                {step.caution && (
                  <div className="mt-2 text-[11px] text-red-300 bg-red-950/30 p-2 rounded border border-red-500/20 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
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
