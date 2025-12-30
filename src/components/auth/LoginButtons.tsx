import React from "react";
import { GoogleIcon, AppleIcon, YowyobIcon } from "@/components/icon/socialIcon";

const LoginButtons = () => {
  return (
    <div className="flex items-center justify-evenly w-full gap-4">
      <button
        className="w-[200px] h-[50px] max-w-xs font-bold shadow-sm rounded-lg py-2 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline opacity-50 cursor-not-allowed"
        disabled
      >
        <div className="bg-white p-2 rounded-full">
          <GoogleIcon />
        </div>
        <span className="ml-1 text">Google </span>
      </button>

      <button
        className="w-[200px] h-[50px] max-w-xs font-bold shadow-sm rounded-lg py-2 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline opacity-50 cursor-not-allowed"
        disabled
      >
        <div className="bg-white p-1 rounded-full">
          <AppleIcon />
        </div>
        <span className="ml-1 text">Apple </span>
      </button>

      <button
        className="w-[200px] h-[50px] max-w-xs font-bold shadow-sm rounded-lg py-2 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline opacity-50 cursor-not-allowed"
        disabled
      >
        <div
          className="bg-white p-1 rounded-full flex items-center justify-center"
          style={{ width: "28px", height: "28px" }}
        >
          <YowyobIcon />
        </div>
        <span className="ml-1 text">Yowyob </span>
      </button>
    </div>
  );
};

export default LoginButtons;