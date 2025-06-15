"use client"

import { getMonth } from "./utils/util";
import React, { useState, useContext, useEffect, use } from "react";
import SideBar from "./sideBar";
import CalendarHeader from "./calendarHeader";
import { GlobalContext } from "./context/GlobalContext";
import WeeklyCalendar from "./calendars/weeklyCalendar";
import MonthlyCalendar from "./calendars/MonthCalendar";
import CalendarPage from "./planification/planning";
import Calendar from "./calendars/dailyCalendar";
import dayjs from "dayjs";
import 'dayjs/locale/en-gb';
dayjs.locale('en');


export default function Home() {
  const [currentMonth , setCurrentMonth] = useState(getMonth())
  const {monthIndex, showEventModel} = useContext(GlobalContext)
  const {calendarPage, setCalendarPage} = useContext(GlobalContext)

  const {dayCalendar, setDayCalendar} = useContext(GlobalContext);
  const {monthCalendar, setMonthCalendar} = useContext(GlobalContext);
  const {weekCalendar, setWeekCalendar} = useContext(GlobalContext);



  useEffect ( () => {
    setCurrentMonth(getMonth(monthIndex))
  }, [monthIndex])


  //{showEventModel && <EventModel/>}

  return (
    <div >   
      <div className="min-h-screen flex flex-col">
        <CalendarHeader/>
       
        <div className="flex flex-1 flex-col lg:flex-row">
          <SideBar/>
          { monthCalendar && <MonthlyCalendar/>}
          {  dayCalendar &&  <Calendar/>}
          {  weekCalendar &&  <WeeklyCalendar/>} 
          {  calendarPage &&  <CalendarPage/>}
        </div>
      </div>
    </div>
  );
}