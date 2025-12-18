import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { Page } from '../types';

interface LoginProps {
    onNavigate: (page: Page) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        setIsLoading(true);
        const success = await login(email, password);
        setIsLoading(false);

        if (!success) setError('Email ou mot de passe incorrect.');
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-stone-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mb-2">Connexion</h2>
                <p className="text-center text-stone-500 dark:text-stone-400 mb-6">Accédez à votre espace de travail.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-3 px-4 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800 transition-colors disabled:opacity-60">
                        Se connecter
                    </button>
                </form>
                <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-6">
                    Pas encore d'atelier ?{' '}
                    <button onClick={() => onNavigate('register')} className="font-medium text-orange-800 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300">
                        Inscrivez-vous
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;