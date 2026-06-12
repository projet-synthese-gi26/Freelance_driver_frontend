import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Testimonial {
  text: string;
  author: string;
  title: string;
  company?: string;
  rating?: number;
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
                {testimonial.rating && (
                  <div className="flex justify-center mb-3 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < testimonial.rating! ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
                <p className="text-gray-700 mb-5 text-center italic">"{testimonial.text}"</p>
                <div className="flex items-center flex-col justify-center">
                  <div className="w-[72px] h-[72px] relative rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={testimonial.imageUrl}
                      alt={`Photo of ${testimonial.author}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="py-2 text-center">
                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
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