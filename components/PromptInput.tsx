
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt }) => {
  return (
    <div className="w-full">
      <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
        Video Prompt
      </label>
      <textarea
        id="prompt"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A person walking through a futuristic neon city at night..."
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
      />
    </div>
  );
};
