"use client";
import React, { useState } from "react";
import {
  BellIcon,
  BanknotesIcon,
  StarIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

type NotifCategory = "all" | "ride" | "payment" | "review" | "system";

interface Notification {
  id: string;
  category: Exclude<NotifCategory, "all">;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    category: "ride",
    title: "New ride request",
    message: "A client has requested a ride from Yaoundé Centre to Bastos.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    category: "payment",
    title: "Payment received",
    message: "You received 5,000 XAF for your last trip.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    category: "review",
    title: "New review",
    message: "A passenger left you a 5-star rating.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    category: "system",
    title: "Profile verified",
    message: "Your driving license has been verified successfully.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    category: "ride",
    title: "Ride confirmed",
    message: "Your ride from Melen to Mvan has been confirmed by the client.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    category: "payment",
    title: "Wallet credited",
    message: "12,500 XAF have been credited to your wallet.",
    time: "2 days ago",
    read: true,
  },
];

const CATEGORY_FILTERS: { id: NotifCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ride", label: "Rides" },
  { id: "payment", label: "Payments" },
  { id: "review", label: "Reviews" },
  { id: "system", label: "System" },
];

const categoryIcon = (category: Notification["category"]) => {
  const cls = "w-5 h-5";
  switch (category) {
    case "ride":
      return <BellIcon className={cls} />;
    case "payment":
      return <BanknotesIcon className={cls} />;
    case "review":
      return <StarIcon className={cls} />;
    case "system":
      return <ShieldCheckIcon className={cls} />;
  }
};

const categoryColor = (category: Notification["category"]) => {
  switch (category) {
    case "ride":
      return "bg-blue-50 text-blue-500";
    case "payment":
      return "bg-green-50 text-green-600";
    case "review":
      return "bg-yellow-50 text-yellow-500";
    case "system":
      return "bg-primary/10 text-primary";
  }
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<NotifCategory>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeFilter);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <CheckCircleIcon className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === f.id
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <BellIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 font-medium">No notifications</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((notif) => (
            <li
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-sm ${
                notif.read
                  ? "bg-white border-gray-100"
                  : "bg-primary/5 border-primary/20"
              }`}
            >
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${categoryColor(notif.category)}`}>
                {categoryIcon(notif.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-gray-900 text-sm">{notif.title}</p>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1.5">{notif.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
