
import React from 'react';
import { DashboardIcon, WorkstationIcon } from './icons';

interface ModeSelectionModalProps {
    onClose: () => void;
    onSelectManager: () => void;
    onSelectWorkstation: () => void;
}

const ModeSelectionModal: React.FC<ModeSelectionModalProps> = ({ onClose, onSelectManager, onSelectWorkstation }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-stone-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-stone-200 dark:border-stone-700 text-center">
                    <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Accès Sécurisé</h2>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Veuillez sélectionner votre destination</p>
                </div>
                
                <div className="p-6 space-y-4">
                    <button 
                        onClick={onSelectManager}
                        className="w-full flex items-center p-4 rounded-lg border-2 border-stone-200 dark:border-stone-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group"
                    >
                        <div className="p-3 bg-stone-100 dark:bg-stone-700 rounded-full text-stone-600 dark:text-stone-300 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                            <DashboardIcon className="w-6 h-6" />
                        </div>
                        <div className="ml-4 text-left">
                            <span className="block font-bold text-stone-800 dark:text-stone-100">Espace Manager</span>
                            <span className="text-xs text-stone-500 dark:text-stone-400">Gestion, Finances, Clients</span>
                        </div>
                    </button>

                    <button 
                        onClick={onSelectWorkstation}
                        className="w-full flex items-center p-4 rounded-lg border-2 border-stone-200 dark:border-stone-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                    >
                        <div className="p-3 bg-stone-100 dark:bg-stone-700 rounded-full text-stone-600 dark:text-stone-300 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <WorkstationIcon className="w-6 h-6" />
                        </div>
                        <div className="ml-4 text-left">
                            <span className="block font-bold text-stone-800 dark:text-stone-100">Poste de Travail</span>
                            <span className="text-xs text-stone-500 dark:text-stone-400">Production, Tâches</span>
                        </div>
                    </button>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-900/50 text-center">
                    <button onClick={onClose} className="text-sm font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
                        Annuler
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ModeSelectionModal;
