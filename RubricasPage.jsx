import React, { useMemo, useState } from "react";

/* =====================================================================
   O HimalaIA responde… — Página /rubricas
   ---------------------------------------------------------------------
   ✅ Rubricas — geração local de rubricas de avaliação, critérios de
   sucesso, feedback formativo, autoavaliação e prompt para IA externa.

   ⚠️ NOTA ARQUITETURAL (dívida técnica assumida):
   Os componentes Avatar, Icon e Montanhas estão duplicados nesta página,
   tal como em /sobre e /prompts, porque a aplicação ainda não usa React
   Router nem pasta /components. Quando a arquitetura evoluir, extrair
   estes componentes partilhados para /components e importar aqui.

   Sem backend, sem API externa, sem base de dados. Tudo é gerado
   localmente a partir dos campos preenchidos pelo utilizador.
   ===================================================================== */

/* ⚠️ COLAR AQUI a string base64 do avatar do Padre HimalaIA já usada
   em /sobre e /prompts (JPEG ~4,7 KB). Enquanto for null, é mostrado
   um círculo de recurso com o ícone do sol. */
const AVATAR_BASE64 = null; // ex.: "data:image/jpeg;base64,/9j/4AAQ..."

/* =====================================================================
   SISTEMA DE ÍCONES SVG
   Grelha 24×24 · stroke 1.8 · stroke="currentColor" · fill="none"
   (mesma linguagem do sistema de 28 ícones das outras páginas)
   ===================================================================== */
const ICON_PATHS = {
  check: <path d="M4 12.5l5 5L20 6.5" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.6 2.6L16 9.5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4h-4" />
    </>
  ),
  arrowUp: <path d="M12 20V4M5 11l7-7 7 7" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5l9.5 16.5H2.5L12 3.5Z" />
      <path d="M12 10v4M12 17v.2" />
    </>
  ),
  lockShield: (
    <>
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" />
      <path d="M9.5 12.5l2 2 3.5-3.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5M9 12h7M9 16h7" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6" />
    </>
  ),
  group: (
    <>
      <circle cx="8.5" cy="8.5" r="3" />
      <circle cx="16.5" cy="10" r="2.5" />
      <path d="M3.5 19.5c0-3 2.2-5 5-5s5 2 5 5M14.5 19.5c.2-2.4 1.6-4 4-4 1.4 0 2.6.6 3.3 1.6" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  flask: (
    <>
      <path d="M10 3h4M11 3v6L5.5 19a1.5 1.5 0 0 0 1.3 2.2h10.4a1.5 1.5 0 0 0 1.3-2.2L13 9V3" />
      <path d="M8 15h8" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5h16v11H12l-5 4v-4H4v-11Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  laptop: (
    <>
      <rect x="4.5" y="5" width="15" height="10" rx="1.5" />
      <path d="M2.5 19h19M9 12l2-2-2-2M13 12h3" />
    </>
  ),
  robot: (
    <>
      <rect x="5" y="8" width="14" height="11" rx="2.5" />
      <path d="M12 8V4.5M12 4.5h.2" />
      <path d="M9 13v.5M15 13v.5M9.5 16.5h5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  tools: (
    <>
      <path d="M14.5 6.5a3.5 3.5 0 0 1 4.6-3.3l-2.6 2.6 2 2 2.6-2.6a3.5 3.5 0 0 1-4.6 4.6L8 18.3A2 2 0 1 1 5.2 15.5l8.5-8.5.8-.5Z" />
    </>
  ),
  quiz: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
      <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M20 19v2.5H6.5" />
    </>
  ),
  puzzle: (
    <>
      <path d="M9 4.5h4v3a2 2 0 1 0 3 1.7V8h4v4h-3a2 2 0 1 0-1.7 3H19v4h-4v-3a2 2 0 1 0-3-1.7V19H5v-4h3a2 2 0 1 0 1.7-3H5V8h4V4.5Z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
    </>
  ),
};

function Icon({ name, className = "w-6 h-6" }) {
  const paths = ICON_PATHS[name] || ICON_PATHS.info;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

/* Montanhas decorativas do cabeçalho (mesma linguagem das outras páginas) */
function Montanhas({ className = "" }) {
  return (
    <svg
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 160 L180 60 L300 120 L470 20 L620 110 L790 40 L950 120 L1080 70 L1200 130 L1200 160 Z"
        fill="currentColor"
        opacity="0.25"
      />
      <path
        d="M0 160 L140 100 L320 140 L520 70 L700 140 L900 80 L1060 140 L1200 100 L1200 160 Z"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}

function Avatar({ className = "w-14 h-14" }) {
  if (AVATAR_BASE64) {
    return (
      <img
        src={AVATAR_BASE64}
        alt="Padre HimalaIA"
        className={`${className} rounded-full ring-2 ring-white/70 object-cover`}
      />
    );
  }
  return (
    <div
      className={`${className} rounded-full ring-2 ring-white/70 bg-sky-700 text-amber-300 flex items-center justify-center`}
      role="img"
      aria-label="Padre HimalaIA"
    >
      <Icon name="sun" className="w-2/3 h-2/3" />
    </div>
  );
}

/* =====================================================================
   DADOS EDUCATIVOS (mesma lógica de /prompts — ciclo → anos → disciplinas)
   Estrutura simples de manter: acrescentar/corrigir disciplinas aqui.
   ===================================================================== */
const EXTRAS_DISCIPLINAS = [
  "Outra disciplina / área",
  "Oferta de escola",
  "Projeto interdisciplinar",
  "Clube / atividade extracurricular",
];

const educationData = {
  "1.º Ciclo": {
    anos: ["1.º ano", "2.º ano", "3.º ano", "4.º ano"],
    disciplinas: [
      "Português",
      "Matemática",
      "Estudo do Meio",
      "Educação Artística",
      "Educação Física",
      "Inglês (3.º e 4.º anos)",
      "Apoio ao Estudo",
      "Cidadania e Desenvolvimento",
    ],
  },
  "2.º Ciclo": {
    anos: ["5.º ano", "6.º ano"],
    disciplinas: [
      "Português",
      "Inglês",
      "História e Geografia de Portugal",
      "Matemática",
      "Ciências Naturais",
      "Educação Visual",
      "Educação Tecnológica",
      "Educação Musical",
      "Educação Física",
      "TIC",
      "Cidadania e Desenvolvimento",
      "EMRC",
    ],
  },
  "3.º Ciclo": {
    anos: ["7.º ano", "8.º ano", "9.º ano"],
    disciplinas: [
      "Português",
      "Inglês",
      "Francês",
      "Espanhol",
      "História",
      "Geografia",
      "Matemática",
      "Ciências Naturais",
      "Físico-Química",
      "Educação Visual",
      "TIC",
      "Educação Física",
      "Cidadania e Desenvolvimento",
      "EMRC",
    ],
  },
  "Ensino Secundário": {
    anos: ["10.º ano", "11.º ano", "12.º ano"],
    disciplinas: [
      "Português",
      "Inglês",
      "Filosofia",
      "Educação Física",
      "Matemática A",
      "Matemática B",
      "MACS",
      "Física e Química A",
      "Biologia e Geologia",
      "Geometria Descritiva A",
      "Economia A",
      "História A",
      "História B",
      "Geografia A",
      "Desenho A",
      "Psicologia B",
      "Aplicações Informáticas B",
    ],
  },
  "Ensino Profissional": {
    anos: ["1.º ano de formação", "2.º ano de formação", "3.º ano de formação"],
    disciplinas: [
      "Português",
      "Inglês",
      "Área de Integração",
      "Educação Física",
      "TIC",
      "Matemática",
      "Física e Química",
      "Economia",
      "Disciplina técnica do curso",
    ],
  },
};

const CICLOS = Object.keys(educationData);

/* =====================================================================
   TIPOS DE TAREFA E CRITÉRIOS SUGERIDOS
   ===================================================================== */
const TASK_TYPES = [
  { id: "escrito", icon: "doc", label: "Trabalho escrito" },
  { id: "oral", icon: "mic", label: "Apresentação oral" },
  { id: "grupo", icon: "group", label: "Trabalho de grupo" },
  { id: "interdisciplinar", icon: "compass", label: "Projeto interdisciplinar" },
  { id: "pratica", icon: "flask", label: "Atividade prática" },
  { id: "portefolio", icon: "folder", label: "Portefólio" },
  { id: "debate", icon: "chat", label: "Debate" },
  { id: "digital", icon: "laptop", label: "Produto digital" },
  { id: "ia", icon: "robot", label: "Atividade com IA" },
  { id: "cidadania", icon: "lockShield", label: "Cidadania digital" },
  { id: "exame", icon: "target", label: "Preparação para exame" },
  { id: "profissional", icon: "tools", label: "Ensino profissional" },
  { id: "quiz", icon: "quiz", label: "Quiz ou teste curto" },
  { id: "autonomo", icon: "book", label: "Estudo autónomo" },
  { id: "outra", icon: "puzzle", label: "Outra tarefa" },
];

const CRITERIOS_BASE = [
  "Compreensão do tema",
  "Rigor dos conteúdos",
  "Organização do trabalho",
  "Comunicação",
  "Cumprimento da tarefa",
];

const CRITERIOS_POR_TAREFA = {
  escrito: [
    "Rigor científico",
    "Organização das ideias",
    "Clareza da comunicação",
    "Uso adequado da linguagem",
    "Fundamentação",
    "Cumprimento da tarefa",
  ],
  oral: [
    "Clareza da exposição",
    "Domínio do conteúdo",
    "Organização da apresentação",
    "Expressão oral",
    "Uso de recursos",
    "Gestão do tempo",
  ],
  grupo: [
    "Colaboração",
    "Participação",
    "Responsabilidade",
    "Comunicação",
    "Produto final",
    "Reflexão sobre o processo",
  ],
  interdisciplinar: [
    "Integração de conhecimentos",
    "Resolução de problemas",
    "Criatividade",
    "Produto final",
    "Processo de trabalho",
    "Apresentação e reflexão",
  ],
  pratica: [
    "Aplicação de conhecimentos",
    "Procedimentos",
    "Autonomia",
    "Rigor na execução",
    "Segurança",
    "Análise dos resultados",
  ],
  portefolio: [
    "Seleção de evidências",
    "Organização do portefólio",
    "Reflexão sobre as aprendizagens",
    "Rigor dos conteúdos",
    "Evolução ao longo do tempo",
    "Apresentação",
  ],
  debate: [
    "Qualidade dos argumentos",
    "Fundamentação",
    "Escuta ativa e respeito",
    "Expressão oral",
    "Capacidade de contra-argumentação",
    "Gestão do tempo de intervenção",
  ],
  digital: [
    "Funcionalidade",
    "Organização",
    "Design e usabilidade",
    "Rigor dos conteúdos",
    "Criatividade",
    "Acessibilidade",
    "Segurança digital",
  ],
  ia: [
    "Clareza do objetivo",
    "Qualidade da prompt",
    "Validação crítica da resposta",
    "Reformulação e melhoria",
    "Uso ético da IA",
    "Transparência sobre o uso de IA",
    "Reflexão sobre o processo",
  ],
  cidadania: [
    "Compreensão dos riscos digitais",
    "Comportamento responsável online",
    "Respeito pela privacidade",
    "Respeito pelos direitos de autor",
    "Pensamento crítico sobre informação",
    "Comunicação segura",
  ],
  exame: [
    "Rigor dos conteúdos",
    "Estrutura da resposta",
    "Clareza da argumentação",
    "Seleção de informação relevante",
    "Uso de terminologia específica",
    "Interpretação do enunciado",
    "Gestão do tempo",
    "Adequação aos critérios fornecidos pelo professor",
  ],
  profissional: [
    "Competências técnicas",
    "Aplicação prática",
    "Produto final",
    "Autonomia",
    "Comunicação profissional",
    "Cumprimento de procedimentos",
    "Evidências de desempenho",
    "Ligação ao contexto real de trabalho",
  ],
  quiz: [
    "Rigor das respostas",
    "Compreensão dos conteúdos",
    "Interpretação das questões",
    "Gestão do tempo",
    "Cumprimento das instruções",
  ],
  autonomo: [
    "Planeamento do estudo",
    "Autonomia",
    "Seleção de recursos",
    "Registo das aprendizagens",
    "Reflexão sobre dificuldades",
    "Cumprimento dos objetivos definidos",
  ],
  outra: CRITERIOS_BASE,
};

/* =====================================================================
   NÍVEIS, ESCALAS E FEEDBACK
   ===================================================================== */
const NIVEIS_PRESETS = {
  3: ["A desenvolver", "Satisfatório", "Muito bom"],
  4: ["Insuficiente", "Suficiente", "Bom", "Muito bom"],
  5: ["Muito insuficiente", "Insuficiente", "Suficiente", "Bom", "Muito bom"],
};

const ESCALAS = [
  "Qualitativa",
  "Quantitativa",
  "Percentual",
  "1 a 5",
  "1 a 10",
  "0 a 20",
  "Sem escala numérica",
];

const FEEDBACK_OPCOES = [
  "Feedback geral",
  "Feedback por critério",
  "Feedback para melhoria",
  "Feedback para alunos com dificuldades",
  "Feedback para alunos avançados",
  "Feedback entre pares",
  "Feedback para autoavaliação",
];

const COMPONENTES_PROF = [
  "Sociocultural",
  "Científica",
  "Tecnológica",
  "Formação em Contexto de Trabalho",
  "PAP",
];

const PERGUNTAS_AUTOAVALIACAO = [
  "O que consegui fazer melhor?",
  "Que dificuldades encontrei?",
  "Que estratégia usei para ultrapassar dificuldades?",
  "O que faria de forma diferente numa próxima tarefa?",
  "Que evidências mostram a qualidade do meu trabalho?",
];

/* =====================================================================
   FUNÇÕES DE GERAÇÃO LOCAL (sem API — só templates)
   ===================================================================== */
const minuscula = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Descritores progressivos para um critério, ajustados ao n.º de níveis. */
function descritoresPara(criterio, nNiveis) {
  const c = minuscula(criterio);
  const cinco = [
    `Não evidencia ${c}; o trabalho não cumpre o pretendido neste critério.`,
    `Evidencia ${c} de forma muito limitada, com lacunas importantes e necessidade de apoio constante.`,
    `Evidencia ${c} de forma suficiente, cumprindo o essencial, embora com aspetos claros a melhorar.`,
    `Evidencia ${c} de forma consistente e adequada ao que foi pedido, com poucas falhas.`,
    `Evidencia ${c} com rigor, autonomia e qualidade acima do esperado, servindo de exemplo para os colegas.`,
  ];
  if (nNiveis === 5) return cinco;
  if (nNiveis === 4) return [cinco[1], cinco[2], cinco[3], cinco[4]];
  return [cinco[1], cinco[2], cinco[4]]; // 3 níveis
}

/** Descritores em linguagem simples para a versão dos alunos. */
function descritoresSimplesPara(nNiveis) {
  const cinco = [
    "Ainda não consigo mostrar isto no meu trabalho.",
    "Ainda preciso de muita ajuda.",
    "Já consigo, com algum apoio.",
    "Consigo fazer bem, sozinho.",
    "Consigo fazer muito bem e explicar aos outros.",
  ];
  if (nNiveis === 5) return cinco;
  if (nNiveis === 4) return [cinco[1], cinco[2], cinco[3], cinco[4]];
  return [cinco[1], cinco[2], cinco[4]];
}

/** Tabela da rubrica em texto (Markdown), pronta a copiar/colar. */
function tabelaMarkdown(criterios, nomesNiveis, pesos, mostrarPesos) {
  const cab = ["Critério", ...(mostrarPesos ? ["Peso"] : []), ...nomesNiveis];
  const sep = cab.map(() => "---");
  const linhas = criterios.map((crit, i) => {
    const desc = descritoresPara(crit, nomesNiveis.length);
    return [crit, ...(mostrarPesos ? [`${pesos[i]}%`] : []), ...desc];
  });
  return [cab, sep, ...linhas].map((l) => `| ${l.join(" | ")} |`).join("\n");
}

function gerarResultado(dados) {
  const {
    modo,
    ciclo,
    ano,
    disciplina,
    outraDisciplina,
    tema,
    tipoTarefa,
    produtoFinal,
    competencias,
    criterios,
    nNiveis,
    nomesNiveis,
    escala,
    pesos,
    pesosIguais,
    feedbackTipos,
    incluirAuto,
    incluirHetero,
    incluirPares,
    prof,
  } = dados;

  const tarefa = TASK_TYPES.find((t) => t.id === tipoTarefa);
  const disciplinaFinal =
    disciplina === "Outra disciplina / área" && outraDisciplina
      ? outraDisciplina
      : disciplina;
  const mostrarPesos = modo === "avancado" && !pesosIguais;

  /* ---------- Cartão 1 — Rubrica ---------- */
  let rubrica = `RUBRICA DE AVALIAÇÃO — ${tarefa?.label || "Tarefa"}\n\n`;
  rubrica += `Nível de ensino: ${ciclo}\nAno: ${ano}\nDisciplina: ${disciplinaFinal}\nTema/tarefa: ${tema}\n`;
  if (modo === "avancado") {
    if (produtoFinal) rubrica += `Produto final esperado: ${produtoFinal}\n`;
    if (competencias) rubrica += `Competências a avaliar: ${competencias}\n`;
    rubrica += `Escala: ${escala}\n`;
  }
  rubrica += `Níveis de desempenho: ${nomesNiveis.join(" · ")}\n\n`;
  rubrica += tabelaMarkdown(criterios, nomesNiveis, pesos, mostrarPesos);

  if (ciclo === "Ensino Profissional" || tipoTarefa === "profissional") {
    rubrica += `\n\nCONTEXTO PROFISSIONAL\n`;
    if (prof.curso) rubrica += `Curso profissional: ${prof.curso}\n`;
    if (prof.anoFormacao) rubrica += `Ano de formação: ${prof.anoFormacao}\n`;
    if (prof.componente) rubrica += `Componente: ${prof.componente}\n`;
    if (prof.uc) rubrica += `UC — Unidade de Competência: ${prof.uc}\n`;
    if (prof.contexto) rubrica += `Contexto profissional: ${prof.contexto}\n`;
    if (prof.produto) rubrica += `Produto final esperado: ${prof.produto}\n`;
    if (prof.perfil) rubrica += `Perfil profissional associado: ${prof.perfil}\n`;
    if (prof.evidencias) rubrica += `Evidências de desempenho: ${prof.evidencias}\n`;
    rubrica += `\nEsta rubrica valoriza a aplicação prática, a resolução de problemas reais, as competências técnicas, a autonomia, o cumprimento de procedimentos e a avaliação por evidências, em ligação ao perfil profissional do curso.`;
  }

  if (tipoTarefa === "ia") {
    rubrica += `\n\nNOTA — USO DE IA\nO uso de IA deve ser transparente, crítico e validado pelo professor. A IA pode apoiar o processo, mas não substitui o pensamento do aluno nem a avaliação docente.`;
  }
  if (tipoTarefa === "exame") {
    rubrica += `\n\nNOTA — EXAMES\nConsulte sempre as informações oficiais do IAVE/EduQA. Esta ferramenta ajuda a estruturar critérios de avaliação, mas não substitui os documentos oficiais de prova, critérios ou calendário.`;
  }
  rubrica += `\n\nNota de validação docente: esta rubrica deve ser revista e validada pelo professor antes de ser utilizada com os alunos.`;

  /* ---------- Cartão 2 — Critérios de sucesso ---------- */
  let sucesso = `CRITÉRIOS DE SUCESSO — ${tema}\n\nSei que realizei bem a tarefa se…\n\n`;
  sucesso += criterios
    .map((c) => `• …consigo mostrar ${minuscula(c)} ao longo do meu trabalho;`)
    .join("\n");
  sucesso += `\n• …cumpro as instruções e os prazos definidos pelo professor.`;

  /* ---------- Cartão 3 — Feedback formativo ---------- */
  const tiposFb =
    feedbackTipos.length > 0 ? feedbackTipos : ["Feedback geral", "Feedback por critério"];
  let feedback = `FEEDBACK FORMATIVO — ${tema}\n`;
  if (tiposFb.includes("Feedback geral")) {
    feedback += `\nFeedback geral (exemplo):\n"O teu trabalho mostra empenho e compreensão do tema. Para melhorar, deves rever a organização das ideias, justificar melhor as tuas opções e relacionar o conteúdo com exemplos concretos."\n`;
  }
  if (tiposFb.includes("Feedback por critério")) {
    feedback += `\nFeedback por critério:\n`;
    feedback += criterios
      .map(
        (c) =>
          `• ${c}: "Para melhorar em ${minuscula(
            c
          )}, identifica um aspeto concreto a rever, compara o teu trabalho com os critérios de sucesso e pede exemplos ao professor."`
      )
      .join("\n");
    feedback += "\n";
  }
  if (tiposFb.includes("Feedback para melhoria")) {
    feedback += `\nFeedback para melhoria:\n"Escolhe o critério em que tiveste o nível mais baixo e define um próximo passo concreto: o que vais fazer de forma diferente na próxima versão ou tarefa?"\n`;
  }
  if (tiposFb.includes("Feedback para alunos com dificuldades")) {
    feedback += `\nPara alunos com mais dificuldades:\n"Vamos concentrar-nos primeiro num só critério. Começa por garantir a compreensão do tema; depois, com apoio, trabalhamos a organização. Cada pequeno progresso conta."\n`;
  }
  if (tiposFb.includes("Feedback para alunos avançados")) {
    feedback += `\nPara alunos avançados:\n"O teu trabalho já cumpre bem os critérios. Desafia-te: aprofunda a fundamentação, acrescenta uma perspetiva diferente ou apoia um colega a melhorar o trabalho dele."\n`;
  }
  if (tiposFb.includes("Feedback entre pares") || incluirPares) {
    feedback += `\nFeedback entre pares (guião):\n• Uma coisa que o teu colega fez bem foi…\n• Uma sugestão concreta para melhorar é…\n• Uma dúvida ou pergunta que o trabalho me deixou foi…\n`;
  }
  if (tiposFb.includes("Feedback para autoavaliação")) {
    feedback += `\nFeedback para autoavaliação:\n"Antes de entregares, relê os critérios de sucesso e assinala os que já cumpres. Onde tiveres dúvidas, revê essa parte do trabalho."\n`;
  }

  /* ---------- Cartão 4 — Autoavaliação ---------- */
  let auto = `AUTOAVALIAÇÃO — ${tema}\n\nGrelha rápida (assinala o teu nível em cada critério):\n\n`;
  auto += `| Critério | ${nomesNiveis.join(" | ")} |\n`;
  auto += `| ${["---", ...nomesNiveis.map(() => "---")].join(" | ")} |\n`;
  auto += criterios
    .map((c) => `| ${c} | ${nomesNiveis.map(() => "☐").join(" | ")} |`)
    .join("\n");
  auto += `\n\nPerguntas de reflexão:\n`;
  auto += PERGUNTAS_AUTOAVALIACAO.map((p) => `• ${p}`).join("\n");
  if (incluirHetero) {
    auto += `\n\nHeteroavaliação (preenchida por um colega ou pelo professor):\n• Que critério está mais bem conseguido neste trabalho?\n• Que critério precisa de mais atenção?\n• Que sugestão concreta deixas para a próxima versão?`;
  }

  /* ---------- Cartão 5 — Versão simplificada ---------- */
  const simples = descritoresSimplesPara(nNiveis);
  let versaoAlunos = `A MINHA RUBRICA (versão para alunos) — ${tema}\n\nNíveis: ${nomesNiveis.join(
    " · "
  )}\n\n`;
  versaoAlunos += `O que significa cada nível:\n`;
  versaoAlunos += nomesNiveis.map((n, i) => `• ${n}: ${simples[i]}`).join("\n");
  versaoAlunos += `\n\nO que vai ser avaliado:\n`;
  versaoAlunos += criterios.map((c) => `• ${c}`).join("\n");
  versaoAlunos += `\n\nDica: antes de entregar, lê a lista "Sei que realizei bem a tarefa se…" e verifica cada ponto.`;

  /* ---------- Cartão 6 — Prompt para IA externa ---------- */
  const promptIA = `Atua como especialista em avaliação pedagógica no contexto educativo português. Analisa e melhora a seguinte rubrica para ${disciplinaFinal}, ${ano} (${ciclo}), sobre "${tema}"${
    tarefa ? `, para avaliar: ${minuscula(tarefa.label)}` : ""
  }.

Garante que:
1. os critérios são claros e observáveis;
2. os níveis de desempenho são progressivos e distinguíveis;
3. os descritores usam linguagem adequada aos alunos deste ano;
4. o feedback é formativo e orientado para próximos passos;
5. a linguagem é português de Portugal e adequada ao contexto educativo português.

Não introduzo dados pessoais de alunos. Mantém a estrutura em tabela e sugere, no final, dois ou três melhoramentos possíveis.

RUBRICA A MELHORAR:

${rubrica}`;

  return [
    { id: "rubrica", icon: "checkCircle", titulo: "Rubrica pronta a copiar", texto: rubrica, tabela: { criterios, nomesNiveis, pesos, mostrarPesos } },
    { id: "sucesso", icon: "target", titulo: "Critérios de sucesso", texto: sucesso },
    { id: "feedback", icon: "chat", titulo: "Feedback formativo", texto: feedback },
    { id: "auto", icon: "eye", titulo: "Autoavaliação", texto: auto },
    { id: "alunos", icon: "book", titulo: "Versão simplificada para alunos", texto: versaoAlunos },
    { id: "prompt", icon: "sparkle", titulo: "Prompt para melhorar a rubrica numa IA externa", texto: promptIA },
  ];
}

/* =====================================================================
   COMPONENTES DE UI PARTILHADOS DA PÁGINA
   ===================================================================== */
function SectionCard({ icon, titulo, subtitulo, children }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
      {(titulo || icon) && (
        <div className="flex items-start gap-3 mb-4">
          {icon && (
            <span className="shrink-0 w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Icon name={icon} className="w-6 h-6" />
            </span>
          )}
          <div>
            {titulo && (
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800">{titulo}</h2>
            )}
            {subtitulo && <p className="text-sm text-slate-500 mt-0.5">{subtitulo}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

function Campo({ label, obrigatorio, ajuda, erro, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {obrigatorio && <span className="text-rose-600" aria-hidden="true"> *</span>}
      </label>
      {children}
      {ajuda && !erro && <p className="text-xs text-slate-500">{ajuda}</p>}
      {erro && <p className="text-xs text-rose-600">{erro}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-800 " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500";

function Aviso({ icon, titulo, texto, tom }) {
  const tons = {
    azul: "bg-sky-50 border-sky-200 text-sky-900",
    ambar: "bg-amber-50 border-amber-200 text-amber-900",
    verde: "bg-emerald-50 border-emerald-200 text-emerald-900",
  };
  return (
    <div className={`rounded-2xl border p-4 flex gap-3 ${tons[tom] || tons.azul}`}>
      <span className="shrink-0 mt-0.5">
        <Icon name={icon} className="w-5 h-5" />
      </span>
      <div>
        <p className="font-semibold text-sm">{titulo}</p>
        <p className="text-sm mt-0.5 opacity-90">{texto}</p>
      </div>
    </div>
  );
}

/* =====================================================================
   PÁGINA /rubricas
   ===================================================================== */
export default function RubricasPage() {
  /* ----- estado global do formulário ----- */
  const estadoInicial = {
    ciclo: "",
    ano: "",
    disciplina: "",
    outraDisciplina: "",
    tema: "",
    tipoTarefa: "",
    produtoFinal: "",
    competencias: "",
    criteriosProprios: "",
    nNiveis: 4,
    personalizarNiveis: false,
    nomesNiveisCustom: ["", "", "", "", ""],
    escala: "Qualitativa",
    pesosIguais: true,
    pesosCustom: {},
    feedbackTipos: ["Feedback geral", "Feedback por critério"],
    incluirAuto: true,
    incluirHetero: false,
    incluirPares: false,
    ligacaoIA: false,
    prof: {
      curso: "",
      anoFormacao: "",
      componente: "",
      uc: "",
      contexto: "",
      produto: "",
      perfil: "",
      evidencias: "",
    },
  };

  const [modo, setModo] = useState(null); // 'simples' | 'avancado'
  const [f, setF] = useState(estadoInicial);
  const [criteriosSel, setCriteriosSel] = useState([]); // modo avançado
  const [erros, setErros] = useState({});
  const [resultado, setResultado] = useState(null);
  const [copiadoId, setCopiadoId] = useState(null);

  const set = (campo, valor) => setF((prev) => ({ ...prev, [campo]: valor }));
  const setProf = (campo, valor) =>
    setF((prev) => ({ ...prev, prof: { ...prev.prof, [campo]: valor } }));

  /* ----- dados derivados ----- */
  const anos = f.ciclo ? educationData[f.ciclo].anos : [];
  const disciplinas = f.ciclo
    ? [...educationData[f.ciclo].disciplinas, ...EXTRAS_DISCIPLINAS]
    : [];
  const criteriosSugeridos =
    CRITERIOS_POR_TAREFA[f.tipoTarefa] || CRITERIOS_BASE;
  const mostrarProfissional =
    f.ciclo === "Ensino Profissional" || f.tipoTarefa === "profissional";

  const nomesNiveis = useMemo(() => {
    const base = NIVEIS_PRESETS[f.nNiveis];
    if (!f.personalizarNiveis) return base;
    return base.map((nome, i) => f.nomesNiveisCustom[i]?.trim() || nome);
  }, [f.nNiveis, f.personalizarNiveis, f.nomesNiveisCustom]);

  const criteriosFinais = useMemo(() => {
    if (modo === "simples") return criteriosSugeridos;
    const proprios = f.criteriosProprios
      .split(/\n|;/)
      .map((s) => s.trim())
      .filter(Boolean);
    const lista = [...criteriosSel, ...proprios];
    return lista.length > 0 ? lista : criteriosSugeridos;
  }, [modo, criteriosSugeridos, criteriosSel, f.criteriosProprios]);

  const pesos = useMemo(() => {
    if (f.pesosIguais) {
      const p = Math.floor(100 / criteriosFinais.length);
      return criteriosFinais.map((_, i) =>
        i === 0 ? 100 - p * (criteriosFinais.length - 1) : p
      );
    }
    return criteriosFinais.map((c) => Number(f.pesosCustom[c]) || 0);
  }, [f.pesosIguais, f.pesosCustom, criteriosFinais]);

  const somaPesos = pesos.reduce((a, b) => a + b, 0);

  /* ----- validação mínima ----- */
  function validar() {
    const e = {};
    if (!f.ciclo) e.ciclo = "Escolha o ciclo ou nível de ensino.";
    if (!f.ano) e.ano = "Escolha o ano.";
    if (!f.disciplina) e.disciplina = "Escolha a disciplina.";
    if (
      f.disciplina === "Outra disciplina / área" &&
      !f.outraDisciplina.trim()
    )
      e.outraDisciplina = "Indique a disciplina ou área.";
    if (!f.tema.trim()) e.tema = "Indique o tema ou a tarefa.";
    if (!f.tipoTarefa) e.tipoTarefa = "Escolha o tipo de trabalho a avaliar.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  /* ----- ações ----- */
  function gerar() {
    if (!validar()) {
      document
        .getElementById("form-rubrica")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const cards = gerarResultado({
      modo,
      ...f,
      criterios: criteriosFinais,
      nomesNiveis,
      pesos,
    });
    setResultado(cards);
    setTimeout(
      () =>
        document
          .getElementById("resultado")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );
  }

  function limpar() {
    setF(estadoInicial);
    setCriteriosSel([]);
    setErros({});
    setResultado(null);
  }

  function verExemplo() {
    setModo("simples");
    setF({
      ...estadoInicial,
      ciclo: "3.º Ciclo",
      ano: "8.º ano",
      disciplina: "Ciências Naturais",
      tema: "Trabalho sobre ecossistemas locais",
      tipoTarefa: "escrito",
      nNiveis: 4,
    });
    setTimeout(() => {
      const cards = gerarResultado({
        modo: "simples",
        ...estadoInicial,
        ciclo: "3.º Ciclo",
        ano: "8.º ano",
        disciplina: "Ciências Naturais",
        tema: "Trabalho sobre ecossistemas locais",
        tipoTarefa: "escrito",
        criterios: CRITERIOS_POR_TAREFA.escrito,
        nomesNiveis: NIVEIS_PRESETS[4],
        pesos: CRITERIOS_POR_TAREFA.escrito.map(() => 0),
      });
      setResultado(cards);
      document
        .getElementById("resultado")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  async function copiar(texto, id) {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // Fallback para ambientes sem permissão de Clipboard API
      const ta = document.createElement("textarea");
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  }

  const copiarTudo = () =>
    resultado &&
    copiar(resultado.map((c) => c.texto).join("\n\n" + "—".repeat(30) + "\n\n"), "tudo");

  /* ===================================================================
     RENDER
     =================================================================== */
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ---------- CABEÇALHO COMUM ---------- */}
      <header className="relative bg-sky-900 text-white overflow-hidden">
        <Montanhas className="absolute inset-x-0 bottom-0 h-24 text-sky-700 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-16">
          <div className="flex items-center gap-4">
            <Avatar />
            <div>
              <p className="text-sky-200 text-sm">O HimalaIA responde…</p>
              <p className="font-semibold text-lg leading-tight">
                Ferramentas pedagógicas com IA, à medida dos professores
              </p>
            </div>
          </div>

          {/* Menu principal — Início · Prompts · Rubricas · Sobre */}
          <nav aria-label="Menu principal" className="mt-5">
            <ul className="flex flex-wrap gap-2">
              {[
                { href: "#/", label: "Início" },
                { href: "#/prompts", label: "Prompts" },
                { href: "#/rubricas", label: "Rubricas", ativa: true },
                { href: "#/sobre", label: "Sobre" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={l.ativa ? "page" : undefined}
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300
                      ${
                        l.ativa
                          ? "bg-white text-sky-900"
                          : "bg-sky-800/70 text-sky-100 hover:bg-sky-700"
                      }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Icon name="checkCircle" className="w-7 h-7" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Rubricas</h1>
          </div>
          <p className="mt-3 text-slate-700 font-medium">
            Crie critérios de avaliação, níveis de desempenho e feedback formativo
            para atividades, trabalhos, apresentações, projetos e tarefas.
          </p>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            O HimalaIA ajuda-o a estruturar rubricas claras, transparentes e
            pedagogicamente úteis, adaptadas ao ciclo, ano, disciplina, tipo de
            tarefa e perfil dos alunos.
          </p>
          <p className="mt-3 text-sky-800 font-semibold">
            Critérios claros. Feedback útil. Avaliação mais transparente.
          </p>
          <p className="text-slate-500 text-sm italic">
            Avaliar melhor começa por tornar os critérios mais claros.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() =>
                document
                  .getElementById("modos")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 rounded-xl bg-sky-800 text-white font-semibold hover:bg-sky-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Criar rubrica
            </button>
            <button
              onClick={verExemplo}
              className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Icon name="eye" className="w-5 h-5" /> Ver exemplo
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* ---------- ESCOLHA DE MODO ---------- */}
        <div id="modos" className="grid sm:grid-cols-2 gap-4 scroll-mt-6">
          {[
            {
              id: "simples",
              titulo: "Modo Simples",
              texto:
                "Use este modo se pretende criar rapidamente uma rubrica com critérios essenciais e níveis de desempenho.",
              icon: "check",
            },
            {
              id: "avancado",
              titulo: "Modo Avançado",
              texto:
                "Use este modo se pretende uma rubrica mais completa, com critérios personalizados, ponderações, feedback formativo, autoavaliação, heteroavaliação e adaptação ao ensino profissional.",
              icon: "sparkle",
            },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setModo(m.id)}
              className={`text-left rounded-2xl border-2 p-5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
                ${
                  modo === m.id
                    ? "border-sky-600 bg-sky-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-sky-300"
                }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    modo === m.id
                      ? "bg-sky-600 text-white"
                      : "bg-sky-100 text-sky-800"
                  }`}
                >
                  <Icon name={m.icon} />
                </span>
                <h2 className="text-lg font-semibold text-slate-800">{m.titulo}</h2>
              </div>
              <p className="mt-3 text-sm text-slate-600">{m.texto}</p>
            </button>
          ))}
        </div>

        {/* ---------- FORMULÁRIO ---------- */}
        {modo && (
          <div id="form-rubrica" className="space-y-8 scroll-mt-6">
            {/* Contexto */}
            <SectionCard
              icon="compass"
              titulo="1. Contexto"
              subtitulo="Ciclo, ano, disciplina e tema da tarefa a avaliar."
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Campo label="Ciclo / nível de ensino" obrigatorio erro={erros.ciclo}>
                  <select
                    className={inputCls}
                    value={f.ciclo}
                    onChange={(e) => {
                      set("ciclo", e.target.value);
                      set("ano", "");
                      set("disciplina", "");
                    }}
                  >
                    <option value="">Escolher…</option>
                    {CICLOS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Ano" obrigatorio erro={erros.ano}>
                  <select
                    className={inputCls}
                    value={f.ano}
                    onChange={(e) => set("ano", e.target.value)}
                    disabled={!f.ciclo}
                  >
                    <option value="">
                      {f.ciclo ? "Escolher…" : "Escolha primeiro o ciclo"}
                    </option>
                    {anos.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Disciplina" obrigatorio erro={erros.disciplina}>
                  <select
                    className={inputCls}
                    value={f.disciplina}
                    onChange={(e) => set("disciplina", e.target.value)}
                    disabled={!f.ciclo}
                  >
                    <option value="">
                      {f.ciclo ? "Escolher…" : "Escolha primeiro o ciclo"}
                    </option>
                    {disciplinas.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Campo>
                {(f.disciplina === "Outra disciplina / área" ||
                  modo === "avancado") && (
                  <Campo
                    label="Outra disciplina / área"
                    obrigatorio={f.disciplina === "Outra disciplina / área"}
                    erro={erros.outraDisciplina}
                    ajuda="Preencha se a disciplina não constar da lista."
                  >
                    <input
                      className={inputCls}
                      value={f.outraDisciplina}
                      onChange={(e) => set("outraDisciplina", e.target.value)}
                      placeholder="ex.: Robótica, Oficina de Escrita…"
                    />
                  </Campo>
                )}
                <div className="sm:col-span-2">
                  <Campo
                    label="Tema ou tarefa"
                    obrigatorio
                    erro={erros.tema}
                    ajuda="Descreva o contexto geral. Não inclua nomes de alunos nem dados pessoais."
                  >
                    <input
                      className={inputCls}
                      value={f.tema}
                      onChange={(e) => set("tema", e.target.value)}
                      placeholder="ex.: Apresentação sobre energias renováveis"
                    />
                  </Campo>
                </div>
                {modo === "avancado" && (
                  <>
                    <Campo label="Produto final esperado" ajuda="ex.: relatório, vídeo, protótipo, cartaz…">
                      <input
                        className={inputCls}
                        value={f.produtoFinal}
                        onChange={(e) => set("produtoFinal", e.target.value)}
                        placeholder="ex.: Cartaz digital com fontes citadas"
                      />
                    </Campo>
                    <Campo label="Competências a avaliar" ajuda="Separe por vírgulas.">
                      <input
                        className={inputCls}
                        value={f.competencias}
                        onChange={(e) => set("competencias", e.target.value)}
                        placeholder="ex.: pesquisa, comunicação, pensamento crítico"
                      />
                    </Campo>
                  </>
                )}
              </div>
            </SectionCard>

            {/* Tipo de tarefa */}
            <SectionCard
              icon="puzzle"
              titulo="2. Tipo de trabalho a avaliar"
              subtitulo="Escolha o tipo de tarefa — os critérios sugeridos adaptam-se à sua escolha."
            >
              {erros.tipoTarefa && (
                <p className="text-sm text-rose-600 mb-3">{erros.tipoTarefa}</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {TASK_TYPES.map((t) => {
                  const ativo = f.tipoTarefa === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        set("tipoTarefa", t.id);
                        setCriteriosSel([]);
                      }}
                      aria-pressed={ativo}
                      className={`rounded-2xl border-2 p-3 flex flex-col items-center gap-2 text-center transition
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
                        ${
                          ativo
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-sky-300"
                        }`}
                    >
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          ativo
                            ? "bg-emerald-500 text-white"
                            : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        <Icon name={t.icon} />
                      </span>
                      <span className="text-xs font-medium text-slate-700 leading-tight">
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Notas condicionais por tipo de tarefa */}
              {f.tipoTarefa === "ia" && (
                <div className="mt-4">
                  <Aviso
                    icon="robot"
                    tom="azul"
                    titulo="Atividade com IA"
                    texto="O uso de IA deve ser transparente, crítico e validado pelo professor. A IA pode apoiar o processo, mas não substitui o pensamento do aluno nem a avaliação docente."
                  />
                </div>
              )}
              {f.tipoTarefa === "exame" && (
                <div className="mt-4">
                  <Aviso
                    icon="target"
                    tom="ambar"
                    titulo="Preparação para exame"
                    texto="Consulte sempre as informações oficiais do IAVE/EduQA. Esta ferramenta ajuda a estruturar critérios de avaliação, mas não substitui os documentos oficiais de prova, critérios ou calendário."
                  />
                </div>
              )}
            </SectionCard>

            {/* Critérios (modo avançado) */}
            {modo === "avancado" && (
              <SectionCard
                icon="check"
                titulo="3. Critérios de avaliação"
                subtitulo="Escolha critérios sugeridos, escreva os seus e defina pesos."
              >
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Critérios sugeridos para{" "}
                  {TASK_TYPES.find((t) => t.id === f.tipoTarefa)?.label ||
                    "esta tarefa"}
                  :
                </p>
                <div className="flex flex-wrap gap-2">
                  {criteriosSugeridos.map((c) => {
                    const sel = criteriosSel.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() =>
                          setCriteriosSel((prev) =>
                            sel ? prev.filter((x) => x !== c) : [...prev, c]
                          )
                        }
                        aria-pressed={sel}
                        className={`px-3.5 py-2 rounded-full text-sm border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
                          ${
                            sel
                              ? "bg-sky-700 text-white border-sky-700"
                              : "bg-white text-slate-700 border-slate-300 hover:border-sky-400"
                          }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <Campo
                    label="Critérios próprios"
                    ajuda="Um critério por linha (ou separados por ponto e vírgula). Se não escolher nenhum critério, serão usados os sugeridos."
                  >
                    <textarea
                      className={`${inputCls} min-h-[90px]`}
                      value={f.criteriosProprios}
                      onChange={(e) => set("criteriosProprios", e.target.value)}
                      placeholder={"ex.:\nCitação correta de fontes\nOriginalidade da abordagem"}
                    />
                  </Campo>
                </div>

                {/* Pesos */}
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-sky-700"
                      checked={f.pesosIguais}
                      onChange={(e) => set("pesosIguais", e.target.checked)}
                    />
                    Todos os critérios com o mesmo peso
                  </label>
                  {!f.pesosIguais && (
                    <div className="mt-3 grid sm:grid-cols-2 gap-3">
                      {criteriosFinais.map((c) => (
                        <div key={c} className="flex items-center gap-2">
                          <span className="text-sm text-slate-700 flex-1">{c}</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className={`${inputCls} w-24 text-right`}
                            value={f.pesosCustom[c] ?? ""}
                            onChange={(e) =>
                              set("pesosCustom", {
                                ...f.pesosCustom,
                                [c]: e.target.value,
                              })
                            }
                            placeholder="%"
                            aria-label={`Peso de ${c} em percentagem`}
                          />
                        </div>
                      ))}
                      <p
                        className={`sm:col-span-2 text-sm ${
                          somaPesos === 100 ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        Soma atual: {somaPesos}%{" "}
                        {somaPesos !== 100 && "— para uma rubrica coerente, os pesos devem somar 100%."}
                      </p>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Níveis e escala */}
            <SectionCard
              icon="target"
              titulo={modo === "avancado" ? "4. Níveis de desempenho e escala" : "3. Níveis de desempenho"}
              subtitulo="Quantos níveis terá a rubrica e como se designam."
            >
              <div className="flex flex-wrap gap-3">
                {[3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => set("nNiveis", n)}
                    aria-pressed={f.nNiveis === n}
                    className={`px-5 py-3 rounded-xl border-2 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
                      ${
                        f.nNiveis === n
                          ? "border-sky-600 bg-sky-50 text-sky-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-sky-300"
                      }`}
                  >
                    {n} níveis
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Designações: <strong>{nomesNiveis.join(" · ")}</strong>
              </p>
              <label className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-sky-700"
                  checked={f.personalizarNiveis}
                  onChange={(e) => set("personalizarNiveis", e.target.checked)}
                />
                Personalizar os nomes dos níveis
              </label>
              {f.personalizarNiveis && (
                <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {NIVEIS_PRESETS[f.nNiveis].map((nome, i) => (
                    <input
                      key={i}
                      className={inputCls}
                      placeholder={nome}
                      value={f.nomesNiveisCustom[i]}
                      onChange={(e) => {
                        const novo = [...f.nomesNiveisCustom];
                        novo[i] = e.target.value;
                        set("nomesNiveisCustom", novo);
                      }}
                      aria-label={`Nome do nível ${i + 1}`}
                    />
                  ))}
                </div>
              )}
              {modo === "avancado" && (
                <div className="mt-5 max-w-xs">
                  <Campo label="Escala">
                    <select
                      className={inputCls}
                      value={f.escala}
                      onChange={(e) => set("escala", e.target.value)}
                    >
                      {ESCALAS.map((e) => (
                        <option key={e}>{e}</option>
                      ))}
                    </select>
                  </Campo>
                </div>
              )}
            </SectionCard>

            {/* Feedback e reflexão (modo avançado) */}
            {modo === "avancado" && (
              <SectionCard
                icon="chat"
                titulo="5. Feedback e reflexão"
                subtitulo="Que tipos de feedback e de reflexão quer incluir na rubrica."
              >
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_OPCOES.map((op) => {
                    const sel = f.feedbackTipos.includes(op);
                    return (
                      <button
                        key={op}
                        onClick={() =>
                          set(
                            "feedbackTipos",
                            sel
                              ? f.feedbackTipos.filter((x) => x !== op)
                              : [...f.feedbackTipos, op]
                          )
                        }
                        aria-pressed={sel}
                        className={`px-3.5 py-2 rounded-full text-sm border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
                          ${
                            sel
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-white text-slate-700 border-slate-300 hover:border-emerald-400"
                          }`}
                      >
                        {op}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 grid sm:grid-cols-3 gap-3">
                  {[
                    ["incluirAuto", "Incluir grelha de autoavaliação"],
                    ["incluirHetero", "Incluir heteroavaliação"],
                    ["incluirPares", "Incluir avaliação por pares"],
                  ].map(([campo, label]) => (
                    <label
                      key={campo}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-sky-700"
                        checked={f[campo]}
                        onChange={(e) => set(campo, e.target.checked)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Ensino Profissional (condicional) */}
            {mostrarProfissional && (
              <SectionCard
                icon="tools"
                titulo="Ensino Profissional"
                subtitulo="Contexto profissional da rubrica — avaliação por evidências e ligação ao perfil do curso."
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <Campo label="Curso profissional">
                    <input
                      className={inputCls}
                      value={f.prof.curso}
                      onChange={(e) => setProf("curso", e.target.value)}
                      placeholder="ex.: Técnico de Gestão e Programação de Sistemas Informáticos"
                    />
                  </Campo>
                  <Campo label="Ano de formação">
                    <select
                      className={inputCls}
                      value={f.prof.anoFormacao}
                      onChange={(e) => setProf("anoFormacao", e.target.value)}
                    >
                      <option value="">Escolher…</option>
                      <option>1.º ano</option>
                      <option>2.º ano</option>
                      <option>3.º ano</option>
                    </select>
                  </Campo>
                  <Campo label="Componente">
                    <select
                      className={inputCls}
                      value={f.prof.componente}
                      onChange={(e) => setProf("componente", e.target.value)}
                    >
                      <option value="">Escolher…</option>
                      {COMPONENTES_PROF.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Campo>
                  <Campo label="UC — Unidade de Competência">
                    <input
                      className={inputCls}
                      value={f.prof.uc}
                      onChange={(e) => setProf("uc", e.target.value)}
                      placeholder="ex.: UC — Programação Web (módulo/UC do referencial)"
                    />
                  </Campo>
                  <Campo label="Contexto profissional">
                    <input
                      className={inputCls}
                      value={f.prof.contexto}
                      onChange={(e) => setProf("contexto", e.target.value)}
                      placeholder="ex.: Simulação de atendimento a cliente real"
                    />
                  </Campo>
                  <Campo label="Produto final esperado">
                    <input
                      className={inputCls}
                      value={f.prof.produto}
                      onChange={(e) => setProf("produto", e.target.value)}
                      placeholder="ex.: Website funcional com relatório técnico"
                    />
                  </Campo>
                  <Campo label="Perfil profissional associado">
                    <input
                      className={inputCls}
                      value={f.prof.perfil}
                      onChange={(e) => setProf("perfil", e.target.value)}
                      placeholder="ex.: Perfil de saída do curso"
                    />
                  </Campo>
                  <Campo label="Evidências de desempenho">
                    <input
                      className={inputCls}
                      value={f.prof.evidencias}
                      onChange={(e) => setProf("evidencias", e.target.value)}
                      placeholder="ex.: registos, fotografias do processo, código, relatório"
                    />
                  </Campo>
                </div>
              </SectionCard>
            )}

            {/* Gerar */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={gerar}
                className="px-7 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-500 transition inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <Icon name="checkCircle" /> Gerar rubrica
              </button>
              <button
                onClick={limpar}
                className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <Icon name="trash" className="w-5 h-5" /> Limpar formulário
              </button>
            </div>
          </div>
        )}

        {/* ---------- RESULTADO ---------- */}
        {resultado && (
          <div id="resultado" className="space-y-5 scroll-mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Resultado gerado
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={copiarTudo}
                  className="px-4 py-2.5 rounded-xl bg-sky-800 text-white text-sm font-semibold hover:bg-sky-700 transition inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Icon name="copy" className="w-4 h-4" />
                  {copiadoId === "tudo" ? "Copiado com sucesso." : "Copiar tudo"}
                </button>
                <button
                  onClick={limpar}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Icon name="refresh" className="w-4 h-4" /> Gerar nova rubrica
                </button>
              </div>
            </div>

            {resultado.map((card) => (
              <SectionCard key={card.id} icon={card.icon} titulo={card.titulo}>
                {/* Cartão 1 mostra também a tabela renderizada */}
                {card.tabela && (
                  <div className="overflow-x-auto mb-4 rounded-xl border border-slate-200">
                    <table className="min-w-full text-sm">
                      <thead className="bg-sky-50 text-sky-900">
                        <tr>
                          <th className="text-left px-3 py-2.5 font-semibold">Critério</th>
                          {card.tabela.mostrarPesos && (
                            <th className="text-left px-3 py-2.5 font-semibold">Peso</th>
                          )}
                          {card.tabela.nomesNiveis.map((n) => (
                            <th key={n} className="text-left px-3 py-2.5 font-semibold">
                              {n}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {card.tabela.criterios.map((c, i) => (
                          <tr key={c} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                            <td className="px-3 py-2.5 font-medium text-slate-800 align-top">
                              {c}
                            </td>
                            {card.tabela.mostrarPesos && (
                              <td className="px-3 py-2.5 align-top">
                                {card.tabela.pesos[i]}%
                              </td>
                            )}
                            {descritoresPara(c, card.tabela.nomesNiveis.length).map(
                              (d, j) => (
                                <td
                                  key={j}
                                  className="px-3 py-2.5 text-slate-600 align-top min-w-[180px]"
                                >
                                  {d}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 rounded-xl border border-slate-200 p-4 max-h-72 overflow-y-auto font-sans">
                  {card.texto}
                </pre>
                <div className="mt-3">
                  <button
                    onClick={() => copiar(card.texto, card.id)}
                    className="px-4 py-2.5 rounded-xl bg-sky-100 text-sky-900 text-sm font-semibold hover:bg-sky-200 transition inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    <Icon name="copy" className="w-4 h-4" />
                    {copiadoId === card.id ? "Copiado com sucesso." : "Copiar"}
                  </button>
                </div>
              </SectionCard>
            ))}

            <div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <Icon name="arrowUp" className="w-4 h-4" /> Voltar ao início da página
              </button>
            </div>
          </div>
        )}

        {/* ---------- AVISOS FIXOS ---------- */}
        <div className="grid gap-3 lg:grid-cols-3">
          <Aviso
            icon="checkCircle"
            tom="verde"
            titulo="Validação docente"
            texto="A rubrica gerada deve ser sempre validada pelo professor. Confirme a adequação dos critérios, a clareza dos descritores, a justiça da escala e a coerência com os objetivos de aprendizagem antes de a utilizar."
          />
          <Aviso
            icon="lockShield"
            tom="ambar"
            titulo="Privacidade"
            texto="Não introduza nomes de alunos, números de processo, dados pessoais, informações clínicas ou dados sensíveis. Descreva apenas o contexto geral da tarefa ou da turma."
          />
          <Aviso
            icon="robot"
            tom="azul"
            titulo="Uso responsável de IA"
            texto="As ferramentas de Inteligência Artificial podem apoiar a construção de critérios e feedback, mas a avaliação pedagógica é sempre uma responsabilidade profissional do docente."
          />
        </div>
      </main>

      {/* ---------- RODAPÉ ---------- */}
      <footer className="bg-sky-900 text-sky-100 mt-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9" />
            <p className="text-sm">Bruno Cerqueira, 2026 | O HimalaIA responde…</p>
          </div>
          <nav aria-label="Rodapé">
            <ul className="flex gap-4 text-sm">
              <li><a href="#/" className="hover:underline">Início</a></li>
              <li><a href="#/prompts" className="hover:underline">Prompts</a></li>
              <li><a href="#/rubricas" className="hover:underline">Rubricas</a></li>
              <li><a href="#/sobre" className="hover:underline">Sobre</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
