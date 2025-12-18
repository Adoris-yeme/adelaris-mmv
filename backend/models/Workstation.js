
const mongoose = require('mongoose');

const WorkstationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    atelierId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    accessCode: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Workstation', WorkstationSchema);
