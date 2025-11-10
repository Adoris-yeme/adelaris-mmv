import React, { useState, useRef, useEffect } from 'react';
import type { Notification } from '../types';
import { BellIcon } from './icons';

interface NotificationBellProps {
    notifications: Notification[];
    onMarkAsRead: (ids: string[]) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onMarkAsRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        setIsOpen(prev => !prev);
        if (!isOpen && unreadCount > 0) {
            const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
            // Delay marking as read to allow user to see the notifications
            setTimeout(() => onMarkAsRead(unreadIds), 2000);
        }
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={handleToggle}
                className="relative p-2 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Notifications"
            >
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-80 bg-white dark:bg-stone-800 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-700 overflow-hidden animate-fade-in-up">
                    <div className="p-3 font-semibold border-b border-stone-200 dark:border-stone-700">Notifications</div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(notif => (
                                <div key={notif.id} className={`p-3 border-b border-stone-100 dark:border-stone-700/50 ${!notif.read ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}>
                                    <p className="text-sm text-stone-700 dark:text-stone-200">{notif.message}</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                                        {new Date(notif.date).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-sm text-center text-stone-500 dark:text-stone-400">Aucune notification</p>
                        )}
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;