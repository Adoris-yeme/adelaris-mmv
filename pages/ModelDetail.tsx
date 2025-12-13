
import React, { useState, useRef } from 'react';
import type { Modele, UserMode } from '../types';
import ImageLightbox from '../components/ImageLightbox';
import { ExpandIcon, ChevronLeftIcon } from '../components/icons';

interface ModelDetailProps {
  model: Modele;
  onClose: () => void;
  isModelOfTheMonth?: boolean;
  onSetModelOfTheMonth?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  userMode: UserMode;
  onStartOrder?: () => void;
}

const ModelDetail: React.FC<ModelDetailProps> = ({ model, onClose, isModelOfTheMonth, onSetModelOfTheMonth, isFavorite, onToggleFavorite, userMode, onStartOrder }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const { imageUrls } = model;
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const isSwipingRef = useRef(false);

  if (!imageUrls || imageUrls.length === 0) {
      imageUrls.push('https://placehold.co/400x500/e2e8f0/78350f?text=Mod%C3%A8le');
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = e.targetTouches[0].clientX;
    isSwipingRef.current = false;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
    isSwipingRef.current = true;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(swipeDistance) > 50) { // Min swipe distance
        if (swipeDistance > 0) { // Swipe left
            setSelectedImageIndex(prev => (prev + 1) % imageUrls.length);
        } else { // Swipe right
            setSelectedImageIndex(prev => (prev - 1 + imageUrls.length) % imageUrls.length);
        }
    }
    // Reset swipe flag after a short delay to allow onClick to check it
    setTimeout(() => { isSwipingRef.current = false; }, 100);
  };

  const handleImageClick = () => {
      // Only open lightbox if we weren't swiping
      if (Math.abs(touchStartXRef.current - touchEndXRef.current) < 10) {
          setShowLightbox(true);
      }
  };
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-title"
      >
        <div 
          className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-slide-up relative"
          onClick={(e) => e.stopPropagation()}
        >
           <button onClick={onClose} className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/50 text-stone-800 dark:text-white shadow-md transition-all duration-300 hover:scale-105 backdrop-blur-sm" aria-label="Retour">
              <ChevronLeftIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Retour</span>
          </button>

          <div className="w-full md:w-1/2 flex flex-col bg-stone-100 dark:bg-stone-950 relative group">
            <div 
              className="flex-1 flex items-center justify-center overflow-hidden cursor-zoom-in"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={handleImageClick}
            >
              <div className="w-full h-full flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}>
                {imageUrls.map((url, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center p-4">
                        <img src={url} alt={`${model.title} - vue ${index + 1}`} className="max-w-full max-h-full w-auto h-auto object-contain" />
                    </div>
                ))}
              </div>
            </div>
             <button
                onClick={(e) => { e.stopPropagation(); setShowLightbox(true); }}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
                aria-label="Voir en grand"
            >
                <ExpandIcon className="h-5 w-5" />
            </button>
            {imageUrls && imageUrls.length > 1 && (
              <div className="flex justify-center p-2 space-x-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                {imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(index); }}
                    className={`w-16 h-20 rounded-md overflow-hidden transition-all duration-200 ${
                      index === selectedImageIndex ? 'ring-2 ring-orange-500' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
              <div className="flex justify-between items-start gap-4">
                <h2 id="model-title" className="flex-1 text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 pr-2">{model.title}</h2>
                <div className="flex items-center gap-2">
                  {userMode === 'manager' && onSetModelOfTheMonth && (
                      <button
                          onClick={onSetModelOfTheMonth}
                          className={`p-2 rounded-full transition-colors ${isModelOfTheMonth ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-400' : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
                          aria-label={isModelOfTheMonth ? 'Retirer des modèles du mois' : 'Mettre en vedette'}
                      >
                          <svg className="h-6 w-6" fill={isModelOfTheMonth ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                      </button>
                  )}
                  {onToggleFavorite && (
                      <button
                          onClick={onToggleFavorite}
                          className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-400' : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
                          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                      </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 mb-5">
                  <span className="inline-block bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 text-xs font-medium px-2.5 py-1 rounded-full">{model.genre}</span>
                  <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">{model.event}</span>
                  <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">{model.fabric}</span>
                  <span className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">{model.difficulty}</span>
              </div>
              
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {model.description}
              </p>
            </div>
            
            <div className="p-6 sm:p-8 border-t border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
              {userMode === 'client' && onStartOrder ? (
                  <button
                      onClick={onStartOrder}
                      className="w-full flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-transform hover:scale-105"
                  >
                      Choisir ce modèle
                  </button>
              ) : model.patron_pdf_link ? (
                  <a 
                      href={model.patron_pdf_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-transform hover:scale-105"
                  >
                      Voir le patron (PDF)
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
              ) : (
                  <p className="text-sm text-center text-stone-500 dark:text-stone-400">Aucun patron PDF disponible pour ce modèle.</p>
              )}
            </div>
          </div>
        </div>
        <style>{`
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

            @keyframes slide-up {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
          `}</style>
      </div>
      {showLightbox && (
        <ImageLightbox
          imageUrls={model.imageUrls}
          startIndex={selectedImageIndex}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </>
  );
};

export default ModelDetail;
