"use client";

import { useState, useEffect, JSX } from 'react';
import ImageUploader from '@/components/ImageUploader';
import CategorySelector from '@/components/CategorySelector';
import ReviewGenerate from '@/components/ReviewGenerate';
import ResultsViewer from '@/components/ResultsViewer';
import StepIndicator from '@/components/StepIndicator';
import { PROMPT_CATEGORIES } from '@/data/categories';
import { ImageFile, PromptCategory } from '@/types';

// Type definition for processed image
interface ProcessedImageFile extends ImageFile {
  processedUrl?: string;
}

const createTextOnImage = (imageUrl: string, caption: string, category: PromptCategory | null): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        // Draw the original image
        ctx.drawImage(img, 0, 0, 1080, 1920);
        // Add a semi-transparent overlay for better text visibility
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Configure text styling
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
  
        // Different formatting based on category
        if (category?.name?.includes("Affirmations")) {
          // For affirmations, display as line-by-line list
          const lines = caption.split('\n');
          const lineHeight = 75; // Increased from 60 (25% more)
          const startY = (canvas.height - (lines.length * lineHeight)) / 2;
          ctx.font = 'bold 50px Arial'; // Increased from 40px (25% more)
          lines.forEach((line, i) => {
            ctx.fillText(line, canvas.width / 2, startY + (i * lineHeight));
          });
        }
        else if (category?.name === "Daily Motivation") {
          // For Daily Motivation, display date first and then content
          const parts = caption.split('\n\n');
          let date = parts[0].replace(/\*/g, '').trim(); // Remove asterisks from date
          const content = parts.slice(1).join('\n\n');
  
          // Date (larger, 50% of width)
          ctx.font = 'bold 68px Arial'; // Increased from 54px (25% more)
          const dateWidth = canvas.width * 0.5; // 50% of canvas width
          
          // Handle date text wrapping if needed
          const dateWords = date.split(' ');
          const dateLines: string[] = [];
          let currentLine = '';
          
          dateWords.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > dateWidth) {
              dateLines.push(currentLine);
              currentLine = word + ' ';
            } else {
              currentLine = testLine;
            }
          });
          dateLines.push(currentLine);
          
          // Draw date lines
          const dateLineHeight = 75; // Increased from 60 (25% more)
          let currentY = canvas.height * 0.3; // Position date higher on the image
          
          dateLines.forEach(line => {
            ctx.fillText(line.trim(), canvas.width / 2, currentY);
            currentY += dateLineHeight;
          });
  
          // Content with adaptive line breaks to keep in frame
          ctx.font = '45px Arial'; // Increased from 36px (25% more)
          const contentWords = content.split(' ');
          const contentLines: string[] = [];
          currentLine = '';
          
          // Break content into lines that fit on the canvas
          const maxWidth = canvas.width - 120; // Allow for margins
          
          contentWords.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth) {
              contentLines.push(currentLine);
              currentLine = word + ' ';
            } else {
              currentLine = testLine;
            }
          });
          contentLines.push(currentLine);
          
          // Calculate if content would go off screen
          const contentLineHeight = 58; // Increased from 46 (25% more)
          const totalContentHeight = contentLines.length * contentLineHeight;
          const availableHeight = canvas.height * 0.9 - currentY; // Leave some margin at bottom
          
          // Adjust font size if content would go off screen
          let fontSize = 45; // Increased from 36 (25% more)
          if (totalContentHeight > availableHeight) {
            fontSize = Math.max(30, Math.floor(45 * (availableHeight / totalContentHeight))); // Increased from 24 and 36 (25% more)
            ctx.font = `${fontSize}px Arial`;
          }
          
          // Draw the content text lines
          contentLines.forEach(line => {
            ctx.fillText(line.trim(), canvas.width / 2, currentY);
            currentY += contentLineHeight * (fontSize / 45); // Updated divisor from 36 to 45
          });
        }
        else if (category?.name === "Zodiac Rankings") {
          // Extract "most likely to" sentence and zodiac list
          let title = "";
          let zodiacList: string[] = [];
          
          // Look for the "most likely to" sentence
          const fullContent = caption.split('\n');
          
          for (let i = 0; i < fullContent.length; i++) {
            const line = fullContent[i];
            if (line.toLowerCase().includes("most likely to")) {
              title = line;
              
              // Start collecting zodiac items
              let j = i + 1;
              while (j < fullContent.length) {
                const zodiacLine = fullContent[j].trim();
                // Check if line contains a number followed by a zodiac sign
                if (/^\d+\.?\s+[A-Za-z]+/.test(zodiacLine)) {
                  zodiacList.push(zodiacLine);
                }
                j++;
              }
              break;
            }
          }
          
          // If we didn't find a proper format, try to extract from formatted lists
          if (zodiacList.length === 0) {
            // Extract numbered list items (1. Gemini, etc.)
            const listPattern = /\d+\.?\s+[A-Za-z]+/g;
            const matches = caption.match(listPattern);
            if (matches) {
              zodiacList = matches;
            }
            
            // Try to find "most likely to" phrase if not found earlier
            if (!title) {
              const mostLikelyMatch = caption.match(/.*most likely to.*/i);
              if (mostLikelyMatch) {
                title = mostLikelyMatch[0];
              } else {
                // Use first line as fallback title
                title = fullContent[0];
              }
            }
          }
          
          // Draw title (most likely to...)
          ctx.font = 'bold 63px Arial'; // Increased from 50px (25% more)
          const titleWords = title.split(' ');
          const titleLines: string[] = [];
          let currentLine = '';
          const maxTitleWidth = canvas.width - 100;
          
          titleWords.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxTitleWidth) {
              titleLines.push(currentLine);
              currentLine = word + ' ';
            } else {
              currentLine = testLine;
            }
          });
          titleLines.push(currentLine);
          
          // Draw title lines
          let currentY = canvas.height * 0.25;
          const titleLineHeight = 75; // Increased from 60 (25% more)
          
          titleLines.forEach(line => {
            ctx.fillText(line.trim(), canvas.width / 2, currentY);
            currentY += titleLineHeight;
          });
          
          // Add spacing after title
          currentY += 50; // Increased from 40 (25% more)
          
          // Draw zodiac list with spacing between items
          ctx.font = '50px Arial'; // Increased from 40px (25% more)
          const zodiacLineHeight = 75; // Increased from 60 (25% more)
          
          zodiacList.forEach(zodiac => {
            ctx.fillText(zodiac.trim(), canvas.width / 2, currentY);
            currentY += zodiacLineHeight;
          });
        }
        else {
          // Default text formatting
          ctx.font = 'bold 63px Arial'; // Increased from 50px (25% more)
          // Handle multi-line text
          const words = caption.split(' ');
          const lines: string[] = [];
          let currentLine = '';
          // Break text into lines that fit on the canvas
          const maxWidth = canvas.width - 100; // Allow for margins
          words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth) {
              lines.push(currentLine);
              currentLine = word + ' ';
            } else {
              currentLine = testLine;
            }
          });
          lines.push(currentLine); // Add the last line
          // Draw the text lines
          const lineHeight = 63; // Increased from 50 (25% more)
          const startY = (canvas.height - (lines.length * lineHeight)) / 2;
          lines.forEach((line, i) => {
            ctx.fillText(line.trim(), canvas.width / 2, startY + (i * lineHeight));
          });
        }
        
        // Convert canvas to blob and create a new URL
        canvas.toBlob(blob => {
          if (!blob) {
            reject(new Error("Failed to create blob from canvas"));
            return;
          }
          const newImageUrl = URL.createObjectURL(blob);
          resolve(newImageUrl);
        }, 'image/jpeg', 0.9);
      };
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(error);
      };
      img.src = imageUrl;
    });
  };

export default function ImageGallery(): JSX.Element {
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImageFile[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<"grid" | "slideshow">("grid");
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [prefixOption, setPrefixOption] = useState<string>("I");
  const [customDate, setCustomDate] = useState<string>(
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  );
  
  const updatePromptWithOptions = (category: PromptCategory | null): void => {
    if (!category) return;
    
    let updatedPrompt = category.prompts[0];
    
    if (category.hasOptions) {
      updatedPrompt = updatedPrompt.replace('{prefix}', prefixOption);
    }
    
    if (category.dateInput) {
      updatedPrompt = updatedPrompt.replace('{date}', customDate);
    }
    
    setSelectedPrompt(updatedPrompt);
  };

  // Update prompt when options change
  useEffect(() => {
    if (selectedCategory?.hasOptions || selectedCategory?.dateInput) {
      updatePromptWithOptions(selectedCategory);
    }
  }, [prefixOption, customDate, selectedCategory]);

  // Process images with text when moving to results step
  useEffect(() => {
    const processImagesWithText = async () => {
      if (currentStep === 4 && selectedImages.length > 0 && processedImages.length === 0) {
        setIsProcessing(true);
        
        try {
          const newProcessedImages = await Promise.all(
            selectedImages.map(async (image) => {
              // Only process if the image has a caption
              if (image.caption) {
                const processedUrl = await createTextOnImage(image.url, image.caption, selectedCategory);
                
                return {
                  ...image,
                  processedUrl // Store the new URL with text on image
                };
              }
              return image;
            })
          );
          
          setProcessedImages(newProcessedImages);
        } catch (error) {
          console.error("Error processing images:", error);
          setError("Failed to process images with text");
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    processImagesWithText();
  }, [currentStep, selectedImages, processedImages.length, selectedCategory]);

  const goToNextStep = (): void => {
    setCurrentStep(prev => prev + 1);
  };

  const goToPreviousStep = (): void => {
    setCurrentStep(prev => prev - 1);
  };

  const selectCategory = (category: PromptCategory): void => {
    setSelectedCategory(category);
    updatePromptWithOptions(category);
  };

  const handleImagesSelected = (newImages: ImageFile[]): void => {
    setSelectedImages(prev => [...prev, ...newImages]);
    if (currentStep === 1) {
      goToNextStep();
    }
  };

  const removeImage = (indexToRemove: number): void => {
    setSelectedImages(prev => {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(prev[indexToRemove].url);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  // New functions for handling "Start Over" with different behaviors
  const handleStartOverWithImages = (): void => {
    // Preserve the images but reset other states
    setCurrentStep(2); // Go directly to category selection
    setSelectedCategory(null);
    setSelectedPrompt("");
    setError(null);
    setCurrentSlide(0);
    setProcessedImages([]); // Clear processed images to force regeneration
  };

  const handleCompleteReset = (): void => {
    // Clean up all image URLs to prevent memory leaks
    selectedImages.forEach(image => {
      URL.revokeObjectURL(image.url);
    });
    
    processedImages.forEach(image => {
      if (image.processedUrl) {
        URL.revokeObjectURL(image.processedUrl);
      }
    });
    
    // Reset all states to initial values
    setSelectedImages([]);
    setProcessedImages([]);
    setCurrentStep(1);
    setSelectedCategory(null);
    setSelectedPrompt("");
    setError(null);
    setCurrentSlide(0);
  };

  const renderStepContent = (): JSX.Element => {
    switch(currentStep) {
      case 1:
        return (
          <ImageUploader 
            selectedImages={selectedImages}
            onImagesSelected={handleImagesSelected}
            onRemoveImage={removeImage}
            onContinue={goToNextStep}
          />
        );
      case 2:
        return (
          <CategorySelector
            categories={PROMPT_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={selectCategory}
            prefixOption={prefixOption}
            onPrefixChange={setPrefixOption}
            customDate={customDate}
            onDateChange={setCustomDate}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <ReviewGenerate
            selectedImages={selectedImages}
            selectedCategory={selectedCategory}
            selectedPrompt={selectedPrompt}
            prefixOption={prefixOption}
            customDate={customDate}
            isProcessing={isProcessing}
            error={error}
            onSetError={setError}
            onSetProcessing={setIsProcessing}
            onSetImages={setSelectedImages}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        return (
          <ResultsViewer
            selectedImages={processedImages.length > 0 ? processedImages : selectedImages}
            selectedCategory={selectedCategory}
            displayMode={displayMode}
            onChangeDisplayMode={setDisplayMode}
            currentSlide={currentSlide}
            onNextSlide={() => setCurrentSlide(prev => (prev + 1) % selectedImages.length)}
            onPrevSlide={() => setCurrentSlide(prev => (prev - 1 + selectedImages.length) % selectedImages.length)}
            onStartOverWithImages={handleStartOverWithImages}
            onCompleteReset={handleCompleteReset}
            isProcessing={isProcessing}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="w-full">
      <StepIndicator currentStep={currentStep} totalSteps={4} />
      {renderStepContent()}
    </div>
  );
}