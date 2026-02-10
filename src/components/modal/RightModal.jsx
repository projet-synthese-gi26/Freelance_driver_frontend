import React, { useState, useEffect } from 'react';
import '@/styles/modal/RightModal.css';
import FreelanceDetailsComponent from "@/components/profile/freelance/FreelanceDetailsComponent";
const RightModal = ({ isOpen, onClose, children, pageContent, data }) => {
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        // Gestion de l'animation
        if (isOpen) {
            setAnimationClass('slide-in');
        } else {
            setAnimationClass('slide-out');
        }

        // Gestion de la touche Escape
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);

        // Fonction de nettoyage
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen && animationClass !== 'slide-in') return null;

    return (
        <div className={`right-modal ${animationClass}`}>
            <button
                className={`close-arrow ${isOpen ? 'arrow-open' : 'arrow-closed'}`}
                onClick={onClose}
                aria-label="Close modal"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 4L17 12L9 20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round" />
                </svg>
            </button>

            <div className="modal-content">
                {pageContent ? (
                    data ? (
                        <FreelanceDetailsComponent data={data} isModal={true} />
                    ) : (
                        <div className="p-6 text-sm font-semibold text-slate-600">Chargement...</div>
                    )
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default RightModal;