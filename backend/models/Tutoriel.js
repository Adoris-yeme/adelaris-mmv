
const mongoose = require('mongoose');

const TutorielSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    atelierId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    duration: { type: String, required: true },
    category: { type: String, enum: ['Prise de mesures', 'Découpe', 'Techniques de couture'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Tutoriel', TutorielSchema);
