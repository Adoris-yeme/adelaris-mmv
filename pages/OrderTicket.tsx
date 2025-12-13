
import React, { useState } from 'react';
import type { Order, Client, Modele } from '../types';
import ImageLightbox from '../components/ImageLightbox';
import { ExpandIcon } from '../components/icons';

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
    const [mode, setMode] = useState<'ticket' | 'invoice'>('ticket');
    const [lightboxData, setLightboxData] = useState<{ images: string[], startIndex: number } | null>(null);

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
                    className="bg-white dark:bg-stone-900 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up print:shadow-none print:rounded-none print:max-h-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Tabs - Hidden on Print */}
                    <div className="flex border-b border-stone-200 dark:border-stone-700 print:hidden">
                        <button 
                            onClick={() => setMode('ticket')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'ticket' ? 'bg-white dark:bg-stone-900 text-orange-900 dark:text-orange-400 border-b-2 border-orange-900 dark:border-orange-400' : 'bg-stone-50 dark:bg-stone-800 text-stone-500 hover:text-stone-700'}`}
                        >
                            Fiche Production (Détails Complets)
                        </button>
                        <button 
                            onClick={() => setMode('invoice')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'invoice' ? 'bg-white dark:bg-stone-900 text-orange-900 dark:text-orange-400 border-b-2 border-orange-900 dark:border-orange-400' : 'bg-stone-50 dark:bg-stone-800 text-stone-500 hover:text-stone-700'}`}
                        >
                            Facture Client (Public)
                        </button>
                    </div>

                    <div id="ticket-content" className="p-8 overflow-y-auto">
                        
                        {/* --- TICKET MODE (INTERNAL - DETAILS) --- */}
                        {mode === 'ticket' && (
                            <>
                                <div className="flex justify-between items-start pb-4 border-b-2 border-dashed border-stone-300 dark:border-stone-700">
                                    <div>
                                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 uppercase tracking-wide">FICHE PRODUCTION</h2>
                                        <p className="text-sm font-mono text-stone-500 dark:text-stone-400 mt-1">REF: {order.ticketId}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-orange-900 dark:text-orange-400">POUR ATELIER</p>
                                        <p className="text-sm text-stone-500">Livraison: {new Date(order.date).toLocaleDateString('fr-FR')}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
                                    {/* Client Info & Measurements */}
                                    <div>
                                        <h3 className="font-bold text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-stone-700 pb-1 mb-2">Client</h3>
                                        <p className="text-stone-700 dark:text-stone-300 font-medium">{client.name}</p>
                                        <p className="text-stone-500 dark:text-stone-400 text-sm">{client.phone}</p>
                                        
                                        <h4 className="font-bold text-stone-800 dark:text-stone-200 mt-4 mb-2">Mesures Prises (cm)</h4>
                                        <ul className="text-sm text-stone-600 dark:text-stone-300 grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 bg-stone-50 dark:bg-stone-800/50 p-3 rounded">
                                            {(Object.keys(measurementLabels) as Array<keyof typeof measurementLabels>).map((key) => {
                                                const value = client.measurements[key];
                                                return value ? <li key={key} className="flex justify-between"><span>{measurementLabels[key]}:</span> <span className="font-bold">{value}</span></li> : null;
                                            })}
                                        </ul>
                                        {client.measurements.observation && (
                                            <div className="mt-2 text-xs text-stone-500 italic bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded">
                                                Obs: {client.measurements.observation}
                                            </div>
                                        )}
                                    </div>
                                    {/* Model Info */}
                                    {model && (
                                        <div>
                                            <h3 className="font-bold text-stone-800 dark:text-stone-200 border-b border-stone-200 dark:border-stone-700 pb-1 mb-2">Modèle à réaliser</h3>
                                            <div className="flex flex-col items-center bg-stone-50 dark:bg-stone-800/50 p-4 rounded group relative">
                                                <div className="relative">
                                                    <img 
                                                        src={model.imageUrls?.[0]} 
                                                        alt={model.title} 
                                                        className="w-48 h-60 object-cover rounded-md mb-2 shadow-sm cursor-pointer hover:opacity-90"
                                                        onClick={() => setLightboxData({ images: model.imageUrls, startIndex: 0 })}
                                                    />
                                                    <button 
                                                        onClick={() => setLightboxData({ images: model.imageUrls, startIndex: 0 })}
                                                        className="absolute bottom-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Voir toutes les façades"
                                                    >
                                                        <ExpandIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-2">Cliquez sur l'image pour voir toutes les façades</p>
                                                <p className="font-bold text-stone-800 dark:text-stone-200 text-lg">{model.title}</p>
                                                <p className="text-sm text-stone-500 dark:text-stone-400 italic">Tissu: {model.fabric}</p>
                                            </div>
                                            {order.notes && (
                                                <div className="mt-4">
                                                    <h4 className="font-bold text-stone-800 dark:text-stone-200 mb-1">Notes de confection</h4>
                                                    <p className="text-sm text-stone-600 dark:text-stone-300 p-2 border border-stone-200 dark:border-stone-700 rounded bg-yellow-50 dark:bg-yellow-900/10">
                                                        {order.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* --- INVOICE MODE (CLIENT) --- */}
                        {mode === 'invoice' && (
                            <div className="text-stone-800 dark:text-stone-200">
                                <div className="flex justify-between items-start pb-6 border-b border-stone-200 dark:border-stone-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-orange-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">M</div>
                                        <div>
                                            <h2 className="text-xl font-bold uppercase tracking-widest text-orange-900 dark:text-orange-400">MMV COUTURE</h2>
                                            <p className="text-xs text-stone-500">L'élégance sur mesure</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h1 className="text-3xl font-light text-stone-400">FACTURE</h1>
                                        <p className="text-sm font-medium mt-1">N° {order.ticketId}</p>
                                        <p className="text-xs text-stone-500">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-8 mb-12">
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Émetteur</p>
                                        <p className="font-bold">{model?.atelierName || 'Atelier MMV'}</p>
                                        <p className="text-sm text-stone-500">Abidjan, Côte d'Ivoire</p>
                                        <p className="text-sm text-stone-500">+225 07 00 00 00 00</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Facturé à</p>
                                        <p className="font-bold text-lg">{client.name}</p>
                                        <p className="text-sm text-stone-500">{client.phone}</p>
                                        {client.email && <p className="text-sm text-stone-500">{client.email}</p>}
                                    </div>
                                </div>

                                <table className="w-full mb-8">
                                    <thead>
                                        <tr className="border-b-2 border-stone-800 dark:border-stone-200">
                                            <th className="text-left py-2 font-bold uppercase text-xs">Description</th>
                                            <th className="text-right py-2 font-bold uppercase text-xs">Date Livraison</th>
                                            <th className="text-right py-2 font-bold uppercase text-xs">Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-stone-200 dark:border-stone-700">
                                            <td className="py-4">
                                                <p className="font-bold">{model?.title}</p>
                                                <p className="text-sm text-stone-500">Confection sur mesure - {model?.event}</p>
                                            </td>
                                            <td className="text-right py-4 text-sm">{new Date(order.date).toLocaleDateString('fr-FR')}</td>
                                            <td className="text-right py-4 font-medium">{order.price ? order.price.toLocaleString('fr-FR') : '-'} FCFA</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="flex justify-end">
                                    <div className="w-1/2 md:w-1/3 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-stone-500">Sous-total</span>
                                            <span>{order.price ? order.price.toLocaleString('fr-FR') : '0'} FCFA</span>
                                        </div>
                                        <div className="flex justify-between border-t border-stone-200 dark:border-stone-700 pt-2">
                                            <span className="font-bold text-lg">Total Net</span>
                                            <span className="font-bold text-lg text-orange-900 dark:text-orange-400">{order.price ? order.price.toLocaleString('fr-FR') : '0'} FCFA</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-6 border-t border-stone-200 dark:border-stone-700 text-center">
                                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200">Merci de votre confiance !</p>
                                    <p className="text-xs text-stone-500 mt-1">Les retouches sont gratuites dans les 7 jours suivant la livraison.</p>
                                </div>
                            </div>
                        )}

                    </div>
                    
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-700 flex justify-end gap-4 print:hidden">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Fermer</button>
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Imprimer {mode === 'invoice' ? 'la Facture' : 'la Fiche'}
                        </button>
                    </div>
                </div>
            </div>
             
            {lightboxData && (
                <ImageLightbox 
                    imageUrls={lightboxData.images} 
                    startIndex={lightboxData.startIndex} 
                    onClose={() => setLightboxData(null)} 
                />
            )}

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
                      background: white !important;
                      color: black !important;
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
