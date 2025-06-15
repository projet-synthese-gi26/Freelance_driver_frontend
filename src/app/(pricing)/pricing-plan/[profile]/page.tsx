/* eslint-disable react/no-unescaped-entities */
"use client";
// Import Swiper styles
import PaySwitch from "../../components/PaySwitch";
import SubHeadingBtn from "../../components/SubHeadingBtn";
import _features from "@/app/(pricing)/components/datas/features";
import profiles from "@/app/(pricing)/components/datas/profiles";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { log, profile } from "console";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface PlanData {
  id: String;
  type: String;
  title: String;
  description: [];
  content: String;
  amount: Number;
}

const Page = ({ params }: { params: { profile: number } }) => {
  const [activeButton, setActiveButton] = useState(1);
  //const profile = 1;
  // console.log(params.profile);

  const features = _features[params.profile];
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
    axios
        .get("http://localhost:5000/find_plan")
        .then((response) => {
          const results = response.data;
          if (activeButton === 1) {
            const result = results.filter(
                (responseItem: any) => responseItem.type === "monthly"
            );
            const plan1 = result.find(
                (responseItem: any) => responseItem.title == "basic"
            );
            SetBasic(plan1);
            SetDescriptionBasic(plan1.description);
            const plan2 = result.find(
                (responseItem: any) => responseItem.title == "standard"
            );
            SetStandard(plan2);
            SetDescriptionStandard(plan2.description);
            const plan3 = result.find(
                (responseItem: any) => responseItem.title == "premium"
            );
            SetPremium(plan3);
            SetDescriptionPremium(plan3.description);
            console.log(result);
          }
          if (activeButton === 3) {
            const result = results.filter(
                (responseItem: any) => responseItem.type === "quarterly"
            );
            const plan1 = result.find(
                (responseItem: any) => responseItem.title == "basic"
            );
            SetBasic(plan1);
            SetDescriptionBasic(plan1.description);
            const plan2 = result.find(
                (responseItem: any) => responseItem.title == "standard"
            );
            SetStandard(plan2);
            SetDescriptionStandard(plan2.description);
            const plan3 = result.find(
                (responseItem: any) => responseItem.title == "premium"
            );
            SetPremium(plan3);
            SetDescriptionPremium(plan3.description);
            console.log(result);
          }
          if (activeButton === 12) {
            const result = results.filter(
                (responseItem: any) => responseItem.type === "annually"
            );
            const plan1 = result.find(
                (responseItem: any) => responseItem.title == "basic"
            );
            SetBasic(plan1);
            SetDescriptionBasic(plan1.description);
            const plan2 = result.find(
                (responseItem: any) => responseItem.title == "standard"
            );
            SetStandard(plan2);
            SetDescriptionStandard(plan2.description);
            const plan3 = result.find(
                (responseItem: any) => responseItem.title == "premium"
            );
            SetPremium(plan3);
            SetDescriptionPremium(plan3.description);
            console.log(result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
  }, [activeButton]);

  const terms = profiles[params.profile - 1].url.replaceAll("-", " ");

  return (
      <main>
        <div className="py-[5px] lg:py-[20px] text bg-[var(--bg-2)] overflow-hidden px-3">
          <div className="mx-5 p-2">
            <h1 className="text-center title text-[var(--neutral-700)] font-bold leading-tight tracking-tight font-inter">
              GENERIC PLANS FOR {terms.toLocaleUpperCase()}
            </h1>
          </div>
          <div className="max-w-[570px] mx-auto flex flex-col items-center text-center">
            <SubHeadingBtn
                text="Pricing Plan"
                classes="bg-[var(--primary-light)]"
            />
            <h2 className="h2 text">Choose Our Pricing Plan</h2>
            <p className="text-neutral-600 pb-2">
              Here you have our differents pricing plan choose the option that
              fits you the most... Feel free and explore the terms
            </p>
          </div>
          <div className="mb-2">
            <div className="container">
              <div className="row">
                <div className="col-span-12">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex bg-[var(--primary-light)] rounded">
                        <PaySwitch
                            label="monthly"
                            onClick={() => handleButtonClick(1)}
                            isActive={activeButton === 1}
                        />
                        <PaySwitch
                            label="Quarterly"
                            onClick={() => handleButtonClick(3)}
                            isActive={activeButton === 3}
                        />

                        <PaySwitch
                            label="annually"
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
            <div className="grid grid-cols-12 g-3 md:gap-0 overflow-hidden">
              <div className="col-span-12 md:col-span-6 lg:col-span-4 mx-3 h-full">
                <div className="bg-white py-2 px-6 h-full">
                  <div className="text-center">
                    <p className="mb-0 font-medium text-primary">
                      Basic
                    </p>
                    <div className="border border-dashed mt-2 mb-1"></div>
                    <h1 className="h2 clr-primary-400 mb-2 text">
                      {" "}
                      {Basic.amount.toString()} FCFA / {activeButton} month{" "}
                    </h1>
                    <p className="m-1">{Basic.content}</p>
                    <div className="border border-dashed mt-1 mb-2"></div>
                    <ul className="flex flex-col gap-4 max-text-30 mx-auto mb-3">
                      {descriptionBasic.map((description,key) => (
                          <li className="flex items-center text-2xl gap-2" key=''>
                            <i className="las la-check-circle text-primary"></i>
                            <p className="mb-0 text text-start">{description}</p>
                          </li>
                      ))}
                    </ul>
                    <Link
                        href={
                            "/payment-method/" +
                            params.profile +
                            "/basic/" +
                            activeButton
                        }
                        className="w-full rounded-lg btn-outline transition-colors duration-500 bg-primary text-white hover:bg-[#575fa0]  justify-center  font-semibold"
                    >
                      Choose Plan
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-4 mx-3 h-full">
                <div className="bg-primary px-6 py-2 h-full">
                  <div className="text-center">
                    <p className="mb-0 font-medium text-white">
                      Standard
                    </p>
                    <div className="border border-dashed mt-2 mb-1"></div>
                    <h1 className="h2 text-white mb-2 text">
                      {Standard.amount.toString()} FCFA / {activeButton} month{" "}
                    </h1>
                    <p className="m-1 text-white">{Standard.content} </p>
                    <div className="border border-dashed mt-1 mb-2"></div>
                    <ul className="flex flex-col gap-4 max-text-30 mx-auto mb-3">
                      {descriptionStandard.map((description,key) => (
                          <li className="flex items-center text-2xl gap-2" key='' >
                            <i className="las la-check-circle text-white"></i>
                            <p className="mb-0 text-white text-start">
                              {description}
                            </p>
                          </li>
                      ))}
                    </ul>
                    <Link
                        href={
                            "/payment-method/" +
                            params.profile +
                            "/standart/" +
                            activeButton
                        }
                        className="btn-outline  bg-white hover:bg-white  hover:text-primary text-primary w-full rounded-lg justify-center"
                    >
                      Choose Plan
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 lg:col-span-4 mx-3 h-full">
                <div className="p-2 bg-white h-full">
                  <div className="text-center text-black relative">
                    <p className="mb-0 font-medium text-primary">
                      Premium
                    </p>
                    <div className="border border-dashed mt-2 mb-2"></div>
                    <h1 className="h2  mb-1 text">
                      {" "}
                      {Premium.amount.toString()} FCFA / {activeButton} month{" "}
                    </h1>
                    <p className="m-1">{Premium.content}</p>
                    <div className="border border-dashed mt-2 mb-2"></div>
                    <ul className="flex flex-col gap-4 max-text-30 mx-auto mb-3">
                      {descriptionPremium.map((description,key) => (
                          <li className="flex items-center text-2xl gap-2 " key=''>
                            <i className="las la-check-circle text-primary"></i>
                            <p className="mb-0 text-lg text-start">{description}</p>
                          </li>
                      ))}

                    </ul>
                    <Link
                        href={
                            "/payment-method/" +
                            params.profile +
                            "/premium/" +
                            activeButton
                        }
                        className="btn-outline bg-primary hover:bg-[#575fa0] transition-colors duration-500  font-semibold text-white w-full rounded-lg justify-center  bottom-10"
                    >
                      Choose Plan
                    </Link>
                  </div>
                </div>
              </div>
            </div>
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