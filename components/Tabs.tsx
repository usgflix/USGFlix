
import React from 'react';

interface TabsProps {
  selectedExams: string[];
  onExamSelectionChange: (exam: string, isSelected: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ selectedExams, onExamSelectionChange, activeTab, setActiveTab }) => {
  const tabs = [
    'Abdominal Total',
    'Próstata',
    'Obstétrico 2º Trimestre',
    'Tireoide',
    'Mamas',
    'Doppler de Carótidas',
    'Doppler Venoso',
    // Add more tabs here in the future
  ];

  return (
    <div className="border-b border-gray-200 bg-gray-100">
      <nav className="-mb-px flex space-x-2 px-4 flex-wrap" aria-label="Tabs">
        {tabs.map(tab => {
          const isSelected = selectedExams.includes(tab);
          const isActive = isSelected && activeTab === tab;

          const getTabClass = () => {
             if (isActive) return 'border-blue-500 text-blue-600 bg-white shadow-sm';
             if (isSelected) return 'border-gray-300 text-gray-800 bg-white/60 hover:bg-white';
             return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 bg-gray-50';
          };

          return (
            <div
              key={tab}
              className={`flex items-center whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm rounded-t-md focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-150 ${getTabClass()}`}
            >
              <input
                type="checkbox"
                id={`tab-checkbox-${tab}`}
                checked={isSelected}
                onChange={(e) => onExamSelectionChange(tab, e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label 
                htmlFor={`tab-checkbox-${tab}`}
                className="cursor-pointer"
                onClick={() => {
                  if (isSelected) {
                    setActiveTab(tab);
                  }
                  // If not selected, the checkbox onChange will handle selection and activation logic in App.tsx
                }}
              >
                {tab}
              </label>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
