import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';

function getAlignmentDescription(score: number): string {
  if (score >= 80) return 'Strongly aligned';
  if (score >= 65) return 'Well aligned';
  if (score >= 50) return 'Moderately aligned';
  if (score >= 35) return 'Somewhat aligned';
  return 'Weakly aligned';
}

function getAlignmentColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

export function ResultsPage() {
  const navigate = useNavigate();
  const { results, electorate, resetQuiz, calculateResults, completed, topicPositions } =
    useQuizStore();

  // Recalculate results if we have data but no results
  useEffect(() => {
    if (completed && Object.keys(topicPositions).length > 0 && !results) {
      calculateResults();
    }
  }, [completed, topicPositions, results, calculateResults]);

  // Redirect to quiz if no data
  useEffect(() => {
    if (!completed || Object.keys(topicPositions).length === 0) {
      navigate('/quiz');
    }
  }, [completed, topicPositions, navigate]);

  const handleStartOver = () => {
    resetQuiz();
    navigate('/');
  };

  if (!results || results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Calculating your results...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        </div>
      </div>
    );
  }

  const topMatch = results[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Results</h1>
          <p className="text-gray-600">
            Based on your policy positions
          </p>
        </motion.div>

        {/* Top Match Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2"
          style={{ borderColor: topMatch.party.color }}
        >
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
              Best Match
            </p>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: topMatch.party.color }}
            >
              {topMatch.party.name}
            </h2>
            <div
              className="text-4xl font-bold mb-2"
              style={{ color: topMatch.party.color }}
            >
              {topMatch.score}%
            </div>
            <p className={`text-sm ${getAlignmentColor(topMatch.score)}`}>
              {getAlignmentDescription(topMatch.score)}
            </p>
          </div>
        </motion.div>

        {/* All Party Results */}
        <div className="space-y-3 mb-8">
          {results.map((result, index) => (
            <motion.div
              key={result.party.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: result.party.color }}
                  />
                  <span className="font-medium text-gray-900">
                    {result.party.short_name}
                  </span>
                </div>
                <span
                  className="font-bold text-lg"
                  style={{ color: result.party.color }}
                >
                  {result.score}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: result.party.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                />
              </div>

              {/* Breakdown preview */}
              {result.breakdown.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1">
                    {result.breakdown.slice(0, 4).map((item) => (
                      <span
                        key={item.topic.id}
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.aligned
                            ? 'bg-green-100 text-green-700'
                            : item.distance <= 2
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.topic.icon}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Electorate Info */}
        {electorate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-xl p-4 mb-6"
          >
            <h3 className="font-semibold text-blue-900 mb-2">Your Electorate</h3>
            <p className="text-blue-800">{electorate}</p>
          </motion.div>
        )}

        {/* AEC Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-100 rounded-xl p-4 mb-6"
        >
          <h3 className="font-semibold text-gray-900 mb-3">Ready to Vote?</h3>
          <div className="space-y-2">
            <a
              href="https://www.aec.gov.au/enrol/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-white rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Check your enrollment
            </a>
            <a
              href="https://www.aec.gov.au/Voting/How_to_Vote/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-white rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            >
              How to vote
            </a>
            <a
              href="https://electorate.aec.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 px-4 bg-white rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Find your polling place
            </a>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-gray-500 text-center mb-6"
        >
          <p className="mb-2">
            This tool provides general guidance based on publicly available policy
            information. Results should not be considered voting advice.
          </p>
          <p>Informed Vote is not affiliated with the AEC or any political party.</p>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to="/quiz"
            className="flex-1 text-center py-3 px-4 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Review Answers
          </Link>
          <button
            onClick={handleStartOver}
            className="flex-1 py-3 px-4 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
