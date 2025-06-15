import { FC, KeyboardEvent, useEffect, useState } from 'react';
import { Event, PercentLevel } from '../interfaces/types';
import Modal from '@/components/modal/modal';
import { pricingMethod } from '@/data/Structure';


interface EventFormProps {
  prixdecritere: number | null;
  setPrixdecritere: (p: number | null) => void
  startDate: string
  setStartDate: (p: string) => void
  endDate: string
  setEndDate: (p: string) => void
  prixtotal: number | null;
  setPrixtotal: (p: number | null) => void
  criterebuy: string | null;
  setCriterebuy: (p: string | null) => void

  handleFormSubmit: (e: KeyboardEvent<HTMLFormElement>) => void;
  handleDelete: (eventId: number) => void
  handleCancel: () => void
  handleKeyPress: (e: KeyboardEvent<HTMLFormElement>) => void
  selectedEvent: Event | null
  title: string | ''
  setTitle: (e: string) => void
  percent: number | null
  setPercent: (e: number) => void
  prixtotalreduit: number | null
  isOpen:boolean
  handleClose:()=>void
}

const CommonFom: FC<EventFormProps> = ({isOpen,handleClose, prixtotalreduit, setPercent, percent, setTitle, title, setEndDate, endDate, handleCancel, handleDelete, setStartDate, startDate, selectedEvent, handleFormSubmit, handleKeyPress, setCriterebuy, setPrixdecritere, prixtotal, prixdecritere, criterebuy }) => {
  const [minDate, setMinDate] = useState('');
  useEffect(() => {
    // Mettre à jour la date minimale chaque fois que le composant est rendu
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDate(now.toISOString().slice(0,16));
  }, []);
  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <form onSubmit={handleFormSubmit} onKeyPress={handleKeyPress}>
          <div className="bg-opacity-50 flex justify-center items-center text">
            <div className="p-8 rounded-md  w-full">
              <h2 className="title font-bold mb-6 text-planining text-center">{selectedEvent ? 'Update' : 'Add'} a slot</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="font-medium">Personal keyword</span>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='enter your keyword'
                    className="mt-1 p-1 text-center block w-full rounded-md border  focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className=" font-medium">Payment option</span>
                  <select
                    required
                    value={criterebuy ?? ""}
                    onChange={(e) => setCriterebuy(e.target.value)}
                    className="mt-1 p-1 text-center block w-full rounded-md border  focus:outline-none"
                  >
                    {pricingMethod.map((pricing,index) => (
                      <option key={index} value={pricing.value}>
                        {pricing.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="font-medium">Start date</span>
                  <input
                    required
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 p-1 text-center block w-full rounded-md border focus:outline-none"
                    min={minDate}
                  />
                </label>
                <label className="block">
                  <span className="font-medium">Percentage reduction</span>
                  <select
                    required
                    value={percent ?? ""}
                    onChange={(e) => setPercent(parseFloat(e.target.value))}
                    className="mt-1 p-1 text-center block w-full rounded-md border  focus:outline-none"
                  >
                    {Object.values(PercentLevel).map((perc) => (
                      <option key={perc} value={perc}>
                        {perc}%
                      </option>
                    ))}

                  </select>
                </label>
                <label className="block">
                  <span className="font-medium">End date</span>
                  <input
                    required
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 p-1 text-center block w-full rounded-md border  focus:outline-none"
                    min={minDate}
                  />
                </label>
                <label className="block">
                  <span className="font-medium">Corresponding price</span>
                  <input
                    type="number"
                    required
                    value={prixdecritere ?? ""}
                    placeholder='enter a corresponding price'
                    onChange={(e) => { setPrixdecritere(parseInt(e.target.value)) }
                    }
                    className="mt-1 p-1 text-center block w-full rounded-md border  focus:outline-none"
                  />
                </label>


                <label className="block">
                  <span className="font-medium">Total price <span className="text-[10px] opacity-[70%]">(auto completion)</span></span>
                  <input
                    type="number"
                    value={prixtotal ?? ""}
                    readOnly
                    className="mt-1 p-1 text-center block w-full rounded-md border  focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="font-medium">Total price with discount<span className="text-[10px] opacity-[70%]">(auto completion)</span> </span>
                  <input
                    type="number"
                    value={prixtotalreduit ?? ""}
                    readOnly
                    className="mt-1 p-1 text-center block w-full rounded-md border  focus:outline-none"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type='submit'
                  className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
                >
                  {selectedEvent ? 'Update' : 'Add'}
                </button>
                {selectedEvent && (
                  <button
                    onClick={() => handleDelete(selectedEvent.PlaningId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={handleCancel}
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


export default CommonFom