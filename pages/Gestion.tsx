
import React, { useState, useEffect } from 'react';
import type { Modele, ShowcaseStatus } from '../types';
import AddModelForm from './AddModelForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { ChevronLeftIcon } from '../components/icons';
import { useAuth } from '../auth/AuthContext';


const ShowcaseStatusBadge: React.FC<{ status: ShowcaseStatus }> = ({ status }) => {
    switch (status) {
        case 'approved':
            return <span className="text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2 py-0.5 rounded-full flex items-center gap-1">✅ Approuvé</span>;
        case 'pending':
            return <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 px-2 py-0.5 rounded-full flex items-center gap-1">⏳ En attente</span>;
        case 'rejected':
            return <span className="text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 px-2 py-0.5 rounded-full flex items-center gap-1">❌ Rejeté</span>;
        default:
            return null;
    }
};


interface GestionProps {
    models: Modele[];
    onAddModel: (model: Modele) => void;
    onUpdateModel: (model: Modele) => void;
    onDeleteModel: (id: string) => void;
}

const ModelManagementRow: React.FC<{ model: Modele, onEdit: () => void, onDelete: () => void, onShowcaseSubmit: () => void }> = ({ model, onEdit, onDelete, onShowcaseSubmit }) => (
    <div className="bg-white dark:bg-stone-800 p-4 rounded-lg shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <img src={model.imageUrls?.[0]} alt={model.title} className="w-14 h-20 object-cover rounded-md flex-shrink-0 bg-stone-100 dark:bg-stone-700" />
            <div className="min-w-0">
                <p className="font-bold text-stone-800 dark:text-stone-100 truncate">{model.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <p className="text-sm text-stone-500 dark:text-stone-400">{model.genre} / {model.fabric}</p>
                    <ShowcaseStatusBadge status={model.showcaseStatus} />
                </div>
            </div>
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-2 flex-shrink-0">
             {(model.showcaseStatus === 'none' || model.showcaseStatus === 'rejected') && (
                 <button 
                    onClick={onShowcaseSubmit} 
                    className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 rounded-md hover:from-orange-700 hover:to-orange-600 shadow-sm transition-all"
                 >
                    🚀 Exposer
                 </button>
             )}
             <div className="flex gap-2">
                <button 
                    onClick={onEdit} 
                    className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600"
                >
                    Modifier
                </button>
                <button 
                    onClick={onDelete} 
                    className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
                >
                    Supprimer
                </button>
            </div>
        </div>
    </div>
);

const DangerZone: React.FC = () => {
    const { atelier, resetAtelierData } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleReset = () => {
        if (atelier) {
            resetAtelierData(atelier.id);
        }
        setShowConfirm(false);
    }

    if (!atelier) return null;

    return (
        <div className="mt-12 p-6 border-2 border-red-500/50 rounded-lg">
            <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Zone de Danger</h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2">
                Cette action est irréversible. Toutes les données de votre atelier (clients, commandes, modèles, etc.) seront définitivement supprimées. Ceci est utile si vous avez utilisé des données d'exemple pour commencer.
            </p>
            <button
                onClick={() => setShowConfirm(true)}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
                Réinitialiser les données de l'atelier
            </button>
            <ConfirmationDialog 
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleReset}
                title="Êtes-vous absolument sûr ?"
                message={`Veuillez confirmer que vous souhaitez supprimer toutes les données de l'atelier "${atelier.name}". Cette action ne peut pas être annulée.`}
                confirmButtonText="Oui, tout supprimer"
            />
        </div>
    )
}

const Gestion: React.FC<GestionProps> = ({ models, onAddModel, onUpdateModel, onDeleteModel }) => {
    const { atelier } = useAuth();
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
    const [selectedModel, setSelectedModel] = useState<Modele | null>(null);
    const [modelToDelete, setModelToDelete] = useState<Modele | null>(null);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const handleEditClick = (model: Modele) => {
        setSelectedModel(model);
        setView('edit');
    };

    const handleAddClick = () => {
        setSelectedModel(null);
        setView('add');
    };

    const handleCancel = () => {
        setView('list');
        setSelectedModel(null);
    };

    const handleSaveModel = (model: Omit<Modele, 'atelierId' | 'atelierName' | 'showcaseStatus'> & {id: string}) => {
        if (!atelier) return;

        if (selectedModel) { // Editing
             onUpdateModel({ ...selectedModel, ...model });
        } else { // Adding
            const newModel: Modele = {
                ...model,
                atelierId: atelier.id,
                atelierName: atelier.name,
                showcaseStatus: 'none',
            }
            onAddModel(newModel);
        }
        setView('list');
        setSelectedModel(null);
    };
    
    const handleDeleteRequest = (model: Modele) => {
        setModelToDelete(model);
    };
    
    const handleConfirmDelete = () => {
        if (modelToDelete) {
            onDeleteModel(modelToDelete.id);
            setModelToDelete(null);
        }
    };
    
    const handleShowcaseSubmit = (model: Modele) => {
        onUpdateModel({ ...model, showcaseStatus: 'pending' });
        setToastMessage('Modèle envoyé à l\'admin pour validation !');
    };

    if (view === 'add' || view === 'edit') {
        return (
            <div>
                <button onClick={handleCancel} className="mb-6 flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 transition-colors hover:text-orange-800 dark:hover:text-orange-400">
                    <ChevronLeftIcon className="h-5 w-5" />
                    <span>Retour à la liste</span>
                </button>
                <AddModelForm onSaveModel={handleSaveModel} onCancel={handleCancel} modelToEdit={selectedModel} />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Gestion du Catalogue</h1>
                        <p className="text-stone-500 dark:text-stone-400 mt-1">Ajoutez, modifiez ou supprimez des modèles de votre collection.</p>
                    </div>
                    <button 
                        onClick={handleAddClick} 
                        className="px-5 py-2.5 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-transform hover:scale-105"
                    >
                        Ajouter un modèle
                    </button>
                </div>
                <div className="space-y-4">
                    {models.map(model => (
                        <ModelManagementRow 
                            key={model.id}
                            model={model}
                            onEdit={() => handleEditClick(model)}
                            onDelete={() => handleDeleteRequest(model)}
                            onShowcaseSubmit={() => handleShowcaseSubmit(model)}
                        />
                    ))}
                </div>
                <DangerZone />
            </div>
            
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-4 right-4 z-50 bg-stone-800 dark:bg-stone-700 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up flex items-center gap-2">
                    <span>🚀</span>
                    {toastMessage}
                </div>
            )}

            <ConfirmationDialog
                isOpen={!!modelToDelete}
                onClose={() => setModelToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer le modèle "${modelToDelete?.title}" ? Cette action est irréversible.`}
            />
            <style>{`
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </>
    );
};

export default Gestion;
