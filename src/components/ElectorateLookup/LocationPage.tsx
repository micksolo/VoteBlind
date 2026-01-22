import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizStore } from '../../store/quizStore';
import electorateData from '../../data/electorates.json';

interface LocalityInfo {
  suburb: string;
  electorate: string;
  state: string;
}

interface PostcodeLookup {
  localities: LocalityInfo[];
  singleElectorate: boolean;
  electorate?: string;
  state?: string;
}

type ElectorateIndex = Record<string, PostcodeLookup>;

export function LocationPage() {
  const navigate = useNavigate();
  const { postcode, setPostcode, setElectorate } = useQuizStore();
  const [inputValue, setInputValue] = useState(postcode);
  const [lookupResults, setLookupResults] = useState<PostcodeLookup | null>(null);
  const [selectedSuburb, setSelectedSuburb] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Get unique electorates for multi-electorate postcodes
  const uniqueElectorates = useMemo(() => {
    if (!lookupResults || lookupResults.singleElectorate) return [];

    const electorateMap = new Map<string, { electorate: string; state: string; suburbs: string[] }>();

    for (const loc of lookupResults.localities) {
      if (!electorateMap.has(loc.electorate)) {
        electorateMap.set(loc.electorate, {
          electorate: loc.electorate,
          state: loc.state,
          suburbs: [],
        });
      }
      electorateMap.get(loc.electorate)!.suburbs.push(loc.suburb);
    }

    return Array.from(electorateMap.values());
  }, [lookupResults]);

  const handleLookup = () => {
    setError(null);
    setLookupResults(null);
    setSelectedSuburb('');

    const normalizedPostcode = inputValue.padStart(4, '0');

    if (!inputValue || inputValue.length !== 4 || !/^\d{4}$/.test(inputValue)) {
      setError('Please enter a valid 4-digit Australian postcode');
      return;
    }

    const result = (electorateData as ElectorateIndex)[normalizedPostcode];

    if (!result) {
      setError(
        'Postcode not found in our database. Please check your postcode or use the AEC website below.'
      );
      return;
    }

    setPostcode(normalizedPostcode);
    setLookupResults(result);

    // Auto-select and proceed if single electorate
    if (result.singleElectorate && result.electorate) {
      setElectorate(result.electorate);
    }
  };

  const handleSelectElectorate = (electorate: string) => {
    setElectorate(electorate);
    navigate('/results');
  };

  const handleSuburbChange = (suburb: string) => {
    setSelectedSuburb(suburb);
    const locality = lookupResults?.localities.find((l) => l.suburb === suburb);
    if (locality) {
      setElectorate(locality.electorate);
    }
  };

  const handleContinue = () => {
    navigate('/results');
  };

  const handleSkip = () => {
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Electorate</h1>
          <p className="text-gray-600">
            Enter your postcode to see candidates in your area
          </p>
        </motion.div>

        {/* Postcode Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Postcode
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              placeholder="e.g. 2000"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <button
              onClick={handleLookup}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Look Up
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Single Electorate Result */}
        {lookupResults?.singleElectorate && lookupResults.electorate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Your electorate:</h3>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xl font-bold text-blue-900">{lookupResults.electorate}</div>
              <div className="text-sm text-blue-700">{lookupResults.state}</div>
            </div>
            <button
              onClick={handleContinue}
              className="w-full mt-4 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Results
            </button>
          </motion.div>
        )}

        {/* Multi-Electorate Result - By Electorate */}
        {lookupResults && !lookupResults.singleElectorate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h3 className="font-semibold text-gray-900 mb-2">
              Your postcode covers {uniqueElectorates.length} electorates
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select your electorate, or choose your suburb below to find your exact electorate.
            </p>

            {/* Electorate selection */}
            <div className="space-y-2 mb-4">
              {uniqueElectorates.map((item) => (
                <button
                  key={item.electorate}
                  onClick={() => handleSelectElectorate(item.electorate)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                >
                  <div className="font-medium text-gray-900">{item.electorate}</div>
                  <div className="text-sm text-gray-500">
                    {item.state} - includes {item.suburbs.slice(0, 3).join(', ')}
                    {item.suburbs.length > 3 && ` +${item.suburbs.length - 3} more`}
                  </div>
                </button>
              ))}
            </div>

            {/* Suburb dropdown for exact lookup */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or select your suburb for exact match:
              </label>
              <select
                value={selectedSuburb}
                onChange={(e) => handleSuburbChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your suburb...</option>
                {lookupResults.localities.map((loc) => (
                  <option key={`${loc.suburb}-${loc.electorate}`} value={loc.suburb}>
                    {loc.suburb} ({loc.electorate})
                  </option>
                ))}
              </select>

              {selectedSuburb && (
                <button
                  onClick={handleContinue}
                  className="w-full mt-4 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Results
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* AEC Fallback */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-100 rounded-xl p-4 mb-6"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Not sure about your electorate?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Use the official AEC tool to find your exact electorate based on your address.
          </p>
          <a
            href="https://electorate.aec.gov.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 px-4 bg-white rounded-lg text-blue-600 hover:bg-blue-50 transition-colors border border-gray-200"
          >
            Open AEC Electorate Finder
          </a>
        </motion.div>

        {/* Skip Option */}
        <button
          onClick={handleSkip}
          className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          Skip and see results without electorate info
        </button>
      </div>
    </div>
  );
}
