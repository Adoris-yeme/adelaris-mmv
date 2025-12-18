
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    atelierId: { type: String, required: true, index: true },
    message: { type: String, required: true },
    date: { type: String, required: true },
    read: { type: Boolean, default: false },
    orderId: { type: String },
    reviewId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
