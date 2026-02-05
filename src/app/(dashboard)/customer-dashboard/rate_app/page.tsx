"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { reviewService } from '@/service/reviewService';

// ID constant pour l'application (même que sur mobile)
const APPLICATION_ENTITY_ID = "00000000-0000-0000-0000-000000000001";

// Critères de notation
const RATING_CRITERIA = [
  { key: 'ease_of_use', label: 'Facilité d\'utilisation' },
  { key: 'reliability', label: 'Fiabilité / Stabilité' },
  { key: 'features', label: 'Fonctionnalités' },
  { key: 'support', label: 'Support Client' },
];

type CriteriaRatings = {
  [key: string]: number;
};

// Composant pour une ligne de critère
const CriteriaRow = ({ label, rating, onRate }: { label: string, rating: number, onRate: (score: number) => void }) => (
    <div className="mb-6">
        <p className="text-gray-600 font-medium mb-2">{label}</p>
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button 
                    key={star} 
                    type="button" 
                    onClick={() => onRate(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                >
                    {star <= rating ? (
                        <StarIcon className="w-8 h-8 text-yellow-400" />
                    ) : (
                        <StarIconOutline className="w-8 h-8 text-gray-300 hover:text-yellow-200" />
                    )}
                </button>
            ))}
        </div>
    </div>
);

const RateAppPage = () => {
  const [ratings, setRatings] = useState<CriteriaRatings>({});
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRateCriterion = (key: string, score: number) => {
    setRatings(prev => ({ ...prev, [key]: score }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(ratings).length === 0) {
        toast.error("Veuillez noter au moins un aspect.");
        return;
    }

    setIsLoading(true);
    try {
        // 1. Envoyer les notes par critères
        await reviewService.rateByCriteria(APPLICATION_ENTITY_ID, ratings);

        // 2. Envoyer le commentaire global si présent
        if (comment.trim() !== '') {
            const scores = Object.values(ratings);
            const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
            await reviewService.createReview({
              subjectId: APPLICATION_ENTITY_ID,
              subjectType: "PLATFORM",
              reviewType: "RATING",
              rating: averageScore,
              comment,
            });
        }

        setSubmitted(true);
        toast.success("Merci pour votre retour !");
    } catch (error) {
        console.error(error);
        toast.error("Erreur lors de l'envoi.");
    } finally {
        setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-sm text-center max-w-lg mx-auto mt-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Merci pour votre avis !</h2>
        <p className="text-gray-600">Vos commentaires nous aident à améliorer la plateforme pour tout le monde.</p>
        <button 
            onClick={() => { setSubmitted(false); setRatings({}); setComment(''); }}
            className="mt-6 text-blue-600 font-medium hover:underline"
        >
            Noter à nouveau
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white text-center shadow-lg">
        <StarIcon className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
        <h1 className="text-3xl font-bold mb-2">Évaluez Votre Expérience</h1>
        <p className="text-purple-100">Vos retours détaillés sont précieux pour nous !</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
            Comment évalueriez-vous ces aspects ?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-x-8">
            {RATING_CRITERIA.map(criterion => (
                <CriteriaRow
                    key={criterion.key}
                    label={criterion.label}
                    rating={ratings[criterion.key] || 0}
                    onRate={(score) => handleRateCriterion(criterion.key, score)}
                />
            ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100">
            <label htmlFor="feedback" className="block text-lg font-bold text-gray-800 mb-3">
                Laissez un commentaire (facultatif)
            </label>
            <textarea
                id="feedback"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50"
                rows={4}
                placeholder="Des suggestions, des remarques ? Dites-nous tout..."
            ></textarea>
        </div>
        
        <div className="mt-8 flex justify-end">
            <button
                type="submit"
                disabled={isLoading || Object.keys(ratings).length === 0}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
                {isLoading ? 'Envoi en cours...' : 'Envoyer mon évaluation'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default RateAppPage;