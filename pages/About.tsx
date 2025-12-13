import React from 'react';

const About: React.FC = () => {
    return (
        <div className="bg-white dark:bg-stone-800/50 p-8 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-6 text-center md:text-left">À propos de MMV Couture</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-4 text-stone-600 dark:text-stone-300">
                    <p>
                        MMV Couture est né d'une passion pour l'artisanat et d'une vision pour l'avenir de la mode. Nous croyons que chaque couturier, chaque styliste, mérite des outils modernes pour gérer son art et développer son activité.
                    </p>
                    <p>
                        Notre mission est de fournir une plateforme simple, intuitive et puissante qui centralise la gestion des clients, des commandes et des modèles, tout en offrant une vitrine exceptionnelle pour exposer le talent de nos artisans partenaires.
                    </p>
                    <p>
                        Nous sommes plus qu'un simple logiciel ; nous sommes une communauté dédiée à la promotion du savoir-faire et à la célébration de la créativité. Rejoignez-nous et transformons ensemble l'industrie de la couture.
                    </p>
                </div>
                <div>
                    <img 
                        src="https://images.unsplash.com/photo-1549298249-e24c0d0c5a2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
                        alt="Artisanat de couture"
                        className="rounded-lg shadow-lg w-full h-auto object-cover aspect-square"
                    />
                </div>
            </div>
        </div>
    );
};

export default About;
