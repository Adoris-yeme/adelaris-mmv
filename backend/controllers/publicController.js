
const Review = require('../models/Review');
const SiteContent = require('../models/SiteContent');
const Modele = require('../models/Modele');
const Client = require('../models/Client');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

const DEFAULT_SITE_CONTENT = {
    hero: {
        imageUrl: 'https://i.pinimg.com/564x/e8/35/6a/e8356a59c572e9a2862a3260713d8753.jpg',
        backgroundPosition: 'center center',
        title: '"MM-V" Multiple Model - Viewer',
        subtitle: 'La plateforme tout-en-un pour les ateliers de couture. Gérez vos clients, vos modèles et exposez votre savoir-faire au monde entier.',
    },
    stats: [
        { id: 's1', value: '100%', label: 'Sécurisé' },
        { id: 's2', value: '24/7', label: 'Disponible' },
        { id: 's3', value: 'Infinity', label: 'Créativité' }
    ],
    segments: [
        {
            id: 'seg-afro',
            title: "L'Excellence de la Mode Africaine",
            text: 'MMV Couture célèbre la richesse des tissus et des coupes africaines. Que vous travailliez le Bazin, le Wax, le Kente ou le Bogolan, notre plateforme est conçue pour mettre en valeur la précision de votre art et la beauté de vos créations. Offrez à vos clients une expérience digne des plus grandes maisons de couture.',
            imageUrl: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3',
            layout: 'image-left',
        },
        {
            id: 'seg1',
            title: 'Un savoir-faire unique, une gestion moderne',
            text: 'Découvrez des outils qui allient tradition et modernité. Fini les carnets perdus et les mesures approximatives. Centralisez tout votre atelier dans votre poche.',
            imageUrl: 'https://images.unsplash.com/photo-1617231475713-333182803c53?q=80&w=1887&auto=format&fit=crop',
            layout: 'image-right',
        }
    ],
    blocks: []
};

const findModel = async (modelId) => {
    const model = await Modele.findOne({ id: modelId });
    if (!model) return null;
    return model;
};

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { author, content, rating, target, atelierId, atelierName } = req.body;

        if (!author || !content || !rating || !target) {
            return res.status(400).json({ message: 'Champs requis manquants.' });
        }

        const reviewId = 'review-' + Date.now() + '-' + Math.floor(Math.random() * 10000);

        const review = await Review.create({
            id: reviewId,
            author,
            content,
            rating,
            target,
            atelierId,
            atelierName,
            createdAt: new Date()
        });

        if (target === 'atelier' && atelierId) {
            await Notification.create({
                id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
                atelierId,
                message: `Nouvel avis reçu de ${author} : "${String(content).substring(0, 30)}..."`,
                date: new Date().toISOString(),
                read: false,
                reviewId: reviewId
            });
        }

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.respondToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        const review = await Review.findOneAndUpdate({ id }, { $set: { response } }, { new: true });
        if (!review) return res.status(404).json({ message: 'Avis introuvable' });

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.getSiteContent = async (req, res) => {
    try {
        let doc = await SiteContent.findOne({ key: 'main' });
        if (!doc) {
            doc = await SiteContent.create({ key: 'main', content: DEFAULT_SITE_CONTENT });
        }
        res.json(doc.content);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.updateSiteContent = async (req, res) => {
    try {
        const newContent = req.body;
        const doc = await SiteContent.findOneAndUpdate(
            { key: 'main' },
            { $set: { content: newContent } },
            { new: true, upsert: true }
        );
        res.json(doc.content);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.getShowcaseModels = async (req, res) => {
    try {
        const status = req.query.status || 'approved';
        const models = await Modele.find({ showcaseStatus: status }).sort({ createdAt: -1 });
        res.json(models);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

exports.placeShowroomOrder = async (req, res) => {
    try {
        const { modelId, model, client } = req.body;
        const finalModelId = modelId || (model && model.id);

        if (!finalModelId || !client || !client.name || !client.phone) {
            return res.status(400).json({ message: 'Champs requis manquants.' });
        }

        const foundModel = await findModel(finalModelId);
        if (!foundModel) return res.status(404).json({ message: 'Modèle introuvable' });

        const atelierId = foundModel.atelierId;

        let existingClient = await Client.findOne({ atelierId, phone: client.phone });
        if (!existingClient) {
            existingClient = await Client.create({
                id: 'client-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
                atelierId,
                name: client.name,
                phone: client.phone,
                email: client.email,
                measurements: {},
                lastSeen: 'Nouveau (Showroom)'
            });
        }

        const newOrderId = 'order-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        const newOrder = await Order.create({
            id: newOrderId,
            atelierId,
            clientId: existingClient.id,
            modelId: foundModel.id,
            date: new Date().toISOString(),
            status: 'En attente de validation',
            ticketId: `CMD-WEB-${String(newOrderId).slice(-4).toUpperCase()}`,
            notes: "Commande provenant de la salle d'exposition en ligne."
        });

        await Notification.create({
            id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
            atelierId,
            message: `Nouvelle commande web de ${existingClient.name} pour le modèle ${foundModel.title}.`,
            date: new Date().toISOString(),
            read: false,
            orderId: newOrderId
        });

        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};
