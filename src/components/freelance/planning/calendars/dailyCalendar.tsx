import React, { useState, useContext, useMemo, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Event1 from '../Event';
import EventForm from '../forms/eventform';
import Image from 'next/image';
import { GlobalContext } from '../context/GlobalContext';
import { Event } from '../interfaces/types';
import { formError } from '../interfaces/types';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';


const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [showEventForm1, setShowEventForm1] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<Dayjs | null>(null);
    const [dragEnd, setDragEnd] = useState<Dayjs | null>(null);
    const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
    const { events, setEvents } = useContext(GlobalContext);
    const [title, setTitle] = useState<string>('');
    const [createdAt, setCreatedAt] = useState("");
    const [updatedAt, setUpdatedAt] = useState("")
    const [state, setState] = useState("")
    const [criterebuy, setCriterebuy] = useState<string | null>("any")
    const [prixdecritere, setPrixdecritere] = useState<number | null>(0)
    const [prixtotal, setPrixtotal] = useState<number | null>(null)
    const [prixtotalreduit, setPrixtotalreduit] = useState<number | null>(null)
    const [percent, setPercent] = useState<number | null>(0)
    

    const [start, setStart] = useState<Dayjs | null>(null);
    const [end, setEnd] = useState<Dayjs | null>(null);
    const { MonthID, setMonthID } = useContext(GlobalContext);
    const [errors, setErrors] = useState<formError>({
        endDate: '',
        startDate: ''
    })
    const [showAlert, setShowAlert] = useState(false);
     const driverId = "907b3dca-a29a-4b3e-961c-7d44c5e3d7d2"
     const Daily={
        setStart,
        setEnd,
        setState,
        setCriterebuy,
        setPrixdecritere,
        setPrixtotal,
        setPercent,
        setPrixtotalreduit,
        setTitle,
        setShowEventForm1,
      }
      
     const Drag={
        setDragStart,
        setDragEnd,
        dragStart,
        dragEnd,
      }
    const [tarif, setTarif] = useState<number | null>(null)


    const handleClose = () => {
        setShowAlert(false);
        setErrors({
            endDate: '',
            startDate: ''
        })
        setShowEventForm1(false)
    };



    //édition d'évènement
    const editEvent = (id: number, updatedEvent: Event) => {
        setEventsMonth(eventsMonth.map(event => (event.PlaningId === id ? { ...updatedEvent, id } : event)));
        setEventToEdit(null);
        setShowEventForm1(false);
    };

    const deleteEvent1 = async (id: any) => {
        try {
            const response = await fetch(`http://localhost:8080/planing/freelance/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setTitle('');
                setCreatedAt("")
                setUpdatedAt("")
                setEnd(null)
                setStart(null)
                setCriterebuy(null)
                setPrixdecritere(null)
                setPrixtotal(null)
                setPercent(null)
                setPrixtotalreduit(null)
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    request: "erreur l'ors de lors de la suppression de l'enregistrement, peut etre un problème d'indisponibilité du serveur",
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
        //setEventsMonth(eventsMonth.filter(event => event.id !== id));
    };


    const deleteEvent = (id: number) => {
        setEventsMonth(eventsMonth.filter(event => event.PlaningId !== id));
    };

    const handleEdit = (event: Event) => {
        
        setEventToEdit(event);
        setShowEventForm1(true);
    };

    const handleClearEdit = () => {
        setTitle('')
        setStart(null)
        setEnd(null)
        setCriterebuy("hour")
        setPrixdecritere(0)
        setPercent(0)
        setPrixtotal(0)
        setPrixtotalreduit(0)
        setEventToEdit(null);
        setShowEventForm1(false);
    };

    const prevDay = () => {
        setCurrentDate(currentDate.subtract(1, 'day'));
    };

    const nextDay = () => {
        setCurrentDate(currentDate.add(1, 'day'));
    };

    const getEventDaysBetween = (event: Event): string[] => {
        const start: Dayjs = dayjs(event.startDateTime);
        const end: Dayjs = dayjs(event.endDateTime);

        if (start.isSame(end, 'day')) {
            return [start.format('YYYY-MM-DD')];
        }

        return [];
    };

    const getSingleDayEvents = () => {
        const singleDayEvents: Event[] = [];

        eventsMonth.forEach((event) => {
            const eventDays = getEventDaysBetween(event);
            if (eventDays.length === 1) {
                singleDayEvents.push(event);
            }
        });

        return singleDayEvents;
    };

    const singleDayEvents = useMemo(() => getSingleDayEvents(), [eventsMonth]);

    const singleDayEventsToEventType = (): Event[] => {
        return singleDayEvents.map((event) => ({
            PlaningId: event.PlaningId,
            driverId : event.driverId,
            title: event.title,
            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            state: event.state,
            criterebuy: event.criterebuy,
            prixdecritere: event.prixdecritere,
            prixtotal: event.prixtotal,
            percent: event.percent,
            prixtotalreduit: event.prixtotalreduit
        }));
    };
    const singleDayEventTypes = useMemo(() => singleDayEventsToEventType(), [singleDayEvents]);

    setEvents(singleDayEventTypes)

    const filteredEvents = events.filter(event =>
        dayjs(event.startDateTime).isSame(currentDate, 'day')
    );


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (start && end && title && criterebuy && prixtotal && prixdecritere && percent != null && prixtotalreduit) {

            const startDateTime = currentDate.set('hour', start.hour()).set('minute', start.minute()).format('YYYY-MM-DD HH:mm');
            const endDateTime = currentDate.set('hour', end.hour()).set('minute', end.minute()).format('YYYY-MM-DD HH:mm');

            const startDate1 = dayjs(startDateTime);
            const endDate1 = dayjs(endDateTime);
            const True_currentDate = dayjs().startOf('day');
            const start1 = currentDate.startOf('day')

            if (eventToEdit?.PlaningId) {
                if (startDate1.isBefore(endDate1)) {
                    if (True_currentDate.isBefore(start1) || True_currentDate.isSame(start1)) {
                        const newEvent: Event = {
                            PlaningId: eventToEdit?.PlaningId,
                            driverId : eventToEdit.driverId,
                            title: title,
                            startDateTime: currentDate.set('hour', start.hour()).set('minute', start.minute()).format('YYYY-MM-DD HH:mm'),
                            endDateTime: currentDate.set('hour', end.hour()).set('minute', end.minute()).format('YYYY-MM-DD HH:mm'),
                            createdAt: createdAt,
                            updatedAt: updatedAt,
                            state: state,
                            criterebuy: criterebuy,
                            prixdecritere: prixdecritere,
                            prixtotal: prixtotal,
                            percent: percent,
                            prixtotalreduit: prixtotalreduit
                        };
                        editEvent(eventToEdit?.PlaningId, newEvent);

                        try {
                            const response = await fetch(`http://localhost:8080/planing/freelance/update/${eventToEdit.PlaningId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    title: title,
                                    startDateTime: startDateTime,
                                    endDateTime: endDateTime,
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
                                setTitle('');
                                setStart(null);
                                setEnd(null);
                                setTitle('');
                                setCreatedAt("")
                                setUpdatedAt("")
                                setCriterebuy(null)
                                setPrixdecritere(null)
                                setPrixtotal(null)
                                setPercent(null)
                                setPrixtotalreduit(null)
                                setShowEventForm1(false)
                                setTarif(null)
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
                        setTitle('');
                        setStart(null);
                        setEnd(null);
                        setShowEventForm1(false)
                        setTitle('');
                        setCreatedAt("")
                        setUpdatedAt("")
                        setCriterebuy(null)
                        setPrixdecritere(null)
                        setPrixtotal(null)
                        setPercent(null)
                        setPrixtotalreduit(null)
                    } else {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            startDate: "La de debut doit etre après la date d'aujourd'hui ou etre la meme date",
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
                    if (True_currentDate.isBefore(start1) || True_currentDate.isSame(start1)) {
                        const val: number = MonthID
                        setMonthID(val + 1);
                        setEventsMonth([...eventsMonth, {
                            PlaningId: MonthID,
                            driverId : driverId,
                            title: title,
                            startDateTime: startDateTime,
                            endDateTime: endDateTime,
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
                                    driverId : driverId,
                                    startDateTime: startDateTime,
                                    endDateTime: endDateTime,
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
                                setTitle('');
                                setStart(null);
                                setEnd(null);
                                setTitle('');
                                setCreatedAt("")
                                setUpdatedAt("")
                                setCriterebuy(null)
                                setPrixdecritere(null)
                                setPrixtotal(null)
                                setPercent(null)
                                setPrixtotalreduit(null)
                                setShowEventForm1(false)
                                setTarif(null)
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
                        setTitle('');
                        setStart(null);
                        setEnd(null);
                        setTitle('');
                        setCreatedAt("")
                        setUpdatedAt("")
                        setCriterebuy(null)
                        setPrixdecritere(null)
                        setPrixtotal(null)
                        setPercent(null)
                        setPrixtotalreduit(null)
                        setShowEventForm1(false)
                        setTarif(null)
                    } else {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            startDate: "La de debut doit etre après la date d'aujourd'hui ou etre la meme date",
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

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setStart(dayjs(eventToEdit.startDateTime));
            setEnd(dayjs(eventToEdit.endDateTime));
        } else {
            setTitle('');
            setStart(null);
            setEnd(null);
            setTarif(null)
        }
    }, [eventToEdit]);

    useEffect(() => {
        if (prixdecritere && start && end && percent != null) {
            const startDateTime = currentDate.set('hour', start.hour()).set('minute', start.minute()).format('YYYY-MM-DD HH:mm');
            const endDateTime = currentDate.set('hour', end.hour()).set('minute', end.minute()).format('YYYY-MM-DD HH:mm');

            if (criterebuy === "hour") {
                const total = ((dayjs(endDateTime).diff(startDateTime) / 3600000) * prixdecritere).toFixed(2);
                setPrixtotal(parseFloat(total))
                if (prixtotal) {
                    setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
                }

            } else if (criterebuy === "day") {
                const total = (((dayjs(endDateTime).diff(startDateTime) / 3600000) / 24) * prixdecritere).toFixed(2);
                setPrixtotal(parseFloat(total))
                if (prixtotal) {
                    setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
                }
            } else if (criterebuy === "km") {
                setPrixtotal(prixdecritere);
                if (prixtotal) {
                    setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
                }
            }
        }
    }, [prixdecritere, prixtotal, start, end, criterebuy, percent, prixtotalreduit]);

    const handleTimeSlotClick = (hour:any) => {
        const selectedTime = currentDate.hour(hour).minute(0);
        setStart(selectedTime);
        setPercent(0)
        setCriterebuy("hour")
        setShowEventForm1(true);
      };

    return (
        <div className="flex-1 p-4 text">
            <div className="flex justify-center items-center mb-4">
            <div className='flex gap-3'>
                <ChevronDoubleLeftIcon className='w-5 h-5 cursor-pointer hover:w-6 hover:h-6' onClick={prevDay}/>
                <h2 className="font-bold">{currentDate.format('DD MMMM YYYY')}</h2>
                <ChevronDoubleRightIcon className='w-5 h-5 cursor-pointer hover:w-6 hover:h-6' onClick={nextDay}/>
            </div>
            </div>
                <EventForm
                    isOpen={showEventForm1}
                    handleClose={handleClose}
                    eventToEdit={eventToEdit}
                    clearEdit={handleClearEdit}
                    handleSubmit={handleSubmit}

                    title={title}
                    start={start}
                    end={end}

                    setTitle={(setTitle)}
                    setStart={setStart}
                    setEnd={setEnd}
                    criterebuy={criterebuy}
                    setCriterebuy={setCriterebuy}
                    prixdecritere={prixdecritere}
                    setPrixdecritere={setPrixdecritere}
                    prixtotal={prixtotal}
                    percent={percent}
                    setPercent={setPercent}
                    prixtotalreduit={prixtotalreduit}
                />
            <div>
                {showAlert && (
                    <div className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                &#8203;
                            </span>
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{errors.endDate}</h3>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{errors.startDate}</h3>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={handleClose}
                                    >
                                        fermer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div className="flex flex-col">
            {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className={`flex border-b  ${dayjs().hour(23).minute(0).format('HH [h] mm')>='23 h 00' ? 'overflow-hidden' : ''}`}>
                    <div className={`w-16 text-right pr-2 py-1 ${
                            currentDate.hour(hour) < dayjs() ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'
                        }`}>
                    {dayjs().hour(hour).minute(0).format('HH [h] mm')}
                    </div>
                    <div 
                        className={`flex-1 relative py-2 ${
                            currentDate.hour(hour) < dayjs() ? 'cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'
                        }`}
                        onClick={() => currentDate.hour(hour) >= dayjs() && handleTimeSlotClick(hour)}
                        >
                        {filteredEvents
                            .filter(event => {
                            const eventStart = dayjs(event.startDateTime);
                            const eventEnd = dayjs(event.endDateTime);
                            return (
                                eventStart.hour() === hour ||
                                (eventStart.hour() < hour && eventEnd.hour() > hour)
                            );
                            })
                            .map((event, index) => (
                            <div key={index} className="absolute w-full" style={{ top: `${dayjs(event.startDateTime).minute()}px` }}>
                                <Event1 event={event} onEdit={handleEdit} onDelete={deleteEvent} />
                            </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className='my-4 flex items-center justify-end'>
                <button
                    className="bg-primary text-white px-2 py-2 rounded-md flex items-center hover:bg-primary-dark transition-colors duration-300"
                    onClick={() => handleTimeSlotClick(0)}
                >

                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add a slot
                </button>
            </div>
        </div>
    );
};

export default Calendar;