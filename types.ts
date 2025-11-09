export interface PatientDetails {
  name: string;
  sex: string;
  age: string;
  solicitante: string;
  examDate: string;
  ultrassonografista: string;
  crm: string;
  rqe: string;
  clinicalHistory: string;
}

export interface ClinicSettings {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  logo: string; // Base64 encoded image
}

export interface RenalFinding {
  id: string; // For React keys
  type: 'cisto' | 'nodulo' | 'calculo';
  size: string;
  location: 'terço superior' | 'terço médio' | 'terço inferior';
}

export interface HepaticLesion {
  id: string; // For React keys
  type: 'cisto_simples' | 'hemangioma' | 'nodulo_solido' | 'nodulo_hipoecoico' | 'metastase' | 'outro';
  size: string;
  segment: string;
  description: string; // For 'outro' or specific notes
}

export interface VesicularFinding {
  id: string;
  type: 'calculo' | 'polipo' | 'lama_biliar' | 'colesterolose' | 'espessamento_parietal';
  size?: string;
}

export interface PancreaticFinding {
  id: string;
  type: 'cisto' | 'nodulo' | 'calcificacao';
  size?: string;
  location?: 'cabeca' | 'corpo' | 'cauda';
}

export interface BladderFinding {
  id: string;
  type: 'calculo' | 'lesao_vegetante' | 'diverticulo' | 'coagulo';
  size?: string;
}

export interface AbdominalFormData {
  limitacoes: {
    biotipo: boolean;
    meteorismo: boolean;
  };
  figado: {
    dimensoes: 'normais' | 'aumentadas';
    medidas: {
      loboDireito: string;
      loboEsquerdo: string;
    };
    contornos: 'regulares' | 'irregulares';
    ecotextura: 'homogenea' | 'heterogenea';
    esteatose: {
      enabled: boolean;
      level: 'discreta' | 'moderada' | 'acentuada';
    };
    lesoesFocais: HepaticLesion[];
  };
  vesiculaBiliar: {
    status: 'normal' | 'ausente' | 'vazia';
    achados: VesicularFinding[];
    sinalMurphy: boolean;
  };
  viasBiliares: {
    status: 'normal' | 'ectasiado';
    calibre: string;
    calculo: boolean;
  };
  pancreas: {
    status: 'normal' | 'parcialmente_acessivel' | 'inacessivel' | 'sinais_pancreatite';
    achados: PancreaticFinding[];
    dilatacaoWirsung: {
      enabled: boolean;
      medida: string;
    };
  };
  baco: {
    status: 'normal' | 'aumentado' | 'ausente';
    medidaLongitudinal: string;
  };
  aorta: {
    status: 'normal' | 'ectasiada' | 'ausente' | 'placas';
    calibre: string;
  };
  veiaCava: {
    status: 'normal' | 'dilatada' | 'comprimida' | 'trombose';
    calibre: string;
  };
  alcasIntestinais: {
    status: 'nao_citar' | 'apendicite' | 'diverticulite' | 'apendice_nao_caracterizado';
  };
  rins: {
    rimDireitoPresente: boolean;
    rimEsquerdoPresente: boolean;
    exibirMedidas: boolean;
    medidasDireito: {
      longitudinal: string;
      parenquima: string;
      cortical: string;
    };
    medidasEsquerdo: {
      longitudinal: string;
      parenquima: string;
      cortical: string;
    };
    achadosDireito: RenalFinding[];
    achadosEsquerdo: RenalFinding[];
    microcalculosBilateral: boolean;
    dilatacao: {
      enabled: boolean;
      rim: 'direito' | 'esquerdo' | 'bilateral';
      ureteral: 'nenhum' | 'direito' | 'esquerdo' | 'bilateral';
    };
  };
  bexiga: {
    status: 'normal' | 'trabeculada' | 'insuficiente' | 'ecos_moveis';
    achados: BladderFinding[];
  };
  volumeVesical: {
    pre: [string, string, string];
    pos: [string, string, string];
  };
  liquidoLivre: {
    local: 'ausente' | 'abdome' | 'pelve' | 'fossa_hepato_renal' | 'flanco_direito' | 'flanco_esquerdo' | 'fossa_iliaca_direita' | 'fossa_iliaca_esquerda' | 'acumulo_focal';
    localizacaoFocal: string;
  };
  observacoesFinais: {
    sugerirGamaPropedêutica: boolean;
    abdomeGravidico: boolean;
    textoLivre: string;
  };
}

export interface SavedReport {
  id?: number;
  patient: PatientDetails;
  reportHtml: string;
  createdAt: Date;
}