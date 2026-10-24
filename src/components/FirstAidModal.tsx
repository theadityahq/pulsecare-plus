import React, { useState, useEffect, useRef } from 'react';
import { FIRST_AID_GUIDES } from '../data/mockData';
import { FirstAidGuide } from '../types';
import {
  HeartPulse,
  Play,
  Square,
  AlertTriangle,
  X,
  Search,
  Phone,
  Flame,
  Activity,
  ShieldAlert,
  Wind,
  Droplet,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialGuideId?: string | null;
}

export const FirstAidModal: React.FC<Props> = ({ isOpen, onClose, initialGuideId }) => {
  const [selectedGuide, setSelectedGuide] = useState<FirstAidGuide>(FIRST_AID_GUIDES[0]);
  const [metronomeActive, setMetronomeActive] = useState<boolean>(false);
  const [beatVisual, setBeatVisual] = useState<boolean>(false);
  const [searchTriage, setSearchTriage] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Set initial guide if provided
  useEffect(() => {
    if (initialGuideId) {
      const match = FIRST_AID_GUIDES.find(g => g.id === initialGuideId);
      if (match) setSelectedGuide(match);
    }
  }, [initialGuideId, isOpen]);

  // CPR Metronome (110 BPM = ~545ms per beat)
  useEffect(() => {
    let interval: any;

    if (metronomeActive) {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const playBeep = () => {
        if (!isMuted) {
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
            console.warn('Audio context error:', e);
          }
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
  }, [metronomeActive, selectedGuide, isMuted]);

  // Stop metronome when switching away from CPR
  useEffect(() => {
    if (!selectedGuide.hasMetronome && metronomeActive) {
      setMetronomeActive(false);
    }
  }, [selectedGuide, metronomeActive]);

  if (!isOpen) return null;

  // Filter guides based on emergency triage input
  const query = searchTriage.trim().toLowerCase();
  const filteredGuides = FIRST_AID_GUIDES.filter(g => {
    if (!query) return true;
    return (
      g.title.toLowerCase().includes(query) ||
      g.steps.some(s => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)) ||
      (query.includes('cpr') && g.id === 'fa-cpr') ||
      (query.includes('heart') && g.id === 'fa-cpr') ||
      (query.includes('chok') && g.id === 'fa-choking') ||
      (query.includes('bleed') && g.id === 'fa-bleeding') ||
      (query.includes('blood') && g.id === 'fa-bleeding') ||
      (query.includes('allergy') && g.id === 'fa-anaphylaxis') ||
      (query.includes('burn') && g.id === 'fa-burn') ||
      (query.includes('seizure') && g.id === 'fa-seizure') ||
      (query.includes('fracture') && g.id === 'fa-fracture') ||
      (query.includes('bone') && g.id === 'fa-fracture') ||
      (query.includes('snake') && g.id === 'fa-snakebite') ||
      (query.includes('bite') && g.id === 'fa-snakebite')
    );
  });

  const triageChips = [
    { label: '🫀 Unconscious / CPR', id: 'fa-cpr' },
    { label: '🥩 Choking / Airway', id: 'fa-choking' },
    { label: '🩸 Severe Bleeding', id: 'fa-bleeding' },
    { label: '🔥 Thermal Burn', id: 'fa-burn' },
    { label: '🐝 Allergic Anaphylaxis', id: 'fa-anaphylaxis' },
    { label: '⚡ Seizure / Convulsion', id: 'fa-seizure' },
    { label: '🦴 Bone Fracture', id: 'fa-fracture' },
    { label: '🐍 Snake / Insect Bite', id: 'fa-snakebite' }
  ];

  const renderIcon = (name: string) => {
    switch (name) {
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-[#B82819]" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-[#163C32]" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-[#B82819]" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-[#163C32]" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-amber-700" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-[#B82819]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#163C32]/65 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-aid-dialog-title"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border-2 border-[#C7AE7B]/45 shadow-2xl overflow-hidden text-[#163C32] max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-[#C7AE7B]/25 flex items-center justify-between bg-[#FAF8F5] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B82819] flex items-center justify-center text-white shadow-md">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="first-aid-dialog-title" className="text-base sm:text-lg font-black tracking-tight text-[#163C32]">
                  Emergency First Aid Responder
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B82819] text-white">
                  Triage Active
                </span>
              </div>
              <p className="text-xs text-[#7A5E2E] font-mono font-medium">
                Step-by-step civilian life-support protocols & audible rhythm pacing
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="tel:112"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#B82819] hover:bg-[#9E2013] text-white text-xs font-bold transition-all shadow-sm"
              title="Call Emergency 112"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call 112</span>
            </a>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-[#163C32] text-[#F4F0E6] hover:bg-[#B82819] transition-all border border-[#C7AE7B]/40 shadow-sm flex items-center justify-center group"
              aria-label="Close first aid window"
              title="Close window"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        {/* Top Triage Search & Symptom Bar */}
        <div className="p-4 bg-white border-b border-[#C7AE7B]/25 space-y-3 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-[#163C32]/60" />
            <input
              type="text"
              value={searchTriage}
              onChange={(e) => setSearchTriage(e.target.value)}
              placeholder="What happened? Type symptoms (e.g. choking, unconscious, bleeding, burn, allergic reaction, fracture)..."
              className="w-full bg-[#FAF8F5] border-2 border-[#C7AE7B]/40 rounded-2xl pl-10 pr-24 py-2.5 text-xs text-[#163C32] placeholder-[#163C32]/55 focus:outline-none focus:border-[#163C32] focus:bg-white transition-all shadow-xs"
            />
            {searchTriage && (
              <button
                onClick={() => setSearchTriage('')}
                className="absolute right-2 px-2.5 py-1 text-xs text-[#7A5E2E] hover:text-[#163C32] font-mono font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Emergency Symptom Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1 scrollbar-thin">
            {triageChips.map((chip) => {
              const isSelected = selectedGuide.id === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => {
                    const match = FIRST_AID_GUIDES.find(g => g.id === chip.id);
                    if (match) setSelectedGuide(match);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-[#163C32] text-[#F4F0E6] shadow-xs ring-1 ring-[#C7AE7B]'
                      : 'bg-[#FAF8F5] border border-[#C7AE7B]/35 text-[#163C32] hover:bg-white'
                  }`}
                >
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FAF8F5]/50">
          
          {/* Left Column: Guides List (4 Cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#7A5E2E] block px-1">
              Select Emergency Protocol ({filteredGuides.length}):
            </span>
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredGuides.map((guide) => {
                const isSelected = selectedGuide.id === guide.id;
                return (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border-2 flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-white border-[#163C32] shadow-md ring-2 ring-[#C7AE7B]/40'
                        : 'bg-white border-[#C7AE7B]/30 hover:border-[#163C32]'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#C7AE7B]/30 shrink-0 mt-0.5">
                      {renderIcon(guide.iconName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold uppercase ${guide.urgency === 'CRITICAL' ? 'text-[#B82819]' : 'text-amber-700'}`}>
                          {guide.urgency}
                        </span>
                        {guide.hasMetronome && (
                          <span className="text-[10px] font-mono text-[#7A5E2E] font-bold">110 BPM</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#163C32] mt-0.5 leading-snug">{guide.title}</h4>
                      <p className="text-[10px] text-[#163C32]/75 font-mono mt-1 font-medium">{guide.estimatedTime}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Step-by-Step Instructions & Metronome (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Active Protocol Header Card */}
            <div className="bg-white p-5 rounded-3xl border-2 border-[#C7AE7B]/35 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C7AE7B]/25">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#B82819] px-2 py-0.5 rounded-full bg-red-50 border border-[#B82819]/30">
                      {selectedGuide.urgency} PROTOCOL
                    </span>
                    <span className="text-[10px] font-mono text-[#7A5E2E] font-bold">
                      {selectedGuide.estimatedTime}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#163C32] mt-1">
                    {selectedGuide.title}
                  </h3>
                </div>

                {/* CPR Metronome Box */}
                {selectedGuide.hasMetronome && (
                  <div className="flex items-center space-x-2 bg-[#FAF8F5] p-2 rounded-2xl border border-[#C7AE7B]/40 shrink-0">
                    <div className="flex items-center space-x-1.5 px-2">
                      <div
                        className={`w-3.5 h-3.5 rounded-full transition-all duration-75 ${
                          beatVisual
                            ? 'bg-[#B82819] shadow-[0_0_12px_#B82819] scale-125'
                            : 'bg-[#163C32]'
                        }`}
                      />
                      <span className="text-[11px] font-mono font-bold text-[#163C32]">110 BPM</span>
                    </div>

                    <button
                      onClick={() => setMetronomeActive(!metronomeActive)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-xs ${
                        metronomeActive
                          ? 'bg-[#B82819] text-white'
                          : 'bg-[#163C32] hover:bg-[#0E2721] text-[#F4F0E6]'
                      }`}
                    >
                      {metronomeActive ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>{metronomeActive ? 'Stop Pulse' : 'Start Beat'}</span>
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-xl hover:bg-white text-[#163C32] transition-colors"
                      title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#B82819]" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Numbered Steps */}
              <div className="space-y-3 pt-1">
                {selectedGuide.steps.map((step) => (
                  <div
                    key={step.number}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C7AE7B]/30 space-y-1.5 transition-all hover:border-[#163C32]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-[#163C32] text-[#F4F0E6] flex items-center justify-center text-xs font-black font-mono shrink-0 shadow-xs">
                        {step.number}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#163C32]">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs leading-relaxed text-[#163C32]/85 pl-10 font-medium">
                      {step.description}
                    </p>
                    {step.caution && (
                      <div className="ml-10 mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900 flex items-start space-x-2 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span><strong>CAUTION:</strong> {step.caution}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#C7AE7B]/25 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#7A5E2E] font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>WHO & ILCOR Evidence-Based Emergency Guidelines</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#163C32] text-[#F4F0E6] hover:bg-[#B82819] text-xs font-mono font-bold transition-all shadow-xs"
          >
            Close First Aid
          </button>
        </div>
      </div>
    </div>
  );
};
