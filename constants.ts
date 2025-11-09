import type { AbdominalFormData } from './types';

export const initialAbdominalFormData: AbdominalFormData = {
  limitacoes: { biotipo: false, meteorismo: false },
  figado: {
    dimensoes: 'normais',
    medidas: { loboDireito: '', loboEsquerdo: '' },
    contornos: 'regulares',
    ecotextura: 'homogenea',
    esteatose: { enabled: false, level: 'discreta' },
    lesoesFocais: [],
  },
  vesiculaBiliar: { status: 'normal', achados: [], sinalMurphy: false },
  viasBiliares: { status: 'normal', calibre: '', calculo: false },
  pancreas: { 
    status: 'normal',
    achados: [],
    dilatacaoWirsung: { enabled: false, medida: '' },
  },
  baco: { status: 'normal', medidaLongitudinal: '' },
  aorta: { status: 'normal', calibre: '' },
  veiaCava: { status: 'normal', calibre: '' },
  alcasIntestinais: { status: 'nao_citar' },
  rins: {
    rimDireitoPresente: true,
    rimEsquerdoPresente: true,
    exibirMedidas: false,
    medidasDireito: {
      longitudinal: '',
      parenquima: '',
      cortical: '',
    },
    medidasEsquerdo: {
      longitudinal: '',
      parenquima: '',
      cortical: '',
    },
    achadosDireito: [],
    achadosEsquerdo: [],
    microcalculosBilateral: false,
    dilatacao: { enabled: false, rim: 'direito', ureteral: 'nenhum' },
  },
  bexiga: { status: 'normal', achados: [] },
  volumeVesical: { pre: ['', '', ''], pos: ['', '', ''] },
  liquidoLivre: { local: 'ausente', localizacaoFocal: '' },
  observacoesFinais: { sugerirGamaPropedêutica: false, abdomeGravidico: false, textoLivre: '' },
};