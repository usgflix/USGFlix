
import React, { useState } from 'react';
import type { ClinicSettings } from '../types';
import { Input } from './ui/Input';

interface SettingsModalProps {
  currentSettings: ClinicSettings;
  onSave: (settings: ClinicSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ currentSettings, onSave, onClose }) => {
  const [settings, setSettings] = useState<ClinicSettings>(currentSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg space-y-4 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Configurações do Cabeçalho e Rodapé</h2>
        
        <Input label="Nome da Clínica:" name="clinicName" value={settings.clinicName} onChange={handleChange} />
        <Input label="Endereço da Clínica:" name="clinicAddress" value={settings.clinicAddress} onChange={handleChange} />
        <Input label="Telefone da Clínica:" name="clinicPhone" value={settings.clinicPhone} onChange={handleChange} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logomarca:</label>
          <div className="mt-1 flex items-center space-x-4">
            {settings.logo ? (
                <img src={settings.logo} alt="Pré-visualização da logo" className="h-16 w-auto object-contain border p-1 rounded-md bg-gray-50" />
            ) : (
                <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-md text-xs text-gray-400">Sem logo</div>
            )}
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleLogoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
            Salvar
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
