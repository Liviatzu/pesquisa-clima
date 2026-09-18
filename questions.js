// Banco de perguntas padrão — extraído dos modelos reais da Falcioni
// (PPT "Pesquisa de Clima - Escuta" = modelo 0 a 10; Google Forms = modelo concordância/satisfação)
// Os dois modelos cobrem os mesmos 10 temas, só muda a escala de resposta.

export const NIVEIS = {
  concordancia: ['Discordo plenamente', 'Discordo', 'Neutro', 'Concordo', 'Concordo plenamente'],
  satisfacao: ['Muito insatisfeito', 'Insatisfeito', 'Neutro', 'Satisfeito', 'Muito satisfeito'],
  frequencia: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
};

export const TIPO_LABEL = {
  nota10: 'Nota 0 a 10',
  concordancia: 'Concordância',
  satisfacao: 'Satisfação',
  frequencia: 'Frequência',
  aberta: 'Pergunta aberta',
};

// As 10 dimensões padrão, nas duas redações (nota 0-10 / nível)
const DIMENSOES = [
  {
    nota: 'De 0 a 10, que nota você dá para as ferramentas de trabalho disponibilizadas pela empresa?',
    likert: 'As ferramentas disponibilizadas pela empresa são adequadas para a realização do meu trabalho.',
    tipoLikert: 'concordancia',
  },
  {
    nota: 'De 0 a 10, que nota você dá para a limpeza, organização e conforto do ambiente onde trabalha?',
    likert: 'Qual é o seu nível de satisfação com a limpeza, organização e conforto do seu ambiente de trabalho?',
    tipoLikert: 'satisfacao',
  },
  {
    nota: 'De 0 a 10, o quanto você considera que o seu tempo de trabalho é suficiente para executar suas tarefas?',
    likert: 'O tempo disponível durante minha jornada de trabalho é suficiente para executar minhas tarefas adequadamente.',
    tipoLikert: 'concordancia',
  },
  {
    nota: 'De 0 a 10, com que frequência você costuma receber elogios ou reconhecimento pelo trabalho realizado?',
    likert: 'Com que frequência você recebe elogios ou reconhecimento pelo trabalho realizado?',
    tipoLikert: 'frequencia',
  },
  {
    nota: 'De 0 a 10, quanto você avalia a comunicação da empresa?',
    likert: 'Qual é o seu nível de satisfação com a comunicação interna da empresa?',
    tipoLikert: 'satisfacao',
  },
  {
    nota: 'De 0 a 10, quanto você avalia o trabalho em equipe no seu setor?',
    likert: 'Qual é o seu nível de satisfação com o trabalho em equipe no seu setor?',
    tipoLikert: 'satisfacao',
  },
  {
    nota: 'De 0 a 10, quanto você avalia a capacitação e os treinamentos oferecidos pela empresa?',
    likert: 'Qual é o seu nível de satisfação com as capacitações e treinamentos oferecidos pela empresa?',
    tipoLikert: 'satisfacao',
  },
  {
    nota: 'De 0 a 10, o quanto você se sente valorizado e reconhecido na empresa?',
    likert: 'Sinto que meu trabalho é valorizado e reconhecido pela empresa.',
    tipoLikert: 'concordancia',
  },
  {
    nota: 'De 0 a 10, como você avalia seu líder direto?',
    likert: 'Qual é o seu nível de satisfação com a atuação do seu líder imediato?',
    tipoLikert: 'satisfacao',
  },
  {
    nota: 'De 0 a 10, o quanto a empresa cumpre o que promete?',
    likert: 'A empresa cumpre os compromissos e acordos assumidos com os colaboradores.',
    tipoLikert: 'concordancia',
  },
];

export const PERGUNTAS_ABERTAS = [
  'Fale dos pontos positivos.',
  'Fale das oportunidades de melhoria.',
];

export const SEGMENTOS_PADRAO = [
  'Administrativo',
  'Analítico',
  'Atendimento',
  'Atendimento/Coleta',
  'Serviços Gerais',
];

function novoId() {
  return 'p_' + Math.random().toString(36).slice(2, 10);
}

export function montarModelo(tipo) {
  // tipo: 'nota10' | 'likert' | 'vazio'
  const perguntas = [];
  if (tipo === 'nota10') {
    DIMENSOES.forEach((d) => perguntas.push({ id: novoId(), texto: d.nota, tipo: 'nota10' }));
  } else if (tipo === 'likert') {
    DIMENSOES.forEach((d) => perguntas.push({ id: novoId(), texto: d.likert, tipo: d.tipoLikert }));
  }
  if (tipo !== 'vazio') {
    PERGUNTAS_ABERTAS.forEach((texto) => perguntas.push({ id: novoId(), texto, tipo: 'aberta' }));
  }
  return perguntas;
}

export function novaPergunta(tipo = 'nota10') {
  return { id: novoId(), texto: '', tipo };
}
