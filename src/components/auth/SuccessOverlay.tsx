import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import {useAuthModal} from "@/hook/AuthModalContext";

interface SuccessOverlayProps{
    result:string;
    message:string;
    redirect:string;
}

const SuccessOverlay = ({ result, message,redirect }:SuccessOverlayProps) => {
    const { closeRegisterModal } = useAuthModal();
    const router = useRouter();
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {

        const timer = setTimeout(() => {
            setShowLoader(false);
            router.push(redirect);
            if(redirect==="/login"){closeRegisterModal();}
        }, 5000);


        return () => clearTimeout(timer);
    }, [closeRegisterModal, redirect, router]);

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-64">
                <svg className="checkmark w-12 h-12 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <h2 className="title font-bold text-blue-600 mb-2">{result}</h2>
                <p className="text-sm text-gray-600 mb-3">{message}</p>
                {showLoader && <div className="loader"></div>}
            </div>

            <style jsx>{`
                .checkmark__circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    stroke-width: 2;
                    stroke-miterlimit: 10;
                    stroke: #3b82f6; /* Bleu */
                    fill: none;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }

                .checkmark__check {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    stroke: #3b82f6; /* Bleu */
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }

                @keyframes stroke {
                    100% {
                        stroke-dashoffset: 0;
                    }
                }

                .loader {
                    border: 3px solid #e6e6e6;
                    border-top: 3px solid #3b82f6; /* Bleu */
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SuccessOverlay;