
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    atelierId: { type: String, required: true, index: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, enum: ['Loyer', 'Électricité', 'Matériel', 'Salaires', 'Marketing', 'Autre'], required: true },
    date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
