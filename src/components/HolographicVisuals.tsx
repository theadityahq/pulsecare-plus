import React from 'react';
import { PulseCareEmblem } from './PulseCareEmblem';

// 1. Future Clinic Anatomical Heart with ECG Telemetry
export const HolographicHeart: React.FC = () => {
  return (
    <div className="relative w-full h-36 flex items-center justify-center overflow-hidden">
      {/* Background warm radial glow */}
      <div className="absolute inset-0 bg-radial from-[#D94736]/20 via-[#163C32]/10 to-transparent blur-xl pointer-events-none" />

      {/* SVG Heart Art with restrained editorial linework */}
      <svg
        viewBox="0 0 200 160"
        className="w-32 h-28 drop-shadow-[0_4px_16px_rgba(217,71,54,0.35)]"
      >
        <defs>
          <linearGradient id="clinicHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF5A48" />
            <stop offset="60%" stopColor="#D94736" />
            <stop offset="100%" stopColor="#9E271B" />
          </linearGradient>
          <linearGradient id="clinicVesselsGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#D94736" />
            <stop offset="100%" stopColor="#C7AE7B" />
          </linearGradient>
        </defs>

        {/* Aorta & Pulmonary Arteries in Champagne & Vermilion */}
        <path
          d="M85 35 Q85 15 105 15 Q120 15 125 35"
          fill="none"
          stroke="url(#clinicVesselsGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M72 40 L72 20"
          fill="none"
          stroke="#C7AE7B"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Cardiac Ventricle Silhouette */}
        <path
          d="M100 45 C80 20 40 25 40 65 C40 100 85 130 100 145 C115 130 160 100 160 65 C160 25 120 20 100 45 Z"
          fill="url(#clinicHeartGrad)"
          stroke="#F4F0E6"
          strokeWidth="1.5"
          opacity="0.95"
        />

        {/* Coronary Perfusion Vectors */}
        <path
          d="M100 45 Q90 85 70 115"
          fill="none"
          stroke="#F4F0E6"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M105 55 Q120 85 130 105"
          fill="none"
          stroke="#C7AE7B"
          strokeWidth="1.75"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      {/* Live ECG Waveform Overlay in Vermilion & Champagne */}
      <div className="absolute inset-x-0 bottom-2 h-7 flex items-center justify-center opacity-90">
        <svg viewBox="0 0 300 40" className="w-full h-full">
          <path
            d="M0 20 L70 20 L80 20 L85 12 L90 28 L95 2 L102 36 L108 16 L114 20 L125 20 L200 20 L210 20 L215 12 L220 28 L225 2 L232 36 L238 16 L244 20 L300 20"
            fill="none"
            stroke="#D94736"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

// 2. Future Clinic Neural Triage Brain Visual
export const HolographicBrain: React.FC = () => {
  return (
    <div className="relative w-full h-36 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-radial from-[#C7AE7B]/15 via-[#163C32]/10 to-transparent blur-xl pointer-events-none" />

      <svg viewBox="0 0 200 160" className="w-32 h-28 drop-shadow-[0_4px_16px_rgba(199,174,123,0.35)]">
        {/* Left Cerebral Hemisphere */}
        <path
          d="M95 30 C75 30 50 45 45 70 C40 90 48 110 65 125 C75 133 90 135 95 135 Z"
          fill="none"
          stroke="#C7AE7B"
          strokeWidth="2"
        />
        <path
          d="M95 50 C80 50 65 60 60 78 C58 92 65 105 78 115"
          fill="none"
          stroke="#F4F0E6"
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* Right Cerebral Hemisphere */}
        <path
          d="M105 30 C125 30 150 45 155 70 C160 90 152 110 135 125 C125 133 110 135 105 135 Z"
          fill="none"
          stroke="#C7AE7B"
          strokeWidth="2"
        />
        <path
          d="M105 50 C120 50 135 60 140 78 C142 92 135 105 122 115"
          fill="none"
          stroke="#F4F0E6"
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* Synaptic Geometric Care Nodes */}
        <circle cx="95" cy="80" r="4" fill="#D94736" />
        <circle cx="105" cy="80" r="4" fill="#D94736" />
        <circle cx="75" cy="65" r="3" fill="#C7AE7B" />
        <circle cx="125" cy="65" r="3" fill="#C7AE7B" />
        <circle cx="80" cy="100" r="3" fill="#F4F0E6" />
        <circle cx="120" cy="100" r="3" fill="#F4F0E6" />

        {/* Inter-hemispheric Bridges */}
        <line x1="75" y1="65" x2="95" y2="80" stroke="#C7AE7B" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="125" y1="65" x2="105" y2="80" stroke="#C7AE7B" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="95" y1="80" x2="105" y2="80" stroke="#F4F0E6" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

// 3. Future Clinic Shield Visual (Emergency Preparation)
export const HolographicShield: React.FC = () => {
  return (
    <div className="relative w-full h-36 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-radial from-[#C7AE7B]/15 via-[#163C32]/10 to-transparent blur-xl pointer-events-none" />

      <svg viewBox="0 0 200 160" className="w-32 h-28 drop-shadow-[0_4px_16px_rgba(199,174,123,0.3)]">
        {/* Outer Clinical Shield Contour */}
        <path
          d="M100 20 L150 40 V85 C150 120 100 145 100 145 C100 145 50 120 50 85 V40 Z"
          fill="none"
          stroke="#C7AE7B"
          strokeWidth="2"
        />
        {/* Inner Protective Membrane */}
        <path
          d="M100 30 L140 46 V82 C140 110 100 132 100 132 C100 132 60 110 60 82 V46 Z"
          fill="#163C32"
          stroke="#F4F0E6"
          strokeWidth="1.5"
          opacity="0.9"
        />
        {/* Center Cross / Caduceus Symbol */}
        <rect x="94" y="55" width="12" height="40" rx="3" fill="#F4F0E6" />
        <rect x="80" y="69" width="40" height="12" rx="3" fill="#F4F0E6" />
        <circle cx="100" cy="75" r="4" fill="#D94736" />
      </svg>
    </div>
  );
};

// 4. Future Clinic Community Network Visual
export const HolographicCommunity: React.FC = () => {
  return (
    <div className="relative w-full h-36 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-radial from-[#C7AE7B]/15 via-[#163C32]/10 to-transparent blur-xl pointer-events-none" />

      <svg viewBox="0 0 200 160" className="w-36 h-28 drop-shadow-[0_4px_16px_rgba(199,174,123,0.3)]">
        {/* Center Responder */}
        <g transform="translate(88, 48)">
          <circle cx="12" cy="12" r="8" fill="#F4F0E6" />
          <path d="M12 24 L12 55 M12 36 L0 48 M12 36 L24 48 M12 55 L3 80 M12 55 L21 80" stroke="#F4F0E6" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Left Community Member */}
        <g transform="translate(52, 60)" opacity="0.85">
          <circle cx="10" cy="10" r="6" fill="#C7AE7B" />
          <path d="M10 20 L10 46 M10 30 L1 40 M10 30 L19 40 M10 46 L3 66 M10 46 L17 66" stroke="#C7AE7B" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Right Community Member */}
        <g transform="translate(128, 60)" opacity="0.85">
          <circle cx="10" cy="10" r="6" fill="#C7AE7B" />
          <path d="M10 20 L10 46 M10 30 L1 40 M10 30 L19 40 M10 46 L3 66 M10 46 L17 66" stroke="#C7AE7B" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Telemetric Sync Arc */}
        <path d="M62 90 Q100 80 138 90" fill="none" stroke="#D94736" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>
    </div>
  );
};

// 5. PulseCare Geometric Emblem (replacing old line-art female face)
export const HolographicAIAvatar: React.FC = () => {
  return (
    <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
      <PulseCareEmblem size={130} />
    </div>
  );
};
