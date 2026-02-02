"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from 'react-hot-toast';

// SERVICES & TYPES
import { addressService } from "@/service/addressService";
import { useAuthContext } from "@/components/context/authContext";
import { Address } from "@/type/address";

// COMPOSANTS
import BillingAddress from "@/components/customer/address/BillingAddress";
import BillingForm from "@/components/customer/address/BillingForm";
import EmptyJumbotron from "@/components/EmptyJumbotron";

const Page = () => {
    const { user, isLoading: isUserLoading } = useAuthContext();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [locationInfo, setLocationInfo] = useState<string>("");

    // Load addresses from the API
    const loadAddresses = useCallback(async () => {
        setLoading(true);
        try {
            const data = await addressService.getAllAddresses();
            setAddresses(data);
            
            // Logique de sélection par défaut
            if (data.length > 0) {
                // Tente de garder la sélection actuelle, sinon prend la première
                const currentSelectionExists = data.some(a => a.id === selectedAddressId);
                const newSelectedId = currentSelectionExists ? selectedAddressId : data[0].id;
                setSelectedAddressId(newSelectedId);
                const selected = data.find(a => a.id === newSelectedId);
                setLocationInfo(selected?.city || selected?.state || "N/A");
            } else {
                setLocationInfo("No address defined");
            }
        } catch (error) {
            console.error("Erreur chargement adresses", error);
            toast.error("Impossible de charger vos adresses.");
        } finally {
            setLoading(false);
        }
    }, [selectedAddressId]); // On garde selectedAddressId pour re-évaluer la sélection

    useEffect(() => {
        // Wait for user to load before fetching addresses
        if (!isUserLoading && user) {
            loadAddresses();
        }
    }, [isUserLoading, user, loadAddresses]);

    // Handle selection
    const handleSelectAddress = (id: string) => {
        setSelectedAddressId(id);
        const selected = addresses.find(a => a.id === id);
        if (selected) setLocationInfo(selected.city || selected.state || "N/A");
    };

    // Handle delete via API
    const handleDeleteAddress = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        
        try {
            await addressService.deleteAddress(id);
            toast.success("Address deleted.");
            // Si l'adresse supprimée était sélectionnée, on désélectionne
            if (selectedAddressId === id) setSelectedAddressId(null);
            await loadAddresses(); // Recharger la liste
        } catch (error) {
            toast.error("Error while deleting address.");
        }
    };
    
    // If the user is loading, display a loader
    if (isUserLoading || loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading your addresses...</p>
            </div>
        );
    }
    
    return (
      <div className="p-4 md:p-6 text rounded-2xl bg-white shadow-lg mb-[20%]">
        <h3 className="mb-4 title font-bold text-2xl flex-grow border-b pb-4"> My Addresses </h3>
        
        <p className="text-sm text-gray-500 mb-6">
          Manage your billing and shipping addresses. The selected address will be used by default.
        </p>

        <ul className="flex flex-col gap-6">
            <li>
                {addresses.length > 0 ? (
                    <BillingAddress 
                        addresses={addresses} 
                        selectedId={selectedAddressId}
                        onSelect={handleSelectAddress}
                        onDelete={handleDeleteAddress}
                        onUpdateSuccess={loadAddresses}
                    />
                ) : (
                    <EmptyJumbotron 
                        title="No address" 
                        message="You haven't added any address yet." 
                    />
                )}
            </li>
            
            <li className="items-center justify-center flex w-full">
                <BillingForm 
                    status="add" 
                    onSuccess={loadAddresses} 
                />
            </li>
        </ul>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex gap-2 items-center mb-2">
            <p className="text-sm font-semibold text-gray-600"> Tax location </p>
            <Link
              href="#"
              className="text-sm text-blue-600 hover:underline font-medium">
              More info
            </Link>
          </div>
          <h5 className="text-gray-700 font-bold text-lg">
            {locationInfo} - 20.00% VAT
          </h5>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-1">
            Your tax location determines the taxes applied to your invoices.
          </p>
          <Link
            href="#"
            className="text-sm text-blue-600 hover:underline font-medium">
            How do I correct my tax location?
          </Link>
        </div>
      </div>
    );
};
  
export default Page;