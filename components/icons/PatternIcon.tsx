
import React from 'react';

const PatternIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="18" r="3" />
    <line x1="20.49" y1="3.51" x2="8.49" y2="15.51" />
    <line x1="3.51" y1="20.49" x2="15.51" y2="8.49" />
  </svg>
);

export default PatternIcon;
