// app/login/page.tsx
"use client";
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { APPLICATION_NAME } from "@/app/auth/Params";
import logo from "@public/img/MainLogo1.png";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    function onForgottenPasswordClick (callback: () => void):void{
        callback();
        router.push('/forgot-password');
    }

    function onSignUpClick (callback: () => void): void{
        callback();
        router.push('/register');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
            <div className="bg-white shadow-md rounded-2xl overflow-hidden w-[450px] max-h-[650px] relative">
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

                    <Link href="/customer-dashboard"
                          className="mt-4 w-full py-2 font-medium text-white bg-gray-600 text rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}