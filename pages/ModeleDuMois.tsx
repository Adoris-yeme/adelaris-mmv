import React, { useState } from 'react';
import type { Modele, UserMode } from '../types';
import ModelDetail from './ModelDetail';
import ImageLightbox from '../components/ImageLightbox';
import { StarIcon, ExpandIcon } from '../components/icons';

interface ModeleDuMoisProps {
    models: Modele[];
    modelOfTheMonthId: string | null;
    onSetModelOfTheMonth: (modelId: string) => void;
    favoriteIds: string[];
    onToggleFavorite: (modelId: string) => void;
    userMode: UserMode;
    onStartOrder: (model: Modele) => void;
}

const ModeleDuMois: React.FC<ModeleDuMoisProps> = ({ models, modelOfTheMonthId, onSetModelOfTheMonth, favoriteIds, onToggleFavorite, userMode, onStartOrder }) => {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [lightboxData, setLightboxData] = useState<{ images: string[], startIndex: number } | null>(null);
    const featuredModel = models.find(model => model.id === modelOfTheMonthId);

    if (!featuredModel) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-stone-800 rounded-lg shadow-md">
                <StarIcon className="mx-auto h-12 w-12 text-stone-400 dark:text-stone-500" />
                <h3 className="mt-4 text-lg font-medium text-stone-900 dark:text-stone-100">Aucun modèle en vedette</h3>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Cliquez sur l'étoile d'un modèle dans le catalogue pour le mettre en avant ici.</p>
            </div>
        );
    }

    return (
        <>
            <div className="w-full h-full flex flex-col md:flex-row bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-2xl">
                {/* Image Section */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full bg-stone-100 dark:bg-stone-950 flex items-center justify-center p-4 relative group">
                    <img 
                        src={featuredModel.imageUrls[0]} 
                        alt={featuredModel.title}
                        className="max-w-full max-h-full w-auto h-auto object-contain cursor-pointer"
                        onClick={() => setLightboxData({ images: featuredModel.imageUrls, startIndex: 0 })}
                    />
                     <button
                        onClick={() => setLightboxData({ images: featuredModel.imageUrls, startIndex: 0 })}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Voir en grand"
                    >
                        <ExpandIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-8 sm:p-12 overflow-y-auto">
                    <div className="flex-grow flex flex-col justify-center">
                        <p className="text-sm font-semibold tracking-widest uppercase text-orange-800 dark:text-orange-400">{featuredModel.genre} / {featuredModel.event}</p>
                        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100">
                            {featuredModel.title}
                        </h1>
                         <div className="flex flex-wrap gap-2 mt-4 mb-6">
                            <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">{featuredModel.event}</span>
                            <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">{featuredModel.fabric}</span>
                            <span className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">{featuredModel.difficulty}</span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-lg">
                            {featuredModel.description}
                        </p>
                    </div>
                    <div className="mt-8 flex-shrink-0">
                        {userMode === 'client' ? (
                             <button
                                onClick={() => onStartOrder(featuredModel)}
                                className="w-full px-8 py-4 text-md font-medium bg-orange-900 text-white rounded-lg shadow-lg hover:bg-orange-800 transition-transform hover:scale-105"
                            >
                                Choisir ce modèle
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowDetailModal(true)}
                                className="w-full px-8 py-4 text-md font-medium bg-orange-900 text-white rounded-lg shadow-lg hover:bg-orange-800 transition-transform hover:scale-105"
                            >
                                Voir la galerie complète & les détails
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showDetailModal && (
                <ModelDetail 
                    model={featuredModel} 
                    onClose={() => setShowDetailModal(false)} 
                    isModelOfTheMonth={true}
                    onSetModelOfTheMonth={() => onSetModelOfTheMonth(featuredModel.id)}
                    isFavorite={favoriteIds.includes(featuredModel.id)}
                    onToggleFavorite={() => onToggleFavorite(featuredModel.id)}
                    userMode={userMode}
                    onStartOrder={() => {
                        setShowDetailModal(false);
                        onStartOrder(featuredModel);
                    }}
                />
            )}

            {lightboxData && (
                <ImageLightbox 
                    imageUrls={lightboxData.images} 
                    startIndex={lightboxData.startIndex} 
                    onClose={() => setLightboxData(null)} 
                />
            )}
        </>
    );
};

export default ModeleDuMois;