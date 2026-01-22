import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DebateBubble } from './DebateBubble';
import type { DebateMessage, SliderPosition } from '../../types';

interface DebateViewProps {
  debate: DebateMessage[];
  selectedSide?: SliderPosition; // negative = left, positive = right, 0 = neutral
}

export function DebateView({ debate, selectedSide }: DebateViewProps) {
  const [visibleCount, setVisibleCount] = useState(2);

  const visibleMessages = debate.slice(0, visibleCount);
  const hasMore = visibleCount < debate.length;
  const isComplete = visibleCount >= debate.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 2, debate.length));
  };

  // Determine which side is selected for highlighting
  const getIsSelected = (side: 'left' | 'right'): boolean | undefined => {
    if (selectedSide === undefined || selectedSide === 0) return undefined;
    if (side === 'left') return selectedSide < 0;
    return selectedSide > 0;
  };

  return (
    <div className="space-y-3">
      {/* Debate messages */}
      <AnimatePresence mode="sync">
        {visibleMessages.map((message, index) => (
          <DebateBubble
            key={`${message.side}-${index}`}
            side={message.side}
            text={message.text}
            index={index}
            isSelected={getIsSelected(message.side)}
          />
        ))}
      </AnimatePresence>

      {/* Show more / End of debate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-1"
      >
        {hasMore ? (
          <button
            onClick={handleShowMore}
            className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1 hover:bg-gray-50 rounded-lg"
          >
            <span>Keep going ({debate.length - visibleCount} more)</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : isComplete && debate.length > 2 ? (
          <p className="text-center text-xs text-gray-400 py-2">
            End of debate
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}
