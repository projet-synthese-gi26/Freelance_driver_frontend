"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; 
import IconComponent from "@/components/general/IconComponent";
import portofolio from "@public/img/cv.png"
import support from "@public/img/support.png"
import { toast } from 'react-hot-toast';
import {orders} from '@/data/Structure'

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
import { HandCoins, MapPinned,Eye,TicketPercent,Wallet } from "lucide-react";

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

  const NavItems = useMemo(() => [
    {link:'/admin-dashboard',title:'Overview',icon:Eye},
    {link:'/admin-dashboard/moderation-system',title:'Moderation System',icon:ShieldCheckIcon},
    {link:'/admin-dashboard/fare-management',title:'Fare Management',icon:HandCoins},
    {link:'/admin-dashboard/app-settings',title:'App Settings',icon:Cog8ToothIcon},
    {link:'/admin-dashboard/payment-monitoring',title:'Payment Monitoring',icon:Wallet},
    {link:'/admin-dashboard/promotion-management',title:'Promotion Management',icon:TicketPercent},
    {link:'/admin-dashboard/reports-analytics',title:'Reports Analytics',icon:ChartBarIcon},
    {link:'/admin-dashboard/ride-tracking',title:'Ride Tracking',icon:MapPinned},
    {title:'Support',icon:support,link:'/admin-dashboard/support'},
    {link:'#',title:'Log out',icon:ArrowRightStartOnRectangleIcon}
  ], []);

  const toggleSubMenu = useCallback((navItem: any) => {
    if (navItem.subItems) {
      setOpenSubMenu(prevOpenSubMenu => 
        prevOpenSubMenu === navItem.title ? null : navItem.title
      );
      if (openSubMenu !== navItem.title) {
        router.push(navItem.subItems[0].link);
      }
    } else {
      setOpenSubMenu(null);
      router.push(navItem.link);
    }
  }, [openSubMenu, router]);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const handlePencilClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const isActive = useCallback((navItem: any) => {
    if (navItem.link) {
      return path === navItem.link;
    }
    if (navItem.subItems) {
      return navItem.subItems.some((subItem: any) => subItem.link === path);
    }
    return false;
  }, [path]);

  useEffect(() => {
    const activeNavItem = NavItems.find(item => isActive(item));
    if (activeNavItem) {
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
          } lg:translate-x-0 fixed lg:static top-0 left-0 w-64 lg:w-[13.5rem] h-full z-50 transition-transform duration-500 ease-out bg-white flex flex-col justify-center border-r py-2 px-2  shadow-lg lg:shadow-none overflow-y-auto`}
        >
          <button
            onClick={() => setNavOpen(false)}
            className="lg:hidden absolute top-2 right-2 text-gray-500 hover:text-gray-700 "
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="grow text">
            <div className="w-full border-primary-500 text-primary border title font-bold p-3 rounded-md flex items-center justify-center cursor-pointer">
              Administrator
            </div>
            <ul className="py-5 space-y-3">
              {NavItems.map((navItem, key) => (
                <li key={key}>
                    <button
                      onClick={() => toggleSubMenu(navItem)}
                      className={`flex items-center gap-2 rounded-md px-3 py-1 duration-300 w-full ${
                        isActive(navItem) ? "bg-primary text-white" : ""
                      }`}
                    >
                      <IconComponent Icon={navItem.icon} className="w-5 h-5" />
                      {navItem.title}
                    </button>
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