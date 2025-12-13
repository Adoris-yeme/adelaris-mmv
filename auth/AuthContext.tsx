
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import type { User, Atelier, AtelierData, SubscriptionStatus, ManagerProfile, Client, Modele, Order, Appointment, Workstation, Fourniture, AtelierWithManager, SubscriptionPlan, Review, ShowcaseStatus, SiteContent, Expense, AtelierType, Specialization } from '../types';

// --- CLEAN INITIAL DATA (Ready for Hosting) ---
const EMPTY_MANAGER_PROFILE: ManagerProfile = {
    name: '',
    avatarUrl: 'https://placehold.co/100x100/e2e8f0/78350f?text=Logo',
    atelierType: 'Atelier Couture',
    specialization: 'Dame',
    employeeCount: 0
};

// --- STORAGE & PERSISTENCE ---
const STORAGE_KEY = 'mmv_couture_db_v4_prod'; // New version key

const createInitialData = (atelierId: string, atelierName: string, accessCode: string, atelierType?: AtelierType, specialization?: Specialization, employeeCount?: number): AtelierData => ({
    clients: [], 
    models: [], 
    appointments: [], 
    orders: [], 
    workstations: [], 
    fournitures: [], 
    notifications: [], 
    expenses: [], 
    managerProfile: { 
        name: atelierName, 
        avatarUrl: 'https://placehold.co/100x100/e2e8f0/78350f?text=NA',
        atelierType,
        specialization,
        employeeCount
    }, 
    managerAccessCode: accessCode, 
    modelOfTheMonthId: null, 
    favoriteIds: [], 
    isNew: true
});

const DEFAULT_DB = {
    users: [
        { id: 'user-superadmin', email: 'admin@adelaris.com', passwordHash: 'admin123', role: 'superadmin' },
    ],
    ateliers: [], 
    reviews: [],
    siteContent: {
        hero: {
            imageUrl: 'https://i.pinimg.com/564x/e8/35/6a/e8356a59c572e9a2862a3260713d8753.jpg',
            backgroundPosition: 'center center',
            title: '"MM-V" Multiple Model - Viewer',
            subtitle: 'La plateforme tout-en-un pour les ateliers de couture. Gérez vos clients, vos modèles et exposez votre savoir-faire au monde entier.',
        },
        stats: [
            { id: 's1', value: '100%', label: 'Sécurisé' },
            { id: 's2', value: '24/7', label: 'Disponible' },
            { id: 's3', value: 'Infinity', label: 'Créativité' }
        ],
        segments: [
            {
                id: 'seg-afro',
                title: 'L\'Excellence de la Mode Africaine',
                text: 'MMV Couture célèbre la richesse des tissus et des coupes africaines. Que vous travailliez le Bazin, le Wax, le Kente ou le Bogolan, notre plateforme est conçue pour mettre en valeur la précision de votre art et la beauté de vos créations. Offrez à vos clients une expérience digne des plus grandes maisons de couture.',
                imageUrl: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3',
                layout: 'image-left',
            },
            {
                id: 'seg1',
                title: 'Un savoir-faire unique, une gestion moderne',
                text: 'Découvrez des outils qui allient tradition et modernité. Fini les carnets perdus et les mesures approximatives. Centralisez tout votre atelier dans votre poche.',
                imageUrl: 'https://images.unsplash.com/photo-1617231475713-333182803c53?q=80&w=1887&auto=format&fit=crop',
                layout: 'image-right',
            }
        ],
        blocks: []
    }
};

const loadDB = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load DB from local storage", e);
    }
    return DEFAULT_DB;
};

let DB: { users: User[], ateliers: Atelier[], reviews: Review[], siteContent: SiteContent } = loadDB();

const persistDB = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DB));
    } catch (e) {
        console.error("Failed to save DB to local storage", e);
    }
};

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    atelier: Atelier | null;
    isSubscriptionActive: boolean;
    isImpersonating: boolean;
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    register: (atelierName: string, email: string, pass: string, withDemoData: boolean, atelierType?: AtelierType, specialization?: Specialization, employeeCount?: number, initialPlan?: SubscriptionPlan) => boolean;
    changePassword: (userId: string, oldPass: string, newPass: string) => { success: boolean, message: string };
    impersonate: (managerId: string) => void;
    stopImpersonating: () => void;
    getAllAteliersWithManager: () => AtelierWithManager[];
    updateSubscription: (atelierId: string, status: SubscriptionStatus, durationInMonths?: number) => void;
    upgradeClientSubscription: (plan: SubscriptionPlan, durationMonths: number) => void;
    updateAtelierData: (atelierId: string, newData: AtelierData) => void;
    resetAtelierData: (atelierId: string) => void;
    updateManagerProfile: (profile: ManagerProfile) => void;
    getShowcaseModels: () => Modele[];
    getPendingShowcaseModels: () => Modele[];
    updateShowcaseStatus: (modelId: string, status: ShowcaseStatus) => void;
    registerClientAndOrderFromShowroom: (model: Modele, clientInfo: { name: string, phone: string, email?: string }) => Promise<boolean>;
    getReviews: () => Review[];
    addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
    getSiteContent: () => SiteContent;
    updateSiteContent: (newContent: SiteContent) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [atelier, setAtelier] = useState<Atelier | null>(null);
    const [isImpersonating, setIsImpersonating] = useState(false);
    const [originalUser, setOriginalUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('mmv_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const dbUser = DB.users.find((u: User) => u.id === parsedUser.id);
            
            if (dbUser) {
                setUser(dbUser);
                if (dbUser.role === 'manager' && dbUser.atelierId) {
                    const foundAtelier = DB.ateliers.find(a => a.id === dbUser.atelierId);
                    if (foundAtelier) setAtelier(foundAtelier);
                }
            } else {
                localStorage.removeItem('mmv_user');
            }
        }
    }, []);

    const isAuthenticated = !!user;
    
    // Check subscription logic: Trial or Paid Active
    // The expiry check is crucial here.
    const isSubscriptionActive = atelier ? (atelier.subscription.status === 'active' || atelier.subscription.status === 'trial') && (!atelier.subscription.expiresAt || new Date(atelier.subscription.expiresAt) > new Date()) : false;

    const login = useCallback((email: string, pass: string) => {
        const foundUser = DB.users.find(u => u.email === email && u.passwordHash === pass);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('mmv_user', JSON.stringify(foundUser));
            if (foundUser.role === 'manager') {
                const foundAtelier = DB.ateliers.find(a => a.id === foundUser.atelierId);
                setAtelier(foundAtelier || null);
            } else {
                setAtelier(null);
            }
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setAtelier(null);
        setIsImpersonating(false);
        setOriginalUser(null);
        localStorage.removeItem('mmv_user');
    }, []);

    const register = useCallback((atelierName: string, email: string, pass: string, withDemoData: boolean, atelierType?: AtelierType, specialization?: Specialization, employeeCount?: number, initialPlan: SubscriptionPlan = 'trial') => {
        if (DB.users.find(u => u.email === email)) return false;

        const atelierId = `atelier-${crypto.randomUUID()}`;
        const userId = `user-${crypto.randomUUID()}`;
        const accessCode = `ATELIER-${Math.floor(1000 + Math.random() * 9000)}`;

        const newUser: User = { id: userId, email, passwordHash: pass, role: 'manager', atelierId };
        
        const initialData = createInitialData(atelierId, atelierName, accessCode, atelierType, specialization, employeeCount);

        // MODIFICATION: 2 Months (60 days) free trial
        const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

        const newAtelier: Atelier = {
            id: atelierId,
            name: atelierName,
            managerId: userId,
            subscription: { status: 'trial', expiresAt, plan: initialPlan }, // Start as trial
            data: initialData,
            createdAt: new Date().toISOString(),
        };

        DB.users.push(newUser);
        DB.ateliers.push(newAtelier);
        persistDB();

        setUser(newUser);
        setAtelier(newAtelier);
        localStorage.setItem('mmv_user', JSON.stringify(newUser));
        return true;
    }, []);

    const changePassword = useCallback((userId: string, oldPass: string, newPass: string) => {
        const userIndex = DB.users.findIndex(u => u.id === userId);
        if (userIndex === -1) return { success: false, message: 'Utilisateur non trouvé' };
        
        if (DB.users[userIndex].passwordHash !== oldPass && !isImpersonating && user?.role !== 'superadmin') {
             return { success: false, message: 'Ancien mot de passe incorrect' };
        }

        DB.users[userIndex].passwordHash = newPass;
        persistDB();
        return { success: true, message: 'Mot de passe mis à jour' };
    }, [user, isImpersonating]);

    const impersonate = useCallback((managerId: string) => {
        if (user?.role !== 'superadmin') return;
        const targetUser = DB.users.find(u => u.id === managerId);
        if (targetUser && targetUser.atelierId) {
            setOriginalUser(user);
            setIsImpersonating(true);
            setUser(targetUser);
            const foundAtelier = DB.ateliers.find(a => a.id === targetUser.atelierId);
            setAtelier(foundAtelier || null);
        }
    }, [user]);

    const stopImpersonating = useCallback(() => {
        if (!isImpersonating || !originalUser) return;
        setUser(originalUser);
        setAtelier(null);
        setIsImpersonating(false);
        setOriginalUser(null);
    }, [isImpersonating, originalUser]);

    const getAllAteliersWithManager = useCallback((): AtelierWithManager[] => {
        return DB.ateliers.map(a => {
            const manager = DB.users.find(u => u.id === a.managerId);
            return { ...a, managerEmail: manager?.email || 'N/A' };
        });
    }, []);

    const updateSubscription = useCallback((atelierId: string, status: SubscriptionStatus, durationInMonths?: number) => {
        const atelierIndex = DB.ateliers.findIndex(a => a.id === atelierId);
        if (atelierIndex > -1) {
            DB.ateliers[atelierIndex].subscription.status = status;
            if (durationInMonths) {
                const currentExpiry = DB.ateliers[atelierIndex].subscription.expiresAt ? new Date(DB.ateliers[atelierIndex].subscription.expiresAt!) : new Date();
                const newExpiry = new Date(Math.max(currentExpiry.getTime(), new Date().getTime()));
                newExpiry.setMonth(newExpiry.getMonth() + durationInMonths);
                DB.ateliers[atelierIndex].subscription.expiresAt = newExpiry.toISOString();
            }
            persistDB();
        }
    }, []);

    const upgradeClientSubscription = useCallback((plan: SubscriptionPlan, durationMonths: number) => {
        if (!atelier) return;
        const atelierIndex = DB.ateliers.findIndex(a => a.id === atelier.id);
        if (atelierIndex > -1) {
            const currentExpiry = DB.ateliers[atelierIndex].subscription.expiresAt ? new Date(DB.ateliers[atelierIndex].subscription.expiresAt!) : new Date();
            const newExpiry = new Date(Math.max(currentExpiry.getTime(), new Date().getTime()));
            newExpiry.setMonth(newExpiry.getMonth() + durationMonths);
            
            DB.ateliers[atelierIndex].subscription = {
                status: 'active',
                plan: plan,
                expiresAt: newExpiry.toISOString()
            };
            persistDB();
            setAtelier({ ...DB.ateliers[atelierIndex] });
        }
    }, [atelier]);

    const updateAtelierData = useCallback((atelierId: string, newData: AtelierData) => {
        const atelierIndex = DB.ateliers.findIndex(a => a.id === atelierId);
        if (atelierIndex > -1) {
            DB.ateliers[atelierIndex].data = newData;
            persistDB();
            
            // Only update local state if it's the currently logged in atelier
            if (atelier && atelier.id === atelierId) {
                setAtelier(prev => prev ? { ...prev, data: newData } : null);
            }
        }
    }, [atelier]);

    const resetAtelierData = useCallback((atelierId: string) => {
        const atelierIndex = DB.ateliers.findIndex(a => a.id === atelierId);
        if (atelierIndex > -1) {
            const currentProfile = DB.ateliers[atelierIndex].data.managerProfile;
            const currentCode = DB.ateliers[atelierIndex].data.managerAccessCode;
            const cleanData = createInitialData(atelierId, DB.ateliers[atelierIndex].name, currentCode, currentProfile.atelierType, currentProfile.specialization, currentProfile.employeeCount);
            
            DB.ateliers[atelierIndex].data = cleanData;
            persistDB();
            if (atelier && atelier.id === atelierId) {
                setAtelier({ ...atelier, data: cleanData });
            }
        }
    }, [atelier]);

    const updateManagerProfile = useCallback((profile: ManagerProfile) => {
        if (!atelier) return;
        const newData = { ...atelier.data, managerProfile: profile };
        updateAtelierData(atelier.id, newData);
    }, [atelier, updateAtelierData]);

    const getShowcaseModels = useCallback(() => {
        let allShowcaseModels: Modele[] = [];
        DB.ateliers.forEach(a => {
            const showcase = a.data.models.filter(m => m.showcaseStatus === 'approved');
            allShowcaseModels = [...allShowcaseModels, ...showcase];
        });
        return allShowcaseModels;
    }, []);

    const getPendingShowcaseModels = useCallback(() => {
        let pending: Modele[] = [];
        DB.ateliers.forEach(a => {
            pending = [...pending, ...a.data.models.filter(m => m.showcaseStatus === 'pending')];
        });
        return pending;
    }, []);

    const updateShowcaseStatus = useCallback((modelId: string, status: ShowcaseStatus) => {
        DB.ateliers.forEach(a => {
            const modelIndex = a.data.models.findIndex(m => m.id === modelId);
            if (modelIndex > -1) {
                a.data.models[modelIndex].showcaseStatus = status;
            }
        });
        persistDB();
    }, []);

    const registerClientAndOrderFromShowroom = useCallback(async (model: Modele, clientInfo: { name: string, phone: string, email?: string }) => {
        const targetAtelier = DB.ateliers.find(a => a.id === model.atelierId);
        if (!targetAtelier) return false;

        let client = targetAtelier.data.clients.find(c => c.phone === clientInfo.phone);
        if (!client) {
            client = {
                id: crypto.randomUUID(),
                ...clientInfo,
                measurements: {},
                lastSeen: 'Nouveau (Showroom)'
            };
            targetAtelier.data.clients.unshift(client);
        }

        const newOrder: Order = {
            id: crypto.randomUUID(),
            clientId: client.id,
            modelId: model.id,
            date: new Date().toISOString(),
            status: 'En attente de validation',
            ticketId: `CMD-WEB-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
            notes: 'Commande provenant de la salle d\'exposition en ligne.'
        };
        targetAtelier.data.orders.unshift(newOrder);
        
        targetAtelier.data.notifications.unshift({
            id: crypto.randomUUID(),
            message: `Nouvelle commande web de ${client.name} pour le modèle ${model.title}.`,
            date: new Date().toISOString(),
            read: false,
            orderId: newOrder.id
        });

        persistDB();
        return true;
    }, []);

    const getReviews = useCallback(() => DB.reviews, []);
    
    const addReview = useCallback((review: Omit<Review, 'id' | 'createdAt'>) => {
        const reviewId = crypto.randomUUID();
        const newReview: Review = { ...review, id: reviewId, createdAt: new Date().toISOString() };
        DB.reviews.unshift(newReview);

        if (review.target === 'atelier' && review.atelierId) {
            const targetAtelier = DB.ateliers.find(a => a.id === review.atelierId);
            if (targetAtelier) {
                targetAtelier.data.notifications.unshift({
                    id: crypto.randomUUID(),
                    message: `Nouvel avis reçu de ${review.author} : "${review.content.substring(0, 30)}..."`,
                    date: new Date().toISOString(),
                    read: false,
                    reviewId: reviewId
                });
            }
        }

        persistDB();
    }, []);

    const getSiteContent = useCallback(() => DB.siteContent, []);
    
    const updateSiteContent = useCallback((newContent: SiteContent) => {
        DB.siteContent = newContent;
        persistDB();
    }, []);

    const value = useMemo(() => ({
        isAuthenticated, user, atelier, isSubscriptionActive, isImpersonating,
        login, logout, register, changePassword, impersonate, stopImpersonating,
        getAllAteliersWithManager, updateSubscription, upgradeClientSubscription, updateAtelierData, resetAtelierData, updateManagerProfile,
        getShowcaseModels, getPendingShowcaseModels, updateShowcaseStatus, registerClientAndOrderFromShowroom,
        getReviews, addReview, getSiteContent, updateSiteContent
    }), [isAuthenticated, user, atelier, isSubscriptionActive, isImpersonating, login, logout, register, changePassword, impersonate, stopImpersonating, getAllAteliersWithManager, updateSubscription, upgradeClientSubscription, updateAtelierData, resetAtelierData, updateManagerProfile, getShowcaseModels, getPendingShowcaseModels, updateShowcaseStatus, registerClientAndOrderFromShowroom, getReviews, addReview, getSiteContent, updateSiteContent]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
