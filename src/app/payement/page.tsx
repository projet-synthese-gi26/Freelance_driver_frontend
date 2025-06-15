"use client";
import Image from "next/image";
import React from "react";
import {Tab} from "@headlessui/react";
import PaymentCoolPayForm from "@/components/payment/PaymentCoolPayForm";
import PaymentStripeForm from "@/components/payment/PaymentStripeForm";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

const Page = () => {
    return (
        <main>
            <div className="py-[10px] lg:py-[40px] bg-[var(--bg-2)] overflow-hidden px-3">
                <div className="container flex items-center justify-center ">
                    <div className="bg-white p-4 col-span-8 xl:col-span-2 w-[420px] xl:w-[50%] md:w-[60%]">
                        <div className="section-space--sm relative">
                            <div>
                                <p className=" mb-8 text font-bold flex justify-center">
                                    {" "}
                                    Payment Methods{" "}
                                </p>

                                <Tab.Group>
                                    <Tab.List className="flex gap-3 about-tab mb-7">
                                        <Tab
                                            className={({ selected }) =>
                                                classNames(
                                                    "focus:outline-none transition-transform transform hover:scale-105",
                                                    selected
                                                        ? "font-medium border-2 border-primary-500 rounded-md"
                                                        : ""
                                                )
                                            }
                                        >
                                            <Image
                                                width={174}
                                                height={62}
                                                src="/img/CardLogo.png"
                                                alt="image"
                                                className=""
                                            />
                                        </Tab>
                                        {""}
                                        <Tab
                                            className={({ selected }) =>
                                                classNames(
                                                    "focus:outline-none transition-transform transform hover:scale-105",
                                                    selected
                                                        ? "font-medium border-2 border-primary-500 rounded-md"
                                                        : ""
                                                )
                                            }
                                        >
                                            <Image
                                                width={183}
                                                height={61}
                                                src="/img/PaypalLogo.png"
                                                alt="image"
                                                className=""
                                            />
                                        </Tab>{" "}
                                        <Tab
                                            className={({ selected }) =>
                                                classNames(
                                                    "focus:outline-none transition-transform transform hover:scale-105",
                                                    selected
                                                        ? "font-medium border-2 border-primary-500 rounded-md"
                                                        : ""
                                                )
                                            }
                                        >
                                            <Image
                                                width={250}
                                                height={64}
                                                src="/img/MomoLogo.png"
                                                alt="image"
                                                className=""
                                            />
                                        </Tab>{" "}
                                        <Tab
                                            className={({ selected }) =>
                                                classNames(
                                                    "focus:outline-none transition-transform transform hover:scale-105",
                                                    selected
                                                        ? "font-medium border-2 border-primary-500 rounded-md"
                                                        : ""
                                                )
                                            }
                                        >
                                            <Image
                                                width={274}
                                                height={64}
                                                src="/img/OMLogo.png"
                                                alt="image"
                                                className=""
                                            />
                                        </Tab>
                                    </Tab.List>
                                    <Tab.Panels className="tab-content">
                                        <Tab.Panel>
                                            <div className="flex flex-col gap-4">
                                                <PaymentStripeForm />
                                            </div>
                                        </Tab.Panel>

                                        <Tab.Panel>
                                            <div className="flex flex-col gap-4">
                                                <PaymentStripeForm  />                              <PaymentCoolPayForm />
                                            </div>
                                        </Tab.Panel>

                                        <Tab.Panel>
                                            <div className="flex flex-col gap-5">
                                                <PaymentCoolPayForm />
                                            </div>
                                        </Tab.Panel>

                                        <Tab.Panel>
                                            <div className="flex flex-col gap-5">
                                                <PaymentCoolPayForm />
                                            </div>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;
