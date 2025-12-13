
import React from 'react';
import { useAuth } from '../auth/AuthContext';
import type { UserMode } from '../types';

interface AuthenticatedFooterProps {
    userMode: UserMode;
}

const AuthenticatedFooter: React.FC<AuthenticatedFooterProps> = ({ userMode }) => {
    const { atelier, logout } = useAuth();

    return (
        <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-6 mt-auto flex-shrink-0">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-stone-500 dark:text-stone-400">
                    <p>&copy; {new Date().getFullYear()} MMV COUTURE. Plateforme de gestion pour l'atelier <strong>{atelier?.name}</strong>.</p>
                </div>
                
                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-orange-900 dark:hover:text-orange-400 transition-colors">Support</a>
                    <a href="#" className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-orange-900 dark:hover:text-orange-400 transition-colors">Conditions (CGU)</a>
                    {userMode !== 'client' && (
                        <>
                            <div className="h-4 w-px bg-stone-300 dark:bg-stone-700"></div>
                            <button 
                                onClick={logout} 
                                className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                            >
                                Se déconnecter
                            </button>
                        </>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default AuthenticatedFooter;
