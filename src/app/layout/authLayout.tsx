"use client";
import { AuthModalProvider, useAuthModal } from '@/hook/AuthModalContext';
import QuickLoginModal from "@/components/modal/QuickLoginModal";
import QuickRegisterModal from "@/components/modal/QuickRegisterModal";
import QuickForgotPasswordModal from "@/components/modal/QuickForgotPasswordModal";
import {AuthProvider} from "@/components/context/authContext";
import {Session} from "@/components/session/session";



const MainLayoutContent = ({ children }: {
    children: React.ReactNode;

}) => {
    const { isLoginModal,
        openLoginModal,
        closeLoginModal,
        isRegisterModal,
        openRegisterModal,
        closeRegisterModal,
        isForgottenPasswordModal,
        openForgottenPasswordModal,
        closeForgottenPasswordModal,
    } = useAuthModal();



    return (
        <>
            <div
                className={`${(isLoginModal || isRegisterModal || isForgottenPasswordModal) ? 'bg-gray-500 bg-opacity-50' : ''}`}>
                {children}
            </div>

            <QuickLoginModal isOpen={isLoginModal} onClose={closeLoginModal}/>
            <QuickRegisterModal isOpen={isRegisterModal} onClose={closeRegisterModal}/>
            <QuickForgotPasswordModal isOpen={isForgottenPasswordModal} onClose={closeForgottenPasswordModal}/>

        </>
    );
};


const AuthLayoutContent = ({children}: {
    children: React.ReactNode;

}) => (
        <AuthProvider>
            <Session>
            <AuthModalProvider>



                <MainLayoutContent>{children}</MainLayoutContent>



            </AuthModalProvider>
            </Session>

        </AuthProvider>

);

export default AuthLayoutContent;