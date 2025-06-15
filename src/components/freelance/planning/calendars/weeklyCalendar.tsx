import React, { useContext, useState, KeyboardEvent, useEffect } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { GlobalContext } from '../context/GlobalContext';
import { Dayjs } from 'dayjs';
import { Event } from '../interfaces/types';
import { formError } from '../interfaces/types';
import CommonFom from '../forms/CommonFom';
import Alert from '../alerts/alert';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
dayjs.extend(localizedFormat);
import { handleDayClick,handleDragEnd,handleDragEnter,handleDragStart,handleAdd } from '../utils/functions';

const WeeklyCalendar: React.FC = () => {

    const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
    const { MonthID, setMonthID } = useContext(GlobalContext);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().startOf('week').format('YYYY-MM-DD'));
    const [showForm, setShowForm] = useState<boolean>(false);
    const [weekOffset, setWeekOffset] = useState<number>(0);
    const [createdAt, setCreatedAt] = useState("");
    const [updatedAt, setUpdatedAt] = useState("")
    const [state, setState] = useState<string>("")
    const [criterebuy, setCriterebuy] = useState<string | null>(null)
    const [prixdecritere, setPrixdecritere] = useState<number | null>(null)
    const [prixtotal, setPrixtotal] = useState<number | null>(null)
    const [prixtotalreduit, setPrixtotalreduit] = useState<number | null>(null)
    const [percent, setPercent] = useState<number | null>(null)
    const [title, setTitle] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const driverId = "907b3dca-a29a-4b3e-961c-7d44c5e3d7d2"

    const [dragStart, setDragStart] = useState<Dayjs | null>(null);
    const [dragEnd, setDragEnd] = useState<Dayjs | null>(null);

    const [errors, setErrors] = useState<formError>({
        endDate: '',
        startDate: ''
    })
    const [showAlert, setShowAlert] = useState(false);


    const handleClose = () => {
        setShowAlert(false);
        setErrors({
            endDate: '',
            startDate: ''
        })
        setShowForm(false);
    };
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => dayjs().startOf('week').add(i + weekOffset * 7, 'day'));

    const handleAvailabilityClick = (event: Event) => {
        setSelectedEvent(event);
        setTitle(event.title);
        setStartDate(dayjs(event.startDateTime).format('YYYY/MM/DD HH:mm'));
        setEndDate(dayjs(event.endDateTime).format('YYYY/MM/DD HH:mm'));
        setCriterebuy(event.criterebuy)
        setPrixtotal(event.prixtotal)
        setPrixdecritere(event.prixdecritere)
        setShowForm(true);

    };

    const handleKeyPress = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
          handleFormSubmit();
        }
      };

    const handleFormSubmit = async () => {
        if (title && startDate && criterebuy && prixtotal && prixdecritere && endDate && percent != null && prixtotalreduit) {

            const startDate1 = dayjs(startDate as string);
            const endDate1 = dayjs(endDate as string);
            const currentDate = dayjs().startOf('day')
            const start = dayjs(startDate).startOf('day')

            if (selectedEvent) {
                if (startDate1.isBefore(endDate1)) {
                    if (currentDate.isBefore(start) || currentDate.isSame(start)) {
                        setEventsMonth(eventsMonth.map(av => av.PlaningId === selectedEvent.PlaningId ? {
                            ...av,
                            title: title,
                            startDateTime: startDate,
                            endDateTime: endDate,
                            createdAt: createdAt,
                            updatedAt: updatedAt,
                            state: state,
                            criterebuy: criterebuy,
                            prixdecritere: prixdecritere,
                            prixtotal: prixtotal,
                            percent: percent,
                            prixtotalreduit: prixtotalreduit

                        } : av));

                        try {
                            const response = await fetch(`http://localhost:8080/planing/freelance/update/${selectedEvent.PlaningId}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                title: title,
                                startDateTime: startDate,
                                endDateTime: endDate,
                                createdAt: createdAt,
                                updatedAt: updatedAt,
                                state: state,
                                criterebuy: criterebuy,
                                prixdecritere: prixdecritere,
                                prixtotal: prixtotal,
                                percent: percent,
                                prixtotalreduit: prixtotalreduit
                              }),
                            });
              
                            if (response.ok) {
                              setShowForm(false);
                              setSelectedEvent(null)
              
                              setTitle('');
                              setStartDate('');
                              setCreatedAt("")
                              setUpdatedAt("")
                              setEndDate('');
                              setCriterebuy(null)
                              setPrixdecritere(null)
                              setPrixtotal(null)
                              setPercent(null)
                              setPrixtotalreduit(null)
                            } else {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                request: "erreur l'ors de l'envoi au serveur, peut etre un problème d'indisponibilité du serveur",
                              }));
                              setShowAlert(true);
                            }
                          } catch (error) {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              request: "erreur de connexion au serveur de base, peut etre un problène de panne du serveur",
                            }));
                            setShowAlert(true);
                          }
              


                        setShowForm(false);
                        setSelectedEvent(null)
                        setTitle('');
                        setStartDate('');
                        setCreatedAt("")
                        setUpdatedAt("")
                        setEndDate('');
                        setCriterebuy(null)
                        setPrixdecritere(null)
                        setPrixtotal(null)
                        setPercent(null)
                        setPrixtotalreduit(null)
                    } else {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            startDate: "La date de debut doit etre après la date d'aujourd'hui ou etre la meme date",
                        }));
                        setShowAlert(true);
                    }
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        endDate: "La date de fin doit être après la date de début",
                    }));
                    setShowAlert(true);
                }

            } else {
                if (startDate1.isBefore(endDate1)) {
                    if (currentDate.isBefore(start) || currentDate.isSame(start)) {
                        const val = MonthID;
                        setMonthID(val + 1)
                        setEventsMonth([...eventsMonth, { 
                            PlaningId: MonthID,
                            driverId : driverId,
                            title: title,
                            startDateTime: startDate,
                            endDateTime: endDate,
                            createdAt: createdAt,
                            updatedAt: updatedAt,
                            state: state,
                            criterebuy: criterebuy,
                            prixdecritere: prixdecritere,
                            prixtotal: prixtotal,
                            percent: percent,
                            prixtotalreduit: prixtotalreduit
                       
                        }]);


                        try {
                            const response = await fetch('http://localhost:8080/planing/freelance/add', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                title: title,
                                driverId: driverId,
                                startDateTime: startDate,
                                endDateTime: endDate,
                                createdAt: createdAt,
                                updatedAt: updatedAt,
                                state: state,
                                criterebuy: criterebuy,
                                prixdecritere: prixdecritere,
                                prixtotal: prixtotal,
                                percent: percent,
                                prixtotalreduit: prixtotalreduit
                              }),
                            });
              
                            if (response.ok) {
                              setShowForm(false);
                              setSelectedEvent(null)
              
                              setTitle('');
                              setStartDate('');
                              setCreatedAt("")
                              setUpdatedAt("")
                              setEndDate('');
                              setCriterebuy(null)
                              setPrixdecritere(null)
                              setPrixtotal(null)
                              setPercent(null)
                              setPrixtotalreduit(null)
                            } else {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                request: "erreur l'ors de l'envoi au serveur, peut etre un problème d'indisponibilité du serveur",
                              }));
                              setShowAlert(true);
                            }
                          } catch (error) {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              request: "erreur de connexion au serveur de base, peut etre un problène de panne du serveur",
                            }));
                            setShowAlert(true);
                          }
              
                        setShowForm(false);

                        setSelectedEvent(null)
                        setTitle('');
                        setStartDate('');
                        setCreatedAt("")
                        setUpdatedAt("")
                        setEndDate('');
                        setCriterebuy(null)
                        setPrixdecritere(null)
                        setPrixtotal(null)
                        setPercent(null)
                        setPrixtotalreduit(null)
                    } else {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            startDate: "La date de debut doit etre après la date d'aujourd'hui ou etre la meme date",
                        }));
                        setShowAlert(true);
                    }
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        endDate: "La date de fin doit être après la date de début",
                    }));
                    setShowAlert(true);
                }

            }

        }
    };

    const handleDelete1 = async (id: any) => {

        try {
          const response = await fetch(`http://localhost:8080/planing/freelance/delete/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            setShowForm(false);
            setSelectedEvent(null);
            setTitle('');
            setStartDate('');
            setCreatedAt("")
            setUpdatedAt("")
            setEndDate('');
            setCriterebuy(null)
            setPrixdecritere(null)
            setPrixtotal(null)
            setPercent(null)
            setPrixtotalreduit(null)
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              request: "erreur l'ors de l'envoi au serveur, peut etre un problème d'indisponibilité du serveur",
            }));
            setShowAlert(true);
          }
        } catch (error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            request: "erreur de connexion au serveur de base, peut etre un problène de panne du serveur",
          }));
          setShowAlert(true);
        }
    
        //setEventsMonth(eventsMonth.filter(ev => ev.id !== id));
    
      };
    

    const handleDelete = (id: number) => {
        setEventsMonth(eventsMonth.filter(av => av.PlaningId !== id));
        setShowForm(false);
        setSelectedEvent(null)
        setTitle('');
            setStartDate('');
            setCreatedAt("")
            setUpdatedAt("")
            setEndDate('');
            setCriterebuy(null)
            setPrixdecritere(null)
            setPrixtotal(null)
            setPercent(null)
            setPrixtotalreduit(null)
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedEvent(null);
        setTitle('');
        setStartDate('');
        setCreatedAt("")
        setUpdatedAt("")
        setEndDate('');
        setCriterebuy(null)
        setPrixdecritere(null)
        setPrixtotal(null)
        setPercent(null)
        setPrixtotalreduit(null)
      }

    // definition des couleurs des évènements
    const colors = [
        'bg-red-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
    ];

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

    const getEventsForDate = (date: string) => {
      
        return eventsMonth.flatMap((event, index) => {
            const eventDays = getEventDaysBetween(event);
            if (eventDays.includes(date)) {
                return [
                    {
                        ...event,
                        colorClass: colors[index % colors.length],
                    },
                ];
            }
            return [];
        });
    };

    useEffect(() => {
        if (prixdecritere && startDate && endDate && percent != null) {
          if (criterebuy === "hour") {
            const total = ((dayjs(endDate).diff(startDate) / 3600000) * prixdecritere).toFixed(2);
            setPrixtotal(parseFloat(total))
            if (prixtotal) {
              setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
         
             
            
            }
    
          } else if (criterebuy === "day") {
            const total = (((dayjs(endDate).diff(startDate) / 3600000) / 24) * prixdecritere).toFixed(2);
            setPrixtotal(parseFloat(total))
            if (prixtotal) {
              if(percent){
                
              }
              setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
            }
          } else if (criterebuy === "km" || criterebuy === "any") {
            setPrixtotal(prixdecritere);
            if (prixtotal) {
              setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
            }
          }
        }
      }, [prixdecritere, prixtotal, startDate, endDate, criterebuy, percent, prixtotalreduit]);
    
      const Common={
        setStartDate,
        setEndDate,
        setCreatedAt,
        setUpdatedAt,
        setState,
        setCriterebuy,
        setPrixdecritere,
        setPrixtotal,
        setPercent,
        setPrixtotalreduit,
        setTitle,
        setSelectedEvent,
        setShowForm,
      }
      const Drag={
        setDragStart,
        setDragEnd,
        dragStart,
        dragEnd,
      }

    return (
        <div className='flex-1 text' >
          <div className="p-4">
              <div className="flex justify-center mb-4">
                  <div className='flex gap-3'>
                      <ChevronDoubleLeftIcon className='w-5 h-5 cursor-pointer hover:w-6 hover:h-6' onClick={() => {
                      setWeekOffset(weekOffset - 1);
                      setSelectedDate(dayjs(selectedDate).subtract(7, 'days').format('YYYY-MM-DD'));
                  }}/>
                      <h2 className="font-bold">{dayjs(selectedDate).format('DD MMMM YYYY')} - {dayjs(selectedDate).add(6, 'day').format('DD MMMM YYYY')}</h2>
                      <ChevronDoubleRightIcon className='w-5 h-5 cursor-pointer hover:w-6 hover:h-6' onClick={() => {
                          setWeekOffset(weekOffset + 1);
                          setSelectedDate(dayjs(selectedDate).add(7, 'days').format('YYYY-MM-DD'));
                      }}/>
                  </div>
              </div>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
                  {daysOfWeek.map(day => (
                      <div key={day.format('YYYY-MM-DD')} 
                      className={`border p-2 items-center flex justify-center w-40 
                        ${dragStart && dragEnd && day.isBetween(dragStart, dragEnd, null, '[]') ? 'bg-blue-100' : ''}
                        `}
                      onClick={() => handleDayClick(Common,day )}
                      onMouseDown={() => handleDragStart(Drag,day)}
                      onMouseEnter={() => handleDragEnter(Drag,day)}
                      onMouseUp={() =>handleDragEnd(Drag,Common)}

                      >
                          <h3 
                          className={`${
                            day.isSame(dayjs(), 'day')
                              ? 'font-bold text-blue-600'
                              : day.isBefore(dayjs(), 'day')
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                          >{day.format('dddd D MMM')}</h3>
                          <ul>
                              {getEventsForDate(day.format('YYYY-MM-DD')).map((event, index) => (
                                  <li
                                      key={index}
                                      className="p-2 mb-1 bg-blue-200 rounded"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          handleAvailabilityClick(event);
                                      }}
                                  ><button
                                      className="flex items-center w-full  hover:bg-blue-300 group-hover:bg-blue-300"
                                  >
                                          <span className="mr-2.5 transition-flex duration-300 flex-0 group-hover:flex-1">
                                              {event.title}
                                          </span>
                                      </button></li>
                              ))}
                          </ul>
                      </div>
                  ))}
              </div>
              <button
                className="mt-4 bg-primary flex text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={() => handleAdd(Common)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add a slot
              </button>
              <CommonFom
                isOpen={showForm}
                handleClose={handleClose}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setCriterebuy={setCriterebuy}
                criterebuy={criterebuy}
                setPercent={setPercent}
                percent={percent}
                setPrixtotal={setPrixtotal}
                prixtotal={prixtotal}
                prixtotalreduit={prixtotalreduit}
                title={title}
                prixdecritere={prixdecritere}
                setPrixdecritere={setPrixdecritere}
                setTitle={setTitle}
                handleCancel={handleCancel}
                handleDelete={handleDelete}
                selectedEvent={selectedEvent}
                handleKeyPress={handleKeyPress}
                handleFormSubmit={handleFormSubmit}
              />
          </div>
      <div>
        {showAlert && (
          <Alert
           errors={errors}
           handleClose={handleClose}
          />
        )}

            </div>
        </div>
    );
};

export default WeeklyCalendar;
