import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';

export function HomePage() {
  const { resetQuiz, completed, topicPositions, currentTopicIndex } = useQuizStore();
  const hasProgress = Object.keys(topicPositions).length > 0 || currentTopicIndex > 0;

  const handleStartFresh = () => {
    resetQuiz();
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">VB</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">VoteBlind</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover which parties align with your priorities.
              <br />
              No leading questions. Just your values.
            </p>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">How it works</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Rate your priorities</p>
                  <p className="text-sm text-gray-500">
                    Tell us which issues matter most to you
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Choose your approach</p>
                  <p className="text-sm text-gray-500">
                    Pick between balanced policy options
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">See your matches</p>
                  <p className="text-sm text-gray-500">
                    We compare your choices to party positions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            {hasProgress && !completed ? (
              <>
                <Link
                  to="/quiz"
                  className="block w-full py-4 px-6 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue Quiz
                </Link>
                <button
                  onClick={handleStartFresh}
                  className="block w-full py-4 px-6 bg-gray-200 text-gray-700 rounded-xl text-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Start Fresh
                </button>
              </>
            ) : completed ? (
              <>
                <Link
                  to="/results"
                  className="block w-full py-4 px-6 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Results
                </Link>
                <button
                  onClick={handleStartFresh}
                  className="block w-full py-4 px-6 bg-gray-200 text-gray-700 rounded-xl text-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Retake Quiz
                </button>
              </>
            ) : (
              <Link
                to="/quiz"
                className="block w-full py-4 px-6 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Quiz
              </Link>
            )}
          </div>

          {/* Privacy note */}
          <p className="mt-6 text-sm text-gray-500">
            Your answers stay on your device. We don't collect personal data.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
