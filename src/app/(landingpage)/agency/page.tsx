import AgencySection from "@/components/landingpage/AgencySection";
import WhyChooseLetsgo from "@/components/landingpage/WhyChooseLetsgo";
import DownloadAppSection from "@/components/landingpage/DownloadAppSection";
import Newsletter from "@/components/landingpage/Newsletter";
import Link from "next/link";
import { BuildingOffice2Icon, ChartBarIcon, TruckIcon, UsersIcon, CogIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

function AgencyHero() {
  return (
    <section className="relative bg-primary-500 text-white py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)" }}
      />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 relative z-10">
        <div className="flex flex-col gap-6 max-w-xl">
          <span className="inline-flex w-fit px-4 py-1.5 bg-white/20 text-white text-sm font-semibold rounded-full">
            Pour les agences
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Gérez votre flotte et développez votre activité
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            LetsGo offre aux agences de transport une plateforme complète pour gérer leurs chauffeurs, planifier leurs opérations et atteindre plus de clients.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-primary-500 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Inscrire votre agence
            </Link>
            <Link
              href="/freelance/about"
              className="px-6 py-3 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              En savoir plus
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { label: "Agences actives", value: "120+" },
            { label: "Chauffeurs gérés", value: "2 400+" },
            { label: "Trajets planifiés", value: "18 000+" },
            { label: "Satisfaction client", value: "98%" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex flex-col gap-1">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-white/70">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgencyFeatures() {
  const features = [
    { icon: TruckIcon, title: "Gestion de flotte", description: "Ajoutez, suivez et gérez tous vos véhicules depuis un seul tableau de bord." },
    { icon: UsersIcon, title: "Gestion des chauffeurs", description: "Recrutez, planifiez et évaluez vos chauffeurs. Suivez leurs performances en temps réel." },
    { icon: ChartBarIcon, title: "Analyses & rapports", description: "Accédez à des statistiques détaillées sur vos revenus, trajets et clients." },
    { icon: DocumentTextIcon, title: "Facturation automatique", description: "Générez des factures et des reçus automatiquement à chaque trajet." },
    { icon: CogIcon, title: "Personnalisation", description: "Configurez vos tarifs, zones de service et politiques d'annulation selon vos besoins." },
    { icon: BuildingOffice2Icon, title: "Multi-agences", description: "Gérez plusieurs agences depuis un seul compte avec des rôles et permissions distincts." },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
          <span className="px-4 py-1.5 bg-primary-50 text-primary-500 text-sm font-semibold rounded-full">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Tout ce dont votre agence a besoin
          </h2>
          <p className="text-lg text-gray-500">
            Une suite d'outils pensée pour simplifier la gestion quotidienne et accélérer votre croissance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary-50 rounded-xl w-fit">
                <f.icon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AgencyPage() {
  return (
    <div className="bg-white">
      <AgencyHero />
      <AgencySection />
      <AgencyFeatures />
      <DownloadAppSection />
      <Newsletter />
    </div>
  );
}
