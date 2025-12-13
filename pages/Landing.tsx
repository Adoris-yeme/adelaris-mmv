import React from 'react';

interface LandingProps {
    onNavigate: (page: 'login' | 'register') => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-900 p-4">
            <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-orange-900 dark:text-orange-300 tracking-tight">
                    MMV COUTURE
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-stone-600 dark:text-stone-300">
                    La plateforme tout-en-un pour gérer votre atelier de couture. De la prise de mesure à la livraison.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button 
                        onClick={() => onNavigate('login')} 
                        className="w-full sm:w-auto px-8 py-3 text-md font-medium bg-orange-900 text-white rounded-lg shadow-lg hover:bg-orange-800 transition-transform hover:scale-105"
                    >
                        Se Connecter
                    </button>
                    <button 
                        onClick={() => onNavigate('register')} 
                        className="w-full sm:w-auto px-6 py-3 text-md font-medium bg-white/80 dark:bg-stone-700/50 text-orange-900 dark:text-orange-300 rounded-lg shadow-lg hover:bg-white dark:hover:bg-stone-700 transition-all backdrop-blur-sm"
                    >
                        Créer mon atelier
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
