import type { AbdominalFormData, RenalFinding, VesicularFinding, PancreaticFinding, BladderFinding } from '../types';

export function buildAbdominalReportText(data: AbdominalFormData): string {
  const findings: string[] = [];

  // Limitações
  const limitacoes: string[] = [];
  if (data.limitacoes.biotipo) limitacoes.push('biotipo do paciente');
  if (data.limitacoes.meteorismo) limitacoes.push('meteorismo intestinal');
  if (limitacoes.length > 0) {
    findings.push(`Limitações Técnicas: Exame prejudicado por ${limitacoes.join(' e ')}.`);
  }

  // Fígado
  const isNormalLiver = data.figado.dimensoes === 'normais' &&
                       data.figado.contornos === 'regulares' &&
                       data.figado.ecotextura === 'homogenea' &&
                       !data.figado.esteatose.enabled &&
                       data.figado.lesoesFocais.length === 0;

  if (isNormalLiver) {
      findings.push("Fígado: com dimensões normais, contornos regulares, bordas finas e ecotextura homogênea. Veia porta e veias hepáticas sem alterações.");
  } else {
      let parenquimaDesc = [];
      if (data.figado.esteatose.enabled) {
          const levelMap = {
              'discreta': 'leve (grau I)',
              'moderada': 'moderada (grau II)',
              'acentuada': 'acentuada (grau III)',
          };
          parenquimaDesc.push(`parênquima com ecotextura difusamente heterogênea e aumento da ecogenicidade, compatível com infiltração gordurosa ${levelMap[data.figado.esteatose.level]}`);
      } else {
          parenquimaDesc.push(`parênquima de ecotextura ${data.figado.ecotextura === 'heterogenea' ? 'heterogênea difusamente' : 'homogênea'}`);
      }

      let dimensoesText = `dimensões ${data.figado.dimensoes === 'aumentadas' ? 'aumentadas (hepatomegalia)' : 'normais'}`;
      if (data.figado.dimensoes === 'aumentadas') {
          const { loboDireito, loboEsquerdo } = data.figado.medidas;
          const medidasParts: string[] = [];
          if (loboDireito) medidasParts.push(`lobo direito medindo ${loboDireito} mm no seu maior eixo longitudinal`);
          if (loboEsquerdo) medidasParts.push(`lobo esquerdo medindo ${loboEsquerdo} mm`);

          if (medidasParts.length > 0) {
              dimensoesText += `, com ${medidasParts.join(' e ')}`;
          }
      }
      
      let figadoText = `Fígado com ${dimensoesText}, contornos ${data.figado.contornos === 'irregulares' ? 'irregulares/serrilhados' : 'regulares'} e ${parenquimaDesc.join('')}.`;
      
      const focalFindings: string[] = [];
      if (data.figado.lesoesFocais.length > 0) {
          data.figado.lesoesFocais.forEach(lesion => {
              const segmentText = lesion.segment !== 'nao_especificado' ? ` em segmento ${lesion.segment}` : '';
              const sizeText = lesion.size ? ` medindo ${lesion.size} mm` : '';

              let lesionDesc = '';
              switch(lesion.type) {
                  case 'cisto_simples':
                      lesionDesc = `imagem cística simples${segmentText}${sizeText}`;
                      break;
                  case 'hemangioma':
                      lesionDesc = `nódulo hiperecogênico, de contornos regulares, compatível com hemangioma${segmentText}${sizeText}`;
                      break;
                  case 'nodulo_solido':
                      lesionDesc = `nódulo sólido${segmentText}${sizeText}`;
                      break;
                  case 'nodulo_hipoecoico':
                      lesionDesc = `nódulo hipoecogênico${segmentText}${sizeText}`;
                      break;
                  case 'metastase':
                      lesionDesc = `nódulo com características de lesão secundária (metástase)${segmentText}${sizeText}`;
                      break;
                  case 'outro':
                      const desc = lesion.description || 'nódulo não especificado';
                      lesionDesc = `${desc}${segmentText}${sizeText}`;
                      break;
              }
              if (lesionDesc) {
                  focalFindings.push(lesionDesc);
              }
          });
      }

      if (focalFindings.length > 0) {
          figadoText += ` Observa-se ainda: ${focalFindings.join('; ')}.`;
      }

      figadoText += " Veia porta e veias hepáticas com calibre e fluxo preservados.";
      findings.push(`Fígado: ${figadoText}`);
  }


  // Vesícula Biliar
  let vesiculaText = 'Vesícula Biliar: ';
  switch (data.vesiculaBiliar.status) {
      case 'normal':
          if (data.vesiculaBiliar.achados.length === 0) {
              vesiculaText += 'com forma e dimensões normais, paredes finas e regulares, apresentando conteúdo anecogênico sem imagens calculosas.';
          }
          break;
      case 'vazia': vesiculaText += 'vazia/contraída (jejum inadequado?).'; break;
      case 'ausente': vesiculaText += 'ausente (status pós-colecistectomia).'; break;
  }
  
  if (data.vesiculaBiliar.achados.length > 0) {
      const achadosDesc = data.vesiculaBiliar.achados.map((achado: VesicularFinding) => {
          const sizeText = achado.size ? ` medindo ${achado.size} mm` : '';
          switch (achado.type) {
              case 'calculo': return `presença de cálculo${sizeText}`;
              case 'polipo': return `presença de pólipo${sizeText}`;
              case 'lama_biliar': return 'presença de lama biliar';
              case 'colesterolose': return 'sinais de colesterolose';
              case 'espessamento_parietal': return `com espessamento parietal difuso${sizeText}`;
          }
          return '';
      }).join(', ');

      if (data.vesiculaBiliar.status === 'normal') {
          vesiculaText += `apresentando ${achadosDesc}.`;
      } else {
          // Se já houver um status como 'vazia', apenas adiciona os achados.
          vesiculaText += ` Observa-se ainda: ${achadosDesc}.`;
      }
  }

  if (data.vesiculaBiliar.sinalMurphy) {
    vesiculaText += ' Sinal de Murphy ecográfico positivo.';
  }
  findings.push(vesiculaText);


  // Vias Biliares
  let viasBiliaresText = 'Vias Biliares: ';
  if (data.viasBiliares.status === 'normal') {
    viasBiliaresText += 'colédoco com calibre normal.';
  } else {
    viasBiliaresText += `colédoco ectasiado${data.viasBiliares.calibre ? `, medindo ${data.viasBiliares.calibre} mm` : ''}.`;
    if (data.viasBiliares.calculo) {
      viasBiliaresText += ' Presença de cálculo em seu interior.';
    }
  }
  findings.push(viasBiliaresText);

  // Pâncreas
  let pancreasText = 'Pâncreas: ';
  const pancreasFindings: string[] = [];
  let isPancreasAbnormal = data.pancreas.achados.length > 0 || data.pancreas.dilatacaoWirsung.enabled;

  switch (data.pancreas.status) {
    case 'normal':
      // Base state, can be overridden by other findings
      break;
    case 'parcialmente_acessivel':
      pancreasFindings.push('parcialmente acessível/visualizado, sem alterações evidentes');
      isPancreasAbnormal = true;
      break;
    case 'inacessivel':
      pancreasFindings.push('inacessível/prejudicado pela interposição gasosa');
      isPancreasAbnormal = true;
      break;
    case 'sinais_pancreatite':
      pancreasFindings.push('sinais de pancreatite aguda');
      isPancreasAbnormal = true;
      break;
  }

  if (data.pancreas.achados.length > 0) {
      data.pancreas.achados.forEach((achado: PancreaticFinding) => {
          const sizeText = achado.size ? ` medindo ${achado.size} mm` : '';
          const locationText = achado.location ? ` em ${achado.location}` : '';
          let achadoDesc = '';
          switch (achado.type) {
              case 'cisto': achadoDesc = `imagem cística${locationText}${sizeText}`; break;
              case 'nodulo': achadoDesc = `nódulo${locationText}${sizeText}`; break;
              case 'calcificacao': achadoDesc = `calcificação parenquimatosa${locationText}${sizeText}`; break;
          }
          if (achadoDesc) pancreasFindings.push(achadoDesc);
      });
  }

  if (data.pancreas.dilatacaoWirsung.enabled) {
    let dilatacaoText = 'ducto de Wirsung ectasiado';
    if (data.pancreas.dilatacaoWirsung.medida) {
      dilatacaoText += `, medindo ${data.pancreas.dilatacaoWirsung.medida} mm`;
    }
    pancreasFindings.push(dilatacaoText);
  }

  if (isPancreasAbnormal) {
    pancreasText += pancreasFindings.join(', ').replace(/, ([^,]*)$/, ' e $1') + '.';
  } else {
    pancreasText += 'aspecto normal.';
  }
  findings.push(pancreasText);


  // Baço
  let bacoText = 'Baço: ';
  switch (data.baco.status) {
      case 'normal': bacoText += 'com dimensões normais e ecotextura homogênea.'; break;
      case 'ausente': bacoText += 'ausente (status pós-esplenectomia).'; break;
      case 'aumentado':
          bacoText += `com dimensões aumentadas (esplenomegalia)${data.baco.medidaLongitudinal ? `, medindo ${data.baco.medidaLongitudinal} mm no seu maior eixo longitudinal` : ''}.`;
          break;
  }
  findings.push(bacoText);

  // Aorta e Veia Cava
  const aortaNormal = data.aorta.status === 'normal';
  const veiaCavaNormal = data.veiaCava.status === 'normal';

  if (aortaNormal && veiaCavaNormal) {
    findings.push('Aorta e Veia Cava Inferior com calibre e trajeto preservados.');
  } else {
    let aortaText = 'Aorta: ';
    switch (data.aorta.status) {
        case 'normal': aortaText += 'com calibre e trajeto preservados.'; break;
        case 'ausente': aortaText += 'não avaliável.'; break;
        case 'placas': aortaText += 'apresentando placas de ateroma calcificadas em suas paredes.'; break;
        case 'ectasiada':
            aortaText += `ectasiada${data.aorta.calibre ? `, medindo ${data.aorta.calibre} mm de diâmetro` : ''}.`;
            break;
    }
    findings.push(aortaText);

    let veiaCavaText = 'Veia Cava Inferior: ';
    switch (data.veiaCava.status) {
      case 'normal': veiaCavaText += 'com calibre e trajeto preservados.'; break;
      case 'dilatada':
          veiaCavaText += `dilatada${data.veiaCava.calibre ? `, medindo ${data.veiaCava.calibre} mm de diâmetro` : ''}.`;
          break;
      case 'comprimida': veiaCavaText += 'comprimida, por aparente efeito de massa extrínseco.'; break;
      case 'trombose': veiaCavaText += 'com material ecogênico em seu interior, sugestivo de trombose.'; break;
    }
    findings.push(veiaCavaText);
  }

  // Alças Intestinais
  if (data.alcasIntestinais.status === 'apendice_nao_caracterizado') {
    findings.push('Alças Intestinais: Apêndice cecal não visualizado à ultrassonografia, o que pode estar relacionado à presença de interposição gasosa, limitações técnicas do exame, biotipo corporal do paciente e variações anatômicas na posição do apêndice. Sugere-se a complementação da investigação diagnóstica conforme a correlação com os achados clínicos e laboratoriais.');
  } else if (data.alcasIntestinais.status !== 'nao_citar') {
    findings.push(`Alças Intestinais: Sinais de ${data.alcasIntestinais.status}.`);
  }

  // Rins
  const buildKidneyDescription = (side: string, isPresent: boolean, findings: RenalFinding[]): string | null => {
    if (!isPresent) {
      return `Rim ${side} ausente.`;
    }
    if (findings.length > 0) {
      const descriptions = findings.map(f => 
        `${f.type} em ${f.location}${f.size ? ` medindo ${f.size} mm` : ''}`
      ).join(' e ');
      return `Rim ${side} apresentando ${descriptions}.`;
    }
    return null; // Normal
  };

  const rightKidneyDesc = buildKidneyDescription('direito', data.rins.rimDireitoPresente, data.rins.achadosDireito);
  const leftKidneyDesc = buildKidneyDescription('esquerdo', data.rins.rimEsquerdoPresente, data.rins.achadosEsquerdo);

  let rinsTextParts: string[] = [];
  
  const { medidasDireito: md, medidasEsquerdo: me } = data.rins;
  let medidasParts: string[] = [];
  if (data.rins.rimDireitoPresente && (md.longitudinal || md.parenquima || md.cortical)) {
      let rdParts = [];
      if (md.longitudinal) rdParts.push(`longitudinal ${md.longitudinal}mm`);
      if (md.parenquima) rdParts.push(`parênquima ${md.parenquima}mm`);
      if (md.cortical) rdParts.push(`cortical ${md.cortical}mm`);
      medidasParts.push(`Rim direito: ${rdParts.join(', ')}`);
  }
  if (data.rins.rimEsquerdoPresente && (me.longitudinal || me.parenquima || me.cortical)) {
      let leParts = [];
      if (me.longitudinal) leParts.push(`longitudinal ${me.longitudinal}mm`);
      if (me.parenquima) leParts.push(`parênquima ${me.parenquima}mm`);
      if (me.cortical) leParts.push(`cortical ${me.cortical}mm`);
      medidasParts.push(`Rim esquerdo: ${leParts.join(', ')}`);
  }

  if (medidasParts.length > 0) {
      rinsTextParts.push(`Medidas renais: ${medidasParts.join('; ')}.`);
  }

  if (rightKidneyDesc) rinsTextParts.push(rightKidneyDesc);
  if (leftKidneyDesc) rinsTextParts.push(leftKidneyDesc);

  // If both are present and have no findings, use a single sentence.
  if (!rightKidneyDesc && !leftKidneyDesc && data.rins.rimDireitoPresente && data.rins.rimEsquerdoPresente) {
    rinsTextParts.push('Rins de aspecto normal bilateralmente.');
  } else if (!rightKidneyDesc && data.rins.rimDireitoPresente) {
    // If one has findings but the other is normal.
    rinsTextParts.push('Rim direito de aspecto normal.');
  } else if (!leftKidneyDesc && data.rins.rimEsquerdoPresente) {
    rinsTextParts.push('Rim esquerdo de aspecto normal.');
  }

  if (data.rins.microcalculosBilateral) {
    rinsTextParts.push('Presença de microcálculos renais bilaterais.');
  }
  
  if (data.rins.dilatacao.enabled) {
    const pieloSide = data.rins.dilatacao.rim;
    const ureteralSide = data.rins.dilatacao.ureteral;

    const formatSide = (side: 'direito' | 'esquerdo' | 'bilateral') => {
        switch(side) {
            case 'direito': return 'à direita';
            case 'esquerdo': return 'à esquerda';
            case 'bilateral': return 'bilateral';
            default: return '';
        }
    };

    let dilatacaoDesc = '';
    if (ureteralSide !== 'nenhum' && pieloSide === ureteralSide) {
        dilatacaoDesc = `dilatação pieloureteral ${formatSide(pieloSide)}`;
    } else {
        dilatacaoDesc = `dilatação pielocalicial ${formatSide(pieloSide)}`;
        if (ureteralSide !== 'nenhum') {
            dilatacaoDesc += ` e dilatação ureteral ${formatSide(ureteralSide)}`;
        }
    }
    rinsTextParts.push(`Presença de ${dilatacaoDesc}.`);
  }
  findings.push(`Rins e Ureteres: ${rinsTextParts.join(' ')}`);


  // Bexiga
  let bexigaText = 'Bexiga: ';
  let conclusaoBexiga = '';
  const bexigaAchadosParts: string[] = [];

  switch (data.bexiga.status) {
      case 'normal':
          if (data.bexiga.achados.length === 0) bexigaAchadosParts.push('com boa repleção, paredes finas e regulares, conteúdo anecogênico');
          break;
      case 'trabeculada': bexigaAchadosParts.push('difusamente trabeculada (bexiga de esforço)'); break;
      case 'insuficiente': bexigaAchadosParts.push('com repleção insuficiente, avaliação prejudicada'); break;
      case 'ecos_moveis':
          bexigaAchadosParts.push('conteúdo vesical apresenta ecos móveis em suspensão (corpos em flutuação), podendo corresponder a detritos celulares ou piúria, achado que sugere processo infeccioso urinário. Recomenda-se correlação com exame de urina EAS + Urocultura');
          conclusaoBexiga = 'CONCLUSÃO SUGESTIVA: Presença de ecos móveis em suspensão no interior da bexiga, sugestivos de infecção urinária (cistite).';
          break;
  }
  
  if (data.bexiga.achados.length > 0) {
      const achadosDesc = data.bexiga.achados.map((achado: BladderFinding) => {
          const sizeText = achado.size ? ` medindo ${achado.size} mm` : '';
          switch (achado.type) {
              case 'calculo': return `presença de cálculo em seu interior${sizeText}`;
              case 'lesao_vegetante': return `presença de lesão vegetante em seu interior${sizeText}`;
              case 'diverticulo': return `presença de divertículo${sizeText}`;
              case 'coagulo': return `presença de coágulo${sizeText}`;
          }
          return '';
      }).join(', ');
      bexigaAchadosParts.push(`notando-se ainda ${achadosDesc}`);
  }

  bexigaText += bexigaAchadosParts.join(', ').replace(/, ([^,]*)$/, ' e $1') + '.';
  findings.push(bexigaText);
  if (conclusaoBexiga) {
    findings.push(conclusaoBexiga);
  }


  // Volume Vesical
  const [pre1, pre2, pre3] = data.volumeVesical.pre.map(Number);
  const [pos1, pos2, pos3] = data.volumeVesical.pos.map(Number);

  if (pre1 > 0 && pre2 > 0 && pre3 > 0) {
    const volPre = (pre1 * pre2 * pre3 * 0.00052).toFixed(1);
    findings.push(`Volume vesical pré-miccional: ${volPre} ml.`);
  }
  if (pos1 > 0 && pos2 > 0 && pos3 > 0) {
    const volPos = (pos1 * pos2 * pos3 * 0.00052).toFixed(1);
    findings.push(`Resíduo pós-miccional: ${volPos} ml.`);
  }

  // Líquido Livre
  if (data.liquidoLivre.local === 'ausente') {
      findings.push('Líquido Livre: ausente.');
  } else if (data.liquidoLivre.local === 'acumulo_focal') {
      if (data.liquidoLivre.localizacaoFocal) {
          findings.push(`Líquido Livre: presença de acúmulo focal de líquido livre em ${data.liquidoLivre.localizacaoFocal}.`);
      } else {
          findings.push(`Líquido Livre: presença de acúmulo focal de líquido livre em localização não especificada.`);
      }
  } else {
      findings.push(`Líquido Livre: presença de líquido livre em ${data.liquidoLivre.local.replace(/_/g, ' ')}.`);
  }

  // Observações Finais
  const observacoes: string[] = [];
  if (data.observacoesFinais.sugerirGamaPropedêutica) {
    observacoes.push('Sugere-se aumentar a gama propedêutica para elucidação diagnóstica e correlacionar com a clínica.');
  }
  if (data.observacoesFinais.abdomeGravidico) {
    observacoes.push('Observa-se abdome gravídico, com útero aumentado conforme esperado para gestação. Avaliação obstétrica detalhada deve ser realizada por exame ultrassonográfico específico obstétrico, caso necessário.');
  }
  if (data.observacoesFinais.textoLivre.trim()) {
    observacoes.push(data.observacoesFinais.textoLivre.trim());
  }
  if (observacoes.length > 0) {
    findings.push(`Observações Finais: ${observacoes.join(' ')}`);
  }


  return findings.join('\n');
}