import React, { useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';

interface AIHospitalLocatorProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyHospital: (hospital: string) => void;
  postcode: string;
}

export function AIHospitalLocator({
  isOpen,
  onClose,
  onApplyHospital,
  postcode,
}: AIHospitalLocatorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locatedHospital, setLocatedHospital] = useState<string | null>(null);

  const handleLocateHospital = async () => {
    if (!postcode || postcode.trim() === '') {
      setError('Please enter a site postcode first before using Auto Locate.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = `Find the nearest NHS Accident & Emergency (A&E) department to the UK postcode: ${postcode}

Please provide the following information in a clear, concise format:
- Hospital Name
- Full Address
- Postcode
- Distance from ${postcode} (approximate)
- Contact Number (main hospital switchboard)

Format the response as plain text with clear labeling. Only include verified NHS hospitals with A&E departments. If the postcode is invalid or you cannot determine the nearest hospital, please state that clearly.`;

      // Make the actual API call to OpenAI
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
              (import.meta as any).env.VITE_OPENAI_API_KEY
            }`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content:
                  "You are a helpful assistant specializing in UK healthcare and emergency services. Your task is to identify the nearest NHS Accident & Emergency (A&E) department to a given UK postcode. Provide accurate, up-to-date information about NHS hospitals with A&E facilities. Always verify that the hospital has a full A&E department (not just an urgent care centre). Format your response as plain text without any markdown formatting (no asterisks, no bold, no special characters). Use simple labels like 'Hospital Name:', 'Address:', etc. with clear line breaks.",
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Get the response text
      const hospitalInfo = data.choices[0].message.content;
      setLocatedHospital(hospitalInfo);
    } catch (err) {
      console.error('Error locating nearest hospital:', err);
      setError(
        'Failed to locate nearest hospital. Please try again or enter manually.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyHospital = () => {
    if (locatedHospital) {
      onApplyHospital(locatedHospital);
      onClose();
    }
  };

  const handleClose = () => {
    setLocatedHospital(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 z-50"></div>
      <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg-xl p-6 max-w-2xl w-full m-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Auto Locate Nearest Hospital
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will use AI to find the nearest NHS Accident & Emergency
              (A&E) department based on the site postcode:{' '}
              <strong>{postcode || 'Not entered'}</strong>
            </p>

            {!locatedHospital && (
              <button
                onClick={handleLocateHospital}
                disabled={loading || !postcode}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Locating Nearest Hospital...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Locate Nearest A&E Hospital
                  </>
                )}
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {locatedHospital && (
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                Nearest A&E Hospital
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-80 overflow-y-auto">
                {locatedHospital}
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyHospital}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Apply Hospital Information
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
