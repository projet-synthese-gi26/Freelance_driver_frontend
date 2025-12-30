// Composant d'avatar utilisateur avec menu déroulant et déconnexion
import React, {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthContext } from '@/components/context/authContext';

import { useRouter} from "next/navigation";

export const MyAccountAvatar = () => {
    // Récupère l'utilisateur authentifié depuis le contexte
    const { authUser } = useAuthContext();
    // Gère l'ouverture/fermeture du menu
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    // Références pour gérer les clics hors menu
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Ouvre/ferme le menu
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Déconnexion utilisateur : supprime les cookies et redirige vers l'accueil
   
    // Ferme le menu si clic en dehors ou touche Échap
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

    // Avatar par défaut si pas de photo utilisateur
    const avatarSrc = "dark_avatar.svg"

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bouton avatar qui ouvre le menu */}
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

            {/* Menu déroulant avec liens et bouton de déconnexion */}
            {isOpen && (
                <div className="absolute lg:right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-[#243757] font-bold max-h-[80vh] overflow-y-auto">
                   
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
                    {/* Déconnexion */}
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};