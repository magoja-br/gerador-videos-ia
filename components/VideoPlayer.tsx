
import React from 'react';

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        key={src} // Force re-render on new src
        src={src}
        controls
        autoPlay
        loop
        muted
        className="w-full h-full object-contain"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
