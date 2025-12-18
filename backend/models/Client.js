
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    atelierId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    measurements: { type: mongoose.Schema.Types.Mixed, default: {} },
    lastSeen: { type: String, required: true }
}, { timestamps: true });

ClientSchema.index({ atelierId: 1, phone: 1 });

module.exports = mongoose.model('Client', ClientSchema);
