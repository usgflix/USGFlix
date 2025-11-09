
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        id={id}
        {...props}
        className="block w-full px-2 py-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
};
