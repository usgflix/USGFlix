
import { GoogleGenAI } from "@google/genai";
import type { PatientDetails } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a check for development; in the target environment, the key is assumed to be present.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function reviewReportWithGemini(preliminaryText: string, patientInfo: PatientDetails, examType: string): Promise<string> {
  const crmPlaceholder = patientInfo.crm ? `CRM: %crm<br />` : '';
  const rqePlaceholder = patientInfo.rqe ? `RQE: %rqe` : '';
  const reportTitle = `ULTRASSONOGRAFIA DE ${examType.toUpperCase().replace('2º', 'SEGUNDO')}`;

  const systemInstruction = `
    Você é um assistente especialista em radiologia. Sua tarefa é pegar dados estruturados de um exame de ultrassonografia, juntamente com a história clínica do paciente, e transformá-los em um laudo médico profissional, em HTML, para ser exibido em um editor de texto rico (contentEditable div).

    **REGRAS DE FORMATAÇÃO:**
    1.  **SAÍDA HTML:** O laudo final deve ser um único bloco de HTML. Não inclua \`<html>\`, \`<head>\` ou \`<body>\`.
    2.  **PARÁGRAFOS:** Cada descrição de órgão (Fígado, Vesícula Biliar, etc.) deve ser um parágrafo HTML separado, envolvido em tags \`<p> ... </p>\`. Isso garantirá o espaçamento correto. Não use múltiplos \`<br />\` para criar espaços.
    3.  **CONCISÃO:** Mantenha o texto conciso para garantir que o laudo final caiba em uma única página A4.
    4.  **ESTRUTURA:** Siga a terminologia e formatação médica padrão em português do Brasil. O laudo deve ser completo, começando com os dados do paciente e terminando com a conclusão e o espaço para assinatura.
    5.  **ASSINATURA:** A seção da assinatura deve ser envolvida por \`<div class="signature" style="padding-top: 30px;">...</div>\` para garantir espaçamento e alinhamento à direita na impressão.
    6.  **CONCLUSÃO DINÂMICA:** A conclusão DEVE correlacionar os achados do exame com a história clínica fornecida. Se nos achados do exame houver uma linha começando com "CONCLUSÃO SUGESTIVA:", essa linha deve ser usada como base principal, mas ainda assim enriquecida com a correlação clínica. Se não houver "CONCLUSÃO SUGESTIVA:", formule uma conclusão que resuma os achados anormais à luz dos sintomas do paciente, sugerindo hipóteses diagnósticas. Para exames normais, se houver uma história clínica relevante, mencione a necessidade de correlação (ex: "Ausência de achados ecográficos que justifiquem a dor abdominal referida."). Se não houver história clínica, use a conclusão padrão ("Exame sem anormalidades detectáveis pelo método." para exames normais).


    **MODELO DE ESTRUTURA E FORMATAÇÃO (use como guia):**

    <div>
        Paciente: ${patientInfo.name || 'Não informado'}<br />
        Data do exame: ${patientInfo.examDate} &nbsp;&nbsp;&nbsp;&nbsp; Sexo: ${patientInfo.sex || 'Não informado'} &nbsp;&nbsp;&nbsp;&nbsp; Idade: ${patientInfo.age || 'Não informada'}<br />
        Médico solicitante: ${patientInfo.solicitante || 'Não informado'}
    </div>

    <p style="text-align: center;"><strong>${reportTitle}</strong></p>

    <p>Fígado com dimensões normais, contornos regulares, bordas finas e ecotextura homogênea. Veia porta e veias hepáticas sem alterações.</p>
    <p>Vesícula biliar com forma e dimensões normais, paredes finas e regulares, apresentando conteúdo anecogênico sem imagens calculosas.</p>
    <p>Não há dilatação das vias biliares intra ou extra-hepáticas.</p>
    <p>Pâncreas de dimensões normais, contornos regulares e ecotextura homogênea. Não há dilatação do ducto pancreático.</p>
    <p>Baço com dimensões normais, contornos regulares e ecotextura homogênea.</p>
    <p>Aorta e veia cava inferior com calibre e trajeto preservados.</p>
    <p>Ausência de linfonodomegalias retroperitoneais detectáveis.</p>
    <p>Rins tópicos com dimensões normais, contornos regulares e ecotextura habitual. Não há evidências de imagens calculosas calicinais. Não há dilatação do sistema coletor.</p>
    <p>Bexiga com boa repleção, paredes finas e regulares, conteúdo anecogênico.</p>
    <p>Ausência de líquido livre.</p>

    <p><strong>CONCLUSÃO:</strong><br />Exame sem anormalidades detectáveis pelo método.</p>

    <div class="signature" style="padding-top: 30px; text-align: right;">
        ___________________________<br />
        %ultrassonografista<br />
        ${crmPlaceholder}
        ${rqePlaceholder}
    </div>
  `;

  const prompt = `
    Por favor, gere um laudo médico completo em HTML para um exame de ${examType}, baseado nas seguintes informações. Siga estritamente as regras de formatação e o modelo fornecido na instrução do sistema.

    **Dados do Paciente para o Laudo:**
    - Nome: ${patientInfo.name || 'Não informado'}
    - Idade: ${patientInfo.age || 'Não informada'}
    - Sexo: ${patientInfo.sex || 'Não informado'}
    - Médico Solicitante: ${patientInfo.solicitante || 'Não informado'}
    - Data do Exame: ${patientInfo.examDate}
    - Ultrassonografista: ${patientInfo.ultrassonografista || 'Não informado'}
    - CRM: ${patientInfo.crm || ''}
    - RQE: ${patientInfo.rqe || ''}
    
    **História Clínica Resumida:**
    ${patientInfo.clinicalHistory || 'Não informada.'}

    **Achados do Exame (use estes dados para construir o corpo do laudo, substituindo as seções normais do modelo se houver achados anormais):**
    ${preliminaryText}

    Gere o laudo final, substituindo os placeholders (%ultrassonografista, %crm, %rqe) pelos dados fornecidos.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      }
    });
    
    let reportText = response.text;
    // Clean the response: remove potential markdown code block fences and trim whitespace.
    reportText = reportText.replace(/^```html\s*/, '').replace(/```\s*$/, '').trim();
    
    return reportText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("A communication error with the AI service occurred.");
  }
}


export async function getAISuggestion(query: string, currentReport: string, patientInfo: PatientDetails): Promise<string> {
    const systemInstruction = `
    Você é um assistente especialista em radiologia. Sua tarefa é converter uma descrição em linguagem simples, fornecida por um médico, em uma terminologia médica técnica e precisa para um laudo de ultrassonografia.
    - Analise a solicitação do usuário.
    - Considere o sexo e a idade do paciente para fornecer uma sugestão mais precisa (por exemplo, se o paciente for mulher e a anotação for "imagem ovalada ao lado da bexiga", sugira algo relacionado aos ovários).
    - Use o conteúdo do laudo atual para entender o contexto do exame.
    - Se apropriado, sugira a necessidade de exames complementares (ex: USG transvaginal, Tomografia, etc.).
    - A resposta deve ser apenas o texto médico sugerido, sem cabeçalhos, introduções ou qualquer formatação. Apenas o texto puro.
  `;
    
    const prompt = `
    Por favor, converta a seguinte observação em linguagem médica apropriada.

    **Observação do Médico:**
    "${query}"

    **Dados do Paciente:**
    - Sexo: ${patientInfo.sex || 'Não informado'}
    - Idade: ${patientInfo.age || 'Não informada'}

    **Contexto do Laudo Atual (resumido):**
    ${currentReport.substring(0, 500)}... 

    Gere uma sugestão concisa e técnica.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for suggestion:", error);
    throw new Error("A communication error with the AI service occurred.");
  }
}
