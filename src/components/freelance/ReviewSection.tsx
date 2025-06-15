"use client"
import React, { useState } from 'react'
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface ReviewPageProps {
initialReviews: Review[];
recentClients:{id:string,name:string}[]
}

const ReviewSection: React.FC<ReviewPageProps> = ({ initialReviews,recentClients }) => {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [clientRating, setClientRating] = useState<number>(0);
    const [clientComment, setClientComment] = useState<string>('');
    // const handleHideReview = async (reviewId: string) => {
    //     try {
    //       await axios.put(`/api/driver/reviews/${reviewId}/hide`);
    //       setReviews(prevReviews =>
    //         prevReviews.map(review =>
    //           review.id === reviewId ? { ...review, isHidden: !review.isHidden } : review
    //         )
    //       );
    //     } catch (error) {
    //       console.error('Erreur lors du masquage/affichage du commentaire:', error);
    //     }
    //   };
    
    //   const handleSubmitClientRating = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!selectedClient || clientRating === 0) return;
    
    //     try {
    //       const response = await axios.post('/api/driver/rate-client', {
    //         clientId: selectedClient,
    //         rating: clientRating,
    //         comment: clientComment
    //       });
    //       // Réinitialiser le formulaire après soumission
    //       setSelectedClient('');
    //       setClientRating(0);
    //       setClientComment('');
    //       // Vous pourriez ajouter une notification de succès ici
    //     } catch (error) {
    //       console.error('Erreur lors de l\'évaluation du client:', error);
    //       // Vous pourriez ajouter une notification d'erreur ici
    //     }
    //   };
  return (
    <>
      <div className="container mx-auto text px-4 py-8">
        <h1 className="title font-bold mb-2">Reviews</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="font-semibold">Customer comments</h2>
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.review_id} className={`border-b py-4 ${review.is_hidden ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{review.user_id}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(review.update_at), 'dd MMMM yyyy', { locale: enUS })}
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    // onClick={() => handleHideReview(review.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {review.is_hidden ? 'Show' : 'Hide'}
                  </button>
                </div>
                <p className="mt-2">{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No Comments yet.</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Rate a customer</h2>
          {/* <form onSubmit={handleSubmitClientRating}> */}
          <form action="">
            <div className="mb-4">
              <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                Select a customer
              </label>
              <select
                id="client"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Choose one customer</option>
                {recentClients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Rate</label>
              <div className="flex mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setClientRating(star)}
                    className={`text-2xl ${star <= clientRating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Comment (optionnal)
              </label>
              <textarea
                id="comment"
                value={clientComment}
                onChange={(e) => setClientComment(e.target.value)}
                rows={3}
                className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Votre commentaire ici..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit review
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default ReviewSection