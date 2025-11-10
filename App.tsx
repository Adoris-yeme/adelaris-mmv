import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Accueil from './pages/Accueil';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import GestionCommande from './pages/GestionCommande';
import Catalogue from './pages/Catalogue';
import Tutoriels from './pages/Tutoriels';
import Agenda from './pages/Agenda';
import ModeleDuMois from './pages/ModeleDuMois';
import Gestion from './pages/Gestion';
import GestionPostes from './pages/GestionPostes';
import GestionTutoriels from './pages/GestionTutoriels';
import GestionFournitures from './pages/GestionFournitures';
import ArchivesCommandes from './pages/ArchivesCommandes';
import Favoris from './pages/Favoris';
import ClientOrderForm from './pages/ClientOrderForm';
import AccessCodeModal from './pages/AccessCodeModal';
import WorkstationAccessModal from './pages/WorkstationAccessModal';
import WorkstationDashboard from './pages/WorkstationDashboard';
import OrderConfirmationAnimation from './components/OrderConfirmationAnimation';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import SuiviCommande from './pages/SuiviCommande';
import SalleCommandes from './pages/SalleCommandes';
import EditOrderModal from './components/EditOrderModal';
import NotificationModal from './components/NotificationModal';
import type { Page, Client, Modele, Appointment, Order, OrderStatus, UserMode, Workstation, Notification, Tutoriel, ManagerProfile, Fourniture } from './types';
import { MOCK_CLIENTS, MOCK_MODELES, MOCK_APPOINTMENTS, MOCK_ORDERS, MOCK_WORKSTATIONS, MOCK_TUTORIELS, MOCK_FOURNITURES, MOCK_MANAGER_PROFILE, WAITING_ROOM_ID } from './constants';
import { HamburgerIcon } from './components/icons';

const MANAGER_ACCESS_CODE = 'ADL2024';

const App: React.FC = () => {
  // --- State Initialization with Mock Data ---
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [models, setModels] = useState<Modele[]>(MOCK_MODELES);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [workstations, setWorkstations] = useState<Workstation[]>(MOCK_WORKSTATIONS);
  const [tutoriels, setTutoriels] = useState<Tutoriel[]>(MOCK_TUTORIELS);
  const [fournitures, setFournitures] = useState<Fourniture[]>(MOCK_FOURNITURES);
  const [managerProfile, setManagerProfile] = useState<ManagerProfile>(MOCK_MANAGER_PROFILE);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modelOfTheMonthId, setModelOfTheMonthId] = useState<string | null>('m2');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['m1', 'm5']);
  
  // UI & Session State
  const [currentPage, setCurrentPage] = useState<Page>('accueil');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userMode, setUserMode] = useState<UserMode>('client');
  
  // Modals & Animation State
  const [orderingModel, setOrderingModel] = useState<Modele | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showManagerAccessModal, setShowManagerAccessModal] = useState(false);
  const [showWorkstationAccessModal, setShowWorkstationAccessModal] = useState(false);
  const [showOrderAnimation, setShowOrderAnimation] = useState(false);
  const [orderConfirmationMessage, setOrderConfirmationMessage] = useState<string | null>(null);
  const [notifyingOrder, setNotifyingOrder] = useState<Order | null>(null);

  // Authentication State
  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(false);
  const [authenticatedWorkstation, setAuthenticatedWorkstation] = useState<Workstation | null>(null);
  
  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // --- Authentication & Mode Switching ---

  const handleManagerLogin = (code: string) => {
    if (code === MANAGER_ACCESS_CODE) {
      setIsManagerAuthenticated(true);
      setUserMode('manager');
      setCurrentPage('dashboard');
      setShowManagerAccessModal(false);
      return true;
    }
    return false;
  };

  const handleWorkstationLogin = (code: string) => {
    const workstation = workstations.find(ws => ws.accessCode === code);
    if (workstation) {
        setAuthenticatedWorkstation(workstation);
        setUserMode('workstation');
        setCurrentPage('accueil');
        setShowWorkstationAccessModal(false);
        return true;
    }
    return false;
  };
  
  const handleLogout = () => {
      setIsManagerAuthenticated(false);
      setAuthenticatedWorkstation(null);
      setUserMode('client');
      setCurrentPage('accueil');
  };

  const handleToggleMode = (mode: 'manager' | 'workstation') => {
    if (mode === 'manager') {
        if (isManagerAuthenticated) { 
            const newMode = userMode === 'manager' ? 'client' : 'manager';
            setUserMode(newMode);
            setCurrentPage(newMode === 'manager' ? 'dashboard' : 'accueil');
        } else {
            setShowManagerAccessModal(true);
        }
    } else if (mode === 'workstation') {
        if (userMode === 'workstation') {
            handleLogout();
        } else {
            setShowWorkstationAccessModal(true);
        }
    }
  };
  
  useEffect(() => {
    const clientPages: Page[] = ['accueil', 'catalogue', 'modeleDuMois', 'favoris', 'suiviCommande'];
    const managerPages: Page[] = [...clientPages, 'dashboard', 'clients', 'commandes', 'gestion', 'gestionPostes', 'gestionTutoriels', 'agenda', 'tutoriels', 'fournitures', 'archives'];
    const workstationPages: Page[] = ['accueil', 'salleCommandes'];
    
    if (userMode === 'client' && !clientPages.includes(currentPage)) {
        setCurrentPage('accueil');
    } else if (userMode === 'manager' && !managerPages.includes(currentPage)) {
        setCurrentPage('dashboard');
    } else if (userMode === 'workstation' && !workstationPages.includes(currentPage)) {
        setCurrentPage('accueil');
    }
  }, [userMode, currentPage]);


  // --- Data Management Handlers (Local State Simulation) ---

  const handleToggleFavorite = async (modelId: string) => {
    setFavoriteIds(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId) 
        : [...prev, modelId]
    );
  };

  const handleSetModelOfTheMonth = async (modelId: string) => {
    setModelOfTheMonthId(prev => (prev === modelId ? null : modelId));
  };
  
  const handleAddClient = async (client: Omit<Client, 'id'>) => {
    const newClient: Client = { ...client, id: crypto.randomUUID() };
    setClients(prev => [newClient, ...prev]);
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

  const handleDeleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
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
      const newNotification: Notification = {
          id: crypto.randomUUID(),
          message,
          orderId,
          date: new Date().toISOString(),
          read: false
      };
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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    // Check if client exists, or create a new one
    let client = clients.find(c => c.phone === clientData.phone);
    if (!client) {
      const newClientData: Omit<Client, 'id'> = {
        ...clientData,
        measurements: {},
        lastSeen: 'Aujourd\'hui',
      };
      client = { ...newClientData, id: crypto.randomUUID() };
      setClients(prev => [client!, ...prev]);
    }
    
    // Create new order
    const orderData: Omit<Order, 'id' | 'ticketId'> = {
        clientId: client.id,
        modelId,
        date: new Date().toISOString(),
        status: 'En attente de validation',
    };
    const newOrder = await handleAddOrder(orderData);
    
    // Add notification
    if (newOrder) {
      await handleAddNotification(`Nouvelle commande #${newOrder.ticketId} passée par ${client.name}.`);
    }

    setShowOrderAnimation(false);
    if (newOrder) {
      setOrderConfirmationMessage(`Merci ${client.name} ! Votre commande a été enregistrée sous le numéro de ticket ${newOrder.ticketId}. Nous vous contacterons bientôt.`);
    } else {
      setOrderConfirmationMessage("Une erreur est survenue lors de la commande.");
    }
  };
  
  const handleAddWorkstation = async (name: string) => {
    const newWorkstation: Workstation = {
        id: crypto.randomUUID(),
        name,
        accessCode: `POSTE-${crypto.randomUUID().slice(0, 4).toUpperCase()}`
    };
    setWorkstations(prev => [...prev, newWorkstation]);
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
    if (order) {
        await handleAddNotification(`Commande #${order.ticketId} prise en charge par ${authenticatedWorkstation.name}.`, orderId);
    }
  };
  
  const handleMarkNotificationsRead = async (ids: string[]) => {
      setNotifications(prev => prev.map(n => ids.includes(n.id) ? {...n, read: true} : n));
  };
  
  const handleAddTutoriel = async (tutoriel: Tutoriel) => {
    setTutoriels(prev => [tutoriel, ...prev]);
  };
  const handleUpdateTutoriel = async (updatedTutoriel: Tutoriel) => {
    setTutoriels(prev => prev.map(t => t.id === updatedTutoriel.id ? updatedTutoriel : t));
  };
  const handleDeleteTutoriel = async (id: string) => {
    setTutoriels(prev => prev.filter(t => t.id !== id));
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

  // --- Content Rendering ---

  const renderContent = () => {
    if (userMode === 'workstation' && authenticatedWorkstation) {
        switch(currentPage) {
            case 'salleCommandes':
                return <SalleCommandes
                    orders={orders}
                    clients={clients}
                    models={models}
                    onClaimOrder={handleClaimOrder}
                />;
            case 'accueil':
            default:
                return <WorkstationDashboard workstation={authenticatedWorkstation} orders={orders} clients={clients} models={models} onUpdateOrderStatus={handleUpdateOrderStatus} workstations={workstations} onAssignOrder={handleAssignOrder} />;
        }
    }

    switch (currentPage) {
      case 'accueil':
        return <Accueil models={models} setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard clients={clients} models={models} appointments={appointments} orders={orders} />;
      case 'clients':
        return <Clients 
            clients={clients} 
            models={models} 
            orders={orders} 
            onAddClient={handleAddClient} 
            onUpdateClient={handleUpdateClient} 
            onAddOrder={handleAddOrder} 
            onUpdateOrderStatus={handleUpdateOrderStatus} 
            onDeleteClient={handleDeleteClient}
            onNotifyOrder={setNotifyingOrder}
        />;
      case 'commandes':
        return <GestionCommande 
            clients={clients} 
            models={models} 
            orders={orders} 
            workstations={workstations} 
            onUpdateOrderStatus={handleUpdateOrderStatus} 
            onAssignOrder={handleAssignOrder} 
            onEditOrder={setEditingOrder}
            onNotifyOrder={setNotifyingOrder} 
        />;
      case 'catalogue':
        return <Catalogue models={models} modelOfTheMonthId={modelOfTheMonthId} onSetModelOfTheMonth={handleSetModelOfTheMonth} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} userMode={userMode} onStartOrder={setOrderingModel} />;
      case 'gestion':
        return <Gestion models={models} onAddModel={handleAddModel} onUpdateModel={handleUpdateModel} onDeleteModel={handleDeleteModel} />;
       case 'gestionPostes':
        return <GestionPostes workstations={workstations} onAddWorkstation={handleAddWorkstation} onUpdateWorkstation={handleUpdateWorkstation} onDeleteWorkstation={handleDeleteWorkstation} />;
      case 'tutoriels':
        return <Tutoriels tutoriels={tutoriels}/>;
      case 'gestionTutoriels':
        return <GestionTutoriels tutoriels={tutoriels} onAddTutoriel={handleAddTutoriel} onUpdateTutoriel={handleUpdateTutoriel} onDeleteTutoriel={handleDeleteTutoriel} />;
      case 'fournitures':
        return <GestionFournitures fournitures={fournitures} onAddFourniture={handleAddFourniture} onUpdateFourniture={handleUpdateFourniture} onDeleteFourniture={handleDeleteFourniture} />;
      case 'archives':
        return <ArchivesCommandes orders={orders} clients={clients} models={models} />;
      case 'agenda':
        return <Agenda appointments={appointments} clients={clients} onAddAppointment={handleAddAppointment} onDeleteAppointment={handleDeleteAppointment} />;
      case 'modeleDuMois':
        return <ModeleDuMois models={models} modelOfTheMonthId={modelOfTheMonthId} onSetModelOfTheMonth={handleSetModelOfTheMonth} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} userMode={userMode} onStartOrder={setOrderingModel} />;
      case 'favoris':
        return <Favoris models={models} favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} userMode={userMode} onStartOrder={setOrderingModel} />;
      case 'suiviCommande':
        return <SuiviCommande orders={orders} models={models} />;
      default:
        return <Accueil models={models} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-900">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        userMode={userMode}
        isManagerAuthenticated={isManagerAuthenticated}
        onToggleMode={handleToggleMode}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        managerProfile={managerProfile}
        onUpdateManagerProfile={handleUpdateManagerProfile}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
         <header className="lg:hidden h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
            <h1 className="text-lg font-bold text-orange-900 dark:text-orange-400">MMV COUTURE</h1>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-stone-600 dark:text-stone-300 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800">
                <HamburgerIcon className="w-6 h-6" />
            </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {orderingModel && userMode === 'client' && (
        <ClientOrderForm
          model={orderingModel}
          onClose={() => setOrderingModel(null)}
          onPlaceOrder={(clientData) => handlePlaceOrder(orderingModel.id, clientData)}
        />
      )}
      {editingOrder && (
          <EditOrderModal
            order={editingOrder}
            onClose={() => setEditingOrder(null)}
            onSave={(data) => handleUpdateOrder(editingOrder.id, data)}
          />
      )}
      {showManagerAccessModal && <AccessCodeModal onClose={() => setShowManagerAccessModal(false)} onLoginAttempt={handleManagerLogin} />}
      {showWorkstationAccessModal && <WorkstationAccessModal onClose={() => setShowWorkstationAccessModal(false)} onLoginAttempt={handleWorkstationLogin} />}
      <OrderConfirmationAnimation isOpen={showOrderAnimation} />
      {notifyingOrder && (
        <NotificationModal
            order={notifyingOrder}
            client={clients.find(c => c.id === notifyingOrder.clientId)!}
            model={models.find(m => m.id === notifyingOrder.modelId)!}
            managerProfile={managerProfile}
            onClose={() => setNotifyingOrder(null)}
        />
      )}
      <OrderConfirmationModal message={orderConfirmationMessage} onClose={() => setOrderConfirmationMessage(null)} />
    </div>
  );
};

export default App;