"use client";

import React, {useState} from 'react';

import YoutubeShareIcon from "@/components/icon/youtubeShareIcon";
import ShareModal from "@/components/modal/shareProfileModal";

const App = () => {

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const openShareModal = () => {
        setIsShareModalOpen(true);
    };

    const closeShareModal = () => {
        setIsShareModalOpen(false);
    };

    return (

        <>
            <button
                onClick={openShareModal}
                className="flex text items-center px-2 py-1 rounded-full border-white-900 border-2 hover:bg-gray-400 transition-colors"
            >
                <YoutubeShareIcon/>
                <span className='text'>Share</span>
            </button>

            {isShareModalOpen && (
                <ShareModal isOpen={isShareModalOpen} onClose={closeShareModal}
                            profileName=""
                            profileDescription=""
                            profileImage=""
                            driverId=""

                />
            )}
        </>

        // <h1 className="page-title">Cookie Banner with React and TypeScript</h1>


        // </div>
    );
};

export default App;
