import React, {useState} from 'react';
import Image from 'next/image';

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function DriverExperienceCard({ experience }) {
    const startDate = formatDate(experience.start_date);
    const endDate = experience.end_date ? formatDate(experience.end_date) : 'Present';

    return (
        <div className="mb-1 p-2 border rounded-lg shadow-sm text">
            <h3 className="text-lg font-semibold mb-2 text">{`${startDate} - ${endDate}: ${experience.description}`}</h3>
            <p className="mb-1 text"><strong>Driving skills:</strong> {experience.driving_skills.join(', ')}</p>
            <p className="mb-1 text"><strong>Transmission types:</strong> {experience.transmission_types.join(', ')}</p>
            <p className="mb-1 text"><strong>Vehicle models:</strong> {experience.vehicle_models.join(', ')}</p>

            {experience.experience_illustrations.length > 0 && (
                <div className="mt-2">
                    <h4 className="font-semibold mb-1 text">Illustrations:</h4>
                    <div className="flex flex-wrap gap-2 text">
                        {experience.experience_illustrations.map((img, index) => (
                            <Image key={index} src={img} alt={`Illustration ${index + 1}`} width={100} height={75} className="rounded" />
                        ))}
                    </div>
                </div>
            )}

            {experience.experience_references.length > 0 && (
                <div className="mt-0">
                    <h4 className="font-semibold mb-1 text">References:</h4>
                    <ul className="list-disc list-inside">
                        {experience.experience_references.map((ref, index) => (
                            <li key={index}>
                                <a href={ref} target="_blank" rel="noopener noreferrer" className="text-blue-600 text hover:underline text">
                                    Reference {index + 1}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default function DriverExperiences({ driverExperiences }) {
    const [showExperience, setShowExperience] = useState(false);
    return (
        <>
            <div className="items-center gap-1 overflow-x-auto">
            <div className="block text font-semibold clr-neutral-600 mb-4 flex  flex-col gap-4">
                <button onClick={() => setShowExperience(!showExperience)}
                        className="flex items-center justify-between flex-wrap">
                    {showExperience ? 'Hide professional experience' : 'Show professional experience'}
                    <span className={`inline-block transition-transform ${showExperience ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                        </svg>
                    </span>
                </button>
            </div>

            {showExperience && (
                <div className="">
                    {driverExperiences.map((driver_experience) => (
                        <DriverExperienceCard key={driver_experience.driver_experience_id}
                                              experience={driver_experience}/>
                    ))}
                </div>
            )}
            </div>
        </>
    );
}