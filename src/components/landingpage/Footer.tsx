import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Produit",
      links: [
        { label: "Pour les conducteurs", href: "/driver" },
        { label: "Pour les passagers", href: "/passenger" },
        { label: "Pour les agences", href: "/agency" },
        { label: "Pour les institutions", href: "/institution" },
        { label: "Tarifs", href: "/pricing" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { label: "À propos", href: "/about-us" },
        { label: "Freelance", href: "/freelance" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Conditions générales", href: "/general_terms" },
        { label: "Politique de confidentialité", href: "/user_privacy_policy" },
        { label: "Politique des cookies", href: "/cookies_policy" },
        { label: "CGU", href: "/terms_of_services" },
      ],
    },
  ];

  return (
    <footer className="bg-[#091e42] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/">
              <Image
                src="/img/MainLogo1.png"
                alt="LetsGo"
                width={130}
                height={44}
                className="brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              La plateforme de mobilité qui connecte conducteurs, passagers et agences en toute simplicité.
            </p>
            <div className="flex gap-3 mt-1">
              <a
                href="#"
                aria-label="App Store"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-2 text-xs font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
              <a
                href="#"
                aria-label="Google Play"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-2 text-xs font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
                </svg>
                Google Play
              </a>
            </div>
          </div>

          {/* Nav sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {currentYear} LetsGo. Tous droits réservés.</span>
          <div className="flex gap-5">
            <Link href="/cookies_policy" className="hover:text-gray-300 transition-colors">Cookies</Link>
            <Link href="/user_privacy_policy" className="hover:text-gray-300 transition-colors">Confidentialité</Link>
            <Link href="/general_terms" className="hover:text-gray-300 transition-colors">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
