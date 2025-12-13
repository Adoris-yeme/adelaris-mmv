
import React from 'react';
import { LockIcon } from './icons';

interface FloatingClientMenuProps {
    onOpenAccess: () => void;
}

const FloatingClientMenu: React.FC<FloatingClientMenuProps> = ({ onOpenAccess }) => {
    return (
        <div className="fixed bottom-4 left-4 z-50 no-print group">
            <button
                onClick={onOpenAccess}
                className="w-10 h-10 flex items-center justify-center bg-stone-200/50 dark:bg-stone-800/50 text-stone-400 rounded-full hover:bg-orange-900 hover:text-white transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-lg hover:w-12 hover:h-12"
                aria-label="Accès Sécurisé"
                title="Accès Personnel"
            >
                <LockIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default FloatingClientMenu;
