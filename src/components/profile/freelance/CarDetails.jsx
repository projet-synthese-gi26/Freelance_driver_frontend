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
import { reviewService } from '@/service/reviewService';
import { profileService } from '@/service/profileService';

const CarDetails = ({vehicleData,isModal, onVehicleCommentsToggle, currentUserId, reviewsRefreshKey = 0}) => {
    const [iconsLoaded, setIconsLoaded] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [vehicleReviews, setVehicleReviews] = useState([]);
    const [reviewerProfiles, setReviewerProfiles] = useState({});

    useEffect(() => {
        const timer = setTimeout(() => setIconsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const vehicleId = vehicleData?.vehicleId;
        if (!showComments || !vehicleId) return;

        let isMounted = true;
        reviewService
            .getReviewsBySubject(vehicleId, 'VEHICLE')
            .then((reviews) => {
                if (!isMounted) return;
                const list = Array.isArray(reviews) ? reviews : [];
                const mapped = list.map((r) => {
                    const profile = reviewerProfiles?.[r.authorId];
                    const reviewerName = profile?.name || (r.authorId && currentUserId && r.authorId === currentUserId ? 'Vous' : 'Utilisateur');
                    return {
                    review_id: r.id,
                    rated_entity_id: r.subjectId,
                    rated_entity_type: r.subjectType,
                    comment: r.comment ?? '',
                    created_at: r.createdAt ?? '',
                    updated_at: r.createdAt ?? '',
                    note: Number(r.rating ?? 0),
                    likes_count: Number(r.reactionCounts?.LIKE ?? 0),
                    dislikes_count: Number(r.reactionCounts?.DISLIKE ?? 0),
                    icon: '',
                    reviewer_name: reviewerName,
                    reviewer_avatar: profile?.photoUri || '',
                  };
                });
                setVehicleReviews(mapped);

                const missingAuthorIds = Array.from(new Set(list.map((r) => r?.authorId).filter((id) => id && !reviewerProfiles?.[id])));
                if (missingAuthorIds.length > 0) {
                    Promise.all(
                        missingAuthorIds.map(async (userId) => {
                            try {
                                const user = await profileService.getPublicUserById(userId);
                                const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
                                const photoUri = user?.photoUri || '';
                                return [userId, { name: name || userId, photoUri }];
                            } catch {
                                return [userId, { name: userId, photoUri: '' }];
                            }
                        })
                    ).then((entries) => {
                        if (!isMounted) return;
                        setReviewerProfiles((prev) => {
                            const next = { ...(prev || {}) };
                            for (const [userId, data] of entries) {
                                next[userId] = data;
                            }
                            return next;
                        });
                    });
                }
            })
            .catch(() => {
                if (isMounted) setVehicleReviews([]);
            });

        return () => {
            isMounted = false;
        };
    }, [showComments, vehicleData?.vehicleId, reviewsRefreshKey, reviewerProfiles, currentUserId]);



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

    const normalizeImageUrl = (value) => {
        if (!value || typeof value !== 'string') return '';
        const trimmed = value.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
            return trimmed;
        }
        return `https://media-service.pynfi.com/media/${trimmed}`;
    };

    const sliderImages = (vehicleData?.illustration_images || []).map((image, index) => {
        if (typeof image === 'string') {
            const url = normalizeImageUrl(image);
            return url ? { url, alt: `${vehicleData.brand_name || 'Vehicle'} ${index + 1}` } : null;
        }
        if (image?.url) {
            const url = normalizeImageUrl(image.url);
            return url ? { url, alt: image.alt || `${vehicleData.brand_name || 'Vehicle'} ${index + 1}` } : null;
        }
        if (image?.imagePath) {
            const url = normalizeImageUrl(image.imagePath);
            return url ? { url, alt: `${vehicleData.brand_name || 'Vehicle'} ${index + 1}` } : null;
        }
        return null;
    }).filter(Boolean);

    return (
        <div className={styles.carDetails}>
            <ImageSlider images={sliderImages.length > 0 ? sliderImages : [{ url: '/img/car-list-1.jpg', alt: 'Vehicle' }]} />
            <div className={styles.toggleContainer}>
                <button
                    className={`${styles.toggleButton} ${!showComments ? styles.active : ''}`}
                    onClick={() => {
                        setShowComments(false);
                        if (onVehicleCommentsToggle) onVehicleCommentsToggle(false);
                    }}
                >

                  {iconsLoaded && <FontAwesomeIcon icon={faInfoCircle}/> }Vehicle Details
                </button>
                <button
                    className={`${styles.toggleButton} ${showComments ? styles.active : ''}`}
                    onClick={() => {
                        setShowComments(true);
                        if (onVehicleCommentsToggle) onVehicleCommentsToggle(true);
                    }}
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
                    comments={vehicleReviews}
                    isModal={isModal}
                    rated_entity_id={vehicleData.vehicleId}
                    rated_entity_type='VEHICLE'
                    commentsPerPage={1}

                />
            )}

</div>
)
    ;
};

export default CarDetails;