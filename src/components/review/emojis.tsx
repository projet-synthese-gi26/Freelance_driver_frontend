"use client";
import { HandThumbDownIcon, HandThumbUpIcon, HeartIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useMemo, useState } from 'react';
import { reactionService } from '@/service/reactionService';
import { ReactionTargetType, ReactionType } from '@/type/reaction';
import { useAuthContext } from '@/components/context/authContext';
import { useAuthModal } from '@/hook/AuthModalContext';

interface EmojisProps {
    driver_id: string
    driver_actor_id?: string
    targetType?: ReactionTargetType
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

export default function Emojis({ driver_id, driver_actor_id, targetType, vertical = false }: EmojisProps & { vertical?: boolean }) {
    const targetId = driver_actor_id || driver_id;
    if (!targetId) {
        return null;
    }
    const resolvedTargetType: ReactionTargetType = targetType || "DRIVER";
    const { user, isLoading: authLoading, checkAuth } = useAuthContext();
    const { openLoginModal } = useAuthModal();
    const [isLoading, setIsLoading] = useState(false);
    const [iconsNumber, setIconsNumber] = useState({
        driver_id: targetId,
        handUp: 0,
        handDown: 0,
        angry: 0,
        heart: 0,
        totalReviews: 0,
        share: 0
    });

    const [selectedEmojis, setSelectedEmojis] = useState<SelectedEmojis>({
        heart: false,
        handUp: false,
        handDown: false,
        angry: false,
    });

    const currentUserId = user?.user?.id;

    const reactionMap = useMemo<Record<EmojiName, ReactionType>>(() => ({
        heart: "LOVE",
        handUp: "LIKE",
        handDown: "DISLIKE",
        angry: "ANGRY",
    }), []);

    useEffect(() => {
        if (!targetId) return;
        const fetchIconsNumber = async () => {
            setIsLoading(true);
            try {
                const reactions = await reactionService.getReactionsByTarget(targetId, resolvedTargetType);
                const counts = reactions.reduce(
                    (acc, reaction) => {
                        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
                        return acc;
                    },
                    {} as Record<ReactionType, number>
                );

                setIconsNumber((prev) => ({
                    ...prev,
                    driver_id: targetId,
                    handUp: counts.LIKE || 0,
                    handDown: counts.DISLIKE || 0,
                    angry: counts.ANGRY || 0,
                    heart: counts.LOVE || 0,
                }));

                if (currentUserId) {
                    const userReactions = new Set(
                        reactions
                            .filter((reaction) => reaction.actorId === currentUserId)
                            .map((reaction) => reaction.type)
                    );

                    setSelectedEmojis({
                        heart: userReactions.has("LOVE"),
                        handUp: userReactions.has("LIKE"),
                        handDown: userReactions.has("DISLIKE"),
                        angry: userReactions.has("ANGRY"),
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des réactions :', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIconsNumber();
    }, [targetId, currentUserId, resolvedTargetType]);

    const sendEmoji = async (emoji_name: EmojiName) => {
        if (!targetId) return;
        if (authLoading) {
            try {
                await checkAuth();
            } catch {
                // ignore
            }
        }
        if (!user) {
            openLoginModal();
            return;
        }
        const reactionType = reactionMap[emoji_name];
        setIsLoading(true);
        try {
            if (selectedEmojis[emoji_name]) {
                await reactionService.deleteReaction(targetId, reactionType);
            } else {
                await reactionService.createReaction({
                    targetId,
                    targetType: resolvedTargetType,
                    type: reactionType,
                });
            }
            const reactions = await reactionService.getReactionsByTarget(targetId, resolvedTargetType);
            const counts = reactions.reduce(
                (acc, reaction) => {
                    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
                    return acc;
                },
                {} as Record<ReactionType, number>
            );
            setIconsNumber((prev) => ({
                ...prev,
                handUp: counts.LIKE || 0,
                handDown: counts.DISLIKE || 0,
                angry: counts.ANGRY || 0,
                heart: counts.LOVE || 0,
            }));
            if (currentUserId) {
                setSelectedEmojis({
                    heart: reactions.some((r) => r.actorId === currentUserId && r.type === "LOVE"),
                    handUp: reactions.some((r) => r.actorId === currentUserId && r.type === "LIKE"),
                    handDown: reactions.some((r) => r.actorId === currentUserId && r.type === "DISLIKE"),
                    angry: reactions.some((r) => r.actorId === currentUserId && r.type === "ANGRY"),
                });
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                if (!user) {
                    openLoginModal();
                } else {
                    console.error('Erreur 401 lors de la réaction (utilisateur déjà connecté):', error);
                }
                return;
            }
            console.error('Erreur lors de l\'envoi de la réaction:', error);
        } finally {
            setIsLoading(false);
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
        <div className={`flex ${vertical ? 'flex-col space-y-4' : 'justify-center px-4 py-2 max-w-md mx-auto space-x-8'} ${isLoading ? 'opacity-70' : ''}`}>
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