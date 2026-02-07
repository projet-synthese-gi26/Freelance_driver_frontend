"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowRightIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

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

const hasMeaningfulValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return Number.isFinite(value);
  const v = String(value).trim();
  if (!v) return false;
  if (v.toLowerCase() === "n/a") return false;
  return true;
};

export default function SearchCardClientAnnouncement({
  announcement,
  onSeeMore,
  onReserve,
}) {
  const display = useMemo(() => {
    const authorName = announcement.authorName?.trim() || "Client";

    const hasCar =
      /car|voiture|vehicule|véhicule|vehicle/i.test(announcement.baggageInfo ?? "") ||
      (announcement.baggageInfo ?? "").includes("has car") ||
      (announcement.baggageInfo ?? "").includes("Has car");

    return {
      authorName,
      authorPhoneNumber: announcement.authorPhoneNumber?.trim() || "",
      authorImageUrl: announcement.authorImageUrl || "/dark_avatar.svg",
      title: announcement.title?.trim() || "Annonce sans titre",
      pickupLocation: announcement.pickupLocation?.trim() || "",
      dropoffLocation: announcement.dropoffLocation?.trim() || "",
      startDate: announcement.startDate,
      startTime: announcement.startTime,
      endDate: announcement.endDate,
      endTime: announcement.endTime,
      cost: announcement.cost,
      isNegotiable: Boolean(announcement.isNegotiable),
      baggageInfo: announcement.baggageInfo,
      hasCar,
    };
  }, [announcement]);

  return (
    <div className="group relative w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md md:min-h-[360px] lg:col-span-2">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400" />

      <div className="flex flex-col gap-5 p-5 md:flex-row md:p-6">
        <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-100 md:h-auto md:min-h-[320px] md:w-64">
          <Image
            fill
            src={display.authorImageUrl}
            alt={display.authorName}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-900">{display.authorName}</h2>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  {display.title}
                </span>
                {display.hasCar ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
                    <CheckBadgeIcon className="h-4 w-4 text-slate-600" />
                    Has car
                  </span>
                ) : null}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                    display.isNegotiable ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"
                  }`}
                >
                  <BriefcaseIcon className="h-4 w-4" />
                  Négociable: {display.isNegotiable ? "Oui" : "Non"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-700">{formatPrice(display.cost)}</span>
                <span className="text-sm font-semibold text-slate-500">budget</span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-auto md:min-w-[170px]">
              <button
                type="button"
                onClick={() => onSeeMore?.(announcement)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
              >
                Voir plus
                <ArrowRightIcon className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onReserve?.(announcement)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Réserver
                <TruckIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPinIcon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Trajet</span>
              </div>
              <div className="mt-2 font-semibold text-slate-900">
                {display.pickupLocation || "Départ non précisé"}
                <span className="mx-2 text-slate-300">→</span>
                {display.dropoffLocation || "Arrivée non précisée"}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <CalendarDaysIcon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Date</span>
              </div>
              <div className="mt-2 font-semibold text-slate-900">
                {display.startDate ? new Date(display.startDate).toLocaleDateString("fr-FR") : "N/A"}
                {display.startTime ? ` · ${String(display.startTime).slice(0, 5)}` : ""}
              </div>
            </div>
          </div>

          {(hasMeaningfulValue(display.authorPhoneNumber) || hasMeaningfulValue(display.baggageInfo)) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {hasMeaningfulValue(display.authorPhoneNumber) ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  <PhoneIcon className="h-4 w-4 text-slate-500" />
                  {display.authorPhoneNumber}
                </span>
              ) : null}

              {hasMeaningfulValue(display.baggageInfo) ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {String(display.baggageInfo)}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
