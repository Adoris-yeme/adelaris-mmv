import React, { useState } from 'react';
import type { Order, Modele } from '../types';
import { TrackIcon } from '../components/icons';

const getStatusColorClasses = (status: Order['status']) => {
  switch (status) {
    case 'En attente de validation': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'En cours de couture': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'En finition': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300';
    case 'Prêt à livrer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case 'Livré': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    default: return 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-300';
  }
};

const OrderStatusTimeline: React.FC<{ order: Order, model?: Modele }> = ({ order, model }) => {
    const statuses: Order['status'][] = ['En attente de validation', 'En cours de couture', 'En finition', 'Prêt à livrer', 'Livré'];
    const currentStatusIndex = statuses.indexOf(order.status);

    return (
        <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-3xl mx-auto mt-8">
            <div className="text-center mb-8">
                <p className="text-sm font-mono text-orange-800 dark:text-orange-400">{order.ticketId}</p>
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{model?.title || 'Votre Commande'}</h2>
                <p className="text-stone-500 dark:text-stone-400">Date de commande : {new Date(order.date).toLocaleDateString('fr-FR')}</p>
                
                <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2">
                    {order.price && (
                        <p className="text-lg font-semibold text-stone-700 dark:text-stone-200">
                            Prix: <span className="text-orange-900 dark:text-orange-300">{order.price.toLocaleString('fr-FR')} FCFA</span>
                        </p>
                    )}
                    <div className="flex items-center gap-2">
                         <p className="text-lg font-semibold text-stone-700 dark:text-stone-200">Statut:</p>
                         <span className={`px-3 py-1 text-sm font-bold leading-none rounded-full ${getStatusColorClasses(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {order.notes && (
                    <div className="mt-4 text-left max-w-md mx-auto bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg">
                        <p className="text-sm text-stone-600 dark:text-stone-300"><span className="font-semibold">Notes de l'atelier:</span> {order.notes}</p>
                    </div>
                )}
            </div>

            <div className="relative pt-4">
                <div className="absolute left-4 sm:left-1/2 top-0 h-full w-0.5 bg-stone-200 dark:bg-stone-700 sm:-translate-x-1/2"></div>
                {statuses.map((status, index) => {
                    const isActive = index <= currentStatusIndex;
                    return (
                        <div key={status} className="relative flex items-center mb-8">
                            <div className={`absolute left-4 sm:left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-orange-800' : 'bg-stone-300 dark:bg-stone-600'}`}>
                                {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                             <div className={`w-full pl-12 sm:pl-0 sm:w-1/2 ${index % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8 sm:ml-auto'}`}>
                                <div className={`p-4 rounded-lg bg-stone-50 dark:bg-stone-800/50 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                    <h3 className="font-semibold text-stone-700 dark:text-stone-200">{status}</h3>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface SuiviCommandeProps {
    orders: Order[];
    models: Modele[];
}

const SuiviCommande: React.FC<SuiviCommandeProps> = ({ orders, models }) => {
    const [ticketId, setTicketId] = useState('');
    const [searchedOrder, setSearchedOrder] = useState<Order | null | undefined>(undefined); // undefined: not searched, null: not found

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const foundOrder = orders.find(o => o.ticketId.toLowerCase() === ticketId.trim().toLowerCase());
        setSearchedOrder(foundOrder || null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Suivre votre commande</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">Entrez votre numéro de ticket pour voir l'avancement.</p>
            </div>
            <div className="max-w-xl mx-auto bg-white dark:bg-stone-800/50 p-6 rounded-lg shadow-sm">
                <form onSubmit={handleSearch} className="flex items-center gap-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <TrackIcon className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Entrez votre numéro de ticket (ex: CMD-XXXXXX)"
                            value={ticketId}
                            onChange={(e) => setTicketId(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>
                    <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 transition-colors">
                        Rechercher
                    </button>
                </form>
            </div>

            {searchedOrder && (
                <OrderStatusTimeline order={searchedOrder} model={models.find(m => m.id === searchedOrder.modelId)} />
            )}
            
            {searchedOrder === null && (
                 <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-lg shadow-md">
                    <svg className="mx-auto h-12 w-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <h3 className="mt-2 text-sm font-medium text-stone-900 dark:text-stone-100">Commande introuvable</h3>
                    <p className="mt-1 text-sm text-stone-500">Veuillez vérifier votre numéro de ticket et réessayer.</p>
                </div>
            )}
        </div>
    );
};

export default SuiviCommande;