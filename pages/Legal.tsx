
import React from 'react';

const Legal: React.FC = () => {
    return (
        <div className="bg-white dark:bg-stone-800/50 p-8 rounded-lg shadow-sm max-w-4xl mx-auto space-y-12">
            <section>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-6">Conditions Générales d'Utilisation (CGU)</h1>
                <div className="space-y-4 text-stone-600 dark:text-stone-300">
                    <p><strong>1. Introduction</strong><br/>Bienvenue sur MMV Couture. En utilisant notre application, vous acceptez les présentes conditions générales d'utilisation. Veuillez les lire attentivement.</p>
                    <p><strong>2. Services</strong><br/>MMV Couture fournit une plateforme de gestion pour les ateliers de couture, incluant la gestion des clients, des commandes, et un catalogue de modèles.</p>
                    <p><strong>3. Responsabilités</strong><br/>L'utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toutes les activités effectuées sous son compte.</p>
                    <p><strong>4. Propriété Intellectuelle</strong><br/>Tout le contenu généré par l'utilisateur (photos de modèles) reste la propriété de l'utilisateur. La structure de l'application est la propriété de MMV Couture.</p>
                </div>
            </section>

            <section>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-6">Politique de Confidentialité</h1>
                <div className="space-y-4 text-stone-600 dark:text-stone-300">
                    <p><strong>1. Collecte des Données</strong><br/>Nous collectons les informations nécessaires au fonctionnement de l'atelier : noms des clients, mesures, numéros de téléphone.</p>
                    <p><strong>2. Utilisation des Données</strong><br/>Les données sont utilisées uniquement pour permettre la gestion de votre atelier. Nous ne vendons pas vos données à des tiers.</p>
                    <p><strong>3. Sécurité</strong><br/>Nous mettons en œuvre des mesures de sécurité pour protéger vos données contre l'accès non autorisé.</p>
                    <p><strong>4. Vos Droits</strong><br/>Vous disposez d'un droit d'accès, de modification et de suppression de vos données. Contactez-nous pour exercer ces droits.</p>
                </div>
            </section>
        </div>
    );
};

export default Legal;
