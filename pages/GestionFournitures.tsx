
import React, { useState, useMemo } from 'react';
import type { Fourniture } from '../types';
import AddFournitureForm from '../components/AddFournitureForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { ChevronLeftIcon } from '../components/icons';

interface GestionFournituresProps {
    fournitures: Fourniture[];
    onAddFourniture: (fourniture: Fourniture) => void;
    onUpdateFourniture: (fourniture: Fourniture) => void;
    onDeleteFourniture: (id: string) => void;
}

const FournitureCard: React.FC<{ 
    fourniture: Fourniture, 
    onEdit: () => void, 
    onDelete: () => void 
}> = ({ fourniture, onEdit, onDelete }) => {
    // Seuil critique : < 2m pour tissus, < 5 unités pour le reste
    const isLowStock = (fourniture.unite === 'm' && fourniture.quantite < 2) || (fourniture.unite !== 'm' && fourniture.quantite < 5);

    return (
        <div className={`bg-white dark:bg-stone-800 rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 ${isLowStock ? 'ring-2 ring-red-500 shadow-red-100 dark:shadow-none' : ''}`}>
            <div className="aspect-video relative">
                <img src={fourniture.imageUrl} alt={fourniture.nom} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-stone-800/60 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                    {fourniture.type}
                </span>
                {isLowStock && (
                     <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        STOCK CRITIQUE
                    </span>
                )}
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-stone-800 dark:text-stone-100">{fourniture.nom}</h3>
                <div className="flex justify-between items-baseline mt-2 flex-grow">
                    <p className="text-sm text-stone-500 dark:text-stone-400">Quantité:</p>
                    <p className={`text-lg font-semibold ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-orange-900 dark:text-orange-400'}`}>
                        {fourniture.quantite} <span className="text-sm font-normal">{fourniture.unite}</span>
                    </p>
                </div>
                {fourniture.fournisseur && (
                    <p className="text-xs text-stone-400 mt-1 truncate">Fournisseur: {fourniture.fournisseur}</p>
                )}
            </div>
            <div className="p-2 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-700 flex items-center justify-end gap-2">
                <button onClick={onEdit} className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">
                    Modifier
                </button>
                <button onClick={onDelete} className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">
                    Supprimer
                </button>
            </div>
        </div>
    );
};


const GestionFournitures: React.FC<GestionFournituresProps> = ({ fournitures, onAddFourniture, onUpdateFourniture, onDeleteFourniture }) => {
    const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
    const [selectedFourniture, setSelectedFourniture] = useState<Fourniture | null>(null);
    const [fournitureToDelete, setFournitureToDelete] = useState<Fourniture | null>(null);

    // Calculer les articles en rupture de stock
    const lowStockItems = useMemo(() => {
        return fournitures.filter(f => 
            (f.unite === 'm' && f.quantite < 2) || 
            (f.unite !== 'm' && f.quantite < 5)
        );
    }, [fournitures]);

    const handleEditClick = (fourniture: Fourniture) => {
        setSelectedFourniture(fourniture);
        setView('edit');
    };

    const handleAddClick = () => {
        setSelectedFourniture(null);
        setView('add');
    };

    const handleCancel = () => {
        setView('list');
        setSelectedFourniture(null);
    };

    const handleSaveFourniture = (fourniture: Fourniture) => {
        if (selectedFourniture) { // Editing
            onUpdateFourniture(fourniture);
        } else { // Adding
            onAddFourniture(fourniture);
        }
        setView('list');
        setSelectedFourniture(null);
    };
    
    const handleDeleteRequest = (fourniture: Fourniture) => {
        setFournitureToDelete(fourniture);
    };
    
    const handleConfirmDelete = () => {
        if (fournitureToDelete) {
            onDeleteFourniture(fournitureToDelete.id);
            setFournitureToDelete(null);
        }
    };

    if (view === 'add' || view === 'edit') {
        return (
            <div>
                <button onClick={handleCancel} className="mb-6 flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 transition-colors hover:text-orange-800 dark:hover:text-orange-400">
                    <ChevronLeftIcon className="h-5 w-5" />
                    <span>Retour à l'inventaire</span>
                </button>
                <AddFournitureForm onSave={handleSaveFourniture} onCancel={handleCancel} fournitureToEdit={selectedFourniture} />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Tissus & Fournitures</h1>
                        <p className="text-stone-500 dark:text-stone-400 mt-1">Gérez votre inventaire de matières premières.</p>
                    </div>
                    <button 
                        onClick={handleAddClick} 
                        className="px-5 py-2.5 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-transform hover:scale-105"
                    >
                        Ajouter un article
                    </button>
                </div>

                {/* Bannière d'alerte stock faible */}
                {lowStockItems.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Attention : Stocks Critiques</h3>
                            <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                                {lowStockItems.length} article(s) sont en dessous du seuil de sécurité (moins de 2m pour les tissus ou 5 unités). Pensez à réapprovisionner.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {fournitures.map(fourniture => (
                        <FournitureCard
                            key={fourniture.id}
                            fourniture={fourniture}
                            onEdit={() => handleEditClick(fourniture)}
                            onDelete={() => handleDeleteRequest(fourniture)}
                        />
                    ))}
                </div>
                 {fournitures.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-stone-800 rounded-lg shadow-md">
                        <svg className="mx-auto h-12 w-12 text-stone-400 dark:text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10m0-10h16v10M4 7L12 3l8 4M4 7h16M4 17h16" /></svg>
                        <h3 className="mt-2 text-sm font-medium text-stone-900 dark:text-stone-100">Inventaire vide</h3>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Commencez par ajouter votre premier tissu ou fourniture.</p>
                    </div>
                )}
            </div>
            
            <ConfirmationDialog
                isOpen={!!fournitureToDelete}
                onClose={() => setFournitureToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer l'article "${fournitureToDelete?.nom}" de l'inventaire ?`}
            />
        </>
    );
};

export default GestionFournitures;
