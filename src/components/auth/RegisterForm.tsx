

import React, { useState, ChangeEvent, FormEvent, MouseEvent } from "react";
import dynamic from 'next/dynamic';
import LoginButtons from "@/components/auth/LoginButtons";
import ErrorTooltip from "@/components/auth/ErrorTooltip";
import { EyePassword, NoEyePassword } from "@/components/icon/passwordIcon";
import SuccessOverlay from "@/components/auth/SuccessOverlay";
import {register} from "@/app/api/auth/register";
import {toast} from "react-hot-toast";
import {createUserData} from "@/app/api/auth/db";
import validatePassword from "@/components/auth/passwordUtil";


const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false });

interface FormData {
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    isSelected: boolean;
}


interface RegisterFormProps {
    onSignInClick: (callback: () => void) => void;

}

export default function RegisterForm({onSignInClick}:RegisterFormProps) {
    const [formData, setFormData] = useState<FormData>({
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        isSelected: false
    });
    const { phoneNumber, email, password, confirmPassword, isSelected } = formData;
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [passwordTouched, setPasswordTouched] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [Success, setSuccess] = useState<boolean>(false);


    const handleSuccess = () => {
        setSuccess(true);
    };

    const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        if (event.target.name === 'confirmPassword') {
            setPasswordTouched(true);
        }
    };

    const validateForm = (): boolean => {
        if (!phoneNumber || !email || !password || !confirmPassword) {
           // setError("Please fill in all fields.");
            toast.error("Please fill in all fields.");

            const {    isValid, message}=validatePassword(password );
            if(!isValid) {
                toast.error(message);
            }

            return false;
        }
        return true;
    };


     const createUser=async (
        collectionName: string,
        userId: string,
        userData: object
    )=>{

         const {error}=await createUserData(collectionName,userId,userData);

         if(error) {
             setIsLoading(false);
             toast.error(error.message);
             return;

         }

         setIsLoading(false);
         handleSuccess();
         resetForm();

    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError(null);

        const formatPh = "+" + formData.phoneNumber.replace(/\D/g, '');
        const {data,error}=await register(email,formatPh, password,isSelected);

        if(error) {
            setIsLoading(false);
            toast.error(error.message);
            return;

        }
        const userData= {

            user_id: data.uid,
            user_email: data.email,
            email_verified:data.emailVerified,
            // phone_number:data.phoneNumber,
            phone_number:formatPh,
            created_at:new Date().toString(),
            registration_date:new Date().toString(),
            is_selected: isSelected,
            user_type: ["customer"],
        }
        await createUser("users", data.uid, userData);

    };

    const resetForm = () => {
        setFormData({ password: "", confirmPassword: "", phoneNumber:"", email: "", isSelected: false });
        setError(null);
        setShowPassword(false);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-sm mx-auto">
                <LoginButtons />
                <div className="my-4 border-b text-center">
                    <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                        Or with email
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <PhoneInput
                        country={'cm'}
                        value={formData.phoneNumber}
                        onChange={(phoneNumber: string) => setFormData({ ...formData, phoneNumber })}
                        inputProps={{
                            name: 'phoneNumber',
                            required: true,
                            className: 'w-full pl-14 pr-3 py-2.5 text rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        }}
                        containerClass="relative"
                        buttonClass="absolute left-0 top-0 bottom-0 flex items-center justify-center px-3 border-r"
                        dropdownClass="absolute left-0 z-50 bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto"
                    />
                    <input
                        className="w-full px-3 py-2 text rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                    <div className="relative">
                        <input
                            className="w-full px-3 py-2 pr-10 rounded-md border text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('password')}
                        >
                            {!showPassword || !showConfirmPassword ? <NoEyePassword /> : <EyePassword />}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            className="w-full px-3 py-2 pr-10 rounded-md border text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                        >
                            {!showConfirmPassword || !showPassword ? <NoEyePassword /> : <EyePassword />}
                        </button>
                    </div>
                    {passwordTouched && password !== confirmPassword && (
                        <p className="text text-red-500">{"Passwords do not match"}</p>
                    )}
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text text-indigo-600 transition duration-150 ease-in-out"
                            name="isSelected"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({
                                ...formData,
                                isSelected: e.target.checked
                            })}
                            required
                        />
                        <span className="ml-2 text text-gray-600">
                            By creating account means you agree to the
                            <a href="#0" className="text-primary hover:underline"> Terms and Conditions</a>, and our
                            <a href="#0" className="text-primary hover:underline"> Privacy Policy</a>
                        </span>
                    </label>
                    <button
                        className={`w-full py-2 text font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            isLoading || password !== confirmPassword ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        type="submit"
                        onMouseMove={(e: MouseEvent<HTMLButtonElement>) => setMousePosition({ x: e.clientX, y: e.clientY })}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Create account"}
                    </button>
                    {/*{error && (*/}
                    {/*    <ErrorTooltip message={error} position={mousePosition} />*/}
                    {/*)}*/}
                </form>

                <p className="mt-2 text text-gray-600 text-center">
                    Already have an account?{" "}
                    <button onClick= {()=>{onSignInClick(()=>resetForm())}}
                            className="font-medium text text-indigo-600 hover:underline">
                        Sign in
                    </button>
                </p>
            </div>

            {Success && (
                <SuccessOverlay
                    result="Register Successful!"
                    message="Please verify your email to activate it before sign in..."
                    redirect="/login"
                />
            )}
        </div>
    );
}