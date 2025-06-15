"use client";
import React from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";
import styles from '@/styles/profile/CarDetails.module.css';

const CustomArrow = ({ direction, onClick }) => {
    return (
        <button
            className={direction === 'prev' ? styles.customArrowPrev : styles.customArrowNext}
            onClick={onClick}
            aria-label={direction === 'prev' ? 'Previous' : 'Next'}
        >
            <FontAwesomeIcon
                icon={direction === 'prev' ? faChevronLeft : faChevronRight}
                className={styles.customArrowIcon}
            />
        </button>
    );
};

const ImageSlider = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        nextArrow: <CustomArrow direction="next" />,
        prevArrow: <CustomArrow direction="prev" />,
    };

    return (

        <div className={styles.sliderContainer}>
            <Slider {...settings}>
                {images.map((photo, index) => (
                    <div key={index} className={styles.slideContainer}>
                        <Image
                            src={photo.url}
                            alt={photo.alt}
                            className="slide"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                ))}
            </Slider>
        </div>

    );
};

export default ImageSlider;