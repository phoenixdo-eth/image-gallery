// src/app/page.tsx
"use client";

import { useState } from 'react';
import ImageGallery from '@/components/ImageGallery';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: "black" }}>AI Bulk Slide Creation</h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Upload images, select an AI prompt category, and see your images enhanced with unique captions generated by Claude.
        </p>
        <ImageGallery />
      </div>
    </main>
  );
}