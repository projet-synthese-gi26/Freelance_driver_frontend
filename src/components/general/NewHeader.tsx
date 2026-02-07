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
import { usePathname, useRouter } from "next/navigation";
import Header from "../landingpage/Header";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import type { Locale } from "@/config";
import { setUserLocale } from "@/service/locale";

const NewHeader = ({ locale }: { locale?: string }) => {
  const pathToRoute: Record<string, string> = {
    driver: '/driver',
    freelance: '/freelance',
    institution: '/institution',
    passenger: '/passenger',
    agency: '/agency', // optionnel
  };

  const pathname = usePathname() || ""; // fallback to empty string if null
  const router = useRouter();
  const [, startTransition] = useTransition();
  const activeLocale = useLocale() as Locale;
  const resolvedLocale = (locale as Locale | undefined) ?? activeLocale;

  const firstSegment = pathname.split("/")[1];

  // récupère le lien de redirection
  const logoLink = pathToRoute[firstSegment] || "/";

  const isHomePage = pathname === "/"; // Vérifie si c'est la page d'accueil
  const isDrivers = pathname.startsWith("/driver");
  const isFreelance = pathname.startsWith("/freelance");
  const isInstitutions = pathname.startsWith("/institution");
  const isPassengers = pathname.startsWith("/passenger");
  const isAgencies = pathname.startsWith("/agency");
  const isSearchPage =
    pathname.startsWith("/freelance-search") ||
    pathname.startsWith("/announcement-search") ||
    pathname.startsWith("/client-search");
  const isBookingPage = pathname.startsWith("/freelance-booking");

  // Utiliser user au lieu de authUser pour être sûr d'avoir les données à jour
  const { authUser, user, isLoading: authLoading } = useAuthContext();
  const { openLoginModal, openRegisterModal } = useAuthModal();
  const t = useTranslations("Freelance.header");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLocale = (nextLocale: Locale) => {
    startTransition(async () => {
      await setUserLocale(nextLocale);
      router.refresh();
    });
  };

  useEffect(() => {
    const navbarVisible = () => {
      setDark(window.scrollY >= window.innerHeight - 80);
    };
    window.addEventListener("scroll", navbarVisible);
    return () => window.removeEventListener("scroll", navbarVisible);
  }, []);

  const nav = [
    {
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
    },
    { title: t("pricing"), url: "/pricing-plan", reference: "" },
    {
      title: t("about"),
      url: "#",
      reference: "",
      submenu: [
        { title: t("Driver"), url: "#" },
        { title: t("Passenger"), url: "#" },
        { title: t("Agency"), url: "#" },
      ],
    },
    {
      title: (
        <div className="flex items-center gap-1">
          {resolvedLocale === 'fr' ? '🇫🇷' : resolvedLocale === 'de' ? '🇩🇪' : resolvedLocale === 'es' ? '🇪🇸' : '🇬🇧'}
          <span className="uppercase">{resolvedLocale}</span>
        </div>
      ),
      url: "#",
      reference: "lang",
      submenu: [
        { title: "🇬🇧 English", url: "#", action: () => changeLocale('en') },
        { title: "🇫🇷 Français", url: "#", action: () => changeLocale('fr') },
        { title: "🇩🇪 Deutsch", url: "#", action: () => changeLocale('de') },
        { title: "🇪🇸 Español", url: "#", action: () => changeLocale('es') },
      ],
    },
  ];

  const authenticationSystem = (
    <div className="hidden lg:flex items-center space-x-4">
      <button
        className="transition-colors rounded-md hover:bg-gray-800 hover:text-white px-2 py-2"
        onClick={openLoginModal}
      >
        {t("headerlogin")}
      </button>
      <button
        onClick={openRegisterModal}
        className="bg-[#243757] text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        {t("headersign")}
      </button>
    </div>
  );

  const authenticationSystemRespo = (
    <>
      <li>
        <button
          onClick={openLoginModal}
          className="w-full text-left block text-[#243757] py-1 px-2 text  hover:text-gray-900 hover:bg-gray-50"
        >
          {t("headerlogin")}
        </button>
      </li>
      <li className="space-y-5">
        <button
          onClick={openRegisterModal}
          className="text-left block py-1 px-2 text text-white bg-[#243757] rounded-3xl hover:bg-gray-800"
        >
          {t("headersign")}
        </button>
      </li>
    </>
  );

  return (
    <>
      {pathname === "/" && <Header />}
      {(isDrivers || isFreelance || isAgencies || isPassengers || isInstitutions || isSearchPage || isBookingPage) && (
        <header
          className={`bg-white  font-inter w-full text-black z-10 ${dark ? "nav-color backdrop-blur-sm shadow-md" : ""
            } border-b`}
        >
          <nav
            className="container mx-auto px-4 py-1 text flex items-center justify-between"
            aria-label="Global"
          >
            <div className="items-center">
              <Link href={logoLink} className="items-center">
                <Image src={logo} alt="logo" width={120} height={40} />
              </Link>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <ul className="flex space-x-4 list-none">
                {nav.map((item, index) => (
                  <div key={index} className="relative group">
                    <NavHor
                      title={item.title}
                      reference={item.reference}
                      items={item}
                      key={index}
                      id={index}
                    />
                    {item.submenu && (
                      <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.url}
                              className="block px-4 py-2  text-gray-700 hover:bg-gray-100"
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </ul>
            </div>

            <div className=" hidden lg:flex">
              <LocaleSwitcher status="dark" />
            </div>
            {/* Afficher avatar si connecté, sinon boutons de connexion */}
            {(!user && !authLoading) ? (
              authenticationSystem
            ) : user ? (
              <div className=" hidden lg:flex">
                <MyAccountAvatar />
              </div>
            ) : null}

            <div className="lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring"
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
            <div className="lg:hidden">
              <ul className="px-2 pt-2 pb-3 list-none">
                {nav.map((item, index) => (
                  <div key={index} className="pb-">
                    <NavVer title={item.title} reference={item.reference} />
                    {item.submenu && (
                      <ul className="pl-4 list-none">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.url}
                              className="block  text text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {(!user && !authLoading) ? authenticationSystemRespo : user ? (
                  <li className="py-2 border-t border-gray-100 mt-2">
                    <MyAccountAvatar />
                  </li>
                ) : null}
                <LocaleSwitcher status="dark" />
              </ul>
            </div>
          )}
        </header>
      )}
    </>
  );
};

export default NewHeader;