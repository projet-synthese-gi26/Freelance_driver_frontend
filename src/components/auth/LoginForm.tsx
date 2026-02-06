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
      <div className="flex justify-center space-x-4 mb-4">
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            loginMethod === "email" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setLoginMethod("email")}
        >
          {t("methods.email")}
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            loginMethod === "phone" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setLoginMethod("phone")}
        >
          {t("methods.phone")}
        </button>
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
