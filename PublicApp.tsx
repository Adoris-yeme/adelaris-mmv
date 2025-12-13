
import React, { useState, useEffect } from 'react';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import PublicHome from './pages/PublicHome';
import About from './pages/About';
import Showroom from './pages/Showroom';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import Register from './pages/Register';
import Legal from './pages/Legal';
import type { Page } from './types';

const PublicApp: React.FC = () => {
    const [page, setPage] = useState<Page>('publicHome');

    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#legal') {
                setPage('legal');
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        if (window.location.hash === '#legal') setPage('legal');
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const renderContent = () => {
        switch (page) {
            case 'about':
                return <About />;
            case 'showroom':
                return <Showroom />;
            case 'reviews':
                return <Reviews />;
            case 'login':
                return <Login onNavigate={setPage} />;
            case 'register':
                return <Register onNavigate={setPage} />;
            case 'legal':
                return <Legal />;
            case 'publicHome':
            default:
                return <PublicHome onNavigate={setPage} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
            <PublicHeader currentPage={page} onNavigate={setPage} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderContent()}
            </main>
            <PublicFooter onNavigate={setPage} />
        </div>
    );
};

export default PublicApp;
