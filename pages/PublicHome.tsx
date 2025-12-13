
import React from 'react';
import type { Page, HomepageSegment, HomepageStat, PageBlock, HeroBlock, ContentBlock, FeaturesBlock, StatsBlock, CTABlock } from '../types';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { StarIcon, ClientsIcon, PatternIcon, DashboardIcon } from '../components/icons';

interface PublicHomeProps {
    onNavigate: (page: Page) => void;
}

const StatBlock: React.FC<{ stats: HomepageStat[] }> = ({ stats }) => {
    const { t } = useLanguage();
    return (
        <div className="py-12 bg-white dark:bg-stone-800 rounded-xl shadow-lg mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-200 dark:divide-stone-700">
                {stats.map(stat => (
                    <div key={stat.id} className="p-4">
                        <p className="text-4xl md:text-5xl font-extrabold mb-2 text-orange-900 dark:text-orange-400">{stat.value}</p>
                        <p className="text-sm uppercase tracking-widest opacity-80 text-stone-600 dark:text-stone-300">
                            {stat.label === 'Sécurisé' ? t('stats.secure') : 
                             stat.label === 'Disponible' ? t('stats.available') :
                             stat.label === 'Créativité' ? t('stats.creativity') : stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HeroSection: React.FC<{ block: HeroBlock, onNavigate: (page: Page) => void }> = ({ block, onNavigate }) => {
    const { t } = useLanguage();
    return (
        <div 
            className="min-h-[70vh] rounded-lg shadow-xl overflow-hidden bg-cover bg-no-repeat relative flex items-center justify-center p-8 md:p-16 mb-16"
            style={{ 
                backgroundImage: `url(${block.imageUrl})`, 
                backgroundPosition: block.backgroundPosition || 'center'
            }}
        >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 max-w-3xl text-white text-center animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    {block.title === '"MM-V" Multiple Model - Viewer' ? t('home.hero.title') : block.title}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-stone-200 leading-relaxed">
                    {block.subtitle.includes('La plateforme tout-en-un') ? t('home.hero.subtitle') : block.subtitle}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button 
                        onClick={() => onNavigate((block.buttonLink as Page) || 'register')} 
                        className="w-full sm:w-auto px-8 py-4 text-lg font-bold bg-orange-700 text-white rounded-lg shadow-lg hover:bg-orange-600 transition-transform hover:scale-105"
                    >
                        {block.buttonText === 'Créer mon atelier' ? t('btn.register') : block.buttonText}
                    </button>
                    {block.type === 'hero' && (
                         <button 
                            onClick={() => onNavigate('showroom')} 
                            className="w-full sm:w-auto px-8 py-4 text-lg font-bold bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            {t('home.cta.showroom')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const ContentSection: React.FC<{ block: ContentBlock }> = ({ block }) => (
    <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-24 ${block.layout === 'image-right' ? 'md:flex-row-reverse' : ''}`}>
        <div className="md:w-1/2">
            <img 
                src={block.imageUrl} 
                alt={block.title} 
                className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-square transform hover:scale-[1.02] transition-transform duration-500"
            />
        </div>
        <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-6">{block.title}</h2>
            <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
                {block.text}
            </p>
        </div>
    </div>
);

const FeaturesSection: React.FC<{ block: FeaturesBlock }> = ({ block }) => (
    <div className="mb-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-12">{block.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {block.features.map(feature => (
                <div key={feature.id} className="p-6 bg-white dark:bg-stone-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-900 dark:text-orange-400">
                        {feature.icon === 'star' && <StarIcon className="w-6 h-6" />}
                        {feature.icon === 'users' && <ClientsIcon className="w-6 h-6" />}
                        {feature.icon === 'scissors' && <PatternIcon className="w-6 h-6" />}
                        {feature.icon === 'chart' && <DashboardIcon className="w-6 h-6" />}
                        {!['star', 'users', 'scissors', 'chart'].includes(feature.icon) && <StarIcon className="w-6 h-6" />}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-stone-800 dark:text-stone-100">{feature.title}</h3>
                    <p className="text-stone-600 dark:text-stone-300">{feature.description}</p>
                </div>
            ))}
        </div>
    </div>
);

const StatsSection: React.FC<{ block: StatsBlock }> = ({ block }) => {
    const bgColor = block.backgroundColor === 'orange' ? 'bg-orange-900 text-white' : block.backgroundColor === 'dark' ? 'bg-stone-900 text-white' : 'bg-white text-stone-900 dark:bg-stone-800 dark:text-white';
    
    return (
        <div className={`py-16 rounded-2xl mb-24 shadow-lg ${bgColor}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
                {block.stats.map(stat => (
                    <div key={stat.id} className="p-4">
                        <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.value}</div>
                        <div className="text-lg opacity-80">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
};

const CTASection: React.FC<{ block: CTABlock, onNavigate: (page: Page) => void }> = ({ block, onNavigate }) => {
    const bgColor = block.backgroundColor === 'orange' ? 'bg-orange-900 dark:bg-stone-800 text-white' : block.backgroundColor === 'dark' ? 'bg-stone-900 text-white' : 'bg-white text-stone-900 shadow-xl';
    const textColor = block.backgroundColor === 'white' ? 'text-orange-900' : 'text-orange-100 dark:text-stone-300';
    
    return (
        <div className={`${bgColor} rounded-2xl p-12 text-center mb-16 shadow-2xl`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{block.title}</h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${textColor}`}>
                {block.subtitle}
            </p>
            <button 
                onClick={() => onNavigate((block.buttonLink as Page) || 'register')}
                className={`px-10 py-4 font-bold text-lg rounded-full shadow-lg transition-colors transform hover:-translate-y-1 ${block.backgroundColor === 'white' ? 'bg-orange-900 text-white hover:bg-orange-800' : 'bg-white text-orange-900 hover:bg-stone-100'}`}
            >
                {block.buttonText}
            </button>
        </div>
    )
}

const PublicHome: React.FC<PublicHomeProps> = ({ onNavigate }) => {
    const { getSiteContent } = useAuth();
    const { t } = useLanguage();
    const content = getSiteContent();
    const blocks = content.blocks || [];

    // Fallback logic for legacy data structure (Hero + Segments + Stats)
    if (blocks.length === 0) {
        return (
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Hero Section */}
                <HeroSection 
                    block={{
                        id: 'legacy-hero', 
                        type: 'hero', 
                        ...content.hero, 
                        buttonText: t('btn.register'), 
                        buttonLink: 'register'
                    }} 
                    onNavigate={onNavigate} 
                />

                {/* Content Segments and Stats Logic */}
                <div className="space-y-24 mb-24">
                    {/* 1. Render First Segment */}
                    {content.segments.length > 0 && (
                        <ContentSection block={{...content.segments[0], type: 'content'}} />
                    )}

                    {/* 2. Render Stats Block */}
                    {content.stats && content.stats.length > 0 && (
                        <StatBlock stats={content.stats} />
                    )}

                    {/* 3. Render Remaining Segments */}
                    {content.segments.slice(1).map((segment) => (
                        <ContentSection key={segment.id} block={{...segment, type: 'content'}} />
                    ))}
                </div>

                {/* CTA Section */}
                <div className="bg-orange-900 dark:bg-stone-800 rounded-2xl p-12 text-center text-white mb-16 shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.cta.main_title')}</h2>
                    <p className="text-lg text-orange-100 dark:text-stone-300 mb-8 max-w-2xl mx-auto">
                        {t('home.cta.main_text')}
                    </p>
                    <button 
                        onClick={() => onNavigate('register')}
                        className="px-10 py-4 bg-white text-orange-900 font-bold text-lg rounded-full shadow-lg hover:bg-stone-100 transition-colors transform hover:-translate-y-1"
                    >
                        {t('home.cta.start_free')}
                    </button>
                </div>
                <style>{`
                    @keyframes fade-in-up {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
                `}</style>
            </div>
        );
    }

    // New Blocks Logic
    return (
        <div className="container mx-auto px-4 max-w-7xl pt-8">
            {blocks.map(block => {
                switch(block.type) {
                    case 'hero': return <HeroSection key={block.id} block={block} onNavigate={onNavigate} />;
                    case 'content': return <ContentSection key={block.id} block={block} />;
                    case 'features': return <FeaturesSection key={block.id} block={block} />;
                    case 'stats': return <StatsSection key={block.id} block={block} />;
                    case 'cta': return <CTASection key={block.id} block={block} onNavigate={onNavigate} />;
                    default: return null;
                }
            })}
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default PublicHome;
