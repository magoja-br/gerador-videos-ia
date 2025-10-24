
import { GoogleGenAI } from '@google/genai';

interface ImagePayload {
  mimeType: string;
  imageBytes: string;
}

const loadingMessages = [
  "Summoning digital spirits...",
  "Teaching pixels to dance...",
  "Composing a symphony of light and code...",
  "Warming up the creativity engine...",
  "Polishing the final frames...",
  "Rendering your masterpiece...",
  "This might take a few moments...",
];

export const generateVideoFromImage = async (
  prompt: string,
  image: ImagePayload,
  updateLoadingMessage: (message: string) => void
): Promise<Blob> => {
  // Create a new instance for each call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  updateLoadingMessage("Initiating video generation...");
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    image,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  let messageIndex = 0;
  const intervalId = setInterval(() => {
    updateLoadingMessage(loadingMessages[messageIndex]);
    messageIndex = (messageIndex + 1) % loadingMessages.length;
  }, 5000);

  updateLoadingMessage("Processing your request... this can take a minute or two.");
  
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
    } catch (e: any) {
        clearInterval(intervalId);
        console.error("Error during polling:", e);
        throw new Error("Failed to get video generation status. " + e.message);
    }
  }

  clearInterval(intervalId);

  if (!operation.response?.generatedVideos?.[0]?.video?.uri) {
    console.error("Generation finished but no video URI found in response:", operation);
    throw new Error("Video generation completed, but the result was empty.");
  }
  
  updateLoadingMessage("Downloading your video...");

  const downloadLink = operation.response.generatedVideos[0].video.uri;
  
  // The API key must be appended to the download URI
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);

  if (!videoResponse.ok) {
    throw new Error(`Failed to download the generated video. Status: ${videoResponse.statusText}`);
  }

  return videoResponse.blob();
};
