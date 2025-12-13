
import React from 'react';

interface PasswordResetModalProps {
  email: string;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ email, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-dialog-title"
    >
      <div
        className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl w-full max-w-md m-auto p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="reset-dialog-title" className="text-xl font-bold text-stone-800 dark:text-stone-100">Réinitialisation de Mot de Passe</h2>
        <div className="mt-4 text-stone-600 dark:text-stone-300 space-y-2">
            <p>
                Pour réinitialiser le mot de passe du manager avec l'email <strong>{email}</strong>, veuillez le contacter directement pour lui fournir un nouveau mot de passe.
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
                (Dans une application complète, un email de réinitialisation serait automatiquement envoyé à l'utilisateur.)
            </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800"
          >
            J'ai compris
          </button>
        </div>
      </div>
       <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
          @keyframes slide-up { from { transform: translateY(10px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
          .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default PasswordResetModal;
