import React, {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthContext } from '@/components/context/authContext';
import {handleSignOUt} from "@/components/auth/LogOut";
import { useRouter} from "next/navigation";

export const MyAccountAvatar = () => {
    const { authUser } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const SignOut = () => {
        handleSignOUt().then(r => {});
        router.push('/');
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscapeKey = ((event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        });

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey as EventListener);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey as EventListener);
        };
    }, []);

    const avatarSrc = authUser?.userData?.profile_picture || "dark_avatar.svg"

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="flex flex-col items-center overflow-hidden">
                    <Image
                        src={avatarSrc}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                </div>
                <span className="hidden lg:inline font-bold text-[#243757]">My Account</span>
            </button>

            {isOpen && (
                <div className="absolute lg:right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-[#243757] font-bold max-h-[80vh] overflow-y-auto">
                    <div className="px-4 py-2 border-b">
                        {authUser?.userData?.user_friendly_name ? (
                            <p className="text-sm font-semibold">{authUser.userData.user_friendly_name}</p>
                        ) : (
                            <span></span>
                        )}
                        <p className="text-sm text-gray-500 truncate">{authUser?.user_email}</p>
                    </div>
                    <Link href="/customer-dashboard/customerId=''#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                    </Link>
                    <Link href="/customer-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                    </Link>
                    <Link href="/customer-dashboard#work-preferences" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Work Preferences
                    </Link>
                    <Link href="/customer-dashboard/customerId=''#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                    </Link>
                    <button onClick={SignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};