
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { Review } from '../types';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`text-xl ${star <= rating ? 'text-yellow-400' : 'text-stone-300 dark:text-stone-600'}`}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

const AvisAtelier: React.FC = () => {
    const { getReviews, respondToReview, atelier } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [respondingTo, setRespondingTo] = useState<string | null>(null);
    const [responseText, setResponseText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!atelier) return;
        let mounted = true;
        setIsLoading(true);
        getReviews()
            .then((r) => {
                if (!mounted) return;
                setReviews(r.filter(x => x.atelierId === atelier.id));
            })
            .catch(() => {
                if (!mounted) return;
                setReviews([]);
            })
            .finally(() => {
                if (!mounted) return;
                setIsLoading(false);
            });
        return () => { mounted = false; };
    }, [atelier, getReviews]);

    const handleRespond = async (reviewId: string) => {
        await respondToReview(reviewId, responseText);
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, response: responseText } : r));
        setRespondingTo(null);
        setResponseText('');
    };

    if (!atelier) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Avis de l'Atelier</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">Consultez ce que vos clients disent de vous.</p>
            </div>

            <div className="space-y-4">
                {isLoading && <div>Chargement...</div>}
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold text-lg text-stone-800 dark:text-stone-100">{review.author}</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-400">
                                        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="text-stone-600 dark:text-stone-300 italic mb-4">"{review.content}"</p>
                            
                            {review.response ? (
                                <div className="ml-6 pl-4 border-l-2 border-orange-200 dark:border-orange-800 bg-stone-50 dark:bg-stone-700/30 p-3 rounded-r-md">
                                    <p className="text-xs font-bold text-orange-900 dark:text-orange-400 mb-1">Votre réponse :</p>
                                    <p className="text-sm text-stone-600 dark:text-stone-300">{review.response}</p>
                                </div>
                            ) : (
                                <div>
                                    {respondingTo === review.id ? (
                                        <div className="mt-4 animate-fade-in">
                                            <textarea
                                                value={responseText}
                                                onChange={(e) => setResponseText(e.target.value)}
                                                className="w-full p-2 border rounded-md bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 text-sm"
                                                placeholder="Écrivez votre réponse ici..."
                                                rows={3}
                                            ></textarea>
                                            <div className="flex gap-2 mt-2">
                                                <button 
                                                    onClick={() => handleRespond(review.id)}
                                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                                >
                                                    Envoyer
                                                </button>
                                                <button 
                                                    onClick={() => setRespondingTo(null)}
                                                    className="px-3 py-1 bg-stone-200 dark:bg-stone-600 text-stone-700 dark:text-stone-300 text-xs rounded hover:bg-stone-300"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setRespondingTo(review.id)}
                                            className="text-sm text-orange-800 dark:text-orange-400 hover:underline"
                                        >
                                            Répondre
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-lg shadow-md">
                        <p className="text-stone-500 dark:text-stone-400">Aucun avis reçu pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvisAtelier;
