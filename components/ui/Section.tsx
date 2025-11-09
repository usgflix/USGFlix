
import React from 'react';

interface SectionProps {
  // Fix: Changed title type from string to React.ReactNode to allow JSX elements.
  title: React.ReactNode;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="border border-slate-400 rounded-md overflow-hidden">
      <h3 className="bg-slate-500 text-white font-semibold p-2 text-sm">{title}</h3>
      <div className="p-4 space-y-4 bg-white">
        {children}
      </div>
    </div>
  );
};
