import React, { useState } from 'react';
import type { Order, Client, Modele, ManagerProfile } from '../types';

interface NotificationModalProps {
    order: Order;
    client: Client;
    model: Modele;
    managerProfile: ManagerProfile;
    onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ order, client, model, managerProfile, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);

    const message = `Bonjour ${client.name},\n\nVotre commande pour le modèle "${model.title}" (Ticket N°${order.ticketId}) est prête !\n\nVous pouvez passer la récupérer à votre convenance.\n\nCordialement,\n${managerProfile.name}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(message).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-2xl w-full mx-auto animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">Notifier le client</h2>
                <p className="text-stone-500 dark:text-stone-400 mb-6">Un message a été préparé pour <strong>{client.name}</strong>. Vous pouvez le copier pour l'envoyer par SMS ou WhatsApp.</p>
                
                <textarea
                    readOnly
                    value={message}
                    rows={8}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-700/50 border border-stone-300 dark:border-stone-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Fermer</button>
                    <button 
                        type="button" 
                        onClick={handleCopy} 
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${isCopied ? 'bg-green-600' : 'bg-orange-900 hover:bg-orange-800'}`}
                    >
                        {isCopied ? 'Copié !' : 'Copier le message'}
                    </button>
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

export default NotificationModal;
