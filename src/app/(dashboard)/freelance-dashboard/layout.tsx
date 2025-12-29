"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; 
import IconComponent from "@/components/general/IconComponent";
import portofolio from "@public/img/cv.png"
import support from "@public/img/support.png"
import { toast } from 'react-hot-toast';
import {orders} from '@/data/Structure'
// AJOUT DE L'IMPORT DU SERVICE DE SESSION
import { sessionService } from "@/service/sessionService";

import {
  CheckIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  Cog8ToothIcon,
  StarIcon,
  BanknotesIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import { useState, MouseEvent,ChangeEvent, useMemo, useEffect, useCallback, useRef } from "react";

import { useContextProvider } from "@/components/context/context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const path = usePathname();
  const router = useRouter();

  const OrderCount=()=>{
    let count=0;
    for (let i=0; i<orders.length; i++){
      if(orders[i].status=="Pending"){
        count++;
      }
    }
    return count
  }

  const Pendingorders:number=OrderCount();
  
  
  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setNavOpen(!navOpen);
  };

  // --- NOUVELLE FONCTION DE DÉCONNEXION ---
  const handleLogout = () => {
    try {
      // 1. Nettoyer les cookies et le localStorage
      sessionService.clearUserData();
      
      // 2. Feedback utilisateur
      toast.success("Déconnexion réussie");
      
      // 3. Redirection vers la page de connexion
      router.replace('/auth/signin');
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
      // Force la redirection même en cas d'erreur
      router.replace('/auth/signin');
    }
  };

  const NavItems = useMemo(() => [
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

  const toggleSubMenu = useCallback((navItem: any) => {
    // --- MODIFICATION ICI POUR INTERCEPTER LE LOGOUT ---
    if (navItem.title === 'Log out') {
      handleLogout();
      return;
    }
    // ---------------------------------------------------

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
  }, [openSubMenu, router]);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const handlePencilClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const isActive = useCallback((navItem: any) => {
    if (navItem.link && navItem.link !== '#') {
      return path === navItem.link;
    }
    if (navItem.subItems) {
      return navItem.subItems.some((subItem: any) => subItem.link === path);
    }
    return false;
  }, [path]);

  useEffect(() => {
    const activeNavItem = NavItems.find(item => isActive(item));
    if (activeNavItem && activeNavItem.subItems) {
      setOpenSubMenu(activeNavItem.title);
    } else {
      setOpenSubMenu(null);
    }
  }, [path, NavItems, isActive]);

  const { clientDTO, setClientDTO } = useContextProvider();
    const [formData, setFormData] = useState({
      name: clientDTO.name,
      email: clientDTO.email,
      phoneNumber: clientDTO.phoneNumber,
      sex: clientDTO.sex,
      profile: clientDTO.profile,
    });
    
  
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setClientDTO(prevState => ({
              ...prevState,
              userPictureUrl: reader.result as string
            }));
          }
        };
        reader.readAsDataURL(files[0]);
      }
    };
    const [editable,setEditable] = useState(false)
    const handleSave = () => {
          toast.success('Changes Saved Successfully');
      };

  return (
    <div className="min-h-[72vh] bg-white">
      <section className="container flex flex-col lg:flex-row">
        <nav
          className={`${
            navOpen ? "translate-x-0 mt-[4.5rem]" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static top-0 left-0 w-64 lg:w-[11rem] h-full z-50 transition-transform duration-500 ease-out bg-white flex flex-col justify-center border-r py-2 px-2  shadow-lg lg:shadow-none overflow-y-auto`}
        >
          <button
            onClick={() => setNavOpen(false)}
            className="lg:hidden absolute top-2 right-2 text-gray-500 hover:text-gray-700 "
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="grow text">
            <div className="w-full border-primary-500 text-primary border title font-bold p-3 rounded-md flex items-center justify-center cursor-pointer">
              Basic Plan
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
                                {subItem.title=="Orders"? (
                                  <span>{subItem.title} ({Pendingorders})</span>
                                ):(
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
          <div className="flex items-center w-full justify-between flex-wrap pl-4 py-3 bg-[#E0D9FD]">
            <div className="flex gap-2 items-center">
              <button
                onClick={handleOpen}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              <div className="avatar-upload__edit">
                <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" className="hidden" ref={inputFileRef} onChange={handleFileChange} />
              </div>
              <div onClick={handlePencilClick} className="cursor-pointer border overflow-hidden w-[40px] h-[40px] border-[var(--primary)] rounded-full bg-white grid place-content-center relative mx-auto">
                <Image
                  width={40}
                  height={40}
                  src={clientDTO.userPictureUrl}
                  alt="image"
                  className="rounded-full object-cover"
                />
                {/* <div className="w-3 h-3 grid place-content-center rounded-full border-2 white text-white bg-primary absolute bottom-2 right-0">
                  <CheckIcon className="w-2 h-2" />
                </div> */}
              </div>
              <div className="font-medium text">
                <div className="flex gap-2">
                  <h6 className="font-bold">{clientDTO.name}</h6>
                  <p className="text opacity-[70%]">(Not Verified)</p>
                </div>
                <Link href={`mailto:${clientDTO.email}`}>{clientDTO.email}</Link>
              </div>
            </div>
            <Link
              className={`text font-bold cursor-pointer ${navOpen? "mt-[3rem]":""} flex items-center gap-1  p-2  mr-[2%] rounded-md  border-[var(--dark)] border hover:bg-primary hover:text-white justify-center`}
              href="/freelance-profile"
            >
              View my profile
            </Link>
          </div>
          <section
            className={`${
              navOpen ? "lg:ml-0" : "ml-0"
            } transition-all duration-300 ease-out container`}
          >
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
    </div >
  );
}