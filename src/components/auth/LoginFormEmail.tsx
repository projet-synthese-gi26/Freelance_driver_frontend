import React, { useState, ChangeEvent, FormEvent } from "react";
import ErrorTooltip from "./ErrorTooltip";
import SuccessOverlay from "@/components/auth/SuccessOverlay";
import { EyePassword, NoEyePassword } from "@/components/icon/passwordIcon";
import {loginWithEmailAndPassword} from "@/app/api/auth/login";
import { setAuthCookie } from "@/app/lib/firebase";
// import {toast} from "react-toastify";
import { toast } from "react-hot-toast";



interface LoginFormProps {
    onForgottenPasswordClick:(callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;

}

interface FormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface MousePosition {
    x: number;
    y: number;
}

export default function LoginFormEmail({onForgottenPasswordClick,onSignUpClick}:LoginFormProps) {

    const [formData, setFormData] = useState<FormData>({ email: "", password: "", rememberMe: false });
    const [error, setError] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
    const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const resetForm = () => {
        setFormData({ email: "", password: "", rememberMe: false });
        setError(null);
        setMousePosition({ x: 0, y: 0 });
        setLoginSuccess(false);
        setIsLoadingEmail(false);
        setShowPassword(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateFormMail = (): boolean => {
        if (!formData.email || !formData.password) {
            // setError("Email and password are required.");
            toast.error("Email and password are required.");
            return false;
        }
        return true;
    };



    const handleSubmitEmail = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateFormMail()) {
            return;
        }
        setIsLoadingEmail(true);
        setError(null);
        const { email, password,rememberMe } = formData;
        const {data,error}=await loginWithEmailAndPassword(email,password,rememberMe);
        if(error) {
            setIsLoadingEmail(false);
            toast.error(error.message);
            return;

        }
        setLoginSuccess(true);
        setAuthCookie()
        setIsLoadingEmail(false);
    };

    return (
        <>
            <form onSubmit={handleSubmitEmail} className="space-y-3">
                <input
                    className="w-full px-3 py-2 rounded-md text border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
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
                        onClick={togglePasswordVisibility}
                    >
                        {!showPassword ? <NoEyePassword /> : <EyePassword />}
                    </button>
                </div>

                <div className="flex justify-between items-center mt-2 mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        <span className="ml-2 text text-gray-600">Remember Me</span>
                    </label>
                    <button
                        type="button"
                        onClick={()=>{onForgottenPasswordClick(()=>resetForm())}}
                        className="text text-indigo-600 font-medium hover:underline"
                    >
                        Forgot password?
                    </button>
                </div>
                <button
                    className={`w-full py-2 text font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        isLoadingEmail ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoadingEmail}
                    onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                >
                    {isLoadingEmail ? "Loading..." : "Continue"}
                </button>
                {/*{error && <ErrorTooltip message={error} position={mousePosition} />}*/}
            </form>

            <p className="mt-4 text-sm text-gray-600 text text-center">
                Don't have an account yet?{" "}
                <button
                    type="button"
                    onClick={()=>{onSignUpClick(()=>resetForm())}}
                    className="font-medium text-indigo-600 hover:underline"
                >
                    Create your account
                </button>
            </p>
            {loginSuccess && (
                <SuccessOverlay

                    result="Login Successful!"
                    message="Redirecting you to the dashboard...please wait !"
                    redirect="/customer-dashboard"
                />
            )}
        </>
    );
}