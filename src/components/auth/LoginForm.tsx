import React, { useState } from "react";
import LoginButtons from "@/components/auth/LoginButtons";
import LoginFormEmail from "@/components/auth/LoginFormEmail";
import LoginFormPhone from "@/components/auth/LoginFormPhone";
import { useTranslations } from "next-intl";

interface LoginFormProps {
  onForgottenPasswordClick: (callback: () => void) => void;
  onSignUpClick: (callback: () => void) => void;
  onSuccess?: () => void;
}

export default function LoginForm({
  onForgottenPasswordClick,
  onSignUpClick,
  onSuccess,
}: LoginFormProps) {
  const t = useTranslations("Auth.login.form");
  const [loginMethod, setLoginMethod] = useState("email");

  return (
    <div className="w-full max-w-sm mx-auto">
      <LoginButtons />
      <div className="my-4 border-b text-center">
        <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
          {t("divider")}
        </div>
      </div>
      <div className="flex justify-center mb-5">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            type="button"
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              loginMethod === "email"
                ? "bg-white text-primary-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setLoginMethod("email")}
          >
            {t("methods.email")}
          </button>
          <button
            type="button"
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              loginMethod === "phone"
                ? "bg-white text-primary-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setLoginMethod("phone")}
          >
            {t("methods.phone")}
          </button>
        </div>
      </div>
      {loginMethod === "email" ? (
        <LoginFormEmail
          onForgottenPasswordClick={onForgottenPasswordClick}
          onSignUpClick={onSignUpClick}
          onSuccess={onSuccess}
        />
      ) : (
        <LoginFormPhone
          onForgottenPasswordClick={onForgottenPasswordClick}
          onSignUpClick={onSignUpClick}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}
