
import React, { useState } from 'react';
import type { AppointmentType } from '../types';

interface RequestAppointmentProps {
    onRequestSubmit: (data: { name: string; phone: string; date: string; time: string; type: AppointmentType, notes?: string }) => void;
    onCancel: () => void;
}

const RequestAppointment: React.FC<RequestAppointmentProps> = ({ onRequestSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState<AppointmentType>('Essayage');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !date || !time) return;

        onRequestSubmit({ name, phone, date, time, type, notes });
    };

    return (
        <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">Demander un rendez-vous</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Votre Nom</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Votre Téléphone</label>
                        <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Date souhaitée</label>
                        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                    </div>
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Heure souhaitée</label>
                        <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Type de rendez-vous</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as AppointmentType)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
                        <option>Essayage</option>
                        <option>Livraison</option>
                        <option>Rendez-vous</option>
                        <option>Autre</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Notes (optionnel)</label>
                    <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Précisez votre demande si besoin..." className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"></textarea>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Envoyer la demande</button>
                </div>
            </form>
        </div>
    );
};

export default RequestAppointment;
