"use client";


import React, {useState} from "react";
import ContextProvider from "@/components/review/context";
// import {CookieContextProvider} from "@/components/context/CookieContext";


export default function ClientRootLayout({
    children,

}: {
    children: React.ReactNode;

}) {
    const [refresh, setRefresh] = useState(true);

    return (
        <ContextProvider setRefresh={setRefresh} refresh={refresh}>
        {/*<CookieContextProvider>*/}
                {children}

        {/*</CookieContextProvider>*/}
        </ContextProvider>
    );
}