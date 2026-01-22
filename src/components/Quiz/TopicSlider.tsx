import { motion } from 'framer-motion';
import { DebateView } from '../Debate';
import type { PolicyTopic, SliderPosition } from '../../types';

interface TopicSliderProps {
  topic: PolicyTopic;
  topicNumber: number;
  totalTopics: number;
  value: SliderPosition | undefined;
  onChange: (position: SliderPosition) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoBack: boolean;
  isLast: boolean;
}

const positions: SliderPosition[] = [-2, -1, 0, 1, 2];

export function TopicSlider({
  topic,
  topicNumber,
  totalTopics,
  value,
  onChange,
  onNext,
  onPrevious,
  canGoBack,
  isLast,
}: TopicSliderProps) {
  const progress = (topicNumber / totalTopics) * 100;

  return (
    <div className="max-w-md mx-auto">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{topicNumber} of {totalTopics}</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Topic Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        {/* Icon & Name */}
        <div className="text-center mb-4">
          <span className="text-2xl mb-1 block">{topic.icon}</span>
          <h2 className="text-lg font-bold text-gray-900">{topic.name}</h2>
        </div>

        {/* Debate View */}
        <div className="mb-4">
          <DebateView debate={topic.debate} selectedSide={value} />
        </div>

        {/* Slider Buttons */}
        <div className="flex gap-1 mb-2">
          {positions.map((pos) => {
            const isSelected = value === pos;
            const isLeft = pos < 0;
            const isNeutral = pos === 0;

            let bgColor = 'bg-gray-100 hover:bg-gray-200';
            let textColor = 'text-gray-600';

            if (isSelected) {
              if (isNeutral) {
                bgColor = 'bg-gray-400';
                textColor = 'text-white';
              } else if (isLeft) {
                bgColor = 'bg-blue-500';
                textColor = 'text-white';
              } else {
                bgColor = 'bg-purple-500';
                textColor = 'text-white';
              }
            }

            let label = '';
            if (pos === -2) label = 'Strongly';
            if (pos === -1) label = 'Lean';
            if (pos === 0) label = 'Neutral';
            if (pos === 1) label = 'Lean';
            if (pos === 2) label = 'Strongly';

            return (
              <button
                key={pos}
                onClick={() => onChange(pos)}
                className={`flex-1 py-3 rounded-lg transition-all ${bgColor} ${textColor} ${
                  isSelected ? 'shadow-md scale-105' : ''
                }`}
              >
                <span className="text-xs font-medium block">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Axis labels */}
        <div className="flex justify-between text-xs text-gray-400 px-1">
          <span>← {topic.leftLabel}</span>
          <span>{topic.rightLabel} →</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onPrevious}
          disabled={!canGoBack}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
            canGoBack
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={value === undefined}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
            value !== undefined
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLast ? 'See Results' : 'Next'}
        </button>
      </div>
    </div>
  );
}
