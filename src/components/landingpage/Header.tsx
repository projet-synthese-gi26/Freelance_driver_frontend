"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@public/img/MainLogo1.png";
import NavHor from "@/components/others/NavHor";
import NavVer from "@/components/others/NavVer";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { useTranslations } from "next-intl";
import { useAuthModal } from "@/hook/AuthModalContext";
import LocaleSwitcher from "@/components/lang/LocalSwitcher";
import { useAuthContext } from "@/components/context/authContext";
import { MyAccountAvatar } from "@/components/general/MyAccountAvatar";
import { usePathname } from "next/navigation";


const Header = () => {
  const pathname = usePathname() || ""; // fallback to empty string if null

  const isHomePage = pathname === "/"; // Vérifie si c'est la page d'accueil
  const isDrivers = pathname.startsWith("/driver");
  const isFreelance = pathname.startsWith("/freelance");
  const isInstitutions = pathname.startsWith("/institutions");

  const { authUser, user, isLoading: authLoading } = useAuthContext();
  const { openLoginModal, openRegisterModal } = useAuthModal();
  const t = useTranslations("Freelance.header");
  const [visible, setVisible] = useState(false);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navbarVisible = () => {
    if (window.scrollY > 10 && window.scrollY < window.innerHeight - 80) {
      setVisible(true);
      setDark(false);
    } else if (window.scrollY >= window.innerHeight - 80) {
      setDark(true);
      setVisible(false);
    } else {
      setVisible(false);
      setDark(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", navbarVisible);
    return () => {
      window.removeEventListener("scroll", navbarVisible);
    };
  }, []);

  const nav = [
/*     {
      title: t("marketplace"),
      url: "#",
      reference: "",
      submenu: [
        { title: t("Travel Agency"), url: "#" },
        { title: t("Rental Agency"), url: "#" },
        { title: t("Car Pooling"), url: "#" },
      ],
    },
    {
      title: t("education"),
      url: "#",
      reference: "",
      submenu: [
        { title: t("Blog"), url: "#" },
        { title: t("Podcast"), url: "#" },
        { title: t("Chatbot"), url: "#" },
      ],
    },
    {
      title: t("partner"),
      url: "#",
      reference: "",
      submenu: [
        { title: t("Driving School"), url: "#" },
        { title: t("Syndicate"), url: "#" },
        { title: t("Educator"), url: "#" },
        { title: t("Administration"), url: "#" },
        { title: t("Sponsor"), url: "#" },
        { title: t("Referral"), url: "#" },
      ],
    }, */
    { title: t("Driver"), url: "/driver" , reference: "" },
    { title: t("Passenger"), url: "/passenger", reference: ""  },
    { title: t("Agency"), url: "/agency", reference: ""  },
    { title: t("Institutions"), url: "/institution", reference: "" },
    {
      title: t("education"),
      url: "#",
      reference: "",
      submenu: [
        { title: t("Driver"), url: "#" },
        { title: t("Passenger"), url: "#" },
        { title: t("Agency"), url: "#" },
      ],
    },
    { title: t("pricing"), url: "/pricing", reference: "" },
    { title: t("about"), url: "/about-us", reference: "" },
  ];

  const authenticationSystem = (
    <div className="hidden lg:flex items-center gap-2">
      <button
        className="text-sm font-medium text-gray-700 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
        onClick={openLoginModal}
      >
        {t("headerlogin")}
      </button>
      <button
        onClick={openRegisterModal}
        className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
      >
        {t("headersign")}
      </button>
    </div>
  );

  const authenticationSystemRespo = (
    <div className="flex flex-col gap-2">
      <button
        onClick={openLoginModal}
        className="w-full text-left text-sm font-medium text-gray-700 py-2 px-3 rounded-lg hover:text-primary hover:bg-primary-50 transition-colors"
      >
        {t("headerlogin")}
      </button>
      <button
        onClick={openRegisterModal}
        className="w-full text-left text-sm font-semibold text-white bg-primary py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors"
      >
        {t("headersign")}
      </button>
    </div>
  );
  return (
    <header
      className={`bg-white font-inter w-full text-black z-50 sticky top-0 transition-shadow duration-300 ${
        dark ? "shadow-md" : "border-b border-gray-100"
      }`}
    >
      <nav
        className="container mx-auto px-6 py-3 flex items-center justify-between"
        aria-label="Global"
      >
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="logo" width={140} height={46} />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          <ul className="flex gap-1 list-none">
            {nav.map((item, index) => {
              const isActive =
                item.url !== "#" &&
                (pathname === item.url || pathname.startsWith(item.url + "/"));
              return (
                <div key={index} className="relative group">
                  <NavHor
                    title={item.title}
                    reference={item.reference}
                    items={item}
                    key={index}
                    id={index}
                  />
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-primary rounded-full" />
                  )}
                  {item.submenu && (
                    <ul className="absolute left-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg hidden group-hover:block z-50">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.url}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary rounded-lg mx-1 my-0.5 transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </ul>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <LocaleSwitcher status="dark" />
          {(!user && !authLoading) ? (
            authenticationSystem
          ) : user ? (
            <MyAccountAvatar />
          ) : null}
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-600 hover:text-primary focus:outline-none transition-colors"
          >
            {menuOpen ? (
              <HiX className="h-6 w-6" aria-hidden="true" />
            ) : (
              <HiOutlineMenu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <ul className="px-4 pt-3 pb-5 list-none flex flex-col gap-1">
            {nav.map((item, index) => {
              const isActive =
                item.url !== "#" &&
                (pathname === item.url || pathname.startsWith(item.url + "/"));
              return (
                <div key={index}>
                  <div className={`rounded-lg ${isActive ? "bg-primary-50" : ""}`}>
                    <NavVer title={item.title} reference={item.reference} />
                  </div>
                  {item.submenu && (
                    <ul className="pl-4 list-none">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.url}
                            className="block text-sm text-gray-500 hover:text-primary hover:bg-primary-50 py-2 px-3 rounded-lg transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            <div className="mt-2 pt-3 border-t border-gray-100 flex flex-col gap-2">
              {(!user && !authLoading) ? authenticationSystemRespo : user ? (
                <MyAccountAvatar />
              ) : null}
              <LocaleSwitcher status="dark" />
            </div>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Header;
