import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import type { User, Atelier, AtelierData, SubscriptionStatus, ManagerProfile, Client, Modele, Order, Appointment, Workstation, Fourniture, AtelierWithManager, SubscriptionPlan, Review, ShowcaseStatus, SiteContent, Expense, AtelierType, Specialization } from '../types';

// --- STORAGE & PERSISTENCE ---
const STORAGE_KEY = 'mmv_couture_db_v4_prod'; // New version key
const API_URL = import.meta.env.VITE_API_URL || '';

const apiRequest = async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });

    if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
            const data = await res.json();
            message = data?.message || message;
        } catch (e) {
            // ignore
        }
        throw new Error(message);
    }

    return res.json() as Promise<T>;
};

const createEmptyAtelierData = (atelierName: string, managerProfile: ManagerProfile, managerAccessCode: string): AtelierData => ({
    clients: [],
    models: [],
    appointments: [],
    orders: [],
    workstations: [],
    fournitures: [],
    notifications: [],
    expenses: [],
    managerProfile: { ...managerProfile, name: atelierName },
    managerAccessCode,
    modelOfTheMonthId: null,
    favoriteIds: [],
    isNew: true,
    tutoriels: []
});

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    atelier: Atelier | null;
    isSubscriptionActive: boolean;
    isImpersonating: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    googleLogin: (credential: string, options?: { atelierName?: string; atelierType?: AtelierType; specialization?: Specialization; employeeCount?: number }) => Promise<boolean>;
    logout: () => void;
    register: (atelierName: string, email: string, pass: string, withDemoData: boolean, atelierType?: AtelierType, specialization?: Specialization, employeeCount?: number, initialPlan?: SubscriptionPlan) => Promise<boolean>;
    changePassword: (userId: string, oldPass: string, newPass: string) => Promise<{ success: boolean, message: string }>;
    impersonate: (managerId: string) => Promise<void>;
    stopImpersonating: () => Promise<void>;
    getAllAteliersWithManager: () => Promise<AtelierWithManager[]>;
    updateSubscription: (atelierId: string, status: SubscriptionStatus, durationInMonths?: number) => Promise<void>;
    upgradeClientSubscription: (plan: SubscriptionPlan, durationMonths: number) => Promise<void>;
    updateAtelierData: (atelierId: string, newData: AtelierData) => Promise<void>;
    resetAtelierData: (atelierId: string) => Promise<void>;
    updateManagerProfile: (profile: ManagerProfile) => Promise<void>;
    getShowcaseModels: () => Promise<Modele[]>;
    getPendingShowcaseModels: () => Promise<Modele[]>;
    updateShowcaseStatus: (modelId: string, status: ShowcaseStatus) => Promise<void>;
    registerClientAndOrderFromShowroom: (model: Modele, clientInfo: { name: string, phone: string, email?: string }) => Promise<boolean>;
    getReviews: () => Promise<Review[]>;
    addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
    respondToReview: (reviewId: string, response: string) => Promise<void>;
    getSiteContent: () => Promise<SiteContent>;
    updateSiteContent: (newContent: SiteContent) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [atelier, setAtelier] = useState<Atelier | null>(null);
    const [isImpersonating, setIsImpersonating] = useState(false);
    const [originalUser, setOriginalUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('mmv_user');
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);

        if (parsedUser.role === 'manager' && parsedUser.atelierId) {
            apiRequest<Atelier>(`/api/atelier/${parsedUser.atelierId}`)
                .then((a) => setAtelier(a))
                .catch(() => {
                    localStorage.removeItem('mmv_user');
                    setUser(null);
                    setAtelier(null);
                });
        }
    }, []);

    const isAuthenticated = !!user;

    const isSubscriptionActive = atelier ? (atelier.subscription.status === 'active' || atelier.subscription.status === 'trial') && (!atelier.subscription.expiresAt || new Date(atelier.subscription.expiresAt) > new Date()) : false;

    // --- API ACTIONS ---

    const login = useCallback(async (email: string, pass: string) => {
        try {
            const result = await apiRequest<{ user: User; atelier: Atelier | null }>(
                '/api/auth/login',
                { method: 'POST', body: JSON.stringify({ email, password: pass }) }
            );
            setUser(result.user);
            setAtelier(result.atelier);
            localStorage.setItem('mmv_user', JSON.stringify(result.user));
            return true;
        } catch (e) {
            return false;
        }
    }, []);

    const googleLogin = useCallback(async (credential: string, options?: { atelierName?: string; atelierType?: AtelierType; specialization?: Specialization; employeeCount?: number }) => {
        try {
            const result = await apiRequest<{ user: User; atelier: Atelier | null }>(
                '/api/auth/google',
                { method: 'POST', body: JSON.stringify({ credential, ...(options || {}) }) }
            );
            setUser(result.user);
            setAtelier(result.atelier);
            localStorage.setItem('mmv_user', JSON.stringify(result.user));
            if (result.atelier) {
                localStorage.setItem('mmv_atelier', JSON.stringify(result.atelier));
            }
            return true;
        } catch (e) {
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setAtelier(null);
        setIsImpersonating(false);
        setOriginalUser(null);
        localStorage.removeItem('mmv_user');
        localStorage.removeItem('mmv_atelier');
    }, []);

    const register = useCallback(async (atelierName: string, email: string, pass: string, withDemoData: boolean, atelierType?: AtelierType, specialization?: Specialization, employeeCount?: number, initialPlan: SubscriptionPlan = 'trial') => {
        try {
            const result = await apiRequest<{ user: User; atelier: Atelier }>(
                '/api/auth/register',
                { method: 'POST', body: JSON.stringify({ email, password: pass, atelierName, atelierType, specialization, employeeCount }) }
            );
            setUser(result.user);
            setAtelier(result.atelier);
            localStorage.setItem('mmv_user', JSON.stringify(result.user));
            localStorage.setItem('mmv_atelier', JSON.stringify(result.atelier));
            return true;
        } catch (e) {
            return false;
        }
    }, []);

    const changePassword = useCallback(async (userId: string, oldPass: string, newPass: string) => {
        try {
            const result = await apiRequest<{ success: boolean; message: string }>(
                `/api/auth/change-password/${userId}`,
                { method: 'POST', body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }) }
            );
            return result;
        } catch (e) {
            return { success: false, message: (e as Error).message || 'Erreur serveur' };
        }
    }, []);

    const impersonate = useCallback(async (managerId: string) => {
        if (user?.role !== 'superadmin') return;

        const ateliers = await apiRequest<AtelierWithManager[]>('/api/admin/ateliers');
        const targetAtelier = ateliers.find(a => a.managerId === managerId);
        if (!targetAtelier) return;

        setOriginalUser(user);
        setIsImpersonating(true);
        setUser({ id: managerId, email: targetAtelier.managerEmail, role: 'manager', atelierId: targetAtelier.id, passwordHash: '' });
        setAtelier(targetAtelier);
    }, [user]);

    const stopImpersonating = useCallback(async () => {
        if (!isImpersonating || !originalUser) return;
        setUser(originalUser);
        setIsImpersonating(false);
        setOriginalUser(null);
        if (originalUser.role === 'manager' && originalUser.atelierId) {
            try {
                const a = await apiRequest<Atelier>(`/api/atelier/${originalUser.atelierId}`);
                setAtelier(a);
            } catch (e) {
                setAtelier(null);
            }
        } else {
            setAtelier(null);
        }
    }, [isImpersonating, originalUser]);

    // --- DATA SYNC ---

    const updateAtelierData = useCallback(async (atelierId: string, newData: AtelierData) => {
        try {
            await apiRequest(`/api/atelier/${atelierId}/data`, { method: 'PUT', body: JSON.stringify(newData) });
            if (atelier && atelier.id === atelierId) {
                setAtelier(prev => prev ? { ...prev, data: newData } : null);
            }
        } catch (e) {
            // ignore
        }
    }, [atelier]);

    const resetAtelierData = useCallback(async (atelierId: string) => {
        if (!atelier || atelier.id !== atelierId) return;
        const profile = atelier.data.managerProfile || { name: atelier.name, avatarUrl: 'https://placehold.co/100x100/e2e8f0/78350f?text=Logo' };
        const accessCode = atelier.data.managerAccessCode || '';
        const cleanData = createEmptyAtelierData(atelier.name, profile, accessCode);
        await updateAtelierData(atelierId, cleanData);
        setAtelier(prev => prev ? { ...prev, data: cleanData } : null);
    }, [atelier, updateAtelierData]);

    const updateSubscription = useCallback(async (atelierId: string, status: SubscriptionStatus, durationInMonths?: number) => {
        await apiRequest(`/api/admin/ateliers/${atelierId}/subscription`, {
            method: 'PUT',
            body: JSON.stringify({ status, durationInMonths })
        });

        if (atelier && atelier.id === atelierId) {
            const refreshed = await apiRequest<Atelier>(`/api/atelier/${atelierId}`);
            setAtelier(refreshed);
        }
    }, [atelier]);

    const upgradeClientSubscription = useCallback(async (plan: SubscriptionPlan, durationMonths: number) => {
        if (!atelier) return;
        await apiRequest(`/api/admin/ateliers/${atelier.id}/subscription`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'active', plan, durationInMonths: durationMonths })
        });
        const refreshed = await apiRequest<Atelier>(`/api/atelier/${atelier.id}`);
        setAtelier(refreshed);
    }, [atelier]);

    const getAllAteliersWithManager = useCallback(async (): Promise<AtelierWithManager[]> => {
        return apiRequest<AtelierWithManager[]>('/api/admin/ateliers');
    }, []);

    const updateManagerProfile = useCallback(async (profile: ManagerProfile) => {
        if (!atelier) return;
        const newData = { ...atelier.data, managerProfile: profile };
        await updateAtelierData(atelier.id, newData);
    }, [atelier, updateAtelierData]);

    const getShowcaseModels = useCallback(async () => {
        return apiRequest<Modele[]>('/api/public/showroom/models?status=approved');
    }, []);

    const getPendingShowcaseModels = useCallback(async () => {
        return apiRequest<Modele[]>('/api/admin/showcase/pending-models');
    }, []);

    const getReviews = useCallback(async () => {
        return apiRequest<Review[]>('/api/public/reviews');
    }, []);

    const addReview = useCallback(async (review: Omit<Review, 'id' | 'createdAt'>) => {
        await apiRequest('/api/public/reviews', { method: 'POST', body: JSON.stringify(review) });
    }, []);

    const respondToReview = useCallback(async (reviewId: string, response: string) => {
        await apiRequest(`/api/public/reviews/${reviewId}/response`, { method: 'PUT', body: JSON.stringify({ response }) });
    }, []);

    const getSiteContent = useCallback(async () => {
        return apiRequest<SiteContent>('/api/public/site-content');
    }, []);

    const updateSiteContent = useCallback(async (newContent: SiteContent) => {
        await apiRequest('/api/public/site-content', { method: 'PUT', body: JSON.stringify(newContent) });
    }, []);

    const updateShowcaseStatus = useCallback(async (modelId: string, status: ShowcaseStatus) => {
        await apiRequest(`/api/admin/showcase/models/${modelId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    }, []);

    const registerClientAndOrderFromShowroom = useCallback(async (model: Modele, clientInfo: { name: string, phone: string, email?: string }) => {
        try {
            await apiRequest('/api/public/showroom/orders', {
                method: 'POST',
                body: JSON.stringify({ modelId: model.id, client: clientInfo })
            });
            return true;
        } catch (e) {
            return false;
        }
    }, []);

    const value = useMemo(() => ({
        isAuthenticated, user, atelier, isSubscriptionActive, isImpersonating,
        login, googleLogin, logout, register, changePassword, impersonate, stopImpersonating,
        getAllAteliersWithManager, updateSubscription, upgradeClientSubscription, updateAtelierData, resetAtelierData, updateManagerProfile,
        getShowcaseModels, getPendingShowcaseModels, updateShowcaseStatus, registerClientAndOrderFromShowroom,
        getReviews, addReview, respondToReview, getSiteContent, updateSiteContent
    }), [isAuthenticated, user, atelier, isSubscriptionActive, isImpersonating, login, googleLogin, logout, register, changePassword, impersonate, stopImpersonating, getAllAteliersWithManager, updateSubscription, upgradeClientSubscription, updateAtelierData, resetAtelierData, updateManagerProfile, getShowcaseModels, getPendingShowcaseModels, updateShowcaseStatus, registerClientAndOrderFromShowroom, getReviews, addReview, respondToReview, getSiteContent, updateSiteContent]);

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
