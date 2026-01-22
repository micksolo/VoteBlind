import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DebateBubble } from './DebateBubble';
import type { DebateMessage, SliderPosition } from '../../types';

interface DebateViewProps {
  debate: DebateMessage[];
  selectedSide?: SliderPosition; // negative = left, positive = right, 0 = neutral
}

export function DebateView({ debate, selectedSide }: DebateViewProps) {
  const [expanded, setExpanded] = useState(false);

  // Show first 2 messages initially, all 4 when expanded
  const visibleMessages = expanded ? debate : debate.slice(0, 2);
  const hasMore = debate.length > 2;

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
            index={expanded ? index : index} // Reset animation index when expanding
            isSelected={getIsSelected(message.side)}
          />
        ))}
      </AnimatePresence>

      {/* Expand/collapse button */}
      {hasMore && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
        >
          {expanded ? (
            <>
              <span>Show less</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Tap for more debate</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}
