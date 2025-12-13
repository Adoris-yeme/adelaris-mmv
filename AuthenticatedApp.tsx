
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Accueil from './pages/Accueil';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import GestionCommande from './pages/GestionCommande';
import Catalogue from './pages/Catalogue';
import Agenda from './pages/Agenda';
import ModeleDuMois from './pages/ModeleDuMois';
import Gestion from './pages/Gestion';
import GestionPostes from './pages/GestionPostes';
import GestionFournitures from './pages/GestionFournitures';
import ArchivesCommandes from './pages/ArchivesCommandes';
import Favoris from './pages/Favoris';
import ClientOrderForm from './pages/ClientOrderForm';
import WorkstationAccessModal from './pages/WorkstationAccessModal';
import AccessCodeModal from './pages/AccessCodeModal';
import ChangePasswordModal from './pages/ChangePasswordModal';
import WorkstationDashboard from './pages/WorkstationDashboard';
import OrderConfirmationAnimation from './components/OrderConfirmationAnimation';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import SuiviCommande from './pages/SuiviCommande';
import SalleCommandes from './pages/SalleCommandes';
import EditOrderModal from './components/EditOrderModal';
import NotificationModal from './components/NotificationModal';
import AuthenticatedFooter from './components/AuthenticatedFooter';
import type { Page, Client, Modele, Appointment, Order, OrderStatus, UserMode, Workstation, Notification, ManagerProfile, Fourniture, AtelierData, Expense, Tutoriel } from './types';
import { WAITING_ROOM_ID } from './constants';
import { HamburgerIcon } from './components/icons';
import { useAuth } from './auth/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import Finances from './pages/Finances';
import RequestAppointment from './pages/RequestAppointment';
import FloatingClientMenu from './components/FloatingClientMenu';
import Studio from './pages/Studio';
import Tutoriels from './pages/Tutoriels';
import GestionTutoriels from './pages/GestionTutoriels';
import Settings from './pages/Settings';
import AvisAtelier from './pages/AvisAtelier';
import ModeSelectionModal from './components/ModeSelectionModal';


const AuthenticatedApp: React.FC = () => {
    const { user, atelier, logout, isSubscriptionActive, isImpersonating, stopImpersonating } = useAuth();

    if (user?.role === 'superadmin') {
        return <AdminDashboard />;
    }

    if (!atelier || !user || user.role !== 'manager') {
      return <div className="w-screen h-screen flex items-center justify-center">Erreur de chargement des données.</div>;
    }
    
    // Note: isSubscriptionActive is now used within the component to restrict access rather than block completely.

    return (
        <div className={`relative min-h-screen flex flex-col ${isImpersonating ? 'pt-12' : ''}`}>
            {isImpersonating && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-black px-4 py-2 text-center text-sm z-[1000] flex justify-center items-center gap-4 shadow-lg">
                    <span>Vous naviguez en tant que <strong>{atelier.name}</strong>.</span>
                    <button onClick={stopImpersonating} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded">
                        Retourner à l'administration
                    </button>
                </div>
            )}
            <AtelierApp key={atelier.id} />
        </div>
    );
};


const AtelierApp: React.FC = () => {
  const { user, atelier, updateAtelierData, logout, isSubscriptionActive } = useAuth();
  
  if (!atelier || !user) return null;
  
  const initialData = atelier.data;

  // --- State Initialization with Atelier Data ---
  const [clients, setClients] = useState<Client[]>(initialData.clients);
  const [models, setModels] = useState<Modele[]>(initialData.models);
  const [appointments, setAppointments] = useState<Appointment[]>(initialData.appointments);
  const [orders, setOrders] = useState<Order[]>(initialData.orders);
  const [workstations, setWorkstations] = useState<Workstation[]>(initialData.workstations);
  const [fournitures, setFournitures] = useState<Fourniture[]>(initialData.fournitures);
  const [tutoriels, setTutoriels] = useState<Tutoriel[]>(initialData.tutoriels || []);
  const [expenses, setExpenses] = useState<Expense[]>(initialData.expenses || []);
  const [managerProfile, setManagerProfile] = useState<ManagerProfile>(initialData.managerProfile);
  const [notifications, setNotifications] = useState<Notification[]>(initialData.notifications);
  const [modelOfTheMonthId, setModelOfTheMonthId] = useState<string | null>(initialData.modelOfTheMonthId);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(initialData.favoriteIds);
  const [isNewAtelier, setIsNewAtelier] = useState<boolean>(initialData.isNew);

  // --- STABILITY FIX: Debounced Data Persistence ---
  const stateRef = useRef({
      clients, models, appointments, orders, workstations, fournitures, notifications, tutoriels, expenses, managerProfile, modelOfTheMonthId, favoriteIds, isNewAtelier
  });

  useEffect(() => {
      stateRef.current = { clients, models, appointments, orders, workstations, fournitures, notifications, tutoriels, expenses, managerProfile, modelOfTheMonthId, favoriteIds, isNewAtelier };
  }, [clients, models, appointments, orders, workstations, fournitures, notifications, tutoriels, expenses, managerProfile, modelOfTheMonthId, favoriteIds, isNewAtelier]);

  useEffect(() => {
      const handler = setTimeout(() => {
          const currentData: AtelierData = {
              clients: stateRef.current.clients,
              models: stateRef.current.models,
              appointments: stateRef.current.appointments,
              orders: stateRef.current.orders,
              workstations: stateRef.current.workstations,
              fournitures: stateRef.current.fournitures,
              notifications: stateRef.current.notifications,
              tutoriels: stateRef.current.tutoriels,
              expenses: stateRef.current.expenses,
              managerProfile: stateRef.current.managerProfile,
              managerAccessCode: initialData.managerAccessCode,
              modelOfTheMonthId: stateRef.current.modelOfTheMonthId,
              favoriteIds: stateRef.current.favoriteIds,
              isNew: stateRef.current.isNewAtelier,
          };
          updateAtelierData(atelier.id, currentData);
      }, 1000);

      return () => clearTimeout(handler);
  }, [
      clients, models, appointments, orders, workstations, fournitures, notifications, tutoriels, expenses,
      managerProfile, modelOfTheMonthId, favoriteIds, isNewAtelier, atelier.id, updateAtelierData, initialData.managerAccessCode
  ]);
  
  // UI & Session State
  // IMPORTANT: Default userMode is 'client' so workshops open in "Display Mode" immediately.
  const [currentPage, setCurrentPage] = useState<Page>('accueil');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userMode, setUserMode] = useState<UserMode>('client');
  
  // Modals & Animation State
  const [orderingModel, setOrderingModel] = useState<Modele | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showWorkstationAccessModal, setShowWorkstationAccessModal] = useState(false);
  const [showManagerAccessModal, setShowManagerAccessModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showModeSelectionModal, setShowModeSelectionModal] = useState(false); // New modal for path selection
  const [showOrderAnimation, setShowOrderAnimation] = useState(false);
  const [orderConfirmationMessage, setOrderConfirmationMessage] = useState<string | null>(null);
  const [notifyingOrder, setNotifyingOrder] = useState<Order | null>(null);

  // Authentication State
  const [authenticatedWorkstation, setAuthenticatedWorkstation] = useState<Workstation | null>(null);
  
  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // --- Authentication & Mode Switching ---
  const handleWorkstationLogin = (code: string) => {
    const workstation = workstations.find(ws => ws.accessCode === code);
    if (workstation) {
        setAuthenticatedWorkstation(workstation);
        setUserMode('workstation');
        setCurrentPage('accueil'); // Workstation dashboard
        setShowWorkstationAccessModal(false);
        return true;
    }
    return false;
  };
  
  const handleManagerLoginAttempt = (code: string) => {
      if (code === initialData.managerAccessCode) {
          setUserMode('manager');
          // Redirect to a safe page if dashboard is locked
          setCurrentPage(isSubscriptionActive ? 'dashboard' : 'clients');
          setShowManagerAccessModal(false);
          return true;
      }
      return false;
  };

  const handleAtelierLogout = () => {
      // Logout logic for Managers/Workstations returns them to the safe "Client View"
      if (userMode === 'workstation') {
          setAuthenticatedWorkstation(null);
      }
      // Always reset to client mode (safe mode) instead of full logout
      setUserMode('client');
      setCurrentPage('accueil');
  };

  const handleToggleMode = (mode: 'manager' | 'workstation') => {
    // This function is now triggered by the ModeSelectionModal
    if (mode === 'manager') {
      if (userMode === 'manager') {
        setUserMode('client');
        setCurrentPage('accueil');
      } else { // From client to manager
        setShowManagerAccessModal(true);
      }
    } else if (mode === 'workstation') {
        setShowWorkstationAccessModal(true);
    }
  };
  
  useEffect(() => {
    const clientPages: Page[] = ['accueil', 'catalogue', 'modeleDuMois', 'favoris', 'suiviCommande', 'requestAppointment'];
    // LIMITED ACCESS if expired: No dashboard, finances, archives, gestionPostes, fournitures
    const activeManagerPages: Page[] = ['dashboard', 'clients', 'commandes', 'gestion', 'gestionPostes', 'agenda', 'fournitures', 'archives', 'finances', 'accueil', 'catalogue', 'modeleDuMois', 'favoris', 'suiviCommande', 'studio', 'tutoriels', 'gestionTutoriels', 'settings', 'avisAtelier'];
    const expiredManagerPages: Page[] = ['clients', 'commandes', 'gestion', 'agenda', 'accueil', 'catalogue', 'modeleDuMois', 'settings'];
    
    const managerPages = isSubscriptionActive ? activeManagerPages : expiredManagerPages;
    const workstationPages: Page[] = ['accueil', 'salleCommandes'];
    
    if (userMode === 'client' && !clientPages.includes(currentPage)) {
        setCurrentPage('accueil');
    } else if (userMode === 'manager' && !managerPages.includes(currentPage)) {
        setCurrentPage(isSubscriptionActive ? 'dashboard' : 'clients');
    } else if (userMode === 'workstation' && !workstationPages.includes(currentPage)) {
        setCurrentPage('accueil');
    }
  }, [userMode, currentPage, isSubscriptionActive]);


  // --- Data Management Handlers ---
  const handleToggleFavorite = async (modelId: string) => {
    setFavoriteIds(prev => prev.includes(modelId) ? prev.filter(id => id !== modelId) : [...prev, modelId]);
  };
  const handleSetModelOfTheMonth = async (modelId: string) => {
    setModelOfTheMonthId(prev => (prev === modelId ? null : modelId));
  };
  const handleAddClient = async (client: Omit<Client, 'id'>) => {
    setClients(prev => [{ ...client, id: crypto.randomUUID() }, ...prev]);
  };
  const handleUpdateClient = async (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };
  const handleDeleteClient = async (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    setOrders(prev => prev.filter(o => o.clientId !== clientId));
    setAppointments(prev => prev.filter(a => a.clientId !== clientId));
  };
  const handleAddModel = async (model: Modele) => {
    // BLOCK IF EXPIRED
    if (!isSubscriptionActive) {
        alert("Votre abonnement est expiré. Vous ne pouvez plus ajouter de nouveaux modèles.");
        return;
    }
    setModels(prev => [model, ...prev]);
  };
  const handleUpdateModel = async (updatedModel: Modele) => {
    setModels(prev => prev.map(m => m.id === updatedModel.id ? updatedModel : m));
  };
  const handleDeleteModel = async (modelId: string) => {
    setModels(prev => prev.filter(m => m.id !== modelId));
  };
  const handleAddAppointment = async (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };
   const handleUpdateAppointment = async (updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
  };
  const handleDeleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };
  const handleRequestAppointment = async (data: { name: string; phone: string; date: string; time: string; type: Appointment['type']; notes?: string }) => {
    let client = clients.find(c => c.phone === data.phone);
    if (!client) {
        const newClientData: Omit<Client, 'id'> = { name: data.name, phone: data.phone, measurements: {}, lastSeen: 'Nouveau contact' };
        client = { ...newClientData, id: crypto.randomUUID() };
        setClients(prev => [client!, ...prev]);
    }
    const newAppointment: Appointment = {
        id: crypto.randomUUID(), clientId: client.id, clientName: client.name, date: data.date, time: data.time, type: data.type, notes: data.notes, status: 'pending',
    };
    await handleAddAppointment(newAppointment);
    await handleAddNotification(`Nouvelle demande de RDV de ${client.name} pour le ${new Date(data.date).toLocaleDateString('fr-FR')}.`);
    setOrderConfirmationMessage(`Merci ${client.name} ! Votre demande de rendez-vous a été envoyée.`);
    setCurrentPage('accueil');
  };
  const handleAddOrder = async (orderData: Omit<Order, 'id' | 'ticketId'>): Promise<Order | null> => {
    const ticketId = `CMD-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const newOrder: Order = { ...orderData, id: crypto.randomUUID(), ticketId };
    setOrders(prev => [newOrder, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    return newOrder;
  };
   const handleUpdateOrder = async (orderId: string, updatedData: Partial<Pick<Order, 'price' | 'notes'>>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updatedData } : o));
  };
  const handleAddNotification = async (message: string, orderId?: string) => {
      const newNotification: Notification = { id: crypto.randomUUID(), message, orderId, date: new Date().toISOString(), read: false };
      setNotifications(prev => [newNotification, ...prev]);
  };
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    const order = orders.find(o => o.id === orderId);
    if(order && (status === 'Prêt à livrer' || status === 'Livré')) {
      const client = clients.find(c => c.id === order.clientId);
      handleAddNotification(`La commande #${order.ticketId} pour ${client?.name} est maintenant "${status}".`, orderId);
    }
  };
  const handlePlaceOrder = async (modelId: string, clientData: { name: string; phone: string; email?: string }) => {
    setOrderingModel(null);
    setShowOrderAnimation(true);
    await new Promise(resolve => setTimeout(resolve, 3500));
    let client = clients.find(c => c.phone === clientData.phone);
    if (!client) {
      const newClientData: Omit<Client, 'id'> = { ...clientData, measurements: {}, lastSeen: 'Aujourd\'hui' };
      client = { ...newClientData, id: crypto.randomUUID() };
      setClients(prev => [client!, ...prev]);
    }
    const newOrder = await handleAddOrder({ clientId: client.id, modelId, date: new Date().toISOString(), status: 'En attente de validation' });
    if (newOrder) await handleAddNotification(`Nouvelle commande #${newOrder.ticketId} passée par ${client.name}.`);
    setShowOrderAnimation(false);
    if (newOrder) setOrderConfirmationMessage(`Merci ${client.name} ! Votre commande a été enregistrée (Ticket ${newOrder.ticketId}).`);
  };
  const handleAddWorkstation = async (name: string) => {
    setWorkstations(prev => [...prev, { id: crypto.randomUUID(), name, accessCode: `POSTE-${crypto.randomUUID().slice(0, 4).toUpperCase()}` }]);
  };
   const handleUpdateWorkstation = async (updatedWorkstation: Workstation) => {
    setWorkstations(prev => prev.map(ws => ws.id === updatedWorkstation.id ? updatedWorkstation : ws));
   };
   const handleDeleteWorkstation = async (id: string) => {
    setWorkstations(prev => prev.filter(ws => ws.id !== id));
   };
  const handleAssignOrder = async (orderId: string, workstationId: string) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, workstationId: workstationId === 'unassigned' ? undefined : workstationId } : o));
      const order = orders.find(o => o.id === orderId);
      const workstation = workstations.find(ws => ws.id === workstationId);
      if(order && workstation) {
          await handleAddNotification(`Commande #${order.ticketId} assignée à ${workstation.name}.`, orderId);
      } else if (order && workstationId === WAITING_ROOM_ID) {
           await handleAddNotification(`Commande #${order.ticketId} placée dans la Salle des Commandes.`, orderId);
      }
  };
  const handleClaimOrder = async (orderId: string) => {
    if (!authenticatedWorkstation) return;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, workstationId: authenticatedWorkstation.id, status: 'En cours de couture' } : o));
    const order = orders.find(o => o.id === orderId);
    if (order) await handleAddNotification(`Commande #${order.ticketId} prise en charge par ${authenticatedWorkstation.name}.`, orderId);
  };
  const handleMarkNotificationsRead = async (ids: string[]) => {
      setNotifications(prev => prev.map(n => ids.includes(n.id) ? {...n, read: true} : n));
  };
  const handleAddFourniture = async (fourniture: Fourniture) => {
    setFournitures(prev => [fourniture, ...prev]);
  };
  const handleUpdateFourniture = async (updatedFourniture: Fourniture) => {
    setFournitures(prev => prev.map(f => f.id === updatedFourniture.id ? updatedFourniture : f));
  };
  const handleDeleteFourniture = async (id: string) => {
    setFournitures(prev => prev.filter(f => f.id !== id));
  };
  const handleUpdateManagerProfile = async (profile: ManagerProfile) => {
    setManagerProfile(profile);
  };
  const handleAddTutoriel = (t: Tutoriel) => setTutoriels(prev => [t, ...prev]);
  const handleUpdateTutoriel = (t: Tutoriel) => setTutoriels(prev => prev.map(tut => tut.id === t.id ? t : tut));
  const handleDeleteTutoriel = (id: string) => setTutoriels(prev => prev.filter(t => t.id !== id));
  const handleAddExpense = (expense: Omit<Expense, 'id'>) => setExpenses(prev => [{ ...expense, id: crypto.randomUUID() }, ...prev]);
  const handleDeleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

  // --- Welcome Wizard for New Ateliers ---
  if (isNewAtelier) {
      return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/95 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white dark:bg-stone-800 rounded-xl shadow-2xl max-w-lg w-full p-8 text-center relative overflow-hidden animate-slide-up">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-600"></div>
                  
                  <div className="mb-6">
                      <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-orange-50 dark:border-orange-900/50 shadow-inner">
                          <span className="text-4xl">🎉</span>
                      </div>
                      <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-2">Bienvenue & Configuration</h2>
                      <p className="text-stone-600 dark:text-stone-300">Votre atelier est prêt ! Une dernière étape cruciale avant de commencer.</p>
                  </div>
                  
                  <div className="bg-stone-50 dark:bg-stone-900/50 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-6 mb-8 mx-auto max-w-sm">
                      <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-3">Votre Code Manager Unique</p>
                      <div className="flex items-center justify-center gap-3">
                          <p className="text-3xl sm:text-4xl font-mono font-bold text-orange-600 dark:text-orange-400 tracking-wider select-all">
                              {initialData.managerAccessCode}
                          </p>
                      </div>
                      <p className="text-xs text-stone-400 dark:text-stone-500 mt-3 italic">
                          Notez ce code précieusement.
                      </p>
                  </div>
                  
                  <div className="text-left text-sm text-stone-600 dark:text-stone-300 mb-8 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-900/20">
                      <p className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                          À quoi sert ce code ?
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                          <li>Accéder à l'interface d'administration (Manager).</li>
                          <li>Sécuriser les réglages sensibles de l'atelier.</li>
                          <li>Se connecter depuis un nouvel appareil.</li>
                      </ul>
                  </div>

                  <button 
                    onClick={() => {
                        setIsNewAtelier(false);
                        // Force client mode initially for safety
                        setUserMode('client');
                        setCurrentPage('accueil');
                    }}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-700 to-orange-900 hover:from-orange-800 hover:to-orange-950 text-white font-bold text-lg rounded-xl shadow-lg transform transition-all hover:scale-[1.02] focus:ring-4 focus:ring-orange-500/50"
                  >
                      J'ai noté mon code, c'est parti !
                  </button>
              </div>
              <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
              `}</style>
          </div>
      )
  }

  // --- Content Rendering ---
  const renderContent = () => {
    if (userMode === 'workstation' && authenticatedWorkstation) {
        switch(currentPage) {
            case 'salleCommandes': return <SalleCommandes orders={orders} clients={clients} models={models} onClaimOrder={handleClaimOrder} />;
            case 'accueil': default: return <WorkstationDashboard workstation={authenticatedWorkstation} orders={orders} clients={clients} models={models} onUpdateOrderStatus={handleUpdateOrderStatus} workstations={workstations} onAssignOrder={handleAssignOrder} />;
        }
    }
    
    // Check access for pages if not subscription active
    if (!isSubscriptionActive) {
        if (['dashboard', 'gestionPostes', 'fournitures', 'archives', 'finances', 'studio', 'tutoriels', 'gestionTutoriels'].includes(currentPage)) {
             return (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-6 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Accès Restreint</h2>
                    <p className="text-stone-600 dark:text-stone-300 max-w-md">
                        Votre abonnement est expiré. Vous avez accès uniquement au catalogue, aux clients et aux commandes en cours. Le Back-Office est verrouillé.
                    </p>
                    <button onClick={() => setCurrentPage('settings')} className="mt-6 px-6 py-2 bg-orange-900 text-white rounded-md hover:bg-orange-800">
                        Renouveler l'abonnement
                    </button>
                </div>
             )
        }
    }

    switch (currentPage) {
      case 'accueil': return <Accueil models={models} setCurrentPage={setCurrentPage} userMode={userMode} />;
      case 'dashboard': return <Dashboard isNewAtelier={isNewAtelier} onDismissOnboarding={() => setIsNewAtelier(false)} onNavigate={setCurrentPage} />;
      case 'clients': return <Clients clients={clients} models={models} orders={orders} onAddClient={handleAddClient} onUpdateClient={handleUpdateClient} onAddOrder={handleAddOrder} onUpdateOrderStatus={handleUpdateOrderStatus} onDeleteClient={handleDeleteClient} onNotifyOrder={setNotifyingOrder} />;
      case 'commandes': return <GestionCommande clients={clients} models={models} orders={orders} workstations={workstations} onUpdateOrderStatus={handleUpdateOrderStatus} onAssignOrder={handleAssignOrder} onEditOrder={setEditingOrder} onNotifyOrder={setNotifyingOrder} />;
      case 'catalogue': return <Catalogue models={models} modelOfTheMonthId={modelOfTheMonthId} onSetModelOfTheMonth={handleSetModelOfTheMonth} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} userMode={userMode} onStartOrder={setOrderingModel} />;
      case 'gestion': return <Gestion models={models} onAddModel={handleAddModel} onUpdateModel={handleUpdateModel} onDeleteModel={handleDeleteModel} />;
      case 'gestionPostes': return <GestionPostes workstations={workstations} onAddWorkstation={handleAddWorkstation} onUpdateWorkstation={handleUpdateWorkstation} onDeleteWorkstation={handleDeleteWorkstation} />;
      case 'fournitures': return <GestionFournitures fournitures={fournitures} onAddFourniture={handleAddFourniture} onUpdateFourniture={handleUpdateFourniture} onDeleteFourniture={handleDeleteFourniture} />;
      case 'archives': return <ArchivesCommandes orders={orders} clients={clients} models={models} />;
      case 'finances': return <Finances orders={orders} models={models} clients={clients} expenses={expenses} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} />;
      case 'agenda': return <Agenda appointments={appointments} clients={clients} onAddAppointment={handleAddAppointment} onUpdateAppointment={handleUpdateAppointment} onDeleteAppointment={handleDeleteAppointment} />;
      case 'modeleDuMois': return <ModeleDuMois models={models} modelOfTheMonthId={modelOfTheMonthId} onSetModelOfTheMonth={handleSetModelOfTheMonth} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} userMode={userMode} onStartOrder={setOrderingModel} />;
      case 'favoris': return <Favoris models={models} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} userMode={userMode} onStartOrder={setOrderingModel} />;
      case 'suiviCommande': return <SuiviCommande orders={orders} models={models} />;
      case 'requestAppointment': return <RequestAppointment onRequestSubmit={handleRequestAppointment} onCancel={() => setCurrentPage('accueil')} />;
      case 'studio': return <Studio clients={clients} models={models} />;
      case 'tutoriels': return <Tutoriels tutoriels={tutoriels} />;
      case 'gestionTutoriels': return <GestionTutoriels tutoriels={tutoriels} onAddTutoriel={handleAddTutoriel} onUpdateTutoriel={handleUpdateTutoriel} onDeleteTutoriel={handleDeleteTutoriel} />;
      case 'settings': return <Settings />;
      case 'avisAtelier': return <AvisAtelier />;
      default: return <Accueil models={models} setCurrentPage={setCurrentPage} userMode={userMode} />;
    }
  };

  return (
    <div className="flex h-screen text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-900 overflow-hidden">
      {userMode !== 'client' && (
        <Sidebar 
          currentPage={currentPage} setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}
          userMode={userMode} onToggleMode={handleToggleMode} onLogout={handleAtelierLogout}
          notifications={notifications} onMarkNotificationsRead={handleMarkNotificationsRead} managerProfile={managerProfile} onUpdateManagerProfile={handleUpdateManagerProfile}
          onOpenChangePassword={() => setShowChangePasswordModal(true)}
        />
      )}
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
         {userMode !== 'client' && (
          <header className="lg:hidden h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
              <h1 className="text-lg font-bold text-orange-900 dark:text-orange-400">MMV COUTURE</h1>
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-stone-600 dark:text-stone-300 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800">
                  <HamburgerIcon className="w-6 h-6" />
              </button>
          </header>
         )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
        {/* Footer for logged in users */}
        <AuthenticatedFooter userMode={userMode} />
      </div>

      {/* Discret 'Lock' button instead of full menu */}
      {userMode === 'client' && (
          <FloatingClientMenu onOpenAccess={() => setShowModeSelectionModal(true)} />
      )}
      
      {/* Modals for Access Flow */}
      {showModeSelectionModal && (
          <ModeSelectionModal 
            onClose={() => setShowModeSelectionModal(false)}
            onSelectManager={() => {
                setShowModeSelectionModal(false);
                setShowManagerAccessModal(true);
            }}
            onSelectWorkstation={() => {
                setShowModeSelectionModal(false);
                setShowWorkstationAccessModal(true);
            }}
          />
      )}

      {orderingModel && userMode === 'client' && (
        <ClientOrderForm model={orderingModel} onClose={() => setOrderingModel(null)} onPlaceOrder={(clientData) => handlePlaceOrder(orderingModel.id, clientData)} />
      )}
      {editingOrder && (<EditOrderModal order={editingOrder} onClose={() => setEditingOrder(null)} onSave={(data) => handleUpdateOrder(editingOrder.id, data)} />)}
      {showWorkstationAccessModal && <WorkstationAccessModal onClose={() => setShowWorkstationAccessModal(false)} onLoginAttempt={handleWorkstationLogin} />}
      {showManagerAccessModal && <AccessCodeModal onClose={() => setShowManagerAccessModal(false)} onLoginAttempt={handleManagerLoginAttempt} />}
      {showChangePasswordModal && <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />}
      <OrderConfirmationAnimation isOpen={showOrderAnimation} />
      {notifyingOrder && (
        <NotificationModal order={notifyingOrder} client={clients.find(c => c.id === notifyingOrder.clientId)!} model={models.find(m => m.id === notifyingOrder.modelId)!} managerProfile={managerProfile} onClose={() => setNotifyingOrder(null)} />
      )}
      <OrderConfirmationModal message={orderConfirmationMessage} onClose={() => setOrderConfirmationMessage(null)} />
    </div>
  );
};


export default AuthenticatedApp;
