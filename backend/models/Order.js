
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    atelierId: { type: String, required: true, index: true },
    clientId: { type: String, required: true },
    modelId: { type: String, required: true },
    date: { type: String, required: true },
    status: { 
        type: String,
        enum: ['En attente de validation', 'En cours de couture', 'En finition', 'Prêt à livrer', 'Livré'],
        required: true
    },
    ticketId: { type: String, required: true },
    price: { type: Number },
    notes: { type: String },
    workstationId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
