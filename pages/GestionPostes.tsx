import React, { useState } from 'react';
import type { Workstation } from '../types';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { ChevronLeftIcon } from '../components/icons';

// Simple modal for editing workstation name
const EditWorkstationModal: React.FC<{
    workstation: Workstation;
    onClose: () => void;
    onSave: (workstation: Workstation) => void;
}> = ({ workstation, onClose, onSave }) => {
    const [name, setName] = useState(workstation.name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...workstation, name });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">Modifier le poste</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="ws-name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Nom du poste</label>
                    <input
                        id="ws-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                        autoFocus
                    />
                    <div className="flex justify-end gap-4 pt-4 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddWorkstationForm: React.FC<{ onAdd: (name: string) => void, onCancel: () => void }> = ({ onAdd, onCancel }) => {
    const [name, setName] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim());
        }
    };
    return (
        <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
             <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">Ajouter un nouveau poste</h2>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="ws-name-add" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Nom du poste</label>
                    <input
                        id="ws-name-add"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                        autoFocus
                        placeholder="Ex: Atelier Broderie"
                    />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Enregistrer</button>
                </div>
             </form>
        </div>
    );
};


interface GestionPostesProps {
    workstations: Workstation[];
    onAddWorkstation: (name: string) => void;
    onUpdateWorkstation: (workstation: Workstation) => void;
    onDeleteWorkstation: (id: string) => void;
}

const GestionPostes: React.FC<GestionPostesProps> = ({ workstations, onAddWorkstation, onUpdateWorkstation, onDeleteWorkstation }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingWorkstation, setEditingWorkstation] = useState<Workstation | null>(null);
    const [deletingWorkstation, setDeletingWorkstation] = useState<Workstation | null>(null);

    const handleSaveNewWorkstation = (name: string) => {
        onAddWorkstation(name);
        setIsAdding(false);
    };

    const handleConfirmDelete = () => {
        if (deletingWorkstation) {
            onDeleteWorkstation(deletingWorkstation.id);
            setDeletingWorkstation(null);
        }
    };

    if (isAdding) {
        return (
            <div>
                 <button onClick={() => setIsAdding(false)} className="mb-6 flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 transition-colors hover:text-orange-800 dark:hover:text-orange-400">
                    <ChevronLeftIcon className="h-5 w-5" />
                    <span>Retour à la liste</span>
                </button>
                <AddWorkstationForm onAdd={handleSaveNewWorkstation} onCancel={() => setIsAdding(false)} />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Gestion des Postes de Travail</h1>
                        <p className="text-stone-500 dark:text-stone-400 mt-1">Créez et gérez les accès pour vos équipes de couture.</p>
                    </div>
                     <button 
                        onClick={() => setIsAdding(true)} 
                        className="px-5 py-2.5 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-transform hover:scale-105"
                    >
                        Ajouter un poste
                    </button>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Postes existants</h2>
                    {workstations.map(ws => (
                        <div key={ws.id} className="bg-white dark:bg-stone-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                <p className="font-bold text-stone-800 dark:text-stone-100">{ws.name}</p>
                                <p className="text-sm text-stone-500 dark:text-stone-400">Code d'accès : 
                                    <span className="font-mono ml-2 bg-stone-100 dark:bg-stone-700 p-1 rounded text-orange-800 dark:text-orange-400">
                                        {ws.accessCode}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setEditingWorkstation(ws)} className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">
                                    Modifier
                                </button>
                                <button onClick={() => setDeletingWorkstation(ws)} className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                    {workstations.length === 0 && (
                        <p className="text-center text-sm text-stone-500 dark:text-stone-400 py-8">Aucun poste de travail n'a été créé.</p>
                    )}
                </div>
            </div>
            {editingWorkstation && (
                <EditWorkstationModal
                    workstation={editingWorkstation}
                    onClose={() => setEditingWorkstation(null)}
                    onSave={onUpdateWorkstation}
                />
            )}
            <ConfirmationDialog
                isOpen={!!deletingWorkstation}
                onClose={() => setDeletingWorkstation(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer le poste "${deletingWorkstation?.name}" ?`}
            />
        </>
    );
};

export default GestionPostes;
