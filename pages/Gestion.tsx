
import React, { useState } from 'react';
import type { Modele } from '../types';
import AddModelForm from './AddModelForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { ChevronLeftIcon } from '../components/icons';

interface GestionProps {
    models: Modele[];
    onAddModel: (model: Modele) => void;
    onUpdateModel: (model: Modele) => void;
    onDeleteModel: (id: string) => void;
}

const ModelManagementRow: React.FC<{ model: Modele, onEdit: () => void, onDelete: () => void }> = ({ model, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-stone-800 p-4 rounded-lg shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <img src={model.imageUrls?.[0]} alt={model.title} className="w-14 h-20 object-cover rounded-md flex-shrink-0" />
            <div className="min-w-0">
                <p className="font-bold text-stone-800 dark:text-stone-100 truncate">{model.title}</p>
                <p className="text-sm text-stone-500 dark:text-stone-400">{model.genre} / {model.fabric}</p>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
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
);

const Gestion: React.FC<GestionProps> = ({ models, onAddModel, onUpdateModel, onDeleteModel }) => {
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
    const [selectedModel, setSelectedModel] = useState<Modele | null>(null);
    const [modelToDelete, setModelToDelete] = useState<Modele | null>(null);

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

    const handleSaveModel = (model: Modele) => {
        if (selectedModel) { // Editing
            onUpdateModel(model);
        } else { // Adding
            onAddModel(model);
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
                        />
                    ))}
                </div>
            </div>
            
            <ConfirmationDialog
                isOpen={!!modelToDelete}
                onClose={() => setModelToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer le modèle "${modelToDelete?.title}" ? Cette action est irréversible.`}
            />
        </>
    );
};

export default Gestion;
