
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Atelier = require('../models/Atelier');
const { buildAtelierResponse } = require('../services/atelierSnapshot');

const createInitialData = (atelierName, options = {}) => ({
    clients: [], models: [], appointments: [], orders: [], workstations: [], 
    fournitures: [], notifications: [], expenses: [],
    managerProfile: { 
        name: atelierName, 
        avatarUrl: 'https://placehold.co/100x100/e2e8f0/78350f?text=Atelier',
        atelierType: options.atelierType || 'Atelier Couture',
        specialization: options.specialization || 'Dame',
        employeeCount: options.employeeCount || 0
    }, 
    managerAccessCode: `CODE-${Math.floor(1000 + Math.random() * 9000)}`,
    modelOfTheMonthId: null, favoriteIds: [], isNew: true, tutoriels: []
});

exports.register = async (req, res) => {
    try {
        const { email, password, atelierName, atelierType, specialization, employeeCount } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé.' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const userId = 'user-' + Date.now();
        const atelierId = 'atelier-' + Date.now();
        const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 jours

        const initialData = createInitialData(atelierName, { atelierType, specialization, employeeCount });

        const user = await User.create({ id: userId, email, passwordHash, role: 'manager', atelierId });
        await Atelier.create({
            id: atelierId,
            name: atelierName,
            managerId: userId,
            subscription: { status: 'trial', plan: 'premium', expiresAt },
            managerProfile: initialData.managerProfile,
            managerAccessCode: initialData.managerAccessCode,
            modelOfTheMonthId: initialData.modelOfTheMonthId,
            favoriteIds: initialData.favoriteIds,
            isNew: initialData.isNew,
            data: initialData
        });

        const atelier = await buildAtelierResponse(atelierId);
        res.status(201).json({ user: { id: user.id, email: user.email, role: user.role, atelierId: user.atelierId }, atelier });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Identifiants incorrects' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Identifiants incorrects' });

        const atelier = user.atelierId ? await buildAtelierResponse(user.atelierId) : null;
        res.json({ user: { id: user.id, email: user.email, role: user.role, atelierId: user.atelierId }, atelier });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Champs requis manquants.' });
        }

        const user = await User.findOne({ id: userId });
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Ancien mot de passe incorrect' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        user.passwordHash = passwordHash;
        await user.save();

        res.json({ success: true, message: 'Mot de passe mis à jour' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};
