import React, { useState, useEffect } from 'react';
import type { Tutoriel } from '../types';
import { compressImage } from '../utils/image';

interface AddTutorielFormProps {
    onSaveTutoriel: (tutoriel: Tutoriel) => void;
    onCancel: () => void;
    tutorielToEdit?: Tutoriel | null;
}

const AddTutorielForm: React.FC<AddTutorielFormProps> = ({ onSaveTutoriel, onCancel, tutorielToEdit }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<'Prise de mesures' | 'Découpe' | 'Techniques de couture'>('Techniques de couture');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageError, setImageError] = useState('');

    const isEditing = !!tutorielToEdit;

    useEffect(() => {
        if (isEditing && tutorielToEdit) {
            setTitle(tutorielToEdit.title);
            setCategory(tutorielToEdit.category);
            setDuration(tutorielToEdit.duration);
            setDescription(tutorielToEdit.description);
            setImageUrl(tutorielToEdit.imageUrl);
        }
    }, [tutorielToEdit, isEditing]);
    
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageError('');
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setImageError('Le fichier doit être une image.');
            return;
        }
        
        try {
            const compressedUrl = await compressImage(file, { maxWidth: 600, quality: 0.8 });
            setImageUrl(compressedUrl);
        } catch (error) {
            console.error("Image compression failed", error);
            setImageError("Erreur lors de la compression de l'image.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl) {
            setImageError('Veuillez ajouter une image.');
            return;
        }

        const tutorielData = {
            title,
            category,
            duration,
            imageUrl,
            description,
        };

        if (isEditing && tutorielToEdit) {
            onSaveTutoriel({ ...tutorielToEdit, ...tutorielData });
        } else {
            onSaveTutoriel({
                id: crypto.randomUUID(),
                ...tutorielData
            });
        }
    };

    return (
        <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">
                {isEditing ? 'Modifier le tutoriel' : 'Ajouter un nouveau tutoriel'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Titre</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Catégorie</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value as any)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                            <option>Techniques de couture</option>
                            <option>Découpe</option>
                            <option>Prise de mesures</option>
                        </select>
                    </div>
                    <div>
                       <label htmlFor="duration" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Durée</label>
                       <input type="text" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="ex: 30 min" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">Image</label>
                    <div className="mt-2 flex items-center gap-4">
                        {imageUrl && <img src={imageUrl} alt="Aperçu" className="h-20 w-auto aspect-video rounded-md object-cover" />}
                        <label htmlFor="image-upload" className="cursor-pointer px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">
                           {imageUrl ? "Changer l'image" : "Télécharger une image"}
                        </label>
                        <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
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
                        {isEditing ? 'Enregistrer les modifications' : 'Enregistrer le Tutoriel'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTutorielForm;
