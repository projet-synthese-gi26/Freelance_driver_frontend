"use client";

import FreelanceDetailsComponent from "@/components/profile/freelance/FreelanceDetailsComponent";
import {useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";



export default function  FreelanceDetails ()   {

    const searchParams = useSearchParams();
    // const vehicleData = JSON.parse(searchParams.get('vehicleData') || '{}');
    // const driverData = JSON.parse(searchParams.get('driverData') || '{}');

    const [profileData, setProfileData] = useState(null);


    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            const storedData = localStorage.getItem(id);
            if (storedData) {
                setProfileData(JSON.parse(storedData));

                // Optionally, remove the data from localStorage after retrieving it
                // localStorage.removeItem(id);
            } else {
                console.error(' data not found');
                // Handle the error, maybe redirect to an error page
            }
        }
    }, [searchParams]);

    if (!profileData) {
        return <div className="h-[60vh] flex items-center justify-center bigtitle font-bold">No  data available</div>;
    }
    const { vehicleData, driverData } = profileData;

    const data={
        vehicleData,
        driverData,

    }

    return <FreelanceDetailsComponent data={data} />;
}

