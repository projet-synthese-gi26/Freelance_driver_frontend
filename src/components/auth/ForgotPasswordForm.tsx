// import {toast} from "react-toastify";
import { toast } from "react-hot-toast";

interface ForgotPasswordFormProps {
    onSignInClick: (callback: () => void) => void;
    onSignUpClick: (callback: () => void) => void;
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { resetPassword } from "@/app/api/auth/login";

interface ForgotPasswordFormProps {
    onSuccess: () => void;
    onSignUpClick: (callback: () => void) => void;
    onSignInClick: (callback: () => void) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
                                                                          onSuccess,
                                                                          onSignInClick,
                                                                          onSignUpClick,
                                                                      }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setEmail("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const {error} = await resetPassword(email);
            if (error) {
                toast.error(error.message);
                return;
            }
            toast.success('An email has been expedied to your email account if you have an account...');
            setTimeout(() => {
                onSuccess();
            }, 8000);
        } catch (error) {
            toast.error('Error sending password reset email. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text font-medium text-gray-700 font-poppins">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-poppins"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className={`w-full flex justify-center text py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white font-poppins ${
                            isSubmitting
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send reset email'}
                    </motion.button>
                </div>
            </form>

            {/*{message && (*/}
            {/*    <motion.div*/}
            {/*        initial={{ opacity: 0 }}*/}
            {/*        animate={{ opacity: 1 }}*/}
            {/*        transition={{ duration: 0.5 }}*/}
            {/*        className="mt-4 text text-center text-gray-600 font-poppins"*/}
            {/*    >*/}
            {/*        {message}*/}
            {/*    </motion.div>*/}
            {/*)}*/}

            <div className="mt-3 flex flex-col items-center text font-poppins">
                <p>
                    Remembered your password?{' '}
                    <button
                        onClick= {()=>{onSignInClick(()=>resetForm())}}
                        className="font-medium text text-indigo-600 hover:text-indigo-500"
                    >
                        Sign In
                    </button>
                </p>
                <p className="mt-2 text">
                    Need an account?{' '}
                    <button
                        onClick={()=>{onSignUpClick(()=>resetForm())}}
                        className="font-medium text text-indigo-600 hover:text-indigo-500"
                    >
                        Create your account
                    </button>
                </p>
            </div>
        </>
    );
};