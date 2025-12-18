const Atelier = require('../models/Atelier');
const { buildAtelierResponse, replaceAtelierData } = require('../services/atelierSnapshot');

exports.getAtelierData = async (req, res) => {
    try {
        const atelier = await buildAtelierResponse(req.params.id);
        if (!atelier) return res.status(404).json({ message: 'Atelier non trouvé' });
        res.json(atelier);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateAtelierData = async (req, res) => {
    try {
        const ok = await replaceAtelierData(req.params.id, req.body);
        if (!ok) return res.status(404).json({ message: 'Atelier non trouvé' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la sauvegarde' });
    }
};
