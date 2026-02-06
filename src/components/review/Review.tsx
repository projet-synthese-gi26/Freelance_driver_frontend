import { HandThumbUpIcon as HandThumbUpIconLine } from "@heroicons/react/24/outline";
import { StarIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { reactionService } from "@/service/reactionService";
import { useAuthContext } from "@/components/context/authContext";
import { useAuthModal } from "@/hook/AuthModalContext";


type comment = {
  review_id : string;
  rated_entity_id :string;
  rated_entity_type :string;
  comment :string;
  created_at :string;
  updated_at :string;
  note :number;
  likes_count :number;
  dislikes_count :number;
  icon :string
  reviewer_name: string;
  reviewer_avatar?: string;
};

function StarRating(rating: number) {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(
          <StarIcon key={i} className="w-5 h-5 text-[var(--tertiary)]" />
      );
    } else {
      stars.push(<StarIcon key={i} className="w-5 h-5 text-[#AAAAAA]" />);
    }
  }

  return <>{stars}</>;
}

function formatDateTime(value?: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Review({
                                 comment,
                                 index,
                               }: {
  comment: comment;
  index: number;
}) {
  const { user } = useAuthContext();
  const { openLoginModal } = useAuthModal();
  const currentUserId = user?.user?.id;

  const initialLikes = useMemo(() => Number(comment.likes_count ?? 0), [comment.likes_count]);
  const initialDislikes = useMemo(() => Number(comment.dislikes_count ?? 0), [comment.dislikes_count]);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [dislikesCount, setDislikesCount] = useState(initialDislikes);
  const [myReaction, setMyReaction] = useState<"LIKE" | "DISLIKE" | null>(null);
  const [loadingReaction, setLoadingReaction] = useState(false);

  const refreshCounts = useCallback(async () => {
    if (!comment.review_id) return;
    try {
      const reactions = await reactionService.getReactionsByTarget(comment.review_id, "REVIEW");
      const likes = reactions.filter((r) => r.type === "LIKE").length;
      const dislikes = reactions.filter((r) => r.type === "DISLIKE").length;
      setLikesCount(likes);
      setDislikesCount(dislikes);
      if (currentUserId) {
        const mine = reactions.find((r) => r.actorId === currentUserId && (r.type === "LIKE" || r.type === "DISLIKE"));
        setMyReaction((mine?.type as any) ?? null);
      } else {
        setMyReaction(null);
      }
    } catch {
      setLikesCount(initialLikes);
      setDislikesCount(initialDislikes);
      setMyReaction(null);
    }
  }, [comment.review_id, currentUserId, initialDislikes, initialLikes]);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  const sendReaction = async (type: "LIKE" | "DISLIKE") => {
    if (!comment.review_id) return;
    if (!currentUserId) {
      openLoginModal();
      return;
    }
    setLoadingReaction(true);
    try {
      if (myReaction === type) {
        await reactionService.deleteReaction(comment.review_id, type);
      } else {
        if (myReaction) {
          await reactionService.deleteReaction(comment.review_id, myReaction);
        }
        await reactionService.createReaction({
          targetId: comment.review_id,
          targetType: "REVIEW",
          type,
        });
      }
      await refreshCounts();
    } finally {
      setLoadingReaction(false);
    }
  };

  return (
      <div
          key={index}
          className="bg-[var(--bg-1)] rounded-2xl text p-1 sm:p-2 lg:p-4 mb-2"
      >
        <div className="flex items-center flex-wrap justify-between gap-4 ">
          <div className="flex gap-2 items-center">
            {comment.reviewer_avatar ? (
              <img
                src={comment.reviewer_avatar}
                alt={comment.reviewer_name || "Avatar"}
                className="h-10 w-10 rounded-full object-cover border border-slate-200"
                loading="lazy"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-200" />
            )}
            <div className="flex-grow">
              <h5 className="mb-1 font-semibold"> {comment.reviewer_name}</h5>
            </div>
          </div>

          <div className="text-sm-end">
            <p className="">
              {" "}
              {formatDateTime(comment.created_at)}
            </p>
          </div>
        </div>
        <div className="border border-dashed mb-1"></div>
        <div className="flex gap-1 mb-3">{StarRating(comment.note)}</div>
        <p className="mb-0 clr-neutral-500 ">{comment.comment}</p>
        <div className="border border-dashed my-2"></div>
        <div className="flex flex-wrap items-center gap-10">
          <div
              className={`flex items-center gap-2 text-blue cursor-pointer ${
                  myReaction === "LIKE" ? "text-blue-500" : ""
              }`}
              onClick={() => (loadingReaction ? undefined : sendReaction("LIKE"))}
          >
            {myReaction === "LIKE" ? (
                <HandThumbUpIcon className="w-5 h-5" />
            ) : (
                <HandThumbUpIconLine className="w-5 h-5" />
            )}
            <span className="inline-block"> {likesCount} </span>
          </div>

          <div
              className={`flex items-center gap-2 text-red cursor-pointer ${
                  myReaction === "DISLIKE" ? "text-red-500" : ""
              }`}
              onClick={() => (loadingReaction ? undefined : sendReaction("DISLIKE"))}
          >
            {myReaction === "DISLIKE" ? (
                <HandThumbUpIcon className="w-5 h-5 rotate-180" />
            ) : (
                <HandThumbUpIconLine className="w-5 h-5 rotate-180" />
            )}
            <span className="inline-block"> {dislikesCount} </span>
          </div>
        </div>
      </div>
  );
}