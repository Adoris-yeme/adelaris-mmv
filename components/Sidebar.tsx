
import React, { useState } from 'react';
import type { Page, UserMode, Notification, ManagerProfile } from '../types';
import NotificationBell from './NotificationBell';
import EditProfileModal from './EditProfileModal';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../i18n/LanguageContext';
import { 
    HomeIcon,
    ClientsIcon, 
    CatalogueIcon, 
    AgendaIcon, 
    StarIcon,
    GestionIcon,
    SunIcon,
    MoonIcon,
    FavorisIcon,
    SwitchUserIcon,
    WorkstationIcon,
    DashboardIcon,
    OrderIcon,
    TrackIcon,
    LogoutIcon,
    FournituresIcon,
    ArchiveIcon,
    FinancesIcon,
    StudioIcon,
    ReviewsIcon,
    SettingsIcon
} from './icons';
import { useAuth } from '../auth/AuthContext';


interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userMode: UserMode;
  onToggleMode: (mode: 'manager' | 'workstation') => void;
  onLogout: () => void;
  notifications: Notification[];
  onMarkNotificationsRead: (ids: string[]) => void;
  managerProfile: ManagerProfile;
  onUpdateManagerProfile: (profile: ManagerProfile) => void;
  onOpenChangePassword: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg ${
      isActive
        ? 'bg-orange-900 text-white'
        : 'text-stone-600 dark:text-stone-300 hover:bg-orange-100 hover:text-orange-900 dark:hover:bg-stone-800 dark:hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const SidebarContent: React.FC<Omit<SidebarProps, 'isOpen' | 'setIsOpen'>> = ({ currentPage, setCurrentPage, theme, toggleTheme, userMode, onToggleMode, onLogout, notifications, onMarkNotificationsRead, managerProfile, onUpdateManagerProfile, onOpenChangePassword }) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const { user, atelier, logout: globalLogout, isSubscriptionActive } = useAuth();
    const { t } = useLanguage();
    
    // Logic to determine available menu items based on subscription status
    const managerNavItems = [
        ...(isSubscriptionActive ? [{ id: 'dashboard', label: t('nav.dashboard'), icon: <DashboardIcon className="w-5 h-5" /> }] : []),
        { id: 'commandes', label: t('nav.orders'), icon: <OrderIcon className="w-5 h-5" /> },
        ...(isSubscriptionActive ? [{ id: 'studio', label: t('nav.studio'), icon: <StudioIcon className="w-5 h-5" /> }] : []),
        { id: 'clients', label: t('nav.clients'), icon: <ClientsIcon className="w-5 h-5" /> },
        { id: 'catalogue', label: t('nav.catalog'), icon: <CatalogueIcon className="w-5 h-5" /> },
        { id: 'gestion', label: t('nav.catalog_management'), icon: <GestionIcon className="w-5 h-5" /> },
        ...(isSubscriptionActive ? [{ id: 'fournitures', label: t('nav.supplies'), icon: <FournituresIcon className="w-5 h-5" /> }] : []),
        ...(isSubscriptionActive ? [{ id: 'gestionPostes', label: t('nav.team'), icon: <WorkstationIcon className="w-5 h-5" /> }] : []),
        ...(isSubscriptionActive ? [{ id: 'archives', label: t('nav.archives'), icon: <ArchiveIcon className="w-5 h-5" /> }] : []),
        ...(isSubscriptionActive ? [{ id: 'finances', label: t('nav.finances'), icon: <FinancesIcon className="w-5 h-5" /> }] : []),
        { id: 'avisAtelier', label: t('nav.reviews'), icon: <ReviewsIcon className="w-5 h-5" /> },
        { id: 'agenda', label: t('nav.agenda'), icon: <AgendaIcon className="w-5 h-5" /> },
        { id: 'modeleDuMois', label: t('nav.model_month'), icon: <StarIcon className="w-5 h-5" /> },
        { id: 'settings', label: t('nav.settings'), icon: <SettingsIcon className="w-5 h-5" /> },
    ];

    const clientNavItems = [
        { id: 'accueil', label: t('nav.home'), icon: <HomeIcon className="w-5 h-5" /> },
        { id: 'catalogue', label: t('nav.catalog'), icon: <CatalogueIcon className="w-5 h-5" /> },
        { id: 'modeleDuMois', label: t('nav.model_month'), icon: <StarIcon className="w-5 h-5" /> },
        { id: 'suiviCommande', label: t('nav.track_order'), icon: <TrackIcon className="w-5 h-5" /> },
        { id: 'favoris', label: t('nav.favorites'), icon: <FavorisIcon className="w-5 h-5" /> },
    ];
    
    const workstationNavItems = [
        { id: 'accueil', label: t('nav.my_tasks'), icon: <DashboardIcon className="w-5 h-5" /> },
        { id: 'salleCommandes', label: t('nav.order_room'), icon: <OrderIcon className="w-5 h-5" /> },
    ];
    
    const getNavItems = () => {
        if (user?.role === 'superadmin') return [];
        switch(userMode) {
            case 'manager': return managerNavItems;
            case 'workstation': return workstationNavItems;
            case 'client':
            default: return clientNavItems;
        }
    }
    
    return (
        <>
            <div className="flex items-center justify-center h-16 lg:h-20 border-b border-stone-200 dark:border-stone-800 flex-shrink-0">
                <h1 className="text-xl font-bold text-orange-900 dark:text-orange-400 tracking-wider">MMV COUTURE</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {getNavItems().map((item) => (
                <NavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentPage === item.id as Page}
                    onClick={() => setCurrentPage(item.id as Page)}
                />
                ))}
            </nav>
            
            {userMode === 'manager' && (
                <div className="px-4 py-2 flex justify-center">
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500">
                        <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Sauvegarde auto</span>
                    </div>
                </div>
            )}

            <div className="px-4 py-4 border-t border-stone-200 dark:border-stone-800 flex-shrink-0">
                <div className="flex justify-center mb-4">
                    <LanguageSwitcher />
                </div>
                <div className="mb-4 space-y-2">
                   {userMode === 'workstation' ? (
                        <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-orange-100 hover:text-orange-900 dark:hover:bg-stone-800 dark:hover:text-white">
                             <LogoutIcon className="w-5 h-5" />
                             <span className="ml-3">{t('nav.quit_workstation')}</span>
                        </button>
                   ) : ( 
                       <>
                            <button onClick={() => onToggleMode('manager')} className="flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-orange-100 hover:text-orange-900 dark:hover:bg-stone-800 dark:hover:text-white">
                                <SwitchUserIcon className="w-5 h-5" />
                                <span className="ml-3">{userMode === 'manager' ? t('nav.switch_client') : t('nav.switch_manager')}</span>
                           </button>
                           
                           <button onClick={() => onToggleMode('workstation')} className="flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-orange-100 hover:text-orange-900 dark:hover:bg-stone-800 dark:hover:text-white">
                               <WorkstationIcon className="w-5 h-5" />
                               <span className="ml-3">{t('nav.activate_workstation')}</span>
                           </button>
                           
                           {userMode === 'manager' && (
                               <button onClick={globalLogout} className="flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-orange-100 hover:text-orange-900 dark:hover:bg-stone-800 dark:hover:text-white">
                                    <LogoutIcon className="w-5 h-5" />
                                    <span className="ml-3">{t('btn.logout')}</span>
                               </button>
                           )}
                       </>
                   )}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                        <img className="h-10 w-10 rounded-full object-cover flex-shrink-0" src={(userMode === 'manager' || user?.role === 'superadmin') ? managerProfile.avatarUrl : "https://placehold.co/100x100/e2e8f0/78350f?text=Client"} alt="User" />
                        <div className="ml-3 min-w-0">
                            <p className="text-sm font-medium text-stone-700 dark:text-stone-200 truncate">
                                {user?.role === 'superadmin' ? 'Super Admin' : (userMode === 'manager' ? atelier?.name : userMode === 'workstation' ? 'Poste de Travail' : 'Espace Client')}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                                {user?.role === 'superadmin' ? 'Administration' : (userMode === 'manager' ? 'Profil Manager' : userMode === 'workstation' ? 'Mode Production' : 'Bienvenue')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {userMode === 'manager' && (
                            <>
                                <button onClick={() => setShowProfileModal(true)} className="p-2 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors" aria-label="Edit Profile">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                </button>
                                <NotificationBell notifications={notifications} onMarkAsRead={onMarkNotificationsRead} />
                            </>
                        )}
                        <button 
                        onClick={toggleTheme} 
                        className="p-2 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
            {showProfileModal && (
                <EditProfileModal
                    profile={managerProfile}
                    onClose={() => setShowProfileModal(false)}
                    onSave={onUpdateManagerProfile}
                    onOpenChangePassword={onOpenChangePassword}
                />
            )}
        </>
    );
}

const Sidebar: React.FC<Omit<SidebarProps, 'notifications' | 'onMarkNotificationsRead' | 'userMode' | 'onToggleMode' | 'onLogout' | 'managerProfile' | 'onUpdateManagerProfile' | 'onOpenChangePassword'> & Partial<SidebarProps>> = (props) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  
  if (user?.role === 'superadmin') {
      return (
          <div className="hidden lg:flex flex-col w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 shadow-sm flex-shrink-0">
              <div className="flex items-center justify-center h-16 lg:h-20 border-b border-stone-200 dark:border-stone-800 flex-shrink-0">
                <h1 className="text-xl font-bold text-orange-900 dark:text-orange-400 tracking-wider">ADMIN</h1>
            </div>
            <div className="flex-1"></div>
            <div className="px-4 py-4 border-t border-stone-200 dark:border-stone-800">
                <div className="flex justify-center mb-4">
                    <LanguageSwitcher />
                </div>
                <button onClick={logout} className="flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-orange-100 hover:text-orange-900 dark:hover:bg-stone-800 dark:hover:text-white">
                    <LogoutIcon className="w-5 h-5" />
                    <span className="ml-3">{t('btn.logout')}</span>
                </button>
            </div>
          </div>
      );
  }

  const fullProps: SidebarProps = {
      notifications: [],
      onMarkNotificationsRead: () => {},
      userMode: 'client' as UserMode,
      onToggleMode: () => {},
      onLogout: () => {},
      managerProfile: { name: 'Atelier', avatarUrl: ''},
      onUpdateManagerProfile: () => {},
      onOpenChangePassword: () => {},
      ...props
  }
  return (
    <>
      <div className="hidden lg:flex flex-col w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 shadow-sm flex-shrink-0 h-screen sticky top-0">
        <SidebarContent {...fullProps} />
      </div>

      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${props.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!props.isOpen}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => props.setIsOpen(false)}></div>
        
        <div 
          className={`relative flex flex-col w-64 h-full bg-white dark:bg-stone-900 shadow-xl transition-transform duration-300 ease-in-out ${props.isOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('button') && !(e.target as HTMLElement).closest('div[class*="LanguageSwitcher"]')) {
              props.setIsOpen(false);
            }
          }}
        >
          <SidebarContent {...fullProps} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
