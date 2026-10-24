import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  VolumeX,
  BookOpen
} from 'lucide-react';

interface Props {
  isOpen?: boolean;
  onClose: () => void;
  initialGuideId?: string | null;
  mode?: 'modal' | 'inline';
}

export const FirstAidModal: React.FC<Props> = ({
  isOpen = true,
  onClose,
  initialGuideId,
  mode = 'modal'
}) => {
  const [selectedGuide, setSelectedGuide] = useState<FirstAidGuide>(FIRST_AID_GUIDES[0]);
  const [metronomeActive, setMetronomeActive] = useState<boolean>(false);
  const [beatVisual, setBeatVisual] = useState<boolean>(false);
  const [searchTriage, setSearchTriage] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Web Audio Context & Lookahead Scheduler Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const schedulerTimerRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Set initial guide if provided
  useEffect(() => {
    if (initialGuideId) {
      const match = FIRST_AID_GUIDES.find((g) => g.id === initialGuideId);
      if (match) setSelectedGuide(match);
    }
  }, [initialGuideId, isOpen]);

  // Keyboard accessibility: Escape to close & focus trap
  useEffect(() => {
    if (mode !== 'modal' || !isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, mode]);

  // Screen Wake Lock API management
  const requestWakeLock = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch {
        // WakeLock may fail if low battery or backgrounded
      }
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
  }, []);

  // Web Audio lookahead scheduler (Chris Wilson precision timing pattern)
  const scheduleNote = useCallback((time: number) => {
    if (!audioCtxRef.current) return;

    if (!isMuted) {
      try {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, time);
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start(time);
        osc.stop(time + 0.08);
      } catch (err) {
        console.warn('Audio scheduling error:', err);
      }
    }

    // Schedule visual flash and tactile vibration
    const delayMs = Math.max(0, (time - audioCtxRef.current.currentTime) * 1000);
    setTimeout(() => {
      setBeatVisual(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([35]);
        } catch {
          // ignore
        }
      }
      setTimeout(() => setBeatVisual(false), 120);
    }, delayMs);
  }, [isMuted]);

  // Metronome scheduler loop
  useEffect(() => {
    if (!metronomeActive) {
      if (schedulerTimerRef.current) {
        clearInterval(schedulerTimerRef.current);
        schedulerTimerRef.current = null;
      }
      releaseWakeLock();
      setBeatVisual(false);
      return;
    }

    // Initialize AudioContext on user activation
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    requestWakeLock();

    const bpm = selectedGuide.bpm || 110;
    const secondsPerBeat = 60.0 / bpm;
    const scheduleAheadTime = 0.12; // Schedule up to 120ms ahead
    const lookaheadMs = 25.0; // Check every 25ms

    if (audioCtxRef.current) {
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
    }

    schedulerTimerRef.current = window.setInterval(() => {
      if (!audioCtxRef.current) return;
      while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + scheduleAheadTime) {
        scheduleNote(nextNoteTimeRef.current);
        nextNoteTimeRef.current += secondsPerBeat;
      }
    }, lookaheadMs);

    return () => {
      if (schedulerTimerRef.current) {
        clearInterval(schedulerTimerRef.current);
        schedulerTimerRef.current = null;
      }
      releaseWakeLock();
    };
  }, [metronomeActive, selectedGuide, scheduleNote, requestWakeLock, releaseWakeLock]);

  // Turn off metronome when guide changes to non-metronome protocol
  useEffect(() => {
    if (!selectedGuide.hasMetronome && metronomeActive) {
      setMetronomeActive(false);
    }
  }, [selectedGuide, metronomeActive]);

  if (mode === 'modal' && !isOpen) return null;

  // Filter guides based on emergency triage input
  const query = searchTriage.trim().toLowerCase();
  const filteredGuides = FIRST_AID_GUIDES.filter((g) => {
    if (!query) return true;
    return (
      g.title.toLowerCase().includes(query) ||
      g.steps.some(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          (s.caution && s.caution.toLowerCase().includes(query))
      ) ||
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

  const content = (
    <div
      ref={dialogRef}
      className={`relative w-full ${
        mode === 'modal'
          ? 'max-w-4xl bg-[#FAF8F5] rounded-3xl border border-[#C4A66B]/45 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col'
          : 'bg-[#FAF8F5] rounded-3xl border border-[#C4A66B]/35 shadow-xl space-y-6 p-6 md:p-8'
      } text-[#1D2521]`}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-6 border-b border-[#C4A66B]/25 flex items-center justify-between bg-[#F1F0E9] shrink-0">
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
              Step-by-step life-support protocols & sample-accurate 110 BPM metronome
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="tel:112"
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#B82819] hover:bg-[#9E2013] text-white text-xs font-bold transition-all shadow-sm"
            title="Call Emergency 112"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 112</span>
          </a>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-[#163C32] text-[#F1F0E9] hover:bg-[#B82819] transition-all border border-[#C4A66B]/40 shadow-sm flex items-center justify-center"
              aria-label="Close first aid window"
              title="Close window"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Top Triage Search & Symptom Bar */}
      <div className="p-4 bg-white border-b border-[#C4A66B]/25 space-y-3 shrink-0">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-[#163C32]/60" />
          <input
            type="text"
            value={searchTriage}
            onChange={(e) => setSearchTriage(e.target.value)}
            placeholder="What happened? Type symptoms (e.g. choking, unconscious, bleeding, burn, allergic reaction, fracture)..."
            className="w-full bg-[#FAF8F5] border border-[#C4A66B]/40 rounded-2xl pl-10 pr-24 py-2.5 text-xs text-[#1D2521] placeholder-[#1D2521]/50 focus:outline-none focus:border-[#163C32] focus:bg-white transition-all shadow-xs"
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
                  const match = FIRST_AID_GUIDES.find((g) => g.id === chip.id);
                  if (match) setSelectedGuide(match);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#163C32] text-[#F1F0E9] shadow-xs ring-1 ring-[#C4A66B]'
                    : 'bg-[#FAF8F5] border border-[#C4A66B]/35 text-[#163C32] hover:bg-white'
                }`}
              >
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FAF8F5]">
        {/* Left Column: Guides List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-[#7A5E2E] block px-1">
            Emergency Protocols ({filteredGuides.length}):
          </span>
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredGuides.map((guide) => {
              const isSelected = selectedGuide.id === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-white border-[#163C32] shadow-md ring-2 ring-[#C4A66B]/40'
                      : 'bg-white border-[#C4A66B]/30 hover:border-[#163C32]'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-[#F1F0E9] border border-[#C4A66B]/30 shrink-0 mt-0.5">
                    {renderIcon(guide.iconName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase ${
                          guide.urgency === 'CRITICAL' ? 'text-[#B82819]' : 'text-amber-800'
                        }`}
                      >
                        {guide.urgency}
                      </span>
                      {guide.hasMetronome && (
                        <span className="text-[10px] font-mono text-[#7A5E2E] font-bold">110 BPM</span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-[#163C32] mt-0.5 leading-snug">{guide.title}</h4>
                    <p className="text-[10px] text-[#1D2521]/75 font-mono mt-1 font-medium">{guide.estimatedTime}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Step-by-Step Instructions & Metronome (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Protocol Header Card */}
          <div className="bg-white p-5 rounded-3xl border border-[#C4A66B]/35 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C4A66B]/25">
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

              {/* CPR Metronome Box (Web Audio Precision Lookahead Scheduler) */}
              {selectedGuide.hasMetronome && (
                <div className="flex items-center space-x-2 bg-[#F1F0E9] p-2 rounded-2xl border border-[#C4A66B]/40 shrink-0">
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
                        : 'bg-[#163C32] hover:bg-[#1E4D40] text-[#F1F0E9]'
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
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#B82819]" /> : <Volume2 className="w-3.5 h-3.5 text-[#163C32]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Numbered Steps */}
            <div className="space-y-3 pt-1">
              {selectedGuide.steps.map((step) => (
                <div
                  key={step.number}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-1.5 transition-all hover:border-[#163C32]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-[#163C32] text-[#F1F0E9] flex items-center justify-center text-xs font-black font-mono shrink-0 shadow-xs">
                      {step.number}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#163C32]">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed text-[#1D2521]/90 pl-10 font-medium">
                    {step.description}
                  </p>
                  {step.caution && (
                    <div className="ml-10 mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-950 flex items-start space-x-2 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                      <span><strong>CAUTION:</strong> {step.caution}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Clinical Evidence & Provenance Citation */}
            {selectedGuide.sources && selectedGuide.sources.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#C4A66B]/25 text-[11px] text-[#7A5E2E] font-mono space-y-1">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-[#163C32]">
                  <BookOpen className="w-3.5 h-3.5 text-[#163C32]" />
                  <span>Clinical Sources & Review Provenance:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {selectedGuide.sources.map((src, sIdx) => (
                    <li key={sIdx}>
                      {src.name} {src.version ? `(${src.version})` : ''}
                    </li>
                  ))}
                </ul>
                {selectedGuide.reviewedBy && (
                  <p className="text-[10px] text-[#1D2521]/70">
                    Reviewed by: {selectedGuide.reviewedBy} • {selectedGuide.reviewedOn}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Call 112 Button for Mobile View (>= 56px touch target for one-handed emergency tap) */}
      <div className="sm:hidden sticky bottom-0 left-0 right-0 z-30 p-2 bg-white/95 backdrop-blur-md border-t border-[#B82819]/40">
        <a
          href="tel:112"
          className="min-h-[56px] w-full rounded-2xl bg-[#B82819] hover:bg-[#9E2013] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all"
        >
          <Phone className="w-5 h-5 animate-pulse" />
          <span>Call 112 Emergency Dispatch Now</span>
        </a>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-[#C4A66B]/25 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#7A5E2E] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-800" />
          <span>AHA, ERC & WHO Evidence-Based Protocols</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#163C32] text-[#F1F0E9] hover:bg-[#B82819] text-xs font-mono font-bold transition-all shadow-xs"
          >
            Close First Aid
          </button>
        )}
      </div>
    </div>
  );

  if (mode === 'inline') {
    return content;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#163C32]/65 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-aid-dialog-title"
    >
      {content}
    </div>
  );
};

export const FirstAidLibrary: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return <FirstAidModal mode="inline" onClose={onClose || (() => {})} />;
};
