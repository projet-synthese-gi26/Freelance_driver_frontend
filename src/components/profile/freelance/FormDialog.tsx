
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
//import Select from 'react-select';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ProtectedButton} from "@/components/general/ProtectedButton";

interface driverId {
  driver_id:string;
}

export default function FormDialog({driver_id}:driverId) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [showMore, setShowMore] = React.useState(false);
  const [price, setPrice] = React.useState('');
  const [priceUnit, setPriceUnit] = React.useState('km');
  const [errors, setErrors] = React.useState<{[key: string]: string}>({});

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setEndDate(''); // Reset end date when start date changes
  };
  const handleStartTime = (e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value);
  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value);
  const handleEndTime = (e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value);
  const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value);
  const handlePriceUnit = (e: React.ChangeEvent<HTMLSelectElement>) => setPriceUnit(e.target.value);

  const validateForm = () => {
    let newErrors: {[key: string]: string} = {};
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!endTime) newErrors.endTime = "End time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validateForm()) {

      handleClose();
    }
  };

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setPrice('');
    setPriceUnit('km');
    setShowMore(false);
    setErrors({});
  };

  // Get current date and time
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  // Calculate min end date based on start date
  const minEndDate = startDate || currentDate;

  return (
      <React.Fragment>
        <ProtectedButton
            className='text font-medium border-2 px-2 py-1 text-dark border-[#243757] hover:bg-primary hover:text-white transitions-colors duration-500'
            onProtectedClick={handleClickOpen}>
          ORDER AVAILABILITY
        </ProtectedButton>
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={fullScreen}
            PaperProps={{
              component: 'form',
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleAdd();
              },
              className: 'w-full max-w-[600px] sm:w-4/5 md:w-3/4'
            }}
        >
          <DialogTitle>
            <h1 className={`font-bold ${fullScreen ? 'title' : 'title'}`}>
              Order Availability
            </h1>
          </DialogTitle>
          <DialogContent>
            <form className={`flex flex-col text ${fullScreen ? 'm-2' : 'm-2'}`}>
              <label className="font-medium py-2">Start Date</label>
              <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDate}
                  min={currentDate}
                  className={`mb-1 p-2 border rounded ${errors.startDate ? 'border-red-500' : ''}`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mb-2">{errors.startDate}</p>}

              <label className="font-medium py-2">Start Time</label>
              <input
                  type="time"
                  value={startTime}
                  onChange={handleStartTime}
                  min={startDate === currentDate ? currentTime : undefined}
                  className={`mb-1 p-2 border rounded ${errors.startTime ? 'border-red-500' : ''}`}
              />
              {errors.startTime && <p className="text-red-500 text-sm mb-2">{errors.startTime}</p>}

              <label className="font-medium py-2">End Date</label>
              <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDate}
                  min={minEndDate}
                  className={`mb-1 p-2 border rounded ${errors.endDate ? 'border-red-500' : ''}`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mb-2">{errors.endDate}</p>}

              <label className="font-medium py-2">End Time</label>
              <input
                  type="time"
                  value={endTime}
                  onChange={handleEndTime}
                  min={endDate === startDate ? startTime : undefined}
                  className={`mb-1 p-2 border rounded ${errors.endTime ? 'border-red-500' : ''}`}
              />
              {errors.endTime && <p className="text-red-500 text-sm mb-2">{errors.endTime}</p>}

              <button
                  type="button"
                  onClick={() => setShowMore(!showMore)}
                  className="text-blue-600 hover:text-blue-800 text-left my-2"
              >
                {showMore ? 'Less' : 'More...'}
              </button>

              {showMore && (
                  <div className="mb-3">
                    <label className="font-medium py-2 block">Price</label>
                    <div className="flex">
                      <input
                          type="number"
                          value={price}
                          onChange={handlePrice}
                          className={`p-2 border rounded-l w-2/3 ${errors.price ? 'border-red-500' : ''}`}
                          placeholder="Enter price"
                      />
                      <select
                          value={priceUnit}
                          onChange={handlePriceUnit}
                          className="p-2 border border-l-0 rounded-r w-1/3"
                      >
                        <option value="km">per km</option>
                        <option value="hour">per hour</option>
                        <option value="day">per day</option>
                        <option value="flat">Flat rate</option>
                      </select>
                    </div>
                  </div>
              )}
            </form>
          </DialogContent>
          <DialogActions className="flex justify-center pb-4">
            <Button
                type="submit"
                variant="contained"
                color="primary"
                className="mx-1 px-4 text py-2 rounded-lg hover:bg-blue-700"
            >
              Order
            </Button>
            <Button
                onClick={handleClose}
                variant="contained"
                color="error"
                className="mx-1 px-4 text py-2 rounded-lg hover:bg-red-700"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
  );
}