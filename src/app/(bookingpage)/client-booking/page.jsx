"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import { ProtectedButton } from "@/components/general/ProtectedButton";
import {
  BanknotesIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CURRENCY = "XAF";

const formatPrice = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "N/A";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(n);
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;

    try {
      const stored = localStorage.getItem(id);
      if (!stored) return;
      setBookingData(JSON.parse(stored));
    } catch (e) {
      console.error("Unable to read booking data:", e);
    }
  }, [searchParams]);

  const announcement = bookingData?.announcement;

  const display = useMemo(() => {
    if (!announcement) return null;

    const pickup = announcement.pickupLocation || announcement.departureLocation || "";
    const dropoff = announcement.dropoffLocation || "";

    return {
      title: announcement.title || "Annonce",
      pickup,
      dropoff,
      fullLocation: announcement.fullLocation || `${pickup} ➔ ${dropoff}`,
      startDate: announcement.startDate || "",
      startTime: announcement.startTime || "",
      endDate: announcement.endDate || "",
      endTime: announcement.endTime || "",
      cost: announcement.cost,
      isNegotiable: Boolean(announcement.isNegotiable ?? announcement.negotiable),
      baggageInfo: announcement.baggageInfo || "",
      authorName: announcement.authorName || "Client",
      authorPhoneNumber: announcement.authorPhoneNumber || "",
      authorImageUrl: announcement.authorImageUrl || "/dark_avatar.svg",
    };
  }, [announcement]);

  if (!bookingData || !display) {
    return <div className="p-4">No booking data available</div>;
  }

  const handleProceed = () => {
    router.push("/payement");
  };

  return (
    <div className="py-[30px] lg:py-[60px] bg-[var(--bg-2)] px-3">
      <div className="container">
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-white rounded-md p-3 sm:p-4 lg:p-6 mb-6">
              <div className="flex items-center justify-between gap-3 pb-4">
                <h3 className="h3 title">Booking resume Informations</h3>
              </div>

              <Tab.Group>
                <Tab.List className="flex gap-3 about-tab mb-7">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "focus:outline-none transition-transform transform hover:scale-105",
                        selected ? "font-medium border-2 border-primary-500 rounded-md" : ""
                      )
                    }
                  >
                    <div className="flex items-center gap-2 px-3 py-2">
                      <TruckIcon className="h-5 w-5" />
                      <span className="text-sm font-semibold">Trajet</span>
                    </div>
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "focus:outline-none transition-transform transform hover:scale-105",
                        selected ? "font-medium border-2 border-primary-500 rounded-md" : ""
                      )
                    }
                  >
                    <div className="flex items-center gap-2 px-3 py-2">
                      <PhoneIcon className="h-5 w-5" />
                      <span className="text-sm font-semibold">Client</span>
                    </div>
                  </Tab>
                </Tab.List>

                <Tab.Panels className="tab-content">
                  <Tab.Panel>
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-start gap-3">
                          <MapPinIcon className="h-5 w-5 text-slate-500" />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Trajet
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-800">{display.fullLocation}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Départ</p>
                          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <CalendarDaysIcon className="h-5 w-5 text-slate-500" />
                            <span>
                              {display.startDate ? new Date(display.startDate).toLocaleDateString("fr-FR") : "N/A"}
                              {display.startTime ? ` · ${String(display.startTime).slice(0, 5)}` : ""}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Budget</p>
                          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <BanknotesIcon className="h-5 w-5 text-slate-500" />
                            <span>{formatPrice(display.cost)}</span>
                          </div>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            Négociable: {display.isNegotiable ? "Oui" : "Non"}
                          </p>
                        </div>
                      </div>

                      {display.baggageInfo ? (
                        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Bagages</p>
                          <p className="mt-2 text-sm text-slate-700">{String(display.baggageInfo)}</p>
                        </div>
                      ) : null}
                    </div>
                  </Tab.Panel>

                  <Tab.Panel>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                          <Image
                            src={display.authorImageUrl}
                            alt={display.authorName}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{display.authorName}</p>
                          <p className="mt-1 text-sm text-slate-600 flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4" />
                            <span>{display.authorPhoneNumber || "Non renseigné"}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-md bg-white p-4 lg:p-6 shadow-sm border border-slate-100">
              <h4 className="text-lg font-bold text-slate-900">Résumé</h4>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Annonce:</span> {display.title}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Trajet:</span> {display.fullLocation}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Budget:</span> {formatPrice(display.cost)}
                </p>
              </div>
            </div>

            <ProtectedButton
              onProtectedClick={handleProceed}
              className="link inline-flex items-center gap-2 lg:mt-8 py-3 px-6 rounded-md bg-primary text-white hover:bg-blue-700 font-semibold w-full text-xl justify-center"
            >
              <span className="inline-block text"> Proceed Booking </span>
            </ProtectedButton>
          </div>
        </div>
      </div>
    </div>
  );
}
