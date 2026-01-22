import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DebateBubble } from './DebateBubble';
import type { DebateMessage, SliderPosition, DebateSide } from '../../types';

interface DebateViewProps {
  debate: DebateMessage[];
  selectedSide?: SliderPosition;
  // Interactive mode props
  isInteractive?: boolean;
  isGenerating?: boolean;
  streamingText?: string;
  error?: string | null;
  canContinue?: boolean;
  onContinue?: (userQuestion?: string) => void;
  maxMessages?: number;
}

export function DebateView({
  debate,
  selectedSide,
  isInteractive = false,
  isGenerating = false,
  streamingText = '',
  error = null,
  canContinue = false,
  onContinue,
  maxMessages = 20,
}: DebateViewProps) {
  const [visibleCount, setVisibleCount] = useState(2);
  const [question, setQuestion] = useState('');
  const [showQuestionInput, setShowQuestionInput] = useState(false);

  const visibleMessages = debate.slice(0, visibleCount);
  const hasMorePregen = visibleCount < debate.length;
  const allPregenShown = visibleCount >= debate.length;
  const atLimit = debate.length >= maxMessages;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 2, debate.length));
  };

  const handleContinue = () => {
    if (onContinue && canContinue) {
      onContinue();
      setShowQuestionInput(false);
    }
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (onContinue && canContinue && question.trim()) {
      onContinue(question.trim());
      setQuestion('');
      setShowQuestionInput(false);
    }
  };

  // Determine which side is selected for highlighting
  const getIsSelected = (side: DebateSide): boolean | undefined => {
    if (selectedSide === undefined) return undefined;
    if (selectedSide === 0) return side === 'center';
    if (side === 'left') return selectedSide < 0;
    if (side === 'right') return selectedSide > 0;
    return undefined;
  };

  return (
    <div className="space-y-3">
      {/* Debate messages */}
      <AnimatePresence mode="sync">
        {visibleMessages.map((message, index) => (
          <DebateBubble
            key={`${message.side}-${index}-${message.text.slice(0, 20)}`}
            side={message.side}
            text={message.text}
            index={index}
            isSelected={getIsSelected(message.side)}
          />
        ))}
      </AnimatePresence>

      {/* Streaming indicator */}
      {isGenerating && streamingText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
        >
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-gray-500 truncate">{streamingText.slice(0, 50)}...</span>
        </motion.div>
      )}

      {/* Loading indicator (no streaming text yet) */}
      {isGenerating && !streamingText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 py-3"
        >
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-gray-500">Thinking...</span>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-red-500 py-2"
        >
          {error}
        </motion.div>
      )}

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-1"
      >
        {/* Show more pre-generated messages */}
        {hasMorePregen && (
          <button
            onClick={handleShowMore}
            disabled={isGenerating}
            className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1 hover:bg-gray-50 rounded-lg disabled:opacity-50"
          >
            <span>Keep going ({debate.length - visibleCount} more)</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {/* Interactive controls - shown when all pre-gen messages are visible */}
        {allPregenShown && isInteractive && !atLimit && (
          <div className="space-y-2">
            {!showQuestionInput ? (
              <div className="flex gap-2">
                <button
                  onClick={handleContinue}
                  disabled={isGenerating || !canContinue}
                  className="flex-1 py-2 text-xs text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-1 hover:bg-blue-50 rounded-lg border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Keep debating</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowQuestionInput(true)}
                  disabled={isGenerating || !canContinue}
                  className="flex-1 py-2 text-xs text-teal-600 hover:text-teal-700 transition-colors flex items-center justify-center gap-1 hover:bg-teal-50 rounded-lg border border-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Ask a question</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleAskQuestion} className="space-y-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What would you like to know?"
                  disabled={isGenerating}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuestionInput(false)}
                    disabled={isGenerating}
                    className="flex-1 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors hover:bg-gray-50 rounded-lg border border-gray-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating || !question.trim()}
                    className="flex-1 py-2 text-xs text-white bg-teal-600 hover:bg-teal-700 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Asking...' : 'Ask'}
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-xs text-gray-400">
              {debate.length}/{maxMessages} messages
            </p>
          </div>
        )}

        {/* Conversation limit reached */}
        {atLimit && (
          <p className="text-center text-xs text-gray-400 py-2">
            Conversation limit reached ({maxMessages} messages)
          </p>
        )}

        {/* Non-interactive end of debate */}
        {allPregenShown && !isInteractive && debate.length > 2 && (
          <p className="text-center text-xs text-gray-400 py-2">
            End of debate
          </p>
        )}
      </motion.div>
    </div>
  );
}
