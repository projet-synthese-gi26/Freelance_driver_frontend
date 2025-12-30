import React from "react";

interface LoginFormProps {
    onForgottenPasswordClick: (callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;
}

export default function LoginFormPhone({ onForgottenPasswordClick, onSignUpClick }: LoginFormProps) {
    return (
        <div style={{ padding: 32, textAlign: 'center' }}>
            <h2>Connexion par téléphone non implémentée</h2>
            <p>La connexion par numéro de téléphone n'est pas disponible pour le moment.</p>
        </div>
    );
}