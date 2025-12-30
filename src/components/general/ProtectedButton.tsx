// components/ProtectedButton.tsx

import { useAuthContext } from '@/components/context/authContext';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import {useAuthModal} from "@/hook/AuthModalContext";

interface ProtectedButtonProps {
    onProtectedClick: () => void;
    fallbackPath?: string;
    style?: string;
    className?: string;

    children: React.ReactNode;

}



export const ProtectedButton: React.FC<ProtectedButtonProps> = ({
                                                                    onProtectedClick,
                                                                    fallbackPath = '/login',
                                                                     style='',
                                                                    className='default',
                                                                    children,
                                                                    ...buttonProps
                                                                }) => {
    const { authUser } = useAuthContext();
    const { openLoginModal } = useAuthModal();

    const router = useRouter();

    const handleClick = () => {
        if (authUser) {
            onProtectedClick();
        } else {
            // router.push(fallbackPath);
            openLoginModal();
        }
    };
    const buttonClasses = clsx(
        className,style
    );

    

    return (
        <button
            onClick={handleClick}

            className={buttonClasses} // Combinaison des classes
            {...buttonProps}
        >
            {children}
        </button>
    );
};