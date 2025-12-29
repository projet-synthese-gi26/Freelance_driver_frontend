"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Driver from "@public/img/driver.png";
import IconComponent from "@/components/general/IconComponent";

import {
  BellIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  MapPinIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

import { useState, MouseEvent, useRef, ChangeEvent, useEffect } from "react";
// Import des services backend
import { sessionService } from "@/service/sessionService";
import { profileService } from "@/service/profileService";
import { toast } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  // On utilise any temporairement pour l'état pour éviter les erreurs de mapping strict
  const [userContext, setUserContext] = useState<any>(null);
  const path = usePathname();
  const inputFileRef = useRef<HTMLInputElement>(null);

  // Charger les données de session au montage
  useEffect(() => {
    const context = sessionService.getUserSessionContext();
    setUserContext(context);
  }, []);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setNavOpen(!navOpen);
  };

  const handlePencilClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const loadingToast = toast.loading("Uploading image...");
        // 1. Upload du fichier
        const imageUrl = await profileService.uploadAvatar(file);
        
        // 2. Mise à jour de l'URL dans le profil (Client)
        const updatedContext = await profileService.updateClientAvatarUrl(imageUrl);
        
        // 3. Persistance locale
        sessionService.saveSessionContext(updatedContext);
        setUserContext(updatedContext);
        
        toast.dismiss(loadingToast);
        toast.success("Profile picture updated!");
      } catch (error) {
        toast.error("Failed to upload image");
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    sessionService.clearUserData();
    window.location.href = "/login";
  };

  const NavItems = [
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
  ]

  // LOGIQUE DE MAPPING ROBUSTE (évite les erreurs TS)
  const p = userContext?.profile || userContext;
  const firstName = p?.first_name || p?.firstName || "";
  const lastName = p?.last_name || p?.lastName || "";
  const displayName = `${firstName} ${lastName}`.trim() || userContext?.username || "User";
  const displayEmail = userContext?.email || p?.email || "";
  const displayAvatar = p?.profile_image_url || p?.profileImageUrl || "/img/driver.png";

  return (
    <>
      <section className="bg-white container flex flex-col lg:flex-row">
        <nav
          className={`${
            navOpen ? "translate-x-0 mt-[4.5rem]" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static top-0 left-0 w-64 lg:w-[11rem] h-full z-50 transition-transform duration-500 ease-out bg-white flex flex-col justify-center border-r py-2 px-2 shadow-lg lg:shadow-none overflow-y-auto`}
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
                      path == `${navItem.link}` && "bg-primary text-white"
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
        <div className="flex-grow">
          <div className="flex items-center w-full justify-between flex-wrap pl-4 py-3 bg-[#E0D9FD]">
            <div className="flex gap-2 items-center">
              <button onClick={handleOpen} className="lg:hidden text-gray-500 hover:text-gray-700">
                <Bars3Icon className="w-6 h-6" />
              </button>
              
              <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" className="hidden" ref={inputFileRef} onChange={handleFileChange} />
              
              <div onClick={handlePencilClick} className="cursor-pointer border overflow-hidden w-[40px] h-[40px] border-[var(--primary)] rounded-full bg-white grid place-content-center relative mx-auto shadow-sm">
                <Image
                  width={40}
                  height={40}
                  src={displayAvatar}
                  alt="profile"
                  className="rounded-full h-full w-full object-cover"
                />
                <div className="w-3 h-3 grid place-content-center rounded-full border border-white text-white bg-primary absolute bottom-1 right-0">
                  <CheckIcon className="w-2 h-2" />
                </div>
              </div>
              <div className="font-medium text">
                <h6 className="font-bold truncate max-w-[150px]">{displayName}</h6>
                <p className="text-xs truncate max-w-[150px] opacity-70">{displayEmail}</p>
              </div>
            </div>
            <Link
              className={`md:text-[1.25rem] text font-bold cursor-pointer ${navOpen ? "mt-[3rem]" : ""} flex bg-white items-center gap-1 md:p-3 p-1 mr-[2%] rounded-md border-[var(--orange)] border hover:bg-[var(--orange)] hover:text-white hover:shadow-lg text-[var(--orange)] justify-center transition-all`}
              href="/pricing-plan"
            >
              <Image src={Driver} alt="logo" className="w-5 h-5" />
              Become a driver
            </Link>
          </div>
          <section className={`${navOpen ? "lg:ml-0" : "ml-0"} transition-all duration-300 ease-out container min-h-screen`}>
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