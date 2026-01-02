import React from 'react';

export default function ReviewForm({ driverId, onSuccess }) {
  // Simple form skeleton, adapt fields as needed
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add review submission logic here
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="review" className="block font-semibold mb-1">Votre avis</label>
        <textarea id="review" name="review" className="w-full border rounded p-2" rows={4} required />
      </div>
      <div>
        <label htmlFor="score" className="block font-semibold mb-1">Note</label>
        <input id="score" name="score" type="number" min={1} max={5} className="w-20 border rounded p-2" required />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Envoyer</button>
    </form>
  );
}
