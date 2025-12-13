import React, { useState, useMemo } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { Modele } from '../types';
import ModelCard from '../components/ModelCard';
import ImageLightbox from '../components/ImageLightbox';
import ShowroomOrderModal from '../components/ShowroomOrderModal';

const GENRE_OPTIONS = ['Tous', 'Femme', 'Homme', 'Enfant'];
const EVENT_OPTIONS: (Modele['event'] | 'Tous')[] = ['Tous', 'Quotidien', 'Cérémonie', 'Soirée', 'Mariage'];

const Showroom: React.FC = () => {
    const { getShowcaseModels, registerClientAndOrderFromShowroom } = useAuth();
    const [models] = useState<Modele[]>(getShowcaseModels());
    
    const [searchQuery, setSearchQuery] = useState('');
    const [genreFilter, setGenreFilter] = useState('Tous');
    const [eventFilter, setEventFilter] = useState<(Modele['event'] | 'Tous')>('Tous');
    
    const [orderingModel, setOrderingModel] = useState<Modele | null>(null);
    const [lightboxData, setLightboxData] = useState<{ images: string[], startIndex: number } | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

    const filteredModels = useMemo(() => {
        return models.filter(model => {
            const searchMatch = model.title.toLowerCase().includes(searchQuery.toLowerCase()) || model.atelierName.toLowerCase().includes(searchQuery.toLowerCase());
            const genreMatch = genreFilter === 'Tous' || model.genre === genreFilter;
            const eventMatch = eventFilter === 'Tous' || model.event === eventFilter;
            return searchMatch && genreMatch && eventMatch;
        });
    }, [models, searchQuery, genreFilter, eventFilter]);
    
    const handlePlaceOrder = async (model: Modele, clientInfo: { name: string, phone: string, email?: string }) => {
        const success = await registerClientAndOrderFromShowroom(model, clientInfo);
        if (success) {
            setOrderingModel(null);
            setConfirmationMessage(`Merci ${clientInfo.name} ! Votre commande a été transmise à l'atelier ${model.atelierName}. Vous serez contacté(e) sous peu.`);
        } else {
            alert("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Salle d'Exposition</h1>
            
            <div className="bg-white dark:bg-stone-800/50 p-4 rounded-lg shadow-sm space-y-4">
                <input
                    type="text"
                    placeholder="Rechercher un modèle ou un atelier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-4 pr-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800"
                />
                 <div className="flex items-center gap-2 p-1 bg-stone-100 dark:bg-stone-900 rounded-lg overflow-x-auto">
                    {GENRE_OPTIONS.map(genre => (
                        <button key={genre} onClick={() => setGenreFilter(genre)} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${genreFilter === genre ? 'bg-white dark:bg-stone-700 shadow-sm' : 'hover:bg-white/50'}`}>
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredModels.map(model => (
                    <div key={model.id} className="relative group">
                        <ModelCard
                            model={model}
                            onClick={() => {}}
                            userMode="client"
                            onViewLarger={(e) => { e.stopPropagation(); setLightboxData({ images: model.imageUrls, startIndex: 0 }); }}
                            onStartOrder={(e) => { e.stopPropagation(); setOrderingModel(model); }}
                        />
                         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg pointer-events-none">
                            <p className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">Créé par: {model.atelierName}</p>
                        </div>
                    </div>
                ))}
            </div>

            {orderingModel && (
                <ShowroomOrderModal
                    model={orderingModel}
                    onClose={() => setOrderingModel(null)}
                    onPlaceOrder={(clientInfo) => handlePlaceOrder(orderingModel, clientInfo)}
                />
            )}

            {lightboxData && (
                <ImageLightbox 
                    imageUrls={lightboxData.images} 
                    startIndex={lightboxData.startIndex} 
                    onClose={() => setLightboxData(null)} 
                />
            )}
            
            {confirmationMessage && (
                <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={() => setConfirmationMessage(null)}>
                     <div className="bg-white dark:bg-stone-800 rounded-lg p-8 text-center max-w-md">
                        <h3 className="text-xl font-bold text-green-600">Félicitations !</h3>
                        <p className="mt-2 text-stone-600 dark:text-stone-300">{confirmationMessage}</p>
                        <button onClick={() => setConfirmationMessage(null)} className="mt-6 w-full px-4 py-2 bg-orange-900 text-white rounded-md">Fermer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Showroom;
