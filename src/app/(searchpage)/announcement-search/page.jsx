"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const AnnouncementSearch = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace("/client-search");
    }, [router]);

    return null;
};

export default AnnouncementSearch;

