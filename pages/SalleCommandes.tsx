
import React, { useState } from 'react';
import type { Order, Client, Modele } from '../types';
import { OrderIcon } from '../components/icons';
import { WAITING_ROOM_ID } from '../constants';
import OrderTicket from './OrderTicket';

interface SalleCommandesProps {
    orders: Order[];
    clients: Client[];
    models: Modele[];
    onClaimOrder: (orderId: string) => void;
}

const SalleCommandes: React.FC<SalleCommandesProps> = ({ orders, clients, models, onClaimOrder }) => {
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const availableOrders = orders.filter(o => o.workstationId === WAITING_ROOM_ID && o.status !== 'Livré');

    return (
        <>
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Salle des Commandes</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">Consultez les commandes disponibles et prenez en charge de nouvelles tâches.</p>
            </div>

            <div className="space-y-4">
                {availableOrders.length > 0 ? availableOrders.map(order => {
                    const client = clients.find(c => c.id === order.clientId);
                    const model = models.find(m => m.id === order.modelId);
                    if (!client || !model) return null;

                    return (
                        <div key={order.id} className="bg-white dark:bg-stone-800 rounded-lg shadow-md p-5 flex flex-col md:flex-row gap-5 transition-all hover:shadow-lg">
                            <div className="flex-shrink-0">
                                <img 
                                    src={model.imageUrls?.[0]} 
                                    alt={model.title} 
                                    className="w-32 h-40 rounded-md object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-mono text-xs text-orange-800 dark:text-orange-400">{order.ticketId}</p>
                                        <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">{model.title}</h3>
                                    </div>
                                    <button 
                                        onClick={() => setViewingOrder(order)}
                                        className="px-3 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 rounded-md hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-200 dark:hover:bg-stone-600 flex items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        Voir Détails
                                    </button>
                                </div>
                                <p className="text-sm text-stone-500 dark:text-stone-400">Pour: <span className="font-semibold">{client.name}</span></p>

                                <div className="mt-4 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg">
                                    <h4 className="text-sm font-semibold mb-2">Mesures du client</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                                        <p>Poitrine: <span className="font-medium">{client.measurements.tour_de_poitrine || '-'} cm</span></p>
                                        <p>Taille: <span className="font-medium">{client.measurements.tour_de_taille || '-'} cm</span></p>
                                        <p>Bassin: <span className="font-medium">{client.measurements.tour_de_bassin || '-'} cm</span></p>
                                        <p>L. Corsage: <span className="font-medium">{client.measurements.longueur_corsage || '-'} cm</span></p>
                                        <p>L. Manche: <span className="font-medium">{client.measurements.longueur_manche || '-'} cm</span></p>
                                        <p>L. Pantalon: <span className="font-medium">{client.measurements.longueur_pantalon || '-'} cm</span></p>
                                    </div>
                                     {order.notes && <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 col-span-full">Note: {order.notes}</p>}
                                </div>
                            </div>
                            <div className="flex-shrink-0 md:w-48 flex flex-col justify-center items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-stone-200 dark:border-stone-700 md:pl-5 mt-5 md:mt-0">
                                <p className="font-bold text-lg text-orange-900 dark:text-orange-300">
                                    {order.price ? `${order.price.toLocaleString('fr-FR')} FCFA` : 'Prix à définir'}
                                </p>
                                <button
                                    onClick={() => onClaimOrder(order.id)}
                                    disabled={!order.price}
                                    className="w-full px-5 py-2.5 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-all hover:scale-105 disabled:bg-stone-400 disabled:cursor-not-allowed disabled:scale-100"
                                >
                                    Prendre en charge
                                </button>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-lg shadow-md">
                        <OrderIcon className="mx-auto h-12 w-12 text-stone-400" />
                        <h3 className="mt-2 text-lg font-medium text-stone-900 dark:text-stone-100">Aucune commande en attente</h3>
                        <p className="mt-1 text-sm text-stone-500">Toutes les commandes ont été assignées. Revenez plus tard !</p>
                    </div>
                )}
            </div>
        </div>
        
        {viewingOrder && (
            <OrderTicket
                order={viewingOrder}
                client={clients.find(c => c.id === viewingOrder.clientId)!}
                model={models.find(m => m.id === viewingOrder.modelId)}
                onClose={() => setViewingOrder(null)}
            />
        )}
        </>
    );
};

export default SalleCommandes;
