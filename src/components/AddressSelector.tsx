import React, { useState, useEffect } from "react";

type Address = {
    display_name: string;
    lat: string;
    lon: string;
    type?: string;
    address?: {
        country?: string;
    };
};

const AddressSelector: React.FC = () => {
    const [search, setSearch] = useState<string>("");
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const searchAddresses = async (query: string) => {
        if (!query || query.length < 3) return;

        setLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
            );

            if (!response.ok) throw new Error("Erreur de recherche");

            const data: Address[] = await response.json();
            setAddresses(data);
            setShowDropdown(true);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) searchAddresses(search);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleSelect = (address: Address) => {
        setSelectedAddress(address);
        setSearch(address.display_name);
        setShowDropdown(false);
    };

    return (
        <div className="col-span-12 md:col-span-6 mb-5 relative">
            <div className="rounded-lg border bg-[var(--bg-1)] pr-4">
                <input
                    type="text"
                    className="w-full bg-transparent px-5 py-2 focus:outline-none"
                    placeholder="Entrer votre adresse..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                />
            </div>

            {loading && (
                <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-lg border shadow-lg p-2 z-50">
                    <div className="text-center text-gray-500">Recherche en cours...</div>
                </div>
            )}

            {showDropdown && addresses.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-lg border shadow-lg max-h-60 overflow-y-auto z-50">
                    {addresses.map((address, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(address)}
                        >
                            <div className="font-medium">{address.display_name}</div>
                            <div className="text-sm text-gray-500">
                                {address.type} - {address.address?.country || ""}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedAddress && (
                <div className="mt-2 text-sm">
                    <div className="font-medium">Adresse sélectionnée :</div>
                    <div className="text-gray-600">{selectedAddress.display_name}</div>
                    <div className="text-gray-500">
                        Lat: {selectedAddress.lat}, Lon: {selectedAddress.lon}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressSelector;