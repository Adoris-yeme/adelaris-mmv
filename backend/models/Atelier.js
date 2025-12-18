
const mongoose = require('mongoose');

const AtelierSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    managerId: { type: String, required: true },
    subscription: {
        status: { type: String, enum: ['active', 'inactive', 'pending', 'trial'], default: 'trial' },
        plan: { type: String, enum: ['trial', 'premium'], default: 'premium' },
        expiresAt: { type: Date }
    },
    managerProfile: { type: mongoose.Schema.Types.Mixed },
    managerAccessCode: { type: String },
    modelOfTheMonthId: { type: String, default: null },
    favoriteIds: { type: [String], default: [] },
    isNew: { type: Boolean, default: true },
    data: { type: mongoose.Schema.Types.Mixed }, 
}, { timestamps: true });

module.exports = mongoose.model('Atelier', AtelierSchema);
