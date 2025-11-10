
import React from 'react';

const FournituresIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" />
    <path d="M18 7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2" />
    <path d="M12 19v-4" />
    <path d="M12 12v-2" />
    <path d="M12 7V5" />
    <path d="M4 12H3" />
    <path d="M21 12h-1" />
  </svg>
);

export default FournituresIcon;
