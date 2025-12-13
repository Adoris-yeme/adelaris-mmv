

import React, { useState, useRef, useEffect } from 'react';
import type { Page, Modele, UserMode } from '../types';
import ImageLightbox from '../components/ImageLightbox';
import { ExpandIcon, ChevronLeftIcon, ChevronRightIcon, TrackIcon, AgendaIcon } from '../components/icons';

interface AccueilProps {
    models: Modele[];
    setCurrentPage: (page: Page) => void;
    userMode: UserMode;
}

const Accueil: React.FC<AccueilProps> = ({ models, setCurrentPage, userMode }) => {
    const [lightboxData, setLightboxData] = useState<{ images: string[], startIndex: number } | null>(null);
    
    const mariageModels = models.filter(m => m.event === 'Mariage').slice(0, 5);
    const ceremonieModels = models.filter(m => m.event === 'Cérémonie').slice(0, 5);
    const quotidienModels = models.filter(m => m.event === 'Quotidien').slice(0, 5);
    const soireeModels = models.filter(m => m.event === 'Soirée').slice(0, 5);

    const handleViewLarger = (model: Modele) => {
        if (model.imageUrls && model.imageUrls.length > 0) {
            setLightboxData({ images: model.imageUrls, startIndex: 0 });
        }
    };

    const ThemeSection: React.FC<{ title: string, models: Modele[] }> = ({ title, models }) => {
        const scrollContainerRef = useRef<HTMLDivElement>(null);
        const [showLeftArrow, setShowLeftArrow] = useState(false);
        const [showRightArrow, setShowRightArrow] = useState(true);


        const scroll = (direction: 'left' | 'right') => {
            if (scrollContainerRef.current) {
                const { current } = scrollContainerRef;
                const scrollAmount = current.offsetWidth * 0.8;
                current.scrollBy({
                    left: direction === 'left' ? -scrollAmount : scrollAmount,
                    behavior: 'smooth'
                });
            }
        };
        
        const checkArrows = () => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                setShowLeftArrow(scrollLeft > 0);
                // Check if we are at the end (with a small tolerance)
                setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
            }
        };

        useEffect(() => {
            const currentRef = scrollContainerRef.current;
            if (currentRef) {
                currentRef.addEventListener('scroll', checkArrows, { passive: true });
                checkArrows();
            }
            return () => {
                if (currentRef) {
                    currentRef.removeEventListener('scroll', checkArrows);
                }
            };
        }, []);


        if (models.length === 0) return null;

        return (
            <div className="py-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{title}</h2>
                    <button onClick={() => setCurrentPage('catalogue')} className="text-sm font-semibold text-orange-800 dark:text-orange-400 hover:underline">
                        Tout voir
                    </button>
                </div>
                <div className="relative">
                    {/* FIX: Removed obsolete comment */}
                    <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {models.map(model => (
                            <div key={model.id} className="snap-start flex-shrink-0 w-[280px]">
                                <div className="bg-white dark:bg-stone-800 rounded-lg shadow-md overflow-hidden group transition-all hover:shadow-xl flex flex-col h-full">
                                    <div className="aspect-[4/5] overflow-hidden relative">
                                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={model.imageUrls?.[0]} alt={model.title} />
                                        <button
                                            onClick={() => handleViewLarger(model)}
                                            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
                                            aria-label="Voir en grand"
                                        >
                                            <ExpandIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="p-4 flex-grow flex flex-col">
                                        <h3 className="text-md font-bold text-stone-800 dark:text-stone-100">{model.title}</h3>
                                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-auto pt-2">{model.fabric}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {showLeftArrow && (
                        <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 shadow-md hover:scale-110 transition-transform">
                            <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                    )}
                    {showRightArrow && (
                        <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 shadow-md hover:scale-110 transition-transform">
                            <ChevronRightIcon className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="space-y-8">
                <div className="text-center py-12 px-4 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-stone-800 dark:to-orange-900/50 rounded-2xl shadow-inner-lg">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-orange-900 dark:text-orange-300 tracking-tight">L'Élégance sur Mesure</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-stone-600 dark:text-stone-300">
                        Découvrez nos créations uniques, issues d'un savoir-faire artisanal.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button 
                            onClick={() => setCurrentPage('catalogue')} 
                            className="w-full sm:w-auto px-8 py-3 text-md font-medium bg-orange-900 text-white rounded-lg shadow-lg hover:bg-orange-800 transition-transform hover:scale-105"
                        >
                            Explorer le Catalogue
                        </button>
                        <button 
                            onClick={() => setCurrentPage('suiviCommande')} 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-md font-medium bg-white/80 dark:bg-stone-700/50 text-orange-900 dark:text-orange-300 rounded-lg shadow-lg hover:bg-white dark:hover:bg-stone-700 transition-all backdrop-blur-sm"
                        >
                            <TrackIcon className="h-5 w-5" />
                            <span>Suivre ma commande</span>
                        </button>
                         {userMode === 'client' && (
                            <button 
                                onClick={() => setCurrentPage('requestAppointment')} 
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-md font-medium bg-white/80 dark:bg-stone-700/50 text-orange-900 dark:text-orange-300 rounded-lg shadow-lg hover:bg-white dark:hover:bg-stone-700 transition-all backdrop-blur-sm"
                            >
                                <AgendaIcon className="h-5 w-5" />
                                <span>Prendre rendez-vous</span>
                            </button>
                        )}
                    </div>
                </div>
                
                <ThemeSection title="Spécial Mariage" models={mariageModels} />
                <ThemeSection title="Pour les grandes Cérémonies" models={ceremonieModels} />
                <ThemeSection title="Au Quotidien" models={quotidienModels} />
                <ThemeSection title="Pour vos Soirées" models={soireeModels} />
            </div>

            {lightboxData && (
                <ImageLightbox 
                    imageUrls={lightboxData.images} 
                    startIndex={lightboxData.startIndex} 
                    onClose={() => setLightboxData(null)} 
                />
            )}
            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                .overflow-x-auto::-webkit-scrollbar {
                  display: none;
                }
            `}</style>
        </>
    );
};

export default Accueil;