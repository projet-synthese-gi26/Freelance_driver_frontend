import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@public/img/MainLogo1.png';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { useAuthModal } from '@/hook/AuthModalContext';


interface QuickForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

 const QuickForgotPasswordModal: React.FC<QuickForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const { openRegisterModal, openLoginModal } = useAuthModal();

    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLDivElement).classList.contains('modal-overlay')) {
            onClose();
        }
    };

    const handleSuccess = () => {
        onClose();
        openLoginModal();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
                    onClick={handleOutsideClick}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
                    >
                        <div className="flex flex-col items-center mb-6">
                            <Link href="/" className="hidden lg:block">
                                <Image src={logo} alt="logo" className="mt-3" width={150} height={80} />
                            </Link>
                            <h2 className="text-center title font-extrabold text-gray-900 font-poppins mt-1">
                                Reset your password
                            </h2>
                        </div>

                        <ForgotPasswordForm
                            onSuccess={handleSuccess}
                            onSignInClick={() => {
                                onClose();
                                openLoginModal();
                            }}
                            onSignUpClick={() => {
                                onClose();
                                openRegisterModal();
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default QuickForgotPasswordModal;