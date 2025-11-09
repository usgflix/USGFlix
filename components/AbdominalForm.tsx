import React, { useState } from 'react';
import type { AbdominalFormData, RenalFinding, HepaticLesion, VesicularFinding, PancreaticFinding, BladderFinding } from '../types';
import { Section } from './ui/Section';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { ReferenceModal } from './ui/ReferenceModal';
import { referenceData } from '../utils/referenceData';


interface AbdominalFormProps {
  data: AbdominalFormData;
  setData: React.Dispatch<React.SetStateAction<AbdominalFormData>>;
}

const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);


export const AbdominalForm: React.FC<AbdominalFormProps> = ({ data, setData }) => {
  const [referenceModalKey, setReferenceModalKey] = useState<string | null>(null);
  
  const handleInputChange = <T extends keyof AbdominalFormData, P extends keyof AbdominalFormData[T]>(section: T, field: P, value: AbdominalFormData[T][P]) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleNestedInputChange = <T extends keyof AbdominalFormData, P extends keyof AbdominalFormData[T], N extends keyof AbdominalFormData[T][P]>(section: T, subSection: P, field: N, value: AbdominalFormData[T][P][N]) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value,
        },
      },
    }));
  };
  
  const handleVolumeChange = (type: 'pre' | 'pos', index: number, value: string) => {
    setData(prev => {
      const newVolumes = [...prev.volumeVesical[type]] as [string, string, string];
      newVolumes[index] = value;
      return {
        ...prev,
        volumeVesical: {
          ...prev.volumeVesical,
          [type]: newVolumes,
        },
      };
    });
  };
  
  const calculateVolume = (dims: [string, string, string]): string => {
    const [d1, d2, d3] = dims.map(Number);
    if (d1 > 0 && d2 > 0 && d3 > 0) {
      return ((d1 * d2 * d3) * 0.00052).toFixed(1) + ' ml';
    }
    return '0.0 ml';
  };

  const hepaticSegmentsOptions = [
      { value: 'nao_especificado', label: 'Segmento' },
      { value: 'I', label: 'I' },
      { value: 'II', label: 'II' },
      { value: 'III', label: 'III' },
      { value: 'IV', label: 'IV' },
      { value: 'V', label: 'V' },
      { value: 'VI', label: 'VI' },
      { value: 'VII', label: 'VII' },
      { value: 'VIII', label: 'VIII' },
  ];

  // --- Generic Handlers for Conditional Fields ---

  // Fix: This helper type ensures that the generic 'T' in handleStatusChangeWithMeasurement
  // only includes keys from AbdominalFormData whose values have a 'status' property.
  type SectionsWithStatus = {
    [K in keyof AbdominalFormData]: AbdominalFormData[K] extends { status: any } ? K : never
  }[keyof AbdominalFormData];

  const handleStatusChangeWithMeasurement = <T extends SectionsWithStatus>(
    section: T,
    newStatus: AbdominalFormData[T]['status'],
    abnormalStatus: AbdominalFormData[T]['status'],
    measurementField: keyof AbdominalFormData[T]
  ) => {
    setData(prev => {
      const newSectionState = { ...prev[section], status: newStatus };
      if (newStatus !== abnormalStatus) {
        (newSectionState as any)[measurementField] = '';
      }
      return { ...prev, [section]: newSectionState };
    });
  };

  const handleViasBiliaresStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'normal' | 'ectasiado';
    setData(prev => {
        const newViasBiliares = { ...prev.viasBiliares, status: newStatus };
        if (newStatus === 'normal') {
            newViasBiliares.calibre = '';
            newViasBiliares.calculo = false;
        }
        return { ...prev, viasBiliares: newViasBiliares };
    });
  };

  // --- Fígado Handlers ---
   const handleDimensoesFigadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDimensoes = e.target.value as 'normais' | 'aumentadas';
    setData(prev => {
      const newFigadoState = { ...prev.figado, dimensoes: newDimensoes };
      // If dimensions are set back to normal, clear the measurements
      if (newDimensoes === 'normais') {
        newFigadoState.medidas = { loboDireito: '', loboEsquerdo: '' };
      }
      return { ...prev, figado: newFigadoState };
    });
  };

  const handleAddHepaticLesion = () => {
    const newLesion: HepaticLesion = {
      id: crypto.randomUUID(),
      type: 'cisto_simples',
      size: '',
      segment: 'nao_especificado',
      description: '',
    };
    setData(prev => ({
      ...prev,
      figado: {
        ...prev.figado,
        lesoesFocais: [...prev.figado.lesoesFocais, newLesion]
      }
    }));
  };

  const handleRemoveHepaticLesion = (id: string) => {
    setData(prev => ({
      ...prev,
      figado: {
        ...prev.figado,
        lesoesFocais: prev.figado.lesoesFocais.filter(lesion => lesion.id !== id)
      }
    }));
  };

  const handleUpdateHepaticLesion = (id: string, field: keyof HepaticLesion, value: string) => {
    setData(prev => ({
      ...prev,
      figado: {
        ...prev.figado,
        lesoesFocais: prev.figado.lesoesFocais.map(lesion =>
          lesion.id === id ? { ...lesion, [field]: value } : lesion
        )
      }
    }));
  };

  // --- Rins Handlers ---
  const handleExibirMedidasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setData(prev => {
        const newRinsData = { ...prev.rins, exibirMedidas: isChecked };
        if (!isChecked) {
            newRinsData.medidasDireito = { longitudinal: '', parenquima: '', cortical: '' };
            newRinsData.medidasEsquerdo = { longitudinal: '', parenquima: '', cortical: '' };
        }
        return { ...prev, rins: newRinsData };
    });
  };

   const handleRinsMedidaChange = (side: 'Direito' | 'Esquerdo', field: 'longitudinal' | 'parenquima' | 'cortical', value: string) => {
    const sideKey = `medidas${side}` as 'medidasDireito' | 'medidasEsquerdo';
    setData(prev => ({
      ...prev,
      rins: {
        ...prev.rins,
        [sideKey]: {
          ...prev.rins[sideKey],
          [field]: value,
        }
      }
    }));
  };
  
  const handleAddFinding = (side: 'direito' | 'esquerdo') => {
    const newFinding: RenalFinding = {
      id: crypto.randomUUID(),
      type: 'cisto',
      size: '',
      location: 'terço médio',
    };
    const key = side === 'direito' ? 'achadosDireito' : 'achadosEsquerdo';
    const updatedFindings = [...data.rins[key], newFinding];
    handleInputChange('rins', key, updatedFindings as any);
  };

  const handleRemoveFinding = (side: 'direito' | 'esquerdo', id: string) => {
    const key = side === 'direito' ? 'achadosDireito' : 'achadosEsquerdo';
    const updatedFindings = data.rins[key].filter(finding => finding.id !== id);
    handleInputChange('rins', key, updatedFindings as any);
  };

  const handleUpdateFinding = (side: 'direito' | 'esquerdo', id: string, field: keyof RenalFinding, value: string) => {
    const key = side === 'direito' ? 'achadosDireito' : 'achadosEsquerdo';
    const updatedFindings = data.rins[key].map(finding => 
      finding.id === id ? { ...finding, [field]: value } : finding
    );
    handleInputChange('rins', key, updatedFindings as any);
  };

  const handleLiquidoLivreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLocal = e.target.value;
      setData(prev => {
          const newLiquidoLivre = { ...prev.liquidoLivre, local: newLocal };
          if (newLocal !== 'acumulo_focal') {
              newLiquidoLivre.localizacaoFocal = '';
          }
          return { ...prev, liquidoLivre: newLiquidoLivre as any };
      });
  };

  // --- Dynamic Findings Editors ---

  const HepaticLesionsEditor: React.FC = () => {
    const lesions = data.figado.lesoesFocais;
    const lesionTypeOptions = [
      { value: 'cisto_simples', label: 'Cisto Simples' },
      { value: 'hemangioma', label: 'Hemangioma' },
      { value: 'nodulo_solido', label: 'Nódulo Sólido' },
      { value: 'nodulo_hipoecoico', label: 'Nódulo Hipoecoico' },
      { value: 'metastase', label: 'Metástase' },
      { value: 'outro', label: 'Outro' },
    ];

    return (
      <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="font-semibold text-gray-700">Lesões Focais Hepáticas</h4>
        {lesions.length === 0 && <p className="text-xs text-gray-500">Nenhuma lesão adicionada.</p>}
        {lesions.map((lesion) => (
          <div key={lesion.id} className="grid grid-cols-1 sm:grid-cols-[2fr,1fr,1.5fr,2fr] gap-2 items-center p-2 border-b">
            <Select
              value={lesion.type}
              onChange={(e) => handleUpdateHepaticLesion(lesion.id, 'type', e.target.value)}
              options={lesionTypeOptions}
            />
            <Input
              placeholder="Tamanho (mm)"
              type="number"
              value={lesion.size}
              onChange={(e) => handleUpdateHepaticLesion(lesion.id, 'size', e.target.value)}
            />
            <Select
              value={lesion.segment}
              onChange={(e) => handleUpdateHepaticLesion(lesion.id, 'segment', e.target.value)}
              options={hepaticSegmentsOptions}
            />
            <div className="flex items-center gap-1">
              {lesion.type === 'outro' && (
                <Input
                  placeholder="Descrição"
                  type="text"
                  value={lesion.description}
                  onChange={(e) => handleUpdateHepaticLesion(lesion.id, 'description', e.target.value)}
                />
              )}
              <button
                onClick={() => handleRemoveHepaticLesion(lesion.id)}
                className="flex-shrink-0 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1.5 transition-colors"
                title="Remover Lesão"
              >
                <RemoveIcon />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={handleAddHepaticLesion}
          className="text-sm text-blue-600 font-medium hover:underline mt-2"
        >
          + Adicionar Lesão Focal
        </button>
      </div>
    );
  };
  
  const VesiculaFindingsEditor: React.FC = () => {
    const achados = data.vesiculaBiliar.achados;
    const typeOptions = [
        { value: 'calculo', label: 'Cálculo' },
        { value: 'polipo', label: 'Pólipo' },
        { value: 'lama_biliar', label: 'Lama Biliar' },
        { value: 'colesterolose', label: 'Colesterolose' },
        { value: 'espessamento_parietal', label: 'Espessamento Parietal' },
    ];

    const handleAdd = () => {
        const newFinding: VesicularFinding = { id: crypto.randomUUID(), type: 'calculo', size: '' };
        setData(prev => ({ ...prev, vesiculaBiliar: { ...prev.vesiculaBiliar, achados: [...prev.vesiculaBiliar.achados, newFinding] } }));
    };

    const handleRemove = (id: string) => {
        setData(prev => ({ ...prev, vesiculaBiliar: { ...prev.vesiculaBiliar, achados: prev.vesiculaBiliar.achados.filter(f => f.id !== id) } }));
    };

    const handleUpdate = (id: string, field: keyof VesicularFinding, value: string) => {
        setData(prev => ({ ...prev, vesiculaBiliar: { ...prev.vesiculaBiliar, achados: prev.vesiculaBiliar.achados.map(f => f.id === id ? { ...f, [field]: value } : f) } }));
    };

    return (
        <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-semibold text-gray-700">Achados Focais na Vesícula</h4>
            {achados.length === 0 && <p className="text-xs text-gray-500">Nenhum achado adicionado.</p>}
            {achados.map(achado => {
                const hasSize = achado.type === 'calculo' || achado.type === 'polipo' || achado.type === 'espessamento_parietal';
                return (
                    <div key={achado.id} className="grid grid-cols-[2fr,1fr,auto] gap-2 items-center p-2 border-b">
                        <Select value={achado.type} onChange={e => handleUpdate(achado.id, 'type', e.target.value)} options={typeOptions} />
                        <Input placeholder="Tamanho (mm)" type="number" value={achado.size} onChange={e => handleUpdate(achado.id, 'size', e.target.value)} disabled={!hasSize} />
                        <button onClick={() => handleRemove(achado.id)} className="flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1.5 transition-colors" title="Remover Achado"><RemoveIcon /></button>
                    </div>
                );
            })}
            <button onClick={handleAdd} className="text-sm text-blue-600 font-medium hover:underline mt-2">+ Adicionar Achado</button>
        </div>
    );
  };

  const PancreasFindingsEditor: React.FC = () => {
    const achados = data.pancreas.achados;
    const typeOptions = [{ value: 'cisto', label: 'Cisto' }, { value: 'nodulo', label: 'Nódulo' }, { value: 'calcificacao', label: 'Calcificação' }];
    const locationOptions = [{ value: '', label: 'Local' }, { value: 'cabeca', label: 'Cabeça' }, { value: 'corpo', label: 'Corpo' }, { value: 'cauda', label: 'Cauda' }];

    const handleAdd = () => {
        const newFinding: PancreaticFinding = { id: crypto.randomUUID(), type: 'cisto', size: '', location: 'corpo' };
        setData(prev => ({ ...prev, pancreas: { ...prev.pancreas, achados: [...prev.pancreas.achados, newFinding] } }));
    };
    const handleRemove = (id: string) => setData(prev => ({ ...prev, pancreas: { ...prev.pancreas, achados: prev.pancreas.achados.filter(f => f.id !== id) } }));
    const handleUpdate = (id: string, field: keyof PancreaticFinding, value: string) => setData(prev => ({ ...prev, pancreas: { ...prev.pancreas, achados: prev.pancreas.achados.map(f => (f.id === id ? { ...f, [field]: value } : f)) } }));

    return (
        <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-semibold text-gray-700">Achados Focais no Pâncreas</h4>
            {achados.length === 0 && <p className="text-xs text-gray-500">Nenhum achado adicionado.</p>}
            {achados.map(achado => (
                <div key={achado.id} className="grid grid-cols-[1.5fr,1fr,1fr,auto] gap-2 items-center p-2 border-b">
                    <Select value={achado.type} onChange={e => handleUpdate(achado.id, 'type', e.target.value)} options={typeOptions} />
                    <Input placeholder="Tamanho (mm)" type="number" value={achado.size} onChange={e => handleUpdate(achado.id, 'size', e.target.value)} />
                    <Select value={achado.location} onChange={e => handleUpdate(achado.id, 'location', e.target.value as any)} options={locationOptions} />
                    <button onClick={() => handleRemove(achado.id)} className="flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1.5 transition-colors" title="Remover Achado"><RemoveIcon /></button>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm text-blue-600 font-medium hover:underline mt-2">+ Adicionar Achado</button>
        </div>
    );
  };
  
  const BladderFindingsEditor: React.FC = () => {
    const achados = data.bexiga.achados;
    const typeOptions = [
        { value: 'calculo', label: 'Cálculo' },
        { value: 'lesao_vegetante', label: 'Lesão Vegetante' },
        { value: 'diverticulo', label: 'Divertículo' },
        { value: 'coagulo', label: 'Coágulo' },
    ];

    const handleAdd = () => {
        const newFinding: BladderFinding = { id: crypto.randomUUID(), type: 'calculo', size: '' };
        setData(prev => ({ ...prev, bexiga: { ...prev.bexiga, achados: [...prev.bexiga.achados, newFinding] } }));
    };
    const handleRemove = (id: string) => setData(prev => ({ ...prev, bexiga: { ...prev.bexiga, achados: prev.bexiga.achados.filter(f => f.id !== id) } }));
    const handleUpdate = (id: string, field: keyof BladderFinding, value: string) => setData(prev => ({ ...prev, bexiga: { ...prev.bexiga, achados: prev.bexiga.achados.map(f => (f.id === id ? { ...f, [field]: value } : f)) } }));
    
    return (
        <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-semibold text-gray-700">Achados Focais na Bexiga</h4>
            {achados.length === 0 && <p className="text-xs text-gray-500">Nenhum achado adicionado.</p>}
            {achados.map(achado => (
                 <div key={achado.id} className="grid grid-cols-[2fr,1fr,auto] gap-2 items-center p-2 border-b">
                    <Select value={achado.type} onChange={e => handleUpdate(achado.id, 'type', e.target.value)} options={typeOptions} />
                    <Input placeholder="Tamanho (mm)" type="number" value={achado.size} onChange={e => handleUpdate(achado.id, 'size', e.target.value)} />
                    <button onClick={() => handleRemove(achado.id)} className="flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1.5 transition-colors" title="Remover Achado"><RemoveIcon /></button>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm text-blue-600 font-medium hover:underline mt-2">+ Adicionar Achado</button>
        </div>
    );
  };

  const KidneyFindingsEditor: React.FC<{ side: 'direito' | 'esquerdo' }> = ({ side }) => {
    const sideKey = side === 'direito' ? 'achadosDireito' : 'achadosEsquerdo';
    const findings = data.rins[sideKey];

    return (
      <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="font-semibold text-gray-700">Achados Focais no Rim {side.charAt(0).toUpperCase() + side.slice(1)}</h4>
        {findings.length === 0 && <p className="text-xs text-gray-500">Nenhum achado adicionado.</p>}
        {findings.map((finding) => (
          <div key={finding.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center p-2 border-b">
            <Select
              value={finding.type}
              onChange={(e) => handleUpdateFinding(side, finding.id, 'type', e.target.value)}
              options={[{ value: 'cisto', label: 'Cisto' }, { value: 'nodulo', label: 'Nódulo' }, { value: 'calculo', label: 'Cálculo' }]}
            />
            <Input
              placeholder="Tamanho (mm)"
              type="number"
              value={finding.size}
              onChange={(e) => handleUpdateFinding(side, finding.id, 'size', e.target.value)}
            />
            <Select
              value={finding.location}
              onChange={(e) => handleUpdateFinding(side, finding.id, 'location', e.target.value)}
              options={[{ value: 'terço superior', label: 'Terço Superior' }, { value: 'terço médio', label: 'Terço Médio' }, { value: 'terço inferior', label: 'Terço Inferior' }]}
            />
            <button
              onClick={() => handleRemoveFinding(side, finding.id)}
              className="flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1.5 transition-colors"
              title="Remover Achado"
            >
              <RemoveIcon />
            </button>
          </div>
        ))}
        <button
          onClick={() => handleAddFinding(side)}
          className="text-sm text-blue-600 font-medium hover:underline mt-2"
        >
          + Adicionar Achado Focal
        </button>
      </div>
    );
  };

  const SectionTitleWithInfo: React.FC<{ title: string; modalKey: string }> = ({ title, modalKey }) => (
    <div className="flex items-center justify-between">
        <span>{title}</span>
        <button 
            onClick={() => setReferenceModalKey(modalKey)} 
            className="hover:bg-slate-600 rounded-full p-1 transition-colors" 
            title="Ver Valores de Referência"
            type="button"
        >
            <InfoIcon />
        </button>
    </div>
  );


  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {referenceModalKey && referenceData[referenceModalKey] && (
        <ReferenceModal
            title={referenceData[referenceModalKey].title}
            content={referenceData[referenceModalKey].content}
            onClose={() => setReferenceModalKey(null)}
        />
      )}
      <div className="space-y-4">
        {/* Limitações Técnicas */}
        <Section title="Limitações Técnicas">
          <div className="flex space-x-4">
            <label className="flex items-center"><input type="checkbox" className="mr-2" checked={data.limitacoes.biotipo} onChange={e => handleInputChange('limitacoes', 'biotipo', e.target.checked)} />Biotipo</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" checked={data.limitacoes.meteorismo} onChange={e => handleInputChange('limitacoes', 'meteorismo', e.target.checked)} />Meteorismo Intestinal</label>
          </div>
        </Section>
        {/* Fígado */}
        <Section title={<SectionTitleWithInfo title="Fígado" modalKey="figado" />}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select 
                  label="Dimensões"
                  options={[{value:'normais', label:'Normais'}, {value:'aumentadas', label:'Aumentadas (Hepatomegalia)'}]} 
                  value={data.figado.dimensoes} 
                  onChange={handleDimensoesFigadoChange} 
              />
              <Select 
                  label="Contornos"
                  options={[{value:'regulares', label:'Regulares'}, {value:'irregulares', label:'Irregulares / Serrilhados'}]} 
                  value={data.figado.contornos} 
                  onChange={e => handleInputChange('figado', 'contornos', e.target.value as any)} 
              />
              <Select 
                  label="Ecotextura"
                  options={[{value:'homogenea', label:'Homogênea'}, {value:'heterogenea', label:'Heterogênea Difusa'}]} 
                  value={data.figado.ecotextura} 
                  onChange={e => handleInputChange('figado', 'ecotextura', e.target.value as any)} 
              />
          </div>

          {data.figado.dimensoes === 'aumentadas' && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <Input 
                    label="Lobo Direito (mm)"
                    type="number"
                    placeholder="Eixo longitudinal"
                    value={data.figado.medidas.loboDireito}
                    onChange={e => handleNestedInputChange('figado', 'medidas', 'loboDireito', e.target.value)}
                />
                 <Input 
                    label="Lobo Esquerdo (mm)"
                    type="number"
                    placeholder="Eixo longitudinal"
                    value={data.figado.medidas.loboEsquerdo}
                    onChange={e => handleNestedInputChange('figado', 'medidas', 'loboEsquerdo', e.target.value)}
                />
            </div>
          )}

          <div className="border-t pt-4 mt-4 space-y-4">
              <div className="flex items-center space-x-2">
                <label className="flex items-center whitespace-nowrap"><input type="checkbox" className="mr-2" checked={data.figado.esteatose.enabled} onChange={e => handleNestedInputChange('figado', 'esteatose', 'enabled', e.target.checked)} />Infiltração Gordurosa (Esteatose)</label>
                <Select 
                    disabled={!data.figado.esteatose.enabled} 
                    options={[
                        {value:'discreta', label:'Leve (Grau I)'}, 
                        {value:'moderada', label:'Moderada (Grau II)'}, 
                        {value:'acentuada', label:'Acentuada (Grau III)'}
                    ]} 
                    value={data.figado.esteatose.level} 
                    onChange={e => handleNestedInputChange('figado', 'esteatose', 'level', e.target.value as any)} 
                />
              </div>

              <div className="border-t pt-4">
                  <HepaticLesionsEditor />
              </div>
          </div>
        </Section>
         {/* Vesícula Biliar */}
        <Section title={<SectionTitleWithInfo title="Vesícula Biliar" modalKey="vesiculaBiliar" />}>
          <div className="space-y-4">
              <Select 
                  label="Status Geral"
                  options={[{value:'normal', label:'Normal / Presente'}, {value:'ausente', label:'Ausente (Pós-colecistectomia)'}, {value:'vazia', label:'Vazia / Contraída'}]}
                  value={data.vesiculaBiliar.status}
                  onChange={e => handleInputChange('vesiculaBiliar', 'status', e.target.value as any)}
              />
              <div className="border-t pt-3 mt-3">
                  <VesiculaFindingsEditor />
              </div>
              <div className="border-t pt-3 mt-3">
                  <label className="flex items-center">
                      <input 
                          type="checkbox" 
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={data.vesiculaBiliar.sinalMurphy} 
                          onChange={e => handleInputChange('vesiculaBiliar', 'sinalMurphy', e.target.checked)} 
                      />
                      Sinal de Murphy Positivo
                  </label>
              </div>
          </div>
        </Section>
        {/* Vias Biliares */}
        <Section title={<SectionTitleWithInfo title="Vias Biliares" modalKey="viasBiliares" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <Select 
                    label="Colédoco"
                    options={[{value:'normal', label:'Calibre Normal'}, {value:'ectasiado', label:'Ectasiado'}]} 
                    value={data.viasBiliares.status} 
                    onChange={handleViasBiliaresStatusChange} 
                />
                {data.viasBiliares.status === 'ectasiado' && (
                    <div className="flex items-center space-x-2 animate-fade-in">
                        <Input 
                            label="Calibre (mm)"
                            placeholder="calibre"
                            type="number" 
                            value={data.viasBiliares.calibre} 
                            onChange={e => handleInputChange('viasBiliares', 'calibre', e.target.value)} 
                        />
                        <label className="flex items-center pt-6 whitespace-nowrap">
                            <input 
                                type="checkbox" 
                                className="mr-2 h-4 w-4"
                                checked={data.viasBiliares.calculo} 
                                onChange={e => handleInputChange('viasBiliares', 'calculo', e.target.checked)} 
                            />
                            Cálculo
                        </label>
                    </div>
                )}
            </div>
        </Section>
        {/* Pâncreas, Baço, Aorta, Alças */}
        <Section title={<SectionTitleWithInfo title="Pâncreas" modalKey="pancreas" />}>
          <div className="space-y-4">
              <Select 
                  label="Status Geral"
                  options={[
                      {value:'normal',label:'Normal'},
                      {value:'parcialmente_acessivel',label:'Parcialmente acessível'},
                      {value:'inacessivel',label:'Inacessível'},
                      {value:'sinais_pancreatite',label:'Sinais de Pancreatite'}
                  ]} 
                  value={data.pancreas.status} 
                  onChange={e => handleInputChange('pancreas', 'status', e.target.value as any)} 
              />
              <div className="border-t pt-3 space-y-3">
                  <PancreasFindingsEditor />
                  <div className="flex items-center space-x-2 border-t pt-3">
                      <label className="flex items-center whitespace-nowrap">
                          <input 
                              type="checkbox" 
                              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={data.pancreas.dilatacaoWirsung.enabled}
                              onChange={e => handleNestedInputChange('pancreas', 'dilatacaoWirsung', 'enabled', e.target.checked)}
                          />
                          Dilatação do Ducto de Wirsung
                      </label>
                      <Input 
                          type="number" 
                          placeholder="medida (mm)"
                          disabled={!data.pancreas.dilatacaoWirsung.enabled}
                          value={data.pancreas.dilatacaoWirsung.medida}
                          onChange={e => handleNestedInputChange('pancreas', 'dilatacaoWirsung', 'medida', e.target.value)}
                      />
                  </div>
              </div>
          </div>
        </Section>
        <Section title={<SectionTitleWithInfo title="Baço" modalKey="baco" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <Select options={[{value:'normal',label:'Normal'},{value:'aumentado',label:'Aumentado (Esplenomegalia)'},{value:'ausente',label:'Ausente'}]} 
                    value={data.baco.status} 
                    onChange={e => handleStatusChangeWithMeasurement('baco', e.target.value as any, 'aumentado', 'medidaLongitudinal')} 
                />
                {data.baco.status === 'aumentado' && (
                    <Input 
                        label="Eixo Longitudinal (mm)"
                        type="number"
                        value={data.baco.medidaLongitudinal}
                        onChange={e => handleInputChange('baco', 'medidaLongitudinal', e.target.value)}
                        className="animate-fade-in"
                    />
                )}
            </div>
        </Section>
        <Section title={<SectionTitleWithInfo title="Aorta e Vasos" modalKey="aortaEVasos" />}>
            <div className="space-y-4">
                {/* Aorta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <Select 
                        label="Aorta"
                        options={[{value:'normal',label:'Normal'},{value:'ectasiada',label:'Ectasiada'},{value:'placas',label:'Com Placas Ateromatosas'},{value:'ausente',label:'Não Avaliável'}]} 
                        value={data.aorta.status} 
                        onChange={e => handleStatusChangeWithMeasurement('aorta', e.target.value as any, 'ectasiada', 'calibre')} 
                    />
                    {data.aorta.status === 'ectasiada' && (
                        <Input 
                            label="Calibre Máximo (mm)"
                            type="number"
                            value={data.aorta.calibre}
                            onChange={e => handleInputChange('aorta', 'calibre', e.target.value)}
                            className="animate-fade-in"
                        />
                    )}
                </div>
                
                {/* Veia Cava Inferior */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <Select 
                        label="Veia Cava Inferior"
                        options={[
                            {value:'normal',label:'Normal'},
                            {value:'dilatada',label:'Dilatada'},
                            {value:'comprimida',label:'Comprimida'},
                            {value:'trombose',label:'Sinais de Trombose'}
                        ]} 
                        value={data.veiaCava.status} 
                        onChange={e => handleStatusChangeWithMeasurement('veiaCava', e.target.value as any, 'dilatada', 'calibre')} 
                    />
                    {data.veiaCava.status === 'dilatada' && (
                        <Input 
                            label="Calibre Máximo (mm)"
                            type="number"
                            value={data.veiaCava.calibre}
                            onChange={e => handleInputChange('veiaCava', 'calibre', e.target.value)}
                            className="animate-fade-in"
                        />
                    )}
                </div>
            </div>
        </Section>
        <Section title="Alças Intestinais"><Select options={[{value:'nao_citar',label:'Não Citar'},{value:'apendicite',label:'Apendicite'},{value:'diverticulite',label:'Diverticulite'}, {value:'apendice_nao_caracterizado', label:'Apêndice não caracterizado'}]} value={data.alcasIntestinais.status} onChange={e => handleInputChange('alcasIntestinais', 'status', e.target.value as any)} /></Section>
      </div>
      <div className="space-y-4">
        {/* Rins e Ureteres */}
        <Section title={<SectionTitleWithInfo title="Rins e Ureteres" modalKey="rins" />}>
           <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4">
                    <label className="flex items-center font-medium">
                        <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={data.rins.rimDireitoPresente} onChange={e => handleInputChange('rins', 'rimDireitoPresente', e.target.checked)} />
                        Rim Direito Presente
                    </label>
                    <label className="flex items-center font-medium">
                        <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={data.rins.rimEsquerdoPresente} onChange={e => handleInputChange('rins', 'rimEsquerdoPresente', e.target.checked)} />
                        Rim Esquerdo Presente
                    </label>
                </div>

                <div className="border-b pb-4">
                    <label className="flex items-center font-medium">
                        <input
                            type="checkbox"
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={data.rins.exibirMedidas}
                            onChange={handleExibirMedidasChange}
                        />
                        Adicionar Medidas Renais
                    </label>
                </div>

                {data.rins.exibirMedidas && (
                    <div className="border-b pb-4 animate-fade-in">
                        <h4 className="font-semibold text-gray-700 mb-2">Medidas (mm)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            {/* Coluna Direita */}
                            <div className="space-y-2 p-2 bg-gray-50 rounded border">
                                <p className="font-medium text-sm text-center">Rim Direito</p>
                                <Input label="Eixo Longitudinal:" type="number" disabled={!data.rins.rimDireitoPresente} value={data.rins.medidasDireito.longitudinal} onChange={e => handleRinsMedidaChange('Direito', 'longitudinal', e.target.value)} />
                                <Input label="Parênquima:" type="number" disabled={!data.rins.rimDireitoPresente} value={data.rins.medidasDireito.parenquima} onChange={e => handleRinsMedidaChange('Direito', 'parenquima', e.target.value)} />
                                <Input label="Cortical:" type="number" disabled={!data.rins.rimDireitoPresente} value={data.rins.medidasDireito.cortical} onChange={e => handleRinsMedidaChange('Direito', 'cortical', e.target.value)} />
                            </div>
                            {/* Coluna Esquerda */}
                            <div className="space-y-2 p-2 bg-gray-50 rounded border">
                                <p className="font-medium text-sm text-center">Rim Esquerdo</p>
                                <Input label="Eixo Longitudinal:" type="number" disabled={!data.rins.rimEsquerdoPresente} value={data.rins.medidasEsquerdo.longitudinal} onChange={e => handleRinsMedidaChange('Esquerdo', 'longitudinal', e.target.value)} />
                                <Input label="Parênquima:" type="number" disabled={!data.rins.rimEsquerdoPresente} value={data.rins.medidasEsquerdo.parenquima} onChange={e => handleRinsMedidaChange('Esquerdo', 'parenquima', e.target.value)} />
                                <Input label="Cortical:" type="number" disabled={!data.rins.rimEsquerdoPresente} value={data.rins.medidasEsquerdo.cortical} onChange={e => handleRinsMedidaChange('Esquerdo', 'cortical', e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}


                {data.rins.rimDireitoPresente && <KidneyFindingsEditor side="direito" />}
                {data.rins.rimEsquerdoPresente && <KidneyFindingsEditor side="esquerdo" />}
                
                <div className="border-t pt-4">
                  <label className="flex items-center font-medium">
                        <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={data.rins.microcalculosBilateral} onChange={e => handleInputChange('rins', 'microcalculosBilateral', e.target.checked)} />
                        Microcálculos renais bilaterais
                    </label>
                </div>


               <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-gray-700">Dilatação</h4>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                      <label className="flex items-center font-medium">
                          <input type="checkbox" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={data.rins.dilatacao.enabled} onChange={e => handleNestedInputChange('rins', 'dilatacao', 'enabled', e.target.checked)} />
                          Pielocalicial
                      </label>
                      <Select 
                          disabled={!data.rins.dilatacao.enabled} 
                          options={[
                              {value:'direito', label:'Direito'},
                              {value:'esquerdo', label:'Esquerdo'}, 
                              {value:'bilateral', label:'Bilateral'}
                          ]} 
                          value={data.rins.dilatacao.rim} 
                          onChange={e => handleNestedInputChange('rins', 'dilatacao', 'rim', e.target.value as any)} 
                      />
                  </div>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 pl-6">
                      <label className="text-sm font-medium text-gray-800 self-center">
                          ...e Ureteral:
                      </label>
                      <Select 
                          disabled={!data.rins.dilatacao.enabled} 
                          options={[
                              {value:'nenhum', label:'Nenhuma'},
                              {value:'direito', label:'Direito'},
                              {value:'esquerdo', label:'Esquerdo'}, 
                              {value:'bilateral', label:'Bilateral'}
                          ]} 
                          value={data.rins.dilatacao.ureteral} 
                          onChange={e => handleNestedInputChange('rins', 'dilatacao', 'ureteral', e.target.value as any)} 
                      />
                  </div>
              </div>
           </div>
        </Section>
        {/* Bexiga */}
        <Section title={<SectionTitleWithInfo title="Bexiga" modalKey="bexiga" />}>
          <div className="space-y-4">
            <Select 
              label="Status Geral"
              options={[
                {value:'normal',label:'Normal'},
                {value:'trabeculada',label:'Difusamente Trabeculada'},
                {value:'insuficiente',label:'Com repleção insuficiente'},
                {value:'ecos_moveis', label:'Ecos móveis em suspensão'}
              ]} 
              value={data.bexiga.status} 
              onChange={e => handleInputChange('bexiga', 'status', e.target.value as any)} 
            />
            <div className="border-t pt-3">
              <BladderFindingsEditor />
            </div>
          </div>
        </Section>
        {/* Volume Vesical */}
        <Section title="Volume Vesical Pré e Pós Miccional (Resíduo)">
          <div className="space-y-2">
            <p className="text-sm font-medium">Vol. pré-miccional (mm):</p>
            <div className="flex items-center space-x-2">
              <Input type="number" value={data.volumeVesical.pre[0]} onChange={e => handleVolumeChange('pre', 0, e.target.value)} />
              <span className="text-gray-500">x</span>
              <Input type="number" value={data.volumeVesical.pre[1]} onChange={e => handleVolumeChange('pre', 1, e.target.value)} />
              <span className="text-gray-500">x</span>
              <Input type="number" value={data.volumeVesical.pre[2]} onChange={e => handleVolumeChange('pre', 2, e.target.value)} />
              <span className="text-sm font-semibold w-24 text-right">{calculateVolume(data.volumeVesical.pre)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Resíduo (mm):</p>
            <div className="flex items-center space-x-2">
              <Input type="number" value={data.volumeVesical.pos[0]} onChange={e => handleVolumeChange('pos', 0, e.target.value)} />
              <span className="text-gray-500">x</span>
              <Input type="number" value={data.volumeVesical.pos[1]} onChange={e => handleVolumeChange('pos', 1, e.target.value)} />
              <span className="text-gray-500">x</span>
              <Input type="number" value={data.volumeVesical.pos[2]} onChange={e => handleVolumeChange('pos', 2, e.target.value)} />
              <span className="text-sm font-semibold w-24 text-right">{calculateVolume(data.volumeVesical.pos)}</span>
            </div>
          </div>
        </Section>
        {/* Líquido Livre */}
        <Section title="Líquido Livre">
          <div className="space-y-2">
            <Select 
              options={[
                {value:'ausente',label:'Ausente'},
                {value:'abdome',label:'Abdome'},
                {value:'pelve',label:'Pelve'},
                {value:'fossa_hepato_renal',label:'Fossa Hepato-Renal'},
                {value:'flanco_direito',label:'Flanco Direito'},
                {value:'flanco_esquerdo',label:'Flanco Esquerdo'},
                {value:'fossa_iliaca_direita',label:'Fossa Ilíaca Direita'},
                {value:'fossa_iliaca_esquerda',label:'Fossa Ilíaca Esquerda'},
                {value:'acumulo_focal',label:'Acúmulo Focal'},
              ]} 
              value={data.liquidoLivre.local} 
              onChange={handleLiquidoLivreChange} 
            />
             {data.liquidoLivre.local === 'acumulo_focal' && (
                <div className="pl-2 animate-fade-in">
                    <Input
                        placeholder="Especifique a localização focal..."
                        value={data.liquidoLivre.localizacaoFocal}
                        onChange={e => handleInputChange('liquidoLivre', 'localizacaoFocal', e.target.value)}
                    />
                </div>
            )}
          </div>
        </Section>
        {/* Observações Finais */}
        <Section title="Observações Finais">
          <div className="space-y-4">
            <div className="space-y-2">
                <label className="flex items-start">
                  <input 
                    type="checkbox" 
                    className="mr-2 mt-1 flex-shrink-0" 
                    checked={data.observacoesFinais.sugerirGamaPropedêutica} 
                    onChange={e => handleInputChange('observacoesFinais', 'sugerirGamaPropedêutica', e.target.checked)} 
                  />
                  <span className="text-sm">Sugere-se aumentar a gama propedêutica para elucidação diagnóstica e correlacionar com a clínica.</span>
                </label>
                <label className="flex items-start">
                  <input 
                    type="checkbox" 
                    className="mr-2 mt-1 flex-shrink-0" 
                    checked={data.observacoesFinais.abdomeGravidico} 
                    onChange={e => handleInputChange('observacoesFinais', 'abdomeGravidico', e.target.checked)} 
                  />
                  <span className="text-sm">Observa-se abdome gravídico, com útero aumentado conforme esperado para gestação. Avaliação obstétrica detalhada deve ser realizada por exame ultrassonográfico específico obstétrico, caso necessário.</span>
                </label>
            </div>
            <div>
              <label htmlFor="textoLivreObs" className="block text-sm font-medium text-gray-700 mb-1">Observação Adicional:</label>
              <textarea
                id="textoLivreObs"
                rows={3}
                className="block w-full px-2 py-1 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Adicione aqui qualquer observação adicional..."
                value={data.observacoesFinais.textoLivre}
                onChange={e => handleInputChange('observacoesFinais', 'textoLivre', e.target.value)}
              />
            </div>
          </div>
        </Section>
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
    `}</style>
    </div>
  );
};