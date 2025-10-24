
import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  
  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Assume success and optimistically update the UI.
      // The main component will re-verify if an API call fails.
      onKeySelected();
    } catch (e) {
      console.error("Error opening API key selection dialog:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 text-center">
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          API Key Required
        </h2>
        <p className="text-gray-400 mb-6">
          To generate videos with Veo, you need to select an API key. This will be used for your requests.
        </p>
        <button
          onClick={handleSelectKey}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Select API Key
        </button>
        <p className="text-xs text-gray-500 mt-4">
          For more information on billing and API keys, visit the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline"
          >
            official documentation
          </a>.
        </p>
      </div>
    </div>
  );
};
