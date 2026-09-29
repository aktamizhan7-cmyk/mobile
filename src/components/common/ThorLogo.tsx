import React from 'react';

interface ThorLogoProps {
  variant?: 'full' | 'emblem' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  glow?: boolean;
  className?: string;
  subtext?: string;
}

export const ThorLogo: React.FC<ThorLogoProps> = ({
  variant = 'full',
  size = 'md',
  glow = true,
  className = '',
  subtext = 'MOBILE BRAND',
}) => {
  // Dimension mapper
  const getDimensions = () => {
    if (typeof size === 'number') {
      return { width: size, height: variant === 'emblem' || variant === 'icon' ? size : Math.round(size * 0.65) };
    }
    switch (size) {
      case 'xs':
        return variant === 'emblem' || variant === 'icon' ? { width: 24, height: 24 } : { width: 44, height: 28 };
      case 'sm':
        return variant === 'emblem' || variant === 'icon' ? { width: 36, height: 36 } : { width: 80, height: 50 };
      case 'md':
        return variant === 'emblem' || variant === 'icon' ? { width: 48, height: 48 } : { width: 140, height: 86 };
      case 'lg':
        return variant === 'emblem' || variant === 'icon' ? { width: 72, height: 72 } : { width: 200, height: 122 };
      case 'xl':
        return variant === 'emblem' || variant === 'icon' ? { width: 96, height: 96 } : { width: 280, height: 170 };
      default:
        return { width: 140, height: 86 };
    }
  };

  const { width, height } = getDimensions();

  // If Icon or Emblem variant: Sleek Orbital Ring with Electric Lightning Bolt
  if (variant === 'icon' || variant === 'emblem') {
    return (
      <svg
        viewBox="0 0 100 100"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none transition-all ${className}`}
        aria-label="THOR Logo Emblem"
      >
        <defs>
          {/* Metallic Silver Ring Gradient */}
          <linearGradient id="thor_ring_metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="30%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="70%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Electric Blue Neon Glow */}
          <linearGradient id="thor_blue_glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Lightning Core Gradient */}
          <linearGradient id="thor_lightning_core" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="80%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Neon Lightning Glow Filter */}
          <filter id="thor_neon_glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Outer Ring Glow Filter */}
          <filter id="thor_ring_ambient" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blue_blur" />
            <feMerge>
              <feMergeNode in="blue_blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Orbital Cyan Glow Rings */}
        {glow && (
          <>
            <path
              d="M 22 35 A 40 40 0 0 1 75 18"
              stroke="#00f0ff"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.85"
              filter="url(#thor_ring_ambient)"
            />
            <path
              d="M 28 80 A 40 40 0 0 0 82 62"
              stroke="#0284c7"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.85"
              filter="url(#thor_ring_ambient)"
            />
          </>
        )}

        {/* Metallic Orbital Ring Body */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#thor_ring_metal)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="251"
          strokeDashoffset="0"
        />

        {/* Inner Ring Highlight */}
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="url(#thor_blue_glow)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.7"
        />

        {/* Center Metallic Ring 'O' */}
        <circle
          cx="50"
          cy="50"
          r="23"
          stroke="url(#thor_ring_metal)"
          strokeWidth="6.5"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="23"
          stroke="#38bdf8"
          strokeWidth="1"
          fill="none"
          opacity="0.9"
        />

        {/* Electric Cyan Neon Lightning Bolt cutting through Center */}
        {/* Glow backdrop */}
        <path
          d="M 59 18 L 41 47 L 54 47 L 39 82 L 63 43 L 50 43 Z"
          fill="#00f0ff"
          opacity="0.75"
          filter="url(#thor_neon_glow)"
        />
        {/* Sharp Vector Bolt */}
        <path
          d="M 59 18 L 41 47 L 54 47 L 39 82 L 63 43 L 50 43 Z"
          fill="url(#thor_lightning_core)"
          stroke="#f0f9ff"
          strokeWidth="1"
          strokeLinejoin="miter"
        />
        {/* Core hot white gleam */}
        <path
          d="M 57 23 L 44 46 L 53 46 L 43 74 L 60 44 L 51 44 Z"
          fill="#ffffff"
          opacity="0.9"
        />
      </svg>
    );
  }

  // Full Horizontal Signature Logo (Matches user's exact uploaded image)
  return (
    <svg
      viewBox="0 0 360 220"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-all ${className}`}
      aria-label="THOR Mobile Brand Logo"
    >
      <defs>
        {/* Metallic Brushed Titanium/Silver Letter Gradient */}
        <linearGradient id="thor_metal_face" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="15%" stopColor="#e2e8f0" />
          <stop offset="45%" stopColor="#cbd5e1" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="85%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Chamfer Edge Metallic Highlights */}
        <linearGradient id="thor_bevel_top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        {/* Orbital Ring Steel Gradient */}
        <linearGradient id="thor_ring_steel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="25%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="75%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Electric Blue Neon Underglow */}
        <linearGradient id="thor_electric_neon" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Hot Lightning Bolt Core */}
        <linearGradient id="thor_lightning_bolt" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#bae6fd" />
          <stop offset="60%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* High-intensity Glow Filter for Neon Accents */}
        <filter id="thor_flare_glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Sub-bevel Drop Shadow */}
        <filter id="thor_sub_shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* 1. BACKGROUND ORBITAL RING & NEON EDGE LIGHTING */}
      {/* Top-left electric blue backlight glow */}
      {glow && (
        <path
          d="M 120 70 A 90 90 0 0 1 240 40"
          stroke="#00f0ff"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.9"
          filter="url(#thor_flare_glow)"
        />
      )}

      {/* Bottom-right electric blue rim light */}
      {glow && (
        <path
          d="M 115 170 A 90 90 0 0 0 255 160"
          stroke="#00d8ff"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.9"
          filter="url(#thor_flare_glow)"
        />
      )}

      {/* Main Circular Orbital Ring */}
      <circle
        cx="180"
        cy="110"
        r="88"
        stroke="url(#thor_ring_steel)"
        strokeWidth="6"
        fill="none"
        filter="url(#thor_sub_shadow)"
      />
      {/* Inner Ring Glow Accent */}
      <circle
        cx="180"
        cy="110"
        r="85"
        stroke="url(#thor_electric_neon)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />

      {/* 2. CHISELED METALLIC "THOR" LETTERING */}
      <g filter="url(#thor_sub_shadow)">
        {/* --- LETTER T --- */}
        {/* Blue underglow bevel */}
        <polygon points="20,80 88,80 84,94 63,94 63,148 45,148 45,94 28,94" fill="#0284c7" />
        {/* Face */}
        <polygon
          points="22,78 88,78 82,92 63,92 63,146 47,146 47,92 30,92"
          fill="url(#thor_metal_face)"
          stroke="#f8fafc"
          strokeWidth="0.8"
        />
        {/* Top chamfer highlight */}
        <polygon points="22,78 88,78 86,81 24,81" fill="#ffffff" />
        {/* Left wedge aerodynamic angle */}
        <polygon points="22,78 30,92 20,80" fill="#cbd5e1" />
        {/* Cyan edge reflection */}
        <line x1="22" y1="81" x2="48" y2="81" stroke="#38bdf8" strokeWidth="1.5" />

        {/* --- LETTER H --- */}
        {/* Blue underglow */}
        <polygon
          points="102,80 120,80 120,105 148,105 148,80 166,80 166,148 148,148 148,121 120,121 120,148 102,148"
          fill="#0284c7"
        />
        {/* Face */}
        <polygon
          points="104,78 120,78 120,103 148,103 148,78 164,78 164,146 148,146 148,119 120,119 120,146 104,146"
          fill="url(#thor_metal_face)"
          stroke="#f8fafc"
          strokeWidth="0.8"
        />
        {/* Highlights */}
        <line x1="104" y1="79" x2="120" y2="79" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="148" y1="79" x2="164" y2="79" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="120" y1="104" x2="148" y2="104" stroke="#38bdf8" strokeWidth="1.2" />

        {/* --- LETTER O --- */}
        {/* Outer Ring */}
        <circle cx="214" cy="112" r="34" fill="url(#thor_metal_face)" stroke="#f8fafc" strokeWidth="0.8" />
        {/* Inner Cutout */}
        <circle cx="214" cy="112" r="18" fill="#090d16" />
        {/* Inner Ring Metal Rim */}
        <circle cx="214" cy="112" r="18" stroke="url(#thor_metal_face)" strokeWidth="2.5" fill="none" />
        <circle cx="214" cy="112" r="19" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.8" />

        {/* --- LETTER R --- */}
        {/* Blue underglow */}
        <path
          d="M 252 80 L 298 80 C 316 80 326 90 326 102 C 326 112 318 120 306 122 L 334 148 L 312 148 L 288 123 L 270 123 L 270 148 L 252 148 Z"
          fill="#0284c7"
        />
        {/* Face */}
        <path
          d="M 254 78 L 298 78 C 316 78 325 88 325 100 C 325 110 317 118 305 120 L 332 146 L 310 146 L 286 121 L 270 121 L 270 146 L 254 146 Z M 270 94 L 295 94 C 302 94 308 97 308 103 C 308 109 302 112 295 112 L 270 112 Z"
          fill="url(#thor_metal_face)"
          stroke="#f8fafc"
          strokeWidth="0.8"
        />
        {/* Top & Leg chamfers */}
        <line x1="254" y1="79" x2="298" y2="79" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="288" y1="121" x2="332" y2="146" stroke="#38bdf8" strokeWidth="1.5" />
      </g>

      {/* 3. ELECTRIC CYAN LIGHTNING BOLT (Slices dynamically across the 'O') */}
      {/* Intense Cyan Neon Under-glow */}
      <path
        d="M 235 60 L 195 115 L 218 115 L 188 168 L 235 107 L 210 107 Z"
        fill="#00f0ff"
        opacity="0.85"
        filter="url(#thor_flare_glow)"
      />
      {/* Front Sharp Lightning Core */}
      <path
        d="M 235 60 L 195 115 L 218 115 L 188 168 L 235 107 L 210 107 Z"
        fill="url(#thor_lightning_bolt)"
        stroke="#e0f2fe"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
      {/* Hot white central energy arc */}
      <path
        d="M 231 68 L 200 113 L 215 113 L 196 156 L 230 110 L 212 110 Z"
        fill="#ffffff"
        opacity="0.95"
      />

      {/* 4. SUBTITLE: "MOBILE BRAND" WITH WINGED HORIZON LINES */}
      <g opacity="0.95">
        {/* Left Wing Divider */}
        <line x1="48" y1="178" x2="88" y2="178" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="48" y1="178" x2="75" y2="178" stroke="#ffffff" strokeWidth="0.8" />

        {/* Text */}
        <text
          x="180"
          y="182"
          textAnchor="middle"
          fill="#f1f5f9"
          fontSize="11"
          fontWeight="800"
          fontFamily="'JetBrains Mono', 'Plus Jakarta Sans', system-ui, sans-serif"
          letterSpacing="0.42em"
          style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.6)' }}
        >
          {subtext}
        </text>

        {/* Right Wing Divider */}
        <line x1="272" y1="178" x2="312" y2="178" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="285" y1="178" x2="312" y2="178" stroke="#ffffff" strokeWidth="0.8" />
      </g>
    </svg>
  );
};
