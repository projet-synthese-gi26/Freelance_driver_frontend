import React, { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, User } from "firebase/auth";
import { toast } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import ErrorTooltip from "./ErrorTooltip";
import SuccessOverlay from "@/components/auth/SuccessOverlay";
import dynamic from "next/dynamic";
import { ComponentType } from 'react';
import { EyePassword, NoEyePassword } from "@/components/icon/passwordIcon";
// import { toast } from 'react-toastify';
import {loginWithPhoneNumber} from "@/app/api/auth/login";
import { setAuthCookie } from "@/app/lib/firebase";
interface OtpInputProps {
    value: string;
    onChange: (otp: string) => void;
    OTPLength: number;
    otpType: string;
    disabled: boolean;
    autoFocus: boolean;
    className: string;
}

const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false })
const OtpInput :ComponentType<OtpInputProps> = dynamic(() => import('otp-input-react'), { ssr: false })

declare global {
    interface Window {
        confirmationResult: any; // You can replace 'any' with a more specific type if available
        recaptchaVerifier: any; // You can replace 'any' with a more specific type if available
    }
}

interface LoginFormProps {
    onForgottenPasswordClick:(callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;

}

interface FormData {
    password: string;
    phone: string;
    rememberMe: boolean;
}

interface MousePosition {
    x: number;
    y: number;
}

export default function LoginFormPhone({onForgottenPasswordClick,onSignUpClick}:LoginFormProps){

    const [formData, setFormData] = useState<FormData>({ password: "", phone: "", rememberMe: false });
    const [error, setError] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
    const [isLoadingPhone, setIsLoadingPhone] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>("");
    const [showOTP, setShowOTP] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = (field: 'password') => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const validateFormPhone = (): boolean => {
        if (!formData.phone || !formData.password) {
            toast.error("all fields are required.");
            return false;
        }



        return true;
    }

    const handleSubmitPhone = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateFormPhone()) {
            console.log("Form validation failed");
            return;
        }
        setIsLoadingPhone(true);
        setError(null);

        const formatPh = "+" + formData.phone.replace(/\D/g, '');
        const {data,error}= await loginWithPhoneNumber(formatPh,formData.password,formData.rememberMe);
        if(error) {
            setIsLoadingPhone(false);
            toast.error(error.message);
            return;
        }

        setIsLoadingPhone(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");


    };

    const onOTPVerify = async () => {
        setIsLoadingPhone(true);

        try {
            if (typeof window !== 'undefined') {
                const res = await window.confirmationResult.confirm(otp);
                setUser(res.user);
                setIsLoadingPhone(false);
                setAuthCookie()
                setLoginSuccess(true);

            }
        } catch (err) {
            console.error(err);
            toast.error("Invalid OTP. Please try again.");
            setIsLoadingPhone(false);

        }
    };

    const resetForm = () => {
        setFormData({ password: "", phone: "", rememberMe: false });
        setError(null);
        setLoginSuccess(false);
        setIsLoadingPhone(false);
        setOtp("");
        setShowOTP(false);
        setUser(null);
        setShowPassword(false);
    };

    return (
        <>
            {/*<Toaster toastOptions={{ duration: 4000 }} />*/}
            {!showOTP ? (
                <form onSubmit={handleSubmitPhone} className="space-y-3">

                    <div className="relative">
                        <PhoneInput
                            country={'cm'}
                            value={formData.phone}
                            onChange={(phone: string) => setFormData({...formData, phone})}
                            inputProps={{
                                name: 'phone',
                                required: true,
                                className: 'w-full pl-14 pr-3 py-2 text rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            }}
                            containerClass="relative"
                            buttonClass="absolute left-0 top-0 bottom-0 flex items-center justify-center px-3 border-r"
                            dropdownClass="absolute left-0 z-50 bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto"
                        />
                    </div>
                    <div className="relative">
                        <input
                            className="w-full px-3 py-2 text rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('password')}
                        >
                            {!showPassword ? (
                                <NoEyePassword/>
                            ) : (
                                <EyePassword/>
                            )}
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-2 mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                name="rememberMe"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    rememberMe: e.target.checked
                                })}
                            />
                            <span className="ml-2 text text-gray-600">Remember Me</span>
                        </label>
                        <button
                            onClick={() => {
                                onForgottenPasswordClick(() => resetForm())
                            }}
                            className="text text-indigo-600 font-medium hover:underline"
                            type="button"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <div id="recaptcha-container"></div>
                    <button
                        className={`w-full py-2 font-medium text text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            isLoadingPhone ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoadingPhone}
                        onMouseMove={(e: React.MouseEvent<HTMLButtonElement>) =>
                            setMousePosition({x: e.clientX, y: e.clientY})
                        }
                    >
                        {isLoadingPhone ? (
                            <CgSpinner size={20} className="mx-auto text animate-spin"/>
                        ) : (
                            "Continue"
                        )}
                    </button>

                    {/*{error && (*/}
                    {/*    <ErrorTooltip message={error} position={mousePosition} />*/}
                    {/*)}*/}
                </form>
            ) : (
                <div className="space-y-3">
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        OTPLength={6}
                        otpType="number"
                        disabled={false}
                        autoFocus
                        className="opt-container justify-center"
                    />
                    <button
                        onClick={onOTPVerify}
                        className={`w-full py-2 font-medium text-white bg-indigo-600 text rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            isLoadingPhone ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoadingPhone}
                    >
                        {isLoadingPhone ? (
                            <CgSpinner size={20} className="mx-auto text animate-spin" />
                        ) : (
                            "Verify OTP"
                        )}
                    </button>
                </div>
            )}

            <p className="mt-4 text text-gray-600 text-center">
                Don't have an account yet?{" "}
                <button
                    onClick={() => {

                        onSignUpClick(()=>resetForm())
                    }}
                    className="font-medium text text-indigo-600 hover:underline"
                    type="button"
                >
                    Create your account
                </button>
            </p>
            {loginSuccess && (
                <SuccessOverlay result="Login Successful!" message="Redirecting you to the dashboard...please wait !"
                                redirect="/customer-dashboard"/>
            )}
        </>
    )
}