import React, { useState } from 'react';
import type { Modele } from '../types';

interface ClientOrderFormProps {
    model: Modele;
    onClose: () => void;
    onPlaceOrder: (clientData: { name: string; phone: string; email?: string }) => void;
}

const ClientOrderForm: React.FC<ClientOrderFormProps> = ({ model, onClose, onPlaceOrder }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPlaceOrder({ name, phone, email });
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
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Finaliser votre commande</h2>
                        <p className="text-stone-500 dark:text-stone-400 mb-6">Vous avez choisi le modèle: <span className="font-semibold">{model.title}</span></p>
                    </div>
                    <button onClick={onClose} className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <img src={model.imageUrls?.[0]} alt={model.title} className="w-24 h-32 object-cover rounded-md flex-shrink-0" />
                  <form onSubmit={handleSubmit} className="space-y-4 flex-grow w-full">
                      <div>
                          <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Nom complet</label>
                          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required/>
                      </div>
                      <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Téléphone</label>
                          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required/>
                      </div>
                      <div>
                          <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Email (facultatif)</label>
                          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
                      </div>
                      <div className="flex justify-end space-x-4 pt-4">
                          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Valider la commande</button>
                      </div>
                  </form>
                </div>
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

export default ClientOrderForm;