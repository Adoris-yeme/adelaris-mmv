import React, { useState } from 'react';
import type { ManagerProfile } from '../types';
import { compressImage } from '../utils/image';
import { KeyIcon } from './icons';

interface EditProfileModalProps {
    profile: ManagerProfile;
    onClose: () => void;
    onSave: (profile: ManagerProfile) => void;
    onOpenChangePassword: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose, onSave, onOpenChangePassword }) => {
    const [name, setName] = useState(profile.name);
    const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedUrl = await compressImage(file, { maxSize: 200, quality: 0.8 });
                setAvatarUrl(compressedUrl);
            } catch (error) {
                console.error("Failed to compress image", error);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, avatarUrl });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">Modifier le profil</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                        <div>
                            <label htmlFor="avatar-upload" className="cursor-pointer px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">
                                Changer la photo
                            </label>
                            <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleAvatarChange} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Nom de l'atelier</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                    </div>
                    
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onOpenChangePassword();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600"
                        >
                            <KeyIcon className="w-4 h-4" />
                            Changer le mot de passe
                        </button>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Enregistrer</button>
                    </div>
                </form>
            </div>
             <style>{`
              @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
              .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
              @keyframes slide-up { from { transform: translateY(10px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
              .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default EditProfileModal;