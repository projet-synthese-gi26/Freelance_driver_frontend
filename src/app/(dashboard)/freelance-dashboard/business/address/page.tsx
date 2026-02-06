"use client"
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from 'react-hot-toast';
import { useTranslations } from "next-intl";

// SERVICES & TYPES
import { addressService } from "@/service/addressService";
import { Address } from "@/type/address";

// COMPOSANTS PARTAGÉS
import BillingAddress from "@/components/customer/address/BillingAddress";
import BillingForm from "@/components/customer/address/BillingForm";
import EmptyJumbotron from "@/components/EmptyJumbotron"; // Assurez-vous que ce composant existe

const Page = () => {
    const t = useTranslations("Dashboard.freelance.address");
    // Store addresses from backend
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [locationInfo, setLocationInfo] = useState<string>(t("location.loading"));

    // Load addresses from the API
    const loadAddresses = useCallback(async () => {
        setLoading(true);
        try {
            const data = await addressService.getDriverAddresses();
            setAddresses(data);
            
            // Default selection and location info
            if (data.length > 0) {
                if (!selectedAddressId) setSelectedAddressId(data[0].id);
                setLocationInfo(data[0].city || data[0].state || t("location.na"));
            } else {
                setLocationInfo(t("location.none"));
            }
        } catch (error) {
            console.error("Error loading addresses", error);
            toast.error(t("toasts.fetchError"));
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
            setLocationInfo(selected.city || selected.state || t("location.na"));
        }
    };

    // Handle delete via API
    const handleDeleteAddress = async (id: string) => {
        if (!confirm(t("confirmDelete"))) return;
        
        try {
            await addressService.deleteDriverAddress(id);
            toast.success(t("toasts.deleted"));
            loadAddresses(); // Rafraîchir la liste
        } catch (error) {
            console.error(error);
            toast.error(t("toasts.deleteError"));
        }
    };

    return (
      <div className="p-3 text rounded-2xl bg-white shadow-3 mb-[20%]">
        <h3 className="mb-0 title font-bold flex-grow"> {t("title")} </h3>
        <div className="border border-t my-3"></div>
        <p className="text-sm clr-neutral-500 mb-3">
          {t("description")}
        </p>

        {loading ? (
            <div className="text-center py-10">{t("loading")}</div>
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
                            title={t("empty.title")} 
                            message={t("empty.message")} 
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
            <p className="text-sm clr-neutral-500"> {t("taxLocation.title")} </p>
            <Link
              href="#"
              className="link inline-block text-primary hover:text-primary font-medium">
              {t("taxLocation.moreInfo")}
            </Link>
          </div>
          <h5 className="clr-neutral-500 font-semibold">
            {" "}
            {locationInfo} - 20.00% VAT{" "}
          </h5>
        </div>
        <div className="">
          <p className="text-sm clr-neutral-500"> 
            {t("taxLocation.helpText")}
          </p>
          <Link
            href="#"
            className="link inline-block text-primary hover:text-primary font-medium">
            {t("taxLocation.howTo")}
          </Link>
        </div>
      </div>
    );
};
  
export default Page;