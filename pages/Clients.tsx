import React, { useState, useMemo } from 'react';
import type { Client, Modele, Order, OrderStatus } from '../types';
import ClientDetail from './ClientDetail';
import { ChevronRightIcon } from '../components/icons';

interface ClientRowProps {
    client: Client;
    onClick: () => void;
}

const ClientRow: React.FC<ClientRowProps> = ({ client, onClick }) => (
  <div onClick={onClick} className="bg-white dark:bg-stone-800 rounded-lg shadow-sm p-4 flex items-center justify-between transition-all hover:shadow-md hover:bg-stone-50 dark:hover:bg-stone-700/50 cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 h-10 w-10 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
        <span className="text-orange-800 dark:text-orange-300 font-bold text-lg">
          {client.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div>
        <p className="font-bold text-stone-800 dark:text-stone-100">{client.name}</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">{client.phone}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="text-xs text-stone-400 dark:text-stone-500">Dernier contact</p>
        <p className="text-sm font-semibold text-orange-800 dark:text-orange-400">{client.lastSeen}</p>
      </div>
      <ChevronRightIcon className="h-6 w-6 text-stone-400" />
    </div>
  </div>
);

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

const AddClientForm: React.FC<{ onAddClient: (client: Omit<Client, 'id'>) => void; onCancel: () => void; }> = ({ onAddClient, onCancel }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const initialMeasurements = Object.keys(measurementLabels).reduce((acc, key) => {
        acc[key as keyof typeof measurementLabels] = '';
        return acc;
    }, {} as { [key in keyof typeof measurementLabels]: string });

    const [measurements, setMeasurements] = useState(initialMeasurements);
    const [observation, setObservation] = useState('');
    
    const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const sanitizedValue = value.replace(/[^0-9.]/g, '');
        setMeasurements(prev => ({ ...prev, [name]: sanitizedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const numericMeasurements: Partial<Omit<Client['measurements'], 'observation'>> = {};
        for (const key in measurements) {
            const typedKey = key as keyof typeof measurements;
            const value = measurements[typedKey];
            if (value) {
                numericMeasurements[typedKey] = Number(value);
            }
        }

        const newClient: Omit<Client, 'id'> = {
            name,
            phone,
            email,
            measurements: {
                ...numericMeasurements,
                observation: observation || undefined,
            },
            lastSeen: 'Aujourd\'hui'
        };
        onAddClient(newClient);
    };

    return (
        <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">Ajouter un nouveau client</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Nom complet</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required/>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Téléphone</label>
                        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required/>
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Email (facultatif)</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"/>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-stone-200 dark:border-stone-700">
                    <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200">Les Mesures (en cm)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(Object.keys(measurementLabels) as Array<keyof typeof measurementLabels>).map((key) => (
                            <div key={key}>
                                <label htmlFor={key} className="block text-sm font-medium text-stone-700 dark:text-stone-300 capitalize">{measurementLabels[key]}</label>
                                <input 
                                    type="text"
                                    inputMode="numeric"
                                    id={key}
                                    name={key}
                                    value={measurements[key]}
                                    onChange={handleMeasurementChange}
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label htmlFor="observation" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Observation</label>
                        <textarea id="observation" value={observation} onChange={(e) => setObservation(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Enregistrer Client</button>
                </div>
            </form>
        </div>
    )
}

interface ClientsProps {
    clients: Client[];
    models: Modele[];
    orders: Order[];
    onAddClient: (client: Omit<Client, 'id'>) => void;
    onUpdateClient: (client: Client) => void;
    onDeleteClient: (clientId: string) => void;
    onAddOrder: (orderData: Omit<Order, 'id' | 'ticketId'>) => void;
    onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
    onNotifyOrder: (order: Order) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, models, orders, onAddClient, onUpdateClient, onAddOrder, onUpdateOrderStatus, onDeleteClient, onNotifyOrder }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddClient = (client: Omit<Client, 'id'>) => {
    onAddClient(client);
    setShowForm(false);
  }
  
  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.replace(/\s/g, '').includes(searchQuery.replace(/\s/g, ''))
    );
  }, [clients, searchQuery]);

  if (showForm) {
      return <AddClientForm onAddClient={handleAddClient} onCancel={() => setShowForm(false)} />
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Registre Clients</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1">Gérez et consultez les informations de vos clients.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-transform hover:scale-105">
            Ajouter un client
          </button>
        </div>
        
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-stone-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Rechercher par nom ou téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md leading-5 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:placeholder-stone-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
        </div>


        <div className="space-y-3">
          {filteredClients.map(client => (
            <ClientRow key={client.id} client={client} onClick={() => setSelectedClient(client)} />
          ))}
        </div>
      </div>
      
      {selectedClient && (
        <ClientDetail
            client={selectedClient}
            orders={orders.filter(o => o.clientId === selectedClient.id)}
            models={models}
            onClose={() => setSelectedClient(null)}
            onUpdateClient={onUpdateClient}
            onDeleteClient={onDeleteClient}
            onAddOrder={onAddOrder}
            onUpdateOrderStatus={onUpdateOrderStatus}
            onNotifyOrder={onNotifyOrder}
        />
      )}
    </>
  );
};

export default Clients;