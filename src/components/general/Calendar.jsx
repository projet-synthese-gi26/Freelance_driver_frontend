import React, {useState, useEffect, useRef} from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import styles from '@/styles/modal/OrderModal.module.css';

const CalendarModal = ({ isOpen, onClose, onConfirm }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedPeriods, setSelectedPeriods] = useState({});

    const [price, setPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState('any');
    const [errors, setErrors] = useState({});
    const handlePrice = (e) => {
        setPrice(e.target.value);
        if (errors.price) {
            setErrors((prevErrors) => ({ ...prevErrors, price: '' }));
        }
    };

    const handlePriceUnit = (e) => {
        setPriceUnit(e.target.value);
    };

    // Refs for handling outside click
    const modalRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);


    useEffect(() => {
        const selectedDateStr = selectedDate.toDateString();
        setSelectedPeriods((prevState) => {
            if (prevState[selectedDateStr]?.length === 0) {
                const { [selectedDateStr]: _, ...rest } = prevState;
                return rest;
            }
            return prevState;
        });
    }, [selectedDate]);

    const generateTimeSlots = (date) => {
        const slots = [];
        let startTime = new Date(date);
        startTime.setHours(0, 0, 0, 0);
        const now = new Date();

        while (startTime.getDate() === date.getDate()) {
            if (date.toDateString() !== now.toDateString() || startTime > now) {
                slots.push({
                    id: startTime.getTime(),
                    time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }
            startTime.setMinutes(startTime.getMinutes() + 30);
        }
        return slots;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handlePeriodChange = (periodId) => {
        const selectedDateStr = selectedDate.toDateString();
        setSelectedPeriods((prevPeriods) => {
            const periodsForDate = prevPeriods[selectedDateStr] || [];
            let updatedPeriods;
            if (periodsForDate.includes(periodId)) {
                updatedPeriods = periodsForDate.filter(id => id !== periodId);
            } else {
                updatedPeriods = [...periodsForDate, periodId];
            }

            if (updatedPeriods.length === 0) {
                const { [selectedDateStr]: _, ...rest } = prevPeriods;
                return rest;
            }

            return {
                ...prevPeriods,
                [selectedDateStr]: updatedPeriods,
            };
        });
    };

    const handleSelectAll = () => {
        const selectedDateStr = selectedDate.toDateString();
        const allPeriods = generateTimeSlots(selectedDate).map(slot => slot.id);
        if (selectedPeriods[selectedDateStr]?.length === allPeriods.length) {
            setSelectedPeriods((prevState) => {
                const { [selectedDateStr]: _, ...rest } = prevState;
                return rest;
            });
        } else {
            setSelectedPeriods((prevState) => ({
                ...prevState,
                [selectedDateStr]: allPeriods,
            }));
        }
    };

    const getSelectedPeriods = () => {
        return selectedPeriods;
    };

    const handleConfirm = () => {
        if (price === '') {
            setErrors({ price: 'Price is required' });
            return;
        }

        console.log(getSelectedPeriods(), { price, priceUnit });
        onConfirm({ periods: getSelectedPeriods(), price, priceUnit });
        onClose();
    };


    const renderDayContent = (day) => {
        const dateStr = day.toDateString();
        const isToday = dateStr === new Date().toDateString();
        const hasSelectedPeriods = selectedPeriods[dateStr] && selectedPeriods[dateStr].length > 0;

        return (
            <div className={`${styles.dayContent} ${isToday ? styles.today : ''}`}>
                <span>{day.getDate()}</span>
                {hasSelectedPeriods && !isToday && <div className={styles.underline}></div>}
            </div>
        );
    };


    if (!isOpen) return null;

    const currentSlots = generateTimeSlots(selectedDate);
    const selectedDateStr = selectedDate.toDateString();

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Make an announce</h2>
                <div className={styles.modalBody}>
                    <div className={styles.calendarSection}>
                        <Calendar
                            date={selectedDate}
                            onChange={handleDateChange}
                            minDate={new Date()}
                            dayContentRenderer={renderDayContent} // Customize day rendering
                        />
                    </div>
                    <div className={styles.periodsSection}>
                        <h3>Choose your time:</h3>
                        <label className={styles.selectAllLabel}>
                            <input
                                type="checkbox"
                                checked={selectedPeriods[selectedDateStr]?.length === currentSlots.length}
                                onChange={handleSelectAll}
                            />
                            All Selected
                        </label>
                        <div className={styles.periodsGrid}>
                            {currentSlots.map(slot => (
                                <label key={slot.id} className={styles.periodLabel}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPeriods[selectedDateStr]?.includes(slot.id)}
                                        onChange={() => handlePeriodChange(slot.id)}
                                        disabled={new Date(slot.id) < new Date()}
                                    />
                                    <span>{slot.time}</span>
                                </label>
                            ))}
                        </div>
                    </div>


                </div>

                <div className={styles.priceSection}>
                    <h4 className="text font-medium">Set Your Pricing Method:</h4>
                    <div className={styles.priceInputContainer}>
                        <input
                            type="number"
                            value={price}
                            onChange={handlePrice}
                            className={`p-2 border rounded-l w-2/3 ${errors.price ? 'border-red-500' : ''}`}
                            placeholder="Enter a price (not a manatory)"
                        />
                        <select
                            value={priceUnit}
                            onChange={handlePriceUnit}
                            className="p-2 border border-l-0 rounded-r w-1/3 "
                        >
                            <option value="any">any</option>
                            <option value="km">per km</option>
                            <option value="hour">per hour</option>
                            <option value="day">per day</option>
                            <option value="flat">Flat rate</option>
                        </select>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.confirmButton} onClick={handleConfirm}>
                        <i className="fas fa-check mr-2"></i> Confirm
                    </button>
                    <button className={styles.closeButton} onClick={onClose} style={{marginLeft: '1rem'}}>
                        <i className="fas fa-times mr-2"></i> Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
