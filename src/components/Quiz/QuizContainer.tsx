import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TopicSlider } from './TopicSlider';
import { useQuizStore } from '../../store/quizStore';
import { POLICY_TOPICS, PARTIES, PARTY_POSITIONS } from '../../data/topicsData';
import type { SliderPosition } from '../../types';

export function QuizContainer() {
  const navigate = useNavigate();
  const {
    topics,
    topicPositions,
    currentTopicIndex,
    completed,
    setTopics,
    setParties,
    setPartyPositions,
    setTopicPosition,
    nextTopic,
    previousTopic,
    finishQuiz,
  } = useQuizStore();

  // Load data on mount
  useEffect(() => {
    if (topics.length === 0) {
      setTopics(POLICY_TOPICS);
      setParties(PARTIES);
      setPartyPositions(PARTY_POSITIONS);
    }
  }, [topics.length, setTopics, setParties, setPartyPositions]);

  // Redirect when complete
  useEffect(() => {
    if (completed) {
      navigate('/location');
    }
  }, [completed, navigate]);

  // Handlers
  const handleChange = useCallback(
    (position: SliderPosition) => {
      const topic = topics[currentTopicIndex];
      if (topic) {
        setTopicPosition(topic.id, position);
      }
    },
    [topics, currentTopicIndex, setTopicPosition]
  );

  const handleNext = useCallback(() => {
    if (currentTopicIndex === topics.length - 1) {
      finishQuiz();
    } else {
      nextTopic();
    }
  }, [currentTopicIndex, topics.length, finishQuiz, nextTopic]);

  // Loading state
  if (topics.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const currentTopic = topics[currentTopicIndex];
  const isLast = currentTopicIndex === topics.length - 1;

  if (!currentTopic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTopicIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <TopicSlider
            topic={currentTopic}
            topicNumber={currentTopicIndex + 1}
            totalTopics={topics.length}
            value={topicPositions[currentTopic.id]}
            onChange={handleChange}
            onNext={handleNext}
            onPrevious={previousTopic}
            canGoBack={currentTopicIndex > 0}
            isLast={isLast}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
