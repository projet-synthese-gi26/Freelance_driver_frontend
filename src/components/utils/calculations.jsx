export const calculateCost = (formData) => {
    const { billingMethod, priceUnit, startDate, endDate, startTime, endTime } = formData;
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const diff = end - start;

    switch(billingMethod) {
        case 'perHour':
            return (diff / (1000 * 60 * 60)) * priceUnit;
        case 'perDay':
            return (diff / (1000 * 60 * 60 * 24)) * priceUnit;
        case 'perKm':
            // Assuming a fixed distance for simplicity
            return 100 * priceUnit;
        case 'flatRate':
            return priceUnit;
        default:
            return 0;
    }
};