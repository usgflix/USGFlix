
import React, { useState, useEffect, useCallback } from 'react';
import type { SavedReport } from '../types';
import { getReports } from '../utils/db';
import { Input } from './ui/Input';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadReport: (report: SavedReport) => void;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onLoadReport }) => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedReports = await getReports(searchTerm);
      setReports(fetchedReports);
    } catch (error) {
      console.error('Failed to fetch reports', error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isOpen) {
      fetchReports();
    }
  }, [isOpen, fetchReports]);

  if (!isOpen) {
    return null;
  }

  const handleFolderInfoClick = () => {
    alert('Os laudos são salvos no seu computador na pasta de "Downloads" padrão do seu navegador.\n\nPor motivos de segurança, o aplicativo não pode abrir esta pasta para você.');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col h-[70vh] animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Histórico de Laudos</h2>
          <div className="mt-4 flex items-center gap-4">
            <Input 
              placeholder="Buscar por nome do paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
             <button
                onClick={handleFolderInfoClick}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap"
                title="Onde os arquivos .doc são salvos?"
            >
                <InfoIcon />
                <span>Abrir pasta de destino</span>
            </button>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center text-gray-500">Carregando histórico...</div>
          ) : reports.length === 0 ? (
            <div className="text-center text-gray-500">
              {searchTerm ? 'Nenhum laudo encontrado para sua busca.' : 'Nenhum laudo salvo encontrado.'}
            </div>
          ) : (
            <ul className="space-y-2">
              {reports.map((report) => (
                <li key={report.id}>
                  <button 
                    onClick={() => onLoadReport(report)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-md transition-colors"
                  >
                    <div className="font-semibold text-blue-800">{report.patient.name}</div>
                    <div className="text-sm text-gray-600">
                      Data do Exame: {new Date(report.patient.examDate).toLocaleDateString()} | Salvo em: {new Date(report.createdAt).toLocaleString()}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
        
        <footer className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Fechar
          </button>
        </footer>
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
