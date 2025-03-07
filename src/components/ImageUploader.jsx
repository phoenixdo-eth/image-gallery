import { useRef } from 'react';

const ImageUploader = ({ selectedImages, onImagesSelected, onRemoveImage, onContinue }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const files = Array.from(event.target.files);
    
    // Create object URLs for the selected files
    const imageUrls = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    
    onImagesSelected(imageUrls);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Step 1: Select Images</h2>
      <p className="text-gray-600 text-center max-w-md">
        Choose images that you'd like to enhance with AI-generated text.
      </p>
      <div className="w-full max-w-md">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={triggerFileInput}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow transition duration-200"
        >
          Choose Images
        </button>
      </div>
      
      {selectedImages.length > 0 && (
        <div className="mt-4 w-full">
          <p className="text-gray-700 mb-2">{selectedImages.length} images selected</p>
          <div className="flex flex-wrap gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`Selected ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-md"
                />
                <button
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={onContinue}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Continue to Category Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;