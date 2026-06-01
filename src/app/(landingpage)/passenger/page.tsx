import Hero from "@/components/landingpage/Hero";
import WhyChooseLetsgo from "@/components/landingpage/WhyChooseLetsgo";
import DownloadAppSection from "@/components/landingpage/DownloadAppSection";
import Newsletter from "@/components/landingpage/Newsletter";
import { useTranslations } from "next-intl";
import { ShieldCheckIcon, MapPinIcon, CreditCardIcon, StarIcon, ClockIcon, HeadphonesIcon } from "lucide-react";

function PassengerBenefits() {
  const benefits = [
    {
      icon: ShieldCheckIcon,
      title: "Trajets 100% sécurisés",
      description: "Chaque chauffeur est vérifié et évalué par notre communauté. Voyagez l'esprit tranquille à chaque trajet.",
    },
    {
      icon: MapPinIcon,
      title: "Suivi en temps réel",
      description: "Suivez votre chauffeur en direct sur la carte et partagez votre position avec vos proches.",
    },
    {
      icon: CreditCardIcon,
      title: "Paiement simplifié",
      description: "Payez en ligne ou en espèces. Aucune surprise : le tarif est affiché avant de confirmer votre réservation.",
    },
    {
      icon: StarIcon,
      title: "Chauffeurs notés",
      description: "Consultez les avis et notes des autres passagers pour choisir le chauffeur qui vous convient.",
    },
    {
      icon: ClockIcon,
      title: "Disponible 24h/24",
      description: "Réservez un trajet à toute heure, que ce soit pour un départ immédiat ou planifié à l'avance.",
    },
    {
      icon: HeadphonesIcon,
      title: "Support dédié",
      description: "Notre équipe est disponible à tout moment pour vous aider avant, pendant et après votre trajet.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
          <span className="px-4 py-1.5 bg-primary-50 text-primary-500 text-sm font-semibold rounded-full">
            Pour les passagers
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Voyagez plus sereinement avec LetsGo
          </h2>
          <p className="text-lg text-gray-500">
            Une plateforme pensée pour que chaque trajet soit simple, sûr et agréable.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {benefits.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-primary-50 rounded-xl w-fit">
                <item.icon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PassengerSteps() {
  const steps = [
    { step: "01", title: "Créez votre compte", description: "Inscrivez-vous en quelques secondes avec votre email ou numéro de téléphone." },
    { step: "02", title: "Trouvez un chauffeur", description: "Entrez votre destination et consultez les chauffeurs disponibles près de vous." },
    { step: "03", title: "Réservez et payez", description: "Confirmez votre trajet et payez en ligne ou en espèces. Simple et rapide." },
    { step: "04", title: "Voyagez en toute confiance", description: "Suivez votre trajet en temps réel et notez votre expérience à l'arrivée." },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
          <span className="px-4 py-1.5 bg-tertiary-50 text-tertiary-600 text-sm font-semibold rounded-full">
            Comment ça marche
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Réservez un trajet en 4 étapes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col gap-3 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <span className="text-4xl font-black text-primary-100">{s.step}</span>
              <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PassengerPage() {
  return (
    <div className="bg-white">
      <Hero />
      <PassengerBenefits />
      <PassengerSteps />
      <DownloadAppSection />
      <Newsletter />
    </div>
  );
}
