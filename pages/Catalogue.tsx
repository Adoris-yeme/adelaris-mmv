import React, { useState, useMemo } from 'react';
import type { Modele, UserMode } from '../types';
import ModelDetail from './ModelDetail';
import ModelCard from '../components/ModelCard';
import ImageLightbox from '../components/ImageLightbox';

interface CatalogueProps {
  models: Modele[];
  modelOfTheMonthId: string | null;
  onSetModelOfTheMonth: (modelId: string) => void;
  favoriteIds: string[];
  onToggleFavorite: (modelId: string) => void;
  userMode: UserMode;
  onStartOrder: (model: Modele) => void;
}

const GENRE_OPTIONS = ['Tous', 'Femme', 'Homme', 'Enfant'];
const EVENT_OPTIONS: (Modele['event'] | 'Tous')[] = ['Tous', 'Quotidien', 'Cérémonie', 'Soirée', 'Mariage'];

const Catalogue: React.FC<CatalogueProps> = ({ models, modelOfTheMonthId, onSetModelOfTheMonth, favoriteIds, onToggleFavorite, userMode, onStartOrder }) => {
  const [selectedModel, setSelectedModel] = useState<Modele | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('Tous');
  const [eventFilter, setEventFilter] = useState<(Modele['event'] | 'Tous')>('Tous');
  const [difficultyFilter, setDifficultyFilter] = useState('Tous');
  const [lightboxData, setLightboxData] = useState<{ images: string[], startIndex: number } | null>(null);

  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const searchMatch = model.title.toLowerCase().includes(searchQuery.toLowerCase());
      const genreMatch = genreFilter === 'Tous' || model.genre === genreFilter;
      const eventMatch = eventFilter === 'Tous' || model.event === eventFilter;
      const difficultyMatch = difficultyFilter === 'Tous' || model.difficulty === difficultyFilter;
      return searchMatch && genreMatch && difficultyMatch && eventMatch;
    });
  }, [models, searchQuery, genreFilter, difficultyFilter, eventFilter]);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Catalogue de Modèles</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">Explorez, filtrez et trouvez l'inspiration pour vos prochaines créations.</p>
          </div>
      </div>

      <div className="bg-white dark:bg-stone-800/50 p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-stone-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Rechercher un modèle..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md leading-5 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
            </div>
            <div className="flex-shrink-0">
                 <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="block w-full md:w-auto px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                    <option value="Tous">Toutes difficultés</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                </select>
            </div>
        </div>
        <div className="flex items-center gap-2 p-1 bg-stone-100 dark:bg-stone-900 rounded-lg overflow-x-auto">
            {GENRE_OPTIONS.map(genre => (
                <button
                    key={genre}
                    onClick={() => setGenreFilter(genre)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex-shrink-0 ${
                        genreFilter === genre
                            ? 'bg-white dark:bg-stone-700 text-orange-900 dark:text-white shadow-sm'
                            : 'text-stone-600 dark:text-stone-300 hover:bg-white/50 dark:hover:bg-stone-800'
                    }`}
                >
                    {genre}
                </button>
            ))}
        </div>
        <div className="flex items-center gap-2 p-1 bg-stone-100 dark:bg-stone-900 rounded-lg overflow-x-auto">
            {EVENT_OPTIONS.map(event => (
                <button
                    key={event}
                    onClick={() => setEventFilter(event)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex-shrink-0 ${
                        eventFilter === event
                            ? 'bg-white dark:bg-stone-700 text-orange-900 dark:text-white shadow-sm'
                            : 'text-stone-600 dark:text-stone-300 hover:bg-white/50 dark:hover:bg-stone-800'
                    }`}
                >
                    {event}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredModels.map(model => (
          <ModelCard 
            key={model.id} 
            model={model} 
            onClick={() => setSelectedModel(model)}
            isModelOfTheMonth={modelOfTheMonthId === model.id}
            onSetModelOfTheMonth={userMode === 'manager' ? (e) => {
                e.stopPropagation();
                onSetModelOfTheMonth(model.id);
            } : undefined}
            isFavorite={favoriteIds.includes(model.id)}
            onToggleFavorite={(e) => {
                e.stopPropagation();
                onToggleFavorite(model.id);
            }}
            onViewLarger={(e) => {
                e.stopPropagation();
                if (model.imageUrls && model.imageUrls.length > 0) {
                    setLightboxData({ images: model.imageUrls, startIndex: 0 });
                }
            }}
            userMode={userMode}
            onStartOrder={(e) => {
                e.stopPropagation();
                onStartOrder(model);
            }}
          />
        ))}
      </div>
      
      {selectedModel && (
        <ModelDetail 
            model={selectedModel} 
            onClose={() => setSelectedModel(null)} 
            isModelOfTheMonth={modelOfTheMonthId === selectedModel.id}
            onSetModelOfTheMonth={userMode === 'manager' ? () => onSetModelOfTheMonth(selectedModel.id) : undefined}
            isFavorite={favoriteIds.includes(selectedModel.id)}
            onToggleFavorite={() => onToggleFavorite(selectedModel.id)}
            userMode={userMode}
            onStartOrder={() => onStartOrder(selectedModel)}
        />
      )}

      {lightboxData && (
        <ImageLightbox 
            imageUrls={lightboxData.images} 
            startIndex={lightboxData.startIndex} 
            onClose={() => setLightboxData(null)} 
        />
      )}
    </div>
  );
};

export default Catalogue;