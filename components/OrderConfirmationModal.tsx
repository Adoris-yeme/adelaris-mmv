import React from 'react';

interface OrderConfirmationModalProps {
  message: string | null;
  onClose: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="bg-white dark:bg-stone-800 rounded-2xl shadow-2xl w-full max-w-md m-auto p-8 text-center animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 id="dialog-title" className="text-xl font-bold text-stone-800 dark:text-stone-100">Confirmation</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">{message}</p>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-900 rounded-md hover:bg-orange-800"
          >
            OK
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

export default OrderConfirmationModal;
