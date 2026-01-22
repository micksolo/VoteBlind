import type { DebateSide } from '../../types';

interface DebateCharacterProps {
  side: DebateSide;
  className?: string;
}

// Left character: Blue-toned, progressive
// Right character: Purple/gold-toned, libertarian
// Center character: Teal-toned, centrist
// Simpsons-inspired simple cartoon style

export function DebateCharacter({ side, className = '' }: DebateCharacterProps) {
  if (side === 'left') {
    return (
      <svg
        viewBox="0 0 60 60"
        className={className}
        aria-label="Progressive character"
      >
        {/* Head */}
        <circle cx="30" cy="28" r="22" fill="#FFE0B2" />

        {/* Hair - spiky blue */}
        <ellipse cx="30" cy="12" rx="16" ry="8" fill="#1E88E5" />
        <ellipse cx="20" cy="14" rx="6" ry="10" fill="#1E88E5" />
        <ellipse cx="40" cy="14" rx="6" ry="10" fill="#1E88E5" />
        <circle cx="30" cy="8" r="5" fill="#1E88E5" />

        {/* Eyes */}
        <ellipse cx="23" cy="26" rx="5" ry="6" fill="white" />
        <ellipse cx="37" cy="26" rx="5" ry="6" fill="white" />
        <circle cx="24" cy="27" r="2.5" fill="#333" />
        <circle cx="38" cy="27" r="2.5" fill="#333" />
        <circle cx="24.5" cy="26" r="1" fill="white" />
        <circle cx="38.5" cy="26" r="1" fill="white" />

        {/* Eyebrows - determined */}
        <path d="M18 20 Q23 18 28 21" stroke="#1E88E5" strokeWidth="2" fill="none" />
        <path d="M32 21 Q37 18 42 20" stroke="#1E88E5" strokeWidth="2" fill="none" />

        {/* Nose */}
        <ellipse cx="30" cy="33" rx="3" ry="2" fill="#FFCC80" />

        {/* Mouth - slight smile */}
        <path d="M24 40 Q30 44 36 40" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Shirt collar hint */}
        <path d="M18 48 Q30 52 42 48" stroke="#1565C0" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // Center character
  if (side === 'center') {
    return (
      <svg
        viewBox="0 0 60 60"
        className={className}
        aria-label="Centrist character"
      >
        {/* Head */}
        <circle cx="30" cy="28" r="22" fill="#FFE0B2" />

        {/* Hair - medium wavy, teal */}
        <ellipse cx="30" cy="12" rx="17" ry="9" fill="#26A69A" />
        <path d="M13 18 Q15 12 20 14 Q18 22 14 20" fill="#26A69A" />
        <path d="M47 18 Q45 12 40 14 Q42 22 46 20" fill="#26A69A" />
        <ellipse cx="30" cy="10" rx="8" ry="5" fill="#4DB6AC" />

        {/* Eyes */}
        <ellipse cx="23" cy="26" rx="5" ry="6" fill="white" />
        <ellipse cx="37" cy="26" rx="5" ry="6" fill="white" />
        <circle cx="24" cy="27" r="2.5" fill="#333" />
        <circle cx="38" cy="27" r="2.5" fill="#333" />
        <circle cx="24.5" cy="26" r="1" fill="white" />
        <circle cx="38.5" cy="26" r="1" fill="white" />

        {/* Eyebrows - neutral, thoughtful */}
        <path d="M18 21 Q23 20 28 21" stroke="#00897B" strokeWidth="2" fill="none" />
        <path d="M32 21 Q37 20 42 21" stroke="#00897B" strokeWidth="2" fill="none" />

        {/* Nose */}
        <ellipse cx="30" cy="33" rx="3" ry="2" fill="#FFCC80" />

        {/* Mouth - gentle thoughtful smile */}
        <path d="M25 40 Q30 43 35 40" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Shirt collar hint - teal */}
        <path d="M18 48 Q30 52 42 48" stroke="#00897B" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // Right character
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      aria-label="Libertarian character"
    >
      {/* Head */}
      <circle cx="30" cy="28" r="22" fill="#FFE0B2" />

      {/* Hair - neat, golden/brown */}
      <ellipse cx="30" cy="14" rx="18" ry="10" fill="#8D6E63" />
      <path d="M12 20 Q14 10 22 12" fill="#8D6E63" />
      <path d="M48 20 Q46 10 38 12" fill="#8D6E63" />

      {/* Eyes */}
      <ellipse cx="23" cy="26" rx="5" ry="6" fill="white" />
      <ellipse cx="37" cy="26" rx="5" ry="6" fill="white" />
      <circle cx="24" cy="27" r="2.5" fill="#333" />
      <circle cx="38" cy="27" r="2.5" fill="#333" />
      <circle cx="24.5" cy="26" r="1" fill="white" />
      <circle cx="38.5" cy="26" r="1" fill="white" />

      {/* Eyebrows - confident */}
      <path d="M18 21 Q23 19 28 21" stroke="#5D4037" strokeWidth="2" fill="none" />
      <path d="M32 21 Q37 19 42 21" stroke="#5D4037" strokeWidth="2" fill="none" />

      {/* Nose */}
      <ellipse cx="30" cy="33" rx="3" ry="2" fill="#FFCC80" />

      {/* Mouth - confident smirk */}
      <path d="M24 40 Q30 43 36 39" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Shirt collar hint - gold/purple */}
      <path d="M18 48 Q30 52 42 48" stroke="#7B1FA2" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
