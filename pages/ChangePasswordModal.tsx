import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

interface ChangePasswordModalProps {
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
    const { user, changePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }
        if (!user) {
            setError('Utilisateur non authentifié.');
            return;
        }

        const result = changePassword(user.id, currentPassword, newPassword);

        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => {
                onClose();
            }, 1500);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">Changer le mot de passe</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Mot de passe actuel</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Confirmer le nouveau mot de passe</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {success && <p className="text-sm text-green-500">{success}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Mettre à jour</button>
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

export default ChangePasswordModal;
