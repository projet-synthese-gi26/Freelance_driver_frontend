import { useState, useEffect } from 'react';

const Location = () => {
    const [location, setLocation] = useState({
        city: '',
        country: '',
    });

    useEffect(() => {
        const fetchLocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
                        );
                        const data = await response.json();

                        if (data.address) {
                            const { city, country } = extractLocationData(data.address);
                            setLocation({ city, country });
                        }
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        fetchLocation();
    }, []);

    const extractLocationData = (address:any) => {
        const city = address.city || address.town || address.village;
        const country = address.country;
        return { city, country };
    };

    return (
        <div>
            {location ? (
                <p>
                    {location.city}, {location.country}
                </p>
            ) : (
                <p>Récupération de la position en cours...</p>
            )}
        </div>
    );
};

export default Location;