import React, { useState } from 'react';

interface WorkstationAccessModalProps {
    onClose: () => void;
    onLoginAttempt: (code: string) => boolean;
}

const WorkstationAccessModal: React.FC<WorkstationAccessModalProps> = ({ onClose, onLoginAttempt }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLoginAttempt(code);
        if (!success) {
            setError('Code d\'accès incorrect.');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 text-center">Accès Poste de travail</h2>
                <p className="text-stone-500 dark:text-stone-400 mb-6 text-center">Veuillez entrer votre code pour accéder à vos tâches.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="access-code" className="sr-only">Code d'accès</label>
                        <input 
                            type="text" 
                            id="access-code" 
                            value={code} 
                            onChange={(e) => setCode(e.target.value.toUpperCase())} 
                            className="mt-1 block w-full text-center tracking-widest px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                            required
                            autoFocus
                            placeholder="POSTE-XXXX"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <div className="flex justify-end space-x-4 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Valider</button>
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

export default WorkstationAccessModal;