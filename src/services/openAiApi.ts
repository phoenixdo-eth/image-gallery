// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// dangerouslyAllowBrowser: true });

// type ImageFile = {
//   url: string;
//   name: string;
//   size: number;
//   caption?: string;
// };

// /**
//  * Generates captions for images using OpenAI API directly via SDK
//  * @param images Array of image file information
//  * @param promptText The prompt text to send to OpenAI
//  * @returns Promise resolving to an array of caption strings
//  */
// export async function generateCaptionsWithOpenAI(
//   images: ImageFile[],
//   promptText: string
// ): Promise<string> {  // Changed return type to string
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         { role: "system", content: "You are a cool teenege college girl and who loves popular culture, astrology, numerology, signs, and a sarcastic sense of humor like Alex Cooper on Call Her Daddy" },
//         { role: "user", content: promptText }
//       ],
//       max_tokens: 16384,
//       temperature: 1.0,
//     });
//     // Safe check: Ensure choices exist and content is available
//     const content = response.choices?.[0]?.message?.content;
//     console.log("print content: ", content);
//     if (!content) {
//       throw new Error("No response from OpenAI");
//     }
//     return content;  // Return the complete string response
//   } catch (error) {
//     console.error("Error calling OpenAI API:", error);
//     throw error;
//   }
// }
  

import Anthropic from '@anthropic-ai/sdk';

type ImageFile = {
  url: string;
  name: string;
  size: number;
  caption?: string;
};

/**
 * Generates captions for images using Anthropic Claude API
 * @param images Array of image file information
 * @param promptText The prompt text to send to Claude
 * @returns Promise resolving to a string response
 */
export async function generateCaptionsWithOpenAI(
  images: ImageFile[],
  promptText: string
): Promise<string> {
  try {
    const anthropic = new Anthropic({
      apiKey: "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", // Make sure to set this in your environment
      dangerouslyAllowBrowser: true,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219", // Use the appropriate Claude model
      max_tokens: 16384,
      temperature: 1.0,
      system: "You are a cool teenege college girl and who loves popular culture, astrology, numerology, signs, and a sarcastic sense of humor like Alex Cooper on Call Her Daddy",
      messages: [
        { role: "user", content: promptText }
      ],
    });

    // Safe check: Ensure content is available
    // Check if content exists and access the text property safely
    const contentBlock = response.content?.[0];
    let content = '';

    // Type guard to check if the content block has a text property
    if (contentBlock && 'text' in contentBlock) {
      content = contentBlock.text;
    }

    console.log("print content: ", content);

    if (!content) {
      throw new Error("No text response from Claude");
    }
    
    return content;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
}