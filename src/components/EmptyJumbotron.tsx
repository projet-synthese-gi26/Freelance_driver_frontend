"use client";
import React from "react";
import Image from "next/image";

interface EmptyJumbotronProps {
  title?: string;
  message?: string;
  icon?: string;
  code?: string;
}

const EmptyJumbotron: React.FC<EmptyJumbotronProps> = ({
  title = "No items found",
  message = "We couldn't find any content to display here at the moment.",
  icon = "/img/empty-box.png",
  code,
}) => {
  return (
    <div className="w-full py-16 px-6 bg-[var(--bg-2)] rounded-2xl text-center border border-dashed border-gray-300 shadow-inner">
      {code == "ERR_NETWORK" ? (
        <div>
          <div className="flex flex-col items-center justify-center gap-4">
            <Image src="/img/database.png" alt="database" width={80} height={80} className="opacity-60" />
            <h2 className="text-2xl font-semibold text-red-800">Network Error</h2>
            <p className="text-red-800">A network error occurred. Please check your internet connection and try again.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <Image src={icon} alt="Empty" width={80} height={80} className="opacity-60" />
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>
      )}

    </div>
  );
};

export default EmptyJumbotron;
