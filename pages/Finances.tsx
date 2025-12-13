
import React, { useMemo, useState } from 'react';
import type { Order, Modele, Client, Expense } from '../types';
import { TrashIcon } from '../components/icons';

interface FinancesProps {
    orders: Order[];
    models: Modele[];
    clients: Client[];
    expenses: Expense[];
    onAddExpense: (expense: Omit<Expense, 'id'>) => void;
    onDeleteExpense: (id: string) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color?: string }> = ({ title, value, icon, color = 'bg-orange-100 dark:bg-orange-900/50' }) => (
    <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md flex items-start">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{title}</p>
            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{value}</p>
        </div>
    </div>
);

const BarChart: React.FC<{ data: { label: string; value: number }[]; title: string }> = ({ data, title }) => {
    const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);

    return (
        <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">{title}</h3>
            <div className="space-y-4">
                {data.map(item => (
                    <div key={item.label} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-stone-500 dark:text-stone-400 text-right">{item.label}</div>
                        <div className="flex-1 bg-stone-100 dark:bg-stone-700 rounded-full h-6">
                            <div
                                className="bg-orange-800 h-6 rounded-full flex items-center justify-end px-2 transition-all duration-500"
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            >
                                <span className="text-xs font-bold text-white">{item.value.toLocaleString('fr-FR')}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AddExpenseForm: React.FC<{ onAdd: (e: Omit<Expense, 'id'>) => void }> = ({ onAdd }) => {
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [cat, setCat] = useState<Expense['category']>('Matériel');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!desc || !amount) return;
        onAdd({
            description: desc,
            amount: Number(amount),
            category: cat,
            date: new Date(date).toISOString()
        });
        setDesc('');
        setAmount('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-stone-50 dark:bg-stone-700/30 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
                <label className="block text-xs font-medium mb-1">Description</label>
                <input type="text" value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800" placeholder="Ex: Achat fils" required />
            </div>
            <div className="w-full md:w-32">
                <label className="block text-xs font-medium mb-1">Montant</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800" placeholder="0" required />
            </div>
            <div className="w-full md:w-40">
                <label className="block text-xs font-medium mb-1">Catégorie</label>
                <select value={cat} onChange={e => setCat(e.target.value as any)} className="w-full p-2 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800">
                    <option>Matériel</option>
                    <option>Loyer</option>
                    <option>Électricité</option>
                    <option>Salaires</option>
                    <option>Marketing</option>
                    <option>Autre</option>
                </select>
            </div>
            <div className="w-full md:w-36">
                <label className="block text-xs font-medium mb-1">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 rounded border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800" />
            </div>
            <button type="submit" className="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium">Ajouter</button>
        </form>
    )
}


const Finances: React.FC<FinancesProps> = ({ orders, models, clients, expenses, onAddExpense, onDeleteExpense }) => {
    const [tab, setTab] = useState<'overview' | 'expenses'>('overview');

    const financialData = useMemo(() => {
        const deliveredOrders = orders.filter(o => o.status === 'Livré');
        
        const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.price || 0), 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const netProfit = totalRevenue - totalExpenses;
        
        const averageOrderValue = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;
        
        // Monthly Revenue
        const monthlyRevenue: { [key: string]: number } = {};
        deliveredOrders.forEach(order => {
            const month = new Date(order.date).toLocaleString('fr-FR', { year: '2-digit', month: 'short' });
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (order.price || 0);
        });

        const monthlyChartData = Object.entries(monthlyRevenue)
            .map(([label, value]) => ({ label, value }))
            .slice(-6); // Last 6 months

        // Top Models
        const topModelsData: { [key: string]: number } = {};
        deliveredOrders.forEach(order => {
            topModelsData[order.modelId] = (topModelsData[order.modelId] || 0) + (order.price || 0);
        });
        const topModels = Object.entries(topModelsData)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([modelId, value]) => ({
                label: models.find(m => m.id === modelId)?.title || 'Modèle supprimé',
                value,
            }));
            
        // Top Clients
        const topClientsData: { [key: string]: number } = {};
        deliveredOrders.forEach(order => {
            topClientsData[order.clientId] = (topClientsData[order.clientId] || 0) + (order.price || 0);
        });
        const topClients = Object.entries(topClientsData)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([clientId, value]) => ({
                label: clients.find(c => c.id === clientId)?.name || 'Client supprimé',
                value,
            }));

        return { totalRevenue, totalExpenses, netProfit, averageOrderValue, monthlyChartData, topModels, topClients };
    }, [orders, models, clients, expenses]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Finances</h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Analysez la performance financière de votre atelier.</p>
                </div>
                <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
                    <button 
                        onClick={() => setTab('overview')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'overview' ? 'bg-white dark:bg-stone-600 shadow text-stone-800 dark:text-white' : 'text-stone-500 dark:text-stone-400'}`}
                    >
                        Vue d'ensemble
                    </button>
                    <button 
                        onClick={() => setTab('expenses')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'expenses' ? 'bg-white dark:bg-stone-600 shadow text-stone-800 dark:text-white' : 'text-stone-500 dark:text-stone-400'}`}
                    >
                        Dépenses
                    </button>
                </div>
            </div>

            {/* Global Stats (Always Visible) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Chiffre d'Affaires" 
                    value={`${financialData.totalRevenue.toLocaleString('fr-FR')} FCFA`} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-900 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard 
                    title="Dépenses Totales" 
                    value={`${financialData.totalExpenses.toLocaleString('fr-FR')} FCFA`} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-900 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
                    color="bg-red-100 dark:bg-red-900/50"
                />
                <StatCard 
                    title="Bénéfice Net" 
                    value={`${financialData.netProfit.toLocaleString('fr-FR')} FCFA`} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-900 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="bg-green-100 dark:bg-green-900/50"
                />
            </div>

            {tab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    <BarChart data={financialData.monthlyChartData} title="Revenu Mensuel (FCFA)" />
                    <div className="space-y-8">
                        <BarChart data={financialData.topModels} title="Top 5 Modèles (par revenu)" />
                        <BarChart data={financialData.topClients} title="Top 5 Clients (par revenu)" />
                    </div>
                </div>
            )}

            {tab === 'expenses' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Ajouter une dépense</h3>
                        <AddExpenseForm onAdd={onAddExpense} />
                    </div>

                    <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">Historique des dépenses</h3>
                        {expenses.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-stone-500 dark:text-stone-400">
                                    <thead className="text-xs text-stone-700 uppercase bg-stone-50 dark:bg-stone-700 dark:text-stone-300">
                                        <tr>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Description</th>
                                            <th className="px-4 py-3">Catégorie</th>
                                            <th className="px-4 py-3 text-right">Montant</th>
                                            <th className="px-4 py-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(exp => (
                                            <tr key={exp.id} className="border-b dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/50">
                                                <td className="px-4 py-3">{new Date(exp.date).toLocaleDateString('fr-FR')}</td>
                                                <td className="px-4 py-3 font-medium text-stone-900 dark:text-white">{exp.description}</td>
                                                <td className="px-4 py-3"><span className="bg-stone-100 dark:bg-stone-600 px-2 py-1 rounded text-xs">{exp.category}</span></td>
                                                <td className="px-4 py-3 text-right font-bold text-red-600 dark:text-red-400">-{exp.amount.toLocaleString('fr-FR')}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button onClick={() => onDeleteExpense(exp.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-stone-500 py-8">Aucune dépense enregistrée.</p>
                        )}
                    </div>
                </div>
            )}
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Finances;
