"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import apiClient from "@/service/apiClient";
import { planningService } from "@/service/planningService";
import { announcementService } from "@/service/announcementService";

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

  const notifications = items;

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
                <Link
                  href={
                    n.data?.detailsActorId
                      ? `/freelance-profile/${String(n.data.detailsActorId)}`
                      : "#"
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  Détails
                </Link>

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
    </div>
  );
}
