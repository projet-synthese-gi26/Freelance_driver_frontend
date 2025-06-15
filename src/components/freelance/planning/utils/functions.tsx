import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
import { Dayjs } from 'dayjs';
import { Event } from '../interfaces/types';

type Daily={
  setStart:React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>> ;
  setEnd:React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>> ;
  setState:React.Dispatch<React.SetStateAction<string>>;
  setCriterebuy:React.Dispatch<React.SetStateAction<string | null>>;
  setPrixdecritere:React.Dispatch<React.SetStateAction<number | null>>;
  setPrixtotal:React.Dispatch<React.SetStateAction<number | null>>;
  setPercent:React.Dispatch<React.SetStateAction<number | null>>;
  setPrixtotalreduit:React.Dispatch<React.SetStateAction<number | null>>;
  setTitle:React.Dispatch<React.SetStateAction<string>>;
  setSelectedEvent:React.Dispatch<React.SetStateAction<Event | null>>
  setShowForm:React.Dispatch<React.SetStateAction<boolean>>;
}

type Common={
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  setCreatedAt:React.Dispatch<React.SetStateAction<string>>;
  setUpdatedAt:React.Dispatch<React.SetStateAction<string>>;
  setState:React.Dispatch<React.SetStateAction<string>>;
  setCriterebuy:React.Dispatch<React.SetStateAction<string | null>>;
  setPrixdecritere:React.Dispatch<React.SetStateAction<number | null>>;
  setPrixtotal:React.Dispatch<React.SetStateAction<number | null>>;
  setPercent:React.Dispatch<React.SetStateAction<number | null>>;
  setPrixtotalreduit:React.Dispatch<React.SetStateAction<number | null>>;
  setTitle:React.Dispatch<React.SetStateAction<string>>;
  setSelectedEvent:React.Dispatch<React.SetStateAction<Event | null>>
  setShowForm:React.Dispatch<React.SetStateAction<boolean>>;
};
type Drag={
  setDragStart:React.Dispatch<React.SetStateAction<Dayjs | null>>
  setDragEnd:React.Dispatch<React.SetStateAction<Dayjs | null>>
  dragStart:Dayjs | null;
  dragEnd:Dayjs | null;
}

export const handleDayClick = (Common:Common,day: Dayjs) => {
    if (day.isBefore(dayjs(), 'day')) return;
    Common.setStartDate(day.format("YYYY-MM-DD HH:mm"));
    Common.setCreatedAt(dayjs().format("YYYY-MM-DD HH:mm"));
    Common.setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"));
    Common.setState("Pending");
    Common.setCriterebuy("any");
    Common.setPrixdecritere(0);
    Common.setPrixtotal(0);
    Common.setPercent(0);
    Common.setPrixtotalreduit(0);
    Common.setTitle('');
    Common.setSelectedEvent(null);
    Common.setShowForm(true);
  };

export const handleAdd=(Common:Common)=>{
    Common.setState("Pending");
    Common.setCriterebuy("any");
    Common.setPrixdecritere(0);
    Common.setPrixtotal(0);
    Common.setPercent(0);
    Common.setPrixtotalreduit(0);
    Common.setTitle('');
    Common.setSelectedEvent(null);
    Common.setShowForm(true);
}

export const handleDragStart = (Drag:Drag,day: Dayjs) => {
    if (day.isBefore(dayjs(), 'day')) return;
    Drag.setDragStart(day);
    Drag.setDragEnd(null);
  };
  
export const handleDragEnter = (Drag:Drag,day: Dayjs) => {
    if (!Drag.dragStart || day.isBefore(dayjs(), 'day')) return;
    Drag.setDragEnd(day);
  };
  
export const handleDragEnd = (Drag:Drag,Common:Common) => {
    if (Drag.dragStart && Drag.dragEnd) {
      const start = Drag.dragStart.isBefore(Drag.dragEnd) ? Drag.dragStart : Drag.dragEnd;
      const end = Drag.dragStart.isBefore(Drag.dragEnd) ? Drag.dragEnd : Drag.dragStart;
      
      Common.setStartDate(start.format("YYYY-MM-DD HH:mm"));
      Common.setEndDate(end.format("YYYY-MM-DD HH:mm"));
      Common.setCreatedAt(dayjs().format("YYYY-MM-DD HH:mm"));
      Common.setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"));
      Common.setState("Pending");
      Common.setCriterebuy("any");
      Common.setPrixdecritere(0);
      Common.setPrixtotal(0);
      Common.setPercent(0);
      Common.setPrixtotalreduit(0);
      Common.setTitle('');
      Common.setSelectedEvent(null);
      Common.setShowForm(true);
    }
    Drag.setDragStart(null);
    Drag.setDragEnd(null);
  };