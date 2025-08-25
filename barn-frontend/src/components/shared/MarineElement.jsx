import React from "react";
import { DESIGN_TOKENS } from '../../constants/designTokens';

/*
  MarineElement.jsx
  - Redesigned marine-themed React components with enhanced visual appeal
  - Features modern design with glass-morphism effects, improved animations, and consistent styling
  - Built with inline SVGs + enhanced CSS animations optimized for Vite + Tailwind CSS
  - Integrated with project design tokens for consistency

  Usage:
    - import { Fish, Crab, SunkenShip, Seaweed, Coral, Starfish, Jellyfish } from './MarineElement';
    - Use components like: <Fish size={120} opacity={0.2} animationSpeed={4} />
*/

/* Enhanced keyframes for smoother, more appealing animations with glass-morphism effects */
const Animations = () => (
  <style>
    {`
    @keyframes marine-float {
      0% { transform: translateY(0px) scale(1); opacity: 0.15; }
      25% { opacity: 0.25; }
      50% { transform: translateY(-12px) scale(1.02); opacity: 0.3; }
      75% { opacity: 0.25; }
      100% { transform: translateY(0px) scale(1); opacity: 0.15; }
    }
    @keyframes marine-sway {
      0% { transform: rotate(-2deg) scale(1); }
      33% { transform: rotate(2deg) scale(1.01); }
      66% { transform: rotate(-1deg) scale(0.99); }
      100% { transform: rotate(-2deg) scale(1); }
    }
    @keyframes marine-drift {
      0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.15; }
      25% { opacity: 0.25; }
      50% { transform: translateY(-16px) translateX(8px) rotate(1deg); opacity: 0.3; }
      75% { opacity: 0.25; }
      100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.15; }
    }
    @keyframes marine-pulse {
      0% { transform: scale(1); opacity: 0.15; }
      50% { transform: scale(1.05); opacity: 0.3; }
      100% { transform: scale(1); opacity: 0.15; }
    }
    @keyframes marine-bubble {
      0% { transform: translateY(0) scale(0.8); opacity: 0.4; }
      50% { opacity: 0.6; }
      100% { transform: translateY(-100px) scale(1.2); opacity: 0; }
    }
    @keyframes marine-gentle-sway {
      0% { transform: rotate(-1deg); }
      50% { transform: rotate(1deg); }
      100% { transform: rotate(-1deg); }
    }
    .marine-element {
      filter: drop-shadow(0 4px 8px rgba(6, 182, 212, 0.1));
      backdrop-filter: blur(1px);
    }
    .marine-element:hover {
      filter: drop-shadow(0 6px 12px rgba(6, 182, 212, 0.2));
      backdrop-filter: blur(2px);
    }
    `}
  </style>
);

export function Fish({ size = 100, opacity = 0.2, className = '', animationSpeed = 6, flip = false, ariaLabel = 'decorative fish' }) {
  const randomDelay = Math.random() * 3;
  const transform = flip ? 'scaleX(-1)' : undefined;
  const gradientId = `fishGradient-${Math.random()}`;
  
  return (
    <div
      className={`inline-block marine-element pointer-events-none ${className}`}
      style={{ 
        width: size, 
        height: size, 
        opacity,
        animation: `marine-float ${animationSpeed}s ease-in-out ${randomDelay}s infinite`,
        zIndex: -1
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ transform }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={DESIGN_TOKENS.colors.primary[400]} />
            <stop offset="50%" stopColor={DESIGN_TOKENS.colors.secondary[400]} />
            <stop offset="100%" stopColor={DESIGN_TOKENS.colors.primary[600]} />
          </linearGradient>
        </defs>
        <g transform="translate(10,10)">
          <ellipse cx="40" cy="30" rx="30" ry="18" fill={`url(#${gradientId})`} opacity="0.8" />
          <polygon 
            points="70,30 88,40 70,50" 
            fill={DESIGN_TOKENS.colors.secondary[500]} 
            opacity="0.9"
            style={{ 
              transformOrigin: '72px 40px', 
              animation: `marine-gentle-sway ${animationSpeed * 0.8}s ease-in-out infinite` 
            }} 
          />
          <circle cx="30" cy="26" r="4" fill="rgba(255,255,255,0.9)" />
          <circle cx="30" cy="26" r="2" fill={DESIGN_TOKENS.colors.gray[800]} />
          <path 
            d="M22 36 q6 6 18 4" 
            fill="none" 
            stroke={DESIGN_TOKENS.colors.primary[300]} 
            strokeWidth="1.5" 
            opacity="0.6" 
          />
        </g>
      </svg>
    </div>
  );
}

export function Crab({ size = 120, opacity = 0.25, className = '', animationSpeed = 4, ariaLabel = 'decorative crab' }) {
  const randomDelay = Math.random() * 2;
  const gradientId = `crabGradient-${Math.random()}`;
  
  return (
    <div
      className={`inline-block marine-element pointer-events-none ${className}`}
      style={{ 
        width: size, 
        height: size, 
        opacity,
        animation: `marine-pulse ${animationSpeed}s ease-in-out ${randomDelay}s infinite`,
        zIndex: -1
      }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={DESIGN_TOKENS.colors.secondary[400]} />
            <stop offset="70%" stopColor={DESIGN_TOKENS.colors.primary[500]} />
            <stop offset="100%" stopColor={DESIGN_TOKENS.colors.primary[700]} />
          </radialGradient>
        </defs>
        <g transform="translate(10,10)">
          <ellipse cx="50" cy="60" rx="36" ry="22" fill={`url(#${gradientId})`} opacity="0.9" />
          <circle cx="38" cy="38" r="6" fill="rgba(255,255,255,0.95)" />
          <circle cx="38" cy="38" r="3" fill={DESIGN_TOKENS.colors.gray[800]} />
          <circle cx="62" cy="38" r="6" fill="rgba(255,255,255,0.95)" />
          <circle cx="62" cy="38" r="3" fill={DESIGN_TOKENS.colors.gray[800]} />
          
          <g stroke={DESIGN_TOKENS.colors.primary[600]} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8">
            <path d="M20 70 q-12 8 -18 12" />
            <path d="M100 70 q12 8 18 12" />
            <path d="M28 78 q-8 8 -14 12" />
            <path d="M92 78 q8 8 14 12" />
          </g>

          <g transform="translate(0,0)">
            <g style={{ transformOrigin: '16px 54px', animation: `marine-gentle-sway ${animationSpeed * 1.2}s ease-in-out infinite` }}>
              <circle cx="16" cy="54" r="10" fill={DESIGN_TOKENS.colors.secondary[500]} opacity="0.9" />
              <path d="M6 48 q-6 -8 -2 -14 q6 4 12 10" fill={DESIGN_TOKENS.colors.secondary[600]} opacity="0.8" />
            </g>

            <g transform="translate(68,0)" style={{ transformOrigin: '84px 54px', animation: `marine-gentle-sway ${animationSpeed * 1.3}s ease-in-out infinite` }}>
              <circle cx="16" cy="54" r="10" fill={DESIGN_TOKENS.colors.secondary[500]} opacity="0.9" />
              <path d="M6 48 q-6 -8 -2 -14 q6 4 12 10" fill={DESIGN_TOKENS.colors.secondary[600]} opacity="0.8" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

export function SunkenShip({ size = 240, className = '', ariaLabel = 'sunken ship' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <title>Sunken Ship</title>
        <g transform="translate(10,40)">
          <rect x="10" y="70" width="160" height="30" rx="6" fill="#4b5563" opacity="0.9" transform="rotate(-6 90 85)" />
          <rect x="20" y="48" width="80" height="22" rx="3" fill="#374151" opacity="0.9" transform="rotate(-6 60 59)" />
          <path d="M120 40 l18 -18 l6 6 l-18 18 z" fill="#111827" transform="rotate(-6 90 59)" />

          {/* Broken mast */}
          <rect x="70" y="-20" width="6" height="60" fill="#3f3f46" transform="rotate(-12 73 10)" />
          <path d="M74 24 l30 -12" stroke="#111827" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

          {/* Sand */}
          <ellipse cx="90" cy="120" rx="120" ry="28" fill="#bca27c" opacity="0.9" />

          {/* Bubbles */}
          <g>
            <circle cx="150" cy="40" r="6" fill="#93c5fd" opacity="0.7" style={{ animation: 'bubble-rise 3.5s linear infinite' }} />
            <circle cx="160" cy="80" r="4" fill="#bfdbfe" opacity="0.7" style={{ animation: 'bubble-rise 4.2s linear infinite', animationDelay: '0.6s' }} />
            <circle cx="30" cy="60" r="5" fill="#bfdbfe" opacity="0.7" style={{ animation: 'bubble-rise 5s linear infinite', animationDelay: '0.2s' }} />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function Seaweed({ height = 120, color = '#16a34a', className = '', swaySpeed = 4, ariaLabel = 'seaweed' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: 48, height }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 48 160" width={48} height={height}>
        <title>Seaweed</title>
        <g transform="translate(8,8)">
          <path d="M12 150 C8 110 28 90 12 50 C2 20 20 10 12 0" stroke="none" fill={color} transformOrigin="24px 80px" style={{ animation: `sway ${swaySpeed}s ease-in-out infinite` }} />
          <path d="M22 150 C18 110 38 90 22 50 C12 20 30 10 22 0" stroke="none" fill="#0ea5a4" opacity="0.85" transformOrigin="24px 80px" style={{ animation: `sway ${swaySpeed + 1}s ease-in-out 0.4s infinite` }} />
        </g>
      </svg>
    </div>
  );
}

export function Coral({ size = 120, className = '', ariaLabel = 'coral' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <title>Coral</title>
        <g transform="translate(10,20)">
          <path d="M20 80 C10 60 30 40 28 24 C40 10 60 20 56 34 C68 30 80 42 76 56 C90 58 102 74 88 86 C70 100 40 100 20 80" fill="#fb7185" />
          <circle cx="56" cy="30" r="6" fill="#fca5a5" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}

export function Starfish({ size = 80, color = '#f59e0b', className = '', ariaLabel = 'starfish' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size, animation: 'float 6s ease-in-out infinite' }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <title>Starfish</title>
        <path d="M50 8 L60 38 L92 38 L66 56 L76 88 L50 68 L24 88 L34 56 L8 38 L40 38 Z" fill={color} />
      </svg>
    </div>
  );
}

export function Jellyfish({ size = 140, bellColor = '#a78bfa', tentacleColor = '#c4b5fd', className = '', driftSpeed = 7, ariaLabel = 'jellyfish' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 1.1, animation: `drift ${driftSpeed}s ease-in-out infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 120 140" width={size} height={size * 1.1}>
        <title>Jellyfish</title>
        <g transform="translate(10,10)">
          <ellipse cx="50" cy="30" rx="40" ry="24" fill={bellColor} opacity="0.95" />
          <rect x="12" y="36" width="76" height="6" rx="3" fill={bellColor} opacity="0.85" />

          {/* Tentacles */}
          <g stroke={tentacleColor} strokeWidth="3" fill="none">
            <path d="M28 56 q6 18 12 28" strokeLinecap="round" />
            <path d="M44 56 q2 18 8 28" strokeLinecap="round" />
            <path d="M60 56 q-2 18 -6 30" strokeLinecap="round" />
            <path d="M76 56 q-6 18 -12 28" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function Turtle({ size = 140, shellColor = '#34d399', bodyColor = '#10b981', className = '', swimSpeed = 6, ariaLabel = 'turtle' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.8, animation: `drift ${swimSpeed}s ease-in-out ${Math.random() * 2}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 140 110" width={size} height={size * 0.8}>
        <title>Turtle</title>
        <g transform="translate(10,10)">
          <ellipse cx="60" cy="48" rx="44" ry="28" fill={shellColor} />
          <ellipse cx="60" cy="48" rx="28" ry="16" fill={bodyColor} opacity="0.9" />

          {/* Head */}
          <circle cx="18" cy="48" r="10" fill={bodyColor} />
          <circle cx="16" cy="46" r="3" fill="#000" />

          {/* Flippers */}
          <path d="M26 68 q-8 12 -18 18" fill={bodyColor} />
          <path d="M98 68 q8 12 18 18" fill={bodyColor} />
          <path d="M36 30 q-6 -8 -14 -10" fill={bodyColor} />
          <path d="M84 30 q6 -8 14 -10" fill={bodyColor} />
        </g>
      </svg>
    </div>
  );
}

export function Octopus({ size = 160, color = '#f472b6', tentacleColor = '#fbcfe8', className = '', waveSpeed = 5, ariaLabel = 'octopus' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.9, animation: `drift ${waveSpeed + 1}s ease-in-out ${Math.random() * 2}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 160 140" width={size} height={size * 0.9}>
        <title>Octopus</title>
        <g transform="translate(10,10)">
          <ellipse cx="70" cy="40" rx="48" ry="34" fill={color} />
          <circle cx="56" cy="36" r="6" fill="#fff" />
          <circle cx="56" cy="36" r="3" fill="#000" />
          <circle cx="84" cy="36" r="6" fill="#fff" />
          <circle cx="84" cy="36" r="3" fill="#000" />

          {/* Tentacles (simple waves) */}
          <g stroke={tentacleColor} strokeWidth="6" fill="none" strokeLinecap="round" style={{ transformOrigin: '70px 80px', animation: 'sway 4s ease-in-out infinite' }}>
            <path d="M30 70 q18 18 34 18" />
            <path d="M46 70 q10 24 28 28" />
            <path d="M62 72 q-6 26 -2 34" />
            <path d="M86 72 q6 26 2 34" />
            <path d="M100 70 q-10 22 -28 28" />
            <path d="M116 70 q-18 18 -34 18" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function Seahorse({ size = 120, color = '#f59e0b', className = '', swaySpeed = 5, ariaLabel = 'seahorse' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 1.2, animation: `float ${swaySpeed + 1}s ease-in-out ${Math.random() * 1}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 80 140" width={size} height={size * 1.2}>
        <title>Seahorse</title>
        <g transform="translate(4,4)">
          <path d="M40 8 C24 8 18 26 18 38 C18 58 30 62 36 78 C42 94 30 98 28 114 C46 110 58 94 58 94 C62 82 70 70 64 58 C58 46 44 44 44 32 C44 18 48 12 40 8 Z" fill={color} />
          <circle cx="44" cy="20" r="3" fill="#000" />
        </g>
      </svg>
    </div>
  );
}

export function Dolphin({ size = 180, color = '#60a5fa', className = '', leapSpeed = 5, ariaLabel = 'dolphin' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.6, animation: `float ${leapSpeed}s ease-in-out ${Math.random() * 1}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 200 100" width={size} height={size * 0.6}>
        <title>Dolphin</title>
        <g transform="translate(0,10)">
          <path d="M20 60 Q60 10 120 30 Q150 38 180 20 Q160 50 120 60 Q80 72 40 62 Q30 62 20 60 Z" fill={color} />
          <path d="M120 30 q10 -12 18 -8" fill="#fff" opacity="0.06" />
          <circle cx="60" cy="40" r="3" fill="#000" />
        </g>
      </svg>
    </div>
  );
}

export function Anchor({ size = 120, color = '#374151', className = '', ariaLabel = 'anchor' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <title>Anchor</title>
        <g transform="translate(12,12)">
          <circle cx="48" cy="12" r="8" fill={color} />
          <rect x="44" y="20" width="8" height="48" fill={color} />
          <path d="M12 80 q20 -16 36 -16 q16 0 36 16" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
}

export function MantaRay({ size = 180, color = '#94a3b8', className = '', glideSpeed = 7, ariaLabel = 'manta ray' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.6, animation: `drift ${glideSpeed}s ease-in-out ${Math.random() * 2}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 200 100" width={size} height={size * 0.6}>
        <title>Manta Ray</title>
        <g transform="translate(0,10)">
          <path d="M10 60 Q60 10 100 40 Q140 10 190 60 Q140 48 100 60 Q60 72 10 60 Z" fill={color} />
          <circle cx="98" cy="50" r="3" fill="#000" />
        </g>
      </svg>
    </div>
  );
}

export function Whale({ size = 260, color = '#2563eb', className = '', swimSpeed = 8, ariaLabel = 'whale' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.6, animation: `drift ${swimSpeed}s ease-in-out ${Math.random() * 2}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 260 160" width={size} height={size * 0.6}>
        <title>Whale</title>
        <g transform="translate(0,10)">
          <path d="M10 90 Q40 30 120 44 Q170 52 230 36 Q220 64 180 84 Q120 110 40 100 Q20 98 10 90 Z" fill={color} />
          <circle cx="120" cy="64" r="6" fill="#000" />
          <path d="M80 28 q8 -18 22 -18 q-6 14 -6 18 q-10 6 -16 0" fill="#93c5fd" opacity="0.6" style={{ animation: 'bubble-rise 3s linear infinite' }} />
        </g>
      </svg>
    </div>
  );
}

export function Lobster({ size = 140, color = '#ef4444', className = '', pinchSpeed = 1.5, ariaLabel = 'lobster' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size, animation: `float ${pinchSpeed + 2}s ease-in-out ${Math.random() * 1}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 140 140" width={size} height={size}>
        <title>Lobster</title>
        <g transform="translate(8,8)">
          <ellipse cx="60" cy="70" rx="36" ry="22" fill={color} />
          <circle cx="42" cy="48" r="6" fill="#fff" />
          <circle cx="42" cy="48" r="3" fill="#000" />

          {/* Tail */}
          <path d="M96 76 q18 10 28 6 q-4 6 -18 12 q-12 4 -22 -4" fill={color} />

          {/* Claws */}
          <g style={{ transformOrigin: '12px 64px', animation: 'claw-snap 1.6s ease-in-out infinite' }}>
            <path d="M6 60 q-10 -10 -6 -18 q8 6 14 12" fill={color} />
            <circle cx="10" cy="64" r="8" fill={color} />
          </g>

          <g transform="translate(64,0)" style={{ transformOrigin: '84px 64px', animation: 'claw-snap 1.8s ease-in-out infinite' }}>
            <path d="M6 60 q10 -10 6 -18 q-8 6 -14 12" fill={color} />
            <circle cx="10" cy="64" r="8" fill={color} />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function HermitCrab({ size = 110, shellColor = '#a78bfa', bodyColor = '#f97316', className = '', ariaLabel = 'hermit crab' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size, animation: `float 4.5s ease-in-out ${Math.random() * 1}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 110 110" width={size} height={size}>
        <title>Hermit Crab</title>
        <g transform="translate(6,6)">
          <path d="M28 56 q20 -30 56 -16 q-18 20 -46 28 q-12 2 -10 -12" fill={shellColor} />
          <ellipse cx="46" cy="66" rx="18" ry="10" fill={bodyColor} />
          <circle cx="40" cy="52" r="4" fill="#fff" />
          <circle cx="40" cy="52" r="2" fill="#000" />
        </g>
      </svg>
    </div>
  );
}

export function SeaUrchin({ size = 80, color = '#7c3aed', className = '', ariaLabel = 'sea urchin' }) {
  const spikes = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const x1 = 40 + Math.cos(angle) * 36;
    const y1 = 40 + Math.sin(angle) * 36;
    const x2 = 40 + Math.cos(angle) * 44;
    const y2 = 40 + Math.sin(angle) * 44;
    spikes.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeLinecap="round" />);
  }
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size, animation: 'float 5s ease-in-out infinite' }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <title>Sea Urchin</title>
        {spikes}
        <circle cx="40" cy="40" r="18" fill={color} />
      </svg>
    </div>
  );
}

export function Shell({ size = 80, color = '#fcd34d', className = '', ariaLabel = 'seashell' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 80 80" width={size} height={size}>
        <title>Shell</title>
        <path d="M10 60 C28 20 52 20 70 60 C50 55 40 52 20 60 C26 56 34 52 50 48" fill={color} />
      </svg>
    </div>
  );
}

export function Buoy({ size = 80, color = '#ef4444', stripeColor = '#ffffff', className = '', floatSpeed = 6, ariaLabel = 'buoy' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 1.4, animation: `drift ${floatSpeed}s ease-in-out ${Math.random() * 1}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 80 112" width={size} height={size * 1.4}>
        <title>Buoy</title>
        <g transform="translate(8,8)">
          <ellipse cx="36" cy="80" rx="22" ry="10" fill={color} />
          <rect x="18" y="20" width="36" height="60" rx="18" fill={color} />
          <rect x="18" y="36" width="36" height="12" rx="6" fill={stripeColor} />
          <line x1="36" y1="90" x2="36" y2="110" stroke="#374151" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export function Lighthouse({ size = 180, towerColor = '#f97316', roofColor = '#111827', className = '', beam = true, ariaLabel = 'lighthouse' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 1.1 }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 180 200" width={size} height={size * 1.1}>
        <title>Lighthouse</title>
        <g transform="translate(10,10)">
          <rect x="56" y="40" width="48" height="120" rx="6" fill={towerColor} />
          <rect x="64" y="20" width="32" height="24" rx="4" fill={roofColor} />
          <circle cx="80" cy="32" r="6" fill="#fef3c7" />
          {beam && <path d="M80 32 L-10 -40 L-10 104 Z" fill="#fde68a" opacity="0.12" transform="rotate(-12 80 32)" />}
          <ellipse cx="80" cy="168" rx="84" ry="16" fill="#bca27c" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}

export function Submarine({ size = 220, color = '#0ea5a4', className = '', ariaLabel = 'submarine' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.5, animation: 'drift 8s ease-in-out 0s infinite' }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 220 110" width={size} height={size * 0.5}>
        <title>Submarine</title>
        <g transform="translate(0,10)">
          <rect x="8" y="36" width="160" height="36" rx="18" fill={color} />
          <circle cx="140" cy="54" r="10" fill="#fff" />
          <rect x="150" y="20" width="24" height="20" rx="6" fill={color} />
          <rect x="172" y="28" width="18" height="6" rx="3" fill="#111827" />
        </g>
      </svg>
    </div>
  );
}

export function Sailboat({ size = 160, hullColor = '#7c3aed', sailColor = '#fff', className = '', ariaLabel = 'sailboat' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.7 }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 160 110" width={size} height={size * 0.7}>
        <title>Sailboat</title>
        <g transform="translate(0,10)">
          <path d="M20 80 Q60 60 120 80 Q92 100 40 96 Q24 92 20 80 Z" fill={hullColor} />
          <rect x="76" y="12" width="4" height="60" fill="#374151" />
          <path d="M80 14 L120 56 L80 56 Z" fill={sailColor} />
        </g>
      </svg>
    </div>
  );
}

export function MessageBottle({ size = 100, bottleColor = '#93c5fd', paperColor = '#fef3c7', className = '', ariaLabel = 'message in a bottle' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 1.4, animation: 'float 6s ease-in-out infinite' }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 80 112" width={size} height={size * 1.4}>
        <title>Message in a Bottle</title>
        <g transform="translate(8,8)">
          <rect x="18" y="18" width="36" height="64" rx="12" fill={bottleColor} opacity="0.9" />
          <rect x="26" y="30" width="24" height="28" fill={paperColor} rx="2" />
          <circle cx="36" cy="20" r="6" fill="#6b7280" />
        </g>
      </svg>
    </div>
  );
}

export function Shark({ size = 220, color = '#475569', className = '', speed = 6, ariaLabel = 'shark' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.5, animation: `drift ${speed}s ease-in-out ${Math.random() * 2}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 220 110" width={size} height={size * 0.5}>
        <title>Shark</title>
        <g transform="translate(0,10)">
          <path d="M10 60 Q60 10 120 30 Q160 44 200 34 Q170 56 130 66 Q90 76 40 68 Q20 66 10 60 Z" fill={color} />
          <circle cx="120" cy="44" r="3" fill="#000" />
        </g>
      </svg>
    </div>
  );
}

export function Hammerhead({ size = 220, color = '#64748b', className = '', speed = 6, ariaLabel = 'hammerhead shark' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.45, animation: `drift ${speed + 1}s ease-in-out ${Math.random() * 2}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 220 100" width={size} height={size * 0.45}>
        <title>Hammerhead</title>
        <g transform="translate(0,10)">
          <path d="M10 60 Q60 16 120 28 Q170 34 200 58 Q170 44 120 50 Q80 54 40 50 Q22 48 10 60 Z" fill={color} />
          <rect x="30" y="20" width="80" height="12" rx="6" fill={color} transform="translate(-8,0)" />
          <circle cx="140" cy="44" r="3" fill="#000" />
        </g>
      </svg>
    </div>
  );
}

export function Pufferfish({ size = 100, color = '#f59e0b', className = '', puff = false, ariaLabel = 'pufferfish' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size, animation: puff ? 'float 3s ease-in-out infinite' : 'float 6s ease-in-out infinite' }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <title>Pufferfish</title>
        <g transform="translate(8,8)">
          <circle cx="44" cy="44" r={puff ? 34 : 22} fill={color} />
          <circle cx="32" cy="36" r="4" fill="#fff" />
          <circle cx="32" cy="36" r="2" fill="#000" />
          {/* spikes */}
          {[...Array(10)].map((_,i)=>{const a=(i/10)*Math.PI*2;const x=44+Math.cos(a)*((puff?34:22)+6);const y=44+Math.sin(a)*((puff?34:22)+6);return <line key={i} x1={44+Math.cos(a)*(puff?34:22)} y1={44+Math.sin(a)*(puff?34:22)} x2={x} y2={y} stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>})}
        </g>
      </svg>
    </div>
  );
}

export function Clownfish({ size = 90, color = '#fb923c', stripeColor = '#fff', className = '', swimSpeed = 5, ariaLabel = 'clownfish' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size, animation: `float ${swimSpeed}s ease-in-out ${Math.random()*1}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 90 90" width={size} height={size}>
        <title>Clownfish</title>
        <g transform="translate(6,6)">
          <ellipse cx="36" cy="36" rx="28" ry="18" fill={color} />
          <path d="M12 30 q8 6 16 6" fill={stripeColor} />
          <path d="M28 46 q10 6 20 2" fill={stripeColor} />
          <circle cx="26" cy="34" r="3" fill="#000" />
          <polygon points="62,30 74,36 62,42" fill="#fb6f6f" />
        </g>
      </svg>
    </div>
  );
}

export function Angelfish({ size = 100, color = '#60a5fa', accent = '#fbbf24', className = '', swimSpeed = 5, ariaLabel = 'angelfish' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size, animation: `float ${swimSpeed}s ease-in-out ${Math.random()*1}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <title>Angelfish</title>
        <g transform="translate(6,6)">
          <ellipse cx="40" cy="36" rx="28" ry="22" fill={color} />
          <path d="M16 24 L2 8 L12 42 Z" fill={accent} />
          <path d="M72 24 L88 8 L76 42 Z" fill={accent} />
          <circle cx="32" cy="30" r="3" fill="#000" />
        </g>
      </svg>
    </div>
  );
}

export function MorayEel({ size = 180, color = '#16a34a', className = '', glideSpeed = 8, ariaLabel = 'moray eel' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.4, animation: `drift ${glideSpeed}s ease-in-out ${Math.random()*2}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 180 72" width={size} height={size * 0.4}>
        <title>Moray Eel</title>
        <g transform="translate(0,8)">
          <path d="M10 40 C40 10 80 10 120 30 C140 40 160 48 180 40" stroke={color} strokeWidth="12" strokeLinecap="round" fill="none" />
          <circle cx="30" cy="30" r="3" fill="#000" />
        </g>
      </svg>
    </div>
  );
}

export function Shrimp({ size = 80, color = '#fb7185', className = '', wiggleSpeed = 4, ariaLabel = 'shrimp' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.6, animation: `float ${wiggleSpeed}s ease-in-out ${Math.random()*1}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 80 48" width={size} height={size * 0.6}>
        <title>Shrimp</title>
        <g transform="translate(4,4)">
          <path d="M8 24 q8 -10 20 -8 q10 2 18 8 q6 6 10 6" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="12" cy="22" r="2" fill="#000" />
        </g>
      </svg>
    </div>
  );
}

export function Krill({ size = 60, color = '#fb923c', className = '', ariaLabel = 'krill' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.4, animation: 'float 4s ease-in-out infinite' }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 60 24" width={size} height={size * 0.4}>
        <title>Krill</title>
        <g transform="translate(4,4)">
          <ellipse cx="12" cy="10" rx="8" ry="4" fill={color} />
          <ellipse cx="28" cy="10" rx="6" ry="3" fill={color} />
          <ellipse cx="44" cy="10" rx="5" ry="2.5" fill={color} />
        </g>
      </svg>
    </div>
  );
}

export function Orca({ size = 260, color = '#0f172a', accent = '#fff', className = '', glideSpeed = 9, ariaLabel = 'orca' }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * 0.6, animation: `drift ${glideSpeed}s ease-in-out ${Math.random()*2}s infinite` }} role="img" aria-label={ariaLabel}>
      <svg viewBox="0 0 260 160" width={size} height={size * 0.6}>
        <title>Orca</title>
        <g transform="translate(0,10)">
          <path d="M10 90 Q60 30 120 44 Q170 52 230 36 Q220 64 180 84 Q120 110 40 100 Q20 98 10 90 Z" fill={color} />
          <path d="M120 60 q18 -6 36 -2 q-6 12 -14 16 q-18 6 -22 -14" fill={accent} />
          <circle cx="120" cy="64" r="6" fill="#000" />
        </g>
      </svg>
    </div>
  );
}

// Enhanced Demo component
export default function MarineDemo() {
  return (
    <section className="p-6 bg-gradient-to-b from-sky-50 via-sky-100 to-sky-200 min-h-screen">
      <Animations />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-sky-800">Enhanced Marine Elements — Demo</h2>

        <p className="mb-6 text-sky-700">Redesigned marine components with modern styling, glass-morphism effects, and integrated design tokens for visual consistency.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div className="flex flex-col items-center gap-2">
            <Fish size={110} opacity={0.25} />
            <span className="text-sm text-sky-700">Enhanced Fish</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Crab size={110} opacity={0.3} />
            <span className="text-sm text-sky-700">Gradient Crab</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Jellyfish size={140} opacity={0.25} />
            <span className="text-sm text-sky-700">Glass Jellyfish</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Starfish size={80} opacity={0.3} />
            <span className="text-sm text-sky-700">Textured Starfish</span>
          </div>

          <div className="col-span-2 md:col-span-4 mt-4">
            <p className="text-sm text-sky-600">Enhanced with glass-morphism effects, gradient backgrounds, improved animations, and consistent design tokens for better visual appeal and performance.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
