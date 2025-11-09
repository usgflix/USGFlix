
import React from 'react';

interface FooterProps {
    onGenerateReport: () => void;
    onNewReport: () => void;
    onOpenSettings: () => void;
}

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 12M20 20l-1.5-1.5A9 9 0 003.5 12" />
    </svg>
);

const GenerateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export const Footer: React.FC<FooterProps> = ({ onGenerateReport, onNewReport, onOpenSettings }) => {
    return (
        <footer className="bg-gray-200 border-t border-gray-300 p-3 shadow-inner sticky bottom-0 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <button 
                    onClick={onNewReport}
                    className="flex items-center px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <RefreshIcon />
                    Começar novo laudo
                </button>
                <div className="space-x-4">
                    <button className="px-4 py-2 bg-white border border-gray-400 text-gray-700 rounded-md shadow-sm hover:bg-gray-50">
                        Comparação com exame anterior
                    </button>
                    <button onClick={onOpenSettings} className="flex items-center px-4 py-2 bg-white border border-gray-400 text-gray-700 rounded-md shadow-sm hover:bg-gray-50">
                        <SettingsIcon />
                        Configurações
                    </button>
                </div>
                <button 
                    onClick={onGenerateReport}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
                >
                    <GenerateIcon />
                    Gerar Laudo
                </button>
            </div>
        </footer>
    );
};
