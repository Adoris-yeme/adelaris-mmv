
import React, { useMemo } from 'react';
import { useAuth } from '../auth/AuthContext';
import { OrderIcon, AgendaIcon, TrackIcon, ClientsIcon } from '../components/icons';
import OnboardingGuide from '../components/OnboardingGuide';
import type { Order, Client, Modele, Page } from '../types';

// Updated StatCard to be clickable
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; description: string; onClick?: () => void }> = ({ title, value, icon, description, onClick }) => (
    <div 
        onClick={onClick}
        className={`bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md flex items-center transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-95' : ''}`}
    >
        <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-full">
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{title}</p>
            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{value}</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">{description}</p>
        </div>
    </div>
);

const UrgentOrderCard: React.FC<{ order: Order; client?: Client; model?: Modele; daysLeft: number; onClick: () => void }> = ({ order, client, model, daysLeft, onClick }) => {
    const isLate = daysLeft < 0;
    return (
        <div 
            onClick={onClick}
            className={`p-4 rounded-lg border-l-4 shadow-sm flex justify-between items-center cursor-pointer transition-colors ${isLate ? 'bg-red-50 dark:bg-red-900/20 border-red-500 hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30'}`}
        >
            <div>
                <p className="font-bold text-stone-800 dark:text-stone-100">{model?.title || 'Modèle inconnu'}</p>
                <p className="text-sm text-stone-600 dark:text-stone-300">Pour: {client?.name || 'Inconnu'}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-mono mt-1">{order.ticketId} • {order.status}</p>
            </div>
            <div className="text-right">
                <span className={`text-sm font-bold px-2 py-1 rounded ${isLate ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100' : 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-100'}`}>
                    {isLate ? `${Math.abs(daysLeft)} j retard` : `J-${daysLeft}`}
                </span>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Prévu: {new Date(order.date).toLocaleDateString('fr-FR')}</p>
            </div>
        </div>
    );
};

interface DashboardProps {
  isNewAtelier: boolean;
  onDismissOnboarding: () => void;
  // Inject navigation prop (passed from AuthenticatedApp via AtelierApp)
  onNavigate?: (page: Page) => void; 
}

const Dashboard: React.FC<DashboardProps> = ({ isNewAtelier, onDismissOnboarding, onNavigate }) => {
    const { atelier } = useAuth();
    
    if (!atelier) {
        return <div>Chargement du tableau de bord...</div>
    }
  
  const isDataEmpty = atelier.data.clients.length === 0 && atelier.data.models.length === 0 && atelier.data.orders.length === 0;
  const showOnboarding = isNewAtelier && isDataEmpty;

  const activeOrders = atelier.data.orders.filter(o => o.status !== 'Livré');
  const todaysAppointments = atelier.data.appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString());
  
  // Calculate revenue
  const totalRevenue = atelier.data.orders
    .filter(o => o.status === 'Livré')
    .reduce((sum, o) => sum + (o.price || 0), 0);

  // Filter urgent orders (due within 3 days or late)
  const urgentOrders = useMemo(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Normalize today
      
      return activeOrders
        .map(order => {
            const dueDate = new Date(order.date);
            dueDate.setHours(0,0,0,0);
            const diffTime = dueDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return { order, diffDays };
        })
        .filter(item => item.diffDays <= 3) // Late or due in 3 days
        .sort((a, b) => a.diffDays - b.diffDays);
  }, [activeOrders]);

  const handleNav = (page: Page) => {
      if (onNavigate) onNavigate(page);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Tableau de bord</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Bienvenue dans votre espace de travail, {atelier.name}.</p>
      </div>

      {showOnboarding && <OnboardingGuide atelierData={atelier.data} onDismiss={onDismissOnboarding} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
            title="Revenu Total" 
            value={`${totalRevenue.toLocaleString('fr-FR')}`} 
            description="Commandes livrées" 
            icon={<span className="text-2xl font-bold text-orange-900 dark:text-orange-400"> CFA</span>} 
            onClick={() => handleNav('finances')}
        />
        <StatCard 
            title="Commandes Actives" 
            value={activeOrders.length} 
            description="En cours ou en attente" 
            icon={<OrderIcon className="h-6 w-6 text-orange-900 dark:text-orange-400" />} 
            onClick={() => handleNav('commandes')}
        />
        <StatCard 
            title="Rendez-vous Aujourd'hui" 
            value={todaysAppointments.length} 
            description="Essayages, livraisons..." 
            icon={<AgendaIcon className="h-6 w-6 text-orange-900 dark:text-orange-400"/>} 
            onClick={() => handleNav('agenda')}
        />
      </div>

      {/* Urgent Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                  <TrackIcon className="w-6 h-6 text-red-600" />
                  Priorités & Urgences
              </h2>
              {urgentOrders.length > 0 ? (
                  <div className="space-y-3">
                      {urgentOrders.map(({ order, diffDays }) => (
                          <UrgentOrderCard 
                            key={order.id} 
                            order={order} 
                            client={atelier.data.clients.find(c => c.id === order.clientId)}
                            model={atelier.data.models.find(m => m.id === order.modelId)}
                            daysLeft={diffDays}
                            onClick={() => handleNav('commandes')}
                          />
                      ))}
                  </div>
              ) : (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                      <p className="text-green-800 dark:text-green-300 font-medium">Tout est sous contrôle !</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Aucune commande en retard ou urgente (J-3).</p>
                  </div>
              )}
          </div>

          <div className="lg:col-span-1">
                <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md h-full">
                    <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Accès rapide</h2>
                    <p className="text-stone-600 dark:text-stone-400 text-sm mb-6">
                        Gérez facilement votre activité au quotidien.
                    </p>
                    <div className="space-y-3">
                        <button onClick={() => handleNav('clients')} className="w-full text-left p-3 bg-stone-50 dark:bg-stone-700/30 rounded flex items-center gap-3 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-stone-700 dark:text-stone-300 font-medium">Ajouter un nouveau client</span>
                        </button>
                        <button onClick={() => handleNav('commandes')} className="w-full text-left p-3 bg-stone-50 dark:bg-stone-700/30 rounded flex items-center gap-3 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-stone-700 dark:text-stone-300 font-medium">Créer une nouvelle commande</span>
                        </button>
                        <button onClick={() => handleNav('agenda')} className="w-full text-left p-3 bg-stone-50 dark:bg-stone-700/30 rounded flex items-center gap-3 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-stone-700 dark:text-stone-300 font-medium">Voir l'agenda de la semaine</span>
                        </button>
                    </div>
                </div>
          </div>
      </div>
       <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default Dashboard;
