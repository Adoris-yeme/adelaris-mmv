import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { AtelierWithManager, SubscriptionStatus, Modele, ShowcaseStatus } from '../types';
import Sidebar from '../components/Sidebar';
import { LogoutIcon, ImpersonateIcon, KeyIcon } from '../components/icons';
import ConfirmationDialog from '../components/ConfirmationDialog';
import PasswordResetModal from './PasswordResetModal';
import SiteCustomization from '../components/SiteCustomization';

const getStatusBadge = (status: SubscriptionStatus) => {
    switch(status) {
        case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    }
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-stone-800 p-5 rounded-lg shadow-sm flex items-center gap-4">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{value}</p>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{title}</p>
        </div>
    </div>
);

type AdminPage = 'ateliers' | 'showroom' | 'customization';

const AdminDashboard: React.FC = () => {
    const { getAllAteliersWithManager, updateSubscription, logout, impersonate, getPendingShowcaseModels, updateShowcaseStatus } = useAuth();
    
    const [ateliers, setAteliers] = useState<AtelierWithManager[]>(getAllAteliersWithManager());
    const [pendingModels, setPendingModels] = useState<Modele[]>(getPendingShowcaseModels());
    const [currentPage, setCurrentPage] = useState<AdminPage>('ateliers');

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | SubscriptionStatus>('all');
    const [atelierToDeactivate, setAtelierToDeactivate] = useState<AtelierWithManager | null>(null);
    const [resettingUserEmail, setResettingUserEmail] = useState<string | null>(null);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);
    
    const refreshData = () => {
        setAteliers(getAllAteliersWithManager());
        setPendingModels(getPendingShowcaseModels());
    };

    const handleUpdate = (atelier: AtelierWithManager, status: SubscriptionStatus, duration?: number) => {
        updateSubscription(atelier.id, status, duration);
        refreshData();
        setNotification(`Abonnement de "${atelier.name}" mis à jour.`);
    };
    
    const handleConfirmDeactivation = () => {
        if (atelierToDeactivate) {
            handleUpdate(atelierToDeactivate, 'inactive');
            setAtelierToDeactivate(null);
        }
    };

    const handleShowcaseUpdate = (modelId: string, status: ShowcaseStatus) => {
        updateShowcaseStatus(modelId, status);
        refreshData();
        setNotification(`Statut du modèle mis à jour.`);
    };
    
    const filteredAteliers = useMemo(() => {
        return ateliers
            .filter(atelier => {
                if (statusFilter === 'all') return true;
                return atelier.subscription.status === statusFilter;
            })
            .filter(atelier => 
                atelier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                atelier.managerEmail.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [ateliers, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        const total = ateliers.length;
        const active = ateliers.filter(a => a.subscription.status === 'active').length;
        const pending = ateliers.filter(a => a.subscription.status === 'pending').length;
        
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const expiringSoon = ateliers.filter(a => {
            if (a.subscription.status !== 'active' || !a.subscription.expiresAt) return false;
            const expiresAtDate = new Date(a.subscription.expiresAt);
            return expiresAtDate <= thirtyDaysFromNow && expiresAtDate > new Date();
        }).length;
        
        return { total, active, pending, expiringSoon };
    }, [ateliers]);

    return (
        <div className="flex h-screen bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
             <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
            `}</style>
            <Sidebar 
                currentPage="admin"
                setCurrentPage={() => {}}
                theme="light"
                toggleTheme={() => {}}
                isOpen={false}
                setIsOpen={() => {}}
            />
             <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-6 flex-shrink-0">
                    <h1 className="text-xl font-bold text-orange-900 dark:text-orange-400">Panneau Super-Administrateur</h1>
                    <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-orange-800 dark:hover:text-orange-400">
                        <LogoutIcon className="w-5 h-5" />
                        <span>Déconnexion</span>
                    </button>
                </header>
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Ateliers Inscrits" value={stats.total} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-900 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                        <StatCard title="Abonnements Actifs" value={stats.active} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-900 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                        <StatCard title="En Attente" value={stats.pending} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-900 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                        <StatCard title="Expire Bientôt (<30j)" value={stats.expiringSoon} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-900 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
                    </div>
                    
                     {/* Tabs */}
                    <div className="border-b border-stone-200 dark:border-stone-700 mb-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button onClick={() => setCurrentPage('ateliers')} className={`${currentPage === 'ateliers' ? 'border-orange-500 text-orange-600' : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Gestion des Ateliers</button>
                            <button onClick={() => setCurrentPage('showroom')} className={`${currentPage === 'showroom' ? 'border-orange-500 text-orange-600' : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}>
                                Validation Showroom
                                {pendingModels.length > 0 && <span className="ml-2 bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">{pendingModels.length}</span>}
                            </button>
                            <button onClick={() => setCurrentPage('customization')} className={`${currentPage === 'customization' ? 'border-orange-500 text-orange-600' : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Personnalisation du site</button>
                        </nav>
                    </div>

                    {currentPage === 'ateliers' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-stone-800/50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-grow">
                                    <input type="text" placeholder="Rechercher par nom ou email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-4 pr-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800" />
                                </div>
                                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full sm:w-auto px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800">
                                    <option value="all">Tous les statuts</option>
                                    <option value="active">Actif</option>
                                    <option value="inactive">Inactif</option>
                                    <option value="pending">En attente</option>
                                </select>
                            </div>

                            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-x-auto">
                                <table className="w-full text-sm text-left text-stone-500 dark:text-stone-400">
                                    <thead className="text-xs text-stone-700 uppercase bg-stone-50 dark:bg-stone-700 dark:text-stone-300">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Atelier</th>
                                            <th scope="col" className="px-6 py-3">Email Manager</th>
                                            <th scope="col" className="px-6 py-3">Inscrit le</th>
                                            <th scope="col" className="px-6 py-3">Statut</th>
                                            <th scope="col" className="px-6 py-3">Expire le</th>
                                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAteliers.map(atelier => (
                                            <tr key={atelier.id} className="bg-white dark:bg-stone-800 border-b dark:border-stone-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-stone-900 dark:text-white whitespace-nowrap">{atelier.name}</th>
                                                <td className="px-6 py-4">{atelier.managerEmail}</td>
                                                <td className="px-6 py-4">{new Date(atelier.createdAt).toLocaleDateString('fr-FR')}</td>
                                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(atelier.subscription.status)}`}>{atelier.subscription.status}</span></td>
                                                <td className="px-6 py-4">{atelier.subscription.expiresAt ? new Date(atelier.subscription.expiresAt).toLocaleDateString('fr-FR') : 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button onClick={() => handleUpdate(atelier, 'active', 12)} title="Activer pour 1 an" className="p-2 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/50 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
                                                        <button onClick={() => handleUpdate(atelier, 'active', 1)} title="Activer pour 1 mois" className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
                                                        <button onClick={() => setAtelierToDeactivate(atelier)} title="Désactiver" className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg></button>
                                                        <div className="h-5 w-px bg-stone-200 dark:bg-stone-700 mx-1"></div>
                                                        <button onClick={() => impersonate(atelier.managerId)} title="Se connecter en tant que..." className="p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700 rounded-full"><ImpersonateIcon className="h-5 w-5" /></button>
                                                        <button onClick={() => setResettingUserEmail(atelier.managerEmail)} title="Réinitialiser le mot de passe" className="p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700 rounded-full"><KeyIcon className="h-5 w-5" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {currentPage === 'showroom' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                           {pendingModels.length > 0 ? pendingModels.map(model => (
                               <div key={model.id} className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden flex flex-col">
                                   <img src={model.imageUrls[0]} alt={model.title} className="w-full h-48 object-cover"/>
                                   <div className="p-4 flex-grow flex flex-col">
                                        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">{model.title}</p>
                                        <p className="text-xs text-stone-500 dark:text-stone-400">Par: {model.atelierName}</p>
                                   </div>
                                   <div className="p-3 bg-stone-50 dark:bg-stone-700/50 flex justify-end gap-2">
                                       <button onClick={() => handleShowcaseUpdate(model.id, 'rejected')} className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">Rejeter</button>
                                       <button onClick={() => handleShowcaseUpdate(model.id, 'approved')} className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Approuver</button>
                                   </div>
                               </div>
                           )) : (
                               <p className="col-span-full text-center py-12 text-stone-500">Aucun modèle en attente de validation.</p>
                           )}
                        </div>
                    )}

                    {currentPage === 'customization' && (
                        <SiteCustomization />
                    )}
                </main>
            </div>
            {notification && (
                <div className="fixed top-20 right-8 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-down z-50">
                    {notification}
                </div>
            )}
            <ConfirmationDialog
                isOpen={!!atelierToDeactivate}
                onClose={() => setAtelierToDeactivate(null)}
                onConfirm={handleConfirmDeactivation}
                title="Confirmer la désactivation"
                message={`Êtes-vous sûr de vouloir désactiver l'abonnement pour "${atelierToDeactivate?.name}" ?`}
                confirmButtonText="Confirmer la désactivation"
            />
            {resettingUserEmail && (
                <PasswordResetModal 
                    email={resettingUserEmail} 
                    onClose={() => setResettingUserEmail(null)} 
                />
            )}
        </div>
    );
};

export default AdminDashboard;