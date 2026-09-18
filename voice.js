// Reconhecimento de voz (Web Speech API) + interpretação da resposta falada

const PALAVRAS_NUMERO = {
  zero: 0, um: 1, uma: 1, dois: 2, duas: 2, três: 3, tres: 3, quatro: 4,
  cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10,
};

function normalizar(txt) {
  return (txt || '').toLowerCase().trim();
}

// Tenta achar uma nota de 0 a 10 no texto falado (dígito tem prioridade sobre palavra)
export function parseNota10(textoFalado) {
  const t = normalizar(textoFalado);
  if (!t) return null;
  const matchDigito = t.match(/\b(10|[0-9])\b/);
  if (matchDigito) return parseInt(matchDigito[1], 10);
  for (const palavra of Object.keys(PALAVRAS_NUMERO)) {
    if (new RegExp(`\\b${palavra}\\b`).test(t)) return PALAVRAS_NUMERO[palavra];
  }
  return null;
}

// Palavras-chave por tipo de escala, da mais específica para a mais genérica
// (evita que "concordo" capture antes de "concordo plenamente")
const CHAVES = {
  concordancia: [
    [5, ['concordo plenamente', 'concordo totalmente']],
    [1, ['discordo plenamente', 'discordo totalmente']],
    [4, ['concordo']],
    [2, ['discordo']],
    [3, ['neutro', 'indiferente', 'nem concordo nem discordo']],
  ],
  satisfacao: [
    [5, ['muito satisfeito']],
    [1, ['muito insatisfeito']],
    [2, ['insatisfeito']],
    [4, ['satisfeito']],
    [3, ['neutro', 'indiferente']],
  ],
  frequencia: [
    [5, ['sempre']],
    [1, ['nunca']],
    [4, ['frequentemente', 'frequente']],
    [2, ['raramente']],
    [3, ['às vezes', 'as vezes', 'ocasionalmente']],
  ],
};

export function parseLikert(textoFalado, tipo) {
  const t = normalizar(textoFalado);
  if (!t) return null;
  const regras = CHAVES[tipo];
  if (!regras) return null;
  for (const [valor, frases] of regras) {
    if (frases.some((f) => t.includes(f))) return valor;
  }
  // fallback: número falado de 1 a 5
  const matchDigito = t.match(/\b[1-5]\b/);
  if (matchDigito) return parseInt(matchDigito[0], 10);
  return null;
}

export function parseResposta(textoFalado, tipoPergunta) {
  if (tipoPergunta === 'nota10') return parseNota10(textoFalado);
  if (['concordancia', 'satisfacao', 'frequencia'].includes(tipoPergunta)) {
    return parseLikert(textoFalado, tipoPergunta);
  }
  return null;
}

export function reconhecimentoDisponivel() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// Wrapper simples em cima do SpeechRecognition contínuo em pt-BR
export function criarReconhecedor({ onTranscricao, onErro, onFim }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.lang = 'pt-BR';
  rec.continuous = true;
  rec.interimResults = true;

  let transcricaoFinal = '';

  rec.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const resultado = event.results[i];
      if (resultado.isFinal) {
        transcricaoFinal += (transcricaoFinal ? ' ' : '') + resultado[0].transcript.trim();
      } else {
        interim += resultado[0].transcript;
      }
    }
    onTranscricao && onTranscricao({ final: transcricaoFinal, interim, completo: (transcricaoFinal + ' ' + interim).trim() });
  };

  rec.onerror = (event) => {
    onErro && onErro(event.error);
  };

  rec.onend = () => {
    onFim && onFim(transcricaoFinal);
  };

  return {
    start() {
      transcricaoFinal = '';
      try { rec.start(); } catch (e) { /* já iniciado */ }
    },
    stop() {
      rec.stop();
    },
    reset() {
      transcricaoFinal = '';
    },
  };
}
