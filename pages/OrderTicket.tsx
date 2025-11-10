import React from 'react';
import type { Order, Client, Modele } from '../types';

const measurementLabels: { [key in keyof Omit<Client['measurements'], 'observation'>]: string } = {
    tour_d_encolure: "Tour d'encolure",
    carrure_devant: "Carrure devant",
    carrure_dos: "Carrure dos",
    tour_de_poitrine: "Tour de poitrine",
    tour_de_taille: "Tour de taille",
    tour_sous_seins: "Tour sous seins",
    ecartement_des_seins: "Ecartement des seins",
    tour_de_bassin: "Tour de bassin",
    longueur_poitrine: "Longueur poitrine",
    longueur_sous_seins: "Longueur sous seins",
    longueur_taille: "Longueur taille",
    longueur_corsage: "Longueur corsage",
    longueur_manche: "Longueur manche",
    tour_de_manche: "Tour de manche",
    longueur_jupe: "Longueur jupe",
    longueur_pantalon: "Longueur pantalon",
    tour_de_bras: "Tour de bras",
    tour_de_genou: "Tour de genou",
    tour_de_ceinture: "Tour de ceinture",
    longueur_genou: "Longueur genou",
    longueur_epaule: "Longueur épaule",
    hauteur_bassin: "Hauteur bassin",
    longueur_de_robe: "Longueur de robe",
    tour_de_robe: "Tour de robe",
};

interface OrderTicketProps {
    order: Order;
    client: Client;
    model?: Modele;
    onClose: () => void;
}

const OrderTicket: React.FC<OrderTicketProps> = ({ order, client, model, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex justify-center items-center p-4 animate-fade-in print-boundary"
                onClick={onClose}
            >
                <div 
                    className="bg-white dark:bg-stone-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up print:shadow-none print:rounded-none print:max-h-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div id="ticket-content" className="p-8 overflow-y-auto">
                        <div className="flex justify-between items-start pb-4 border-b-2 border-dashed border-stone-300 dark:border-stone-700">
                            <div>
                                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">TICKET DE COMMANDE</h2>
                                <p className="text-sm font-mono text-stone-500 dark:text-stone-400">{order.ticketId}</p>
                            </div>
                            <p className="text-lg font-semibold text-orange-900 dark:text-orange-400">MMV COUTURE</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
                            {/* Client Info */}
                            <div>
                                <h3 className="font-bold text-stone-700 dark:text-stone-200 mb-2">Client</h3>
                                <p className="text-stone-600 dark:text-stone-300">{client.name}</p>
                                <p className="text-stone-600 dark:text-stone-300">{client.phone}</p>
                                <h4 className="font-semibold text-stone-700 dark:text-stone-200 mt-4 mb-1">Mesures</h4>
                                <ul className="text-sm text-stone-600 dark:text-stone-300 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                    {(Object.keys(measurementLabels) as Array<keyof typeof measurementLabels>).map((key) => {
                                        const value = client.measurements[key];
                                        return value ? <li key={key}>{measurementLabels[key]}: <span className="font-semibold">{value} cm</span></li> : null;
                                    })}
                                </ul>
                                {client.measurements.observation && (
                                    <>
                                        <h4 className="font-semibold text-stone-700 dark:text-stone-200 mt-4 mb-1">Observation</h4>
                                        <p className="text-sm text-stone-600 dark:text-stone-300 whitespace-pre-wrap">{client.measurements.observation}</p>
                                    </>
                                )}
                            </div>
                            {/* Model Info */}
                            {model && (
                                <div className="flex flex-col items-center">
                                    <h3 className="font-bold text-stone-700 dark:text-stone-200 mb-2">Modèle Choisi</h3>
                                    <img src={model.imageUrls?.[0]} alt={model.title} className="w-40 h-52 object-cover rounded-md mb-2"/>
                                    <p className="font-semibold text-center text-stone-600 dark:text-stone-300">{model.title}</p>
                                    <p className="text-sm text-center text-stone-500 dark:text-stone-400">{model.fabric}</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-stone-200 dark:border-stone-700 pt-4">
                             <h3 className="font-bold text-stone-700 dark:text-stone-200 mb-2">Détails de la Commande</h3>
                             <div className="flex justify-between items-center">
                                <p className="text-stone-600 dark:text-stone-300">Date de commande:</p>
                                <p className="font-semibold text-stone-800 dark:text-stone-100">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                             </div>
                             <div className="flex justify-between items-center mt-1">
                                <p className="text-stone-600 dark:text-stone-300">Statut:</p>
                                <p className="font-semibold text-stone-800 dark:text-stone-100">{order.status}</p>
                             </div>
                              <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                                <p className="text-lg font-bold text-stone-600 dark:text-stone-300">Prix Total:</p>
                                <p className="text-xl font-bold text-stone-800 dark:text-stone-100">{order.price ? `${order.price.toLocaleString('fr-FR')} FCFA` : 'N/A'}</p>
                             </div>
                        </div>

                    </div>
                    
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-700 flex justify-end gap-4 print:hidden">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Fermer</button>
                        <button onClick={handlePrint} className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Imprimer</button>
                    </div>
                </div>
            </div>
             <style>{`
              @media print {
                  body {
                      background-color: white !important;
                  }
                  body * {
                      visibility: hidden;
                  }
                  .print-boundary, .print-boundary * {
                      visibility: visible;
                  }
                  .print-boundary {
                      position: absolute !important;
                      left: 0;
                      top: 0;
                      width: 100%;
                      height: auto;
                  }
                  .print-boundary > div {
                      width: 100% !important;
                      max-width: 100% !important;
                      max-height: none !important;
                      box-shadow: none !important;
                      border: none !important;
                  }
                   #ticket-content {
                      padding: 0 !important;
                      overflow: visible !important;
                  }
                  .dark .print-boundary, .dark .print-boundary * {
                      color: black !important;
                      background-color: white !important;
                      border-color: #ccc !important;
                  }
              }
              @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
              .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
              @keyframes slide-up { from { transform: translateY(10px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
              .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </>
    );
}

export default OrderTicket;