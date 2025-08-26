
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 50 50"
      className="animate-spin"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
        stroke="#1e293b" // slate-800
      ></circle>
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
        stroke="#14b8a6" // teal-500
        strokeDasharray="80"
        strokeDashoffset="60"
        strokeLinecap="round"
      ></circle>
    </svg>
  );
};
