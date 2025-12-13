
import React, { useState, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { SiteContent, PageBlock, BlockType } from '../types';
import { compressImage } from '../utils/image';
import { EditIcon, TrashIcon, MoveIcon, ChevronUpIcon, ChevronDownIcon } from './icons';
import ConfirmationDialog from './ConfirmationDialog';

// --- Block Editors ---

const HeroEditor: React.FC<{ block: any, onChange: (b: any) => void }> = ({ block, onChange }) => {
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = await compressImage(file, { maxWidth: 1920, quality: 0.8 });
            onChange({ ...block, imageUrl });
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Titre</label>
                <input type="text" value={block.title} onChange={e => onChange({ ...block, title: e.target.value })} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm font-medium">Sous-titre</label>
                <textarea value={block.subtitle} onChange={e => onChange({ ...block, subtitle: e.target.value })} className="w-full p-2 border rounded" rows={2} />
            </div>
            <div>
                <label className="block text-sm font-medium">Image de fond</label>
                <input type="file" onChange={handleImageChange} className="mt-1" />
                {block.imageUrl && <img src={block.imageUrl} className="h-20 w-auto mt-2 rounded" alt="Preview" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Texte Bouton</label>
                    <input type="text" value={block.buttonText} onChange={e => onChange({ ...block, buttonText: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Lien Bouton</label>
                    <select value={block.buttonLink} onChange={e => onChange({ ...block, buttonLink: e.target.value })} className="w-full p-2 border rounded">
                        <option value="register">Inscription</option>
                        <option value="login">Connexion</option>
                        <option value="showroom">Showroom</option>
                        <option value="about">À propos</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const FeaturesEditor: React.FC<{ block: any, onChange: (b: any) => void }> = ({ block, onChange }) => {
    const updateFeature = (index: number, field: string, value: string) => {
        const newFeatures = [...block.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        onChange({ ...block, features: newFeatures });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Titre Section</label>
                <input type="text" value={block.title} onChange={e => onChange({ ...block, title: e.target.value })} className="w-full p-2 border rounded" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium">Fonctionnalités</label>
                {block.features.map((feature: any, idx: number) => (
                    <div key={feature.id} className="border p-3 rounded bg-stone-50">
                        <input type="text" value={feature.title} onChange={e => updateFeature(idx, 'title', e.target.value)} className="w-full p-1 mb-1 border rounded text-sm font-bold" placeholder="Titre" />
                        <textarea value={feature.description} onChange={e => updateFeature(idx, 'description', e.target.value)} className="w-full p-1 border rounded text-sm" placeholder="Description" rows={2} />
                        <select value={feature.icon} onChange={e => updateFeature(idx, 'icon', e.target.value)} className="w-full p-1 mt-1 border rounded text-sm">
                            <option value="star">Étoile</option>
                            <option value="users">Utilisateurs</option>
                            <option value="scissors">Ciseaux</option>
                            <option value="chart">Graphique</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ContentEditor: React.FC<{ block: any, onChange: (b: any) => void }> = ({ block, onChange }) => {
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = await compressImage(file, { maxWidth: 800, quality: 0.8 });
            onChange({ ...block, imageUrl });
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Titre</label>
                <input type="text" value={block.title} onChange={e => onChange({ ...block, title: e.target.value })} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm font-medium">Texte</label>
                <textarea value={block.text} onChange={e => onChange({ ...block, text: e.target.value })} className="w-full p-2 border rounded" rows={4} />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium">Image</label>
                    <input type="file" onChange={handleImageChange} className="mt-1" />
                    {block.imageUrl && <img src={block.imageUrl} className="h-20 w-auto mt-2 rounded" alt="Preview" />}
                </div>
                <div>
                    <label className="block text-sm font-medium">Disposition</label>
                    <select value={block.layout} onChange={e => onChange({ ...block, layout: e.target.value })} className="mt-1 p-2 border rounded">
                        <option value="image-left">Image à Gauche</option>
                        <option value="image-right">Image à Droite</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const StatsEditor: React.FC<{ block: any, onChange: (b: any) => void }> = ({ block, onChange }) => {
    const updateStat = (index: number, field: string, value: string) => {
        const newStats = [...block.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        onChange({ ...block, stats: newStats });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Couleur de fond</label>
                <select value={block.backgroundColor} onChange={e => onChange({ ...block, backgroundColor: e.target.value })} className="w-full p-2 border rounded">
                    <option value="white">Blanc</option>
                    <option value="orange">Orange</option>
                    <option value="dark">Sombre</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium">Chiffres</label>
                <div className="grid grid-cols-3 gap-2">
                    {block.stats.map((stat: any, idx: number) => (
                        <div key={stat.id} className="border p-2 rounded bg-stone-50">
                            <input type="text" value={stat.value} onChange={e => updateStat(idx, 'value', e.target.value)} className="w-full p-1 mb-1 border rounded text-sm font-bold" placeholder="Valeur (ex: 100+)" />
                            <input type="text" value={stat.label} onChange={e => updateStat(idx, 'label', e.target.value)} className="w-full p-1 border rounded text-xs" placeholder="Label" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CTAEditor: React.FC<{ block: any, onChange: (b: any) => void }> = ({ block, onChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Titre</label>
                <input type="text" value={block.title} onChange={e => onChange({ ...block, title: e.target.value })} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm font-medium">Sous-titre</label>
                <textarea value={block.subtitle} onChange={e => onChange({ ...block, subtitle: e.target.value })} className="w-full p-2 border rounded" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Texte Bouton</label>
                    <input type="text" value={block.buttonText} onChange={e => onChange({ ...block, buttonText: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Lien Bouton</label>
                    <select value={block.buttonLink} onChange={e => onChange({ ...block, buttonLink: e.target.value })} className="w-full p-2 border rounded">
                        <option value="register">Inscription</option>
                        <option value="login">Connexion</option>
                        <option value="showroom">Showroom</option>
                    </select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium">Couleur de fond</label>
                <select value={block.backgroundColor} onChange={e => onChange({ ...block, backgroundColor: e.target.value })} className="w-full p-2 border rounded">
                    <option value="white">Blanc</option>
                    <option value="orange">Orange</option>
                    <option value="dark">Sombre</option>
                </select>
            </div>
        </div>
    );
};

// --- Main Component ---

const SiteCustomization: React.FC = () => {
    const { getSiteContent, updateSiteContent } = useAuth();
    
    // Initialize content, ensuring blocks array exists even if missing in legacy data
    const [content, setContent] = useState<SiteContent>(() => {
        const c = getSiteContent();
        return { ...c, blocks: c.blocks || [] };
    });
    
    const [isSaving, setIsSaving] = useState(false);
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
    const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);

    const handleSave = () => {
        setIsSaving(true);
        updateSiteContent(content);
        setTimeout(() => setIsSaving(false), 1000);
    };

    const addBlock = (type: BlockType) => {
        let newBlock: PageBlock;
        const id = crypto.randomUUID();

        switch (type) {
            case 'hero':
                newBlock = { id, type: 'hero', title: 'Nouveau Héros', subtitle: 'Sous-titre ici', imageUrl: 'https://placehold.co/1920x1080', backgroundPosition: 'center', buttonText: 'Action', buttonLink: 'register' };
                break;
            case 'features':
                newBlock = { id, type: 'features', title: 'Nos Services', features: [{ id: 'f1', title: 'Service 1', description: 'Description', icon: 'star' }, { id: 'f2', title: 'Service 2', description: 'Description', icon: 'users' }, { id: 'f3', title: 'Service 3', description: 'Description', icon: 'scissors' }] };
                break;
            case 'stats':
                newBlock = { id, type: 'stats', backgroundColor: 'white', stats: [{ id: 's1', value: '100', label: 'Stat 1' }, { id: 's2', value: '200', label: 'Stat 2' }, { id: 's3', value: '300', label: 'Stat 3' }] };
                break;
            case 'cta':
                newBlock = { id, type: 'cta', title: 'Appel à l\'action', subtitle: 'Incitation', buttonText: 'Cliquez ici', buttonLink: 'register', backgroundColor: 'orange' };
                break;
            case 'content':
                newBlock = { id, type: 'content', title: 'Titre section', text: 'Contenu texte...', imageUrl: 'https://placehold.co/800x800', layout: 'image-left' };
                break;
            default: return;
        }

        setContent(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
        setEditingBlockId(id);
    };

    const updateBlock = (updatedBlock: PageBlock) => {
        setContent(prev => ({
            ...prev,
            blocks: prev.blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
        }));
    };

    const deleteBlock = () => {
        if (deletingBlockId) {
            setContent(prev => ({
                ...prev,
                blocks: prev.blocks.filter(b => b.id !== deletingBlockId)
            }));
            setDeletingBlockId(null);
            if (editingBlockId === deletingBlockId) setEditingBlockId(null);
        }
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...content.blocks];
        if (direction === 'up' && index > 0) {
            [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        } else if (direction === 'down' && index < newBlocks.length - 1) {
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        }
        setContent(prev => ({ ...prev, blocks: newBlocks }));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center sticky top-0 bg-stone-50 dark:bg-stone-900 z-10 py-4 border-b border-stone-200 dark:border-stone-700">
                <h2 className="text-2xl font-bold">Constructeur de Page d'Accueil</h2>
                <button
                    onClick={handleSave}
                    className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${isSaving ? 'bg-green-600' : 'bg-orange-900 hover:bg-orange-800'}`}
                >
                    {isSaving ? 'Enregistré !' : 'Publier les changements'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Block List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-stone-800 p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-4">Structure de la page</h3>
                        <div className="space-y-2">
                            {content.blocks.map((block, index) => (
                                <div 
                                    key={block.id} 
                                    className={`flex items-center justify-between p-3 rounded-md border transition-colors cursor-pointer ${editingBlockId === block.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'}`}
                                    onClick={() => setEditingBlockId(block.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold uppercase bg-stone-200 dark:bg-stone-600 px-2 py-0.5 rounded">{block.type}</span>
                                        <span className="text-sm truncate max-w-[120px] font-medium">{'title' in block ? block.title : 'Section'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }} disabled={index === 0} className="p-1 hover:bg-stone-200 rounded disabled:opacity-30"><ChevronUpIcon className="w-4 h-4" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }} disabled={index === content.blocks.length - 1} className="p-1 hover:bg-stone-200 rounded disabled:opacity-30"><ChevronDownIcon className="w-4 h-4" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); setDeletingBlockId(block.id); }} className="p-1 text-red-500 hover:bg-red-100 rounded"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700">
                            <label className="block text-sm font-medium mb-2">Ajouter une section</label>
                            <select 
                                onChange={(e) => {
                                    if(e.target.value) {
                                        addBlock(e.target.value as BlockType);
                                        e.target.value = "";
                                    }
                                }}
                                className="w-full p-2 border rounded-md bg-stone-50 dark:bg-stone-700 cursor-pointer hover:bg-stone-100"
                            >
                                <option value="">+ Choisir un type de bloc</option>
                                <option value="hero">Héros (Bannière)</option>
                                <option value="features">Services / Fonctionnalités</option>
                                <option value="content">Contenu (Texte + Image)</option>
                                <option value="stats">Statistiques</option>
                                <option value="cta">Appel à l'action (CTA)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Right: Editor */}
                <div className="lg:col-span-2">
                    {editingBlockId ? (
                        <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold mb-6 pb-4 border-b border-stone-200 dark:border-stone-700">
                                Éditer : {content.blocks.find(b => b.id === editingBlockId)?.type.toUpperCase()}
                            </h3>
                            {(() => {
                                const block = content.blocks.find(b => b.id === editingBlockId);
                                if (!block) return <p>Bloc non trouvé.</p>;
                                
                                switch (block.type) {
                                    case 'hero': return <HeroEditor block={block} onChange={updateBlock} />;
                                    case 'features': return <FeaturesEditor block={block} onChange={updateBlock} />;
                                    case 'content': return <ContentEditor block={block} onChange={updateBlock} />;
                                    case 'stats': return <StatsEditor block={block} onChange={updateBlock} />;
                                    case 'cta': return <CTAEditor block={block} onChange={updateBlock} />;
                                    default: return <p>Éditeur non disponible pour ce type.</p>;
                                }
                            })()}
                        </div>
                    ) : (
                        <div className="bg-stone-100 dark:bg-stone-800/50 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg p-12 text-center text-stone-500">
                            <p>Sélectionnez un bloc à gauche pour le modifier ou ajoutez-en un nouveau.</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationDialog 
                isOpen={!!deletingBlockId} 
                onClose={() => setDeletingBlockId(null)} 
                onConfirm={deleteBlock} 
                title="Supprimer la section" 
                message="Êtes-vous sûr de vouloir supprimer cette section de la page d'accueil ?" 
            />
        </div>
    );
};

export default SiteCustomization;
