
const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: 'main' },
    content: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', SiteContentSchema);
