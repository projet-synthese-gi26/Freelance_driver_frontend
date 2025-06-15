"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterForm = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        service: '',
        freelanceType: '',
        skills: '',
        experience: '',
        // Ajoutez d'autres champs au besoin
    });

    const services = ['Freelance', 'Rental Agency', 'Car Pooling', 'Travel Agency'];
    const freelanceTypes = ['Developer', 'Designer', 'Writer', 'Marketing'];

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <motion.div
                        key="service"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                    >
                        <h2>Pour quel service voulez-vous vous inscrire ?</h2>
                        {services.map((service) => (
                            <button
                                key={service}
                                onClick={() => {
                                    handleChange({ target: { name: 'service', value: service } });
                                    handleNext();
                                }}
                            >
                                {service}
                            </button>
                        ))}
                    </motion.div>
                );
            case 1:
                if (formData.service !== 'Freelance') {
                    // Gérer les autres services ici
                    return <div>Service non développé pour le moment</div>;
                }
                return (
                    <motion.div
                        key="freelanceType"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                    >
                        <h2>Quel type de freelance êtes-vous ?</h2>
                        {freelanceTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => {
                                    handleChange({ target: { name: 'freelanceType', value: type } });
                                    handleNext();
                                }}
                            >
                                {type}
                            </button>
                        ))}
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key="skills"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                    >
                        <h2>Quelles sont vos compétences principales ?</h2>
                        <textarea
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="Listez vos compétences..."
                        />
                        <button onClick={handleNext}>Suivant</button>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        key="experience"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                    >
                        <h2>Combien d'années d'expérience avez-vous ?</h2>
                        <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                        />
                        <button onClick={handleNext}>Terminer</button>
                    </motion.div>
                );
            default:
                return (
                    <motion.div
                        key="summary"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <h2>Résumé de votre inscription</h2>
                        <p>Service : {formData.service}</p>
                        <p>Type de freelance : {formData.freelanceType}</p>
                        <p>Compétences : {formData.skills}</p>
                        <p>Expérience : {formData.experience} ans</p>
                    </motion.div>
                );
        }
    };

    return (
        <div className="register-form">
            <AnimatePresence mode="wait">
                {renderStep()}
            </AnimatePresence>
            {step > 0 && step < 4 && (
                <button onClick={handlePrevious}>Précédent</button>
            )}
        </div>
    );
};

export default RegisterForm;