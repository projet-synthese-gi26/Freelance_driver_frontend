import type React from "react"
import { Shield, Wallet, ThumbsUp,ArrowRight } from "lucide-react"


const FeatureCard: React.FC<{
  icon: React.ReactNode
  title: string
  description: string
}> = ({ icon, title, description }) => (
  <div className="flex flex-col items-start p-7 gap-8 bg-white border border-gray-300 rounded-lg flex-1">
    <div className="flex justify-center items-center w-20 h-20 bg-primary-50 rounded-full">{icon}</div>
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-medium text-gray-900">{title}</h3>
      <p className="text-lg text-gray-600">{description}</p>
    </div>
    <button className="flex items-center text-orange-600 font-medium">
      Get started
      <span className="ml-2 w-5 h-5 border border-orange-600 rounded-full flex items-center justify-center">
        <ArrowRight/>
      </span>
    </button>
  </div>
)

const WhyChooseLetsGo: React.FC = () => {
  return (
    <section className="flex flex-col items-center py-[34px] px-8 md:px-32 bg-white">
      <div className="flex flex-col items-center gap-5 max-w-4xl mb-20">
        <span className="px-4 py-2 bg-tertiary-50 text-tertiary-600 font-semibold rounded-full">Why choose LetsGo</span>
        <h2 className="text-4xl md:text-5xl font-semibold text-center text-gray-900 mb-3">The Smarter Way to Travel</h2>
        <p className="text-xl text-center text-gray-600">
          Get where you need to go with verified drivers, transparent pricing, and an easy-to-use platform — connecting
          you to every corner of Cameroon.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
        <FeatureCard
          icon={<Shield className="w-10 h-10 text-primary-500" />}
          title="Safe and Reliable Rides"
          description="Your safety comes first. Travel confidently with verified drivers, real-time trip tracking, and 24/7 support to ensure every journey is smooth and secure."
        />
        <FeatureCard
          icon={<Wallet className="w-10 h-10 text-primary-500" />}
          title="Transparent Pricing"
          description="No surprises, just fair fares. Our upfront pricing ensures you know exactly what you're paying before you ride, with competitive rates across Cameroon."
        />
        <FeatureCard
          icon={<ThumbsUp className="w-10 h-10 text-primary-500" />}
          title="User-Friendly Experience"
          description="Booking a ride has never been easier. Our intuitive app and website make it simple to request, track, and pay for your journey, all in one place."
        />
      </div>
    </section>
  )
}

export default WhyChooseLetsGo

