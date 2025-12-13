
import React, { useState, useMemo } from 'react';
import type { Order, Client, Modele } from '../types';
import { ArchiveIcon } from '../components/icons';

interface ArchivesCommandesProps {
    orders: Order[];
    clients: Client[];
    models: Modele[];
}

const ArchivesCommandes: React.FC<ArchivesCommandesProps> = ({ orders, clients, models }) => {
    const today = new Date().toISOString().split('T')[0];
    const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
    
    const [startDate, setStartDate] = useState(oneMonthAgo);
    const [endDate, setEndDate] = useState(today);

    const filteredOrders = useMemo(() => {
        return orders
            .filter(o => o.status === 'Livré')
            .filter(o => {
                const orderDate = new Date(o.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Include the whole end day
                return orderDate >= start && orderDate <= end;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders, startDate, endDate]);

    const totalRevenue = useMemo(() => {
        return filteredOrders.reduce((acc, order) => acc + (order.price || 0), 0);
    }, [filteredOrders]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6" id="archive-page">
            <style>{`
                @media print {
                    body {
                        background-color: white !important;
                    }
                    #root > div > .flex-1.flex.flex-col {
                        padding: 0;
                        margin: 0;
                    }
                    main {
                        padding: 1.5rem !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    #archive-page {
                        margin: 0;
                        padding: 0;
                    }
                    .printable-table th, .printable-table td {
                        border: 1px solid #ddd !important;
                        padding: 8px !important;
                        font-size: 10pt !important;
                    }
                    .printable-table th {
                         background-color: #f2f2f2 !important;
                         -webkit-print-color-adjust: exact; 
                         color-adjust: exact;
                    }
                    .dark .printable-table th {
                        color: black !important;
                    }
                }
            `}</style>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 no-print">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Archives des Commandes</h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Consultez et imprimez les commandes livrées.</p>
                </div>
                <button 
                    onClick={handlePrint} 
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h1v-4a1 1 0 011-1h10a1 1 0 011 1v4h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                    Imprimer la sélection
                </button>
            </div>
            
            {/* Filters and Stats */}
            <div className="bg-white dark:bg-stone-800/50 p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 no-print">
                <div className="flex items-center gap-4">
                     <div>
                        <label htmlFor="start-date" className="text-sm font-medium text-stone-700 dark:text-stone-300">Du</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="ml-2 p-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                     </div>
                     <div>
                        <label htmlFor="end-date" className="text-sm font-medium text-stone-700 dark:text-stone-300">Au</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="ml-2 p-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                     </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-stone-800 dark:text-stone-100">{filteredOrders.length} commandes livrées</p>
                    <p className="text-lg font-bold text-orange-900 dark:text-orange-400">{totalRevenue.toLocaleString('fr-FR')} FCFA</p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left text-stone-500 dark:text-stone-400 printable-table">
                    <thead className="text-xs text-stone-700 uppercase bg-stone-50 dark:bg-stone-700 dark:text-stone-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Ticket ID</th>
                            <th scope="col" className="px-6 py-3">Date Livraison</th>
                            <th scope="col" className="px-6 py-3">Client</th>
                            <th scope="col" className="px-6 py-3">Modèle</th>
                            <th scope="col" className="px-6 py-3 text-right">Prix</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => {
                             const client = clients.find(c => c.id === order.clientId);
                             const model = models.find(m => m.id === order.modelId);
                             return (
                                <tr key={order.id} className="bg-white dark:bg-stone-800 border-b dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-600/20">
                                    <th scope="row" className="px-6 py-4 font-mono text-stone-900 dark:text-white whitespace-nowrap">{order.ticketId}</th>
                                    <td className="px-6 py-4">{new Date(order.date).toLocaleDateString('fr-FR')}</td>
                                    <td className="px-6 py-4">{client?.name}</td>
                                    <td className="px-6 py-4">{model?.title}</td>
                                    <td className="px-6 py-4 font-semibold text-right text-stone-800 dark:text-stone-200">{order.price?.toLocaleString('fr-FR')} FCFA</td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
                 {filteredOrders.length === 0 && (
                    <div className="text-center py-16">
                        <ArchiveIcon className="mx-auto h-12 w-12 text-stone-400" />
                        <h3 className="mt-2 text-lg font-medium text-stone-900 dark:text-stone-100">Aucune commande livrée</h3>
                        <p className="mt-1 text-sm text-stone-500">Aucune commande ne correspond à la période sélectionnée.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchivesCommandes;
