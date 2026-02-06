import React from "react";
import { useTranslations } from "next-intl";

interface LoginFormProps {
    onForgottenPasswordClick: (callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;
    onSuccess?: () => void;
}

export default function LoginFormPhone({ onForgottenPasswordClick, onSignUpClick, onSuccess }: LoginFormProps) {
    const t = useTranslations("Auth.login.phone");
    return (
        <div style={{ padding: 32, textAlign: 'center' }}>
            <h2>{t("title")}</h2>
            <p>{t("description")}</p>
        </div>
    );
}