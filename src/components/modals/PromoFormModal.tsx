import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, Clock, Percent, X, Hash } from "lucide-react";
import React, { useState } from "react";
import dayjs from "dayjs"

interface PromoCode {
  id: string;
  code: string;
  validity: number;
  discount: number;
  status: string;
  startDate: string;
}

export const PromoFormModal: React.FC<{
  promo?: PromoCode | null;
  onClose: () => void;
}> = ({ promo, onClose }) => {
  const [formData, setFormData] = useState<Partial<PromoCode>>(
    promo || {
      code: "",
      validity: 30,
      discount: 10,
      status: "ACTIVE",
      startDate: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
    }
  );
  const [quantity, setQuantity] = useState(1);
  const Api=process.env.SERVER_URL

  const handleCreate = async () => {
    
    try {
      const promoCodes = Array.from({ length: quantity }, (_, i) => ({
        ...formData,
        code: quantity > 1 ? `${formData.code}-${i + 1}` : formData.code,
        status: formData.status?.toUpperCase(),
      }));
      
      const response = await axios.post(`${Api}/promocodes/batch`, promoCodes);
      console.log("Codes promo créés:", response.data);
  
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création des codes promo", error);
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-md p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {promo ? "Modifier le code promo" : "Nouveau code promo"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const promoCodes = Array.from({ length: quantity }, (_, i) => ({
              ...formData,
              code: quantity > 1 ? `${formData.code}-${i + 1}` : formData.code,
            }));
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="ex: SUMMER2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of codes
            </label>
            <div className="relative">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="1"
              />
              <Hash size={16} className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discount: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="0"
                max="100"
              />
              <Percent size={16} className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validity (days)
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.validity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    validity: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="1"
              />
              <Clock size={16} className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start date
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
            </div>
          </div>

          <div className="mt-6 pt-6 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-900"
              onClick={handleCreate}
            >
              {promo ? "Update" : `Create ${quantity} code(s)`}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
