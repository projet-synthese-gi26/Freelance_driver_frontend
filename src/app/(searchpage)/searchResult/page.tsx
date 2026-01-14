"use client";
import React, { useEffect, useState } from "react";
import SearchResult from "@/components/search/SearchResultSection";
import { driverSearchService, AvailableDriver } from "@/service/driverSearchService";
import { useSearchParams } from "next/navigation";

const Page = () => {
    const searchParams = useSearchParams();
    const [results, setResults] = useState<AvailableDriver[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrivers = async () => {
            setLoading(true);
            try {
                // Fetch all drivers
                // TODO: Enhance service to support backend filtering if needed
                const drivers = await driverSearchService.getAvailableDrivers();
                setResults(drivers);
            } catch (error) {
                console.error("Failed to fetch drivers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div>
            <SearchResult results={results} />
        </div>
    );
};
export default Page;