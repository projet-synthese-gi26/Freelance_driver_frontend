import Hero from "@/components/landingpage/Hero";
import DriversSection from "@/components/landingpage/DriverSection";
import WhyChooseLetsgo from "@/components/landingpage/WhyChooseLetsgo";
import DownloadAppSection from "@/components/landingpage/DownloadAppSection";
import Newsletter from "@/components/landingpage/Newsletter";
import Link from "next/link";
import { BanknotesIcon, ClockIcon, UserGroupIcon, ShieldCheckIcon, TruckIcon, StarIcon } from "@heroicons/react/24/outline";

function DriverBenefits() {
  const benefits = [
    { icon: BanknotesIcon, title: "Revenus garantis", description: "Gagnez plus avec une structure tarifaire transparente et des bonus de performance." },
    { icon: ClockIcon, title: "Horaires flexibles", description: "Travaillez quand vous voulez. Pas de quarts imposés, vous êtes votre propre patron." },
    { icon: UserGroupIcon, title: "Accès à des clients qualifiés", description: "Connectez-vous à des passagers et agences sérieux qui respectent les chauffeurs." },
    { icon: ShieldCheckIcon, title: "Assurance & protection", description: "Bénéficiez d'une couverture d'assurance pendant chaque trajet enregistré sur la plateforme." },
    { icon: TruckIcon, title: "Voiture fournie si besoin", description: "Pas de véhicule ? LetsGo peut vous en fournir un pour démarrer sans attendre." },
    { icon: StarIcon, title: "Valorisez votre réputation", description: "Construisez votre profil, recevez des avis positifs et devenez un chauffeur de référence." },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
          <span className="px-4 py-1.5 bg-primary-50 text-primary-500 text-sm font-semibold rounded-full">
            Pourquoi rejoindre LetsGo
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Des avantages concrets pour les chauffeurs
          </h2>
          <p className="text-lg text-gray-500">
            LetsGo est conçu pour maximiser vos revenus et vous donner la liberté que vous méritez.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {benefits.map((b, i) => (
            <div key={i} className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary-50 rounded-xl w-fit">
                <b.icon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{b.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DriverCTA() {
  return (
    <section className="py-16 px-4 bg-primary-500">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Prêt à conduire avec LetsGo ?
        </h2>
        <p className="text-lg text-white/80">
          Rejoignez des centaines de chauffeurs qui ont déjà choisi la liberté et la flexibilité avec LetsGo.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-primary-500 font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            S'inscrire comme chauffeur
          </Link>
          <Link
            href="/freelance/about"
            className="px-8 py-3 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function DriverPage() {
  return (
    <div className="bg-white">
      <Hero />
      <DriversSection />
      <DriverBenefits />
      <WhyChooseLetsgo />
      <DriverCTA />
      <DownloadAppSection />
      <Newsletter />
    </div>
  );
}
