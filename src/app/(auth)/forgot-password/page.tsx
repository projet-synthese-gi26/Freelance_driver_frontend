"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logo from '@public/img/MainLogo1.png';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
    const router = useRouter();

    const handleSuccess = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="flex flex-col items-center mb-6">
                        <Link href="/" className="mb-6">
                            <Image src={logo} alt="logo" width={150} height={80} />
                        </Link>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900 font-poppins">
                            Reset your password
                        </h2>
                    </div>

                    <ForgotPasswordForm
                        onSuccess={handleSuccess}
                        onSignInClick={() => router.push('/login')}
                        onSignUpClick={() => router.push('/register')}
                    />
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;