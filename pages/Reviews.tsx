
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { AtelierWithManager, Review } from '../types';

const StarRating: React.FC<{ rating: number; setRating?: (rating: number) => void }> = ({ rating, setRating }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={setRating ? () => setRating(star) : undefined}
                    className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-stone-300 dark:text-stone-600'} ${setRating ? 'cursor-pointer' : ''}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const Reviews: React.FC = () => {
    const { getReviews, addReview, getAllAteliersWithManager } = useAuth();
    const [reviews, setReviews] = useState<Review[]>(getReviews());
    const [ateliers] = useState<AtelierWithManager[]>(getAllAteliersWithManager());

    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [target, setTarget] = useState<'platform' | string>('platform'); // 'platform' or atelier.id

    // Suggestions state
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<AtelierWithManager[]>([]);
    const [cursorPosition, setCursorPosition] = useState(0);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!author || !content || rating === 0) {
            alert("Veuillez remplir tous les champs et donner une note.");
            return;
        }
        
        const reviewData: Omit<Review, 'id' | 'createdAt'> = {
            author,
            content,
            rating,
            target: target === 'platform' ? 'platform' : 'atelier',
        };

        if (target !== 'platform') {
            const atelier = ateliers.find(a => a.id === target);
            reviewData.atelierId = atelier?.id;
            reviewData.atelierName = atelier?.name;
        }

        addReview(reviewData);
        setReviews(getReviews()); // Refresh list

        // Reset form
        setAuthor('');
        setContent('');
        setRating(0);
        setTarget('platform');
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setContent(val);
        
        const selectionStart = e.target.selectionStart;
        setCursorPosition(selectionStart);

        // Simple logic: check if the word being typed starts with @
        const textBeforeCursor = val.substring(0, selectionStart);
        const lastWord = textBeforeCursor.split(/\s+/).pop();

        if (lastWord && lastWord.startsWith('@')) {
            const query = lastWord.substring(1).toLowerCase();
            const matches = ateliers.filter(a => a.name.toLowerCase().includes(query));
            setSuggestions(matches);
            setShowSuggestions(matches.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (atelier: AtelierWithManager) => {
        const textBeforeCursor = content.substring(0, cursorPosition);
        const lastWord = textBeforeCursor.split(/\s+/).pop();
        
        if (lastWord && lastWord.startsWith('@')) {
            const newText = 
                content.substring(0, cursorPosition - lastWord.length) + 
                `@${atelier.name} ` + 
                content.substring(cursorPosition);
            
            setContent(newText);
            setTarget(atelier.id); // Auto-select target
            setShowSuggestions(false);
            
            // Focus back to textarea
            if (textAreaRef.current) {
                textAreaRef.current.focus();
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                 <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Avis & Témoignages</h1>
                <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Laissez votre avis</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 relative">
                        <div>
                            <label className="block text-sm font-medium">Votre nom</label>
                            <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Votre avis concerne</label>
                            <select value={target} onChange={e => setTarget(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600">
                                <option value="platform">La plateforme MMV Couture</option>
                                {ateliers.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium">Votre message (tapez @ pour mentionner un atelier)</label>
                            <textarea 
                                ref={textAreaRef}
                                value={content} 
                                onChange={handleContentChange} 
                                rows={4} 
                                className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600"
                            ></textarea>
                            
                            {showSuggestions && (
                                <ul className="absolute z-10 w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                                    {suggestions.map(atelier => (
                                        <li 
                                            key={atelier.id}
                                            onClick={() => selectSuggestion(atelier)}
                                            className="px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-700 cursor-pointer text-sm"
                                        >
                                            <span className="font-bold">{atelier.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Votre note</label>
                            <StarRating rating={rating} setRating={setRating} />
                        </div>
                        <button type="submit" className="w-full py-2 bg-orange-900 text-white rounded-md hover:bg-orange-800">Envoyer</button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
                 <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Ce que nos utilisateurs disent</h2>
                {reviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-stone-800/50 p-5 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="font-bold">{review.author}</p>
                                <p className="text-xs text-stone-500 dark:text-stone-400">
                                    Avis sur : <span className="font-semibold">{review.target === 'platform' ? 'MMV Couture' : review.atelierName}</span>
                                </p>
                            </div>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="mt-3 text-stone-600 dark:text-stone-300">{review.content}</p>
                        {review.response && (
                            <div className="mt-4 pl-4 border-l-2 border-orange-200 dark:border-orange-800">
                                <p className="text-xs font-bold text-orange-900 dark:text-orange-400">Réponse de l'atelier :</p>
                                <p className="text-sm text-stone-500 dark:text-stone-400 italic">{review.response}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
