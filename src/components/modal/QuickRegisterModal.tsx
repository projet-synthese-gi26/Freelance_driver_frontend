import React, { useCallback, useEffect, useState } from "react";
import RegisterForm from "@/components/auth/RegisterForm";

import {CloseIcon} from "@/components/icon/closeIcon";
import {useModalHandlers} from "@/hook/useModalHandlers";
import Link from "next/link";
import Image from "next/image";
import logo from "@public/img/MainLogo1.png";
import {APPLICATION_NAME} from "@/app/auth/Params";
import {useAuthModal} from "@/hook/AuthModalContext";

type QuickRegisterModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function QuickRegisterModal({ isOpen, onClose }:QuickRegisterModalProps) {
    const [success, setSuccess] = useState(false);
    const { openLoginModal } = useAuthModal();


    function onSignInClick (callback: () => void): void{
        onClose();
        callback();
        openLoginModal();

    }

    const handleSuccess = () => {
        onClose();
        openLoginModal();
    };

    useModalHandlers(isOpen, onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center modal-overlay z-50">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <CloseIcon/>
                </button>

                <div className="flex flex-col items-center">
                    <Link href="/">
                        <Image src={logo} alt="logo" width={100} height={80}/>
                    </Link>
                    <h1 className="title font-bold mb-4 mt-2 text-center">
                        Create an account on {APPLICATION_NAME}
                    </h1>
                    <RegisterForm onSignInClick={onSignInClick}/>
                </div>

            </div>

        </div>
    );
}