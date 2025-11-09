export const referenceData: { [key: string]: { title: string; content: string } } = {
  figado: {
    title: 'Valores de Referência: Fígado',
    content: `
      <h4 class="font-semibold text-gray-800">Dimensões (Adulto)</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Eixo longitudinal do lobo direito:</strong> até 150 mm</li>
          <li><strong>Eixo longitudinal do lobo esquerdo:</strong> até 100 mm</li>
      </ul>
      <h4 class="font-semibold text-gray-800 mt-2">Ângulos</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Ângulo do lobo direito:</strong> &lt; 75°</li>
          <li><strong>Ângulo do lobo esquerdo:</strong> &lt; 45°</li>
      </ul>`,
  },
  vesiculaBiliar: {
    title: 'Valores de Referência: Vesícula Biliar',
    content: `
      <h4 class="font-semibold text-gray-800">Medidas</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Medida transversal máxima:</strong> até 40 mm</li>
          <li><strong>Espessura da parede:</strong> até 4 mm (medir na parede anterior)</li>
      </ul>`,
  },
  viasBiliares: {
    title: 'Valores de Referência: Vias Biliares (Hepatocolédoco)',
    content: `
      <h4 class="font-semibold text-gray-800">Calibre do Ducto Hepático Comum / Colédoco</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Normal:</strong> 4 a 6 mm</li>
          <li>Pode aumentar 1 mm por década de vida após os 60 anos.</li>
          <li><strong>Pós-colecistectomia (pós-cirurgia):</strong> pode medir até 10 mm.</li>
      </ul>`,
  },
  pancreas: {
    title: 'Valores de Referência: Pâncreas',
    content: `
      <h4 class="font-semibold text-gray-800">Medidas (Diâmetro Anteroposterior)</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Cabeça:</strong> 30 a 35 mm</li>
          <li><strong>Corpo:</strong> 15 a 20 mm</li>
          <li><strong>Cauda:</strong> até 20 mm</li>
      </ul>
      <h4 class="font-semibold text-gray-800 mt-2">Ducto Pancreático (Wirsung)</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Calibre:</strong> até 2 mm</li>
      </ul>`,
  },
  baco: {
    title: 'Valores de Referência: Baço',
    content: `
      <h4 class="font-semibold text-gray-800">Medidas</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Eixo longitudinal:</strong> até 120 mm</li>
          <li><strong>Eixo transversal:</strong> até 70 mm</li>
          <li><strong>Espessura:</strong> até 40 mm</li>
      </ul>
      <h4 class="font-semibold text-gray-800 mt-2">Índice Esplênico</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Fórmula:</strong> Comprimento x Largura x Espessura</li>
          <li><strong>Normal:</strong> até 480 (algumas fontes citam até 600)</li>
          <li>O comprimento é a medida mais utilizada na prática para avaliar esplenomegalia.</li>
      </ul>`,
  },
  rins: {
    title: 'Valores de Referência: Rins e Ureteres',
    content: `
      <h4 class="font-semibold text-gray-800">Definições</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Parênquima:</strong> Medida da espessura total do tecido renal funcional, incluindo a medular (pirâmides) e a cortical.</li>
          <li><strong>Cortical:</strong> Medida apenas da camada mais externa do parênquima, excluindo as pirâmides medulares. É onde ocorre a filtração do sangue.</li>
      </ul>
      <h4 class="font-semibold text-gray-800 mt-2">Rim (Adulto)</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Eixo longitudinal:</strong> 90 a 130 mm</li>
          <li><strong>Parênquima renal (espessura):</strong> 13 a 20 mm</li>
          <li><strong>Cortical renal (espessura):</strong> 7 a 11 mm (média 7 mm)</li>
      </ul>
      <h4 class="font-semibold text-gray-800 mt-2">Rim (Crianças) - Eixo Longitudinal</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>0 a 3 meses:</strong> 35 a 65 mm</li>
          <li><strong>4 a 6 meses:</strong> 40 a 70 mm</li>
          <li><strong>7 a 11 meses:</strong> 45 a 80 mm</li>
          <li><strong>1 a 2 anos:</strong> 60 a 70 mm</li>
          <li><strong>3 a 7 anos:</strong> 70 a 80 mm</li>
          <li><strong>8 a 12 anos:</strong> 80 a 90 mm</li>
          <li><strong>> 12 anos:</strong> Padrão adulto</li>
      </ul>`,
  },
  bexiga: {
    title: 'Valores de Referência: Bexiga',
    content: `
      <h4 class="font-semibold text-gray-800">Parede Vesical (Detrusor)</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Espessura da parede:</strong> 4 a 5 mm (com repleção de ~250 ml)</li>
          <li><strong>Espessura do detrusor:</strong> ~1,4 mm (com repleção de ~250 ml)</li>
          <li>A parede parece mais espessa quando a bexiga está vazia. Medir com boa repleção.</li>
      </ul>
      <h4 class="font-semibold text-gray-800 mt-2">Repleção Vesical Adequada para Avaliação</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Adultos:</strong> Uma repleção é considerada ideal acima de 300 ml. Volumes abaixo de 200-250 ml podem ser insuficientes para uma avaliação pélvica completa.</li>
          <li><strong>Crianças (> 1 ano):</strong> A capacidade esperada pode ser estimada pela fórmula: <strong>(Idade em anos + 2) x 30 ml</strong>. Volumes significativamente inferiores podem prejudicar a avaliação.</li>
          <li><strong>Lactentes (< 1 ano):</strong> A capacidade esperada pode ser estimada pela fórmula: <strong>7 x Peso em kg</strong>.</li>
      </ul>`,
  },
  prostata: {
    title: 'Valores de Referência: Próstata',
    content: `
      <h4 class="font-semibold text-gray-800">Volume e Peso</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Volume normal:</strong> até 25-30 cm³</li>
          <li><strong>Peso total (estimado):</strong> 20 a 25 g</li>
      </ul>
      <h4 class="font-semibold text-gray-800 mt-2">Índice de Protrusão Prostática (IPP)</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Grau 1:</strong> até 5 mm</li>
          <li><strong>Grau 2:</strong> 5 a 10 mm</li>
          <li><strong>Grau 3:</strong> > 10 mm</li>
      </ul>`,
  },
  aortaEVasos: {
    title: 'Valores de Referência: Aorta e Vasos Abdominais',
    content: `
      <h4 class="font-semibold text-gray-800">Aorta</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Calibre pré-renais:</strong> 21 a 24 mm</li>
          <li><strong>Calibre pós-renais:</strong> 17 a 20 mm</li>
      </ul>
       <h4 class="font-semibold text-gray-800 mt-2">Artérias</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Tronco Celíaco:</strong> até 8 mm</li>
          <li><strong>Artéria Esplênica:</strong> até 4 mm</li>
          <li><strong>Artéria Hepática Comum:</strong> ~4 mm (3.5 a 5.0 mm)</li>
          <li><strong>Artéria Mesentérica Superior:</strong> até 7 mm</li>
          <li><strong>Pinça Aorto-Mesentérica (distância):</strong> > 2 mm</li>
          <li><strong>Artérias Renais:</strong> 5 a 6 mm</li>
          <li><strong>Artérias Ilíacas Comuns:</strong> 10 a 12 mm</li>
      </ul>
      <h4 class="font-semibold text-gray-800 mt-2">Veias</h4>
      <ul class="list-disc list-inside text-sm text-gray-600 pl-4">
          <li><strong>Veia Cava Inferior:</strong> até 25 mm (calibre variável com respiração)</li>
          <li><strong>Veia Porta:</strong> até 12 mm</li>
          <li><strong>Veia Esplênica:</strong> até 9 mm</li>
          <li><strong>Veia Mesentérica Superior:</strong> até 9 mm</li>
          <li><strong>Veias Hepáticas:</strong> até 10 mm</li>
      </ul>`,
  },
};