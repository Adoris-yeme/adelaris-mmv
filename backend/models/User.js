
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['manager', 'superadmin'], default: 'manager' },
    atelierId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
