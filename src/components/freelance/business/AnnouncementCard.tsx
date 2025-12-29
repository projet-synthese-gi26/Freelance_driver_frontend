"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { 
  MapPinIcon, 
  CalendarIcon, 
  BanknotesIcon, 
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { PublicOfferView, announcementService } from '@/service/announcementService';

interface AnnouncementCardProps {
  item: PublicOfferView;
  onActionCompleted?: () => void;
  onCancelRide?: (announcementId: string) => void; 
  isCancelling?: boolean;
  mode?: 'orders' | 'offers';
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ 
    item, 
    onActionCompleted,
    onCancelRide,
    isCancelling = false,
    mode = 'orders' 
}) => {
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    // Formatage en anglais (UK) pour jour/mois/année
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleApply = async () => {
    if (!confirm(`Do you want to apply for the ride by ${item.authorName}?`)) return;

    setLoading(true);
    try {
      await announcementService.applyToAnnouncement(item.id);
      toast.success("Application sent! Waiting for client confirmation.");
      if (onActionCompleted) onActionCompleted();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Error applying for the ride.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
      if (onCancelRide && item.id) {
          onCancelRide(item.id);
      }
  };

  // Determine the status/button to display
  const renderStatusOrButton = () => {
    // MODE ORDERS (Looking for work)
    if (mode === 'orders') {
        if (item.status === 'Published' && !item.reservedByDriverId) {
            return (
                <button
                onClick={handleApply}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center text-sm"
                >
                    {loading ? 'Sending...' : 'Apply'}
                </button>
            );
        }
        
        if (item.status === 'PendingConfirmation') {
            return (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    Pending Confirmation
                </span>
            );
        }

        // Other statuses
        return (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                {item.status}
            </span>
        );
    }

    // MODE OFFERS (Accepted/Ongoing rides)
    if (mode === 'offers') {
        if (item.status === 'Ongoing') {
            return (
                <button 
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 text-sm"
                >
                    {isCancelling ? 'Cancelling...' : 'Cancel Ride'}
                </button>
            );
        }
        
        if (item.status === 'PendingConfirmation') {
             return (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    Pending Confirmation
                </span>
            );
        }

        if (item.status === 'Confirmed') {
             return (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    Confirmed
                </span>
            );
        }
        
        // Default for offers
        return (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                {item.status}
            </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* Header : Client Info */}
      <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
                <Image 
                    src={item.authorImageUrl || "/img/default-avatar.jpeg"} 
                    alt={item.authorName} 
                    fill
                    className="rounded-full object-cover border border-gray-200"
                />
            </div>
            <div>
                <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.authorName}</h3>
                <p className="text-xs text-gray-500 font-medium">Client</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-base font-bold text-green-600">
                {item.cost > 0 ? `${item.cost.toLocaleString()} XAF` : 'Price N/A'}
            </p>
            {item.isNegotiable && <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Negotiable</span>}
        </div>
      </div>

      {/* Body : Trip Details */}
      <div className="p-4 flex-grow space-y-4">
        <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-[2.5em]">{item.title}</h4>
        
        <div className="flex items-start gap-3 pl-1">
            <div className="flex flex-col items-center mt-1.5 h-full">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-100"></div>
                <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100"></div>
            </div>
            <div className="flex-1 space-y-3 pt-0.5">
                <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pick up</p>
                    <p className="text-sm text-gray-700 font-medium line-clamp-1" title={item.pickupLocation}>{item.pickupLocation}</p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Drop off</p>
                    <p className="text-sm text-gray-700 font-medium line-clamp-1" title={item.dropoffLocation}>{item.dropoffLocation}</p>
                </div>
            </div>
        </div>

        <div className="pt-3 mt-2 border-t border-dashed border-gray-100 flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{formatDate(item.startDate)}</span> at <span className="font-medium">{item.startTime}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                <BanknotesIcon className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{item.paymentMethod}</span>
            </div>
        </div>
      </div>

      {/* Footer : Actions */}
      <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center gap-2">
        <button 
            onClick={() => toast('Chat feature coming soon!')}
            className="flex items-center text-blue-600 hover:bg-white px-3 py-1.5 rounded-lg transition text-sm font-medium border border-transparent hover:border-blue-100 hover:shadow-sm"
        >
            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1.5" />
            Chat
        </button>
        
        {renderStatusOrButton()}
      </div>
    </div>
  );
};