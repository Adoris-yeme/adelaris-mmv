
import React from 'react';
import type { AtelierData } from '../types';

interface OnboardingGuideProps {
    atelierData: AtelierData;
    onDismiss: () => void;
}

const Task: React.FC<{ title: string; isCompleted: boolean }> = ({ title, isCompleted }) => (
    <div className={`flex items-center p-3 rounded-md transition-all ${isCompleted ? 'bg-green-100 dark:bg-green-900/50' : 'bg-stone-100 dark:bg-stone-700/50'}`}>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${isCompleted ? 'bg-green-500' : 'border-2 border-stone-400'}`}>
            {isCompleted && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
        </div>
        <span className={`font-medium ${isCompleted ? 'text-green-800 dark:text-green-300 line-through' : 'text-stone-700 dark:text-stone-200'}`}>{title}</span>
    </div>
);

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ atelierData, onDismiss }) => {
    const tasks = {
        hasClient: atelierData.clients.length > 0,
        hasModel: atelierData.models.length > 0,
        hasOrder: atelierData.orders.length > 0,
    };
    const allTasksCompleted = Object.values(tasks).every(Boolean);

    return (
        <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-lg border border-orange-200 dark:border-orange-900/50">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Guide de Démarrage</h2>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Suivez ces étapes pour configurer votre atelier.</p>
                </div>
                <button onClick={onDismiss} className="text-sm font-medium text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200">&times; Masquer</button>
            </div>
            
            <div className="mt-4 space-y-3">
                <Task title="Ajouter votre premier client" isCompleted={tasks.hasClient} />
                <Task title="Ajouter un modèle au catalogue" isCompleted={tasks.hasModel} />
                <Task title="Créer votre première commande" isCompleted={tasks.hasOrder} />
            </div>

            {allTasksCompleted && (
                 <p className="text-center text-sm font-semibold text-green-600 dark:text-green-400 mt-4">
                    Félicitations ! Vous êtes prêt à commencer.
                </p>
            )}
        </div>
    );
};

export default OnboardingGuide;
