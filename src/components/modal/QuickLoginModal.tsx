// components/auth/QuickLoginModal.tsx

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { CloseIcon } from "@/components/icon/closeIcon";
import logo from "@public/img/MainLogo1.png";
import { APPLICATION_NAME } from "@/app/auth/Params";
import { useModalHandlers } from '@/hook/useModalHandlers';
import {useAuthModal} from "@/hook/AuthModalContext";

type QuickLoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
};



export default function QuickLoginModal({ isOpen, onClose }: QuickLoginModalProps) {
    const {  openForgottenPasswordModal, openRegisterModal } = useAuthModal();


    function onForgottenPasswordClick (callback: () => void):void{
        onClose();
        callback();
        openForgottenPasswordModal();
    }

    function onSignUpClick (callback: () => void): void{
        onClose();
        callback();
        openRegisterModal();
    }


    useModalHandlers(isOpen, onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 modal-overlay">
            <div className="bg-white shadow-md rounded-2xl overflow-hidden w-[450px] max-h-[650px] relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    <CloseIcon />
                </button>

                <div className="p-8 h-full flex flex-col">
                    <div className="flex-grow">
                        <div className="flex flex-col items-center">
                            <Link href="/" className="mb-4">
                                <Image
                                    src={logo}
                                    alt="Logo"
                                    width={80}
                                    height={53}
                                />
                            </Link>
                            <h1 className="title font-bold mb-6 text-center">
                                Sign in to {APPLICATION_NAME}
                            </h1>
                            <LoginForm onForgottenPasswordClick={onForgottenPasswordClick} onSignUpClick={onSignUpClick}/>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-4 w-full py-2 font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}