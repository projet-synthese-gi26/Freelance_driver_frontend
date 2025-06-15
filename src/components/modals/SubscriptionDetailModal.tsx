import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

interface Subscription {
  subscriptionId: string;
  paymentDate: string;
  updateDate: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  paymentMethodId: string;
  userId: string;
  userName: string;
  planName: string;
  amount: number;
  renewalDate: string;
}

export const SubscriptionDetailModal: React.FC<{
  subscription: Subscription;
  onClose: () => void;
}> = ({ subscription, onClose }) => {
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
        className="bg-white rounded-lg w-full max-w-2xl p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Subscription Detail</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-500">User</h3>
              <p className="font-medium">{subscription.userName}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Plan</h3>
              <p className="font-medium">{subscription.planName}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Amount</h3>
              <p className="font-medium">
                {typeof subscription.amount === 'number' ? subscription.amount.toFixed(2) : '0.00'} €
              </p>

            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-500">Payment Date</h3>
              <p className="font-medium">
                {format(new Date(subscription.paymentDate), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Expiration Date</h3>
              <p className="font-medium">
                {format(new Date(subscription.renewalDate), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Status</h3>
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium inline-block mt-1
                ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                ${subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                ${subscription.status === 'expired' ? 'bg-gray-100 text-gray-800' : ''}
                ${subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
              `}>
                {subscription.status}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-medium mb-4">Updates history</h3>
          <div className="space-y-3">
            {/* Exemple d'historique */}
            <div className="flex items-center text-sm">
              <span className="w-32 text-gray-500">
                {format(new Date(), 'dd MMM yyyy', { locale: enUS })}
              </span>
              <span className="text-gray-900">Creating the subscription</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};