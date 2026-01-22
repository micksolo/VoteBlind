import { motion } from 'framer-motion';
import { DebateCharacter } from './DebateCharacter';

interface DebateBubbleProps {
  side: 'left' | 'right';
  text: string;
  index: number;
  isSelected?: boolean;
}

export function DebateBubble({ side, text, index, isSelected }: DebateBubbleProps) {
  const isLeft = side === 'left';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.4, // Stagger animation
        ease: 'easeOut',
      }}
      className={`flex items-end gap-2 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Character avatar */}
      <div className="flex-shrink-0">
        <DebateCharacter
          side={side}
          className="w-10 h-10"
        />
      </div>

      {/* Speech bubble */}
      <div
        className={`
          relative max-w-[75%] px-3 py-2 rounded-2xl text-sm
          ${isLeft
            ? `bg-blue-100 text-blue-900 rounded-bl-sm ${isSelected === true ? 'ring-2 ring-blue-500' : ''}`
            : `bg-purple-100 text-purple-900 rounded-br-sm ${isSelected === false ? 'ring-2 ring-purple-500' : ''}`
          }
        `}
      >
        {/* Bubble tail */}
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
        <p className="relative z-10 leading-snug">{text}</p>
      </div>
    </motion.div>
  );
}
