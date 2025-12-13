
import React, { useState } from 'react';
import type { Appointment, Client, AppointmentType } from '../types';
import { ChevronLeftIcon } from '../components/icons';

const AppointmentTypeBadge: React.FC<{ type: AppointmentType, status?: Appointment['status'] }> = ({ type, status }) => {
    const typeColors = {
        'Essayage': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Livraison': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Rendez-vous': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'Autre': 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-300'
    };
     if (status === 'pending') {
        return <span className="px-2.5 py-1 text-xs font-semibold leading-none rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Demande en attente</span>;
    }
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold leading-none rounded-full ${typeColors[type]}`}>
            {type}
        </span>
    );
};


const AppointmentCard: React.FC<{ appointment: Appointment, onConfirm: (app: Appointment) => void, onDelete: (id: string) => void }> = ({ appointment, onConfirm, onDelete }) => (
  <div className={`bg-white dark:bg-stone-800 rounded-lg shadow-md p-5 flex items-start space-x-4 transition-all hover:shadow-lg hover:scale-[1.02] ${appointment.status === 'pending' ? 'border-l-4 border-yellow-400' : ''}`}>
     <div className="flex-shrink-0 h-12 w-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
        <span className="text-orange-800 dark:text-orange-300 font-bold text-xl">
          {appointment.clientName.charAt(0).toUpperCase()}
        </span>
      </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-lg text-stone-800 dark:text-stone-100">{appointment.clientName}</p>
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-400">{new Date(appointment.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-sm text-stone-500 dark:text-stone-400">à {appointment.time}</p>
          </div>
          <AppointmentTypeBadge type={appointment.type} status={appointment.status} />
      </div>
      {appointment.notes && <p className="mt-2 text-sm text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-700/50 p-3 rounded-md">{appointment.notes}</p>}
      {appointment.status === 'pending' && (
          <div className="mt-4 flex gap-2">
              <button onClick={() => onConfirm(appointment)} className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Confirmer</button>
              <button onClick={() => onDelete(appointment.id)} className="px-3 py-1 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Refuser</button>
          </div>
      )}
    </div>
    <button onClick={() => onDelete(appointment.id)} className="text-stone-400 hover:text-red-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    </button>
  </div>
);

const AddAppointmentForm: React.FC<{ clients: Client[]; onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void; onCancel: () => void; }> = ({ clients, onAddAppointment, onCancel }) => {
    const [clientId, setClientId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [type, setType] = useState<AppointmentType>('Essayage');
    const [notes, setNotes] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId || !date || !time) return;

        const client = clients.find(c => c.id === clientId);
        if (!client) return;

        onAddAppointment({
            clientId,
            clientName: client.name,
            date,
            time,
            type,
            notes,
            status: 'confirmed'
        });
    };

    return (
        <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">Ajouter un rappel</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="client" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Client</label>
                    <select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
                        <option value="" disabled>Sélectionner un client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Date</label>
                        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required/>
                    </div>
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Heure</label>
                        <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required/>
                    </div>
                </div>
                 <div>
                    <label htmlFor="type" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Type de rappel</label>
                     <select id="type" value={type} onChange={(e) => setType(e.target.value as AppointmentType)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required>
                        <option>Essayage</option>
                        <option>Livraison</option>
                        <option>Rendez-vous</option>
                        <option>Autre</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Notes (optionnel)</label>
                    <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"></textarea>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 rounded-md hover:bg-stone-200 dark:hover:bg-stone-600">Annuler</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800">Enregistrer</button>
                </div>
            </form>
        </div>
    )
}

interface AgendaProps {
    appointments: Appointment[];
    clients: Client[];
    onAddAppointment: (appointment: Appointment) => void;
    onUpdateAppointment: (appointment: Appointment) => void;
    onDeleteAppointment: (id: string) => void;
}

const Agenda: React.FC<AgendaProps> = ({ appointments, clients, onAddAppointment, onUpdateAppointment, onDeleteAppointment }) => {
  const [showForm, setShowForm] = useState(false);

  const handleAddAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
        ...appointmentData,
        id: crypto.randomUUID(),
    };
    onAddAppointment(newAppointment);
    setShowForm(false);
  }

  const handleConfirmAppointment = (appointment: Appointment) => {
    onUpdateAppointment({ ...appointment, status: 'confirmed' });
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status !== 'pending');

  if (showForm) {
      return (
        <div>
            <button onClick={() => setShowForm(false)} className="mb-6 flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 transition-colors hover:text-orange-800 dark:hover:text-orange-400">
                <ChevronLeftIcon className="h-5 w-5" />
                <span>Retour à l'agenda</span>
            </button>
            <AddAppointmentForm clients={clients} onAddAppointment={handleAddAppointment} onCancel={() => setShowForm(false)} />
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Agenda & Rappels</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Planifiez et suivez vos rendez-vous clients.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-5 py-2.5 text-sm font-medium text-white bg-orange-900 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 transition-transform hover:scale-105">
          Ajouter un rappel
        </button>
      </div>
      
      {pendingAppointments.length > 0 && (
        <div>
            <h2 className="text-xl font-semibold text-stone-700 dark:text-stone-200 mb-4">Demandes en attente</h2>
            <div className="space-y-4">
                {pendingAppointments.map(app => (
                    <AppointmentCard key={app.id} appointment={app} onConfirm={handleConfirmAppointment} onDelete={onDeleteAppointment} />
                ))}
            </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-stone-700 dark:text-stone-200 mb-4 mt-8">Rendez-vous confirmés</h2>
        <div className="space-y-4">
            {confirmedAppointments.length > 0 ? confirmedAppointments.map(app => (
            <AppointmentCard key={app.id} appointment={app} onConfirm={handleConfirmAppointment} onDelete={onDeleteAppointment} />
            )) : (
                <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-lg shadow-md">
                    <svg className="mx-auto h-12 w-12 text-stone-400 dark:text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-stone-900 dark:text-stone-100">Aucun rappel à venir</h3>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Commencez par planifier votre premier rendez-vous.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
