import React from 'react';

const Amenities = ({ amenities }) => {
    const predefinedAmenities = {
        'Air-conditioned': { icon: 'las la-snowflake' },
        'Comfortable': { icon: 'las la-couch' },
        'Soft': { icon: 'las la-feather' },
        'Screen': { icon: 'las la-tv' },
        'Wifi': { icon: 'las la-wifi' },
        'Toll charge': { icon: 'las la-road' },
        'Car Parking': { icon: 'las la-parking' },
        'Alarm': { icon: 'las la-bell' },
        'State tax': { icon: 'las la-file-invoice-dollar' },
        'Driver Allowance': { icon: 'las la-user-tie' },
        'Pickup and drop': { icon: 'las la-shuttle-van' },
        'Internet': { icon: 'las la-globe' },
        'Pets Allow': { icon: 'las la-paw' }
    };

    const amenityList = Object.entries(predefinedAmenities);

    // Fonction pour vérifier si une aménité est incluse
    const isAmenityIncluded = (amenity) => {
        return amenities.some(item =>
            item.toLowerCase().split(',').map(a => a.trim()).includes(amenity.toLowerCase())
        );
    };

    return (
        <div className="p-3 sm:p-4 text lg:p-6 bg-white rounded-md mb-10">
            <h4 className="mb-5 title font-semibold">Inclusion & Exclusion</h4>
            <div className="mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {amenityList.map(([name, amenityInfo], index) => {
                        const isIncluded = isAmenityIncluded(name);
                        return (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 grid place-content-center rounded-full shrink-0 ${
                                        isIncluded ? 'bg-green-100' : 'bg-red-100'
                                    }`}
                                >
                                    <i className={`${amenityInfo.icon} text-lg ${
                                        isIncluded ? 'text-green-500' : 'text-red-500'
                                    }`}></i>
                                </div>
                                <div className="w-6 h-6 grid place-content-center rounded-full shrink-0">
                                    {isIncluded ? (
                                        <i className="las la-check-circle text-green-500 text-lg"></i>
                                    ) : (
                                        <i className="las la-times-circle text-red-500 text-lg"></i>
                                    )}
                                </div>
                                <span className="inline-block">{name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Amenities;