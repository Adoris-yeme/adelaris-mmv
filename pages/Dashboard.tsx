import React from 'react';
import type { Client, Modele, Appointment, Order, OrderStatus } from '../types';
import { ClientsIcon, AgendaIcon, OrderIcon } from '../components/icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; description: string; }> = ({ title, value, icon, description }) => (
    <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md flex items-center">
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

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statusColors: { [key in OrderStatus]: string } = {
        'En attente de validation': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        'En cours de couture': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'En finition': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
        'Prêt à livrer': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Livré': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold leading-none rounded-full ${statusColors[status]}`}>
            {status}
        </span>
    );
};

const isToday = (someDate: Date) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
           someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
};


interface DashboardProps {
    clients: Client[];
    models: Modele[];
    appointments: Appointment[];
    orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ clients, models, appointments, orders }) => {
  const totalRevenue = orders.filter(o => o.status === 'Livré').reduce((sum, o) => sum + (o.price || 0), 0);
  const activeOrders = orders.filter(o => o.status !== 'Livré');
  const todaysAppointments = appointments.filter(a => isToday(new Date(a.date)));
  const unassignedOrders = orders.filter(o => !o.workstationId && o.status !== 'Livré').slice(0, 5);
  const ordersToProcess = orders
    .filter(o => o.status === 'En cours de couture' || o.status === 'En finition')
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Tableau de bord</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Bienvenue dans votre espace de travail, Atelier Adélaris.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Revenu Total" value={`${totalRevenue.toLocaleString('fr-FR')} FCFA`} description="Commandes livrées" icon={<span className="text-2xl font-bold text-orange-900 dark:text-orange-400"> CFA</span>} />
        <StatCard title="Commandes Actives" value={activeOrders.length} description="En cours ou en attente" icon={<OrderIcon className="h-6 w-6 text-orange-900 dark:text-orange-400" />} />
        <StatCard title="Rendez-vous Aujourd'hui" value={todaysAppointments.length} description="Essayages, livraisons..." icon={<AgendaIcon className="h-6 w-6 text-orange-900 dark:text-orange-400"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Commandes non assignées</h2>
            {unassignedOrders.length > 0 ? (
                <div className="space-y-4">
                    {unassignedOrders.map(order => {
                        const client = clients.find(c => c.id === order.clientId);
                        const model = models.find(m => m.id === order.modelId);
                        if (!client || !model) return null;
                        return (
                             <div key={order.id} className="bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-4">
                                <img src={model.imageUrls?.[0]} alt={model.title} className="w-12 h-16 rounded-md object-cover hidden sm:block"/>
                                <div>
                                    <p className="font-bold text-stone-700 dark:text-stone-200">{model.title}</p>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">Pour: <span className="font-medium">{client.name}</span></p>
                                    <p className="text-xs font-mono text-orange-800 dark:text-orange-400 mt-1">{order.ticketId}</p>
                                </div>
                                </div>
                                {!order.price && <span className="text-xs text-red-500 font-semibold">Prix à définir</span>}
                                <OrderStatusBadge status={order.status} />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-sm text-center text-stone-500 dark:text-stone-400 py-4">Toutes les commandes sont assignées !</p>
            )}
        </div>
        <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Agenda du jour</h2>
            {todaysAppointments.length > 0 ? (
                <div className="space-y-4">
                    {todaysAppointments.map(app => (
                        <div key={app.id} className="bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg">
                             <p className="font-bold text-stone-700 dark:text-stone-200">{app.clientName}</p>
                             <div className="flex justify-between items-center">
                                <p className="text-sm text-stone-500 dark:text-stone-400">{app.type}</p>
                                <p className="text-sm font-semibold text-orange-800 dark:text-orange-400">{app.time}</p>
                             </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className="text-sm text-center text-stone-500 dark:text-stone-400 py-4">Aucun rendez-vous aujourd'hui.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;