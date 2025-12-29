"use client";
import React, { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// --- TYPES (Identiques au mobile) ---
interface FilterState {
  pickupLocation?: string;
  dropoffLocation?: string;
  startDate?: string;
  maxCost?: number;
  isNegotiable?: boolean;
  paymentMethod?: string;
}

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
  initialFilters?: FilterState;
  hasActiveFilters: boolean;
  onToggleModal: () => void;
  filteredCount: number;
}

// --- COMPOSANT INTERNE DE LA MODALE ---
const InternalFilterModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
  initialFilters?: FilterState;
}> = ({ isVisible, onClose, onApplyFilters, onClearFilters, initialFilters = {} }) => {
  const [pickupLocation, setPickupLocation] = useState(initialFilters.pickupLocation || '');
  const [dropoffLocation, setDropoffLocation] = useState(initialFilters.dropoffLocation || '');
  const [startDate, setStartDate] = useState<Date | null>(initialFilters.startDate ? new Date(initialFilters.startDate) : null);
  const [maxCost, setMaxCost] = useState(initialFilters.maxCost?.toString() || '');
  const [isNegotiable, setIsNegotiable] = useState(initialFilters.isNegotiable || false);
  const [paymentMethod, setPaymentMethod] = useState(initialFilters.paymentMethod || ''); 

  // Synchronisation si les filtres initiaux changent
  useEffect(() => {
    setPickupLocation(initialFilters.pickupLocation || '');
    setDropoffLocation(initialFilters.dropoffLocation || '');
    setStartDate(initialFilters.startDate ? new Date(initialFilters.startDate) : null);
    setMaxCost(initialFilters.maxCost?.toString() || '');
    setIsNegotiable(initialFilters.isNegotiable || false);
    setPaymentMethod(initialFilters.paymentMethod || '');
  }, [initialFilters]);

  const handleInternalApply = () => {
    onApplyFilters({
      pickupLocation,
      dropoffLocation,
      startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
      maxCost: maxCost ? parseFloat(maxCost) : undefined,
      isNegotiable,
      paymentMethod: paymentMethod || undefined,
    });
  };

  const handleInternalClear = () => {
    onClearFilters();
    // Reset local state
    setPickupLocation('');
    setDropoffLocation('');
    setStartDate(null);
    setMaxCost('');
    setIsNegotiable(false);
    setPaymentMethod('');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Filtrer les annonces</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Lieu de départ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lieu de départ</label>
            <input
              type="text"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: Yaoundé"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>

          {/* Lieu d'arrivée */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lieu d'arrivée</label>
            <input
              type="text"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: Douala"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            />
          </div>

          {/* Date de début */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date de début</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholderText="Sélectionner une date"
              isClearable
            />
          </div>

          {/* Coût maximum */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Coût maximum (FCFA)</label>
            <input
              type="number"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: 50000"
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
            />
          </div>

          {/* Méthode de paiement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Méthode de paiement</label>
            <input
              type="text"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: cash, mobile_money"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>

          {/* Prix négociable (Switch style checkbox) */}
          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-semibold text-gray-700">Prix négociable</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="p-5 border-t border-gray-100 flex gap-4 bg-gray-50">
          <button 
            onClick={handleInternalClear}
            className="flex-1 py-2.5 px-4 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors"
          >
            Effacer
          </button>
          <button 
            onClick={handleInternalApply}
            className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL (BOUTON DÉCLENCHEUR + MODALE) ---
export const ClientFilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onApplyFilters,
  onClearFilters,
  initialFilters = {},
  hasActiveFilters,
  onToggleModal,
  filteredCount
}) => {
  return (
    <>
      <div className="flex items-center justify-between px-4 mb-4">
        
        {/* Bouton déclencheur */}
        <button
          onClick={onToggleModal}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
            hasActiveFilters
              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
              : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <FunnelIcon className="w-5 h-5" />
          {hasActiveFilters ? (
            <span className="font-semibold text-sm">Filtres actifs</span>
          ) : (
            <span className="font-semibold text-sm">Filtrer</span>
          )}
        </button>

        {/* Badge compteur */}
        <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          <span className="text-blue-600 font-bold text-sm">{filteredCount}</span>
        </div>
      </div>

      <InternalFilterModal
        isVisible={isVisible}
        onClose={onClose}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        initialFilters={initialFilters}
      />
    </>
  );
};