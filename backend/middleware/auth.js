const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour vérifier le token JWT et le rôle de l'utilisateur
exports.protect = async (req, res, next) => {
    let token;

    // Récupérer le token du header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Vérifier si le token existe
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé : token manquant' });
    }

    try {
        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

        // Récupérer l'utilisateur correspondant
        const user = await User.findOne({ id: decoded.id }).select('-passwordHash');
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        // Attacher l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide' });
    }
};

// Middleware pour restreindre l'accès aux superadmins
exports.restrictToSuperadmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Accès refusé : superadmin requis' });
    }
    next();
};
