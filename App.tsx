
import React, { useState, useEffect, useCallback } from 'react';
import { generateVideoFromImage } from './services/geminiService';
import { ApiKeySelector } from './components/ApiKeySelector';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { VideoPlayer } from './components/VideoPlayer';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [image, setImage] = useState<{ file: File | null; preview: string | null }>({ file: null, preview: null });
  const [prompt, setPrompt] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini-api-key');
    if (savedKey) {
      setApiKey(savedKey);
    }
    setIsLoading(false);
  }, []);
  
  const handleKeySubmit = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
    setError(null);
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey(null);
  };

  const handleGenerateVideo = async () => {
    if (!image.file || !prompt.trim()) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    if (!apiKey) {
      setError('Please provide an API Key first.');
      return;
    }

    setIsLoading(true);
    setGeneratedVideoUrl(null);
    setError(null);
    setLoadingMessage('Preparing your vision...');

    try {
      const { mimeType, data: base64Data } = await fileToBase64(image.file);
      
      const videoBlob = await generateVideoFromImage(
        prompt,
        { mimeType, imageBytes: base64Data },
        apiKey,
        (message) => setLoadingMessage(message)
      );

      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(videoUrl);

    } catch (e: any) {
      console.error(e);
      let errorMessage = 'An unexpected error occurred during video generation.';
       if (e.message.includes('API key not valid') || e.message.includes('Request had invalid authentication credentials') || e.message.includes('API_KEY_INVALID')) {
        errorMessage = 'Your API key is invalid. Please enter a valid key.';
        handleClearKey(); // Clear bad key and prompt for a new one
      } else if (e.message) {
        errorMessage = e.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateButtonDisabled = !image.file || !prompt.trim() || isLoading;
  
  if (isLoading && !apiKey) {
    return (
       <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
          <Loader message="Initializing App..." />
       </div>
    );
  }
  
  if (!apiKey) {
      return <ApiKeySelector onKeySubmit={handleKeySubmit} />;
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto relative">
         <button 
            onClick={handleClearKey} 
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors z-10"
            aria-label="Change API Key"
            title="Change API Key"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Video Creator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Transform a person's image into a stunning video with a simple prompt.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-200 border-b border-gray-600 pb-3">1. Provide Your Assets</h2>
            <ImageUploader image={image.preview} setImage={setImage} />
            <PromptInput prompt={prompt} setPrompt={setPrompt} />
             <button
                onClick={handleGenerateVideo}
                disabled={isGenerateButtonDisabled}
                className={`flex items-center justify-center w-full px-6 py-4 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out
                ${isGenerateButtonDisabled
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300'
                }`}
            >
                <SparklesIcon className="w-6 h-6 mr-2" />
                {isLoading ? 'Generating...' : 'Create Video'}
            </button>
          </div>

          <div className="flex flex-col bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 min-h-[400px] lg:min-h-0">
             <h2 className="text-2xl font-semibold text-gray-200 border-b border-gray-600 pb-3 mb-4">2. Watch the Magic</h2>
            <div className="flex-grow flex items-center justify-center bg-gray-900/50 rounded-lg">
               {isLoading && loadingMessage ? (
                    <Loader message={loadingMessage} />
                ) : error ? (
                    <div className="text-center text-red-400 p-4">
                        <h3 className="font-bold text-lg mb-2">Generation Failed</h3>
                        <p>{error}</p>
                    </div>
                ) : generatedVideoUrl ? (
                    <VideoPlayer src={generatedVideoUrl} />
                ) : (
                    <div className="text-center text-gray-500">
                        <p className="text-lg">Your generated video will appear here.</p>
                        <p className="text-sm">Upload an image and write a prompt to get started.</p>
                    </div>
                )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
