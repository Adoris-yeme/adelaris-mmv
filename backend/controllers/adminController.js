
const Atelier = require('../models/Atelier');
const User = require('../models/User');
const Modele = require('../models/Modele');
const { buildAtelierData } = require('../services/atelierSnapshot');

const findModel = async (modelId) => {
    const model = await Modele.findOne({ id: modelId });
    if (!model) return null;
    return model;
};

exports.getAteliersWithManager = async (req, res) => {
    try {
        const ateliers = await Atelier.find({}).sort({ createdAt: -1 });
        const managerIds = ateliers.map(a => a.managerId);
        const users = await User.find({ id: { $in: managerIds } }, { id: 1, email: 1 });
        const emailById = new Map(users.map(u => [u.id, u.email]));

        const result = await Promise.all(ateliers.map(async (a) => {
            const data = await buildAtelierData(a.id);
            return {
                id: a.id,
                name: a.name,
                managerId: a.managerId,
                managerEmail: emailById.get(a.managerId) || 'N/A',
                subscription: a.subscription,
                data,
                createdAt: a.createdAt
            };
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.updateSubscription = async (req, res) => {
    try {
        const { atelierId } = req.params;
        const { status, durationInMonths, plan } = req.body;

        const atelier = await Atelier.findOne({ id: atelierId });
        if (!atelier) return res.status(404).json({ message: 'Atelier non trouvé' });

        if (status) atelier.subscription.status = status;
        if (plan) atelier.subscription.plan = plan;

        if (durationInMonths) {
            const currentExpiry = atelier.subscription.expiresAt ? new Date(atelier.subscription.expiresAt) : new Date();
            const base = new Date(Math.max(currentExpiry.getTime(), new Date().getTime()));
            base.setMonth(base.getMonth() + Number(durationInMonths));
            atelier.subscription.expiresAt = base;
        }

        await atelier.save();
        res.json(atelier.subscription);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.getPendingShowcaseModels = async (req, res) => {
    try {
        const pending = await Modele.find({ showcaseStatus: 'pending' }).sort({ createdAt: -1 });
        res.json(pending);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.updateShowcaseStatus = async (req, res) => {
    try {
        const { modelId } = req.params;
        const { status } = req.body;

        if (!status) return res.status(400).json({ message: 'Status manquant' });

        const model = await findModel(modelId);
        if (!model) return res.status(404).json({ message: 'Modèle introuvable' });

        model.showcaseStatus = status;
        await model.save();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};
