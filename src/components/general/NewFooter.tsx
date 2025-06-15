import { MapPinIcon } from "@heroicons/react/24/outline";
import LocalSwitcher from "@/components/lang/LocalSwitcher";
import logo from "@public/MainLogo2.png"
import appstore from "@public/footerAPP.png"
import playstore from "@public/footerPlay.png"
import twitter from "@public/x.png"
import linkedin from "@public/linkedin.png"
import facebook from "@public/facebook.png"
import instagram from "@public/instagram.png"
import { useTranslations } from 'next-intl'
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import Location from "../localisation/Location";

const NewFooter = () => {
  const t = useTranslations("Freelance.footer")
  const defaultLocale = cookies().get('locale')?.value || 'en'
 
  return (
    <footer className="bg-[#2D3A96] font-inter text-white z-20 mt-auto">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <Link href="/" className="inline-block mb-2">
            <Image src={logo} width={100} height={70} alt="Logo" className="w-32"/>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text font-semibold mb-1">{t("Company")}</h4>
              <ul className="">
                <li><Link href="/freelance/about"
                          className="hover:text-[var(--secondary)] transition-colors">{t("About_us")}</Link></li>
                <li><Link href="/freelance/about#our-vision"
                          className="hover:text-[var(--secondary)] transition-colors">{t("Our Vision")}</Link></li>
                <li><Link href="/freelance/about#our-mission"
                          className="hover:text-[var(--secondary)] transition-colors">{t("Our Mission")}</Link></li>
                <li><Link href="/freelance/about#our-objectives"
                          className="hover:text-[var(--secondary)] transition-colors">{t("Our Objectives")}</Link></li>
                <li><Link href="/freelance/about#our-team"
                          className="hover:text-[var(--secondary)] transition-colors">{t("Our Originality")}</Link></li>
                <li><Link href="https://shopping.yowyob.com/our-company/careers"
                          className="hover:text-[var(--secondary)] transition-colors">{t("hiring")}</Link></li>
                <li><Link href="https://shopping.yowyob.com/our-company/contact-us"
                          className="hover:text-[var(--secondary)] transition-colors">{t("contact")}</Link></li>
                <li><Link href="/support" className="hover:text-[var(--secondary)] transition-colors">{t("FAQ")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text font-semibold mb-1">{t("marketplace")}</h4>
              <ul className="">
                <li><Link href="https://letsgo.yowyob.com/"
                          className="hover:text-[var(--secondary)] transition-colors">{t("Blog")}</Link></li>
                <li><Link href="https://rental.yowyob.com/"
                          className="hover:text-[var(--secondary)] transition-colors">{t("rental")}</Link></li>
                <li><Link href="https://planner.yowyob.com/"
                          className="hover:text-[var(--secondary)] transition-colors">{t("travel")}</Link></li>
                <li><Link href="https://carpooling.yowyob.com/"
                          className="hover:text-[var(--secondary)] transition-colors">{t("pooling")}</Link></li>
                <li><Link href="https://collect.yowyob.com/"
                          className="hover:text-[var(--secondary)] transition-colors">{t("pick")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text font-semibold mb-1">{t("legal")}</h4>
              <ul className="">
                <li><Link href="/general_terms" className="hover:text-[var(--secondary)] transition-colors">{t("Terms")}</Link></li>
                <li><Link href="/terms_of_services"
                          className="hover:text-[var(--secondary)] transition-colors">{t("Terms of Service")}</Link>
                </li>
                <li><Link href="/user_privacy_policy"
                          className="hover:text-[var(--secondary)] transition-colors">{t("Privacy Policy")}</Link></li>
                <li><Link href="/your_personnal_information"
                          className="hover:text-[var(--secondary)] transition-colors">{t("personal")}</Link></li>
                <li><Link href="/cookies_policy"
                          className="hover:text-[var(--secondary)] transition-colors">{t("cookies")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text font-semibold mb-1">{t("Mobile_App")}</h4>
              <div className="space-y-4 flex flex-col">
                <Link href="#" className="inline-block">
                  <Image src={appstore} alt="App Store" className="w-32 "/>
                </Link>
                <Link href="#" className="inline-block">
                  <Image src={playstore} alt="Play Store" className="w-32 "/>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-0">
              <LocalSwitcher status="white"/>
              {/* <Location/> */}
            </div>


            <div className="flex space-x-4">
              <Link href="https://twitter.com/yowyob" className="hover:opacity-75 transition-opacity">
                <Image src={twitter} alt="Twitter" width={24} height={24}/>
              </Link>
              <Link href="https://www.facebook.com/YowyobInc" className="hover:opacity-75 transition-opacity">
                <Image src={facebook} alt="Facebook" width={24} height={24}/>
              </Link>
              <Link href="https://www.instagram.com/yowyob" className="hover:opacity-75 transition-opacity">
                <Image src={instagram} alt="Instagram" width={24} height={24}/>
              </Link>
              <Link href="https://linkedin.com/yowyob" className="hover:opacity-75 transition-opacity">
                <Image src={linkedin} alt="LinkedIn" width={24} height={24}/>
              </Link>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/20 text-center sm:flex sm:justify-between sm:text-left">
            <p>&copy; {new Date().getFullYear()} Lets Go. {t("CopyRight")}</p>
          </div>
        </div>
      </footer>
  )
      ;
};

export default NewFooter;