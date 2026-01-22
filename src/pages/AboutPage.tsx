import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Informed Vote</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What is Informed Vote?</h2>
          <p className="text-gray-600 mb-4">
            Informed Vote is an independent, non-partisan tool designed to help Australian voters
            discover which political parties align with their values and priorities.
          </p>
          <p className="text-gray-600 mb-4">
            Instead of asking which party you support, we ask about the issues that matter to you.
            Your answers are then compared to the publicly stated positions of major parties
            to show you where you align.
          </p>
          <p className="text-gray-600">
            This tool does not tell you how to vote. It provides information to help you
            make your own informed decision.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy</h2>
          <p className="text-gray-600 mb-4">
            Informed Vote is designed with privacy as a core principle:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Your answers are stored only on your device (in browser storage)</li>
            <li>We do not collect any personal information</li>
            <li>We do not track your activity</li>
            <li>We do not use advertising cookies</li>
            <li>Your data is never sent to our servers</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Independence</h2>
          <p className="text-gray-600 mb-4">
            Informed Vote is:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Not affiliated with the Australian Electoral Commission</li>
            <li>Not affiliated with any political party</li>
            <li>Not funded by any political organisation</li>
            <li>Open source - our code and methodology are publicly available</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
          <p className="text-gray-600">
            The information provided by Informed Vote is for general informational purposes only.
            Party positions are based on publicly available policy documents and may not reflect
            the full complexity of each party's stance. Always verify information with official
            party sources. This tool does not constitute voting advice.
          </p>
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
