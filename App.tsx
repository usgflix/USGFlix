
import React, { useState, useCallback, useEffect } from 'react';
import { AbdominalForm } from './components/AbdominalForm';
import { PatientInfo } from './components/PatientInfo';
import { ReportDisplay } from './components/ReportDisplay';
import { Tabs } from './components/Tabs';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import type { AbdominalFormData, PatientDetails, ClinicSettings, SavedReport } from './types';
import { buildAbdominalReportText } from './utils/reportBuilder';
import { reviewReportWithGemini } from './services/geminiService';
import { initialAbdominalFormData } from './constants';
import { initDB, addReport } from './utils/db';


const App: React.FC = () => {
  const [selectedExams, setSelectedExams] = useState<string[]>(['Abdominal Total']);
  const [activeTab, setActiveTab] = useState<string>('Abdominal Total');
  
  const [patientInfo, setPatientInfo] = useState<PatientDetails>({
    name: '',
    sex: '',
    age: '',
    solicitante: '',
    examDate: new Date().toISOString().split('T')[0],
    ultrassonografista: '',
    crm: '',
    rqe: '',
    clinicalHistory: '',
  });

  const [formsData, setFormsData] = useState({
    'Abdominal Total': initialAbdominalFormData,
    // Future forms data will be added here
  });

  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<ClinicSettings>({
    clinicName: '',
    clinicAddress: '',
    clinicPhone: '',
    logo: '',
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isReportSaved, setIsReportSaved] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('clinicSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      initDB(); // Initialize IndexedDB on app load
    } catch (err) {
      console.error("Failed to load settings or init DB", err);
    }
  }, []);

  const handleSaveSettings = (newSettings: ClinicSettings) => {
    try {
      localStorage.setItem('clinicSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      setIsSettingsOpen(false);
    } catch (err) {
      console.error("Failed to save settings to localStorage", err);
    }
  };

  const handleSaveReport = async () => {
    if (!generatedReport || !patientInfo.name) {
      alert("Por favor, gere um laudo e preencha o nome do paciente antes de salvar.");
      return;
    }
    try {
      const reportToSave = {
        patient: patientInfo,
        reportHtml: generatedReport,
        createdAt: new Date(),
      };
      await addReport(reportToSave);
      setIsReportSaved(true); // Mark as saved
      // You can add a success notification here if desired
    } catch (err) {
      console.error("Failed to save report to DB", err);
      alert("Falha ao salvar o laudo. Verifique o console para mais detalhes.");
    }
  };
  
  const handleLoadReport = (savedReport: SavedReport) => {
    setPatientInfo(savedReport.patient);
    setGeneratedReport(savedReport.reportHtml);
    // When loading, we reset forms and assume only one exam type (the one from the report)
    // A more complex implementation could try to parse the report type.
    setSelectedExams(['Abdominal Total']);
    setActiveTab('Abdominal Total');
    setFormsData({
      'Abdominal Total': initialAbdominalFormData,
    });
    setIsReportSaved(true); // A loaded report is considered saved
    setIsHistoryOpen(false);
  };

  const handleGenerateReport = useCallback(async () => {
    if (!activeTab || !selectedExams.includes(activeTab)) {
        setError("Por favor, selecione um exame ativo para gerar o laudo.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedReport('');
    setIsReportSaved(false); // A new report is not saved yet

    try {
      let preliminaryText = '';
      if (activeTab === 'Abdominal Total') {
          preliminaryText = buildAbdominalReportText(formsData['Abdominal Total']);
      } else {
          setError(`A geração de laudo para "${activeTab}" ainda não foi implementada.`);
          setIsLoading(false);
          return;
      }
      
      const aiReviewedReport = await reviewReportWithGemini(preliminaryText, patientInfo, activeTab);
      
      setGeneratedReport(aiReviewedReport);
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate report. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [formsData, patientInfo, activeTab, selectedExams]);

  const resetForm = () => {
    // Reset patient-specific info, but preserve doctor's details
    setPatientInfo(prevInfo => ({
      name: '',
      sex: '',
      age: '',
      solicitante: '',
      examDate: new Date().toISOString().split('T')[0],
      clinicalHistory: '',
      // Preserve these from the previous state
      ultrassonografista: prevInfo.ultrassonografista,
      crm: prevInfo.crm,
      rqe: prevInfo.rqe,
    }));
    
    // Reset all forms and selections to default
    setSelectedExams(['Abdominal Total']);
    setActiveTab('Abdominal Total');
    setFormsData({
      'Abdominal Total': initialAbdominalFormData,
    });


    // Reset report state
    setGeneratedReport('');
    setError(null);
    setIsReportSaved(false);
  };

  const handleExamSelectionChange = (exam: string, isSelected: boolean) => {
    setSelectedExams(prev => {
        const newSelection = isSelected 
            ? [...prev, exam] 
            : prev.filter(t => t !== exam);

        if (isSelected) {
            // If a new exam is selected, make it active
            setActiveTab(exam);
        } else if (!isSelected && activeTab === exam) {
            // If the active tab is deselected, switch to another selected tab if available
            setActiveTab(newSelection[0] || ''); // Switch to the first available, or empty if none
        }
        
        return newSelection;
    });
  };

  const setAbdominalFormData = (updater: React.SetStateAction<AbdominalFormData>) => {
    setFormsData(prev => ({
        ...prev,
        'Abdominal Total': typeof updater === 'function' ? (updater as Function)(prev['Abdominal Total']) : updater
    }));
  };

  const renderActiveTabContent = () => {
    if (!selectedExams.includes(activeTab)) {
      return <div className="p-6 text-center text-gray-500">Selecione um tipo de exame na lista acima para começar a preencher o laudo.</div>;
    }
    
    switch (activeTab) {
      case 'Abdominal Total':
        return <AbdominalForm data={formsData['Abdominal Total']} setData={setAbdominalFormData} />;
      case 'Próstata':
      case 'Obstétrico 2º Trimestre':
      case 'Tireoide':
        return <div className="p-6 text-center text-gray-500">O formulário para {activeTab} ainda não foi implementado.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-200">
      <Header onOpenHistory={() => setIsHistoryOpen(true)} />
      <main className="flex-grow overflow-y-auto p-2 sm:p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <PatientInfo patientInfo={patientInfo} setPatientInfo={setPatientInfo} />
          <Tabs 
            selectedExams={selectedExams} 
            onExamSelectionChange={handleExamSelectionChange}
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <div className="bg-white rounded-b-md shadow-lg">
            {renderActiveTabContent()}
          </div>
          <ReportDisplay 
            report={generatedReport} 
            setReport={setGeneratedReport}
            isLoading={isLoading}
            error={error}
            settings={settings}
            onSettingsChange={handleSaveSettings}
            patientInfo={patientInfo}
            setPatientInfo={setPatientInfo}
            onSaveReport={handleSaveReport}
            isReportSaved={isReportSaved}
            setIsReportSaved={setIsReportSaved}
          />
        </div>
      </main>
      <Footer onGenerateReport={handleGenerateReport} onNewReport={resetForm} onOpenSettings={() => setIsSettingsOpen(true)} />
      {isSettingsOpen && (
        <SettingsModal 
            currentSettings={settings}
            onSave={handleSaveSettings}
            onClose={() => setIsSettingsOpen(false)}
        />
      )}
      {isHistoryOpen && (
        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onLoadReport={handleLoadReport}
        />
      )}
    </div>
  );
};

export default App;
