import Image from "next/image";
import { useTranslations } from "next-intl";

const InstitutionSection = () => {
  const t = useTranslations("Landing.institutionSection");

  return (
    <section className="flex flex-col lg:flex-row justify-between px-4 lg:px-0 pb-30 pt-5 gap-8 lg:gap-12 max-w-7xl mx-auto">
      <div className="flex flex-col items-start gap-5 w-full lg:w-[748px]">
        <div className="bg-tertiary-50 text-tertiary-600 font-semibold text-base py-2 px-4 rounded-full">
          {t("tag")}
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
            {t("title")}
          </h2>
          <p className="text-lg lg:text-xl text-gray-600">
            {t("description")}
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors">
          {t("cta")}
        </button>
      </div>
      <div className="w-full lg:w-auto">
        <Image
          src="/landingpage/institution-section.png"
          alt={t("imageAlt")}
          width={616}
          height={676}
          className="rounded-2xl w-full h-auto lg:w-[616px] lg:h-[676px] object-cover"
        />
      </div>
    </section>
  );
};

export default InstitutionSection;
