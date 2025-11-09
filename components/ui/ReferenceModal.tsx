import React from 'react';

interface ReferenceModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ title, content, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative animate-fade-in-up space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Fechar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div 
            className="text-sm text-gray-700 space-y-3 max-h-[60vh] overflow-y-auto pr-2"
            dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="flex justify-end pt-4 border-t">
             <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                Fechar
            </button>
        </div>

      </div>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
       `}</style>
    </div>
  );
};
