
import React, { useState } from 'react';

interface ApiKeySelectorProps {
  onKeySubmit: (key: string) => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySubmit }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onKeySubmit(key.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 text-center">
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          API Key Required
        </h2>
        <p className="text-gray-400 mb-6">
          To generate videos, please enter your Google AI API key. Your key is stored only in your browser and is never sent to any servers.
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your Google AI API Key"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 p-3 mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          required
          aria-label="API Key Input"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Save & Continue
        </button>
        <p className="text-xs text-gray-500 mt-4">
          You can get your free API key from{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/api-key"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline"
          >
            Google AI Studio
          </a>.
        </p>
      </form>
    </div>
  );
};
