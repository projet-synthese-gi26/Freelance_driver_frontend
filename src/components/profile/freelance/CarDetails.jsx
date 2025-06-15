import React, { useState, useEffect } from 'react';
import ImageSlider from "./ImageCard"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers, faSuitcase, faCogs, faFan, faChevronLeft, faChevronRight,
    faCar, faGasPump, faIndustry, faIdCard, faBarcode, faGauge, faCalendarAlt,
    faTruck,faInfoCircle,faComments, faPaw, faWifi, faTollbooth, faParking, faBell, faTachometerAlt
} from '@fortawesome/free-solid-svg-icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '@/styles/profile/CarDetails.module.css';
import Comment from "./Comment";

const CarDetails = ({vehicleData,isModal}) => {
    const [iconsLoaded, setIconsLoaded] = useState(false);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIconsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);



    const DetailItem = ({ icon, label, value }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleExpand = () => {
            setIsExpanded(!isExpanded);
        };

        return (
            <div className={`${styles.detailItem} ${iconsLoaded ? styles.loaded : ''}`}>
                <div className={styles.iconContainer}>
                    {iconsLoaded && <FontAwesomeIcon icon={icon} />}
                </div>
                <div className={styles.detailText}>
                    <span className={styles.detailLabel}>{label}</span>
                    <span
                        className={`${styles.detailValue} ${isExpanded ? styles.expanded : ''}`}
                        title={`${Array.isArray(value) ? value.join(', ') : value}`}
                        onClick={toggleExpand}
                        // title={isExpanded ? "Click to collapse" : "Click to expand"}
                    >
                    {Array.isArray(value) ? value.join(', ') : value}
                </span>
                </div>
            </div>
        );
    };
    return (
        <div className={styles.carDetails}>
            <ImageSlider images={vehicleData.illustration_images} />
            <div className={styles.toggleContainer}>
                <button
                    className={`${styles.toggleButton} ${!showComments ? styles.active : ''}`}
                    onClick={() => setShowComments(false)}
                >

                  {iconsLoaded && <FontAwesomeIcon icon={faInfoCircle}/> }Vehicle Details
                </button>
                <button
                    className={`${styles.toggleButton} ${showComments ? styles.active : ''}`}
                    onClick={() => setShowComments(true)}
                >
                    {iconsLoaded &&   <FontAwesomeIcon icon={faComments}/>  } Comments On vehicle
                </button>
            </div>
            {!showComments ? (
                <div className={styles.details}>
                    <h2 className={styles.title}>{vehicleData.manufacturer_name} {vehicleData.model_name}</h2>
                    <div className={styles.detailGrid}>
                        <DetailItem icon={faUsers} label="Seats" value={vehicleData.total_seat_number}/>
                        <DetailItem icon={faSuitcase} label="Luggage Capacity"
                                    value={`${vehicleData.luggage_max_capacity} Kg`}/>
                        <DetailItem icon={faCogs} label="Transmission" value={vehicleData.transmission_type_name}/>
                        <DetailItem icon={faFan} label="Amenities" value={vehicleData.vehicle_amenities}/>
                        <DetailItem icon={faCar} label="Size" value={vehicleData.size_name}/>
                        <DetailItem icon={faGasPump} label="Fuel Type" value={vehicleData.fuel_type_name}/>
                        <DetailItem icon={faIndustry} label="Manufacturer" value={vehicleData.manufacturer_name}/>
                        <DetailItem icon={faIdCard} label="Registration" value={vehicleData.registration_number}/>
                        <DetailItem icon={faBarcode} label="Serial Number" value={vehicleData.vehicle_serial_number}/>
                        <DetailItem icon={faGauge} label="Tank Capacity" value={`${vehicleData.tank_capacity} L`}/>
                        <DetailItem icon={faCalendarAlt} label="Vehicle Age"
                                    value={`${vehicleData.vehicle_age_at_start} years`}/>
                        <DetailItem icon={faTruck} label="Can Transport" value={vehicleData.can_transport}/>
                        <DetailItem icon={faCar} label="Type" value={vehicleData.type_name}/>
                        <DetailItem icon={faTachometerAlt} label="Avg. Fuel Consumption"
                                    value={`${vehicleData.average_fuel_consumption_per_kilometer} L/km`}/>
                        <DetailItem icon={faTachometerAlt} label="Mileage since commissioning"
                                    value={`${vehicleData.mileage_at_mileage_since_commissioning} km`}/>
                    </div>
                </div>
            ) : (
                <Comment
                    comments={vehicleData.vehicle_reviews}
                    isModal={isModal}
                    rated_entity_id={vehicleData.vehicleId}
                    rated_entity_type='vehicle'
                    commentsPerPage={1}

                />
            )}

</div>
)
    ;
};

export default CarDetails;