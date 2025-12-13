

import React, { useState, useEffect } from 'react';
import type { Client, Order, Modele, OrderStatus } from '../types';
import AddOrderForm from './AddOrderForm';
import OrderTicket from './OrderTicket';
import ImageLightbox from '../components/ImageLightbox';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { ChevronLeftIcon } from '../components/icons';

interface ClientDetailProps {
    client: Client;
    orders: Order[];
    models: Modele[];
    onClose: () => void;
    onUpdateClient: (client: Client) => void;
    onDeleteClient: (clientId: string) => void;
    onAddOrder: (orderData: Omit<Order, 'id' | 'ticketId'>) => void;
    onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
    onNotifyOrder: (order: Order) => void;
}

const statusOptions: OrderStatus[] = [
  'En attente de validation',
  'En cours de couture',
  'En finition',
  'Prêt à livrer',
  'Livré'
];

const getStatusColorClasses = (status: OrderStatus) => {
  switch (status) {
    case 'En attente de validation':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'En cours de couture':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'En finition':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300';
    case 'Prêt à livrer':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case 'Livré':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    default:
      return 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-300';
  }
};


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


const ClientDetail: React.FC<ClientDetailProps> = ({ client, orders, models, onClose, onUpdateClient, onDeleteClient, onAddOrder, onUpdateOrderStatus, onNotifyOrder }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showAddOrderForm, setShowAddOrderForm] = useState(false);
    const [viewingTicket, setViewingTicket] = useState<Order | null>(null);
    const [lightboxData, setLightboxData] = useState<{ images: string[], startIndex: number } | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const getInitialEditableMeasurements = () => 
        (Object.keys(measurementLabels) as Array<keyof typeof measurementLabels>).reduce((acc, key) => {
            acc[key] = client.measurements[key] ? String(client.measurements[key]) : '';
            return acc;
        }, {} as { [key in keyof typeof measurementLabels]: string });

    const [editableMeasurements, setEditableMeasurements] = useState(getInitialEditableMeasurements());
    const [observation, setObservation] = useState(client.measurements.observation || '');

    useEffect(() => {
        setEditableMeasurements(getInitialEditableMeasurements());
        setObservation(client.measurements.observation || '');
    }, [client]);

    const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const sanitizedValue = value.replace(/[^0-9.]/g, '');
        setEditableMeasurements(prev => ({ ...prev, [name]: sanitizedValue }));
    };

    const handleSaveChanges = () => {
        const newMeasurements: Client['measurements'] = {
            observation: observation || undefined,
        };
        for (const key in editableMeasurements) {
            const typedKey = key as keyof typeof editableMeasurements;
            const value = editableMeasurements[typedKey];
            if (value) {
                newMeasurements[typedKey] = Number(value);
            }
        }
        onUpdateClient({ ...client, measurements: newMeasurements });
        setIsEditing(false);
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
        setEditableMeasurements(getInitialEditableMeasurements());
        setObservation(client.measurements.observation || '');
    };
    
    const handleSaveOrder = (orderData: Omit<Order, 'id' | 'clientId' | 'ticketId'>) => {
        const dataToSend = {
            clientId: client.id,
            ...orderData
        };
        onAddOrder(dataToSend);
        setShowAddOrderForm(false);
    };

    const handleDelete = () => {
        onDeleteClient(client.id);
        onClose(); // Close the detail modal after deletion
    };


    return (
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
                onClick={onClose}
            >
                <div 
                    className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 sm:p-8 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button onClick={onClose} className="p-2 -ml-2 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors" aria-label="Retour">
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">{client.name}</h2>
                                <p className="text-stone-500 dark:text-stone-400">{client.phone}{client.email && ` • ${client.email}`}</p>
                            </div>
                        </div>
                         <button 
                            onClick={() => setShowDeleteConfirm(true)} 
                            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
                        >
                            Supprimer
                        </button>
                    </div>

                    <div className="flex-1 p-6 sm:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Measurements Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-stone-700 dark:text-stone-200">Les Mesures</h3>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-orange-800 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300">Modifier</button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={handleCancelEditing} className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-stone-100">Annuler</button>
                                        <button onClick={handleSaveChanges} className="text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">Enregistrer</button>
                                    </div>
                                )}
                            </div>
                            <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                                    {(Object.keys(measurementLabels) as Array<keyof typeof measurementLabels>).map((key) => (
                                        <div key={key}>
                                            <label className="text-xs text-stone-500 dark:text-stone-400 capitalize">{measurementLabels[key]}</label>
                                            {isEditing ? (
                                                <input 
                                                    type="text"
                                                    inputMode="numeric"
                                                    name={key}
                                                    value={editableMeasurements[key]}
                                                    onChange={handleMeasurementChange}
                                                    className="mt-1 block w-full px-2 py-1 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                />
                                            ) : (
                                                <p className="text-stone-800 dark:text-stone-100 font-medium">{client.measurements[key] ? `${client.measurements[key]} cm` : '-'}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                                     <label className="text-xs text-stone-500 dark:text-stone-400">Observation</label>
                                      {isEditing ? (
                                        <textarea
                                            value={observation}
                                            onChange={(e) => setObservation(e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full px-2 py-1 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                                        />
                                    ) : (
                                        <p className="text-sm text-stone-800 dark:text-stone-100 whitespace-pre-wrap">{observation || '-'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order History Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-stone-700 dark:text-stone-200">Historique des commandes</h3>
                            {orders.length > 0 ? (
                                <div className="space-y-3">
                                    {orders.map(order => {
                                        const model = models.find(m => m.id === order.modelId);
                                        if (!model) return null;
                                        return (
                                            <div key={order.id} className="bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                <img 
                                                    src={model.imageUrls?.[0]} 
                                                    alt={model.title} 
                                                    className="w-16 h-20 rounded-md object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => setLightboxData({ images: model.imageUrls, startIndex: 0 })}
                                                />
                                                <div className="flex-1">
                                                    <p className="font-bold text-stone-700 dark:text-stone-200">{model.title}</p>
                                                    <p className="text-xs text-stone-500 dark:text-stone-400">Commandé le: {new Date(order.date).toLocaleDateString('fr-FR')}</p>
                                                    <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-1">Ticket: {order.ticketId}</p>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto self-end">
                                                   <button onClick={() => setViewingTicket(order)} className="text-xs font-medium text-center text-orange-800 dark:text-orange-400 hover:underline px-2 py-1">Voir le Ticket</button>
                                                   <div className="relative">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                            className={`w-full appearance-none text-xs font-semibold leading-none rounded-full px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-stone-800 focus:ring-orange-500 transition-colors cursor-pointer ${getStatusColorClasses(order.status)}`}
                                                        >
                                                            {statusOptions.map(option => (
                                                                <option key={option} value={option} className="font-sans bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200">{option}</option>
                                                            ))}
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-current">
                                                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                        </div>
                                                    </div>
                                                     <div>
                                                        {order.status === 'Prêt à livrer' && (
                                                            <button onClick={() => onNotifyOrder(order)} className="w-full text-xs font-medium text-center text-white bg-orange-900 rounded-full px-2.5 py-1.5 hover:bg-orange-800 transition-colors">
                                                                Notifier
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg">Aucune commande trouvée.</p>
                            )}
                        </div>
                    </div>

                    <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
                        <button 
                            onClick={() => setShowAddOrderForm(true)}
                            className="w-full flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-transform hover:scale-105"
                        >
                            Créer une nouvelle commande
                        </button>
                    </div>
                </div>
                <style>{`
                  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                  .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                  @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                  .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
                `}</style>
            </div>
            
            {showAddOrderForm && (
                <AddOrderForm
                    client={client}
                    models={models}
                    onClose={() => setShowAddOrderForm(false)}
                    onSave={handleSaveOrder}
                />
            )}

            {viewingTicket && (
                <OrderTicket
                    order={viewingTicket}
                    client={client}
                    model={models.find(m => m.id === viewingTicket.modelId)}
                    onClose={() => setViewingTicket(null)}
                />
            )}

            {lightboxData && (
                <ImageLightbox
                    imageUrls={lightboxData.images}
                    startIndex={lightboxData.startIndex}
                    onClose={() => setLightboxData(null)}
                />
            )}
             <ConfirmationDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer ${client.name} ? Toutes ses commandes et rendez-vous seront également supprimés. Cette action est irréversible.`}
            />
        </>
    );
};

export default ClientDetail;