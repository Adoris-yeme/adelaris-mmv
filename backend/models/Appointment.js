
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    atelierId: { type: String, required: true, index: true },
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, enum: ['Essayage', 'Livraison', 'Rendez-vous', 'Autre'], required: true },
    notes: { type: String },
    status: { type: String, enum: ['confirmed', 'pending'] }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
