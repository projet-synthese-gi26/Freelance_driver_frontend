"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import apiClient from "@/service/apiClient";
import { planningService } from "@/service/planningService";
import { announcementService } from "@/service/announcementService";
import RightModal from "@/components/modal/RightModal";
import { profileService } from "@/service/profileService";
import { vehicleService } from "@/service/vehicleService";
import { addressService } from "@/service/addressService";
import { reviewService } from "@/service/reviewService";

type BackendNotification = {
  id: string;
  type?: string;
  title?: string;
  body?: string;
  createdAt?: string;
  read?: boolean;
  data?: Record<string, any>;
};

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  kind: "INFO" | "REQUEST";
  read: boolean;
  data: Record<string, any>;
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"ALL" | "INFO" | "REQUEST">("ALL");

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NotificationItem[]>([]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsMode, setDetailsMode] = useState<"DRIVER" | "CLIENT" | null>(null);
  const [detailsPayload, setDetailsPayload] = useState<any>(null);

  const notifications = items;

  const openDetails = async (n: NotificationItem) => {
    const productType = String(n.data.productType ?? "").toUpperCase();
    const fromUserId = String(n.data.fromUserId ?? "");
    if (!fromUserId) {
      alert("Détails indisponibles");
      return;
    }

    setDetailsOpen(true);
    setDetailsLoading(true);
    setDetailsPayload(null);

    try {
      if (productType === "ANNONCE") {
        setDetailsMode("DRIVER");
        const [profile, vehicles, addresses, reviews] = await Promise.all([
          profileService.getPublicDriverProfile(fromUserId),
          vehicleService.getVehiclesByDriver(fromUserId),
          addressService.getDriverAddressesByUserId(fromUserId),
          reviewService.getReviewsBySubject(fromUserId, "DRIVER" as any),
        ]);

        const driverProfile = (profile as any)?.driverProfile ?? (profile as any)?.user ?? null;
        const driverActorId = (profile as any)?.actor?.id;
        const mainAddress = Array.isArray(addresses) ? addresses[0] : undefined;

        const ratingValues = (Array.isArray(reviews) ? reviews : [])
          .map((r: any) => Number(r?.rating ?? 0))
          .filter((v: any) => Number.isFinite(v) && v > 0);
        const averageRating = ratingValues.length
          ? ratingValues.reduce((sum: number, v: number) => sum + v, 0) / ratingValues.length
          : 0;

        const driverData = {
          driver_id: fromUserId,
          driver_actor_id: driverActorId,
          driver_profile_image:
            driverProfile?.profileImageUrl ||
            driverProfile?.photoUri ||
            (profile as any)?.actor?.avatarUrl ||
            "/img/default-avatar.jpeg",
          driver_last_name: driverProfile?.lastName || "",
          driver_first_name: driverProfile?.firstName || "",
          driverLocation: mainAddress?.city || "",
          driver_experiences: [],
          driver_languages: driverProfile?.language ? [driverProfile.language] : [],
          driver_specialities: [],
          driver_keywords: [],
          driver_availability_table: [],
          has_vehicle: Array.isArray(vehicles) && vehicles.length > 0,
          Description: driverProfile?.biography || "",
          driver_statistics: {
            average_rating: averageRating,
            review_total_number: Array.isArray(reviews) ? reviews.length : 0,
          },
        };

        const mainVehicle = Array.isArray(vehicles) && vehicles.length > 0 ? vehicles[0] : null;
        const vehicleImages = mainVehicle?.vehicleId
          ? await vehicleService.getVehicleImages(mainVehicle.vehicleId)
          : [];

        const vehicleData = mainVehicle
          ? {
              vehicleId: mainVehicle.vehicleId,
              total_seat_number: mainVehicle.totalSeatNumber ?? null,
              luggage_max_capacity: mainVehicle.luggageMaxCapacity ?? null,
              mileage_at_mileage_since_commissioning: mainVehicle.mileageSinceCommissioning ?? null,
              fuel_type_name: null,
              transmission_type_name: null,
              model_name: null,
              manufacturer_name: null,
              brand_name: mainVehicle.brand || null,
              registration_number: mainVehicle.registrationNumber || null,
              vehicle_serial_number: mainVehicle.vehicleSerialNumber || null,
              tank_capacity: mainVehicle.tankCapacity ?? null,
              vehicle_age_at_start: mainVehicle.vehicleAgeAtStart ?? null,
              average_fuel_consumption_per_kilometer: mainVehicle.averageFuelConsumptionPerKm ?? null,
              mileage_since_commissioning: mainVehicle.mileageSinceCommissioning ?? null,
              registration_expiry_date: mainVehicle.registrationExpiryDate || null,
              vehicle_amenities: [],
              illustration_images: (Array.isArray(vehicleImages) ? vehicleImages : [])
                .map((img: any) => img?.imagePath)
                .filter(Boolean),
              vehicle_reviews: [],
            }
          : { illustration_images: [], vehicle_reviews: [] };

        setDetailsPayload({ driverData, vehicleData });
        return;
      }

      setDetailsMode("CLIENT");
      const [publicUser, reviews] = await Promise.all([
        profileService.getPublicUserById(fromUserId),
        reviewService.getReviewsBySubject(fromUserId, "CLIENT" as any),
      ]);

      const values = (Array.isArray(reviews) ? reviews : [])
        .map((r: any) => Number(r?.rating ?? 0))
        .filter((v: any) => Number.isFinite(v) && v > 0);
      const avg = values.length ? values.reduce((s: number, v: number) => s + v, 0) / values.length : 0;

      setDetailsPayload({
        userId: fromUserId,
        name: [publicUser?.firstName, publicUser?.lastName].filter(Boolean).join(" ").trim() || "Client",
        phone: publicUser?.phone || "",
        email: publicUser?.email || "",
        photoUri: publicUser?.photoUri || "/dark_avatar.svg",
        averageRating: avg,
        reviewCount: Array.isArray(reviews) ? reviews.length : 0,
      });
    } catch (e) {
      console.error("openDetails failed", e);
      setDetailsPayload(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<BackendNotification[]>("/api/v1/notifications/me");
      const mapped: NotificationItem[] = (Array.isArray(res.data) ? res.data : []).map((n) => {
        const data = (n.data ?? {}) as Record<string, any>;
        const action = String(data.action ?? "").toUpperCase();
        const kind: NotificationItem["kind"] = action === "RESPOND" ? "REQUEST" : "INFO";
        return {
          id: n.id,
          title: n.title ?? "Notification",
          message: n.body ?? "",
          createdAt: n.createdAt ?? new Date().toISOString(),
          kind,
          read: Boolean(n.read),
          data,
        };
      });
      setItems(mapped);
    } catch (e) {
      console.error("load notifications failed", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    if (filter === "ALL") return notifications;
    return notifications.filter((n) => n.kind === filter);
  }, [filter, notifications]);

  const markRead = async (id: string, read: boolean) => {
    try {
      await apiClient.patch(`/api/v1/notifications/${id}/read`, { read });
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read } : n)));
    } catch (e) {
      console.error("markRead failed", e);
    }
  };

  const handleAccept = async (n: NotificationItem) => {
    try {
      const productType = String(n.data.productType ?? "").toUpperCase();
      const productId = String(n.data.productId ?? "");
      if (!productId) throw new Error("productId missing");

      if (productType === "PLANNING") {
        await planningService.updatePlanning(productId, { status: "Confirmed" });
      } else if (productType === "ANNONCE") {
        await announcementService.updateAnnouncement(productId, { status: "Confirmed" });
      } else {
        throw new Error(`unsupported productType ${productType}`);
      }

      await markRead(n.id, true);
      await load();
    } catch (e) {
      console.error("accept failed", e);
      alert("Action échouée");
    }
  };

  const handleReject = async (n: NotificationItem) => {
    try {
      const productType = String(n.data.productType ?? "").toUpperCase();
      const productId = String(n.data.productId ?? "");
      if (!productId) throw new Error("productId missing");

      if (productType === "PLANNING") {
        await planningService.updatePlanning(productId, { status: "Published", reservedById: null });
      } else if (productType === "ANNONCE") {
        await announcementService.updateAnnouncement(productId, { status: "Published", reservedById: null });
      } else {
        throw new Error(`unsupported productType ${productType}`);
      }

      await markRead(n.id, true);
      await load();
    } catch (e) {
      console.error("reject failed", e);
      alert("Action échouée");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <BellIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
            <p className="text-sm font-semibold text-slate-500">
              {loading ? "Chargement..." : `${visible.length} élément(s)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              filter === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            Tous
          </button>
          <button
            type="button"
            onClick={() => setFilter("REQUEST")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              filter === "REQUEST"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            Demandes
          </button>
          <button
            type="button"
            onClick={() => setFilter("INFO")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              filter === "INFO"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            Infos
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {visible.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ${
              n.read ? "opacity-70" : ""
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-extrabold text-slate-900">
                    {n.title}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      n.kind === "REQUEST"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {n.kind === "REQUEST" ? "Demande" : "Info"}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {n.message}
                </p>
                <p className="mt-2 text-xs font-semibold text-slate-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => openDetails(n)}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  Détails
                </button>

                {n.kind === "REQUEST" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAccept(n)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Accepter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(n)}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-2 text-sm font-bold text-white hover:bg-rose-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Refuser
                    </button>
                  </>
                ) : null}

                {!n.read ? (
                  <button
                    type="button"
                    onClick={() => markRead(n.id, true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-800"
                  >
                    Marquer lu
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm font-semibold text-slate-500">
            Aucune notification.
          </div>
        ) : null}
      </div>

      <RightModal
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setDetailsMode(null);
          setDetailsPayload(null);
        }}
        pageContent={detailsMode === "DRIVER"}
        data={detailsPayload}
      >
        <div className="space-y-6">
          <div className="py-[30px] lg:py-[60px] text bg-[var(--bg-2)] px-3">
            <div className="container max-w-full">
              <div className="grid grid-cols-1 gap-4 lg:gap-6">
                <div className="col-span-1">
                  <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-6 lg:px-6 mb-2">
                    {detailsLoading ? (
                      <div className="text-sm font-semibold text-slate-600">Chargement...</div>
                    ) : detailsMode === "CLIENT" ? (
                      <div className="text relative px-12">
                        <div className="w-32 h-32 text border overflow-hidden border-[var(--primary)] rounded-full bg-white p-4 grid place-content-center relative mx-auto mb-2">
                          <img
                            src={detailsPayload?.photoUri || "/dark_avatar.svg"}
                            alt="client"
                            className="rounded-full w-full h-full object-cover"
                          />
                        </div>

                        <h4 className="text-center title font-semibold mb-1">{detailsPayload?.name || "Client"}</h4>

                        <div className="flex items-center justify-center flex-wrap mb-2">
                          <p className="mb-0 flex flex-col w-full text-center relative group">
                            Contact:
                            <span className="text-primary truncate overflow-hidden text-ellipsis inline-block max-w-full cursor-pointer">
                              {detailsPayload?.phone || "N/A"}
                            </span>
                            <span className="text-primary truncate overflow-hidden text-ellipsis inline-block max-w-full cursor-pointer">
                              {detailsPayload?.email || "N/A"}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center justify-center flex-wrap mb-2">
                          <div className="flex min-w-full justify-center items-center my-1 px-4 mx-8 space-x-4">
                            <div className="flex items-center">
                              <span className="mr-1">{Number(detailsPayload?.averageRating ?? 0).toFixed(1)}</span>
                              <StarIcon className="w-4 h-4 text-[var(--tertiary)]" />
                              <span className="ml-2 text-gray-500"> {detailsPayload?.reviewCount ?? 0} avis</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-slate-600">Détails indisponibles</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RightModal>
    </div>
  );
}
