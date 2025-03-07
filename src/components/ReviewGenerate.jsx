import React, { useState } from 'react';
import { generateCaptionsWithOpenAI } from '@/services/openAiApi';

const ReviewGenerate = ({
  selectedImages,
  selectedCategory,
  selectedPrompt,
  prefixOption,
  customDate,
  isProcessing,
  error,
  onSetError,
  onSetProcessing,
  onSetImages,
  onContinue,
  onBack
}) => {
  // Add state for logging
  const [logs, setLogs] = useState([]);
  const [apiResults, setApiResults] = useState(null);
  
  // Helper to add log
  const addLog = (message) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };
  
  const handleGenerate = async () => {
    // Clear previous logs and results
    setLogs([]);
    setApiResults(null);
    
    // Process with API
    onSetProcessing(true);
    onSetError(null);
    
    try {
      addLog("Starting content generation process");
      // Add counter for generateCaptions calls
      let generateCaptionsCallCount = 0;
      
      let processedCaptions;
      if (selectedCategory?.name === "Zodiac Rankings") {
        addLog("Detected Zodiac Rankings category - generating content for each image individually");
        const captionPromises = selectedImages.map((image, index) => {
          generateCaptionsCallCount++;
          addLog(`Requesting zodiac ranking for image ${index + 1}`);
          return generateCaptionsWithOpenAI([image], selectedPrompt)
            .then(result => {
              console.log(`generateCaptionsWithOpenAI call #${generateCaptionsCallCount} for image ${index + 1} of ${selectedImages.length} (Zodiac Rankings)`);
              addLog(`Received zodiac ranking for image ${index + 1}`);
              return result;
            });
        });
        processedCaptions = await Promise.all(captionPromises);
      } else if (selectedCategory?.name.includes("Affirmations")) {
        addLog("Detected Affirmations category - generating affirmations for each image individually");
        const captionPromises = selectedImages.map((image, index) => {
          generateCaptionsCallCount++;
          console.log(`generateCaptionsWithOpenAI call #${generateCaptionsCallCount} for image ${index + 1} of ${selectedImages.length} (Affirmations)`);
          addLog(`Requesting affirmations for image ${index + 1}`);
          return generateCaptionsWithOpenAI([image], selectedPrompt)
            .then(result => {
              addLog(`Received affirmations for image ${index + 1}`);
              return result;
            });
        });
        processedCaptions = await Promise.all(captionPromises);
      } else {
        // For other categories (for example Daily Motivation), make individual API calls per image.
        addLog(`Processing ${selectedImages.length} images with individual API calls`);
        const captionPromises = selectedImages.map((image, index) => {
          generateCaptionsCallCount++;
          console.log(`generateCaptionsWithOpenAI call #${generateCaptionsCallCount} for image ${index + 1} of ${selectedImages.length} (${selectedCategory?.name || 'Other category'})`);
          addLog(`Requesting content for image ${index + 1}`);
          return generateCaptionsWithOpenAI([image], selectedPrompt)
            .then(result => {
              addLog(`Received content for image ${index + 1}`);
              return result;
            });
        });
        processedCaptions = await Promise.all(captionPromises);
        setApiResults(processedCaptions);
      }
      
      // Log the final count
      console.log(`Total generateCaptionsWithOpenAI calls: ${generateCaptionsCallCount}`);
      
      // Update images with processed captions
      addLog("Updating images with final processed captions");
      onSetImages(prev => 
        prev.map((image, index) => ({
          ...image,
          caption: processedCaptions[index] || `No content generated for image ${index + 1}`
        }))
      );
      
      addLog("Content generation completed successfully");
      onContinue();
    } catch (error) {
      console.error("Error generating content:", error);
      addLog(`Error: ${error.message}`);
      onSetError("Failed to generate content. Please try again or check your API configuration.");
    } finally {
      onSetProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Step 3: Review and Generate</h2>
      <p className="text-gray-600 text-center max-w-md">
        You've selected {selectedImages.length} images with the "{selectedCategory?.name}" category.
        {selectedCategory?.name === "Zodiac Rankings" ? 
          " Each image will receive a unique trait and complete zodiac ranking." : 
          selectedCategory?.name.includes("Affirmations") ?
          " Each image will receive 10 unique affirmations." :
          " Each image will receive its own unique content."}
      </p>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 w-full max-w-2xl">
        <h3 className="font-medium text-gray-700 mb-2">Selected Options:</h3>
        {selectedCategory?.hasOptions && (
          <p className="text-gray-700 mb-2">
            Prefix: <span className="font-medium">{prefixOption}</span>
          </p>
        )}
        {selectedCategory?.dateInput && (
          <p className="text-gray-700 mb-2">
            Date: <span className="font-medium">{customDate}</span>
          </p>
        )}
        
        <h3 className="font-medium text-gray-700 mb-2 mt-4">Selected Prompt:</h3>
        <p className="text-gray-800 italic">{selectedPrompt}</p>
        
        <div className="mt-4">
          <h3 className="font-medium text-gray-700 mb-2">Selected Images:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={`Selected ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="w-full max-w-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex space-x-4 w-full max-w-md justify-between">
        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
        >
          Back
        </button>
        
        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className={`${
            !isProcessing
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-300 cursor-not-allowed'
          } text-white font-medium py-2 px-4 rounded transition duration-200 flex items-center space-x-2`}
        >
          {isProcessing && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{isProcessing ? 'Processing...' : 'Generate Content'}</span>
        </button>
      </div>
      
      {/* Process Logs and API Results */}
      {logs.length > 0 && (
        <div className="w-full max-w-2xl mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Process Log:</h3>
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1 text-sm">
                <span className="text-gray-500">[{log.time}]</span>{' '}
                <span className="text-gray-800">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Display OpenAI Results */}
      {apiResults && (
        <div className="w-full max-w-2xl mt-2">
          <h3 className="text-lg font-medium text-gray-800 mb-2">OpenAI Results:</h3>
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
            {apiResults.map((result, index) => (
              <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                <h4 className="font-medium text-gray-700 mb-1">Image {index + 1} Result:</h4>
                <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-white p-2 rounded border border-gray-300">
                  {result}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewGenerate;