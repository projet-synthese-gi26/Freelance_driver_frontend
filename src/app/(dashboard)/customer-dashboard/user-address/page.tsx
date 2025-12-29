"use client"
import { BillingType } from "@/app/type/Billing";
import BillingAddress from "@/components/customer/address/BillingAddress";
import BillingForm from "@/components/customer/address/BillingForm";
import Link from "next/link";
import { useEffect, useState } from "react";

// --- AJOUT DES SERVICES BACKEND ---
import { addressService } from "@/service/addressService";
import { toast } from "react-hot-toast";

const Page = () => {
    // Initialiser avec un tableau vide au lieu de BillAddress (mock)
    const [billingAdress, setBillingAdress] = useState<BillingType[]>([]);
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(true);

    // 1. Fonction pour charger les adresses réelles depuis Sylladb
    const loadAddresses = async () => {
        try {
            setLoading(true);
            console.log("📍 [ADDRESS] Chargement des adresses depuis le backend...");
            
            const data = await addressService.getAllAddresses();
            
            // LOGS DÉTAILLÉS
            console.group("📦 [BACKEND RAW] Adresses reçues");
            console.log("Nombre d'items:", data.length);
            console.log("Détails:", data);
            console.groupEnd();

            // Adapter les données au type BillingType si nécessaire
            // Le service retourne déjà title, street, city, zipCode, country
            const formattedData = data.map((addr: any) => ({
                id: addr.id,
                country: addr.country || "Cameroon",
                city: addr.city || "",
                street: addr.street || "",
                postalCode: addr.zipCode || "",
                // On ajoute des champs par défaut si BillingType les exige
                email: "", 
                phone: ""
            }));

            setBillingAdress(formattedData);

            if (formattedData.length > 0) {
                setLocation(formattedData[0].country);
            }
        } catch (error) {
            console.error("❌ [ADDRESS ERROR]", error);
            toast.error("Impossible de charger vos adresses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    // 2. Éviter le crash : Si on charge encore, on affiche un loader
    if (loading) {
        return (
            <div className="p-10 text-center animate-pulse">
                <h3 className="text-gray-400 font-bold">Initialisation des adresses Sylladb...</h3>
            </div>
        );
    }

    return (
      <div className="p-3 text rounded-2xl bg-white shadow-3 mb-[20%]">
        <h3 className="mb-0 title font-bold flex-grow"> My Address </h3>
        <div className="border border-t my-3"></div>
        <p className="text-sm clr-neutral-500 mb-3">
            Vos adresses enregistrées sont synchronisées avec votre profil de chauffeur/client.
        </p>
        
        <ul className="flex flex-col gap-6">
          <li>
            {/* On ne rend le composant que si on a des adresses pour éviter l'erreur d'index */}
            {billingAdress.length > 0 ? (
                <BillingAddress 
                    Billings={billingAdress} 
                    setLocation={setLocation} 
                    setBilling={setBillingAdress}
                />
            ) : (
                <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500 italic">
                    Aucune adresse enregistrée.
                </div>
            )}
          </li>
          <li className="items-center justify-center flex w-full">
            {/* BillingForm pour l'ajout ("add") */}
            <BillingForm 
                Billings={billingAdress} 
                status="add" 
                setBilling={setBillingAdress}
            />
          </li>
        </ul>

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
            {location || "Non définie"} - 20.00% SST
          </h5>
        </div>
      </div>
    );
  };
  
  export default Page;