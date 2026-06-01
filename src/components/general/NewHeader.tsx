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
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import type { Locale } from "@/config";
import { setUserLocale } from "@/service/locale";
import { BellIcon, HomeIcon, TruckIcon, UserCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import apiClient from "@/service/apiClient";

const NewHeader = ({ locale }: { locale?: string }) => {
  const pathToRoute: Record<string, string> = {
    driver: '/driver',
    freelance: '/freelance',
    institution: '/institution',
    passenger: '/passenger',
    agency: '/agency', // optionnel
  };

  const rawPathname = usePathname() || ""; // fallback to empty string if null
  const router = useRouter();
  const [, startTransition] = useTransition();
  const activeLocale = useLocale() as Locale;
  const resolvedLocale = (locale as Locale | undefined) ?? activeLocale;

  const pathnameParts = rawPathname.split("/");
  const supportedLocales: string[] = ["en", "fr", "de", "es"];
  const pathname = supportedLocales.includes(pathnameParts[1])
    ? `/${pathnameParts.slice(2).join("/")}`
    : rawPathname;

  const firstSegment = pathname.split("/")[1];

  // récupère le lien de redirection
  const logoLink = pathToRoute[firstSegment] || "/";

  const isHomePage = pathname === "/"; // Vérifie si c'est la page d'accueil
  const isDrivers = pathname.startsWith("/driver");
  const isFreelance = pathname.startsWith("/freelance");
  const isInstitutions = pathname.startsWith("/institution");
  const isPassengers = pathname.startsWith("/passenger");
  const isAgencies = pathname.startsWith("/agency");
  const isCustomerDashboard = pathname.startsWith("/customer-dashboard");
  const isFreelanceDashboard = pathname.startsWith("/freelance-dashboard");
  const isSearchPage =
    pathname.startsWith("/freelance-search") ||
    pathname.startsWith("/client-search");
  const isBookingPage = pathname.startsWith("/freelance-booking");
  const isNotificationsPage = pathname.startsWith("/notifications");

  // Utiliser user au lieu de authUser pour être sûr d'avoir les données à jour
  const { authUser, user, isLoading: authLoading } = useAuthContext();
  const { openLoginModal, openRegisterModal } = useAuthModal();
  const t = useTranslations("Freelance.header");
  const tCommon = useTranslations("Common");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const roles = user?.user?.roles ?? [];
  const hasDriverRole = roles.some((r: any) => String(r?.roleType ?? '').toUpperCase() === 'DRIVER');
  const hasClientRole = roles.some((r: any) => String(r?.roleType ?? '').toUpperCase() === 'CLIENT');

  const actorRoleType = String(user?.actor?.roleType ?? '').toUpperCase();
  const currentMode: 'DRIVER' | 'CLIENT' = actorRoleType === 'DRIVER'
      ? 'DRIVER'
      : actorRoleType === 'CLIENT'
          ? 'CLIENT'
          : hasDriverRole && !hasClientRole
              ? 'DRIVER'
              : 'CLIENT';

  const targetRole: 'DRIVER' | 'CLIENT' = currentMode === 'DRIVER' ? 'CLIENT' : 'DRIVER';
  const needsToCreateTargetRole = (targetRole === 'CLIENT' && !hasClientRole) || (targetRole === 'DRIVER' && !hasDriverRole);
  const becomeHref = targetRole === 'CLIENT' ? '/onboarding/become-client' : '/onboarding/become-driver';
  const dashboardHref = isCustomerDashboard
    ? '/customer-dashboard'
    : isFreelanceDashboard
      ? '/freelance-dashboard'
      : currentMode === 'DRIVER'
        ? '/freelance-dashboard'
        : '/customer-dashboard';
  const notificationsHref = '/notifications';
  const searchHref = currentMode === 'DRIVER' ? '/client-search' : '/freelance-search';

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

  useEffect(() => {
    let cancelled = false;
    const loadUnread = async () => {
      try {
        if (!user) {
          if (!cancelled) setUnreadNotifications(0);
          return;
        }
        const res = await apiClient.get<any[]>("/api/v1/notifications/me");
        const list = Array.isArray(res.data) ? res.data : [];
        const unread = list.filter((n: any) => !Boolean(n?.read)).length;
        if (!cancelled) setUnreadNotifications(unread);
      } catch {
        if (!cancelled) setUnreadNotifications(0);
      }
    };

    loadUnread();
    const id = window.setInterval(loadUnread, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [user]);

  const nav = [
    {
      title: t("marketplace"),
      url: "#",
      reference: "",
      submenu: [
        { title: t("Travel Agency"), url: "https://busstation-dev.yowyob.com" },
        { title: t("Rental Agency"), url: "https://rental-dev.yowyob.com" },
        { title: t("Car Pooling"), url: "https://ridngo-dev.yowyob.com" },
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
        { title: t("Syndicate"), url: "https://ugate-dev.yowyob.com/fr" },
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
        { title: t("Driver"), url: "/driver" },
        { title: t("Passenger"), url: "/passenger" },
        { title: t("Agency"), url: "/agency" },
        { title: t("Institutions"), url: "/institution" },
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
    <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-100">
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
    <>
      {(pathname === "/" ||
        isDrivers ||
        isFreelance ||
        isAgencies ||
        isPassengers ||
        isInstitutions ||
        isCustomerDashboard ||
        isFreelanceDashboard ||
        isSearchPage ||
        isBookingPage ||
        isNotificationsPage) && (
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
              <Link href={logoLink} className="flex items-center">
                <Image src={logo} alt="logo" width={140} height={46} />
              </Link>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <ul className="flex gap-1 list-none">
                {nav.map((item, index) => {
                  const isActive =
                    typeof item.url === "string" &&
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
                          {item.submenu.map((subItem: any, subIndex: number) => {
                            const isExternal = String(subItem.url).startsWith("http");
                            return (
                              <li key={subIndex}>
                                {isExternal ? (
                                  <a
                                    href={subItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary rounded-lg mx-1 my-0.5 transition-colors"
                                  >
                                    {subItem.title}
                                  </a>
                                ) : subItem.action ? (
                                  <button
                                    onClick={subItem.action}
                                    className="w-full text-left block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary rounded-lg mx-1 my-0.5 transition-colors"
                                  >
                                    {subItem.title}
                                  </button>
                                ) : (
                                  <Link
                                    href={subItem.url}
                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary rounded-lg mx-1 my-0.5 transition-colors"
                                  >
                                    {subItem.title}
                                  </Link>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </ul>
            </div>

            <div className="hidden lg:flex">
              <LocaleSwitcher status="dark" />
            </div>
            {/* Afficher avatar si connecté, sinon boutons de connexion */}
            {(!user && !authLoading) ? (
              authenticationSystem
            ) : user ? (
              <div className=" hidden lg:flex items-center gap-3">
                <Link
                  href={searchHref}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  title={resolvedLocale === 'fr' ? 'Rechercher' : 'Search'}
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </Link>

                <Link
                  href={notificationsHref}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  title={tCommon("notifications")}
                >
                  <BellIcon className="h-5 w-5" />
                  {unreadNotifications > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-extrabold leading-none text-white">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  ) : null}
                </Link>

                <Link
                  href={dashboardHref}
                  className="inline-flex items-center gap-2 rounded-full bg-[#243757] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a2a42]"
                  title={tCommon("dashboard")}
                >
                  <HomeIcon className="h-4 w-4" />
                  <span className="hidden xl:inline">{tCommon("dashboard")}</span>
                </Link>

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
                  <div key={index} className="pb-2">
                    <NavVer title={item.title} reference={item.reference} items={item} />
                    {item.submenu && (
                      <ul className="pl-4 list-none space-y-1 mt-1">
                        {item.submenu.map((subItem: any, subIndex: number) => {
                          const isExternal = String(subItem.url).startsWith('http');
                          return (
                            <li key={subIndex}>
                              {isExternal ? (
                                <a
                                  href={subItem.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 py-1"
                                >
                                  {subItem.title}
                                </a>
                              ) : (
                                <Link
                                  href={subItem.url}
                                  className="block text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 py-1"
                                >
                                  {subItem.title}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}

                {(!user && !authLoading) ? authenticationSystemRespo : user ? (
                  <div className="py-2 border-t border-gray-100 mt-2">
                    <MyAccountAvatar />
                  </div>
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