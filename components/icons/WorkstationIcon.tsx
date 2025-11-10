import React from 'react';

const WorkstationIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 22a7 7 0 0 0 7-7H5a7 7 0 0 0 7 7z" />
    <path d="M12 15v-3" />
    <path d="M4 12a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2" />
    <path d="M18 12h-3" />
    <path d="M9 12H6" />
  </svg>
);

export default WorkstationIcon;