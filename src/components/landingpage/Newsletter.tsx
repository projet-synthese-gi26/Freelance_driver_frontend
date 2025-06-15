"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log("Signing up with email:", email);
    setEmail("");
  };

  return (
    <section className="flex flex-col justify-center items-center py-36 px-4 md:px-8 lg:px-16 w-full max-w-[1729px] mx-auto bg-white rounded-2xl">
      <div className="flex flex-col items-center gap-12 w-full">
        <div className="flex flex-col justify-center items-center gap-3 w-full">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center text-black-500 leading-tight tracking-tight">
            Subscribe to our newsletter
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-700 leading-relaxed tracking-tight">
            Enter your email to get original stories, travel tips and insights
            across Cameroon
          </p>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 w-full max-w-[644px]">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row items-center border border-grey-400 rounded-full overflow-hidden">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:flex-grow px-5 py-3 text-lg text-black-300 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-3 bg-orange-600 text-white text-lg font-medium hover:bg-orange-700 transition-colors duration-300"
              >
                Suscribe
              </button>
            </div>
          </form>
          <p className="text-sm md:text-base text-center text-black-300">
            You can unsubscribe at any time. Learn more about our{" "}
            <Link 
            href="/user_privacy_policy"
            className="text-primary-500 hover:text-primary-600" >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
