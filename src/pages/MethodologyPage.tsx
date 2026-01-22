import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Methodology</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Calculate Alignment</h2>
          <p className="text-gray-600 mb-4">
            Informed Vote uses a weighted distance algorithm to compare your answers with
            party positions:
          </p>

          <h3 className="font-semibold text-gray-900 mt-6 mb-2">1. Question Responses</h3>
          <p className="text-gray-600 mb-4">
            Each question has a 5-point scale from "Strongly Disagree" (1) to "Strongly Agree" (5).
            Your response is compared to each party's position on the same scale.
          </p>

          <h3 className="font-semibold text-gray-900 mt-6 mb-2">2. Distance Calculation</h3>
          <p className="text-gray-600 mb-4">
            We use Manhattan distance to measure how far your answer is from each party's position.
            A perfect match (0 distance) scores 100%, while completely opposite (4 distance)
            scores 0%.
          </p>

          <h3 className="font-semibold text-gray-900 mt-6 mb-2">3. Importance Weighting</h3>
          <p className="text-gray-600 mb-4">
            Questions you mark as "important to me" receive double weight in the final calculation.
            This ensures the issues that matter most to you have more influence on your results.
          </p>

          <h3 className="font-semibold text-gray-900 mt-6 mb-2">4. Confidence Levels</h3>
          <p className="text-gray-600 mb-4">
            Party positions have different confidence levels based on how the position was determined:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li><strong>Explicit (100%)</strong> - Party explicitly stated this position in official policy</li>
            <li><strong>Inferred (75%)</strong> - Derived from voting records in parliament</li>
            <li><strong>Estimated (50%)</strong> - Based on similar positions or party alignment</li>
            <li><strong>Unknown (50%)</strong> - No data available, assumed neutral</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Sources</h2>
          <p className="text-gray-600 mb-4">
            Party positions are determined using the following sources:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Official party policy documents and platforms</li>
            <li>Voting records from They Vote For You</li>
            <li>Public statements by party leadership</li>
            <li>Parliamentary Hansard records</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Each party position includes a source citation so you can verify the information.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitations</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Party positions may change over time</li>
            <li>Not all policy nuances can be captured in a 5-point scale</li>
            <li>Independent candidates may have limited data</li>
            <li>Coalition parties (Liberal/National) may have different positions in some areas</li>
            <li>This tool covers major parties; some smaller parties may not be included</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Open Source</h2>
          <p className="text-gray-600 mb-4">
            Informed Vote is open source. You can review our code, data, and methodology on GitHub.
            We welcome contributions and feedback from the community.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-2 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            View on GitHub
          </a>
        </div>

        <Link
          to="/"
          className="inline-block py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
