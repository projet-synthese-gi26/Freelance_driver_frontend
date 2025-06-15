import React from 'react';

const SafetyGuidelines = ({ safetyGuidelineName, safetyGuidelines }) => {
    const selectedGuideline = safetyGuidelines.find(
        guideline => guideline.safety_guideline_name === safetyGuidelineName
    );

    if (!selectedGuideline) {
        return null; // Ou un message d'erreur si vous préférez
    }

    return (
        <div className="p-3 sm:p-4 text lg:p-6 bg-white rounded-md mb-10">
            <h4 className="mb-5 title font-semibold">Safety Guidelines</h4>
            <ul className="flex flex-col gap-4 mb-5">
                {selectedGuideline.guideline_messages.map((message, index) => (
                    <li key={index}>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 grid place-content-center rounded-full shrink-0 bg-[var(--primary-light)]">
                                <i className="las la-check text-lg text-primary"></i>
                            </div>
                            <span className="inline-block">{message}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SafetyGuidelines;