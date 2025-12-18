
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    target: { type: String, enum: ['platform', 'atelier'], required: true },
    atelierId: { type: String },
    atelierName: { type: String },
    createdAt: { type: Date, default: Date.now },
    response: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
