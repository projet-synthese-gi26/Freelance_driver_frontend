import { FC } from 'react';
import dayjs from 'dayjs';
import { Event } from './interfaces/types';

interface EventProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const Event1: FC<EventProps> = ({ event, onEdit, onDelete }) => {
  const start = dayjs(event.startDateTime).format("HH:mm");
  const end = dayjs(event.endDateTime).format("HH:mm");
  const duration = dayjs(event.endDateTime).diff(dayjs(event.startDateTime), 'minute');

  return (
    <div
      className="bg-blue-200 rounded-lg flex gap-3 p-2 m-1 relative"
      style={{ height: `${duration}px`, maxHeight: '50%' }}
    >
      <h4 className="font-bold text-xs truncate">{event.title}</h4>
      <p className="text-xs truncate">
        {start} - {end}
      </p>
      <div className="absolute top-0 right-0 flex space-x-1">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(event); }}
          className="text-xs text-blue-600 p-1"
        >
          Éditer
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(event.PlaningId); }}
          className="text-xs text-red-600 p-1"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default Event1;