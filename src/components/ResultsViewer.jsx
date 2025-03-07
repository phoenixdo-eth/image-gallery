import React from 'react';

const GridView = ({ images }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
    {images.map((image, index) => (
      <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden relative group">
        <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>  {/* 16:9 aspect ratio (9/16 = 0.5625 = 56.25%) */}
          <img
            src={image.processedUrl || image.url}
            alt={`Enhanced image ${image.name}`}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      </div>
    ))}
  </div>
);

const SlideshowView = ({ images, currentSlide, onNextSlide, onPrevSlide }) => (
  <div className="w-full max-w-4xl relative">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative" style={{ maxHeight: '80vh' }}>
        <img
          src={images[currentSlide]?.processedUrl || images[currentSlide]?.url}
          alt={`Enhanced image ${images[currentSlide]?.name}`}
          className="w-full object-contain bg-black"
          style={{ 
            maxWidth: '100%', 
            maxHeight: '80vh',
            margin: '0 auto',
            aspectRatio: '9/16'
          }}
        />
      </div>
      
      <div className="flex justify-between items-center p-4">
        <button 
          onClick={onPrevSlide}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-gray-600">
          {currentSlide + 1} of {images.length}
        </p>
        <button 
          onClick={onNextSlide}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

const ResultsViewer = ({
  selectedImages,
  selectedCategory,
  displayMode,
  onChangeDisplayMode,
  currentSlide,
  onNextSlide,
  onPrevSlide,
  onStartOverWithImages,
  onCompleteReset,
  isProcessing
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full">
      <h2 className="text-2xl font-semibold text-gray-800">Step 4: Your AI-Enhanced Images</h2>
      <p className="text-gray-600 text-center max-w-md">
        Here are your images with AI-generated content from the <span className="font-medium">{selectedCategory?.name}</span> category.
      </p>
      
      {isProcessing ? (
        <div className="flex flex-col items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Processing your images...</p>
        </div>
      ) : (
        <>
          <div className="flex space-x-4">
            <button
              onClick={() => onChangeDisplayMode("grid")}
              className={`py-2 px-4 rounded transition duration-200 ${
                displayMode === "grid" 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => onChangeDisplayMode("slideshow")}
              className={`py-2 px-4 rounded transition duration-200 ${
                displayMode === "slideshow" 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Slideshow
            </button>
          </div>
          
          {displayMode === "grid" ? (
            <GridView images={selectedImages} />
          ) : (
            <SlideshowView 
              images={selectedImages}
              currentSlide={currentSlide}
              onNextSlide={onNextSlide}
              onPrevSlide={onPrevSlide}
            />
          )}
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
            <button
              onClick={onStartOverWithImages}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded transition duration-200"
            >
              Keep Images & Try Another Style
            </button>
            
            <button
              onClick={onCompleteReset}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition duration-200"
            >
              Start Over with New Images
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsViewer;