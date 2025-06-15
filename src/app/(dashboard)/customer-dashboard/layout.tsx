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

import { useState, MouseEvent, useRef, ChangeEvent } from "react";

import { useContextProvider } from "@/components/context/context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const path = usePathname();
  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setNavOpen(!navOpen);
  };

  const {clientDTO,setClientDTO}=useContextProvider()
  const inputFileRef = useRef<HTMLInputElement>(null);
  const handlePencilClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };
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

  const NavItems=[
    {link:'/customer-dashboard',title:'Personal Info',icon:UserCircleIcon},
    {link:'/customer-dashboard/user-security',title:'Security',icon:ShieldCheckIcon},
    {link:'/customer-dashboard/user-notification',title:'Notifications',icon:BellIcon},
    {link:'/customer-dashboard/user-preference',title:'Preferences',icon:Cog6ToothIcon},
    {link:'/customer-dashboard/user-chat',title:'Chat',icon:ChatBubbleLeftRightIcon},
    {link:'/customer-dashboard/user-announce',title:'Announcement',icon:BellAlertIcon},
    {link:'/customer-dashboard/user-wishlist',title:'Next Ride',icon:MagnifyingGlassIcon},
    {link:'/customer-dashboard/user-booking',title:'Statistics',icon:ClipboardDocumentListIcon},
    {link:'/customer-dashboard/user-payement',title:'Payment',icon:CreditCardIcon},
    {link:'/customer-dashboard/user-address',title:'Address',icon:MapPinIcon},
    {link:'#',title:'Log out',icon:ArrowRightStartOnRectangleIcon},
  ]

  return (
    <>
      <section className="bg-white container flex flex-col lg:flex-row">
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
            <div className="w-full bg-blue-500 text-white title font-bold p-3 rounded-xl flex items-center justify-center hover:shadow-lg 
            cursor-pointer
            ">UPGRADE</div>
            <ul className="py-5 space-y-3">
              {NavItems.map((navItem,key) =>(
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
              <div onClick={handlePencilClick}  className="cursor-pointer border overflow-hidden w-[40px] h-[40px] border-[var(--primary)] rounded-full bg-white grid place-content-center relative mx-auto">
                <Image
                  width={40}
                  height={40}
                  src={clientDTO.userPictureUrl}
                  alt="image"
                  className="rounded-full object-cover"
                />
                <div className="w-3 h-3 grid place-content-center rounded-full border-2 white text-white bg-primary absolute bottom-2 right-0">
                  <CheckIcon className="w-2 h-2" />
                </div>
              </div>
              <div className="font-medium text">
                <h6 className="font-bold">{clientDTO.name}</h6>
                <Link href={`mailto:${clientDTO.email}`}>{clientDTO.email}</Link>
              </div>
            </div>
            <a
              className={`md:text-[1.25rem] text font-bold cursor-pointer ${navOpen? "mt-[3rem]":""} flex bg-white items-center gap-1 md:p-3 p-1  mr-[2%] rounded-md  border-[var(--orange)] border hover:bg-[var(--orange)] hover:text-white hover:shadow-lg text-[var(--orange)] justify-center`}
              href="/pricing-plan"
            >
              <Image src={Driver} alt="logo" className="w-5 h-5" />
              Become a driver
            </a>
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
    </>
  );
}