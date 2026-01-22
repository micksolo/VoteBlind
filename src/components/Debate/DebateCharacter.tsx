interface DebateCharacterProps {
  side: 'left' | 'right';
  className?: string;
}

// Left character: Blue-toned, progressive
// Right character: Purple/gold-toned, libertarian
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
