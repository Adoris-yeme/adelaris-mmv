
import React, { useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { LogoutIcon } from '../components/icons';
import EditProfileModal from '../components/EditProfileModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import PaymentModal from '../components/PaymentModal';
import type { SubscriptionPlan } from '../types';

const PLANS: { id: SubscriptionPlan; name: string; price: string; features: string[] }[] = [
    { 
        id: 'premium', 
        name: 'Abonnement Atelier Pro', 
        price: '5.000 FCFA', 
        features: ['Clients & Commandes illimités', 'Postes de travail illimités', 'Notifications WhatsApp', 'Statistiques Financières', 'Support Prioritaire'] 
    }
];

const Settings: React.FC = () => {
    const { atelier, user, isSubscriptionActive, resetAtelierData, updateManagerProfile, updateAtelierData, logout, upgradeClientSubscription } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importError, setImportError] = useState('');
    const [importSuccess, setImportSuccess] = useState('');
    
    // Payment State
    const [showPayment, setShowPayment] = useState(false);

    if (!atelier || !user) return null;

    const handleUpdateProfile = (profile: any) => {
        updateManagerProfile(profile);
    };

    const handleResetData = () => {
        resetAtelierData(atelier.id);
        setShowResetConfirm(false);
    };

    // Export Data Logic
    const handleExportData = () => {
        const dataStr = JSON.stringify(atelier.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const date = new Date().toISOString().split('T')[0];
        link.download = `sauvegarde_atelier_${atelier.name.replace(/\s/g, '_')}_${date}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Import Data Logic
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImportError('');
        setImportSuccess('');
        
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = event.target?.result as string;
                const parsedData = JSON.parse(json);
                
                // Basic validation (check if key fields exist)
                if (!parsedData.clients || !parsedData.models || !parsedData.orders) {
                    throw new Error("Format de fichier invalide.");
                }

                // Update data
                updateAtelierData(atelier.id, parsedData);
                setImportSuccess('Données restaurées avec succès !');
            } catch (err) {
                console.error(err);
                setImportError('Erreur : Le fichier est corrompu ou invalide.');
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = ''; 
    };

    // Payment Logic
    const handleSubscribe = () => {
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        upgradeClientSubscription('premium', 1); // Upgrade for 1 month
        setShowPayment(false);
        alert("Paiement réussi ! Votre abonnement a été activé pour 1 mois.");
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Paramètres</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">Gérez votre compte et les préférences de l'atelier.</p>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Profil de l'Atelier</h2>
                    <button onClick={() => setShowProfileModal(true)} className="text-sm font-medium text-orange-900 hover:text-orange-700 dark:text-orange-400">Modifier</button>
                </div>
                <div className="p-6 flex items-center gap-6">
                    <img src={atelier.data.managerProfile.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-stone-100 dark:border-stone-700" />
                    <div>
                        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">{atelier.name}</h3>
                        <p className="text-stone-500 dark:text-stone-400">{user.email}</p>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                            Type: {atelier.data.managerProfile.atelierType || 'Non spécifié'} 
                            {atelier.data.managerProfile.employeeCount !== undefined && ` • ${atelier.data.managerProfile.employeeCount} employés`}
                        </p>
                        <p className="text-xs text-stone-400 mt-1">ID: {atelier.id}</p>
                    </div>
                </div>
            </div>

            {/* Subscription Section */}
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-200 dark:border-stone-700">
                    <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Votre Abonnement</h2>
                </div>
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isSubscriptionActive ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800'}`}>
                                    {isSubscriptionActive ? 'Actif' : 'Inactif / Expiré'}
                                </span>
                                {atelier.subscription.status === 'trial' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                        Période d'essai
                                    </span>
                                )}
                            </div>
                            {atelier.subscription.expiresAt ? (
                                <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
                                    Expire le : <span className="font-medium text-stone-800 dark:text-stone-200">{new Date(atelier.subscription.expiresAt).toLocaleDateString('fr-FR')}</span>
                                </p>
                            ) : (
                                <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">Aucune date d'expiration.</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="border border-orange-500 bg-orange-50 dark:bg-orange-900/10 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">OFFRE UNIQUE</div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">Premium Illimité</h3>
                                <p className="text-3xl font-extrabold text-orange-900 dark:text-orange-400 my-2">5.000 FCFA <span className="text-sm font-normal text-stone-600 dark:text-stone-400">/ mois</span></p>
                                <ul className="text-sm text-stone-600 dark:text-stone-300 space-y-1">
                                    <li>✓ Tout illimité (Clients, Commandes, Stock)</li>
                                    <li>✓ Notifications & Statistiques</li>
                                </ul>
                            </div>
                            <button
                                onClick={handleSubscribe}
                                className="w-full md:w-auto px-8 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                            >
                                {isSubscriptionActive ? 'Prolonger l\'abonnement' : 'S\'abonner maintenant'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Settings & Security */}
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-200 dark:border-stone-700">
                    <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Sécurité & Données</h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* Access Code */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-stone-800 dark:text-stone-200">Code d'accès Manager</p>
                            <p className="text-sm text-stone-500 dark:text-stone-400">Utilisé pour basculer du mode client au mode manager.</p>
                        </div>
                        <div className="font-mono bg-stone-100 dark:bg-stone-700 px-3 py-1 rounded text-stone-800 dark:text-stone-200 select-all">
                            {atelier.data.managerAccessCode}
                        </div>
                    </div>

                    <div className="border-t border-stone-200 dark:border-stone-700 pt-6">
                        <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-2">Sauvegarde des Données</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                            Vos données sont stockées localement sur cet appareil. Exportez-les régulièrement.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleExportData}
                                className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-md text-sm font-medium transition-colors border border-blue-200 dark:border-blue-800"
                            >
                                📥 Exporter mes données (Backup)
                            </button>
                            <button 
                                onClick={handleImportClick}
                                className="flex-1 px-4 py-2 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600 rounded-md text-sm font-medium transition-colors border border-stone-200 dark:border-stone-600"
                            >
                                📤 Restaurer une sauvegarde
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept=".json" 
                                className="hidden" 
                            />
                        </div>
                        {importError && <p className="text-red-500 text-sm mt-2">{importError}</p>}
                        {importSuccess && <p className="text-green-500 text-sm mt-2">{importSuccess}</p>}
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-200 dark:border-red-900/50 rounded-lg overflow-hidden">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 border-b border-red-100 dark:border-red-900/30">
                    <h2 className="text-xl font-bold text-red-800 dark:text-red-400">Zone de Danger</h2>
                </div>
                <div className="p-6 bg-white dark:bg-stone-800">
                    <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">
                        La réinitialisation des données supprimera définitivement tous vos clients, commandes, modèles et rendez-vous. Cette action est irréversible.
                    </p>
                    <button 
                        onClick={() => setShowResetConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Réinitialiser toutes les données
                    </button>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button onClick={logout} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors">
                    <LogoutIcon className="w-5 h-5" />
                    Se déconnecter
                </button>
            </div>

            {showProfileModal && (
                <EditProfileModal
                    profile={atelier.data.managerProfile}
                    onClose={() => setShowProfileModal(false)}
                    onSave={handleUpdateProfile}
                    onOpenChangePassword={() => {}} 
                />
            )}

            <ConfirmationDialog
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={handleResetData}
                title="Êtes-vous absolument sûr ?"
                message="Cette action effacera toutes les données de l'atelier. Cela ne peut pas être annulé."
                confirmButtonText="Oui, tout effacer"
            />

            {showPayment && (
                <PaymentModal
                    plan="premium"
                    price="5.000 FCFA"
                    onClose={() => setShowPayment(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default Settings;
