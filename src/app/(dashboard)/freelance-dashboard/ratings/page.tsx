"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { StarIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';

// SERVICES
import { reviewService } from '@/service/reviewService';
import type { Review } from '@/type/review';
import { sessionService } from '@/service/sessionService';
import { useAuthContext } from '@/components/context/authContext';
import EmptyJumbotron from '@/components/EmptyJumbotron';

const getReviewScore = (review: Review) => {
  const anyReview = review as any;
  const raw = review.rating ?? anyReview.score;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};

const getReviewAuthorName = (review: Review) => {
  const anyReview = review as any;
  const first = anyReview.authorFirstName ?? '';
  const last = anyReview.authorLastName ?? '';
  const full = `${first} ${last}`.trim();
  return full || 'Anonyme';
};

const getReviewAuthorAvatar = (review: Review) => {
  const anyReview = review as any;
  return anyReview.authorProfileImageUrl || anyReview.authorImageUrl || "/img/default-avatar.jpeg";
};

const getReviewCreatedAt = (review: Review) => {
  const anyReview = review as any;
  return review.createdAt ?? anyReview.createdAt ?? null;
};

// --- COMPOSANT HEADER STATISTIQUES ---
const StatsHeader = ({ average, count }: { average: number; count: number }) => (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-6 mb-8 text-white shadow-lg flex justify-around items-center">
        <div className="text-center">
            <p className="text-4xl font-bold">{average.toFixed(1)}</p>
            <p className="text-sm text-blue-100 uppercase tracking-wide mt-1">Note Moyenne</p>
        </div>
        <div className="w-px h-16 bg-white/30"></div>
        <div className="text-center">
            <p className="text-4xl font-bold">{count}</p>
            <p className="text-sm text-blue-100 uppercase tracking-wide mt-1">Avis Reçus</p>
        </div>
    </div>
);

// --- COMPOSANT CARTE AVIS ---
const ReviewCard = ({ review }: { review: Review }) => (
    <div className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-start gap-4">
        <div className="relative w-12 h-12 flex-shrink-0">
             <Image 
                src={getReviewAuthorAvatar(review)} 
                alt="Avatar" 
                fill
                className="rounded-full object-cover border border-gray-200"
            />
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                        {getReviewAuthorName(review)}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {(() => {
                          const createdAt = getReviewCreatedAt(review);
                          if (!createdAt) return '';
                          return new Date(createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
                        })()}
                    </p>
                </div>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                    <span className="font-bold text-yellow-600 mr-1">{getReviewScore(review)}</span>
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                </div>
            </div>
            
            {review.comment ? (
                <p className="text-gray-600 mt-3 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    "{review.comment}"
                </p>
            ) : (
                <p className="text-gray-400 text-xs italic mt-2">Pas de commentaire écrit.</p>
            )}
        </div>
    </div>
);

// --- PAGE PRINCIPALE ---
const RatingsPage = () => {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    const userId = user?.user?.id;
    if (!userId) return; // Attendre que l'utilisateur soit chargé
    
    setLoading(true);
    try {
      const data = await reviewService.getReviewsForUser(userId);
      // Tri du plus récent au plus ancien
      const sorted = data.sort((a, b) => {
        const aCreatedAt = getReviewCreatedAt(a);
        const bCreatedAt = getReviewCreatedAt(b);
        const aTime = aCreatedAt ? new Date(aCreatedAt).getTime() : 0;
        const bTime = bCreatedAt ? new Date(bCreatedAt).getTime() : 0;
        return bTime - aTime;
      });
      setReviews(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger vos avis.");
    } finally {
      setLoading(false);
    }
  }, [user?.user?.id]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Calculs statistiques
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? reviews.reduce((sum, r) => sum + getReviewScore(r), 0) / reviewCount 
    : 0;

  if (loading) return <div className="text-center py-20 text-gray-500">Chargement des avis...</div>;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Mes Avis Clients</h1>
        <p className="text-gray-500 text-sm">Consultez les retours de vos passagers.</p>
      </div>

      <StatsHeader average={averageRating} count={reviewCount} />

      {reviews.length > 0 ? (
        <div className="space-y-4">
            {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
      ) : (
        <EmptyJumbotron 
            title="Aucun avis" 
            message="Vous n'avez pas encore reçu d'évaluation." 
            icon="/img/empty-box.png"
        />
      )}
    </div>
  );
};

export default RatingsPage;