"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; 
import { toast } from 'react-hot-toast';
import { useState, MouseEvent, ChangeEvent, useMemo, useEffect, useCallback, useRef } from "react";

// SERVICES & CONTEXT
import { sessionService } from "@/service/sessionService";
import { profileService } from "@/service/profileService";
import { useAuthContext } from "@/components/context/authContext";

// COMPONENTS
import IconComponent from "@/components/general/IconComponent";
import { ProfileSwitcher } from "@/components/general/ProfileSwitcher"; // <-- IMPORT DU COMPOSANT
import { useTranslations } from "next-intl";

// ICONS
import portofolio from "@public/img/cv.png"
import support from "@public/img/support.png"
import {
  ChatBubbleLeftRightIcon, BriefcaseIcon, ShieldCheckIcon, UserCircleIcon, ArrowRightStartOnRectangleIcon,
  Bars3Icon, XMarkIcon, ChartBarIcon, Cog8ToothIcon, StarIcon, BanknotesIcon, ChevronDownIcon, GlobeAltIcon
} from "@heroicons/react/24/outline";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Dashboard.freelance");
  const { user, isLoading, logout, checkAuth } = useAuthContext();
  const [navOpen, setNavOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const path = usePathname();
  const router = useRouter();

  // Redirection si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  const Pendingorders = 0; 
  
  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => setNavOpen(!navOpen);
  const handleLogout = useCallback(() => logout(), [logout]);

  /*const NavItems = useMemo(() => [
    {link:'/freelance-dashboard',title:'Personal Info',icon:UserCircleIcon},
    {link:'/freelance-dashboard/security',title:'Security',icon:ShieldCheckIcon},
    {
      title:'Business',
      icon:BriefcaseIcon,
      subItems: [
        {link:'/freelance-dashboard/business',title:'Agency'},
        {link:'/freelance-dashboard/business/referral',title:'Referral'},
        {link:'/freelance-dashboard/business/address',title:'Address'},
        {link:'/freelance-dashboard/business/planning',title:'Planning'},
        {link:'/freelance-dashboard/business/rides',title:'Rides'},
        {link:'/freelance-dashboard/business/vehicles',title:'Vehicles'},
        {link:'/freelance-dashboard/business/orders',title:'Orders'},
      ]
    },
    {title:'Portofolio',icon:portofolio,
      subItems: [
        {link:'/freelance-dashboard/portofolio',title:'Experience'},
        {link:'/freelance-dashboard/portofolio/vehicle',title:'Vehicle Info'}
      ]
    },
    {title:'Finance',icon:BanknotesIcon,
      subItems: [
        {link:'/freelance-dashboard/finance/invoices',title:'Invoices'},
        {link:'/freelance-dashboard/finance/wallet',title:'My Wallet'},
        {link:'/freelance-dashboard/finance/earnings',title:'My Earnings'},
        {link:'/freelance-dashboard/finance/voucher',title:'Voucher'},
      ]
    },
    {link:'/freelance-dashboard/ratings',title:'Reviews',icon:ChartBarIcon},
    {title:'Support',icon:support,link:'/freelance-dashboard/support'},
    {link:'/freelance-dashboard/settings',title:'Settings',icon:Cog8ToothIcon},
    {link:'/freelance-dashboard/chat',title:'Chat',icon:ChatBubbleLeftRightIcon},
    {link:'/freelance-dashboard/rate_app',title:'Rate App',icon:StarIcon},
    {link:'#',title:'Log out',icon:ArrowRightStartOnRectangleIcon},
  ], []);
  */
   const NavItems = useMemo(() => [
    {link:'/freelance-dashboard',title:t('nav.personalInfo'),icon:UserCircleIcon},
    {link:'/freelance-dashboard/security',title:t('nav.security'),icon:ShieldCheckIcon},
    
    {
      title:t('nav.business.title'),
      icon:BriefcaseIcon,
      subItems: [
        
        {link:'/freelance-dashboard/business/address',title:t('nav.business.address')},
        {link:'/freelance-dashboard/business/contacts',title:t('nav.business.contacts')},
        {link:'/freelance-dashboard/business/planning',title:t('nav.business.planning')},
        {link:'/freelance-dashboard/business/rides',title:t('nav.business.rides')},
        {link:'/freelance-dashboard/business/vehicles',title:t('nav.business.vehicles')},
        {link:'/freelance-dashboard/business/orders',title:t('nav.business.orders')},
      ]
    },
    {title:t('nav.portfolio.title'),icon:portofolio,
      subItems: [
        {link:'/freelance-dashboard/portofolio',title:t('nav.portfolio.experience')},
        
      ]
    },
    
    {link:'/freelance-dashboard/ratings',title:t('nav.reviews'),icon:ChartBarIcon},
    {title:t('nav.support'),icon:support,link:'/freelance-dashboard/support'},
    {link:'/freelance-dashboard/settings',title:t('nav.settings'),icon:Cog8ToothIcon},
    {link:'/freelance-dashboard/chat',title:t('nav.chat'),icon:ChatBubbleLeftRightIcon},
    {link:'/freelance-dashboard/rate_app',title:t('nav.rateApp'),icon:StarIcon},
    {link:'#',title:t('nav.logout'),icon:ArrowRightStartOnRectangleIcon},
  ], [t]);

  const toggleSubMenu = useCallback((navItem: any) => {
    if (navItem.title === t('nav.logout')) {
      handleLogout();
      return;
    }

    if (navItem.subItems) {
      setOpenSubMenu(prevOpenSubMenu => 
        prevOpenSubMenu === navItem.title ? null : navItem.title
      );
      if (openSubMenu !== navItem.title) {
        router.push(navItem.subItems[0].link);
      }
    } else {
      setOpenSubMenu(null);
      if (navItem.link && navItem.link !== '#') {
        router.push(navItem.link);
      }
    }
  }, [openSubMenu, router, handleLogout]);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const handlePencilClick = () => inputFileRef.current?.click();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const loadingToast = toast.loading(t('toasts.updatingPhoto'));
        try {
            const updatedContext = await profileService.updateProfilePicture(file);
            sessionService.saveSessionContext(updatedContext);
            await checkAuth();
            toast.success(t('toasts.photoUpdated'), { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error(t('toasts.updateFailed'), { id: loadingToast });
        }
      }
  };

  const isActive = useCallback((navItem: any) => {
    if (navItem.link && navItem.link !== '#') return path === navItem.link;
    if (navItem.subItems) return navItem.subItems.some((subItem: any) => subItem.link === path);
    return false;
  }, [path]);

  useEffect(() => {
    const activeNavItem = NavItems.find(item => isActive(item));
    setOpenSubMenu(activeNavItem && activeNavItem.subItems ? activeNavItem.title : null);
  }, [path, NavItems, isActive]);

  if (isLoading || !user) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
      );
  }

  const driverName = user.user?.firstName
    ? `${user.user.firstName} ${user.user.lastName}`
    : t('driverProfileFallback');
  
  const userContact = user.user?.phone || '';
  const avatarUrl = user.user?.photoUri || "/white-silhouette-avatar.png";

  return (
    <div className="min-h-screen bg-white">
      <section className="container flex flex-col lg:flex-row">
        {/* Navigation latérale */}
        <nav
          className={`${
            navOpen ? "translate-x-0 mt-[4.5rem]" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static top-0 left-0 w-64 lg:w-[13rem] h-full z-50 transition-transform duration-500 ease-out bg-white flex flex-col border-r py-2 px-2 shadow-lg lg:shadow-none`}
        >
          <button onClick={() => setNavOpen(false)} className="lg:hidden absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="grow text">
            <div className="w-full border-primary-500 text-primary border title font-bold p-3 rounded-md flex items-center justify-center cursor-pointer">
              {t('basicPlan')}
            </div>
            <ul className="py-5 space-y-3">
              {NavItems.map((navItem, key) => (
                <li key={key}>
                  {navItem.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleSubMenu(navItem)}
                        className={`flex items-center justify-between w-full gap-2 rounded-md px-3 py-1 duration-300 ${
                          isActive(navItem) && openSubMenu === navItem.title ? "bg-primary text-white" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent Icon={navItem.icon} className="w-5 h-5" />
                          {navItem.title}
                        </div>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${openSubMenu === navItem.title ? 'rotate-180' : ''}`} />
                      </button>
                      {openSubMenu === navItem.title && (
                        <ul className="ml-6 mt-2 space-y-2">
                          {navItem.subItems.map((subItem, subKey) => (
                            <li key={subKey} onClick={() => setNavOpen(false)}>
                              <Link href={subItem.link}
                                className={`block rounded-md px-3 py-1 duration-300 ${
                                  path === subItem.link ? "bg-primary text-white" : ""
                                }`}
                              >
                                {subItem.title === "Orders" ? (
                                  <span>{subItem.title} ({Pendingorders})</span>
                                ) : (
                                  <span>{subItem.title}</span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleSubMenu(navItem)}
                      className={`flex items-center gap-2 rounded-md px-3 py-1 duration-300 w-full ${
                        isActive(navItem) ? "bg-primary text-white" : ""
                      }`}
                    >
                      <IconComponent Icon={navItem.icon} className="w-5 h-5" />
                      {navItem.title}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="flex-grow">
          {/* Header du Dashboard */}
          <div className="flex items-center w-full justify-between flex-wrap gap-4 pl-4 py-3 bg-[#E0D9FD]">
            <div className="flex gap-3 items-center">
              <button onClick={handleOpen} className="lg:hidden text-gray-500 hover:text-gray-700">
                <Bars3Icon className="w-6 h-6" />
              </button>
              
              <div className="hidden">
                <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" ref={inputFileRef} onChange={handleFileChange} />
              </div>

              <div onClick={handlePencilClick} className="cursor-pointer border-2 border-white overflow-hidden w-[40px] h-[40px] rounded-full bg-white relative mx-auto shadow-sm">
                <Image src={avatarUrl} alt="avatar" fill sizes="40px" className="rounded-full object-cover" />
              </div>

              <div className="font-medium text-sm">
                <h6 className="font-bold text-gray-800">{driverName}</h6>
                {userContact && <span className="text-xs text-gray-600">{userContact}</span>}
              </div>
            </div>
            
            {/* --- INTÉGRATION DU PROFILE SWITCHER ICI --- */}
            <div className="flex items-center gap-3 pr-4">
                <ProfileSwitcher />
                
                <Link
                  className="text-sm font-bold cursor-pointer flex items-center gap-1.5 p-2 rounded-lg border-2 border-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
                  href={`/freelance-profile?id=${user.user.id}`}
                >
                  View Profile
                </Link>
            </div>
          </div>
          
          <section className="transition-all duration-300 ease-out container p-4">
            {children}
          </section>
        </div>
      </section>

      {navOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setNavOpen(false)}
        ></div>
      )}
    </div>
  );
}