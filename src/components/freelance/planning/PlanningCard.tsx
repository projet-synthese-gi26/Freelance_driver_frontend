import React, { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { 
  MapPinIcon, CalendarIcon, FlagIcon, PencilSquareIcon, 
  TrashIcon, CloudArrowUpIcon, CloudArrowDownIcon ,CheckIcon, StopIcon
} from '@heroicons/react/24/outline';
import { Planning } from '@/type/planning';

interface PlanningCardProps {
  data: Planning;
  onModify: (data: Planning) => void;
  onPublish: (data: Planning, action: 'publish' | 'unpublish') => void;
  onDelete: (data: Planning) => void;
  onConfirm: (data: Planning) => void;   // <--- AJOUT
  onTerminate: (data: Planning) => void;
}

const getStatusStyle = (status: string) => {
  switch(status) {
      case 'Published': return "bg-green-100 text-green-800";
      case 'Ongoing': return "bg-orange-100 text-orange-800";
      case 'Confirmed': return "bg-blue-100 text-blue-800";
      case 'PendingConfirmation':
      case 'PendingDriverConfirmation': return "bg-yellow-100 text-yellow-800";
      case 'Expired':
      case 'Terminated':
      case 'Cancelled': return "bg-gray-100 text-gray-600";
      case 'Draft':
      default: return "bg-gray-200 text-gray-700";
  }
};

const formatDate = (dateStr: string | undefined, locale: string, fallback: string) =>
  dateStr ? new Date(dateStr).toLocaleDateString(locale) : fallback;

const PlanningTimer = ({ startDate, startTime, endDate, endTime }: Planning) => {
  const t = useTranslations('Dashboard.shared.planningCard');
  const [timeLeft, setTimeLeft] = useState({ label: '', value: '', color: 'text-gray-600', bg: 'bg-gray-100' });

  const calculate = useMemo(() => () => {
    const now = new Date().getTime();
    const start = new Date(`${startDate}T${startTime}`).getTime();
    const end = new Date(`${endDate}T${endTime}`).getTime();

    if (isNaN(start) || isNaN(end)) {
      return { label: t('timer.status'), value: t('timer.scheduled'), color: 'text-gray-600', bg: 'bg-gray-100' };
    }

    if (now > end) {
      return { label: t('timer.expired'), value: t('timer.completed'), color: 'text-red-600', bg: 'bg-red-50' };
    }

    const isFuture = now < start;
    const target = isFuture ? start : end;
    const diff = target - now;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const displayValue = d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`;

    return {
      label: isFuture ? t('timer.startsIn') : t('timer.endsIn'),
      value: displayValue,
      color: isFuture ? 'text-amber-600' : 'text-green-600',
      bg: isFuture ? 'bg-amber-50' : 'bg-green-50',
    };
  }, [startDate, startTime, endDate, endTime]);

  useEffect(() => {
    setTimeLeft(calculate());
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [calculate]);

  return (
    <div className={`px-3 py-1.5 rounded-full text-[10px] font-semibold ${timeLeft.bg} ${timeLeft.color}`}>
      {timeLeft.label}: {timeLeft.value}
    </div>
  );
};

const PlanningCard: React.FC<PlanningCardProps> = ({ data, onModify, onPublish, onDelete, onConfirm, onTerminate }) => {
  const t = useTranslations('Dashboard.shared.planningCard');
  const locale = useLocale();

  // DEBUG - À RETIRER APRÈS
  console.log('Terminate translation:', t('actions.terminate'));
  console.log('Confirm translation:', t('actions.confirm'));

  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-gray-500">{t('label')}</p>
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{data.title}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-2 text-blue-500" />
            {data.departureLocation} → {data.dropoffLocation}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(data.status)}`}>
            {data.status}
          </span>
          <PlanningTimer {...data} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 rounded-xl p-3">
        <div className="flex items-center text-gray-700 text-sm">
          <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
          {formatDate(data.startDate, locale || 'en', t('na'))} • {data.startTime}
        </div>
        <div className="flex items-center text-gray-700 text-sm">
          <FlagIcon className="w-4 h-4 mr-2 text-gray-400" />
          {formatDate(data.endDate, locale || 'en', t('na'))} • {data.endTime}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{data.tripType}</span>
          <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">{data.tripIntention}</span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">{data.pricingMethod}</span>
          {data.negotiable && <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">{t('negotiable')}</span>}
        </div>
        {data.regularAmount && (
          <div className="text-right">
            <p className="text-xs uppercase text-gray-500">{t('price')}</p>
            <p className="text-lg font-bold text-green-600">{Number(data.regularAmount).toLocaleString()} XAF</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-gray-100">
        {/* Bouton Edit */}
        <button
          onClick={() => onModify(data)}
          className="flex items-center px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
        >
          <PencilSquareIcon className="w-4 h-4 mr-1" /> {t('actions.edit')}
        </button>

        {/* Bouton Publish/Unpublish */}
        {data.status !== 'Published' ? (
          <button
            onClick={() => onPublish(data, 'publish')}
            className="flex items-center px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-md transition"
          >
            <CloudArrowUpIcon className="w-4 h-4 mr-1" /> {t('actions.publish')}
          </button>
        ) : (
          <button
            onClick={() => onPublish(data, 'unpublish')}
            className="flex items-center px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-md transition"
          >
            <CloudArrowDownIcon className="w-4 h-4 mr-1" /> {t('actions.unpublish')}
          </button>
        )}

        {/* Bouton Confirm - uniquement pour statuts en attente */}
        {(data.status === 'PendingDriverConfirmation' || data.status === 'PendingConfirmation') && (
          <button
            onClick={() => onConfirm(data)}
            className="flex items-center px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-md transition shadow-sm"
          >
            <CheckIcon className="w-4 h-4 mr-1" /> {t('actions.confirm')}
          </button>
        )}

        {/* Bouton Terminate - uniquement pour courses confirmées ou en cours */}
        {(data.status === 'Confirmed' || data.status === 'Ongoing') && (
          <button
            onClick={() => onTerminate(data)}
            className="flex items-center px-3 py-1.5 bg-gray-800 text-white hover:bg-black rounded-md transition shadow-sm"
          >
            <StopIcon className="w-4 h-4 mr-1" /> {t('actions.terminate')}
          </button>
        )}

        {/* Bouton Delete */}
        <button
          onClick={() => onDelete(data)}
          className="flex items-center px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
        >
          <TrashIcon className="w-4 h-4 mr-1" /> {t('actions.delete')}
        </button>
      </div>
    </div>
  );
};

export default PlanningCard;