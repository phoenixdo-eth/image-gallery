import React from 'react';

const CategorySelector = ({
  categories,
  selectedCategory,
  onSelectCategory,
  prefixOption,
  onPrefixChange,
  customDate,
  onDateChange,
  onContinue,
  onBack
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Step 2: Select Content Category</h2>
      <p className="text-gray-600 text-center max-w-md">
        Choose a category for the type of content you want to generate for your images.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {categories.map((category, index) => (
          <div 
            key={index}
            onClick={() => onSelectCategory(category)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedCategory?.name === category.name 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
            <p className="text-gray-600 text-sm">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Options for prefix or date */}
      {selectedCategory?.hasOptions && (
        <div className="w-full max-w-md mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-gray-800 mb-2">Choose prefix for affirmations:</h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="prefix"
                value="I"
                checked={prefixOption === "I"}
                onChange={() => onPrefixChange("I")}
                className="form-radio text-blue-500"
              />
              <span className="text-gray-800">Use "I"</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="prefix"
                value="My"
                checked={prefixOption === "My"}
                onChange={() => onPrefixChange("My")}
                className="form-radio text-blue-500"
              />
              <span className="text-gray-800">Use "My"</span>
            </label>
          </div>
        </div>
      )}
      
      {/* Additional button for quickly switching prefix for affirmations */}
      {selectedCategory?.name?.includes("Affirmations") && (
        <div className="w-full max-w-md mt-4">
          <button
            onClick={() => onPrefixChange(prefixOption === "I" ? "My" : "I")}
            className="w-full bg-gray-800 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <span className="mr-2">Quick Switch:</span>
            <span className="font-bold text-lg">{prefixOption === "I" ? '"I"' : '"My"'}</span>
            <span className="ml-2">→ {prefixOption === "I" ? '"My"' : '"I"'}</span>
          </button>
        </div>
      )}

      {selectedCategory?.dateInput && (
        <div className="w-full max-w-md mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-gray-800 mb-2">Enter date for motivational quote:</h3>
          <input
            type="text"
            value={customDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full p-2 border border-gray-800 rounded text-gray-800"
            placeholder="e.g., March 6, 2025"
          />
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
          onClick={onContinue}
          disabled={!selectedCategory}
          className={`${
            selectedCategory 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-300 cursor-not-allowed'
          } text-white font-medium py-2 px-4 rounded transition duration-200`}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default CategorySelector;