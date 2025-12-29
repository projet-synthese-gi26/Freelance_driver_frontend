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
    // État pour stocker les vraies adresses venant du backend
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [locationInfo, setLocationInfo] = useState<string>("Loading...");

    // Chargement des données depuis l'API
    const loadAddresses = useCallback(async () => {
        setLoading(true);
        try {
            // Appel au service connecté au backend
            const data = await addressService.getAllAddresses();
            setAddresses(data);
            
            // Sélection par défaut de la première adresse et mise à jour de l'info de localisation
            if (data.length > 0) {
                if (!selectedAddressId) setSelectedAddressId(data[0].id);
                setLocationInfo(data[0].country);
            } else {
                setLocationInfo("No address defined");
            }
        } catch (error) {
            console.error("Erreur chargement adresses", error);
            toast.error("Impossible de récupérer vos adresses.");
        } finally {
            setLoading(false);
        }
    }, [selectedAddressId]);

    useEffect(() => {
        loadAddresses();
    }, [loadAddresses]);

    // Gestion de la sélection d'une adresse
    const handleSelectAddress = (id: string) => {
        setSelectedAddressId(id);
        const selected = addresses.find(a => a.id === id);
        if (selected) {
            setLocationInfo(selected.country);
        }
    };

    // Gestion de la suppression via l'API
    const handleDeleteAddress = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;
        
        try {
            await addressService.deleteAddress(id);
            toast.success("Adresse supprimée.");
            loadAddresses(); // Rafraîchir la liste
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression.");
        }
    };

    return (
      <div className="p-3 text rounded-2xl bg-white shadow-3 mb-[20%]">
        <h3 className="mb-0 title font-bold flex-grow"> My Address </h3>
        <div className="border border-t my-3"></div>
        <p className="text-sm clr-neutral-500 mb-3">
          Cards will be charged either at the end of the month or whenever your
          balance exceeds the usage threshold. All major credit/debit cards accepted.
        </p>

        {loading ? (
            <div className="text-center py-10">Chargement de vos adresses...</div>
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
                        />
                    ) : (
                        <EmptyJumbotron 
                            title="Aucune adresse" 
                            message="Vous n'avez pas encore ajouté d'adresse professionnelle." 
                        />
                    )}
                </li>
                
                <li className="items-center justify-center flex w-full">
                    {/* Le formulaire d'ajout connecté au backend */}
                    <BillingForm 
                        status="add" 
                        onSuccess={loadAddresses} 
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
            {locationInfo} - 20.00% SST{" "}
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