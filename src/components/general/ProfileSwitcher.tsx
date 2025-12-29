"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserCircleIcon, TruckIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '@/components/context/authContext';
import { toast } from 'react-hot-toast';

export const ProfileSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Plus fiable que window.location
  const { user } = useAuthContext();

  if (!user || !user.roles) {
    return null; // Ne rien afficher si l'utilisateur n'est pas chargé
  }

  const hasDriverRole = user.roles.includes('DRIVER');
  const hasClientRole = user.roles.includes('CLIENT');

  // 1. Déterminer le rôle ACTIF basé sur l'URL actuelle
  const isActiveRoleDriver = pathname.startsWith('/freelance-dashboard');

  // 2. Déterminer le rôle CIBLE (celui vers lequel on veut aller)
  const targetRole = isActiveRoleDriver ? 'CLIENT' : 'DRIVER';
  
  // 3. Vérifier si l'utilisateur DOIT CRÉER le profil cible
  const needsToCreateTargetRole = 
    (targetRole === 'CLIENT' && !hasClientRole) || 
    (targetRole === 'DRIVER' && !hasDriverRole);

  const handleAction = () => {
    if (needsToCreateTargetRole) {
      // Cas 1: L'utilisateur n'a pas le rôle, on le redirige vers la page de création
      const pageToRedirect = targetRole === 'CLIENT' ? '/onboarding/become-client' : '/onboarding/become-driver';
      toast.success(`Let's create your ${targetRole.toLowerCase()} profile!`);
      router.push(pageToRedirect);
    } else {
      // Cas 2: L'utilisateur a déjà le rôle, on bascule simplement de tableau de bord
      const pageToRedirect = targetRole === 'CLIENT' ? '/customer-dashboard' : '/freelance-dashboard';
      toast.success(`Switching to ${targetRole.toLowerCase()} mode...`);
      router.push(pageToRedirect);
    }
  };

  // Définir le texte, la couleur et l'icône du bouton dynamiquement
  const buttonText = needsToCreateTargetRole 
    ? `Become a ${targetRole === 'DRIVER' ? 'Driver' : 'Passenger'}`
    : `Switch to ${targetRole === 'DRIVER' ? 'Driver' : 'Passenger'}`;

  const buttonColor = targetRole === 'DRIVER' 
    ? 'bg-blue-600 hover:bg-blue-700' 
    : 'bg-green-600 hover:bg-green-700';

  const Icon = targetRole === 'DRIVER' ? TruckIcon : UserCircleIcon;

  return (
    <button
        onClick={handleAction}
        className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-bold transition shadow-sm ${buttonColor}`}
    >
        <Icon className="w-5 h-5" />
        {buttonText}
    </button>
  );
};