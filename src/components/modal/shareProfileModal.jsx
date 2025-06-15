'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '@/styles/modal/ShareModal.module.css';
import SharedPreferences from "./shareOption";
import Image from "next/image"
const ShareModal = ({ isOpen, onClose, profileName, profileDescription, profileImage, driverId }) => {
    const [shareCount, setShareCount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchShareCount();
        }
    }, [isOpen, driverId]);

    const fetchShareCount = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/share-count/${driverId}`);
            setShareCount(response.data.count);
        } catch (error) {
            console.error('Erreur lors de la récupération du nombre de partages:', error);
        }
    };

    const incrementShareCount = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/increment-share/${driverId}`);
            setShareCount(response.data.count);
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation du nombre de partages:', error);
        }
    };

    const handleShare = (platform) => {
        // Logique de partage existante...

        // Incrémente le compteur de partages
        incrementShareCount();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2>Share {profileName}'s profile</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <span className="sr-only">Close the dialog</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.profileCard}>
                        <div className={styles.profileHeader}>
                            <div className={styles.profileImage}>
                                <Image src={profileImage} alt={profileName} width="56" height="56"/>
                            </div>
                            <div className={styles.profileInfo}>
                                <h3>{profileName}</h3>
                                <p>{profileDescription}</p>
                            </div>
                        </div>
                        <SharedPreferences profileName={profileName} onShare={handleShare} />
                        <div className={styles.shareCount}>
                            Shared {shareCount} times
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;