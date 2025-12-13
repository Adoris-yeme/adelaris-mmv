
import React, { useState } from 'react';
import type { SubscriptionPlan } from '../types';

interface PaymentModalProps {
    plan: SubscriptionPlan;
    price: string;
    onClose: () => void;
    onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, price, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState<'card' | 'mobile'>('card');

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-stone-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-stone-200 dark:border-stone-700 bg-orange-50 dark:bg-orange-900/20">
                    <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">Confirmation de l'abonnement</h3>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-stone-600 dark:text-stone-300 capitalize font-medium">Plan {plan}</span>
                        <span className="text-lg font-bold text-orange-800 dark:text-orange-400">{price} <span className="text-xs font-normal">/ mois</span></span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex gap-4 mb-6">
                        <button 
                            type="button"
                            onClick={() => setMethod('card')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md border ${method === 'card' ? 'border-orange-500 bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' : 'border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400'}`}
                        >
                            Carte Bancaire
                        </button>
                        <button 
                            type="button"
                            onClick={() => setMethod('mobile')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md border ${method === 'mobile' ? 'border-orange-500 bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' : 'border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400'}`}
                        >
                            Mobile Money
                        </button>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                        {method === 'card' ? (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-stone-500 mb-1">Numéro de carte</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-stone-500 mb-1">Date d'expiration</label>
                                        <input type="text" placeholder="MM/AA" className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-stone-500 mb-1">CVC</label>
                                        <input type="text" placeholder="123" className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-stone-500 mb-1">Nom sur la carte</label>
                                    <input type="text" placeholder="Nom Prénom" className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50" required />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-xs font-medium text-stone-500 mb-1">Numéro de téléphone</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-700 text-stone-500 text-sm">
                                        +225
                                    </span>
                                    <input type="tel" placeholder="01 02 03 04 05" className="flex-1 p-2.5 rounded-r-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-700/50" required />
                                </div>
                                <p className="text-xs text-stone-500 mt-2">Vous recevrez une demande de paiement sur votre mobile.</p>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 mt-4 bg-orange-900 hover:bg-orange-800 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Traitement...
                                </>
                            ) : (
                                `Payer ${price}`
                            )}
                        </button>
                        <button type="button" onClick={onClose} className="w-full py-2 text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300">Annuler</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
