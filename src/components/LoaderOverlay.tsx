"use client";
import React from "react";

const LoaderOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-50 flex items-center justify-center">
      <div className="loader" />
    </div>
  );
};

export default LoaderOverlay;
