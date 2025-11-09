
import React, { useRef, useEffect, useState } from 'react';
import type { ClinicSettings, PatientDetails } from '../types';
import { getAISuggestion } from '../services/geminiService';
import { Input } from './ui/Input';

interface ReportDisplayProps {
  report: string;
  setReport: (report: string) => void;
  isLoading: boolean;
  error: string | null;
  settings: ClinicSettings;
  onSettingsChange: (settings: ClinicSettings) => void;
  patientInfo: PatientDetails;
  setPatientInfo: React.Dispatch<React.SetStateAction<PatientDetails>>;
  onSaveReport: () => void;
  isReportSaved: boolean;
  setIsReportSaved: (isSaved: boolean) => void;
}

const PrintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

const PdfIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4 4-4 5.293 5.293a1 1 0 010 1.414L15 21M18 8l-2.293-2.293a1 1 0 00-1.414 0L9 11l4 4-4-4-5.293-5.293a1 1 0 00-1.414 0L3 8" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);


const RichTextToolbar: React.FC = () => {
    const applyStyle = (command: string, value: string | null = null) => {
        document.execCommand(command, false, value);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement | HTMLSelectElement>) => {
        e.preventDefault();
    };

    const handleSelectChange = (command: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        applyStyle(command, e.target.value);
    };

    return (
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 p-2 bg-gray-100 border-b border-gray-300">
            <button onMouseDown={handleMouseDown} onClick={() => applyStyle('bold')} className="font-bold w-8 h-8 hover:bg-gray-200 rounded transition-colors" title="Negrito">B</button>
            <button onMouseDown={handleMouseDown} onClick={() => applyStyle('italic')} className="italic w-8 h-8 hover:bg-gray-200 rounded transition-colors" title="Itálico">I</button>
            <button onMouseDown={handleMouseDown} onClick={() => applyStyle('underline')} className="underline w-8 h-8 hover:bg-gray-200 rounded transition-colors" title="Sublinhado">U</button>
            <div className="h-6 w-px bg-gray-300"></div>
            <select defaultValue="Arial" onMouseDown={handleMouseDown} onChange={handleSelectChange('fontName')} className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer h-8" title="Fonte">
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
            </select>
            <select defaultValue="3" onMouseDown={handleMouseDown} onChange={handleSelectChange('fontSize')} className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer h-8" title="Tamanho da Fonte">
                <option value="1">Muito Pequena</option>
                <option value="2">Pequena</option>
                <option value="3">Normal</option>
                <option value="4">Grande</option>
                <option value="5">Muito Grande</option>
            </select>
        </div>
    );
};


export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, setReport, isLoading, error, settings, onSettingsChange, patientInfo, setPatientInfo, onSaveReport, isReportSaved, setIsReportSaved }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [suggestionQuery, setSuggestionQuery] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [isSuggestionCopied, setIsSuggestionCopied] = useState(false);
  const [isReportCopied, setIsReportCopied] = useState(false);

  useEffect(() => {
    if (editorRef.current && report !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = report;
    }
  }, [report]);

  const handleInput = () => {
    if (editorRef.current) {
        setReport(editorRef.current.innerHTML);
        setIsReportSaved(false); // Any edit marks the report as unsaved
    }
  };
  
  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onSettingsChange({ ...settings, [name]: value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSettingsChange({ ...settings, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const getFullReportHtmlForExport = () => {
    let headerHtml = '<div class="header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; page-break-inside: avoid;">';
    
    if (settings.logo) {
        headerHtml += `<div><img src="${settings.logo}" alt="Clínica Logo" style="max-height: 60px; max-width: 200px; object-fit: contain;"></div>`;
    } else {
        headerHtml += '<div></div>';
    }

    if (settings.clinicName || settings.clinicAddress || settings.clinicPhone) {
        headerHtml += '<div class="header-info" style="text-align: right; font-size: 0.9em;">';
        if (settings.clinicName) headerHtml += `<h2 style="margin: 0; font-size: 1.4em; color: #000;">${settings.clinicName}</h2>`;
        if (settings.clinicAddress) headerHtml += `<p style="margin: 2px 0;">${settings.clinicAddress}</p>`;
        if (settings.clinicPhone) headerHtml += `<p style="margin: 2px 0;">${settings.clinicPhone}</p>`;
        headerHtml += '</div>';
    }
    headerHtml += '</div>';
    
    return headerHtml + `<div class="report-content">${report}</div>`;
  };


  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const fullHtml = getFullReportHtmlForExport();
      printWindow.document.write('<html><head><title>Laudo de Ultrassonografia</title>');
      printWindow.document.write(`
        <style>
          @page {
            size: A4;
            margin: 1.5cm;
          }
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            margin: 0; 
            padding: 0;
            color: #333; 
            font-size: 11pt;
            line-height: 1.4;
          }
          .report-content p {
            margin: 0 0 0.8em 0; 
            padding: 0;
          }
          .report-content div, .report-content p, .report-content strong {
            page-break-inside: avoid;
          }
          .signature {
            text-align: right;
          }
        </style>
      `);
      printWindow.document.write('</head><body>');
      printWindow.document.write(fullHtml);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSaveAndDownload = () => {
    // 1. Save to IndexedDB
    onSaveReport();

    // 2. Download as .doc
    const wordHeader = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Laudo</title></head><body>`;
    const wordFooter = "</body></html>";
    const fullReportHtml = getFullReportHtmlForExport();
    const sourceHTML = wordHeader + fullReportHtml + wordFooter;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    const fileName = `Laudo_${patientInfo.name.replace(/ /g, '_') || 'Paciente'}_${patientInfo.examDate}.doc`;
    fileDownload.download = fileName;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleGenerateSuggestion = async () => {
      if (!suggestionQuery) return;
      setIsSuggestionLoading(true);
      setSuggestionError(null);
      setAiSuggestion('');
      try {
          const suggestion = await getAISuggestion(suggestionQuery, editorRef.current?.innerText || '', patientInfo);
          setAiSuggestion(suggestion);
      } catch (err) {
          setSuggestionError('Falha ao obter sugestão da IA.');
          console.error(err);
      } finally {
          setIsSuggestionLoading(false);
      }
  };

  const handleCopySuggestion = () => {
      if (!aiSuggestion) return;
      navigator.clipboard.writeText(aiSuggestion).then(() => {
          setIsSuggestionCopied(true);
          setTimeout(() => setIsSuggestionCopied(false), 2000);
      });
  };

  const handleCopyReport = () => {
    if (!editorRef.current?.innerText) return;

    navigator.clipboard.writeText(editorRef.current.innerText).then(() => {
      setIsReportCopied(true);
      setTimeout(() => setIsReportCopied(false), 2000);
    }).catch(err => {
      console.error('Falha ao copiar o laudo: ', err);
      alert('Não foi possível copiar o laudo.');
    });
  };


  return (
    <div className="bg-white p-4 rounded-md shadow-lg space-y-4">
      {/* Editable Header Section */}
      <div className="report-header-editor p-4 border border-dashed border-gray-300 rounded-md flex justify-between items-start gap-4">
        <div className="flex flex-col items-center gap-2">
            {settings.logo ? (
                <img src={settings.logo} alt="Logo da clínica" className="h-16 w-auto max-w-[200px] object-contain border p-1 rounded-md bg-gray-50" />
            ) : (
                <div className="h-16 w-32 flex items-center justify-center bg-gray-100 rounded-md text-xs text-gray-400 border">Sem logo</div>
            )}
            <button onClick={() => logoInputRef.current?.click()} className="text-xs text-blue-600 hover:underline">
                Alterar Logo
            </button>
            <input 
                type="file" 
                accept="image/png, image/jpeg, image/svg+xml"
                ref={logoInputRef} 
                onChange={handleLogoChange} 
                className="hidden" 
            />
        </div>
        <div className="text-right space-y-1 flex-grow">
            <input 
                name="clinicName" 
                value={settings.clinicName} 
                onChange={handleSettingChange} 
                placeholder="Nome da Clínica" 
                className="w-full text-right font-bold text-lg p-1 rounded hover:bg-gray-100 focus:bg-gray-100 focus:ring-1 focus:ring-blue-500 outline-none" 
            />
            <input 
                name="clinicAddress" 
                value={settings.clinicAddress} 
                onChange={handleSettingChange} 
                placeholder="Endereço da Clínica" 
                className="w-full text-right text-sm p-1 rounded hover:bg-gray-100 focus:bg-gray-100 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <input 
                name="clinicPhone" 
                value={settings.clinicPhone} 
                onChange={handleSettingChange} 
                placeholder="Telefone da Clínica" 
                className="w-full text-right text-sm p-1 rounded hover:bg-gray-100 focus:bg-gray-100 focus:ring-1 focus:ring-blue-500 outline-none"
            />
        </div>
      </div>


      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Laudo Gerado</h2>
        <div className="relative">
            {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-md">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-gray-600">Gerando laudo com IA...</p>
                </div>
            </div>
            )}
            {error && (
            <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10 p-4 rounded-md">
                <p className="text-red-600 font-medium">{error}</p>
            </div>
            )}
            <div className="border border-gray-300 rounded-md">
                <RichTextToolbar />
                <div
                    ref={editorRef}
                    onInput={handleInput}
                    contentEditable={!isLoading}
                    data-placeholder="O laudo gerado pela IA aparecerá aqui após clicar em 'Gerar Laudo'."
                    className="report-editor w-full h-full min-h-[300px] p-3 text-sm bg-gray-50 rounded-b-md resize-y overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Editor de Laudo"
                />
            </div>
        </div>
      </div>

      {/* AI Suggestion Box */}
      <div className="border border-gray-200 rounded-md p-3 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
            <SparklesIcon />
            <h3 className="text-md font-semibold text-gray-700">Sugestão com IA</h3>
        </div>
        <div className="flex items-start gap-2">
            <div className="flex-grow space-y-2">
                <Input 
                    placeholder="Digite uma observação em linguagem simples. Ex: imagem ovalada ao lado da bexiga"
                    value={suggestionQuery}
                    onChange={(e) => setSuggestionQuery(e.target.value)}
                    disabled={isSuggestionLoading}
                />
                <div className="relative">
                    <textarea
                        readOnly
                        value={suggestionError || aiSuggestion}
                        className={`w-full h-24 p-2 text-sm rounded-md bg-white border ${suggestionError ? 'border-red-300 text-red-700' : 'border-gray-300'}`}
                        placeholder="A sugestão da IA aparecerá aqui..."
                    />
                    {isSuggestionLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-md">
                            <div className="w-6 h-6 border-2 border-blue-500 border-dashed rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                 <button 
                    onClick={handleGenerateSuggestion}
                    disabled={isSuggestionLoading || !suggestionQuery}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    Gerar
                </button>
                 <button 
                    onClick={handleCopySuggestion}
                    disabled={!aiSuggestion || isSuggestionLoading}
                    className="flex items-center justify-center px-4 py-2 bg-white border border-gray-400 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
                 >
                    <CopyIcon />
                    <span className="ml-2">{isSuggestionCopied ? 'Copiado!' : 'Copiar'}</span>
                </button>
            </div>
        </div>
      </div>

      {/* Clinical History Section */}
      <div className="border border-gray-200 rounded-md p-3 bg-slate-50">
          <h3 className="text-md font-semibold text-gray-700 mb-2">História Clínica Resumida (Sinais e Sintomas)</h3>
          <p className="text-xs text-gray-500 mb-2">Esta informação será usada pela IA para correlacionar com os achados e sugerir possíveis diagnósticos na conclusão.</p>
          <textarea
              className="w-full h-24 p-2 text-sm rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descreva as queixas do paciente e os sinais encontrados. Ex: Dor em hipocôndrio direito há 2 dias, febre, náuseas..."
              value={patientInfo.clinicalHistory || ''}
              onChange={(e) => setPatientInfo(prev => ({ ...prev, clinicalHistory: e.target.value }))}
          />
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={handleCopyReport}
          disabled={!report || isLoading}
          className="flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-md shadow-sm hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <CopyIcon />
          <span className="ml-2">{isReportCopied ? 'Copiado!' : 'Copiar Laudo'}</span>
        </button>
        <button
          onClick={handleSaveAndDownload}
          disabled={!report || isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <SaveIcon />
          Salvar Laudo (.doc)
        </button>
        <button
          onClick={handlePrint}
          disabled={!isReportSaved || isLoading}
          title={!isReportSaved ? "Você deve salvar o laudo antes de baixar." : "Baixar como PDF"}
          className="flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <PdfIcon />
          Baixar PDF
        </button>
        <button
          onClick={handlePrint}
          disabled={!isReportSaved || isLoading}
          title={!isReportSaved ? "Você deve salvar o laudo antes de imprimir." : "Imprimir Laudo"}
          className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <PrintIcon />
          Imprimir
        </button>
      </div>
      <style>{`
        .report-editor:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af; /* text-gray-400 */
            pointer-events: none;
            display: block;
        }
      `}</style>
    </div>
  );
};
