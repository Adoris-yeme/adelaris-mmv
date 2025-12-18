
const mongoose = require('mongoose');

const ModeleSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    atelierId: { type: String, required: true, index: true },
    atelierName: { type: String, required: true },
    title: { type: String, required: true },
    genre: { type: String, enum: ['Homme', 'Femme', 'Enfant'], required: true },
    event: { type: String, enum: ['Cérémonie', 'Quotidien', 'Soirée', 'Mariage'], required: true },
    category: { type: String },
    fabric: { type: String, required: true },
    difficulty: { type: String, enum: ['Débutant', 'Intermédiaire', 'Avancé'], required: true },
    imageUrls: { type: [String], default: [] },
    description: { type: String, required: true },
    patron_pdf_link: { type: String },
    showcaseStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none', index: true }
}, { timestamps: true });

module.exports = mongoose.model('Modele', ModeleSchema);
