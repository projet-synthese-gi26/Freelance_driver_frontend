"use client"
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from 'react-hot-toast';

// SERVICES & TYPES
import { addressService } from "@/service/addressService";
import { Address } from "@/type/address";

// COMPOSANTS PARTAGÉS
import BillingAddress from "@/components/customer/address/BillingAddress";
import BillingForm from "@/components/customer/address/BillingForm";
import EmptyJumbotron from "@/components/EmptyJumbotron"; // Assurez-vous que ce composant existe

const Page = () => {
    // Store addresses from backend
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [locationInfo, setLocationInfo] = useState<string>("Loading...");

    // Load addresses from the API
    const loadAddresses = useCallback(async () => {
        setLoading(true);
        try {
            const data = await addressService.getDriverAddresses();
            setAddresses(data);
            
            // Default selection and location info
            if (data.length > 0) {
                if (!selectedAddressId) setSelectedAddressId(data[0].id);
                setLocationInfo(data[0].city || data[0].state || "N/A");
            } else {
                setLocationInfo("No address defined");
            }
        } catch (error) {
            console.error("Error loading addresses", error);
            toast.error("Unable to fetch your addresses.");
        } finally {
            setLoading(false);
        }
    }, [selectedAddressId]);

    useEffect(() => {
        loadAddresses();
    }, [loadAddresses]);

    // Handle address selection
    const handleSelectAddress = (id: string) => {
        setSelectedAddressId(id);
        const selected = addresses.find(a => a.id === id);
        if (selected) {
            setLocationInfo(selected.city || selected.state || "N/A");
        }
    };

    // Handle delete via API
    const handleDeleteAddress = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        
        try {
            await addressService.deleteDriverAddress(id);
            toast.success("Address deleted.");
            loadAddresses(); // Rafraîchir la liste
        } catch (error) {
            console.error(error);
            toast.error("Error while deleting address.");
        }
    };

    return (
      <div className="p-3 text rounded-2xl bg-white shadow-3 mb-[20%]">
        <h3 className="mb-0 title font-bold flex-grow"> My Addresses </h3>
        <div className="border border-t my-3"></div>
        <p className="text-sm clr-neutral-500 mb-3">
          Cards will be charged either at the end of the month or whenever your
          balance exceeds the usage threshold. All major credit/debit cards accepted.
        </p>

        {loading ? (
            <div className="text-center py-10">Loading your addresses...</div>
        ) : (
            <ul className="flex flex-col gap-6">
                <li>
                    {addresses.length > 0 ? (
                        <BillingAddress 
                            addresses={addresses} 
                            selectedId={selectedAddressId}
                            onSelect={handleSelectAddress}
                            onDelete={handleDeleteAddress}
                            onUpdateSuccess={loadAddresses}
                            scope="driver"
                        />
                    ) : (
                        <EmptyJumbotron 
                            title="No address" 
                            message="You haven't added any business address yet." 
                        />
                    )}
                </li>
                
                <li className="items-center justify-center flex w-full">
                    {/* The add form connected to the backend */}
                    <BillingForm 
                        status="add" 
                        onSuccess={loadAddresses} 
                        scope="driver"
                    />
                </li>
            </ul>
        )}

        <div className="mt-6">
          <div className="flex gap-2">
            <p className="text-sm clr-neutral-500"> Tax location </p>
            <Link
              href="#"
              className="link inline-block text-primary hover:text-primary font-medium">
              More Info
            </Link>
          </div>
          <h5 className="clr-neutral-500 font-semibold">
            {" "}
            {locationInfo} - 20.00% VAT{" "}
          </h5>
        </div>
        <div className="">
          <p className="text-sm clr-neutral-500"> 
            Your tax location determines the taxes that are applied to your bill.
          </p>
          <Link
            href="#"
            className="link inline-block text-primary hover:text-primary font-medium">
            How do I correct my tax location?
          </Link>
        </div>
      </div>
    );
};
  
export default Page;