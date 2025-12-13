import React, { useState } from 'react';
import type { Client, Modele, Order, OrderStatus } from '../types';

interface AddOrderFormProps {
    client: Client;
    models: Modele[];
    onClose: () => void;
    onSave: (orderData: Omit<Order, 'id' | 'clientId' | 'ticketId'>) => void;
}

const AddOrderForm: React.FC<AddOrderFormProps> = ({ client, models, onClose, onSave }) => {
    const [modelId, setModelId] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [status, setStatus] = useState<OrderStatus>('En attente de validation');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!modelId) {
            alert('Veuillez sélectionner un modèle.');
            return;
        }
        onSave({
            modelId,
            date,
            status,
            price: price ? Number(price) : undefined,
            notes,
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-2xl w-full mx-auto animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">Nouvelle commande pour {client.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Modèle</label>
                        <select id="model" value={modelId} onChange={(e) => setModelId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
                            <option value="" disabled>Sélectionner un modèle</option>
                            {models.map(model => (
                                <option key={model.id} value={model.id}>{model.title}</option>
                            ))}
                        </select>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Prix (FCFA)</label>
                            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 150000" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                         <div>
                            <label htmlFor="date" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Date de livraison prévue</label>
                            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Statut</label>
                         <select id="status" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
                            <option>En attente de validation</option>
                            <option>En cours de couture</option>
                            <option>En finition</option>
                            <option>Prêt à livrer</option>
                            <option>Livré</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Notes (optionnel)</label>
                        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"></textarea>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Enregistrer Commande</button>
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

export default AddOrderForm;