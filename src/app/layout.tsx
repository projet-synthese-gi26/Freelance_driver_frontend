
import "./globals.css";

import "@public/styles/styles.scss";
import "@public/styles/line-awesome.min.css";
import ContextProvider from '@/components/context/context';
import {getLocale, getMessages} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import ClientRootLayout from '@/app/layout/clientLayout';
// import CookieConsent from '@/components/cookies/CookieConsent';
import NewFooter from "@/components/general/NewFooter";
import NewHeader from "@/components/general/NewHeader";
import AuthLayoutContent from "@/app/layout/authLayout";
import { URL } from "url";
import {Toaster} from "react-hot-toast";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css';
import '@/styles/loading/spinner.css';
import React from "react";
import CookieRootLayout from "@/app/layout/cookieLayout";



export const metadata = {
    metadataBase: new URL("https://stage-bice-alpha.vercel.app/"),
    title: "Discover Let's Go, Yowyob's transportation platform",
    description: "Let's Go, the new mobility solution from Yowyob.Inc, allows you to easily book your rides with just a few clicks. Enjoy a reliable, secure, and eco-friendly service for your city commutes. Visit the Let's Go website now and start traveling in a more convenient and responsible way.",
    openGraph:{
        title: "Discover Let's Go, Yowyob's transportation platform",
        type: "website",
        description: "Let's Go, the new mobility solution from Yowyob.Inc, allows you to easily book your rides with just a few clicks",
        locale: "en-US",
        url: process.env.PROJECT_URL,
        siteName:"Let's Go"
    }
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const messages = await getMessages();
    return (
        <html lang={locale}>
        <body className="flex flex-col min-h-screen bg-[var(--bg-1)] text-[var(--neutral-700)]">
            <ToastContainer />
            <Toaster toastOptions={{ duration: 4000 }} />
            <ContextProvider>
                <NextIntlClientProvider messages={messages}>
                    <AuthLayoutContent>
                        <ClientRootLayout>
                            <NewHeader />
                            <main className="flex-grow min-h-[72vh]">
                                <CookieRootLayout>
                                    {children}
                                </CookieRootLayout>
                            </main>
                            <NewFooter />
                        </ClientRootLayout>
                    </AuthLayoutContent>
                </NextIntlClientProvider>
            </ContextProvider>
        </body>
        </html>
    );
}