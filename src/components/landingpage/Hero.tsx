import Image from "next/image";
import { MapPin, Calendar, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Hero = () => {
  const t = useTranslations("Landing.hero");

  return (
    <section className="relative w-full h-auto mb-16">
      {/* Background Image */}
      <div className="absolute inset-0 bg-black bg-opacity-30">
        <Image
          src="/landingpage/hero1.png"
          alt={t("backgroundAlt")}
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-start max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start mt-20 md:mt-28 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight mb-6">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            {t("description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center py-[18px] px-6  bg-primary hover:bg-primary-600 text-white rounded-xl">
              <Image
                src="/landingpage/apple.png"
                alt="Apple"
                width={24}
                height={24}
                className="mr-2"
              />
              <span className="text-lg font-medium">{t("appStore")}</span>
            </button>
            <button className="flex items-center justify-center py-[18px] px-6  bg-primary hover:bg-primary-600 text-white rounded-xl">
              <Image
                src="/landingpage/googleplay.png"
                alt="GooglePlay"
                width={24}
                height={24}
                className="mr-2"
              />
              <span className="text-lg font-medium">{t("googlePlay")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div
        className="relative top-20 mx-auto w-full max-w-5xl bg-white border-none rounded-lg p-6 md:p-8"
        style={{
          boxShadow:
            "10px 0 15px -3px rgba(0, 0, 0, 0.1), -10px 0 15px -3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="tier"
              value="economy"
              className="mr-2"
              defaultChecked
            />
            <span className="text-lg">{t("tiers.economy")}</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="tier" value="comfort" className="mr-2" />
            <span className="text-lg">{t("tiers.comfort")}</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="tier" value="vip" className="mr-2" />
            <span className="text-lg">{t("tiers.vip")}</span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center border border-gray-300 rounded-full p-3">
            <MapPin className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder={t("form.from")}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-full p-3">
            <MapPin className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder={t("form.to")}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-full p-3">
            <Calendar className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder={t("form.date")}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-full p-3">
            <input
              type="text"
              placeholder={t("form.passengers")}
              className="w-full bg-transparent outline-none"
            />
            <ChevronDown className="text-gray-400 ml-2" />
          </div>
        </div>
        <div className="flex justify-end">
          <Link href='/freelance-search' className="px-20 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg text-lg font-medium">
            {t("seePrices")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
