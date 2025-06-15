import React from 'react';

interface CustomSpinnerProps {
    color?: string;
}

const ScreenSpinner: React.FC<CustomSpinnerProps> = ({ color = '#3498db'  }) => {
    return (
        <div className="spinner-overlay">
            <div className="spinner-container">
                <svg className="spinner" viewBox="0 0 50 50">
                    <circle
                        className="path"
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="5"
                    ></circle>
                </svg>
            </div>
        </div>
    );
};

export default ScreenSpinner;