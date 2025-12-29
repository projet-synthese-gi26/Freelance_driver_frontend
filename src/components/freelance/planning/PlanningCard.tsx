import React from 'react';
import { 
  MapPinIcon, CalendarIcon, FlagIcon, PencilSquareIcon, 
  TrashIcon, CloudArrowUpIcon, CloudArrowDownIcon 
} from '@heroicons/react/24/outline';
import { Planning } from '@/type/planning';

interface PlanningCardProps {
  data: Planning;
  onModify: (data: Planning) => void;
  onPublish: (data: Planning, action: 'publish' | 'unpublish') => void;
  onDelete: (data: Planning) => void;
}

const getStatusStyle = (status: string) => {
  switch(status) {
      case 'Published': return "bg-green-100 text-green-800";
      case 'Ongoing': return "bg-orange-100 text-orange-800";
      case 'Confirmed': return "bg-blue-100 text-blue-800";
      case 'Expired': return "bg-gray-100 text-gray-600";
      case 'Draft':
      default: return "bg-gray-200 text-gray-700";
  }
};

const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleDateString('fr-FR') : 'N/A';

const PlanningCard: React.FC<PlanningCardProps> = ({ data, onModify, onPublish, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 mb-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 truncate flex-1 mr-2">{data.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(data.status)}`}>
          {data.status}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPinIcon className="w-5 h-5 mr-2 text-blue-500" />
          <span className="text-sm font-medium">{data.pickupLocation} ➔ {data.dropoffLocation}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
          <span className="text-sm">Début: {formatDate(data.startDate)} à {data.startTime}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FlagIcon className="w-5 h-5 mr-2 text-gray-400" />
          <span className="text-sm">Fin: {formatDate(data.endDate)} à {data.endTime}</span>
        </div>
        {data.regularAmount && (
           <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
             <span className="text-xs text-gray-500 uppercase">Prix</span>
             <span className="font-bold text-green-600">{Number(data.regularAmount).toLocaleString()} XAF</span>
           </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
        <button 
          onClick={() => onModify(data)}
          className="flex items-center px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
        >
          <PencilSquareIcon className="w-4 h-4 mr-1" /> Modifier
        </button>
        
        {data.status !== 'Published' ? (
          <button 
            onClick={() => onPublish(data, 'publish')}
            className="flex items-center px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-md transition"
          >
            <CloudArrowUpIcon className="w-4 h-4 mr-1" /> Publier
          </button>
        ) : (
          <button 
            onClick={() => onPublish(data, 'unpublish')}
            className="flex items-center px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-md transition"
          >
            <CloudArrowDownIcon className="w-4 h-4 mr-1" /> Retirer
          </button>
        )}
        
        <button 
          onClick={() => onDelete(data)}
          className="flex items-center px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
        >
          <TrashIcon className="w-4 h-4 mr-1" /> Supprimer
        </button>
      </div>
    </div>
  );
};

export default PlanningCard;