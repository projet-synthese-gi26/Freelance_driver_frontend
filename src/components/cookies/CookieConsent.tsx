
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from "@public/img/MainLogo1.png";
import CookiePreferences from './PreferencesCenter';
import CookiesData from "@/data/cookiesData";

interface CookieCategory {
    name: string;
    description: string;
    required?: boolean;
    enabled: boolean;
    subCategories?: SubCategory[];
}

interface SubCategory {
    name: string;
    description: string;
    enabled: boolean;
}


interface CookieBannerProps {
    onAccept: () => void;
    onRefuse: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onRefuse })=>{
    const [isVisible, setIsVisible] = useState(true);
    const [showPreferences, setShowPreferences] = useState(false);
    const [cookiePreferences, setCookiePreferences] = useState<CookieCategory[]>(CookiesData);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
            setIsVisible(true);
            localStorage.setItem('hasVisited', 'true');
        } else {
            const savedPreferences = localStorage.getItem('cookiePreferences');
            if (savedPreferences) {
                setCookiePreferences(JSON.parse(savedPreferences));
            }
        }
    }, []);
    const handleAccept = () => {
        console.log('Cookies accepted');
        const updatedPreferences = cookiePreferences.map(category => ({
            ...category,
            enabled: true,
            subCategories: category.subCategories?.map(sub => ({ ...sub, enabled: true }))
        }));
        setCookiePreferences(updatedPreferences);
        saveCookiePreferences(updatedPreferences);
        onAccept();
    };

    const handleRefuse = () => {
        console.log('Cookies refused');
        const updatedPreferences = cookiePreferences.map(category => ({
            ...category,
            enabled: category.required ? true : false,
            subCategories: category.subCategories?.map(sub => ({ ...sub, enabled: false }))
        }));
        setCookiePreferences(updatedPreferences);
        saveCookiePreferences(updatedPreferences);
        onRefuse();
    };




    const handleManageChoices = () => {
        setShowPreferences(true);
    };
    const handleBackToCookieConsent = () => {
        setShowPreferences(false);
    };
    const saveCookiePreferences = (preferences: CookieCategory[]) => {
        console.log('Saving preferences:', preferences);
        localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
        setShowPreferences(false);
        setIsVisible(false);
    };

    const handleSavePreferences = (updatedPreferences: CookieCategory[]) => {
        setCookiePreferences(updatedPreferences);
        saveCookiePreferences(updatedPreferences);
    };

    if (!isVisible && !showPreferences) return null;

    return (
        <div className="modal-overlay-cookie bg-gray-500 bg-opacity-75 ">
            <div className="modal-content-cookie">
                {!showPreferences ? (
                    <div className="cookie-banner">
                        <div className="flex flex-col cookie-content items-center">
                            <div>
                                <Image className="logo" src={logo} alt="Logo" />
                            </div>
                            <div className="text-justify">
                                <h2 className="bigtitle font-bold">Respecting your privacy is a priority for Our Site</h2>
                                <p>
                                    With your consent, we and our partners use
                                    cookies or similar technologies to store and process your personal
                                    data to personalize your experience, analyze our traffic,
                                    and provide personalized content. You can withdraw your consent or object
                                    to processing based on legitimate interest at any time by clicking on
                                    "Manage my choices".
                                </p>
                                <div className="data-processing-container">
                                    <p>
                                        <span className="data-processing-title">Your personal data is processed for the following purposes:</span>
                                        <span className="data-processing-list">
                                            {/*{cookiePreferences.map((category, index) => (*/}
                                            {/*    <span key={index}>{category.name}</span>*/}
                                            {/*))}*/}


                                            <span>Actively scan device characteristics for identification</span>
                                            <span>, Analyze device and browsing data to send personalized messages</span>
                                            <span>, Understand audiences through statistics or combinations of data from different sources</span>
                                            <span>, Create personalized content profiles</span>
                                            <span>, Create profiles for personalized advertising</span>
                                            <span>, Develop and improve services</span>
                                            <span>, Essential functionalities</span>
                                            <span>, Audience measurement</span>
                                            <span>, Measure content performance</span>
                                            <span>, Measure ad performance</span>
                                            <span>, Store and/or access information on a device</span>
                                            <span>, Use precise geolocation data</span>
                                            <span>, Use limited data to select advertising</span>
                                            <span>, Use limited data to select content</span>
                                            <span>, Use profiles to select personalized content</span>
                                            <span>, Use profiles to select personalized ads</span>

                                        </span>
                                    </p>
                                </div>
                                <div className="button-group">
                                    <button className="manage" onClick={handleManageChoices}>
                                        Manage my choices
                                    </button>
                                    <button className="refuse" onClick={handleRefuse}>
                                        Refuse
                                    </button>
                                    <button className="accept" onClick={handleAccept}>
                                        Accept and close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <CookiePreferences
                        cookiePreferences={cookiePreferences}
                        onClose={handleBackToCookieConsent}
                        onSave={handleSavePreferences}
                    />
                )}
            </div>
        </div>
    );
};

export default CookieBanner;