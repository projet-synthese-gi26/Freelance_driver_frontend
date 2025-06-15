// pages/RatingPage.tsx
'use client';

import { formater } from '@/components/format/Currency';
import React, { useState } from 'react';

const Page = () => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    
    e.preventDefault();
    // Here you would typically send the rating and feedback to your backend
    console.log('Rating:', rating);
    console.log('Feedback:', feedback);
    formater(1000);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white">
        <h2 className="font-bold mb-4">Thank You for Your Feedback!</h2>
        <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Your rating and comments have been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl text p-4 bg-white ">
      <h1 className="font-bold mb-1">Rate Our Platform</h1>
      <p className="mb-4">We value your opinion! Please take a moment to rate your experience with our platform.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Your Rating:</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-3xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="feedback" className="block mb-2 font-semibold">Your Feedback:</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={handleFeedbackChange}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Please share your thoughts about our platform..."
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          disabled={rating === 0}
        >
          Submit Rating
        </button>
      </form>
    </div>
  );
};

export default Page;