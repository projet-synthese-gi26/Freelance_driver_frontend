import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Testimonial {
  text: string;
  author: string;
  title: string;
  imageUrl: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => clearInterval(intervalId);
  }, [nextTestimonial]);

  return (
    <div className="w-full max-w-3xl mx-auto">
        <h3 className="font-medium title mt-[2rem] text-center">TESTIMONIALS</h3>
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 p-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center flex-col jutify-center mb-4">
                  <div className="w-[150px] h-[150px] relative rounded-full overflow-hidden">
                    <Image
                      src={testimonial.imageUrl}
                      alt={`Photo de ${testimonial.author}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="py-3">
                    <p className="font-bold text-center">{testimonial.author}</p>
                    <p className="text-gray-600 text-center">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 text-center justify-center">"{testimonial.text}"</p>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={prevTestimonial}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button 
          onClick={nextTestimonial}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;