import React, { useContext } from 'react';
import { CalendarDaysIcon} from '@heroicons/react/24/outline'
import { GlobalContext } from './context/GlobalContext';
import dayjs from 'dayjs';

export default function CalendarHeader() {

  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  const {calendarPage, setCalendarPage} = useContext(GlobalContext)

  const { dayCalendar, setDayCalendar } = useContext(GlobalContext);
  const { monthCalendar, setMonthCalendar } = useContext(GlobalContext);
  const {weekCalendar, setWeekCalendar} = useContext(GlobalContext);

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
  }

  return (
    <header className="px-4 text py-2 flex items-center justify-between">
      <div className="grid grid-cols-3">
        <div className='flex items-center justify-center mr-4'>
          <CalendarDaysIcon className='w-5 h-5'/>
          <h1 className="mr-10 font-medium">Plan</h1>
          <button
          className="border rounded p-2 hover:text-white hover:bg-primary"
          onClick={handleReset}
        >
          Today
        </button>
        </div>
        <div className='flex items-center justify-center gap-3'>
          <h2 className="font-semibold">
            {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
          </h2>
        </div>
      </div>
      <div className="flex items-center">
      <button
          className={`border rounded py-2 px-4 mr-2 ${
            dayCalendar ? 'bg-primary text-white' : ''
          }`}
          onClick={() => {
            setMonthCalendar(false);
            setWeekCalendar(false);
            setCalendarPage(false)
            setDayCalendar(true);
          }}
        >
          Day
        </button>
      <button
          className={`border rounded py-2 px-4 mr-2 ${
            weekCalendar ? 'bg-primary text-white' : ''
          }`}
          onClick={() => {
            setDayCalendar(false);
            setMonthCalendar(false);
            setCalendarPage(false)
            setWeekCalendar(true)
          }}
        > 
          Week
        </button>
       
        <button
          className={`border rounded py-2 px-4 mr-2 ${
            monthCalendar ? 'bg-primary text-white' : ''
          }`}
          onClick={() => {
            setDayCalendar(false);
            setWeekCalendar(false)
            setCalendarPage(false)
            setMonthCalendar(true);
          }}
        >
          Month
        </button>
        <button
          className={`border rounded py-2 px-4 mr-2 ${
            calendarPage ? 'bg-primary text-white' : ''
          }`}
          onClick={() => {
            setDayCalendar(false);
            setWeekCalendar(false)
            setMonthCalendar(false);
            setCalendarPage(true)
          }}
        >
          Plannification
        </button>
      </div>
    </header>
  );
}











