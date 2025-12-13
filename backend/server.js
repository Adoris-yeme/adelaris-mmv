
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
// Mongoose is recommended for persistent data on Render
// const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for images from external sources during dev/test
}));
app.use(morgan('dev'));

// --- MOCK DATABASE (In-Memory) ---
// WARNING: On Render Free Tier, this data resets on every restart (spin-down).
// You MUST connect a real database like MongoDB Atlas for production use.
const DB = {
    users: [],
    ateliers: []
};

// --- API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MMV Couture API running' });
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, atelierName, atelierType } = req.body;
        
        // Check if user exists
        if (DB.users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Create User & Atelier Logic (Mock)
        const userId = 'user-' + Date.now();
        const atelierId = 'atelier-' + Date.now();
        
        const newUser = { id: userId, email, role: 'manager', atelierId };
        const newAtelier = {
            id: atelierId,
            name: atelierName,
            managerId: userId,
            type: atelierType,
            subscription: {
                status: 'trial',
                plan: 'premium',
                // 60 days trial
                expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) 
            }
        };

        DB.users.push(newUser);
        DB.ateliers.push(newAtelier);

        res.status(201).json({ 
            message: 'Inscription réussie', 
            user: newUser,
            token: 'mock-jwt-token-123456' 
        });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Mock Validation
    const user = DB.users.find(u => u.email === email);
    
    if (!user) {
        return res.status(401).json({ message: 'Identifiants invalides' });
    }

    res.json({
        message: 'Connexion réussie',
        user: user,
        token: 'mock-jwt-token-' + user.id
    });
});

// Subscription Webhook
app.post('/api/webhooks/payment', (req, res) => {
    const { atelierId, amount, status } = req.body;
    
    if (status === 'success') {
        const atelier = DB.ateliers.find(a => a.id === atelierId);
        if (atelier) {
            const currentExpiry = new Date(atelier.subscription.expiresAt || Date.now());
            const newExpiry = new Date(Math.max(currentExpiry.getTime(), Date.now()));
            newExpiry.setMonth(newExpiry.getMonth() + 1); 
            
            atelier.subscription.status = 'active';
            atelier.subscription.expiresAt = newExpiry;
            
            return res.json({ message: 'Abonnement mis à jour' });
        }
    }
    res.status(400).json({ message: 'Paiement échoué ou invalide' });
});

// --- SERVING FRONTEND (Build) ---
// If you build the React app into a 'dist' or 'build' folder, serve it here.
// For development, we usually assume frontend runs on a separate port (Vite).
// For production on Render, you often serve static files:
// app.use(express.static(path.join(__dirname, '../dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
