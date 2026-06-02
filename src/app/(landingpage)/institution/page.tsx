import InstitutionSection from "@/components/landingpage/InstitutionSection";
import WhyChooseLetsgo from "@/components/landingpage/WhyChooseLetsgo";
import DownloadAppSection from "@/components/landingpage/DownloadAppSection";
import Newsletter from "@/components/landingpage/Newsletter";
import Link from "next/link";
import { AcademicCapIcon, ShieldCheckIcon, ChartBarIcon, UserGroupIcon, ClockIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

function InstitutionHero() {
  return (
    <section className="relative bg-[#091e42] text-white py-20 px-4 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(ellipse at 30% 60%, #2D3A96 0%, transparent 70%)" }}
      />
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
        <span className="inline-flex w-fit px-4 py-1.5 bg-white/10 text-white text-sm font-semibold rounded-full">
          Pour les institutions
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
          Des solutions de mobilité adaptées aux institutions
        </h1>
        <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
          Universités, hôpitaux, entreprises, administrations — LetsGo vous accompagne dans la gestion de vos services de transport avec fiabilité et transparence.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
          >
            Inscrire votre institution
          </Link>
          <Link
            href="/freelance/about"
            className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            Découvrir LetsGo
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mt-4">
          {[
            { value: "50+", label: "Institutions partenaires" },
            { value: "5 000+", label: "Employés transportés" },
            { value: "99.2%", label: "Taux de ponctualité" },
            { value: "24/7", label: "Support disponible" },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 rounded-2xl p-4 flex flex-col gap-1">
              <span className="text-2xl font-bold">{s.value}</span>
              <span className="text-xs text-white/60">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstitutionFeatures() {
  const features = [
    { icon: UserGroupIcon, title: "Gestion des employés", description: "Attribuez des accès à vos employés et suivez leurs déplacements professionnels en temps réel." },
    { icon: ShieldCheckIcon, title: "Sécurité renforcée", description: "Chauffeurs vérifiés, trajets tracés et alertes en cas d'incident — la sécurité de vos équipes est notre priorité." },
    { icon: ChartBarIcon, title: "Rapports institutionnels", description: "Exportez des rapports détaillés pour la comptabilité, l'audit et le suivi budgétaire." },
    { icon: ClockIcon, title: "Planification avancée", description: "Programmez des navettes régulières, des transferts d'aéroport ou des convois institutionnels à l'avance." },
    { icon: AcademicCapIcon, title: "Pour les universités", description: "Navettes inter-campus, transport d'étudiants et gestion des sorties académiques simplifiées." },
    { icon: GlobeAltIcon, title: "Couverture nationale", description: "Présent dans les principales villes du Cameroun, LetsGo dessert les institutions où qu'elles soient." },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
          <span className="px-4 py-1.5 bg-tertiary-50 text-tertiary-600 text-sm font-semibold rounded-full">
            Ce que nous offrons
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Une plateforme taillée pour les besoins institutionnels
          </h2>
          <p className="text-lg text-gray-500">
            Des fonctionnalités spécifiques pour répondre aux exigences des grandes organisations.
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

export default function InstitutionPage() {
  return (
    <div className="bg-white">
      <InstitutionHero />
      <InstitutionSection />
      <InstitutionFeatures />
      <DownloadAppSection />
      <Newsletter />
    </div>
  );
}
