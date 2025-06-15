"use client";

import { Menu, X, Package, Tag, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import Header from "@/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const navItems = [
        { label: "Overview", value: "overview", icon: <TrendingUp size={20} />, path: "/admin/overview" },
        { label: "Plans", value: "plans", icon: <Package size={20} />, path: "/admin/plan" },
        { label: "Promo codes", value: "promo", icon: <Tag size={20} />, path: "/admin/promo" },
        { label: "Subscriptions", value: "subscriptions", icon: <Users size={20} />, path: "/admin/sub" },
    ];

    const handleNavClick = (tab: string, path: string) => {
        setActiveTab(tab);
        router.push(path);
        setIsSidebarOpen(false);
    };

    return (
        <>
            <ToastContainer />
            <Toaster toastOptions={{ duration: 4000 }} />

            <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-30">
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                <button onClick={() => setIsSidebarOpen(true)}>
                    <Menu className="h-6 w-6 text-gray-700" />
                </button>
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex bg-gray-50">
                <div
                    className={`fixed z-50 top-0 left-0  min-h-screen w-64 bg-white border-r border-gray-200 p-4 transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
                        <button
                            className="lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => handleNavClick(item.value, item.path)}
                                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-left ${activeTab === item.value
                                    ? "bg-primary-50 text-primary-600 font-bold"
                                    : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <main className="p-4 w-full pt-0 transition-all duration-300">
                    {children}
                </main>

            </div>
        </>
    );
}
