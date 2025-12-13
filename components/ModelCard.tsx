import React from 'react';
import type { Modele, UserMode } from '../types';
import { ExpandIcon } from './icons';

interface ModelCardProps {
    model: Modele;
    onClick: () => void;
    isModelOfTheMonth?: boolean;
    onSetModelOfTheMonth?: (event: React.MouseEvent) => void;
    isFavorite?: boolean;
    onToggleFavorite?: (event: React.MouseEvent) => void;
    onViewLarger?: (event: React.MouseEvent) => void;
    userMode: UserMode;
    onStartOrder?: (event: React.MouseEvent) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onClick, isModelOfTheMonth, onSetModelOfTheMonth, isFavorite, onToggleFavorite, onViewLarger, userMode, onStartOrder }) => (
  <div onClick={onClick} className="bg-white dark:bg-stone-800 rounded-lg shadow-md overflow-hidden group transition-all hover:shadow-xl flex flex-col cursor-pointer">
    <div className="aspect-[4/5] overflow-hidden relative">
        {onSetModelOfTheMonth && (
            <button
                onClick={onSetModelOfTheMonth}
                className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors duration-200 ${isModelOfTheMonth ? 'bg-yellow-100 text-yellow-500 dark:bg-yellow-900/50 dark:text-yellow-400' : 'bg-white/70 text-stone-700 dark:bg-stone-900/50 dark:text-stone-300 backdrop-blur-sm hover:bg-white dark:hover:bg-stone-700'}`}
                aria-label="Mettre en vedette"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </button>
        )}
        {onToggleFavorite && (
            <button
                onClick={onToggleFavorite}
                className={`absolute top-3 left-3 z-10 p-2 rounded-full transition-colors duration-200 ${isFavorite ? 'bg-red-100 text-red-500 dark:bg-red-900/50 dark:text-red-400' : 'bg-white/70 text-stone-700 dark:bg-stone-900/50 dark:text-stone-300 backdrop-blur-sm hover:bg-white dark:hover:bg-stone-700'}`}
                aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
        )}
        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={model.imageUrls?.[0] || 'https://placehold.co/400x500/e2e8f0/78350f?text=Mod%C3%A8le'} alt={model.title} />
        {onViewLarger && (
          <button
              onClick={onViewLarger}
              className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Voir en grand"
          >
              <ExpandIcon className="w-8 h-8 text-white" />
          </button>
        )}
    </div>
    <div className="p-4 flex-grow flex flex-col">
      <h3 className="text-md font-bold text-stone-800 dark:text-stone-100 flex-grow group-hover:text-orange-900 dark:group-hover:text-orange-400 transition-colors">{model.title}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase">{model.genre}</span>
        <span className="text-xs bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-full">{model.difficulty}</span>
      </div>
      <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden">
          <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700">
              <p className="text-sm text-stone-600 dark:text-stone-300"><span className="font-semibold">Pour:</span> {model.event}</p>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1"><span className="font-semibold">Tissu:</span> {model.fabric}</p>
          </div>
      </div>
    </div>
    {userMode === 'client' && onStartOrder && (
        <div className="p-2 pt-0">
            <button
                onClick={onStartOrder}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800 transition-colors"
            >
                Choisir ce modèle
            </button>
        </div>
    )}
  </div>
);

export default ModelCard;