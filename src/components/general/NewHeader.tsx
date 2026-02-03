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
import { useAuthContext } from "@/components/context/authContext";
import { MyAccountAvatar } from "@/components/general/MyAccountAvatar";
import { usePathname, useRouter } from "next/navigation";
import Header from "../landingpage/Header";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import type { Locale } from "@/config";
import { setUserLocale } from "@/service/locale";

const NewHeader = () => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [, startTransition] = useTransition();
  const pathname = usePathname() || "";
  const t = useTranslations("Freelance.header");
  const { authUser } = useAuthContext();
  const { openLoginModal, openRegisterModal } = useAuthModal();
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
          {locale === 'fr' ? '🇫🇷' : locale === 'de' ? '🇩🇪' : locale === 'es' ? '🇪🇸' : '🇬🇧'}
          <span className="uppercase">{locale}</span>
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

  return (
    <>
      {pathname === "/" && <Header />}

      <header
        className={`bg-[var(--bg-1)] w-full text-[var(--neutral-700)] z-30 sticky top-0 border-b border-[var(--border)] ${
          dark ? "shadow-md" : ""
        }`}
      >
        <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/">
            <Image src={logo} alt="logo" width={110} height={35} />
          </Link>

          {/* DESKTOP NAV : On laisse NavHor gérer l'affichage */}
          <div className="hidden lg:flex items-center">
            <ul className="flex space-x-1 list-none">
              {nav.map((item, index) => (
                <NavHor 
                  key={index} 
                  title={item.title} 
                  reference={item.reference} 
                  items={item} // NavHor s'occupe de créer le menu déroulant
                />
              ))}
            </ul>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-3">
                <ThemeToggle />
                {!authUser ? (
                    <>
                        <button onClick={openLoginModal} className="px-2 py-2 text-sm font-medium hover:text-blue-600 transition">{t("headerlogin")}</button>
                        <button onClick={openRegisterModal} className="bg-[var(--neutral-700)] text-[var(--bg-1)] px-3 py-2 rounded-md text-sm font-medium">{t("headersign")}</button>
                    </>
                ) : <MyAccountAvatar />}
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-[var(--neutral-700)]">
                {menuOpen ? <HiX className="h-6 w-6" /> : <HiOutlineMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* MOBILE MENU : On laisse NavVer gérer l'affichage */}
        {menuOpen && (
          <div className="lg:hidden bg-[var(--bg-1)] border-t border-[var(--border)]">
            <ul className="px-4 py-4 list-none space-y-2">
              {nav.map((item, index) => (
                <NavVer key={index} title={item.title} reference={item.reference} items={item} />
              ))}
              <div className="pt-4 border-t space-y-3">
                {!authUser ? (
                    <>
                        <button onClick={openLoginModal} className="block w-full text-left px-2 py-2 text-[var(--neutral-700)] font-bold">{t("headerlogin")}</button>
                        <button onClick={openRegisterModal} className="block w-full text-center py-2 bg-[var(--neutral-700)] text-[var(--bg-1)] rounded-lg">{t("headersign")}</button>
                    </>
                ) : <MyAccountAvatar />}
              </div>
            </ul>
          </div>
        )}
      </header>
    </>
  );
};

export default NewHeader;