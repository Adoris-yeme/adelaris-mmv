
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { Page, AtelierType, Specialization, SubscriptionPlan } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/icons';

interface RegisterProps {
    onNavigate: (page: Page) => void;
}

const steps = [
    { id: 1, title: 'Compte', desc: 'Vos identifiants' },
    { id: 2, title: 'Identité', desc: 'Votre atelier' },
    { id: 3, title: 'Abonnement', desc: 'Plan unique' },
    { id: 4, title: 'Finitions', desc: 'Configuration' }
];

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [atelierName, setAtelierName] = useState('');
    const [atelierType, setAtelierType] = useState<AtelierType>('Atelier Couture');
    const [specialization, setSpecialization] = useState<Specialization>('Dame');
    const [employeeCount, setEmployeeCount] = useState<number>(0);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('trial'); // Default to trial
    const [withDemoData, setWithDemoData] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { register, googleLogin } = useAuth();
    const googleButtonRef = useRef<HTMLDivElement | null>(null);
    const googleInitializedRef = useRef(false);
    const atelierNameRef = useRef('');
    const atelierTypeRef = useRef<AtelierType>('Atelier Couture');
    const specializationRef = useRef<Specialization>('Dame');
    const employeeCountRef = useRef<number>(0);

    useEffect(() => {
        atelierNameRef.current = atelierName;
        atelierTypeRef.current = atelierType;
        specializationRef.current = specialization;
        employeeCountRef.current = employeeCount;
    }, [atelierName, atelierType, specialization, employeeCount]);

    useEffect(() => {
        if (step !== 1) return;

        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
        const googleObj = (window as any).google;

        if (!clientId || !googleObj?.accounts?.id || !googleButtonRef.current) return;

        if (googleInitializedRef.current) return;
        googleInitializedRef.current = true;

        googleObj.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: { credential?: string }) => {
                if (!response?.credential) {
                    setError("Inscription Google impossible.");
                    return;
                }

                setIsLoading(true);
                setError('');
                const success = await googleLogin(response.credential, {
                    atelierName: atelierNameRef.current,
                    atelierType: atelierTypeRef.current,
                    specialization: specializationRef.current,
                    employeeCount: employeeCountRef.current
                });
                setIsLoading(false);
                if (!success) setError("Inscription Google impossible.");
            }
        });

        googleObj.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '360'
        });
    }, [googleLogin, step]);

    const handleNext = () => {
        if (step === 1) {
            if (!email || !password) {
                setError('Veuillez remplir tous les champs.');
                return;
            }
            if (password.length < 6) {
                setError('Le mot de passe doit contenir au moins 6 caractères.');
                return;
            }
        }
        if (step === 2) {
            if (!atelierName) {
                setError('Le nom de l\'atelier est requis.');
                return;
            }
        }
        setError('');
        setStep(prev => prev + 1);
    };

    const handlePrev = () => {
        setError('');
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 4) {
            handleNext();
            return;
        }
        setError('');
        setIsLoading(true);
        const success = await register(atelierName, email, password, withDemoData, atelierType, specialization, employeeCount, selectedPlan);
        setIsLoading(false);
        if (!success) setError('Un utilisateur avec cet email existe déjà.');
        // On success, AuthProvider redirects
    };

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (step < 4) {
                handleNext();
            } else {
                // Manually trigger submit for the last step
                const event = new Event('submit', { cancelable: true });
                // We just call the logic directly since creating synthetic events is messy here
                setIsLoading(true);
                const success = await register(atelierName, email, password, withDemoData, atelierType, specialization, employeeCount, selectedPlan);
                setIsLoading(false);
                if (!success) setError('Un utilisateur avec cet email existe déjà.');
            }
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-900 p-4">
            <div className="max-w-4xl w-full bg-white dark:bg-stone-800 p-8 rounded-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Back to Login Button */}
                <button 
                    onClick={() => onNavigate('login')}
                    className="absolute top-6 left-6 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors flex items-center gap-1"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Connexion</span>
                </button>

                <h2 className="text-3xl font-bold text-center text-stone-800 dark:text-stone-100 mt-4 mb-2">Création de l'Atelier</h2>
                <p className="text-center text-stone-500 dark:text-stone-400 mb-8">Rejoignez MMV Couture en quelques étapes.</p>

                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-8 relative px-4 sm:px-12">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 dark:bg-stone-700 -z-10 rounded-full mx-4 sm:mx-12"></div>
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-orange-500 -z-10 rounded-full transition-all duration-300 mx-4 sm:mx-12" 
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center bg-white dark:bg-stone-800 z-10 px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${step >= s.id ? 'bg-orange-900 border-orange-900 text-white' : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 text-stone-400'}`}>
                                {s.id}
                            </div>
                            <span className={`text-xs mt-2 font-medium hidden sm:block ${step >= s.id ? 'text-orange-900 dark:text-orange-400' : 'text-stone-400'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between overflow-y-auto px-4" onKeyDown={handleKeyDown}>
                    {/* Step 1: Account */}
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in max-w-md mx-auto w-full">
                            <div className="flex flex-col items-center">
                                <div ref={googleButtonRef} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email Manager</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="exemple@atelier.com"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="text-xs text-stone-500 text-center">Appuyez sur Entrée pour continuer</p>
                        </div>
                    )}

                    {/* Step 2: Identity */}
                    {step === 2 && (
                        <div className="space-y-4 animate-fade-in max-w-lg mx-auto w-full">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nom de l'atelier</label>
                                <input
                                    type="text"
                                    value={atelierName}
                                    onChange={(e) => setAtelierName(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="Ex: Atelier Élégance"
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Type de structure</label>
                                    <select 
                                        value={atelierType}
                                        onChange={(e) => setAtelierType(e.target.value as AtelierType)}
                                        className="w-full px-3 py-3 bg-stone-50 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="Atelier Couture">Atelier Couture</option>
                                        <option value="Boutique / Showroom">Boutique / Showroom</option>
                                        <option value="Grande Entreprise / Usine">Grande Entreprise / Usine</option>
                                        <option value="Indépendant (Domicile)">Indépendant (Domicile)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nombre d'apprentis / Employés</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={employeeCount}
                                        onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-3 bg-stone-50 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Spécialité principale</label>
                                <select 
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value as Specialization)}
                                    className="w-full px-3 py-3 bg-stone-50 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                >
                                    <option>Dame</option>
                                    <option>Homme</option>
                                    <option>Enfant</option>
                                    <option>Mixte</option>
                                    <option>Broderie</option>
                                    <option>Accessoires</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Subscription */}
                    {step === 3 && (
                        <div className="animate-fade-in w-full overflow-y-auto flex flex-col items-center">
                            <h3 className="text-xl font-bold text-center text-stone-800 dark:text-stone-100 mb-6">Offre de Lancement</h3>
                            
                            <div className="bg-white dark:bg-stone-800 border-2 border-orange-500 rounded-xl p-8 shadow-lg max-w-md w-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">OFFRE UNIQUE</div>
                                <div className="text-center mb-6">
                                    <h4 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Premium Illimité</h4>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <p className="text-4xl font-extrabold text-orange-600 dark:text-orange-400">5.000 FCFA</p>
                                        <span className="text-sm text-stone-500 self-end mb-1">/ mois</span>
                                    </div>
                                    <p className="text-sm text-green-600 font-bold mt-2">1er mois d'essai GRATUIT (Accès complet)</p>
                                </div>
                                <ul className="space-y-3 text-stone-600 dark:text-stone-300 mb-8">
                                    <li className="flex items-center"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-xs">✓</span> Clients Illimités</li>
                                    <li className="flex items-center"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-xs">✓</span> Commandes Illimitées</li>
                                    <li className="flex items-center"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-xs">✓</span> Postes de Travail Illimités</li>
                                    <li className="flex items-center"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-xs">✓</span> Notifications WhatsApp</li>
                                    <li className="flex items-center"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-xs">✓</span> Statistiques Financières</li>
                                </ul>
                                <p className="text-xs text-center text-stone-400 italic">
                                    Après le 1er mois, si non renouvelé, l'accès sera restreint.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Options */}
                    {step === 4 && (
                        <div className="space-y-6 animate-fade-in text-center max-w-lg mx-auto w-full">
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-100 dark:border-orange-900/30">
                                <h3 className="font-bold text-lg text-orange-900 dark:text-orange-300 mb-2">Dernière étape !</h3>
                                <p className="text-sm text-stone-600 dark:text-stone-300 mb-4">
                                    Souhaitez-vous installer des données de démonstration pour tester l'application immédiatement ?
                                </p>
                                <label className="flex items-center justify-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={withDemoData}
                                        onChange={(e) => setWithDemoData(e.target.checked)}
                                        className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                                    />
                                    <span className="font-medium text-stone-800 dark:text-stone-200">Oui, installer les données de démo</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        
                        <div className="flex justify-between items-center">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="px-4 py-2 rounded-lg text-stone-600 dark:text-stone-300 font-medium hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center gap-1"
                                >
                                    <ChevronLeftIcon className="w-4 h-4" /> Précédent
                                </button>
                            ) : (
                                <div></div> // Spacer
                            )}

                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2.5 rounded-lg bg-stone-800 dark:bg-stone-700 text-white font-medium hover:bg-stone-900 dark:hover:bg-stone-600 transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    Suivant <ChevronRightIcon className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-700 to-orange-900 text-white font-bold hover:from-orange-800 hover:to-orange-950 shadow-lg transform hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-60"
                                >
                                    Créer mon Atelier
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Register;
