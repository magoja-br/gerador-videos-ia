
import React, { useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  image: string | null;
  setImage: (state: { file: File | null; preview: string | null }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ image, setImage }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setImage({ file: null, preview: null });
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [setImage]);

  return (
    <div className="w-full">
      <label 
        htmlFor="image-upload" 
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative flex justify-center items-center w-full h-48 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
        ${image ? 'border-purple-500' : 'border-gray-600 hover:border-purple-400 bg-gray-700/50 hover:bg-gray-700'}`}
      >
        {image ? (
          <>
            <img src={image} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
             <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition-colors"
                aria-label="Remove image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
            <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
            <p className="text-xs">PNG, JPG, WEBP, etc.</p>
          </div>
        )}
        <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};
