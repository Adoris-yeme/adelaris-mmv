
const Atelier = require('../models/Atelier');
const Client = require('../models/Client');
const Modele = require('../models/Modele');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const Workstation = require('../models/Workstation');
const Fourniture = require('../models/Fourniture');
const Notification = require('../models/Notification');
const Expense = require('../models/Expense');
const Tutoriel = require('../models/Tutoriel');

const buildAtelierData = async (atelierId) => {
    const [
        clients,
        models,
        appointments,
        orders,
        workstations,
        fournitures,
        notifications,
        expenses,
        tutoriels
    ] = await Promise.all([
        Client.find({ atelierId }).sort({ createdAt: -1 }),
        Modele.find({ atelierId }).sort({ createdAt: -1 }),
        Appointment.find({ atelierId }).sort({ createdAt: -1 }),
        Order.find({ atelierId }).sort({ createdAt: -1 }),
        Workstation.find({ atelierId }).sort({ createdAt: -1 }),
        Fourniture.find({ atelierId }).sort({ createdAt: -1 }),
        Notification.find({ atelierId }).sort({ createdAt: -1 }),
        Expense.find({ atelierId }).sort({ createdAt: -1 }),
        Tutoriel.find({ atelierId }).sort({ createdAt: -1 })
    ]);

    const atelier = await Atelier.findOne({ id: atelierId });
    if (!atelier) return null;

    const legacy = atelier.data || {};
    const managerProfile = atelier.managerProfile || legacy.managerProfile || { name: atelier.name, avatarUrl: 'https://placehold.co/100x100/e2e8f0/78350f?text=Atelier' };
    const managerAccessCode = atelier.managerAccessCode || legacy.managerAccessCode || legacy.managerAccessCode || '';
    const modelOfTheMonthId = atelier.modelOfTheMonthId !== undefined ? atelier.modelOfTheMonthId : (legacy.modelOfTheMonthId || null);
    const favoriteIds = Array.isArray(atelier.favoriteIds) ? atelier.favoriteIds : (Array.isArray(legacy.favoriteIds) ? legacy.favoriteIds : []);
    const isNew = atelier.isNew !== undefined ? atelier.isNew : !!legacy.isNew;

    return {
        clients,
        models,
        appointments,
        orders,
        workstations,
        fournitures,
        notifications,
        expenses,
        managerProfile,
        managerAccessCode,
        modelOfTheMonthId,
        favoriteIds,
        isNew,
        tutoriels
    };
};

const buildAtelierResponse = async (atelierId) => {
    const atelier = await Atelier.findOne({ id: atelierId });
    if (!atelier) return null;

    const data = await buildAtelierData(atelierId);
    if (!data) return null;

    return {
        id: atelier.id,
        name: atelier.name,
        managerId: atelier.managerId,
        subscription: atelier.subscription,
        data,
        createdAt: atelier.createdAt
    };
};

const replaceAtelierData = async (atelierId, data) => {
    const atelier = await Atelier.findOne({ id: atelierId });
    if (!atelier) return null;

    const payload = data || {};

    atelier.managerProfile = payload.managerProfile;
    atelier.managerAccessCode = payload.managerAccessCode;
    atelier.modelOfTheMonthId = payload.modelOfTheMonthId;
    atelier.favoriteIds = payload.favoriteIds;
    atelier.isNew = payload.isNew;

    await atelier.save();

    const ops = [
        Client.deleteMany({ atelierId }),
        Modele.deleteMany({ atelierId }),
        Appointment.deleteMany({ atelierId }),
        Order.deleteMany({ atelierId }),
        Workstation.deleteMany({ atelierId }),
        Fourniture.deleteMany({ atelierId }),
        Notification.deleteMany({ atelierId }),
        Expense.deleteMany({ atelierId }),
        Tutoriel.deleteMany({ atelierId })
    ];

    await Promise.all(ops);

    const inserts = [];
    if (Array.isArray(payload.clients) && payload.clients.length) inserts.push(Client.insertMany(payload.clients.map(c => ({ ...c, atelierId }))));
    if (Array.isArray(payload.models) && payload.models.length) inserts.push(Modele.insertMany(payload.models.map(m => ({ ...m, atelierId }))));
    if (Array.isArray(payload.appointments) && payload.appointments.length) inserts.push(Appointment.insertMany(payload.appointments.map(a => ({ ...a, atelierId }))));
    if (Array.isArray(payload.orders) && payload.orders.length) inserts.push(Order.insertMany(payload.orders.map(o => ({ ...o, atelierId }))));
    if (Array.isArray(payload.workstations) && payload.workstations.length) inserts.push(Workstation.insertMany(payload.workstations.map(w => ({ ...w, atelierId }))));
    if (Array.isArray(payload.fournitures) && payload.fournitures.length) inserts.push(Fourniture.insertMany(payload.fournitures.map(f => ({ ...f, atelierId }))));
    if (Array.isArray(payload.notifications) && payload.notifications.length) inserts.push(Notification.insertMany(payload.notifications.map(n => ({ ...n, atelierId }))));
    if (Array.isArray(payload.expenses) && payload.expenses.length) inserts.push(Expense.insertMany(payload.expenses.map(e => ({ ...e, atelierId }))));
    if (Array.isArray(payload.tutoriels) && payload.tutoriels.length) inserts.push(Tutoriel.insertMany(payload.tutoriels.map(t => ({ ...t, atelierId }))));

    await Promise.all(inserts);

    return true;
};

module.exports = {
    buildAtelierData,
    buildAtelierResponse,
    replaceAtelierData
};
