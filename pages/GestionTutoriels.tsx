import React, { useState } from 'react';
import type { Tutoriel } from '../types';
import AddTutorielForm from '../components/AddTutorielForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { ChevronLeftIcon } from '../components/icons';

interface GestionTutorielsProps {
    tutoriels: Tutoriel[];
    onAddTutoriel: (tutoriel: Tutoriel) => void;
    onUpdateTutoriel: (tutoriel: Tutoriel) => void;
    onDeleteTutoriel: (id: string) => void;
}

const TutorielManagementRow: React.FC<{ tutoriel: Tutoriel, onEdit: () => void, onDelete: () => void }> = ({ tutoriel, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-stone-800 p-4 rounded-lg shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <img src={tutoriel.imageUrl} alt={tutoriel.title} className="w-20 h-14 object-cover rounded-md flex-shrink-0" />
            <div className="min-w-0">
                <p className="font-bold text-stone-800 dark:text-stone-100 truncate">{tutoriel.title}</p>
                <p className="text-sm text-stone-500 dark:text-stone-400">{tutoriel.category} / {tutoriel.duration}</p>
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

const GestionTutoriels: React.FC<GestionTutorielsProps> = ({ tutoriels, onAddTutoriel, onUpdateTutoriel, onDeleteTutoriel }) => {
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
    const [selectedTutoriel, setSelectedTutoriel] = useState<Tutoriel | null>(null);
    const [tutorielToDelete, setTutorielToDelete] = useState<Tutoriel | null>(null);

    const handleEditClick = (tutoriel: Tutoriel) => {
        setSelectedTutoriel(tutoriel);
        setView('edit');
    };

    const handleAddClick = () => {
        setSelectedTutoriel(null);
        setView('add');
    };

    const handleCancel = () => {
        setView('list');
        setSelectedTutoriel(null);
    };

    const handleSaveTutoriel = (tutoriel: Tutoriel) => {
        if (selectedTutoriel) {
            onUpdateTutoriel(tutoriel);
        } else {
            onAddTutoriel(tutoriel);
        }
        setView('list');
        setSelectedTutoriel(null);
    };
    
    const handleDeleteRequest = (tutoriel: Tutoriel) => {
        setTutorielToDelete(tutoriel);
    };
    
    const handleConfirmDelete = () => {
        if (tutorielToDelete) {
            onDeleteTutoriel(tutorielToDelete.id);
            setTutorielToDelete(null);
        }
    };

    if (view === 'add' || view === 'edit') {
        return (
            <div>
                <button onClick={handleCancel} className="mb-6 flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 transition-colors hover:text-orange-800 dark:hover:text-orange-400">
                    <ChevronLeftIcon className="h-5 w-5" />
                    <span>Retour à la liste</span>
                </button>
                <AddTutorielForm onSaveTutoriel={handleSaveTutoriel} onCancel={handleCancel} tutorielToEdit={selectedTutoriel} />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Gestion des Tutoriels</h1>
                        <p className="text-stone-500 dark:text-stone-400 mt-1">Ajoutez, modifiez ou supprimez des guides de couture.</p>
                    </div>
                    <button 
                        onClick={handleAddClick} 
                        className="px-5 py-2.5 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-transform hover:scale-105"
                    >
                        Ajouter un tutoriel
                    </button>
                </div>
                <div className="space-y-4">
                    {tutoriels.map(tutoriel => (
                        <TutorielManagementRow 
                            key={tutoriel.id}
                            tutoriel={tutoriel}
                            onEdit={() => handleEditClick(tutoriel)}
                            onDelete={() => handleDeleteRequest(tutoriel)}
                        />
                    ))}
                </div>
            </div>
            
            <ConfirmationDialog
                isOpen={!!tutorielToDelete}
                onClose={() => setTutorielToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer le tutoriel "${tutorielToDelete?.title}" ? Cette action est irréversible.`}
            />
        </>
    );
};

export default GestionTutoriels;