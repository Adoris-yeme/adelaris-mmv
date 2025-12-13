
import React, { useState, useEffect } from 'react';
import type { Fourniture } from '../types';
import { compressImage } from '../utils/image';

interface AddFournitureFormProps {
    onSave: (fourniture: Fourniture) => void;
    onCancel: () => void;
    fournitureToEdit?: Fourniture | null;
}

const AddFournitureForm: React.FC<AddFournitureFormProps> = ({ onSave, onCancel, fournitureToEdit }) => {
    const [nom, setNom] = useState('');
    const [type, setType] = useState<'Tissu' | 'Mercerie' | 'Autre'>('Tissu');
    const [fournisseur, setFournisseur] = useState('');
    const [quantite, setQuantite] = useState('');
    const [unite, setUnite] = useState<'m' | 'cm' | 'unité' | 'bobine'>('m');
    const [prixAchat, setPrixAchat] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageError, setImageError] = useState('');

    const isEditing = !!fournitureToEdit;

    useEffect(() => {
        if (isEditing && fournitureToEdit) {
            setNom(fournitureToEdit.nom);
            setType(fournitureToEdit.type);
            setFournisseur(fournitureToEdit.fournisseur || '');
            setQuantite(String(fournitureToEdit.quantite));
            setUnite(fournitureToEdit.unite);
            setPrixAchat(fournitureToEdit.prixAchat ? String(fournitureToEdit.prixAchat) : '');
            setImageUrl(fournitureToEdit.imageUrl);
        }
    }, [fournitureToEdit, isEditing]);
    
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

        const fournitureData = {
            nom,
            type,
            fournisseur: fournisseur || undefined,
            quantite: Number(quantite),
            unite,
            prixAchat: prixAchat ? Number(prixAchat) : undefined,
            imageUrl,
        };

        if (isEditing && fournitureToEdit) {
            onSave({ ...fournitureToEdit, ...fournitureData });
        } else {
            onSave({
                id: crypto.randomUUID(),
                ...fournitureData
            });
        }
    };

    return (
        <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">
                {isEditing ? 'Modifier l\'article' : 'Ajouter un article à l\'inventaire'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Nom de l'article</label>
                    <input type="text" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Bazin Riche Blanc" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Type</label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                            <option>Tissu</option>
                            <option>Mercerie</option>
                            <option>Autre</option>
                        </select>
                    </div>
                    <div>
                       <label htmlFor="fournisseur" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Fournisseur (optionnel)</label>
                       <input type="text" id="fournisseur" value={fournisseur} onChange={(e) => setFournisseur(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quantite" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Quantité</label>
                        <input type="number" id="quantite" value={quantite} onChange={(e) => setQuantite(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                    </div>
                    <div>
                        <label htmlFor="unite" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Unité</label>
                        <select id="unite" value={unite} onChange={(e) => setUnite(e.target.value as any)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                            <option value="m">Mètre (m)</option>
                            <option value="cm">Centimètre (cm)</option>
                            <option value="unité">Unité</option>
                            <option value="bobine">Bobine</option>
                        </select>
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
                    <label htmlFor="prixAchat" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Prix d'achat (optionnel)</label>
                    <input type="number" id="prixAchat" value={prixAchat} onChange={(e) => setPrixAchat(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">
                        {isEditing ? 'Enregistrer les modifications' : 'Enregistrer l\'article'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddFournitureForm;
