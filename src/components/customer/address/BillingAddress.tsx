"use client"
import React from 'react'
import { Address } from '@/type/address';
import BillingForm from './BillingForm';
import { TrashIcon } from '@heroicons/react/24/outline';

interface BillingAddressProps {
    addresses: Address[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdateSuccess: () => void;
    scope?: 'client' | 'driver';
}

const BillingAddress = ({ addresses, selectedId, onSelect, onDelete, onUpdateSuccess, scope = 'client' }: BillingAddressProps) => {
    return (
        <div className="flex flex-col gap-4">
            {addresses.map((address) => (
                <div 
                    key={address.id} 
                    className={`border rounded-2xl transition-all duration-200 ${
                        selectedId === address.id 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-dashed border-gray-300 hover:border-gray-400'
                    }`}
                >
                    <div className='flex flex-wrap items-center justify-between p-4'>
                        {/* Zone Cliquable pour sélectionner */}
                        <div 
                            className="flex items-center gap-4 cursor-pointer flex-grow"
                            onClick={() => onSelect(address.id)}
                        >
                            <input
                                className="accent-blue-600 scale-125 cursor-pointer"
                                type="radio"
                                name="select-address"
                                id={`billing-address-${address.id}`}
                                checked={selectedId === address.id}
                                onChange={() => onSelect(address.id)}
                            />
                            <label
                                className="cursor-pointer flex-grow"
                                htmlFor={`billing-address-${address.id}`}>
                                <span className="block font-bold text-gray-800 text-lg mb-1">
                                    {address.type || 'Address'}
                                </span>
                                <span className="block text-gray-500 text-sm">
                                    {address.addressLine1}
                                    {address.city ? `, ${address.city}` : ''}
                                    {address.state ? ` ${address.state}` : ''}
                                    {address.zipCode ? ` ${address.zipCode}` : ''}
                                </span>
                            </label>
                        </div>

                        {/* Actions : Modifier / Supprimer */}
                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                            {/* Formulaire en mode "update" pour cette adresse spécifique */}
                            <BillingForm 
                                status='update' 
                                addressToEdit={address} 
                                onSuccess={onUpdateSuccess} 
                                scope={scope}
                            />
                            
                            <button 
                                onClick={() => onDelete(address.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete address"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BillingAddress;