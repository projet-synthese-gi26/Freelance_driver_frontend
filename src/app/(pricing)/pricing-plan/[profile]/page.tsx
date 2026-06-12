/* eslint-disable react/no-unescaped-entities */
"use client";
// Import Swiper styles
import PaySwitch from "../../components/PaySwitch";
import SubHeadingBtn from "../../components/SubHeadingBtn";
import _features from "@/app/(pricing)/components/datas/features";
import profiles from "@/app/(pricing)/components/datas/profiles";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { billingService } from "@/service/billingService";
import type { BillingPlan } from "@/type/billing";
import { sessionService } from "@/service/sessionService";
import PlanCard from "../../components/PlanCard";

interface PlanData {
  id: String;
  type: String;
  title: String;
  description: [];
  content: String;
  amount: Number;
}

const Page = ({
  params,
}: {
  params: Promise<{ profile: string }>;
}) => {
  const { profile } = use(params);
  const profileId = Number(profile);
  const router = useRouter();
  const [activeButton, setActiveButton] = useState(1);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string>("PRO");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //const profile = 1;
  // console.log(params.profile);

  const features = _features[profileId];
  // console.log(_features[params.profile])
  const basic = features["basic"];
  const standart = features["standart"];
  const premium = features["premium"];
  const [Basic, SetBasic] = useState<PlanData>({
    id: "",
    type: "",
    title: "",
    description: [],
    content: "",
    amount: 0,
  });
  const [Standard, SetStandard] = useState<PlanData>({
    id: "",
    type: "",
    title: "",
    description: [],
    content: "",
    amount: 0,
  });
  const [Premium, SetPremium] = useState<PlanData>({
    id: "",
    type: "",
    title: "",
    description: [],
    content: "",
    amount: 0,
  });
  const [descriptionBasic, SetDescriptionBasic] = useState([]);
  const [descriptionStandard, SetDescriptionStandard] = useState([]);
  const [descriptionPremium, SetDescriptionPremium] = useState([]);
  const [planIdByCode, setPlanIdByCode] = useState<Record<string, string>>({});

  const handleButtonClick = (index: number) => {
    setActiveButton(index);
  };

  const handleButtonActiveChange = (index: number) => {
    if (index === activeButton) {
      setActiveButton(-1);
    } else {
      setActiveButton(index);
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const plans: BillingPlan[] = await billingService.listPlans();
        const free = plans.find((p) => p.code === "FREE");
        const pro = plans.find((p) => p.code === "PRO");
        const premiumPlan = plans.find((p) => p.code === "PREMIUM");

        const byCode: Record<string, string> = {};
        plans.forEach((p) => {
          byCode[p.code] = p.id;
        });
        setPlanIdByCode(byCode);

        if (free) {
          SetBasic({
            id: free.id,
            type: free.period,
            title: "basic",
            description: [],
            content: free.name,
            amount: free.price,
          });
        }

        if (pro) {
          SetStandard({
            id: pro.id,
            type: pro.period,
            title: "standard",
            description: [],
            content: pro.name,
            amount: pro.price,
          });
        }

        if (premiumPlan) {
          SetPremium({
            id: premiumPlan.id,
            type: premiumPlan.period,
            title: "premium",
            description: [],
            content: premiumPlan.name,
            amount: premiumPlan.price,
          });
        }

        // Descriptions restent celles définies localement par profil.
        SetDescriptionBasic(basic?.description ?? []);
        SetDescriptionStandard(standart?.description ?? []);
        SetDescriptionPremium(premium?.description ?? []);

        const token = sessionService.getAuthToken();
        if (token) {
          try {
            const sub = await billingService.getMySubscription();
            setActivePlanId(sub.planId);

            const activeCode = Object.entries(byCode).find(([, id]) => id === sub.planId)?.[0];
            if (activeCode) setSelectedPlanCode(activeCode);
          } catch (e) {
            // ignore
          }
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("Unable to load plans. Please retry.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [activeButton]);

  const handleSubscribe = async (planCode: string) => {
    const token = sessionService.getAuthToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      setSubscribing(planCode);
      const sub = await billingService.subscribe(planCode);
      setActivePlanId(sub.planId);
      router.push("/freelance-search");
    } catch (e) {
      console.log(e);
      setErrorMessage("Subscription failed. Please retry.");
    } finally {
      setSubscribing(null);
    }
  };

  const terms = profiles[profileId - 1]?.url?.replaceAll("-", " ") ?? "";

  return (
      <main>
        <div className="py-[5px] lg:py-[20px] text bg-[var(--bg-2)] overflow-hidden px-3">
          <div className="mx-5 p-2">
            <h1 className="text-center title text-[var(--neutral-700)] font-bold leading-tight tracking-tight font-inter">
              Plans designed for {terms}
            </h1>
          </div>
          <div className="max-w-[570px] mx-auto flex flex-col items-center text-center">
            <SubHeadingBtn
                text="Pricing Plan"
                classes="bg-[var(--primary-light)]"
            />
            <h2 className="h2 text">Choose the plan that fits your pace</h2>
            <p className="text-neutral-600 pb-2">
              Select the plan that matches your working rhythm. You can upgrade or change at any time.
            </p>
          </div>
          {errorMessage ? (
            <div className="container mb-4">
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
                {errorMessage}
              </div>
            </div>
          ) : null}
          <div className="mb-2">
            <div className="container">
              <div className="row">
                <div className="col-span-12">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex bg-[var(--primary-light)] rounded">
                        <PaySwitch
                            label="Monthly"
                            onClick={() => handleButtonClick(1)}
                            isActive={activeButton === 1}
                        />
                        <PaySwitch
                            label="Quarterly"
                            onClick={() => handleButtonClick(3)}
                            isActive={activeButton === 3}
                        />
                        <PaySwitch
                            label="Annually"
                            onClick={() => handleButtonClick(12)}
                            isActive={activeButton === 12}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-[360px] rounded-2xl bg-white/60 animate-pulse"></div>
                <div className="h-[360px] rounded-2xl bg-white/60 animate-pulse"></div>
                <div className="h-[360px] rounded-2xl bg-white/60 animate-pulse"></div>
              </div>
            ) : (
              <div className="grid grid-cols-12 g-3 md:gap-0 overflow-hidden">
                <div className="col-span-12 md:col-span-6 lg:col-span-4 mx-3 h-full">
                  <PlanCard
                    label="Basic"
                    price={Number(Basic.amount)}
                    currency="FCFA"
                    periodLabel={`${activeButton} month`}
                    description={descriptionBasic as string[]}
                    highlighted={selectedPlanCode === "FREE"}
                    active={activePlanId === planIdByCode["FREE"]}
                    disabled={subscribing !== null || activePlanId === planIdByCode["FREE"]}
                    badge="Free"
                    isFree={true}
                    buttonLabel={
                      activePlanId === planIdByCode["FREE"]
                        ? "Current plan"
                        : subscribing === "FREE"
                          ? "Subscribing..."
                          : "Get started free"
                    }
                    onSelect={() => handleSubscribe("FREE")}
                    onCardClick={() => setSelectedPlanCode("FREE")}
                  />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 mx-3 h-full">
                  <PlanCard
                    label="Standard"
                    price={Number(Standard.amount)}
                    currency="FCFA"
                    periodLabel={`${activeButton} month`}
                    description={descriptionStandard as string[]}
                    highlighted={selectedPlanCode === "PRO"}
                    active={activePlanId === planIdByCode["PRO"]}
                    disabled={subscribing !== null || activePlanId === planIdByCode["PRO"]}
                    badge="Most popular"
                    buttonLabel={
                      activePlanId === planIdByCode["PRO"]
                        ? "Current plan"
                        : subscribing === "PRO"
                          ? "Subscribing..."
                          : "Choose Plan"
                    }
                    onSelect={() => handleSubscribe("PRO")}
                    onCardClick={() => setSelectedPlanCode("PRO")}
                  />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 mx-3 h-full">
                  <PlanCard
                    label="Premium"
                    price={Number(Premium.amount)}
                    currency="FCFA"
                    periodLabel={`${activeButton} month`}
                    description={descriptionPremium as string[]}
                    highlighted={selectedPlanCode === "PREMIUM"}
                    active={activePlanId === planIdByCode["PREMIUM"]}
                    disabled={subscribing !== null || activePlanId === planIdByCode["PREMIUM"]}
                    buttonLabel={
                      activePlanId === planIdByCode["PREMIUM"]
                        ? "Current plan"
                        : subscribing === "PREMIUM"
                          ? "Subscribing..."
                          : "Choose Plan"
                    }
                    onSelect={() => handleSubscribe("PREMIUM")}
                    onCardClick={() => setSelectedPlanCode("PREMIUM")}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="pt-[60px] lg:pt-[120px]">
            <div className="container">
              <div className="grid grid-cols-1">
                <div className="col-span-1">
                  <div className="xl:flex xl:items-center gap-xl-6">
                    <h5 className="mb-0 flex items-center gap-2 shrink-0">
                      Meet Our Valued Partner
                      <ArrowRightIcon className="w-4 h-4" />
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
};

export default Page;