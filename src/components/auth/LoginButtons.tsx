import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import service from "../../../firebase/serviceAccount";
import React, { useState } from "react";
import {
  GoogleIcon,
  AppleIcon,
  YowyobIcon,
} from "@/components/icon/socialIcon";
import SuccessOverlay from "@/components/auth/SuccessOverlay";
import { setAuthCookie } from "@/app/lib/firebase";
import { toast } from "react-hot-toast";

const app = initializeApp(service);
const auth = getAuth(app);

interface LoginButtonsState {
  isLoading: {
    google: boolean;
    apple: boolean;
    yowyob: boolean;
  };
  loginSuccess: boolean;
}

const LoginButtons = () => {
  const [state, setState] = useState<LoginButtonsState>({
    isLoading: {
      google: false,
      apple: false,
      yowyob: false,
    },
    loginSuccess: false,
  });

  const handleSubmitGoogle = async () => {
    setState(prev => ({
      ...prev,
      isLoading: { ...prev.isLoading, google: true }
    }));

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Utilisateur connecté :", user);
      
      // Set auth cookie
      setAuthCookie();
      
      // Show success state and overlay
      setState(prev => ({
        ...prev,
        loginSuccess: true,
        isLoading: { ...prev.isLoading, google: false }
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: { ...prev.isLoading, google: false }
      }));

      if (error instanceof Error) {
        toast.error(error.message);
        console.error("Erreur d'authentification :", error.message);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Erreur inattendue :", error);
      }
    }
  };

  const handleSubmitApple = async () => {
    setState(prev => ({
      ...prev,
      isLoading: { ...prev.isLoading, apple: true }
    }));

    try {
      // Implement Apple login logic here
      console.log("Apple login not implemented");
      toast.error("Apple login not implemented yet");
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: { ...prev.isLoading, apple: false }
      }));
    }
  };

  const handleSubmitYowyob = async () => {
    setState(prev => ({
      ...prev,
      isLoading: { ...prev.isLoading, yowyob: true }
    }));

    try {
      // Implement Yowyob login logic here
      console.log("Yowyob login not implemented");
      toast.error("Yowyob login not implemented yet");
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: { ...prev.isLoading, yowyob: false }
      }));
    }
  };

  return (
    <>
      <div className="flex items-center justify-evenly w-full gap-4">
        <button
          className={`w-[200px] h-[50px] max-w-xs font-bold shadow-sm rounded-lg py-2 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline ${
            state.isLoading.google ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmitGoogle}
          disabled={state.isLoading.google}
        >
          <div className="bg-white p-2 rounded-full">
            <GoogleIcon />
          </div>
          <span className="ml-1 text">
            {state.isLoading.google ? "Loading..." : "Google"}
          </span>
        </button>

        <button
          className={`w-[200px] h-[50px] max-w-xs font-bold shadow-sm rounded-lg py-2 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline ${
            state.isLoading.apple ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmitApple}
          disabled={state.isLoading.apple}
        >
          <div className="bg-white p-1 rounded-full">
            <AppleIcon />
          </div>
          <span className="ml-1 text">
            {state.isLoading.apple ? "Loading..." : "Apple"}
          </span>
        </button>

        <button
          className={`w-[200px] h-[50px] max-w-xs font-bold shadow-sm rounded-lg py-2 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline ${
            state.isLoading.yowyob ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmitYowyob}
          disabled={state.isLoading.yowyob}
        >
          <div
            className="bg-white p-1 rounded-full flex items-center justify-center"
            style={{ width: "28px", height: "28px" }}
          >
            <YowyobIcon />
          </div>
          <span className="ml-1 text">
            {state.isLoading.yowyob ? "Loading..." : "Yowyob"}
          </span>
        </button>
      </div>

      {state.loginSuccess && (
        <SuccessOverlay
          result="Login Successful!"
          message="Redirecting you to the dashboard...please wait!"
          redirect="/customer-dashboard"
        />
      )}
    </>
  );
};

export default LoginButtons;