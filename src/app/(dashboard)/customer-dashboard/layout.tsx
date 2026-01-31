"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, MouseEvent, useRef, ChangeEvent, useEffect } from "react";

// SERVICES & CONTEXT
import { sessionService } from "@/service/sessionService";
import { profileService } from "@/service/profileService";
import { useAuthContext } from "@/components/context/authContext";
import { toast } from 'react-hot-toast';

// COMPONENTS
import IconComponent from "@/components/general/IconComponent";
import { ProfileSwitcher } from "@/components/general/ProfileSwitcher"; // <-- IMPORT DU COMPOSANT

// ICONS
import Driver from "@public/img/driver.png";
import {
  BellIcon, ClipboardDocumentListIcon, Cog6ToothIcon, BellAlertIcon,
  ChatBubbleLeftRightIcon, CreditCardIcon, MapPinIcon, ShieldCheckIcon, UserCircleIcon,
  ArrowRightStartOnRectangleIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon,
  ChartBarIcon,
  StarIcon
} from "@heroicons/react/24/outline";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout, checkAuth } = useAuthContext();
  const [navOpen, setNavOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);

  // Redirection si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);
  
  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => setNavOpen(!navOpen);
  const handlePencilClick = () => inputFileRef.current?.click();
  const handleLogout = () => logout();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const loadingToast = toast.loading("Updating photo...");
      try {
        const updatedContext = await profileService.updateProfilePicture(file);
        sessionService.saveSessionContext(updatedContext);
        await checkAuth(); // Mettre à jour l'état local
        toast.success("Profile picture updated!", { id: loadingToast });
      } catch (error) {
        toast.error("Failed to upload image", { id: loadingToast });
        console.error(error);
      }
    }
  };

  /*const NavItems = [
    { link: '/customer-dashboard', title: 'Personal Info', icon: UserCircleIcon },
    { link: '/customer-dashboard/user-security', title: 'Security', icon: ShieldCheckIcon },
    { link: '/customer-dashboard/user-notification', title: 'Notifications', icon: BellIcon },
    { link: '/customer-dashboard/user-preference', title: 'Preferences', icon: Cog6ToothIcon },
    { link: '/customer-dashboard/user-chat', title: 'Chat', icon: ChatBubbleLeftRightIcon },
    { link: '/customer-dashboard/user-announce', title: 'Announcement', icon: BellAlertIcon },
    { link: '/customer-dashboard/user-wishlist', title: 'Next Ride', icon: MagnifyingGlassIcon },
    { link: '/customer-dashboard/user-booking', title: 'Statistics', icon: ClipboardDocumentListIcon },
    { link: '/customer-dashboard/user-payement', title: 'Payment', icon: CreditCardIcon },
    { link: '/customer-dashboard/user-address', title: 'Address', icon: MapPinIcon },
  ];
  */

  const NavItems = [
    { link: '/customer-dashboard', title: 'Personal Info', icon: UserCircleIcon },
    { link: '/customer-dashboard/user-chat', title: 'Chat', icon: ChatBubbleLeftRightIcon },
    { link: '/customer-dashboard/user-announce', title: 'Announcement', icon: BellAlertIcon },
    { link: '/customer-dashboard/user-wishlist', title: 'Next Ride', icon: MagnifyingGlassIcon },
    { link: '/customer-dashboard/user-address', title: 'Address', icon: MapPinIcon },
    { link: '/customer-dashboard/ratings', title: 'Reviews', icon:ChartBarIcon},
    { link: '/customer-dashboard/rate_app', title: 'Rate App',icon:StarIcon}
  ];


  if (isLoading || !user) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
      );
  }

  // Utilisation des données réelles
  const clientName = user.clientProfile?.firstName 
    ? `${user.clientProfile.firstName} ${user.clientProfile.lastName}` 
    : 'Passenger Profile';
  
  const userContact = user.clientProfile?.contactEmail || user.clientProfile?.phoneNumber || '';
  const avatarUrl = user.clientProfile?.profileImageUrl || "/img/default-avatar.jpeg";

  return (
    <>
      <section className="bg-white container flex flex-col lg:flex-row">
        {/* Navigation */}
        <nav
          className={`${
            navOpen ? "translate-x-0 mt-[4.5rem]" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static top-0 left-0 w-64 lg:w-[13rem] h-full z-50 transition-transform duration-500 ease-out bg-white flex flex-col justify-center border-r py-2 px-2 shadow-lg lg:shadow-none`}
        >
          <button onClick={() => setNavOpen(false)} className="lg:hidden absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="grow text">
            <div className="w-full bg-blue-500 text-white title font-bold p-3 rounded-xl flex items-center justify-center hover:shadow-lg cursor-pointer">
              UPGRADE
            </div>
            <ul className="py-5 space-y-3">
              {NavItems.map((navItem, key) => (
                <li key={key} onClick={() => setNavOpen(false)}>
                  <Link href={navItem.link}
                    className={`flex items-center gap-2 rounded-md px-3 py-1 duration-300 ${
                      path === `${navItem.link}` && "bg-primary text-white"
                    }`}>
                    <IconComponent Icon={navItem.icon} className="w-5 h-5 " />
                    {navItem.title}
                  </Link>
                </li>
              ))}
              <li onClick={handleLogout}>
                <button className="flex items-center gap-2 rounded-md px-3 py-1 duration-300 text-red-500 w-full hover:bg-red-50">
                  <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </nav>
        
        {/* Contenu principal */}
        <div className="flex-grow">
          <div className="flex items-center w-full justify-between flex-wrap pl-4 py-3 bg-[#E0D9FD]">
            <div className="flex gap-3 items-center">
              <button onClick={handleOpen} className="lg:hidden text-gray-500 hover:text-gray-700">
                <Bars3Icon className="w-6 h-6" />
              </button>
              
              <div className="hidden">
                <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" ref={inputFileRef} onChange={handleFileChange} />
              </div>
              
              <div onClick={handlePencilClick} className="cursor-pointer border-2 border-white overflow-hidden w-[40px] h-[40px] rounded-full bg-white relative mx-auto shadow-sm">
                <Image src={avatarUrl} alt="avatar" fill className="rounded-full h-full w-full object-cover" />
              </div>

              <div className="font-medium text">
                <h6 className="font-bold truncate max-w-[150px]">{clientName}</h6>
                {userContact && <p className="text-xs truncate max-w-[150px] opacity-70">{userContact}</p>}
              </div>
            </div>

            {/* --- INTÉGRATION DU BOUTON SWITCHER ICI --- */}
            <div className="flex items-center gap-3 pr-4">
                <ProfileSwitcher />
            </div>

          </div>
          <section className="transition-all duration-300 ease-out container p-4">
            {children}
          </section>
        </div>
      </section>
      
      {navOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setNavOpen(false)}></div>
      )}
    </>
  );
}