import React from 'react';

interface Props {
  className?: string;
  size?: number;
}

export const PulseCareEmblem: React.FC<Props> = ({ className = '', size = 120 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Soft Radiance (Champagne & Forest Green) */}
      <div className="absolute inset-0 bg-radial from-[#C4A66B]/20 via-[#173E35]/10 to-transparent blur-xl pointer-events-none" />

      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_4px_24px_rgba(199,174,123,0.35)]"
      >
        <defs>
          <linearGradient id="emblemIvoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F1F0E9" />
            <stop offset="100%" stopColor="#E0DCD1" />
          </linearGradient>

          <linearGradient id="emblemChampagneGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9E804A" />
            <stop offset="50%" stopColor="#C4A66B" />
            <stop offset="100%" stopColor="#DCBE8A" />
          </linearGradient>

          <linearGradient id="emblemVermilionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E35849" />
            <stop offset="100%" stopColor="#D44A3C" />
          </linearGradient>
        </defs>

        {/* 1. Outer Fine Compass Orbit Rings */}
        <circle
          cx="100"
          cy="100"
          r="84"
          fill="none"
          stroke="#C4A66B"
          strokeWidth="1"
          strokeDasharray="3 6"
          opacity="0.45"
        />
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke="#F1F0E9"
          strokeWidth="0.75"
          opacity="0.25"
        />

        {/* 2. Cardinal Precision Tick Marks */}
        <line x1="100" y1="12" x2="100" y2="20" stroke="#C4A66B" strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="180" x2="100" y2="188" stroke="#C4A66B" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="100" x2="20" y2="100" stroke="#C4A66B" strokeWidth="2" strokeLinecap="round" />
        <line x1="180" y1="100" x2="188" y2="100" stroke="#C4A66B" strokeWidth="2" strokeLinecap="round" />

        {/* 3. Intersecting Elliptical Orbits (Telemetric Care Arcs) */}
        <ellipse
          cx="100"
          cy="100"
          rx="66"
          ry="30"
          transform="rotate(-28 100 100)"
          fill="none"
          stroke="url(#emblemChampagneGrad)"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.8"
        />
        <ellipse
          cx="100"
          cy="100"
          rx="66"
          ry="30"
          transform="rotate(28 100 100)"
          fill="none"
          stroke="url(#emblemChampagneGrad)"
          strokeWidth="2"
          opacity="0.4"
        />

        {/* 4. Central Geometric Medical Cross (Warm Ivory Architectural Silhouette) */}
        {/* Horizontal Bar */}
        <rect
          x="62"
          y="88"
          width="76"
          height="24"
          rx="6"
          fill="url(#emblemIvoryGrad)"
          stroke="#173E35"
          strokeWidth="2"
        />
        {/* Vertical Bar */}
        <rect
          x="88"
          y="62"
          width="24"
          height="76"
          rx="6"
          fill="url(#emblemIvoryGrad)"
          stroke="#173E35"
          strokeWidth="2"
        />

        {/* 5. Center Diamond Pulse Node (Vermilion Core) */}
        <rect
          x="94"
          y="94"
          width="12"
          height="12"
          transform="rotate(45 100 100)"
          fill="url(#emblemVermilionGrad)"
          stroke="#F1F0E9"
          strokeWidth="1.5"
        />

        {/* 6. Orbital Biometric Satellite Nodes */}
        <circle cx="152" cy="74" r="3.5" fill="#C4A66B" />
        <circle cx="48" cy="126" r="3.5" fill="#C4A66B" />
      </svg>
    </div>
  );
};
