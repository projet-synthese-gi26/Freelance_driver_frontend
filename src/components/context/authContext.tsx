import React, { createContext, useContext, ReactNode } from 'react';
import { userInterface } from "@/type/user";
import useAuth from "@/hook/useAuth"; // Make sure this path is correct

// Define the shape of the context
interface AuthContextType {
    authUser: userInterface | null;
    authUserIsLoading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType>({authUser:null,

    authUserIsLoading:true});

// Create a provider component
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const auth = useAuth();

    return (
        <AuthContext.Provider
            value={{ authUser:auth.authUser as userInterface
                , authUserIsLoading :auth.authUserIsLoading}}
>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};