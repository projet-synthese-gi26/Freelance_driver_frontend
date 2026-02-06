import React, { useState } from 'react';
import { reviewService } from '@/service/reviewService';
import { toast } from 'react-hot-toast';

export default function ReviewForm({ subjectId, subjectType, driverId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resolvedSubjectId = subjectId || driverId;
    const resolvedSubjectType = subjectType || (driverId ? "DRIVER" : undefined);

    if (!resolvedSubjectId || !resolvedSubjectType) {
      toast.error("Sujet introuvable.");
      return;
    }
    setIsSubmitting(true);
    try {
      const createdReview = await reviewService.createReview({
        subjectId: resolvedSubjectId,
        subjectType: resolvedSubjectType,
        reviewType: "RATING",
        rating: Number(rating),
        comment: comment.trim(),
      });
      toast.success("Merci pour votre avis !");
      setComment('');
      setRating(5);
      if (onSuccess) onSuccess(createdReview);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis:", error);
      toast.error("Impossible d'envoyer l'avis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="review" className="block font-semibold mb-1">Votre avis</label>
        <textarea
          id="review"
          name="review"
          className="w-full border rounded p-2"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="score" className="block font-semibold mb-1">Note</label>
        <input
          id="score"
          name="score"
          type="number"
          min={1}
          max={5}
          className="w-20 border rounded p-2"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
