import React, { useState } from 'react';
import type { Order } from '../types';

interface EditOrderModalProps {
    order: Order;
    onClose: () => void;
    onSave: (data: { price?: number; notes?: string }) => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose, onSave }) => {
    const [price, setPrice] = useState(order.price ? String(order.price) : '');
    const [notes, setNotes] = useState(order.notes || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            price: price ? Number(price) : undefined,
            notes: notes || undefined,
        });
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-lg w-full mx-auto animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">Modifier la commande {order.ticketId}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Prix (FCFA)</label>
                        <input 
                            type="number" 
                            id="price" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            placeholder="Ex: 150000" 
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
                        />
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Notes (optionnel)</label>
                        <textarea 
                            id="notes" 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            rows={4} 
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Enregistrer</button>
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

export default EditOrderModal;
