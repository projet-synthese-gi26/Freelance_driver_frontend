"use client";
import { HandThumbDownIcon, HandThumbUpIcon, HeartIcon } from "@heroicons/react/24/solid";
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface EmojisProps {
    driver_id: string
}


type EmojiName = 'heart' | 'handUp' | 'handDown' | 'angry';

type SelectedEmojis = {
    [key in EmojiName]: boolean;
};


// Fonction pour formater le nombre d'émotions
const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

export default function Emojis({ driver_id, vertical = false }: EmojisProps & { vertical?: boolean }) {
    const DRIVER_EMOJIS_PATH = "http://localhost:8000/emojis";

    const [refresh, setRefresh] = useState(true);

    const [iconsNumber, setIconsNumber] = useState({
        driver_id: driver_id,
        handUp: 1112,
        handDown: 1000000,
        angry: 500,
        heart: 12500,
        totalReviews: 0,
        share: 0
    });

    useEffect(() => {
        const fetchIconsNumber = async () => {
            try {
                const response = await axios.get(DRIVER_EMOJIS_PATH + '/' + driver_id);
                if (response.data !== null) {
                    setIconsNumber(response.data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du nombre d\'icônes :', error);
            }
        };

        fetchIconsNumber();
    }, [refresh, driver_id]);

    const [selectedEmojis, setSelectedEmojis] = useState<SelectedEmojis>({
        heart: false,
        handUp: false,
        handDown: false,
        angry: false,
    });
    //
    // const sendEmoji = async (emoji_name: string) => {
    //     var emojiData = {
    //         user_id: "user_id",
    //         driver_id: driver_id,
    //         emoji_name: emoji_name,
    //     }
    //     try {
    //         await axios.put(DRIVER_EMOJIS_PATH, emojiData);
    //         console.log('Emoji envoyé avec succès au backend');
    //         setRefresh(!refresh);
    //     } catch (error) {
    //         console.error('Erreur lors de l\'envoi de l\'emoji au backend:', error);
    //     }
    // };

    const sendEmoji = async (emoji_name: EmojiName) => {
        var emojiData = {
            user_id: "user_id",
            driver_id: driver_id,
            emoji_name: emoji_name,
        }
        try {
            await axios.put(DRIVER_EMOJIS_PATH, emojiData);
            console.log('Emoji envoyé avec succès au backend');
            setRefresh(!refresh);
            setSelectedEmojis(prev => ({ ...prev, [emoji_name]: !prev[emoji_name] }));
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'emoji au backend:', error);
        }
    };

    // return (
    //     <div className="flex text justify-center px-4 py-2 max-w-md mx-auto space-x-8">
    //         <EmojiButton
    //             icon={<HeartIcon className={`w-5 h-5 ${selectedEmojis.heart ? 'text-red-500 fill-current' : 'text-gray-500'} hover:text-red-600`}/>}
    //             count={iconsNumber.heart}
    //             onClick={() => sendEmoji("heart")}
    //         />
    //         <EmojiButton
    //             icon={<HandThumbUpIcon className={`w-5 h-5 ${selectedEmojis.handUp ? 'text-blue-500 fill-current' : 'text-gray-500'} hover:text-blue-600`}/>}
    //             count={iconsNumber.handUp}
    //             onClick={() => sendEmoji("handUp")}
    //         />
    //         <EmojiButton
    //             icon={<HandThumbDownIcon className={`w-5 h-5 ${selectedEmojis.handDown ? 'text-white-600 fill-current' : 'text-gray-500'} hover:text-white-600`}/>}
    //             count={iconsNumber.handDown}
    //             onClick={() => sendEmoji("handDown")}
    //         />
    //         <EmojiButton
    //             icon={<span className="xl">😡</span>}
    //             count={iconsNumber.angry}
    //             onClick={() => sendEmoji("angry")}
    //         />
    //     </div>
    // );

    return (
        <div className={`flex ${vertical ? 'flex-col space-y-4' : 'justify-center px-4 py-2 max-w-md mx-auto space-x-8'}`}>
            <EmojiButton
                icon={<HeartIcon className={`w-5 h-5 ${selectedEmojis.heart ? 'text-red-500 fill-current' : 'text-gray-500'} hover:text-red-600`}/>}
                count={iconsNumber.heart}
                onClick={() => sendEmoji("heart")}
                vertical={vertical}
            />
            <EmojiButton
                icon={<HandThumbUpIcon className={`w-5 h-5 ${selectedEmojis.handUp ? 'text-blue-500 fill-current' : 'text-gray-500'} hover:text-blue-600`}/>}
                count={iconsNumber.handUp}
                onClick={() => sendEmoji("handUp")}
                vertical={vertical}
            />
            <EmojiButton
                icon={<HandThumbDownIcon className={`w-5 h-5 ${selectedEmojis.handDown ? 'text-white-600 fill-current' : 'text-gray-500'} hover:text-white-600`}/>}
                count={iconsNumber.handDown}
                onClick={() => sendEmoji("handDown")}
                vertical={vertical}
            />
            <EmojiButton
                icon={<span className="xl">😡</span>}
                count={iconsNumber.angry}
                onClick={() => sendEmoji("angry")}
                vertical={vertical}
            />
        </div>
    );

}

// interface EmojiButtonProps {
//     icon: React.ReactNode;
//     count: number;
//     onClick: () => void;
// }
//
// const EmojiButton: React.FC<EmojiButtonProps> = ({ icon, count, onClick }) => (
//     <div className="flex text flex-col items-center cursor-pointer transition-transform hover:scale-110" onClick={onClick}>
//         {icon}
//         <span className=" font-5">{formatNumber(count)}</span>
//     </div>
// );

interface EmojiButtonProps {
    icon: React.ReactNode;
    count: number;
    onClick: () => void;
    vertical?: boolean;
}

const EmojiButton: React.FC<EmojiButtonProps> = ({ icon, count, onClick, vertical }) => (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-col'} items-center cursor-pointer transition-transform hover:scale-110`} onClick={onClick}>
        {icon}
        <span className="font-5">{formatNumber(count)}</span>
    </div>
);