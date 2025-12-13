
import React, { useState, useMemo } from 'react';
import type { Client, Modele } from '../types';
import { PatternIcon } from '../components/icons';

// --- Fonctions de génération de patron (Pure SVG Math) ---
const mmToPx = (mm: number) => mm * 3.7795275591; // 96dpi
const cmToPx = (cm: number) => mmToPx(cm * 10);

const generateSkirtPatternSVG = (
    measurements: { hips: number; length: number },
    options: { ease: number; seam: number }
): string => {
    const { hips, length } = measurements;
    const { ease, seam } = options;

    if (!hips || !length) {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><text x="20" y="40" fill="red" font-family="sans-serif">Erreur: Mesures requises (hanches, longueur) manquantes.</text></svg>`;
    }

    // Calculs de base
    const totalHips = hips + ease;
    const quarterHips = totalHips / 4;
    
    // Dimensions en pixels
    const widthPx = cmToPx(quarterHips);
    const heightPx = cmToPx(length);
    const seamPx = mmToPx(seam);
    const pad = 40;

    const totalW = widthPx + (seamPx * 2) + (pad * 2);
    const totalH = heightPx + (seamPx * 2) + (pad * 2);

    // Coordonnées de la pièce finie (sans marge)
    const x1 = pad + seamPx;
    const y1 = pad + seamPx;
    const x2 = x1 + widthPx;
    const y2 = y1 + heightPx;

    // Coordonnées de la marge de couture
    const mx1 = pad;
    const my1 = pad;
    const mx2 = x2 + seamPx;
    const my2 = y2 + seamPx;

    // Pinces (Dart) simulation - Simple approximation for visual
    const dartCenter = x1 + (widthPx / 2);
    const dartDepth = cmToPx(10); // 10cm dart
    const dartWidth = cmToPx(2); // 2cm dart width

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" style="background:white;">`;
    
    // Grille de fond (optionnelle)
    svg += `<defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="#eee" stroke-width="1"/></pattern></defs>`;
    svg += `<rect width="100%" height="100%" fill="url(#grid)" />`;

    // Ligne de coupe (Extérieur - Marge)
    svg += `<path d="M ${mx1} ${my1} L ${mx2} ${my1} L ${mx2} ${my2} L ${mx1} ${my2} Z" fill="#f9fafb" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,5"/>`;

    // Ligne de couture (Intérieur)
    svg += `<path d="M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2} L ${x1} ${y2} Z" fill="none" stroke="#1c1917" stroke-width="2"/>`;

    // Pince (Dart)
    svg += `<path d="M ${dartCenter - dartWidth/2} ${y1} L ${dartCenter} ${y1 + dartDepth} L ${dartCenter + dartWidth/2} ${y1}" fill="none" stroke="#1c1917" stroke-width="1"/>`;

    // Annotations
    svg += `<text x="${x1 + 10}" y="${y1 + heightPx/2}" font-family="sans-serif" font-size="14" fill="#444">Jupe Base (1/4)</text>`;
    svg += `<text x="${x1 + 10}" y="${y1 + heightPx/2 + 20}" font-family="sans-serif" font-size="12" fill="#666">Hanches: ${hips}cm + ${ease}cm</text>`;
    svg += `<text x="${x1 + 10}" y="${y1 + heightPx/2 + 40}" font-family="sans-serif" font-size="12" fill="#666">Longueur: ${length}cm</text>`;
    
    // Repères (Notches)
    svg += `<line x1="${x1}" y1="${y1 + 10}" x2="${mx1}" y2="${y1 + 10}" stroke="black" stroke-width="2"/>`; // Taille coté
    
    // Droit fil
    const dfX = totalW - pad - 50;
    const dfY1 = totalH / 2 - 50;
    const dfY2 = totalH / 2 + 50;
    svg += `<line x1="${dfX}" y1="${dfY1}" x2="${dfX}" y2="${dfY2}" stroke="black" stroke-width="1" marker-end="url(#arrow)" marker-start="url(#arrow)"/>`;
    svg += `<text x="${dfX - 5}" y="${dfY1 + 50}" font-family="sans-serif" font-size="10" transform="rotate(-90 ${dfX},${dfY1+50})">Droit Fil</text>`;

    svg += '</svg>';
    return svg;
};

// --- Composant Principal ---
interface StudioProps {
    clients: Client[];
    models: Modele[];
}

const Studio: React.FC<StudioProps> = ({ clients, models }) => {
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [selectedModelId, setSelectedModelId] = useState<string>('');
    const [ease, setEase] = useState<number>(2); // Reduced ease default
    const [seamAllowance, setSeamAllowance] = useState<number>(15); // Standard 1.5cm
    const [svgContent, setSvgContent] = useState<string | null>(null);

    const selectedClient = useMemo(() => clients.find(c => c.id === selectedClientId), [clients, selectedClientId]);
    const selectedModel = useMemo(() => models.find(m => m.id === selectedModelId), [models, selectedModelId]);
    
    const handleGenerate = () => {
        if (!selectedClient || !selectedModel) return;
        
        // MVP: Logique simple pour déterminer quel générateur utiliser
        // Pour la démo, on utilise le générateur de jupe pour tout ce qui contient "jupe" ou par défaut
        // Dans une version complète, il faudrait un mapping modèle -> type de patron
        
        const isSkirt = selectedModel.title.toLowerCase().includes('jupe') || selectedModel.category?.toLowerCase() === 'bas';
        
        if (true) { // Force generation for demo purposes, logic allows expansion
            const hips = selectedClient.measurements.tour_de_bassin || 90; // Default fallback
            const length = selectedClient.measurements.longueur_jupe || selectedClient.measurements.longueur_de_robe || 60;

            const measurements = { hips, length };
            const options = { ease, seam: seamAllowance };
            
            const svg = generateSkirtPatternSVG(measurements, options);
            setSvgContent(svg);
        }
    };
    
    const handleExportSVG = () => {
        if (!svgContent) return;
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patron_${selectedModel?.title.replace(/\s/g, '_')}_${selectedClient?.name.replace(/\s/g, '_')}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handlePrintPDF = () => {
        if (!svgContent) return;
        // Open SVG in new window for clean printing
        const printWindow = window.open('', '_blank');
        if(printWindow) {
            printWindow.document.write(`
                <html>
                    <head><title>Impression Patron</title></head>
                    <body style="margin:0; display:flex; justify-content:center; align-items:center;">
                        ${svgContent}
                        <script>window.onload = () => { window.print(); }</script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- PANNEAU DE CONTRÔLE --- */}
            <div className="lg:col-span-1 bg-white dark:bg-stone-800/50 p-6 rounded-lg shadow-sm flex flex-col gap-6 no-print">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Studio Patronnage</h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-1">Générez des patrons sur mesure basés sur les mensurations clients.</p>
                </div>

                {/* Section de Sélection */}
                <div className="space-y-4">
                     <div>
                        <label htmlFor="client-select" className="block text-sm font-medium text-stone-700 dark:text-stone-300">1. Choisir un client</label>
                        <select id="client-select" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                            <option value="" disabled>Sélectionner...</option>
                            {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="model-select" className="block text-sm font-medium text-stone-700 dark:text-stone-300">2. Choisir un modèle</label>
                        <select id="model-select" value={selectedModelId} onChange={e => setSelectedModelId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                           <option value="" disabled>Sélectionner...</option>
                            {models.map(model => <option key={model.id} value={model.id}>{model.title}</option>)}
                        </select>
                    </div>
                </div>

                {/* Section des Paramètres */}
                <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                    <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">Paramètres Techniques</h3>
                    <div>
                        <label htmlFor="ease" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Aisance (cm)</label>
                        <input type="number" id="ease" value={ease} onChange={e => setEase(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"/>
                        <p className="text-xs text-stone-500 mt-1">Ajouté au tour de bassin.</p>
                    </div>
                     <div>
                        <label htmlFor="seam" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Marge de couture (mm)</label>
                        <input type="number" id="seam" value={seamAllowance} onChange={e => setSeamAllowance(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"/>
                    </div>
                </div>
                
                <button 
                    onClick={handleGenerate} 
                    disabled={!selectedClientId || !selectedModelId}
                    className="w-full px-5 py-3 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 disabled:bg-stone-400 disabled:cursor-not-allowed transition-all shadow-md transform active:scale-95"
                >
                    Générer le patron
                </button>
                
                 {/* Section d'Export */}
                <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-700">
                     <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">Exporter</h3>
                     <div className="flex gap-4">
                        <button onClick={handleExportSVG} disabled={!svgContent} className="flex-1 px-4 py-2 text-sm font-medium text-orange-900 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50 rounded-md hover:bg-orange-200 dark:hover:bg-orange-900/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Export SVG</button>
                        <button onClick={handlePrintPDF} disabled={!svgContent} className="flex-1 px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-200 dark:bg-stone-700 rounded-md hover:bg-stone-300 dark:hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Imprimer</button>
                     </div>
                </div>
            </div>

            {/* --- ZONE DE PRÉVISUALISATION --- */}
            <div className="lg:col-span-2 bg-stone-200 dark:bg-stone-900/50 rounded-lg shadow-inner flex items-center justify-center p-8 print-area border-2 border-dashed border-stone-300 dark:border-stone-700 overflow-auto">
                {svgContent ? (
                    <div className="w-full h-full flex items-center justify-center animate-fade-in" dangerouslySetInnerHTML={{ __html: svgContent }} />
                ) : (
                    <div className="text-center text-stone-500">
                        <PatternIcon className="w-20 h-20 mx-auto text-stone-300 dark:text-stone-600 mb-4" />
                        <p className="text-lg font-semibold">Votre espace de travail est vide</p>
                        <p className="text-sm mt-2">Sélectionnez un client et un modèle à gauche pour générer un patron vectoriel.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Studio;
