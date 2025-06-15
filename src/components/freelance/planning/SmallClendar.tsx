import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { getMonth } from "./utils/util";
import { ChevronDoubleLeftIcon,ChevronDoubleRightIcon,
 } from '@heroicons/react/24/outline'
import { GlobalContext } from "./context/GlobalContext";
import { Dayjs } from "dayjs";
import { Event } from "./interfaces/types";

export default function SmallCalendar() {

  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  const { setSmallCalendarMonth, setDaySelected, daySelected } = useContext(GlobalContext)
  const { eventsMonth, setEventsMonth } = useContext(GlobalContext);



  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIndex));
  }, [currentMonthIndex]);


  useEffect(() => {
    setCurrentMonthIndex(monthIndex)
  }, [monthIndex])

  function handlePrevMonth() {
    setCurrentMonthIndex(currentMonthIndex - 1)
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setCurrentMonthIndex(currentMonthIndex + 1)
    setMonthIndex(monthIndex + 1);
  }

  function getDayclass(day: Dayjs) {
    const format = "DD-MM-YY"
    const nowDay = dayjs().format(format)
    const currentDay = day.format(format)
    const slctDay = daySelected && daySelected.format(format)
  
    let classes = ""
  
    // Vérifier si le jour est antérieur à aujourd'hui
    if (day.isBefore(dayjs(), 'day')) {
      classes += "text-gray-400 " // Griser les jours passés
    }
  
    if (nowDay === currentDay) {
      classes += "bg-blue-500 rounded-full text-white"
    } else if (currentDay == slctDay) {
      classes += "bg-blue-100 rounded-full text-blue-600 font-bold"
    }
  
    return classes
  }

  //recuperation de jour les jours associés à un évènement donné 
  const getEventDaysBetween = (event: Event): string[] => {

    const start: Dayjs = dayjs(event.startDateTime);
    const end: Dayjs = dayjs(event.endDateTime);
    const days: string[] = [];

    let currentDay: Dayjs = start.clone();
    while (currentDay.isBefore(end, 'day') || currentDay.isSame(end, 'day')) {
      days.push(currentDay.format('YYYY-MM-DD'));
      currentDay = currentDay.add(1, 'day');
    }

    return days;
  };

  //recuperation des évènements associés à un jour donné
  const getEventsForDate = (day: string) => {
    return eventsMonth.some((event) => {
      const eventDays = getEventDaysBetween(event);
      return eventDays.includes(day);
    });
  };

  function getDayClassNames(day : string) {

    let classNames = "";

    const result = getEventsForDate(day)

    if (result) {
      classNames += "bg-small rounded-full text-white"; 
    }
    return classNames
  }


  return (
    <div className="mt-9 text">
      <header className="flex justify-between">

        <p className=" text-gray-500 font-bold">
          {dayjs(new Date(dayjs().year(), currentMonthIndex)).format(
            "MMMM YYYY"
          )}
        </p>
        <div className='flex gap-3'>
          <ChevronDoubleLeftIcon className='w-5 h-5 cursor-pointer hover:w-6 hover:h-6' onClick={handlePrevMonth}/>
          <ChevronDoubleRightIcon className='w-5 h-5 cursor-pointer hover:w-6 hover:h-6' onClick={handleNextMonth}/>
        </div>
      </header>

      <div className="grid grid-cols-7 grid-rows-6">
        {currentMonth[0].map((day: any, i: any) => (
          <span key={i} className="text-sm py-1 text-center">
            {day.format('dd').charAt(0)}
          </span>

        ))}
        {currentMonth.map((row: any, i: any) => (
          <React.Fragment key={i}>
            {row.map((day: any, index: any) => (
              <button key={index}
                className={`py-1 w-full ${getDayclass(day)} ${getDayClassNames(day.format('YYYY-MM-DD'))} `}
              >
                <span className="text-sm">
                  {day.format("D")}
                </span>
              </button>
            ))}
          </React.Fragment>
        ))}

      </div>

    </div>
  );
}
