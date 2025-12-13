
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

    const handleWhatsApp = () => {
        const encodedMessage = encodeURIComponent(message);
        // Clean phone number (remove spaces)
        const cleanPhone = client.phone.replace(/\s+/g, '');
        // Basic check to see if it starts with country code, if not, user might need to add it manually in WA
        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
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
                <p className="text-stone-500 dark:text-stone-400 mb-6">Un message a été préparé pour <strong>{client.name}</strong>.</p>
                
                <textarea
                    readOnly
                    value={message}
                    rows={8}
                    className="w-full p-3 bg-stone-50 dark:bg-stone-700/50 border border-stone-300 dark:border-stone-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Fermer</button>
                    
                    <button 
                        type="button" 
                        onClick={handleCopy} 
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${isCopied ? 'bg-green-600' : 'bg-stone-600 hover:bg-stone-700'}`}
                    >
                        {isCopied ? 'Copié !' : 'Copier le texte'}
                    </button>

                    <button 
                        type="button" 
                        onClick={handleWhatsApp} 
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                        </svg>
                        Envoyer sur WhatsApp
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
