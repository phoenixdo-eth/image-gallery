import React from 'react';

const StepIndicator = ({ currentStep, totalSteps = 4 }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-center items-center">
        <div className="flex items-center">
          {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step < currentStep 
                    ? 'bg-green-500 text-white' 
                    : step === currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {step < totalSteps && (
                <div 
                  className={`w-16 h-1 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;