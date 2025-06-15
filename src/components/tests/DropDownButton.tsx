import React, { useState } from 'react';

interface DropdownButtonProps {
    label: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ label, children, icon }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(true); // Initialisé à false

    const toggleDropdown = () => {
        setIsDropdownOpen(isDropdownOpen);
    };

    return (
        <div className="w-full items-center justify-center">
            <div className="w-full flex items-center justify-center">
                <button
                    className="flex items-center justify-center px-2 py-2 m-1 bg-primary text-white rounded-md focus:outline-none min-h-65"
                    onClick={toggleDropdown}
                >
                    <span>{label}</span>
                    {icon && <span className="ml-2">{icon}</span>} {/* Utilisation de l'icône */}
                </button>
            </div>

            {isDropdownOpen && (
                <div className={'transition-opacity duration-300 w-full'+ `opacity-${isDropdownOpen? '100' : '0'}`}>

                    <div className={"mt-2 py-2 bg-white border border-gray-300 rounded-md shadow-lg " + `opacity-${isDropdownOpen? '100' : '0'}`}>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownButton;