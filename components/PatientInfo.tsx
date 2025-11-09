
import React from 'react';
import type { PatientDetails } from '../types';
import { Input } from './ui/Input';

interface PatientInfoProps {
  patientInfo: PatientDetails;
  setPatientInfo: React.Dispatch<React.SetStateAction<PatientDetails>>;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patientInfo, setPatientInfo }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-t-md shadow-lg border-b border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4 items-end">
        <div className="lg:col-span-2">
            <Input label="Paciente:" type="text" name="name" value={patientInfo.name} onChange={handleChange} />
        </div>
        <div>
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">Sexo:</label>
            <select id="sex" name="sex" value={patientInfo.sex} onChange={handleChange} className="block w-full px-2 py-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value=""></option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
            </select>
        </div>
        <div>
            <Input label="Idade:" type="text" name="age" value={patientInfo.age} onChange={handleChange} />
        </div>
        <div>
             <Input label="Med. solic.:" type="text" name="solicitante" value={patientInfo.solicitante} onChange={handleChange} />
        </div>
        <div>
            <Input label="Data do exame:" type="date" name="examDate" value={patientInfo.examDate} onChange={handleChange} />
        </div>
        <div>
            <Input label="Ultrassonografista:" type="text" name="ultrassonografista" value={patientInfo.ultrassonografista} onChange={handleChange} />
        </div>
        <div>
            <Input label="CRM:" type="text" name="crm" value={patientInfo.crm} onChange={handleChange} />
        </div>
        <div>
            <Input label="RQE:" type="text" name="rqe" value={patientInfo.rqe} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};