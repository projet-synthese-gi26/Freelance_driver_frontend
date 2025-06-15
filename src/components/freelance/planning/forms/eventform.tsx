import { FC, useState, useEffect, useContext, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { GlobalContext } from '../context/GlobalContext';
import { Event } from '../interfaces/types';
import Modal from '@/components/modal/modal';
import { PercentLevel } from '../interfaces/types';
import { pricingMethod } from '@/data/Structure';

interface EventFormProps {
  eventToEdit: Event | null;
  clearEdit: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  start: Dayjs | null;
  end: Dayjs | null;
  setTitle: (title: string) => void;
  setStart: (start: Dayjs | null) => void;
  setEnd: (end: Dayjs | null) => void;
  prixdecritere: number | null;
  prixtotalreduit: number | null;
  percent: number | null;
  prixtotal: number | null;
  criterebuy: string | null;
  setPrixdecritere: (p: number | null) => void
  setCriterebuy: (p: string | null) => void
  setPercent: (p: number) => void
  isOpen:boolean
  handleClose:()=>void
}

const EventForm: FC<EventFormProps> = ({isOpen,handleClose, percent, criterebuy, setCriterebuy, prixdecritere, setPrixdecritere, prixtotal, prixtotalreduit, setPercent, setStart, setEnd, setTitle, handleSubmit, eventToEdit, clearEdit, title, start, end }) => {

  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <div className="bg-opacity-50 flex justify-center items-center text">
            <div className="p-8 rounded-md  w-full">
              <h2 className="title font-bold mb-6 text-planining text-center">{eventToEdit ? 'Update' : 'Add'} a slot</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="font-medium">Personal keyword</span>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='enter your keyword'
                    className="mt-1 text-center block w-full rounded-md border  focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className=" font-medium">Payment option</span>
                  <select
                    required
                    value={criterebuy ?? ""}
                    onChange={(e) => setCriterebuy(e.target.value)}
                    className="mt-1 text-center block w-full rounded-md border  focus:outline-none"
                  >
                    {pricingMethod.map((pricing,index) => (
                      <option key={index} value={pricing.value}>
                        {(pricing.value!="day" && pricing.value!="any") &&(
                          <span>{pricing.label}</span>
                        )}
                      </option>
                    ))}
                  </select>
                </label>
            <label className="block">
              <span className="font-medium">Start time</span>
              <input
                type="time"
                value={start?.format('HH:mm')}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  const newStart = dayjs()
                    .hour(parseInt(hours))
                    .minute(parseInt(minutes));
                  setStart(newStart);
                  if (end && newStart.isAfter(end)) {
                    setEnd(newStart);
                  }
                }}
                required
                className="mt-1 text-center block w-full rounded-md border  focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-medium">Percentage reduction</span>
              <select
                required
                value={percent ?? ""}
                onChange={(e) => setPercent(parseFloat(e.target.value))}
                className="mt-1 text-center block w-full rounded-md border  focus:outline-none"
              >
                {Object.values(PercentLevel).map((perc) => (
                  <option key={perc} value={perc}>
                    {perc}%
                  </option>
                ))}

              </select>
            </label>
            
            <label className="block">
              <span className="font-medium">End time</span>
              <input
                type="time"
                value={end?.format('HH:mm')}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  const newEnd = dayjs()
                    .hour(parseInt(hours))
                    .minute(parseInt(minutes));
                  setEnd(newEnd);
                  if (start && newEnd.isBefore(start)) {
                    setStart(newEnd);
                  }
                }}
                required
                className="mt-1 text-center block w-full rounded-md border  focus:outline-none"
              />
            </label>
            <label className="block">
                  <span className="font-medium">Corresponding price</span>
                  <input
                    type="number"
                    required
                    value={prixdecritere ?? ""}
                    placeholder='enter corresponding price'
                    onChange={(e) => { setPrixdecritere(parseInt(e.target.value)) }
                    }
                    className="mt-1 text-center block w-full rounded-md border  focus:outline-none"
                  />
                </label>


                <label className="block">
                  <span className="font-medium">Total price <span className="text-[10px] opacity-[70%]">(auto completion)</span></span>
                  <input
                    type="number"
                    value={prixtotal ?? ""}
                    readOnly
                    className="mt-1 text-center block w-full rounded-md border  focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="font-medium">Total price with discount <span className="text-[10px] opacity-[70%]">(auto completion)</span> </span>
                  <input
                    type="number"
                    value={prixtotalreduit ?? ""}
                    readOnly
                    className="mt-1 text-center block w-full rounded-md border  focus:outline-none"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type='submit'
                  className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
                >
                  {eventToEdit ? 'Update' : 'Add'}
                </button>
                
                <button
                  onClick={clearEdit}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md shadow hover:bg-gray-500 transition"
                >
                  Quit
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default EventForm;