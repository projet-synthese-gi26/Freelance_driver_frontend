// Composant d'avatar utilisateur moderne avec actions rapides
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthContext } from '@/components/context/authContext';
import { usePathname, useRouter } from "next/navigation";
import { 
    UserCircleIcon, 
    TruckIcon, 
    Cog6ToothIcon, 
    ArrowRightOnRectangleIcon, 
    HomeIcon,
    MagnifyingGlassIcon,
    MapIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const MyAccountAvatar = () => {
    const { authUser, user, logout } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    // Déterminer les rôles de l'utilisateur
    const hasDriverRole = user?.roles?.includes('DRIVER');
    const hasClientRole = user?.roles?.includes('CLIENT');
    const isOnDriverDashboard = pathname?.startsWith('/freelance-dashboard');
    const isOnClientDashboard = pathname?.startsWith('/customer-dashboard');
    const isOnDashboard = isOnDriverDashboard || isOnClientDashboard;
    const isOnSearchPage = pathname?.startsWith('/freelance-search') || pathname?.startsWith('/announcement-search');

    // Déterminer le mode actuel (chauffeur ou client)
    // Par défaut, si on a les deux rôles, on considère qu'on est client sauf si on est sur le dashboard chauffeur
    const currentMode = isOnDriverDashboard ? 'DRIVER' : 
                        isOnClientDashboard ? 'CLIENT' :
                        hasDriverRole && !hasClientRole ? 'DRIVER' : 'CLIENT';

    // Rôle cible pour le switch
    const targetRole = currentMode === 'DRIVER' ? 'CLIENT' : 'DRIVER';
    const needsToCreateTargetRole = 
        (targetRole === 'CLIENT' && !hasClientRole) || 
        (targetRole === 'DRIVER' && !hasDriverRole);

    // Page de recherche selon le mode actuel
    const searchPage = currentMode === 'DRIVER' ? '/announcement-search' : '/freelance-search';
    const searchLabel = currentMode === 'DRIVER' ? 'Trouver des clients' : 'Trouver un chauffeur';

    // Dashboard selon le mode actuel
    const dashboardPage = currentMode === 'DRIVER' ? '/freelance-dashboard' : '/customer-dashboard';

    // Déconnexion utilisateur
    const handleLogout = async () => {
        try {
            if (logout) {
                await logout();
            }
            setIsOpen(false);
            toast.success('Déconnexion réussie');
            router.push('/');
        } catch (error) {
            toast.error('Erreur lors de la déconnexion');
        }
    };

    // Basculer de rôle
    const handleRoleSwitch = () => {
        setIsOpen(false);
        if (needsToCreateTargetRole) {
            const pageToRedirect = targetRole === 'CLIENT' ? '/onboarding/become-client' : '/onboarding/become-driver';
            router.push(pageToRedirect);
        } else {
            // Rediriger vers la page de recherche appropriée
            const searchPageTarget = targetRole === 'DRIVER' ? '/announcement-search' : '/freelance-search';
            toast.success(`Mode ${targetRole === 'DRIVER' ? 'Chauffeur' : 'Client'} activé`);
            router.push(searchPageTarget);
        }
    };

    // Aller au dashboard approprié
    const goToDashboard = () => {
        setIsOpen(false);
        router.push(dashboardPage);
    };

    // Aller à la page de recherche
    const goToSearch = () => {
        setIsOpen(false);
        router.push(searchPage);
    };

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

    const avatarSrc = authUser?.profileImageUrl || user?.clientProfile?.profileImageUrl || user?.driverProfile?.profileImageUrl || "/dark_avatar.svg";
    const userName = user?.firstName || authUser?.firstName || 'Mon Compte';
    const userEmail = authUser?.email || user?.email || '';

    return (
        <div className="flex items-center gap-2">
            {/* Bouton Switch de rôle - Toujours visible */}
            <button
                onClick={handleRoleSwitch}
                className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    targetRole === 'DRIVER' 
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                }`}
                title={needsToCreateTargetRole ? `Devenir ${targetRole === 'DRIVER' ? 'Chauffeur' : 'Client'}` : `Passer en mode ${targetRole === 'DRIVER' ? 'Chauffeur' : 'Client'}`}
            >
                {targetRole === 'DRIVER' ? (
                    <TruckIcon className="w-4 h-4" />
                ) : (
                    <UserCircleIcon className="w-4 h-4" />
                )}
                <span className="hidden lg:inline">
                    {needsToCreateTargetRole 
                        ? `Devenir ${targetRole === 'DRIVER' ? 'Chauffeur' : 'Client'}`
                        : `Mode ${targetRole === 'DRIVER' ? 'Chauffeur' : 'Client'}`
                    }
                </span>
            </button>

            {/* Bouton Recherche - Si pas sur page de recherche */}
            {!isOnSearchPage && (
                <button
                    onClick={goToSearch}
                    className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-200 border border-gray-200"
                    title={searchLabel}
                >
                    <MapIcon className="w-4 h-4" />
                    <span className="hidden lg:inline">{searchLabel}</span>
                </button>
            )}

            {/* Bouton Dashboard - Si pas sur dashboard */}
            {!isOnDashboard && (
                <button
                    onClick={goToDashboard}
                    className="flex items-center gap-2 px-3 py-2 bg-[#243757] text-white rounded-full text-sm font-medium hover:bg-[#1a2a42] transition-all duration-200 shadow-sm"
                    title="Aller au Dashboard"
                >
                    <HomeIcon className="w-4 h-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                </button>
            )}

            {/* Menu Avatar */}
            <div className="relative" ref={dropdownRef}>
                <button
                    ref={buttonRef}
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    <div className="relative">
                        <Image
                            src={avatarSrc}
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full border-2 border-gray-200 object-cover"
                        />
                        {/* Indicateur de statut en ligne */}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <svg className={`hidden md:block w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Menu déroulant */}
                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl py-0 z-50 border border-gray-100 overflow-hidden">
                        {/* En-tête du profil */}
                        <div className="px-4 py-4 bg-gradient-to-r from-[#243757] to-[#3a5a8a] text-white">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={avatarSrc}
                                    alt="User Avatar"
                                    width={48}
                                    height={48}
                                    className="rounded-full border-2 border-white/30 object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white truncate">{userName}</p>
                                    <p className="text-sm text-white/70 truncate">{userEmail}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                            currentMode === 'DRIVER' 
                                                ? 'bg-blue-500/30 text-blue-100' 
                                                : 'bg-green-500/30 text-green-100'
                                        }`}>
                                            {currentMode === 'DRIVER' ? (
                                                <><TruckIcon className="w-3 h-3" /> Chauffeur</>
                                            ) : (
                                                <><UserCircleIcon className="w-3 h-3" /> Client</>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions rapides pour mobile */}
                        <div className="md:hidden border-b border-gray-100 py-2">
                            <button
                                onClick={handleRoleSwitch}
                                className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                                    targetRole === 'DRIVER' 
                                        ? 'text-blue-700 hover:bg-blue-50' 
                                        : 'text-orange-700 hover:bg-orange-50'
                                }`}
                            >
                                {targetRole === 'DRIVER' ? (
                                    <TruckIcon className="w-5 h-5" />
                                ) : (
                                    <UserCircleIcon className="w-5 h-5" />
                                )}
                                {needsToCreateTargetRole 
                                    ? `Devenir ${targetRole === 'DRIVER' ? 'Chauffeur' : 'Client'}`
                                    : `Passer en mode ${targetRole === 'DRIVER' ? 'Chauffeur' : 'Client'}`
                                }
                            </button>

                            {!isOnSearchPage && (
                                <button
                                    onClick={goToSearch}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <MapIcon className="w-5 h-5 text-gray-400" />
                                    {searchLabel}
                                </button>
                            )}
                        </div>

                        {/* Liens du menu */}
                        <div className="py-2">
                            <Link 
                                href={`${dashboardPage}`} 
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <UserCircleIcon className="w-5 h-5 text-gray-400" />
                                Mon Profil
                            </Link>
                            
                            {!isOnDashboard && (
                                <button
                                    onClick={goToDashboard}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <HomeIcon className="w-5 h-5 text-gray-400" />
                                    Dashboard
                                </button>
                            )}

                            <Link 
                                href={`${dashboardPage}/settings`} 
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
                                Paramètres
                            </Link>
                        </div>

                        {/* Séparateur */}
                        <div className="border-t border-gray-100"></div>

                        {/* Bouton de switch de rôle - Desktop only dans le menu */}
                        <div className="hidden md:block py-2 px-3">
                            <button
                                onClick={handleRoleSwitch}
                                className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    targetRole === 'DRIVER' 
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 border border-blue-200' 
                                        : 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 hover:from-orange-100 hover:to-orange-200 border border-orange-200'
                                }`}
                            >
                                {targetRole === 'DRIVER' ? (
                                    <TruckIcon className="w-5 h-5" />
                                ) : (
                                    <UserCircleIcon className="w-5 h-5" />
                                )}
                                {needsToCreateTargetRole 
                                    ? `Devenir ${targetRole === 'DRIVER' ? 'Chauffeur' : 'Client'}`
                                    : `Passer en mode ${targetRole === 'DRIVER' ? 'Chauffeur' : 'Client'}`
                                }
                            </button>
                        </div>

                        {/* Séparateur */}
                        <div className="border-t border-gray-100"></div>

                        {/* Déconnexion */}
                        <div className="py-2">
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};