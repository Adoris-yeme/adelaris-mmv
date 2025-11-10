import React from 'react';

interface OrderConfirmationAnimationProps {
    isOpen: boolean;
}

const OrderConfirmationAnimation: React.FC<OrderConfirmationAnimationProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-stone-900 bg-opacity-90 z-[100] flex flex-col justify-center items-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative w-48 h-48">
                {/* SVG Animation */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* The ticket */}
                    <path
                        d="M25 20 H75 V80 H25 Z"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        className="ticket-path"
                    />
                    {/* The "sent" checkmark */}
                    <path
                        d="M40 50 L50 60 L65 45"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="checkmark-path"
                    />
                    {/* Trailing lines */}
                    <line x1="10" y1="40" x2="20" y2="40" stroke="white" strokeWidth="1.5" className="trail t1" />
                    <line x1="5" y1="50" x2="15" y2="50" stroke="white" strokeWidth="1.5" className="trail t2" />
                    <line x1="10" y1="60" x2="20" y2="60" stroke="white" strokeWidth="1.5" className="trail t3" />
                </svg>
            </div>
            <p className="mt-6 text-xl font-semibold text-white text-center">
                Commande envoyée !
            </p>
             <p className="text-stone-300 text-center">
                Nous préparons votre confirmation.
            </p>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

                .ticket-path {
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                    animation: draw-ticket 1s ease-out forwards;
                }
                
                .checkmark-path {
                    stroke-dasharray: 50;
                    stroke-dashoffset: 50;
                    animation: draw-checkmark 0.5s 1s ease-out forwards;
                }
                
                .ticket-path, .checkmark-path {
                    animation-fill-mode: forwards;
                }
                
                .trail {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                .t1 { animation: trail-anim 0.8s 1.5s ease-out forwards; }
                .t2 { animation: trail-anim 0.8s 1.6s ease-out forwards; }
                .t3 { animation: trail-anim 0.8s 1.7s ease-out forwards; }


                @keyframes draw-ticket {
                    to {
                        stroke-dashoffset: 0;
                    }
                }

                @keyframes draw-checkmark {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                
                @keyframes trail-anim {
                    0% {
                        opacity: 1;
                        transform: translateX(-20px);
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(10px);
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderConfirmationAnimation;