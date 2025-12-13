import React, { useState } from 'react';
import type { Modele } from '../types';

interface ShowroomOrderModalProps {
    model: Modele;
    onClose: () => void;
    onPlaceOrder: (clientData: { name: string; phone: string; email?: string }) => void;
}

const ShowroomOrderModal: React.FC<ShowroomOrderModalProps> = ({ model, onClose, onPlaceOrder }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceOrder({ name, phone, email });
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-2xl w-full mx-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Choisir ce modèle</h2>
                        <p className="text-stone-500 dark:text-stone-400 mb-6">
                           Modèle: <span className="font-semibold">{model.title}</span> par <span className="font-semibold">{model.atelierName}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600">&times;</button>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <img src={model.imageUrls?.[0]} alt={model.title} className="w-24 h-32 object-cover rounded-md flex-shrink-0" />
                  <form onSubmit={handleSubmit} className="space-y-4 flex-grow w-full">
                      <p className="text-sm text-stone-600 dark:text-stone-300">Veuillez laisser vos coordonnées. L'atelier vous contactera pour finaliser la commande (prix, mesures, etc.).</p>
                      <div>
                          <label className="block text-sm font-medium">Nom complet</label>
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600" required/>
                      </div>
                      <div>
                          <label className="block text-sm font-medium">Téléphone</label>
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600" required/>
                      </div>
                       <div>
                          <label className="block text-sm font-medium">Email (facultatif)</label>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 border-stone-300 dark:border-stone-600"/>
                      </div>
                      <div className="flex justify-end space-x-4 pt-4">
                          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200">Annuler</button>
                          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Envoyer ma demande</button>
                      </div>
                  </form>
                </div>
            </div>
        </div>
    );
};

export default ShowroomOrderModal;
