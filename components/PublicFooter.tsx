
import React, { useState } from 'react';
import type { Page } from '../types';

interface PublicFooterProps {
    onNavigate: (page: Page) => void;
}

const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const handleNavClick = (e: React.MouseEvent, page: Page) => {
        e.preventDefault();
        onNavigate(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-lg font-bold text-orange-900 dark:text-orange-400 tracking-wider mb-4">MMV COUTURE</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                            La plateforme de référence pour digitaliser votre atelier de couture. Simplifiez votre gestion et sublimez vos créations.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Placeholders */}
                            <a href="#" className="text-stone-400 hover:text-orange-800 dark:hover:text-orange-400 transition-colors"><span className="sr-only">Facebook</span>FB</a>
                            <a href="#" className="text-stone-400 hover:text-orange-800 dark:hover:text-orange-400 transition-colors"><span className="sr-only">Instagram</span>IG</a>
                            <a href="#" className="text-stone-400 hover:text-orange-800 dark:hover:text-orange-400 transition-colors"><span className="sr-only">Twitter</span>TW</a>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h4 className="font-semibold text-stone-800 dark:text-stone-100 mb-4">Accès Rapide</h4>
                        <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'publicHome')} className="hover:text-orange-800 dark:hover:text-orange-300 transition-colors">Accueil</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'showroom')} className="hover:text-orange-800 dark:hover:text-orange-300 transition-colors">Showroom</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-orange-800 dark:hover:text-orange-300 transition-colors">À propos</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'reviews')} className="hover:text-orange-800 dark:hover:text-orange-300 transition-colors">Témoignages</a></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="font-semibold text-stone-800 dark:text-stone-100 mb-4">Légal</h4>
                        <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'legal')} className="hover:text-orange-800 dark:hover:text-orange-300 transition-colors">Mentions Légales</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'legal')} className="hover:text-orange-800 dark:hover:text-orange-300 transition-colors">Confidentialité</a></li>
                            <li><a href="#" onClick={(e) => handleNavClick(e, 'legal')} className="hover:text-orange-800 dark:hover:text-orange-300 transition-colors">CGU</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="col-span-1 md:col-span-1">
                        <h4 className="font-semibold text-stone-800 dark:text-stone-100 mb-4">Newsletter</h4>
                        <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                            Recevez nos dernières actualités et conseils pour votre atelier.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                            <input 
                                type="email" 
                                placeholder="Votre email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-stone-300 dark:border-stone-700 rounded-md bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                            <button 
                                type="submit" 
                                className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800 transition-colors"
                            >
                                S'inscrire
                            </button>
                        </form>
                        {subscribed && (
                            <p className="mt-2 text-xs text-green-600 dark:text-green-400 animate-fade-in">Merci pour votre inscription !</p>
                        )}
                    </div>
                </div>

                <div className="border-t border-stone-200 dark:border-stone-800 pt-8 text-center text-sm text-stone-500 dark:text-stone-400">
                    <p>&copy; {new Date().getFullYear()} MMV Couture. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
