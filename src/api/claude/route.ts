import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      );
    }
    
    // Get data from request
    const { promptText, images } = await request.json();
    
    if (!promptText || !images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: 'Invalid request data. Expected promptText and images array.' },
        { status: 400 }
      );
    }
    
    // Create a message that includes information about each image
    const imageDescriptions = images.map((img, index) => 
      `Image ${index + 1}: ${img.name} (${(img.size/1024).toFixed(2)} KB)`
    ).join('\n');
    
    const message = `${promptText}\n\nPlease generate unique captions for the following images based on their filenames:\n${imageDescriptions}\n\nProvide exactly ${images.length} captions, one for each image. Format your response as "Image 1: [caption]", "Image 2: [caption]", etc.`;
    
    // Call the Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Claude API Error: ${response.status} - ${errorText}` },
        { status: 500 }
      );
    }
    
    const data = await response.json();
    const responseText = data.content[0].text;
    
    // Parse out individual captions
    let captions = new Array(images.length).fill(""); // Initialize with empty strings
    const captionRegex = /(?:Image\s*)?(\d+)(?::|\.)\s*(.*)/g;
    let match;
    
    while ((match = captionRegex.exec(responseText)) !== null) {
      const index = parseInt(match[1]) - 1;
      const caption = match[2].trim();
      
      if (index >= 0 && index < images.length) {
        captions[index] = caption;
      }
    }
    
    // Fallback if regex parsing didn't work
  if (captions.filter(Boolean).length < images.length) {
    const paragraphs = responseText
      .split('\n\n')
      .filter((para: string) => para.trim().length > 0);
    
    // Update the captions array instead of directly returning
    captions = paragraphs.slice(0, images.length).map((p: string) => p.trim());
  }
    
    return NextResponse.json({ captions });
  } catch (error) {
    console.error('Error in Claude API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}