import React, { useState, useEffect, useRef } from 'react';
import type { Modele } from '../types';
import { compressImage } from '../utils/image';

interface AddModelFormProps {
    onSaveModel: (model: Modele) => void;
    onCancel: () => void;
    modelToEdit?: Modele | null;
}

const AddModelForm: React.FC<AddModelFormProps> = ({ onSaveModel, onCancel, modelToEdit }) => {
    // State for form fields
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState<'Homme' | 'Femme' | 'Enfant'>('Femme');
    const [event, setEvent] = useState<Modele['event']>('Quotidien');
    const [fabric, setFabric] = useState('');
    const [difficulty, setDifficulty] = useState<'Débutant' | 'Intermédiaire' | 'Avancé'>('Débutant');
    const [description, setDescription] = useState('');
    
    // State for image handling
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageError, setImageError] = useState('');
    
    // Desktop Drag & Drop state
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

    // Touch Drag & Drop refs
    const dragItem = useRef<number | null>(null);

    const isEditing = !!modelToEdit;

    useEffect(() => {
        if (isEditing && modelToEdit) {
            setTitle(modelToEdit.title);
            setGenre(modelToEdit.genre);
            setEvent(modelToEdit.event);
            setFabric(modelToEdit.fabric);
            setDifficulty(modelToEdit.difficulty);
            setDescription(modelToEdit.description);
            setImagePreviews(modelToEdit.imageUrls || []);
        }
    }, [modelToEdit, isEditing]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageError('');
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newPreviews: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) {
                setImageError('Un ou plusieurs fichiers ne sont pas des images valides.');
                continue;
            }
            try {
                const compressedUrl = await compressImage(file, { maxWidth: 800, maxHeight: 1000, quality: 0.75 });
                newPreviews.push(compressedUrl);
            } catch (error) {
                console.error(error);
                setImageError("Erreur lors de la compression d'une image.");
            }
        }
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
    // --- Desktop Drag & Drop Handlers ---
    const handleDragStart = (index: number) => {
        setDraggedImageIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); 
    };

    const handleDrop = (targetIndex: number) => {
        if (draggedImageIndex === null || draggedImageIndex === targetIndex) {
            setDraggedImageIndex(null);
            return;
        };

        const newImagePreviews = [...imagePreviews];
        const [draggedImage] = newImagePreviews.splice(draggedImageIndex, 1);
        newImagePreviews.splice(targetIndex, 0, draggedImage);

        setImagePreviews(newImagePreviews);
        setDraggedImageIndex(null);
    };

    // --- Touch Drag & Drop Handlers ---
    const handleTouchStart = (index: number) => {
        dragItem.current = index;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (dragItem.current === null) return;
        
        const touch = e.touches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropTarget = (targetElement as HTMLElement)?.closest('[data-index]');

        if (dropTarget) {
            const targetIndexStr = dropTarget.getAttribute('data-index');
            if (targetIndexStr !== null) {
                const targetIndex = parseInt(targetIndexStr, 10);
                if (dragItem.current !== targetIndex) {
                     const newItems = [...imagePreviews];
                     const [reorderedItem] = newItems.splice(dragItem.current, 1);
                     newItems.splice(targetIndex, 0, reorderedItem);
                     dragItem.current = targetIndex; 
                     setImagePreviews(newItems);
                }
            }
        }
    };

    const handleTouchEnd = () => {
        dragItem.current = null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (imagePreviews.length === 0) {
            setImageError('Veuillez ajouter au moins une image.');
            return;
        }

        const modelData = {
            title,
            genre,
            event,
            fabric,
            difficulty,
            imageUrls: imagePreviews,
            description,
        };

        if (isEditing && modelToEdit) {
            onSaveModel({ ...modelToEdit, ...modelData });
        } else {
            onSaveModel({
                id: crypto.randomUUID(),
                ...modelData
            });
        }
    };

    return (
        <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
            <style>{`
                .dragging-touch {
                    opacity: 0.5;
                    transform: scale(1.05);
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                    z-index: 50;
                }
            `}</style>
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">
                {isEditing ? 'Modifier le modèle' : 'Ajouter un nouveau modèle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Nom du modèle</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="genre" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Genre</label>
                        <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value as any)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                            <option>Femme</option>
                            <option>Homme</option>
                            <option>Enfant</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="event" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Événement</label>
                        <select id="event" value={event} onChange={(e) => setEvent(e.target.value as any)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                            <option>Quotidien</option>
                            <option>Cérémonie</option>
                            <option>Soirée</option>
                            <option>Mariage</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="fabric" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Tissu conseillé</label>
                        <input type="text" id="fabric" value={fabric} onChange={(e) => setFabric(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                    </div>
                    <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Niveau de difficulté</label>
                        <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                            <option>Débutant</option>
                            <option>Intermédiaire</option>
                            <option>Avancé</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">Images du modèle</label>
                    <div className="mt-2 p-4 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-lg">
                      <div className="flex flex-wrap gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div 
                            key={preview + index} 
                            className={`relative group transition-transform duration-300 ${draggedImageIndex === index ? 'opacity-50 scale-105' : ''} ${dragItem.current === index ? 'dragging-touch' : ''}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                            onDragEnd={() => setDraggedImageIndex(null)}
                            onTouchStart={() => handleTouchStart(index)}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            data-index={index}
                          >
                             {index === 0 && (
                                <div className="absolute top-1 left-1 bg-orange-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                                    PRINCIPALE
                                </div>
                            )}
                            <img src={preview} alt={`Aperçu ${index+1}`} className="h-32 w-auto aspect-[4/5] rounded-md object-cover cursor-move pointer-events-none" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                              aria-label="Supprimer l'image"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                         <label htmlFor="image-upload" className="h-32 aspect-[4/5] cursor-pointer bg-stone-100 dark:bg-stone-700/50 rounded-md flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" /></svg>
                            <span className="mt-1 text-xs">Ajouter</span>
                            <input id="image-upload" name="image-upload" type="file" multiple className="sr-only" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-3">
                        Glissez-déposez les images pour les réorganiser. La première image sera la photo de couverture.
                      </p>
                    </div>
                    {imageError && <p className="text-xs text-red-500 mt-2">{imageError}</p>}
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required></textarea>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">
                        {isEditing ? 'Enregistrer les modifications' : 'Enregistrer Modèle'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddModelForm;