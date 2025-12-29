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

    // Fonction de chargement des adresses depuis l'API
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
                setLocationInfo(selected?.country || "N/A");
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
        // On attend que l'utilisateur soit chargé avant de récupérer ses adresses
        if (!isUserLoading && user) {
            loadAddresses();
        }
    }, [isUserLoading, user, loadAddresses]);

    // Gestion de la sélection
    const handleSelectAddress = (id: string) => {
        setSelectedAddressId(id);
        const selected = addresses.find(a => a.id === id);
        if (selected) setLocationInfo(selected.country);
    };

    // Gestion de la suppression via l'API
    const handleDeleteAddress = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;
        
        try {
            await addressService.deleteAddress(id);
            toast.success("Adresse supprimée.");
            // Si l'adresse supprimée était sélectionnée, on désélectionne
            if (selectedAddressId === id) setSelectedAddressId(null);
            await loadAddresses(); // Recharger la liste
        } catch (error) {
            toast.error("Erreur lors de la suppression.");
        }
    };
    
    // Si l'utilisateur est en cours de chargement, afficher un loader
    if (isUserLoading || loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Chargement de vos adresses...</p>
            </div>
        );
    }
    
    return (
      <div className="p-4 md:p-6 text rounded-2xl bg-white shadow-lg mb-[20%]">
        <h3 className="mb-4 title font-bold text-2xl flex-grow border-b pb-4"> Mes Adresses </h3>
        
        <p className="text-sm text-gray-500 mb-6">
          Gérez vos adresses de facturation et d'expédition. L'adresse sélectionnée sera utilisée par défaut.
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
                        title="Aucune adresse" 
                        message="Vous n'avez pas encore ajouté d'adresse." 
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
            <p className="text-sm font-semibold text-gray-600"> Localisation fiscale </p>
            <Link
              href="#"
              className="text-sm text-blue-600 hover:underline font-medium">
              Plus d'infos
            </Link>
          </div>
          <h5 className="text-gray-700 font-bold text-lg">
            {locationInfo} - 20.00% TVA
          </h5>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-1">
            Votre localisation fiscale détermine les taxes appliquées à vos factures.
          </p>
          <Link
            href="#"
            className="text-sm text-blue-600 hover:underline font-medium">
            Comment corriger ma localisation ?
          </Link>
        </div>
      </div>
    );
};
  
export default Page;