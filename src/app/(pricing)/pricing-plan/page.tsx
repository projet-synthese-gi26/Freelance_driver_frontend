/* eslint-disable react/no-unescaped-entities */
"use client";
import Link from "next/link";

import profiles from "@/app/(pricing)/components/datas/profiles";
// Import Swiper styles
import SubHeadingBtn from "../components/SubHeadingBtn";
import { BriefcaseIcon, TruckIcon } from "@heroicons/react/24/outline";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function MyPage() {
    const myprofiles = profiles;

    return (
        <main className="text bg-[var(--bg-2)] min-h-screen">
            <div className="container px-6 py-12">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="flex justify-center">
                        <SubHeadingBtn text="Pricing" classes="bg-[var(--primary-light)]" />
                    </div>
                    <h1 className="title text-[var(--neutral-700)] font-bold leading-tight tracking-tight font-inter mt-4">
                        Choose the profile that matches you
                    </h1>
                    <p className="text-neutral-600 mt-3 max-w-2xl mx-auto">
                        Pick a profile first, then choose a plan. After subscribing, you’ll be redirected to the search page.
                    </p>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
                        <div className="rounded-2xl bg-white/70 border border-neutral-100 px-4 py-3">
                            <p className="mb-0 text-sm text-neutral-700 font-medium">1. Select profile</p>
                        </div>
                        <div className="rounded-2xl bg-white/70 border border-neutral-100 px-4 py-3">
                            <p className="mb-0 text-sm text-neutral-700 font-medium">2. Choose plan</p>
                        </div>
                        <div className="rounded-2xl bg-white/70 border border-neutral-100 px-4 py-3">
                            <p className="mb-0 text-sm text-neutral-700 font-medium">3. Start searching</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
                    {myprofiles.map((profile) => {
                        const title = profile.url.replaceAll("-", " ");
                        const Icon = profile.id === 1 ? TruckIcon : BriefcaseIcon;

                        return (
                            <div
                                key={profile.id}
                                className="rounded-3xl border border-neutral-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-7">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-11 h-11 rounded-2xl bg-[var(--primary-light)] flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-[var(--neutral-700)] capitalize">
                                                    {title}
                                                </h2>
                                                <p className="text-neutral-600 mt-1">
                                                    {profile.description}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="shrink-0 text-xs px-3 py-1 rounded-full bg-[var(--primary-light)] text-primary font-medium">
                                            Profile {profile.id}
                                        </span>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-neutral-50 border border-neutral-100">
                                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                                Pricing plans available
                                            </span>
                                        </div>

                                        <Link
                                            href={"/pricing-plan/" + profile.id}
                                            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 bg-primary text-white hover:bg-[#575fa0] transition-colors font-semibold"
                                        >
                                            Select this profile
                                            <i className="las la-long-arrow-alt-right text-xs ml-2"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}