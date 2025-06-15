// // AuthModalContext.js
// import React, { createContext, useState, useContext } from 'react';
//
// export const AuthModalContext = createContext();
//
// export const AuthModalProvider = ({ children }) => {
//     const [isLoginModal, setIsLoginModal] = useState(false);
//
//     const [isRegisterModal, setIsRegisterModal] = useState(false);
//     const [isForgottenPasswordModal, setIsForgottenPasswordModal] = useState(false);
//
//     const openRegisterModal = () => setIsRegisterModal(true);
//     const closeRegisterModal = () => setIsRegisterModal(false);
//
//     const openLoginModal = () => {
//         setIsLoginModal(true);
//     };
//
//     const closeLoginModal = () => {
//         setIsLoginModal(false);
//     };
//
//     const closeForgottenPasswordModal = () => {
//         setIsForgottenPasswordModal(false);
//     };
//
//     const openForgottenPasswordModal = () => {
//         setIsForgottenPasswordModal(true);
//     };
//
//
//     const contextValue = {
//         isLoginModal,
//         openLoginModal,
//         closeLoginModal,
//
//         isRegisterModal,
//         openRegisterModal,
//         closeRegisterModal,
//
//         isForgottenPasswordModal,
//         openForgottenPasswordModal,
//         closeForgottenPasswordModal,
//
//     };
//
//     return (
//         <AuthModalContext.Provider value={contextValue}>
//             {children}
//         </AuthModalContext.Provider>
//     );
// };
//
// export const useAuthModal = () => {
//     return useContext(AuthModalContext);
// };

// AuthModalContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthModalContextType {
    isLoginModal: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
    isRegisterModal: boolean;
    openRegisterModal: () => void;
    closeRegisterModal: () => void;
    isForgottenPasswordModal: boolean;
    openForgottenPasswordModal: () => void;
    closeForgottenPasswordModal: () => void;
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

interface AuthModalProviderProps {
    children: ReactNode;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({ children }) => {
    const [isLoginModal, setIsLoginModal] = useState<boolean>(false);
    const [isRegisterModal, setIsRegisterModal] = useState<boolean>(false);
    const [isForgottenPasswordModal, setIsForgottenPasswordModal] = useState<boolean>(false);

    const openRegisterModal = (): void => setIsRegisterModal(true);
    const closeRegisterModal = (): void => setIsRegisterModal(false);

    const openLoginModal = (): void => {
        setIsLoginModal(true);
    };

    const closeLoginModal = (): void => {
        setIsLoginModal(false);
    };

    const closeForgottenPasswordModal = (): void => {
        setIsForgottenPasswordModal(false);
    };

    const openForgottenPasswordModal = (): void => {
        setIsForgottenPasswordModal(true);
    };

    const contextValue: AuthModalContextType = {
        isLoginModal,
        openLoginModal,
        closeLoginModal,
        isRegisterModal,
        openRegisterModal,
        closeRegisterModal,
        isForgottenPasswordModal,
        openForgottenPasswordModal,
        closeForgottenPasswordModal,
    };

    return (
        <AuthModalContext.Provider value={contextValue}>
            {children}
        </AuthModalContext.Provider>
    );
};

export const useAuthModal = (): AuthModalContextType => {
    const context = useContext(AuthModalContext);
    if (context === undefined) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
};