import type React from "react"
import { Shield, Wallet, ThumbsUp,ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"


const FeatureCard: React.FC<{
  icon: React.ReactNode
  title: string
  description: string
  cta: string
}> = ({ icon, title, description, cta }) => (
  <div className="flex flex-col items-start p-7 gap-8 bg-white border border-gray-300 rounded-lg flex-1">
    <div className="flex justify-center items-center w-20 h-20 bg-primary-50 rounded-full">{icon}</div>
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-medium text-gray-900">{title}</h3>
      <p className="text-lg text-gray-600">{description}</p>
    </div>
    <button className="flex items-center text-orange-600 font-medium">
      {cta}
      <span className="ml-2 w-5 h-5 border border-orange-600 rounded-full flex items-center justify-center">
        <ArrowRight/>
      </span>
    </button>
  </div>
)

const WhyChooseLetsGo: React.FC = () => {
  const t = useTranslations("Landing.whyChoose")

  return (
    <section className="flex flex-col items-center py-[34px] px-8 md:px-32 bg-white">
      <div className="flex flex-col items-center gap-5 max-w-4xl mb-20">
        <span className="px-4 py-2 bg-tertiary-50 text-tertiary-600 font-semibold rounded-full">{t("tag")}</span>
        <h2 className="text-4xl md:text-5xl font-semibold text-center text-gray-900 mb-3">{t("title")}</h2>
        <p className="text-xl text-center text-gray-600">
          {t("description")}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
        <FeatureCard
          icon={<Shield className="w-10 h-10 text-primary-500" />}
          title={t("cards.safe.title")}
          description={t("cards.safe.description")}
          cta={t("cta")}
        />
        <FeatureCard
          icon={<Wallet className="w-10 h-10 text-primary-500" />}
          title={t("cards.pricing.title")}
          description={t("cards.pricing.description")}
          cta={t("cta")}
        />
        <FeatureCard
          icon={<ThumbsUp className="w-10 h-10 text-primary-500" />}
          title={t("cards.ux.title")}
          description={t("cards.ux.description")}
          cta={t("cta")}
        />
      </div>
    </section>
  )
}

export default WhyChooseLetsGo

