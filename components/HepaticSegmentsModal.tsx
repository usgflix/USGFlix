import React from 'react';

interface HepaticSegmentsModalProps {
  onClose: () => void;
}

export const HepaticSegmentsModal: React.FC<HepaticSegmentsModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative animate-fade-in-up space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold text-gray-800">Esquema Didático da Segmentação Hepática</h3>
            <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Fechar"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        </div>
        
        {/* AI-generated schematic diagram */}
        <div className="w-full bg-pink-50 p-4 rounded-lg border-2 border-pink-200 text-center select-none">
            <div className="mb-1 text-xs font-semibold text-gray-500">SUPERIOR</div>
            <div className="grid grid-cols-4 gap-1 text-sm font-bold text-gray-800">
                <div className="bg-red-200 p-4 rounded flex items-center justify-center" title="Segmento VII: Posterior Superior Direito">VII</div>
                <div className="bg-red-300 p-4 rounded flex items-center justify-center" title="Segmento VIII: Anterior Superior Direito">VIII</div>
                <div className="bg-blue-300 p-4 rounded flex items-center justify-center" title="Segmento IVa: Medial Superior Esquerdo">IVa</div>
                <div className="bg-green-200 p-4 rounded flex items-center justify-center" title="Segmento II: Lateral Superior Esquerdo">II</div>
                
                <div className="bg-red-200 p-4 rounded flex items-center justify-center" title="Segmento VI: Posterior Inferior Direito">VI</div>
                <div className="bg-red-300 p-4 rounded flex items-center justify-center" title="Segmento V: Anterior Inferior Direito">V</div>
                <div className="bg-blue-300 p-4 rounded flex items-center justify-center" title="Segmento IVb: Medial Inferior Esquerdo">IVb</div>
                <div className="bg-green-200 p-4 rounded flex items-center justify-center" title="Segmento III: Lateral Inferior Esquerdo">III</div>
            </div>
            <div className="mt-1 text-xs font-semibold text-gray-500">INFERIOR</div>
            <div className="mt-3 text-xs text-gray-600 grid grid-cols-4 gap-1">
                 <span className="bg-red-200 py-1 rounded">Post. Direito</span>
                 <span className="bg-red-300 py-1 rounded">Ant. Direito</span>
                 <span className="bg-blue-300 py-1 rounded">Medial Esq.</span>
                 <span className="bg-green-200 py-1 rounded">Lat. Esq.</span>
            </div>
             <div className="mt-4 border-t-2 border-dashed border-pink-300 pt-3">
                <div className="inline-block bg-purple-200 px-3 py-2 rounded text-sm font-bold text-gray-800" title="Segmento I: Lobo Caudado (Posterior)">I (Lobo Caudado)</div>
            </div>
        </div>

        {/* Didactic explanation */}
        <div className="text-sm text-gray-700 space-y-3">
            <p><strong className="font-semibold text-gray-900">Divisão Funcional:</strong> O fígado é dividido em 8 segmentos independentes. As <strong>Veias Hepáticas</strong> o dividem verticalmente, e a <strong>Veia Porta</strong> o divide horizontalmente (plano superior e inferior).</p>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong className="text-red-800">Lobo Direito (Segmentos V, VI, VII, VIII):</strong>
                    <ul className="list-['-_'] list-inside pl-4 text-xs">
                        <li><strong>Setor Posterior (direita da V. Hepática Direita):</strong> Segmento <strong>VII</strong> (superior) e <strong>VI</strong> (inferior).</li>
                        <li><strong>Setor Anterior (entre V. Hepática Direita e Média):</strong> Segmento <strong>VIII</strong> (superior) e <strong>V</strong> (inferior).</li>
                    </ul>
                </li>
                 <li>
                    <strong className="text-blue-800">Lobo Esquerdo Funcional (Segmentos II, III, IV):</strong>
                    <ul className="list-['-_'] list-inside pl-4 text-xs">
                        <li><strong>Setor Medial (entre V. Hepática Média e Esquerda):</strong> Segmento <strong>IV</strong> (Lobo Quadrado), dividido em <strong>IVa</strong> (superior) e <strong>IVb</strong> (inferior).</li>
                         <li><strong>Setor Lateral (esquerda da V. Hepática Esquerda):</strong> Segmento <strong>II</strong> (superior) e <strong>III</strong> (inferior).</li>
                    </ul>
                </li>
                 <li>
                    <strong className="text-purple-800">Lobo Caudado (Segmento I):</strong>
                     <ul className="list-['-_'] list-inside pl-4 text-xs">
                        <li>Localizado posteriormente, com drenagem venosa independente direto na Veia Cava Inferior.</li>
                    </ul>
                </li>
            </ul>
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
