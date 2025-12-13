
import React, { useState, useMemo } from 'react';
import type { Client, Modele, Order, OrderStatus, Workstation } from '../types';
import { WAITING_ROOM_ID } from '../constants';
import OrderTicket from './OrderTicket';

// Drag and Drop type
type DragData = {
    orderId: string;
    originalStatus: OrderStatus;
};

// Order Card Component
const OrderCard: React.FC<{
    order: Order;
    client?: Client;
    model?: Modele;
    workstations: Workstation[];
    onEditOrder: (order: Order) => void;
    onNotifyOrder: (order: Order) => void;
    onAssignOrder: (orderId: string, workstationId: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, data: DragData) => void;
    onViewDetails: (order: Order) => void;
}> = ({ order, client, model, workstations, onEditOrder, onNotifyOrder, onAssignOrder, onDragStart, onViewDetails }) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, { orderId: order.id, originalStatus: order.status })}
            className="bg-white dark:bg-stone-800 p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing space-y-3"
        >
            <div>
                <div className="flex items-start justify-between">
                    <p className="font-bold text-stone-800 dark:text-stone-100 pr-2">{model?.title}</p>
                    <div className="flex gap-2">
                        {!order.price && (
                            <span className="text-xs flex-shrink-0 text-amber-600 dark:text-amber-400 font-semibold bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
                                Prix?
                            </span>
                        )}
                        <button 
                            onClick={() => onViewDetails(order)}
                            className="text-stone-500 hover:text-orange-900 dark:text-stone-400 dark:hover:text-orange-400 transition-colors"
                            title="Voir les détails"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                    </div>
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400">Pour: <span className="font-semibold">{client?.name}</span></p>
                <p className="text-xs font-mono text-orange-800 dark:text-orange-400 mt-2">{order.ticketId}</p>
            </div>
             <div className="relative">
                <select
                    value={order.workstationId || 'unassigned'}
                    onChange={(e) => onAssignOrder(order.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()} 
                    className={`w-full appearance-none text-xs font-semibold leading-none rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-stone-800 focus:ring-orange-500 transition-colors cursor-pointer ${order.workstationId ? 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'}`}
                >
                    <option value="unassigned">Non assignée</option>
                    <option value={WAITING_ROOM_ID}>Salle des Commandes</option>
                    {workstations.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current"><svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></div>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <button onClick={() => onEditOrder(order)} className="text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-orange-800 dark:hover:text-orange-400">
                    Modifier
                </button>
                {order.status === 'Prêt à livrer' && (
                    <button onClick={() => onNotifyOrder(order)} className="text-xs font-medium text-white bg-orange-900 rounded-full px-3 py-1 hover:bg-orange-800 transition-colors">
                        Notifier
                    </button>
                )}
            </div>
        </div>
    );
};


// Kanban Column Component
const KanbanColumn: React.FC<{
    status: OrderStatus;
    orders: Order[];
    clients: Client[];
    models: Modele[];
    workstations: Workstation[];
    onEditOrder: (order: Order) => void;
    onNotifyOrder: (order: Order) => void;
    onAssignOrder: (orderId: string, workstationId: string) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, data: DragData) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, targetStatus: OrderStatus) => void;
    isDraggingOver: boolean;
    onViewDetails: (order: Order) => void;
}> = ({ status, orders, clients, models, workstations, onEditOrder, onNotifyOrder, onAssignOrder, onDragStart, onDragOver, onDrop, isDraggingOver, onViewDetails }) => {
    const statusText: { [key in OrderStatus]: string } = {
        'En attente de validation': 'En attente',
        'En cours de couture': 'En couture',
        'En finition': 'Finition',
        'Prêt à livrer': 'Prêt',
        'Livré': 'Livré',
    };
    
    return (
        <div
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
            className={`flex-shrink-0 w-80 bg-stone-100 dark:bg-stone-900/50 p-4 rounded-xl transition-colors ${isDraggingOver ? 'bg-orange-100 dark:bg-orange-900/30' : ''}`}
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-stone-700 dark:text-stone-200">{statusText[status]}</h3>
                <span className="text-sm font-bold bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full px-2.5 py-0.5">
                    {orders.length}
                </span>
            </div>
            <div className="space-y-4 h-full overflow-y-auto pr-2 -mr-2">
                {orders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        client={clients.find(c => c.id === order.clientId)}
                        model={models.find(m => m.id === order.modelId)}
                        workstations={workstations}
                        onEditOrder={onEditOrder}
                        onNotifyOrder={onNotifyOrder}
                        onAssignOrder={onAssignOrder}
                        onDragStart={onDragStart}
                        onViewDetails={onViewDetails}
                    />
                ))}
            </div>
        </div>
    );
};


// Main Component
interface GestionCommandeProps {
    clients: Client[];
    models: Modele[];
    orders: Order[];
    workstations: Workstation[];
    onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
    onAssignOrder: (orderId: string, workstationId: string) => void;
    onEditOrder: (order: Order) => void;
    onNotifyOrder: (order: Order) => void;
}

const KANBAN_STATUSES: OrderStatus[] = ['En attente de validation', 'En cours de couture', 'En finition', 'Prêt à livrer'];

const GestionCommande: React.FC<GestionCommandeProps> = ({ clients, models, orders, workstations, onUpdateOrderStatus, onAssignOrder, onEditOrder, onNotifyOrder }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [workstationFilter, setWorkstationFilter] = useState('Tous');
    const [draggedItem, setDraggedItem] = useState<DragData | null>(null);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

    const filteredOrders = useMemo(() => {
        const activeOrders = orders.filter(o => o.status !== 'Livré');

        return activeOrders.filter(order => {
            const client = clients.find(c => c.id === order.clientId);
            const model = models.find(m => m.id === order.modelId);

            if (workstationFilter !== 'Tous') {
                if (workstationFilter === 'unassigned' && order.workstationId) return false;
                if (workstationFilter === WAITING_ROOM_ID && order.workstationId !== WAITING_ROOM_ID) return false;
                if (workstationFilter !== 'unassigned' && workstationFilter !== WAITING_ROOM_ID && order.workstationId !== workstationFilter) return false;
            }
            
            const searchLower = searchQuery.toLowerCase();
            if (searchQuery &&
                !client?.name.toLowerCase().includes(searchLower) &&
                !model?.title.toLowerCase().includes(searchLower) &&
                !order.ticketId.toLowerCase().includes(searchLower)
            ) {
                return false;
            }
            
            return true;
        });
    }, [orders, clients, models, searchQuery, workstationFilter]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, data: DragData) => {
        e.dataTransfer.setData('application/json', JSON.stringify(data));
        e.dataTransfer.effectAllowed = 'move';
        setDraggedItem(data);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: OrderStatus) => {
        e.preventDefault();
        const data: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
        if (data.originalStatus !== targetStatus) {
            onUpdateOrderStatus(data.orderId, targetStatus);
        }
        setDraggedItem(null);
    };


    return (
        <div className="space-y-6 h-full flex flex-col">
             <style>{`
                .kanban-board::-webkit-scrollbar { display: none; }
                .kanban-board { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Suivi de Production</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">Glissez-déposez les commandes pour mettre à jour leur statut.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-stone-800/50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4 flex-shrink-0">
                 <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-stone-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher ticket, client, modèle..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                </div>
                 <div className="flex-shrink-0">
                     <select
                        value={workstationFilter}
                        onChange={(e) => setWorkstationFilter(e.target.value)}
                        className="block w-full sm:w-auto px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        >
                        <option value="Tous">Tous les postes</option>
                        <option value="unassigned">Non assignées</option>
                        <option value={WAITING_ROOM_ID}>Salle des Commandes</option>
                        {workstations.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 flex gap-6 overflow-x-auto pb-4 kanban-board">
                {KANBAN_STATUSES.map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        orders={filteredOrders.filter(o => o.status === status)}
                        clients={clients}
                        models={models}
                        workstations={workstations}
                        onEditOrder={onEditOrder}
                        onNotifyOrder={onNotifyOrder}
                        onAssignOrder={onAssignOrder}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        isDraggingOver={draggedItem?.originalStatus !== status && draggedItem !== null}
                        onViewDetails={setViewingOrder}
                    />
                ))}
            </div>

            {viewingOrder && (
                <OrderTicket
                    order={viewingOrder}
                    client={clients.find(c => c.id === viewingOrder.clientId)!}
                    model={models.find(m => m.id === viewingOrder.modelId)}
                    onClose={() => setViewingOrder(null)}
                />
            )}
        </div>
    );
};

export default GestionCommande;
