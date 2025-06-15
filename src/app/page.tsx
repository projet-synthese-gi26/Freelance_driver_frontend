

import AgencySection from "@/components/landingpage/AgencySection";
import DownloadAppSection from "@/components/landingpage/DownloadAppSection";
import DriverSection from "@/components/landingpage/DriverSection";
import NewHero from "@/components/landingpage/freelance/NewHero";
import Hero from "@/components/landingpage/Hero";
import InstitutionSection from "@/components/landingpage/InstitutionSection";
import Newsletter from "@/components/landingpage/Newsletter";
import WhyChooseLetsgo from "@/components/landingpage/WhyChooseLetsgo";

const page = () => {
  return (
    <>
      <main>
      <Hero/>
      <WhyChooseLetsgo/>
      <DriverSection/>
      <AgencySection/>
      <InstitutionSection/>
      <DownloadAppSection/>
      <Newsletter/>
      </main>    
    </>
  );
};

export default page;
