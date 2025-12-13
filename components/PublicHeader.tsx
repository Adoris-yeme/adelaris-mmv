
import React from 'react';
import type { Page } from '../types';
import { HomeIcon, ShowroomIcon, ReviewsIcon, AboutIcon } from './icons';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface PublicHeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const NavLink: React.FC<{ label: string; page: Page; icon: React.ReactNode; isActive: boolean; onNavigate: (page: Page) => void; }> = ({ label, page, icon, isActive, onNavigate }) => (
    <button
        onClick={() => onNavigate(page)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-900 dark:text-orange-200'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
        }`}
    >
        {icon}
        {label}
    </button>
);

const PublicHeader: React.FC<PublicHeaderProps> = ({ currentPage, onNavigate }) => {
    const { t } = useLanguage();

    const navItems: { label: string, page: Page, icon: React.ReactNode }[] = [
        { label: t('nav.home'), page: 'publicHome', icon: <HomeIcon className="w-5 h-5" /> },
        { label: t('nav.showroom'), page: 'showroom', icon: <ShowroomIcon className="w-5 h-5" /> },
        { label: t('nav.reviews'), page: 'reviews', icon: <ReviewsIcon className="w-5 h-5" /> },
        { label: t('nav.about'), page: 'about', icon: <AboutIcon className="w-5 h-5" /> },
    ];

    return (
        <header className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-stone-200 dark:border-stone-800">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-orange-900 dark:text-orange-400 tracking-wider cursor-pointer" onClick={() => onNavigate('publicHome')}>MMV COUTURE</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-4">
                        {navItems.map(item => (
                            <NavLink key={item.page} {...item} isActive={currentPage === item.page} onNavigate={onNavigate} />
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher className="hidden sm:flex" />
                        <button
                            onClick={() => onNavigate('login')}
                            className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 transition-colors"
                        >
                            {t('nav.workshop_access')}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PublicHeader;
