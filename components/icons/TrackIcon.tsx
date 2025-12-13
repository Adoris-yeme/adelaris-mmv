import React from 'react';

const TrackIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2" />
    <path d="M21 10-10 16-3 10" />
    <path d="M3 14v5a2 2 0 0 0 2 2h5" />
    <path d="M15 14v5a2 2 0 0 1-2 2h-1" />
    <circle cx="18" cy="18" r="3" />
    <path d="m22 22-1.5-1.5" />
  </svg>
);

export default TrackIcon;
