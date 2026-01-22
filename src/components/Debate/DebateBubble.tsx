import { motion } from 'framer-motion';
import { DebateCharacter } from './DebateCharacter';
import type { DebateSide } from '../../types';

interface DebateBubbleProps {
  side: DebateSide;
  text: string;
  index: number;
  isSelected?: boolean;
}

export function DebateBubble({ side, text, index, isSelected }: DebateBubbleProps) {
  const isLeft = side === 'left';
  const isRight = side === 'right';
  const isCenter = side === 'center';

  // Container classes based on side
  const containerClasses = isCenter
    ? 'flex flex-col items-center gap-2'
    : `flex items-end gap-2 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`;

  // Animation - slightly different for center
  const animationProps = {
    initial: { opacity: 0, y: isCenter ? 15 : 10, scale: isCenter ? 0.9 : 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      duration: isCenter ? 0.4 : 0.3,
      delay: index * 0.4,
      ease: 'easeOut' as const,
    },
  };

  // Bubble styling
  let bubbleClasses = 'relative px-3 py-2 rounded-2xl text-sm';

  if (isLeft) {
    bubbleClasses += ` max-w-[75%] bg-blue-100 text-blue-900 rounded-bl-sm`;
    if (isSelected === true) bubbleClasses += ' ring-2 ring-blue-500';
  } else if (isRight) {
    bubbleClasses += ` max-w-[75%] bg-purple-100 text-purple-900 rounded-br-sm`;
    if (isSelected === true) bubbleClasses += ' ring-2 ring-purple-500';
  } else {
    // Center - teal with dashed border, no tail
    bubbleClasses += ` max-w-[85%] bg-teal-50 text-teal-900 border border-dashed border-teal-300`;
    if (isSelected === true) bubbleClasses += ' ring-2 ring-teal-500';
  }

  return (
    <motion.div {...animationProps} className={containerClasses}>
      {/* Character avatar */}
      <div className="flex-shrink-0">
        <DebateCharacter side={side} className="w-10 h-10" />
      </div>

      {/* Speech bubble */}
      <div className={bubbleClasses}>
        {/* Bubble tail - only for left/right */}
        {!isCenter && (
          <div
            className={`
              absolute bottom-0 w-3 h-3
              ${isLeft
                ? 'left-0 -translate-x-1 bg-blue-100'
                : 'right-0 translate-x-1 bg-purple-100'
              }
            `}
            style={{
              clipPath: isLeft
                ? 'polygon(100% 0, 100% 100%, 0 100%)'
                : 'polygon(0 0, 100% 100%, 0 100%)',
            }}
          />
        )}
        <p className="relative z-10 leading-snug">{text}</p>
      </div>
    </motion.div>
  );
}
