
const mongoose = require('mongoose');

const FournitureSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    atelierId: { type: String, required: true, index: true },
    nom: { type: String, required: true },
    type: { type: String, enum: ['Tissu', 'Mercerie', 'Autre'], required: true },
    fournisseur: { type: String },
    quantite: { type: Number, required: true },
    unite: { type: String, enum: ['m', 'cm', 'unité', 'bobine'], required: true },
    prixAchat: { type: Number },
    imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Fourniture', FournitureSchema);
