import { useState, useMemo } from "react";

/* =========================================================================
   O HimalaIA responde... — Página 📚 Prompts Pedagógicos  (/prompts)
   Protótipo funcional, sem backend e sem API de IA.
   Toda a geração de prompts é feita localmente a partir de templates.
   =========================================================================
   Organização do ficheiro:
   1. Dados (educationData, tipos de prompt, opções)
   2. Funções de geração de prompts (templates)
   3. Componentes de UI reutilizáveis
   4. Componente principal <HimalaiaPrompts />
   ========================================================================= */

/* ---------------------------------------------------------------------- */
/* 0. IDENTIDADE VISUAL                                                    */
/*    O icone da plataforma e o avatar do Padre Himalaya (Manuel Antonio   */
/*    Gomes, 1868-1933), cientista de Arcos de Valdevez e pioneiro da      */
/*    energia solar - inspiracao do nome "HimalaIA".                       */
/*    A imagem esta embutida em base64 para o prototipo funcionar sem      */
/*    servidor de assets; em producao, mover para /public e usar src.      */
/* ---------------------------------------------------------------------- */

const AVATAR_HIMALAIA =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEREhMSERIWFhIVGBUWFRMYFRkXGBcQGBgXGBYXGhUYHSggGBolHRYXITIhJSktLi4uGR8zRDMtOCktLysBCgoKDg0OGhAQGy4gHSYvMDctLS8tKy01LS0uNTAuLy0rLS0tLS0tKy0tLS0tLS0tLysrLS0vMi0tLTctLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAwADAQEAAAAAAAAAAAAABQYHAgMECAH/xABCEAABAwIEAwYCBgYJBQAAAAABAAIDBBEFEiExBkFRBxMiYXGBMpEUI0JScqFigqKxwfAVJDNTc5Ky0eEWNWNkwv/EABoBAQADAQEBAAAAAAAAAAAAAAABAgQDBQb/xAApEQEBAAICAQMDAgcAAAAAAAAAAQIRAzESBCFBMnHREzMFIlFhgZGx/9oADAMBAAIRAxEAPwDDUREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAXZDFm/CLXPS/8dDp5L8ijLjYe5OwHUr35RYC2g+Fp6ncnz/4HJWk9t1G3nMQ5AkXGp0uPQdVxkhAPO3IblXDC+EJahodnDQRcXBOh22tZdeMcEVkJjAjMrXmzTGC6x+64W8PW5031XPym1/DLW9K19BD2l0V7taXOY46kNF3OaQBewBJbuAL6628CsE0EsEhZI0xysINti07tII9iCF48dp2gslY3K2UHM0bNnabSNA5DVrgOQeByUoRaIilAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIPfDEQ1unxanXly0/P9YL1YVSGonaxu3M9GDc/n+YXDJZrTbXID+R/PZTvDWGta0GUvb3hGjHFriNmDw6nUnTzU8t8U8WPlWr4FSBrQANlYYolnGE101PMAyrL4WlveQzN+saw2PxEZtiCL9QtAxSrkbT95ThhkNsuckMDdLk212usmo121TO1bhsyRCsiHjhFpR1p73zerDr6F3RZiyPvI5oueUys8pIwSdurM49cvRbDhtRU1BOavhLh8UDI2PYWndrtQ6xBWW0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";

function Avatar({ size = "w-12 h-12", className = "" }) {
  return (
    <img
      src={AVATAR_HIMALAIA}
      alt="Avatar do Padre Himalaya, icone da plataforma"
      className={`${size} rounded-full object-cover ring-2 ring-sky-300/60 shadow-md ${className}`}
    />
  );
}

/* ---------------------------------------------------------------------- */
/* 0.5 SISTEMA DE ICONES                                                   */
/*     Icones SVG proprios, desenhados numa grelha de 24x24 com traco de   */
/*     1.8px e cantos arredondados, para um aspeto consistente em todas    */
/*     as plataformas (os emojis variam entre sistemas operativos).        */
/*     Usam stroke="currentColor": herdam a cor do texto envolvente.       */
/* ---------------------------------------------------------------------- */

const iconPaths = {
  // Livro aberto — plano de aula / identidade da pagina
  bookOpen: (
    <>
      <path d="M12 5.2C10 3.9 7.4 3.3 4 3.3v14.2c3.4 0 6 .6 8 1.9 2-1.3 4.6-1.9 8-1.9V3.3c-3.4 0-6 .6-8 1.9z" />
      <path d="M12 5.2v14.2" />
    </>
  ),
  // Documento com linhas — ficha de trabalho
  fileText: (
    <>
      <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 16.5h6" />
    </>
  ),
  // Erlenmeyer — atividade pratica / experimental
  flask: (
    <>
      <path d="M10 3h4M10 3v6l-5.2 8.9A1.6 1.6 0 0 0 6.2 20.3h11.6a1.6 1.6 0 0 0 1.4-2.4L14 9V3" />
      <path d="M7.6 15h8.8" />
    </>
  ),
  // Lampada — pensamento critico
  lightbulb: (
    <>
      <path d="M12 3a6 6 0 0 0-3.9 10.6c.6.5.9 1.3.9 2.1h6c0-.8.3-1.6.9-2.1A6 6 0 0 0 12 3z" />
      <path d="M9.5 18.5h5M10.5 21h3" />
    </>
  ),
  // Duas pessoas — trabalho de grupo
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M15.8 5.2a3 3 0 0 1 0 5.6M17.8 15.4c1.7.8 2.7 2.3 2.7 4.6" />
    </>
  ),
  // Alvo — preparacao para exame
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.8" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  // Tabela com visto — rubrica
  tableCheck: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9.5h17M9.5 9.5v10" />
      <path d="M12.5 14.5l1.8 1.8 3.2-3.5" />
    </>
  ),
  // Balao de fala com linhas — feedback formativo
  messageLines: (
    <>
      <path d="M4.5 4.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4.5 4v-4h-1a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" />
      <path d="M8 8.5h8M8 11.5h5" />
    </>
  ),
  // Peca de puzzle — diferenciacao pedagogica
  puzzle: (
    <>
      <path d="M10.2 3.6a1.8 1.8 0 0 1 3.6 0V5H17a1 1 0 0 1 1 1v3.2h1.4a1.8 1.8 0 0 1 0 3.6H18V16a1 1 0 0 1-1 1h-3.2v1.4a1.8 1.8 0 0 1-3.6 0V17H7a1 1 0 0 1-1-1v-3.2H4.6a1.8 1.8 0 0 1 0-3.6H6V6a1 1 0 0 1 1-1h3.2z" />
    </>
  ),
  // Chip com brilho — Inteligencia Artificial
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M9.5 4v3M14.5 4v3M9.5 17v3M14.5 17v3M4 9.5h3M4 14.5h3M17 9.5h3M17 14.5h3" />
      <path d="M12 10v4M10 12h4" />
    </>
  ),
  // Escudo com cadeado — cidadania digital
  shieldLock: (
    <>
      <path d="M12 3l7 2.8v5.4c0 4.4-2.9 7.4-7 8.8-4.1-1.4-7-4.4-7-8.8V5.8z" />
      <rect x="9.6" y="11" width="4.8" height="3.8" rx="0.8" />
      <path d="M10.8 11V9.9a1.2 1.2 0 0 1 2.4 0V11" />
    </>
  ),
  // Ponto de interrogacao — quiz / teste rapido
  helpCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.3a2.4 2.4 0 1 1 3.4 2.2c-.7.3-1 .8-1 1.6" />
      <path d="M12 16.4h.01" />
    </>
  ),
  // Bussola — projeto interdisciplinar
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.2 8.8l-1.9 4.5-4.5 1.9 1.9-4.5z" />
    </>
  ),
  // Livros na estante — estudo autonomo
  books: (
    <>
      <path d="M4.5 4.5h3v15h-3zM9.5 4.5h3v15h-3z" />
      <path d="M14.6 5.6l3.2-.9 3.7 13.7-3.2.9z" />
    </>
  ),
  // Chave de bocas — outra finalidade
  wrench: (
    <>
      <path d="M15.5 3.5a5 5 0 0 0-5.4 6.9L4 16.5a2 2 0 0 0 2.8 2.8l6.1-6.1a5 5 0 0 0 6.9-5.4l-3.1 3.1-2.6-.9-.9-2.6z" />
    </>
  ),
  // Raio — modo simples (rapido)
  bolt: <path d="M13 2.5L5.5 13H11l-1 8.5L17.5 11H12z" />,
  // Reguladores — modo avancado (mais opcoes)
  sliders: (
    <>
      <path d="M6 4v5M6 13v7M12 4v10M12 18v2M18 4v2M18 10v10" />
      <circle cx="6" cy="11" r="2" />
      <circle cx="12" cy="16" r="2" />
      <circle cx="18" cy="8" r="2" />
    </>
  ),
  // Cadeado — aviso de privacidade
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  // Prancheta com visto — validacao docente
  clipboardCheck: (
    <>
      <rect x="5.5" y="4.5" width="13" height="16.5" rx="1.5" />
      <path d="M9.5 4.5V3.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v.7" />
      <path d="M9 13.5l2.2 2.2 3.8-4.2" />
    </>
  ),
  // Copiar — dois retangulos sobrepostos
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" />
    </>
  ),
  // Visto simples
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  // Caixa por selecionar
  square: <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />,
  // Caixa selecionada
  checkSquare: (
    <>
      <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5" />
    </>
  ),
  // Caixote do lixo — limpar
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" />
      <path d="M6.5 7l.9 12.4a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  // Adicionar
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  // Ficheiro — documento carregado
  file: (
    <>
      <path d="M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5z" />
      <path d="M13.5 3.5v5h5" />
    </>
  ),
  // Brilho — prompts geradas
  sparkles: (
    <>
      <path d="M11 4c.5 3.5 2 5 5.5 5.5C13 10 11.5 11.5 11 15c-.5-3.5-2-5-5.5-5.5C9 9 10.5 7.5 11 4z" />
      <path d="M17.8 14.5c.3 1.8 1.1 2.6 2.9 2.9-1.8.3-2.6 1.1-2.9 2.9-.3-1.8-1.1-2.6-2.9-2.9 1.8-.3 2.6-1.1 2.9-2.9z" />
    </>
  ),
  // Clipe — documentos de apoio
  paperclip: (
    <path d="M9 12.5l5.8-5.8a3 3 0 0 1 4.2 4.2l-7.6 7.6a5 5 0 0 1-7-7L11.8 4" />
  ),
  // Setas de navegacao
  chevronLeft: <path d="M14.5 6l-6 6 6 6" />,
  chevronRight: <path d="M9.5 6l6 6-6 6" />,
};

function Icon({ name, className = "w-5 h-5" }) {
  const paths = iconPaths[name];
  if (!paths) return null; // nome invalido: falha silenciosa, mas visivel em dev
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* 1. DADOS                                                                */
/* ---------------------------------------------------------------------- */

const educationData = {
  ciclos: [
    { id: "1ciclo", nome: "1.º Ciclo", anos: ["1.º ano", "2.º ano", "3.º ano", "4.º ano"] },
    { id: "2ciclo", nome: "2.º Ciclo", anos: ["5.º ano", "6.º ano"] },
    { id: "3ciclo", nome: "3.º Ciclo", anos: ["7.º ano", "8.º ano", "9.º ano"] },
    { id: "secundario", nome: "Ensino Secundário", anos: ["10.º ano", "11.º ano", "12.º ano"] },
    { id: "profissional", nome: "Ensino Profissional", anos: ["1.º ano", "2.º ano", "3.º ano"] },
  ],

  // Itens comuns adicionados ao fim de todas as listas de disciplinas
  disciplinasComuns: [
    "Outra disciplina / área",
    "Oferta de escola",
    "Projeto interdisciplinar",
    "Clube / atividade extracurricular",
  ],

  disciplinas: {
    "1ciclo": [
      "Português", "Matemática", "Estudo do Meio", "Educação Artística",
      "Educação Física", "Inglês", "Cidadania e Desenvolvimento",
      "Apoio ao Estudo", "Oferta Complementar", "EMRC",
    ],
    "2ciclo": [
      "Português", "Inglês", "Matemática", "Ciências Naturais",
      "História e Geografia de Portugal", "Educação Visual",
      "Educação Tecnológica", "Educação Musical", "TIC", "Educação Física",
      "Cidadania e Desenvolvimento", "EMRC", "Oferta Complementar",
    ],
    "3ciclo": [
      "Português", "Inglês", "Língua Estrangeira II", "Francês", "Espanhol",
      "Alemão", "Matemática", "Ciências Naturais", "Físico-Química",
      "História", "Geografia", "TIC", "Educação Visual",
      "Educação Tecnológica", "Educação Musical", "Educação Física",
      "Cidadania e Desenvolvimento", "EMRC", "Oferta Complementar",
    ],
    secundario: [
      "Português", "Filosofia", "Inglês", "Educação Física", "Matemática A",
      "Matemática B", "MACS", "Física e Química A", "Biologia e Geologia",
      "Biologia", "Geologia", "Física", "Química", "Economia A", "Economia C",
      "Geografia A", "Geografia C", "História A", "História B",
      "História da Cultura e das Artes", "Desenho A",
      "Geometria Descritiva A", "Literatura Portuguesa", "Psicologia B",
      "Sociologia", "Aplicações Informáticas B", "Oficina de Multimédia B",
      "Oficina de Artes", "Oficina de Design", "Línguas Estrangeiras",
      "Cidadania e Desenvolvimento", "EMRC", "Oferta de Escola",
    ],
    profissional: [
      "Português", "Inglês", "Área de Integração", "Educação Física", "TIC",
      "Matemática", "Física e Química", "Disciplinas da componente tecnológica",
    ],
  },

  componentesProfissional: [
    "Sociocultural", "Científica", "Tecnológica",
    "Formação em Contexto de Trabalho", "PAP",
  ],
};

const promptTypes = [
  { id: "plano", icon: "bookOpen", nome: "Plano de aula" },
  { id: "ficha", icon: "fileText", nome: "Ficha de trabalho" },
  { id: "pratica", icon: "flask", nome: "Atividade prática" },
  { id: "critico", icon: "lightbulb", nome: "Pensamento crítico" },
  { id: "grupo", icon: "users", nome: "Trabalho de grupo" },
  { id: "exame", icon: "target", nome: "Preparação para exame" },
  { id: "rubrica", icon: "tableCheck", nome: "Rubrica" },
  { id: "feedback", icon: "messageLines", nome: "Feedback formativo" },
  { id: "diferenciacao", icon: "puzzle", nome: "Diferenciação pedagógica" },
  { id: "ia", icon: "chip", nome: "Atividade com IA" },
  { id: "cidadania", icon: "shieldLock", nome: "Cidadania digital" },
  { id: "quiz", icon: "helpCircle", nome: "Quiz / teste rápido" },
  { id: "interdisciplinar", icon: "compass", nome: "Projeto interdisciplinar" },
  { id: "autonomo", icon: "books", nome: "Estudo autónomo" },
  { id: "outra", icon: "wrench", nome: "Outra finalidade" },
];

const diferenciacaoOptions = [
  "Criar versão mais simples",
  "Criar versão intermédia",
  "Criar versão de aprofundamento",
  "Criar tarefas por etapas",
  "Criar apoio visual",
  "Criar glossário",
  "Criar perguntas orientadoras",
  "Criar extensão para alunos avançados",
  "Criar adaptação para alunos com dificuldades",
  "Criar adaptação para alunos com Português Língua Não Materna",
];

const avaliacaoOptions = [
  "Incluir avaliação formativa",
  "Incluir critérios de sucesso",
  "Incluir rubrica",
  "Incluir grelha de observação",
  "Incluir autoavaliação",
  "Incluir heteroavaliação",
  "Incluir feedback do professor",
  "Incluir feedback entre pares",
  "Incluir solução/correção",
  "Incluir níveis de desempenho",
  "Incluir evidências de aprendizagem",
];

const iaRegrasOptions = [
  "Incluir regras de uso responsável da IA",
  "Incluir pedido de transparência sobre uso de IA",
  "Incluir reflexão ética",
  "Incluir verificação de fontes",
  "Impedir que a IA dê a resposta final aos alunos",
];

const iaPapeis = [
  "Tutor", "Avaliador", "Explicador", "Criador de recursos",
  "Orientador de estudo", "Parceiro de reflexão",
];

const ferramentasIA = [
  "ChatGPT", "Claude", "Gemini", "Copilot", "Perplexity",
  "MagicSchool", "NotebookLM", "Outra ferramenta",
];

const tiposAvaliacaoExame = [
  "Prova de Monitorização da Aprendizagem — ModA",
  "Prova Final do Ensino Básico",
  "Exame Final Nacional",
  "Prova de equivalência à frequência",
  "Teste interno inspirado em exame",
];

const objetivosExame = [
  "Revisão de conteúdos", "Treino de itens", "Simulação de prova",
  "Análise de critérios", "Feedback segundo critérios", "Plano de estudo",
];

const tiposDocumento = [
  "Aprendizagens Essenciais", "Planificação", "Critérios de avaliação",
  "Ficha de trabalho", "Matriz", "Informação-prova", "Recurso próprio", "Outro",
];

const extensoesDocumento = ["PDF", "DOCX", "TXT", "ODT", "PPTX", "XLSX"];

const tiposRecursoSimples = [
  "Plano de aula", "Ficha de trabalho", "Atividade prática",
  "Quiz / teste rápido", "Rubrica", "Guião de trabalho de grupo",
  "Material de estudo autónomo", "Outro recurso",
];

/* ---------------------------------------------------------------------- */
/* 2. GERAÇÃO DE PROMPTS (templates locais)                                */
/* ---------------------------------------------------------------------- */

const val = (v, fallback = "—") => (v && String(v).trim() ? String(v).trim() : fallback);
const lista = (arr) => (arr && arr.length ? arr.map((i) => `  - ${i}`).join("\n") : "  - (nenhuma opção selecionada)");

function nomeCiclo(cicloId) {
  const c = educationData.ciclos.find((c) => c.id === cicloId);
  return c ? c.nome : "—";
}

function nomeDisciplina(form) {
  if (form.disciplina === "Outra disciplina / área" && form.outraDisciplina) {
    return form.outraDisciplina;
  }
  return val(form.disciplina, "a disciplina indicada");
}

function nomeTipoPrompt(form) {
  if (form.modo === "simples") return val(form.tipoRecurso, "um recurso pedagógico");
  const t = promptTypes.find((t) => t.id === form.tipoPrompt);
  return t ? t.nome : "um recurso pedagógico";
}

/* ----- Prompt curta ----- */
function gerarPromptCurta(form) {
  const disciplina = nomeDisciplina(form);
  const tipo = nomeTipoPrompt(form);

  if (form.ciclo === "profissional") {
    return `Atua como professor do ensino profissional em Portugal, na área de ${val(form.cursoProfissional, "curso profissional")}, no ${val(form.ano, "ano de formação indicado")}. Cria ${tipo.toLowerCase()} sobre ${val(form.tema, "o tema indicado")}, com aplicação prática e ligação ao contexto profissional. Inclui competências a desenvolver, atividade, instruções para os alunos, produto final e avaliação por evidências. Usa linguagem clara e adequada.`;
  }

  return `Atua como professor especialista em ${disciplina}, em Portugal, no ${val(form.ano, "ano indicado")}. Cria ${tipo.toLowerCase()} sobre ${val(form.tema, "o tema indicado")}, adequado ao nível de ensino indicado. Inclui objetivos, atividade, instruções para os alunos, diferenciação e avaliação formativa. Usa linguagem clara e adequada.`;
}

/* ----- Prompt completa ----- */
function gerarPromptCompleta(form) {
  const disciplina = nomeDisciplina(form);
  const tipo = nomeTipoPrompt(form);

  if (form.ciclo === "profissional") {
    return `Atua como professor do ensino profissional em Portugal, na área de ${val(form.cursoProfissional)}, com foco na componente ${val(form.componenteProfissional, "indicada")}.

Contexto:
- Curso profissional: ${val(form.cursoProfissional)}
- Ano de formação: ${val(form.ano)}
- Disciplina/componente: ${val(disciplina)}
- UC — Unidade de Competência: ${val(form.uc)}
- Tema/conteúdo: ${val(form.tema)}
- Perfil profissional associado: ${val(form.perfilProfissional)}
- Produto final esperado: ${val(form.produtoFinal)}
- Contexto real ou simulado de trabalho: ${val(form.contextoProfissional)}

Tarefa:
Cria uma proposta pedagógica prática, aplicada e orientada para o desenvolvimento de competências profissionais.

A resposta deve incluir:
1. Competências a desenvolver;
2. Situação-problema ou desafio profissional;
3. Etapas da atividade;
4. Recursos necessários;
5. Produto final;
6. Critérios de avaliação;
7. Evidências de desempenho;
8. Estratégias de diferenciação;
9. Ligação ao mundo do trabalho;
10. Reflexão final do aluno sobre o processo.`;
  }

  return `Atua como professor especialista em ${disciplina}, em Portugal, no ${val(form.ano)} do ${nomeCiclo(form.ciclo)}.

Contexto:
- Nível de ensino: ${nomeCiclo(form.ciclo)}
- Ciclo/ano: ${nomeCiclo(form.ciclo)} / ${val(form.ano)}
- Disciplina/área: ${disciplina}
- Tema/conteúdo: ${val(form.tema)}${form.subtema ? `\n- Subtema: ${form.subtema}` : ""}
- Objetivo de aprendizagem: ${val(form.objetivo)}
- Tipo de atividade pretendida: ${tipo}
- Duração prevista: ${val(form.duracao)}
- Modalidade: ${val(form.modalidade)}
- Perfil geral da turma: ${val(form.perfilTurma)}
- Necessidades de diferenciação: ${form.diferenciacao?.length ? form.diferenciacao.join("; ") : "—"}
- Recursos disponíveis: ${val(form.recursos)}
- Ferramenta de IA a utilizar: ${val(form.ferramenta)}

Tarefa:
Cria uma proposta pedagógica adequada ao contexto indicado.

A resposta deve incluir:
1. Objetivos de aprendizagem;
2. Descrição da atividade;
3. Etapas de implementação;
4. Instruções para os alunos;
5. Estratégias de diferenciação;
6. Estratégias de avaliação formativa;
7. Critérios de sucesso;
8. Possíveis dificuldades dos alunos;
9. Sugestões de remediação;
10. Extensão para alunos mais autónomos;
11. Cuidados no uso responsável da Inteligência Artificial, quando aplicável.

Regras:
- Usa linguagem clara, rigorosa e adequada ao nível de ensino.
- Evita respostas genéricas.
- Não inventes documentos oficiais.
- Indica quando algo deve ser confirmado pelo professor.
- Adapta a proposta ao currículo português.
- Não uses dados pessoais de alunos.`;
}

/* ----- Prompt avançada ----- */
function gerarPromptAvancada(form) {
  const disciplina = nomeDisciplina(form);
  const tipo = nomeTipoPrompt(form);
  const profissional = form.ciclo === "profissional";

  const perfilTurma = [
    form.perfilTurma && `Descrição geral: ${form.perfilTurma}`,
    form.autonomia && `Grau de autonomia: ${form.autonomia}`,
    form.motivacao && `Nível de motivação: ${form.motivacao}`,
    form.ritmo && `Ritmo de trabalho: ${form.ritmo}`,
    form.competenciaDigital && `Competência digital dos alunos: ${form.competenciaDigital}`,
    form.dificuldades && `Dificuldades principais: ${form.dificuldades}`,
  ].filter(Boolean);

  const blocoIA = [
    form.iaDestinatario && `Destinatário da prompt: ${form.iaDestinatario}`,
    form.iaPapel && `Papel da IA: ${form.iaPapel}`,
    ...(form.iaRegras || []),
  ].filter(Boolean);

  const blocoExame = form.preparaExame
    ? `
Preparação para prova/exame:
- Tipo de avaliação: ${val(form.exameTipo)}
- Disciplina da prova: ${val(form.exameDisciplina, disciplina)}
- Código da prova: ${val(form.exameCodigo, "não indicado")}
- Objetivo: ${val(form.exameObjetivo)}
- Nota: baseia-te apenas em estruturas gerais de prova; não inventes conteúdos de documentos oficiais do IAVE/EduQA. Indica sempre o que o professor deve confirmar nas informações-prova oficiais.
`
    : "";

  const cabecalho = profissional
    ? `Atua como professor do ensino profissional em Portugal, na área de ${val(form.cursoProfissional)}, com foco na componente ${val(form.componenteProfissional, "indicada")}, no ${val(form.ano)}.`
    : `Atua como professor especialista em ${disciplina}, em Portugal, no ${val(form.ano)} do ${nomeCiclo(form.ciclo)}.`;

  const contextoProfissional = profissional
    ? `
Contexto profissional:
- Curso: ${val(form.cursoProfissional)}
- Componente: ${val(form.componenteProfissional)}
- UC — Unidade de Competência: ${val(form.uc)}
- Perfil profissional associado: ${val(form.perfilProfissional)}
- Produto final esperado: ${val(form.produtoFinal)}
- Contexto real ou simulado de trabalho: ${val(form.contextoProfissional)}
- Ligação ao mundo do trabalho: ${val(form.ligacaoTrabalho)}
`
    : "";

  return `${cabecalho}

=== 1. CONTEXTO CURRICULAR ===
- Nível de ensino: ${nomeCiclo(form.ciclo)}
- Ano: ${val(form.ano)}
- Disciplina/área: ${disciplina}
- Tema: ${val(form.tema)}${form.subtema ? `\n- Subtema: ${form.subtema}` : ""}
- Objetivo de aprendizagem: ${val(form.objetivo)}
- Alinhamento: a proposta deve respeitar o currículo português em vigor (Aprendizagens Essenciais quando aplicável).
${contextoProfissional}
=== 2. PERFIL DA TURMA ===
${perfilTurma.length ? perfilTurma.map((l) => `- ${l}`).join("\n") : "- Sem informação adicional; assume uma turma heterogénea."}

=== 3. ATIVIDADE PRETENDIDA ===
- Tipo: ${tipo}
- Duração prevista: ${val(form.duracao)}
- Modalidade: ${val(form.modalidade)}
- Recursos disponíveis: ${val(form.recursos)}

=== 4. DIFERENCIAÇÃO PEDAGÓGICA ===
${lista(form.diferenciacao)}

=== 5. AVALIAÇÃO ===
${lista(form.avaliacao)}

=== 6. USO RESPONSÁVEL DA IA ===
${blocoIA.length ? blocoIA.map((l) => `- ${l}`).join("\n") : "- Não aplicável nesta atividade."}
- Ferramenta prevista: ${val(form.ferramenta, "não especificada")}
${blocoExame}
=== 7. TAREFA ===
Cria uma proposta pedagógica completa, estruturada e diretamente utilizável, adequada a todo o contexto acima.

=== 8. CRITÉRIOS DE QUALIDADE DA RESPOSTA ===
- Linguagem clara, rigorosa e adequada ao nível de ensino;
- Estrutura organizada por secções;
- Instruções concretas e acionáveis para alunos e professor;
- Coerência entre objetivos, atividade e avaliação;
- Propostas realistas e exequíveis em contexto de sala de aula portuguesa.

=== 9. CUIDADOS ÉTICOS ===
- Não uses nem peças dados pessoais de alunos;
- Não inventes documentos oficiais, normativos ou referências;
- Assinala explicitamente tudo o que o professor deve confirmar;
- Promove inclusão e acessibilidade nas propostas.

=== 10. VALIDAÇÃO DOCENTE ===
No final da resposta, inclui uma checklist curta de validação para o professor confirmar: rigor científico, adequação curricular, linguagem, inclusão e exequibilidade.`;
}

/* ---------------------------------------------------------------------- */
/* 3. COMPONENTES DE UI                                                    */
/* ---------------------------------------------------------------------- */

function Field({ label, required, children, hint }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 " +
  "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-sm";

function Select({ value, onChange, options, placeholder }) {
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder || "Selecionar…"}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function CheckGroup({ options, selected, onToggle, columns = 2 }) {
  return (
    <div className={`grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {options.map((o) => {
        const active = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={active}
            className={`text-left text-sm rounded-xl border px-4 py-2.5 transition-colors ${
              active
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <span className="flex items-start gap-2">
              <Icon name={active ? "checkSquare" : "square"}
                className={`w-4 h-4 mt-0.5 shrink-0 ${active ? "text-emerald-600" : "text-slate-400"}`} />
              <span>{o}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Aviso({ tipo, children }) {
  const styles = {
    privacidade: "bg-amber-50 border-amber-300 text-amber-900",
    validacao: "bg-sky-50 border-sky-300 text-sky-900",
    ia: "bg-emerald-50 border-emerald-300 text-emerald-900",
  };
  const icons = { privacidade: "lock", validacao: "clipboardCheck", ia: "chip" };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed flex gap-2.5 ${styles[tipo]}`}>
      <Icon name={icons[tipo]} className="w-5 h-5 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function CopyButton({ text, label = "Copiar prompt" }) {
  const [copied, setCopied] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback para ambientes onde a Clipboard API está bloqueada
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copiar}
      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
        copied ? "bg-emerald-600 text-white" : "bg-sky-600 text-white hover:bg-sky-700"
      }`}
    >
      <Icon name={copied ? "check" : "copy"} className="w-4 h-4" />
      {copied ? "Copiado!" : label}
    </button>
  );
}

function ResultCard({ titulo, badge, texto, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-slate-800">{titulo}</h3>
        {badge && (
          <span className="rounded-full bg-sky-100 text-sky-800 text-xs font-medium px-3 py-1">
            {badge}
          </span>
        )}
      </div>
      {texto !== undefined ? (
        <>
          <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed font-sans max-h-80 overflow-y-auto">
            {texto}
          </pre>
          <div className="mt-3">
            <CopyButton text={texto} />
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
}

/* Cordilheira decorativa (assinatura visual "HimalaIA") */
function Montanhas({ className }) {
  return (
    <svg viewBox="0 0 800 120" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d="M0 120 L120 45 L180 80 L280 20 L360 90 L470 30 L560 85 L680 40 L800 100 L800 120 Z"
        fill="currentColor" opacity="0.15" />
      <path d="M0 120 L90 70 L200 100 L320 50 L430 105 L540 60 L660 100 L800 65 L800 120 Z"
        fill="currentColor" opacity="0.3" />
      <path d="M270 26 L280 20 L292 28 L286 30 L280 25 L275 29 Z" fill="white" opacity="0.9" />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* 4. COMPONENTE PRINCIPAL                                                 */
/* ---------------------------------------------------------------------- */

const formInicial = {
  modo: "", // "simples" | "avancado"
  // Contexto base
  ciclo: "", ano: "", disciplina: "", outraDisciplina: "",
  tema: "", subtema: "", objetivo: "", duracao: "", modalidade: "",
  tipoRecurso: "", tipoPrompt: "", recursos: "", ferramenta: "",
  // Perfil da turma (avançado)
  perfilTurma: "", autonomia: "", motivacao: "", ritmo: "",
  competenciaDigital: "", dificuldades: "",
  // Seleções múltiplas
  diferenciacao: [], avaliacao: [], iaRegras: [],
  iaDestinatario: "", iaPapel: "",
  // Ensino profissional
  cursoProfissional: "", componenteProfissional: "", uc: "",
  perfilProfissional: "", produtoFinal: "", contextoProfissional: "",
  ligacaoTrabalho: "",
  // Exame
  preparaExame: false, exameTipo: "", exameDisciplina: "",
  exameCodigo: "", exameObjetivo: "",
};

export default function HimalaiaPrompts() {
  const [form, setForm] = useState(formInicial);
  const [etapa, setEtapa] = useState(0); // 0 = escolha de modo
  const [erros, setErros] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [docs, setDocs] = useState([]);
  const [novoDoc, setNovoDoc] = useState({
    nome: "", extensao: "PDF", tipo: "", ciclo: "", ano: "",
    disciplina: "", visibilidade: "Privado", observacoes: "",
  });

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const toggle = (campo, valor) =>
    setForm((f) => ({
      ...f,
      [campo]: f[campo].includes(valor)
        ? f[campo].filter((v) => v !== valor)
        : [...f[campo], valor],
    }));

  const cicloAtual = educationData.ciclos.find((c) => c.id === form.ciclo);
  const anosDisponiveis = cicloAtual ? cicloAtual.anos : [];
  const disciplinasDisponiveis = useMemo(() => {
    if (!form.ciclo) return [];
    return [
      ...(educationData.disciplinas[form.ciclo] || []),
      ...educationData.disciplinasComuns,
    ];
  }, [form.ciclo]);

  const profissional = form.ciclo === "profissional";
  const avancado = form.modo === "avancado";

  // Etapas do assistente (dependem do modo)
  const etapas = avancado
    ? ["Contexto", "Tipo de prompt", "Turma", "Diferenciação e avaliação", "IA e exame", "Documentos", "Gerar"]
    : ["Contexto", "Tipo de recurso", "Documentos", "Gerar"];

  /* --------- validação mínima --------- */
  function validar() {
    const e = [];
    if (!form.ciclo) e.push("Indique o ciclo / nível de ensino.");
    if (!form.ano) e.push("Indique o ano.");
    if (!form.disciplina && !profissional) e.push("Indique a disciplina.");
    if (form.disciplina === "Outra disciplina / área" && !form.outraDisciplina.trim())
      e.push("Indique o nome da outra disciplina / área.");
    if (!form.tema.trim()) e.push("Indique o tema ou conteúdo.");
    if (form.modo === "simples" && !form.tipoRecurso)
      e.push("Indique o tipo de recurso pretendido.");
    if (avancado && !form.tipoPrompt)
      e.push("Escolha um tipo de prompt.");
    if (profissional && !form.cursoProfissional.trim())
      e.push("Indique o curso profissional.");
    return e;
  }

  function gerar() {
    const e = validar();
    setErros(e);
    if (e.length) return;
    setResultado({
      curta: gerarPromptCurta(form),
      completa: gerarPromptCompleta(form),
      avancada: gerarPromptAvancada(form),
    });
    // Scroll suave até ao resultado
    setTimeout(() => {
      document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function limpar() {
    setForm(formInicial);
    setEtapa(0);
    setErros([]);
    setResultado(null);
    setDocs([]);
  }

  function adicionarDoc() {
    if (!novoDoc.nome.trim()) return;
    setDocs((d) => [...d, { ...novoDoc, id: Date.now() }]);
    setNovoDoc({
      nome: "", extensao: "PDF", tipo: "", ciclo: "", ano: "",
      disciplina: "", visibilidade: "Privado", observacoes: "",
    });
  }

  /* ==================================================================== */
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ---------- Cabeçalho ---------- */}
      <header className="relative bg-sky-900 text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-16 relative z-10">
          <div className="flex items-center gap-3">
            <Avatar />
            <div>
              <p className="text-lg font-bold tracking-tight">O HimalaIA responde…</p>
              <p className="text-sky-200 text-xs">Plataforma de apoio pedagógico ao uso de IA</p>
            </div>
          </div>
          <div className="mt-8">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <Icon name="bookOpen" className="w-8 h-8 text-sky-300" />
              Prompts Pedagógicos
            </h1>
            <p className="mt-2 max-w-2xl text-sky-100 text-sm sm:text-base leading-relaxed">
              Construa, passo a passo, uma prompt pedagógica clara e completa — adequada ao
              ciclo, ano, disciplina, turma e objetivos — e copie-a para a ferramenta de IA
              que preferir.
            </p>
            <p className="mt-4 inline-block rounded-full bg-sky-800/70 border border-sky-700 px-4 py-1.5 text-xs sm:text-sm text-sky-100">
              O HimalaIA não substitui a IA. Ajuda o professor a pedir melhor à IA.
            </p>
          </div>
        </div>
        <Montanhas className="absolute bottom-0 left-0 w-full h-16 text-sky-300" />
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <p className="text-center text-slate-500 text-sm italic">
          Criar melhores perguntas. Obter melhores respostas pedagógicas.
        </p>

        {/* ---------- Escolha do modo ---------- */}
        <section aria-label="Escolha do modo">
          <h2 className="text-lg font-semibold mb-3">1. Escolha o modo de utilização</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                id: "simples", icon: "bolt", nome: "Modo Simples",
                texto: "Use este modo se pretende criar rapidamente uma prompt sem preencher muitos detalhes. Basta indicar o ano, disciplina, tema e tipo de recurso pretendido.",
              },
              {
                id: "avancado", icon: "sliders", nome: "Modo Avançado",
                texto: "Use este modo se pretende uma prompt mais completa, com contexto da turma, diferenciação pedagógica, avaliação formativa, uso responsável da IA e alinhamento com objetivos de aprendizagem.",
              },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => { set("modo", m.id); setEtapa(1); setResultado(null); }}
                aria-pressed={form.modo === m.id}
                className={`text-left rounded-2xl border-2 p-5 transition-all ${
                  form.modo === m.id
                    ? "border-sky-500 bg-sky-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm"
                }`}
              >
                <Icon name={m.icon} className={`w-8 h-8 ${form.modo === m.id ? "text-sky-600" : "text-slate-400"}`} />
                <h3 className="mt-2 font-semibold text-slate-800">{m.nome}</h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{m.texto}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ---------- Formulário por etapas ---------- */}
        {form.modo && (
          <section aria-label="Formulário" className="space-y-6">
            {/* Indicador de etapas (metáfora: subida da montanha) */}
            <nav aria-label="Etapas" className="flex flex-wrap gap-2">
              {etapas.map((nome, i) => {
                const n = i + 1;
                const ativa = etapa === n;
                const feita = etapa > n;
                return (
                  <button
                    key={nome}
                    type="button"
                    onClick={() => setEtapa(n)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors ${
                      ativa
                        ? "bg-sky-600 border-sky-600 text-white"
                        : feita
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {feita ? <Icon name="check" className="w-3 h-3 inline -mt-0.5 mr-1" /> : `${n}. `}{nome}
                  </button>
                );
              })}
            </nav>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
              {/* ===== ETAPA 1 — Contexto ===== */}
              {etapa === 1 && (
                <>
                  <h2 className="font-semibold text-slate-800">Contexto curricular</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Ciclo / nível de ensino" required>
                      <select
                        className={inputCls}
                        value={form.ciclo}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, ciclo: e.target.value, ano: "", disciplina: "" }))
                        }
                      >
                        <option value="">Selecionar…</option>
                        {educationData.ciclos.map((c) => (
                          <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label={profissional ? "Ano de formação" : "Ano"} required>
                      <Select value={form.ano} onChange={(v) => set("ano", v)} options={anosDisponiveis} />
                    </Field>
                  </div>
                  {profissional && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-4">
                      <h3 className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
                        <Icon name="wrench" className="w-4 h-4" />
                        Ensino Profissional — contexto específico
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Curso profissional" required>
                          <input className={inputCls} value={form.cursoProfissional}
                            onChange={(e) => set("cursoProfissional", e.target.value)}
                            placeholder="Ex.: Técnico de Multimédia" />
                        </Field>
                        <Field label="Componente">
                          <Select value={form.componenteProfissional}
                            onChange={(v) => set("componenteProfissional", v)}
                            options={educationData.componentesProfissional} />
                        </Field>
                        <Field label="UC — Unidade de Competência"
                          hint="Nos cursos profissionais usa-se a designação UC — Unidade de Competência.">
                          <input className={inputCls} value={form.uc}
                            onChange={(e) => set("uc", e.target.value)}
                            placeholder="Ex.: UC — Edição de vídeo digital" />
                        </Field>
                        <Field label="Perfil profissional associado">
                          <input className={inputCls} value={form.perfilProfissional}
                            onChange={(e) => set("perfilProfissional", e.target.value)}
                            placeholder="Ex.: Técnico de Multimédia (QNQ nível 4)" />
                        </Field>
                        <Field label="Produto final esperado">
                          <input className={inputCls} value={form.produtoFinal}
                            onChange={(e) => set("produtoFinal", e.target.value)}
                            placeholder="Ex.: Vídeo promocional de 60 segundos" />
                        </Field>
                        <Field label="Contexto profissional (real ou simulado)">
                          <input className={inputCls} value={form.contextoProfissional}
                            onChange={(e) => set("contextoProfissional", e.target.value)}
                            placeholder="Ex.: Encomenda simulada de um cliente local" />
                        </Field>
                        <Field label="Ligação ao mundo do trabalho">
                          <input className={inputCls} value={form.ligacaoTrabalho}
                            onChange={(e) => set("ligacaoTrabalho", e.target.value)}
                            placeholder="Ex.: Parceria com empresas da região" />
                        </Field>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Disciplina" required={!profissional}>
                      <Select value={form.disciplina} onChange={(v) => set("disciplina", v)}
                        options={disciplinasDisponiveis}
                        placeholder={form.ciclo ? "Selecionar disciplina…" : "Escolha primeiro o ciclo"} />
                    </Field>
                    {form.disciplina === "Outra disciplina / área" && (
                      <Field label="Outra disciplina / área" required>
                        <input className={inputCls} value={form.outraDisciplina}
                          onChange={(e) => set("outraDisciplina", e.target.value)}
                          placeholder="Indique a disciplina ou área" />
                      </Field>
                    )}
                    <Field label="Tema ou conteúdo" required>
                      <input className={inputCls} value={form.tema}
                        onChange={(e) => set("tema", e.target.value)}
                        placeholder="Ex.: O ciclo da água" />
                    </Field>
                    {avancado && (
                      <>
                        <Field label="Subtema">
                          <input className={inputCls} value={form.subtema}
                            onChange={(e) => set("subtema", e.target.value)}
                            placeholder="Ex.: Evaporação e condensação" />
                        </Field>
                        <Field label="Objetivo de aprendizagem">
                          <input className={inputCls} value={form.objetivo}
                            onChange={(e) => set("objetivo", e.target.value)}
                            placeholder="Ex.: Explicar as fases do ciclo da água" />
                        </Field>
                        <Field label="Duração">
                          <Select value={form.duracao} onChange={(v) => set("duracao", v)}
                            options={["50 minutos", "100 minutos", "2 a 3 aulas", "Projeto de várias semanas", "Outra duração"]} />
                        </Field>
                        <Field label="Modalidade">
                          <Select value={form.modalidade} onChange={(v) => set("modalidade", v)}
                            options={["Presencial", "Online", "Híbrida", "Trabalho autónomo"]} />
                        </Field>
                        <Field label="Recursos disponíveis">
                          <input className={inputCls} value={form.recursos}
                            onChange={(e) => set("recursos", e.target.value)}
                            placeholder="Ex.: Projetor, tablets partilhados, manual" />
                        </Field>
                        <Field label="Ferramenta onde a prompt será usada">
                          <Select value={form.ferramenta} onChange={(v) => set("ferramenta", v)}
                            options={ferramentasIA} />
                        </Field>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* ===== ETAPA 2 — Tipo de prompt / recurso ===== */}
              {etapa === 2 && (
                <>
                  <h2 className="font-semibold text-slate-800">
                    {avancado ? "Tipo de prompt" : "Tipo de recurso pretendido"}
                  </h2>
                  {avancado ? (
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                      {promptTypes.map((t) => {
                        const ativo = form.tipoPrompt === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => set("tipoPrompt", t.id)}
                            aria-pressed={ativo}
                            className={`rounded-2xl border-2 p-4 text-center transition-all ${
                              ativo
                                ? "border-emerald-500 bg-emerald-50 shadow-md scale-105"
                                : "border-slate-200 bg-white hover:border-emerald-300"
                            }`}
                          >
                            <Icon name={t.icon} className={`w-7 h-7 mx-auto ${ativo ? "text-emerald-600" : "text-slate-400"}`} />
                            <span className={`mt-2 block text-xs font-medium ${ativo ? "text-emerald-900" : "text-slate-600"}`}>
                              {t.nome}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <Field label="Tipo de recurso" required>
                      <Select value={form.tipoRecurso} onChange={(v) => set("tipoRecurso", v)}
                        options={tiposRecursoSimples} />
                    </Field>
                  )}
                </>
              )}

              {/* ===== ETAPA 3 (avançado) — Perfil da turma ===== */}
              {avancado && etapa === 3 && (
                <>
                  <h2 className="font-semibold text-slate-800">Perfil geral da turma</h2>
                  <Aviso tipo="privacidade">
                    Não introduza nomes de alunos, números de processo, dados pessoais ou
                    informações sensíveis. Descreva apenas necessidades gerais da turma.
                  </Aviso>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field label="Perfil geral da turma">
                        <textarea className={`${inputCls} min-h-20`} value={form.perfilTurma}
                          onChange={(e) => set("perfilTurma", e.target.value)}
                          placeholder="Ex.: Turma de 24 alunos, participativa, com interesses diversos" />
                      </Field>
                    </div>
                    <Field label="Grau de autonomia">
                      <Select value={form.autonomia} onChange={(v) => set("autonomia", v)}
                        options={["Baixo", "Médio", "Elevado", "Muito heterogéneo"]} />
                    </Field>
                    <Field label="Nível de motivação">
                      <Select value={form.motivacao} onChange={(v) => set("motivacao", v)}
                        options={["Baixo", "Médio", "Elevado", "Variável consoante o tema"]} />
                    </Field>
                    <Field label="Ritmo de trabalho">
                      <Select value={form.ritmo} onChange={(v) => set("ritmo", v)}
                        options={["Lento", "Médio", "Rápido", "Muito heterogéneo"]} />
                    </Field>
                    <Field label="Competência digital dos alunos">
                      <Select value={form.competenciaDigital} onChange={(v) => set("competenciaDigital", v)}
                        options={["Básica", "Intermédia", "Avançada", "Muito heterogénea"]} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Dificuldades principais">
                        <input className={inputCls} value={form.dificuldades}
                          onChange={(e) => set("dificuldades", e.target.value)}
                          placeholder="Ex.: Interpretação de enunciados; expressão escrita" />
                      </Field>
                    </div>
                  </div>
                </>
              )}

              {/* ===== ETAPA 4 (avançado) — Diferenciação e avaliação ===== */}
              {avancado && etapa === 4 && (
                <>
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Icon name="puzzle" className="w-5 h-5 text-sky-600" />Diferenciação pedagógica</h2>
                  <CheckGroup options={diferenciacaoOptions} selected={form.diferenciacao}
                    onToggle={(v) => toggle("diferenciacao", v)} />
                  <Aviso tipo="privacidade">
                    Não introduza nomes de alunos, números de processo, dados pessoais ou
                    informações sensíveis. Descreva apenas necessidades gerais da turma.
                  </Aviso>
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2 pt-2"><Icon name="tableCheck" className="w-5 h-5 text-sky-600" />Avaliação</h2>
                  <CheckGroup options={avaliacaoOptions} selected={form.avaliacao}
                    onToggle={(v) => toggle("avaliacao", v)} />
                </>
              )}

              {/* ===== ETAPA 5 (avançado) — IA e exame ===== */}
              {avancado && etapa === 5 && (
                <>
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Icon name="chip" className="w-5 h-5 text-sky-600" />Utilização de IA</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="A prompt destina-se a…">
                      <Select value={form.iaDestinatario} onChange={(v) => set("iaDestinatario", v)}
                        options={["Uso pelo professor", "Uso pelos alunos", "Uso misto (professor e alunos)"]} />
                    </Field>
                    <Field label="A IA deve atuar como…">
                      <Select value={form.iaPapel} onChange={(v) => set("iaPapel", v)} options={iaPapeis} />
                    </Field>
                  </div>
                  <Field label="Opções de uso responsável">
                    <CheckGroup options={iaRegrasOptions} selected={form.iaRegras}
                      onToggle={(v) => toggle("iaRegras", v)} />
                  </Field>

                  <h2 className="font-semibold text-slate-800 flex items-center gap-2 pt-2"><Icon name="target" className="w-5 h-5 text-sky-600" />Preparação para prova/exame</h2>
                  <button
                    type="button"
                    onClick={() => set("preparaExame", !form.preparaExame)}
                    aria-pressed={form.preparaExame}
                    className={`rounded-xl border px-4 py-3 text-sm text-left w-full transition-colors ${
                      form.preparaExame
                        ? "border-amber-400 bg-amber-50 text-amber-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon name={form.preparaExame ? "checkSquare" : "square"}
                        className={`w-4 h-4 shrink-0 ${form.preparaExame ? "text-amber-600" : "text-slate-400"}`} />
                      Esta prompt destina-se à preparação para prova ou exame
                    </span>
                  </button>
                  {form.preparaExame && (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Tipo de avaliação">
                          <Select value={form.exameTipo} onChange={(v) => set("exameTipo", v)}
                            options={tiposAvaliacaoExame} />
                        </Field>
                        <Field label="Disciplina da prova">
                          <input className={inputCls} value={form.exameDisciplina}
                            onChange={(e) => set("exameDisciplina", e.target.value)}
                            placeholder="Ex.: Matemática A" />
                        </Field>
                        <Field label="Código da prova (se souber)">
                          <input className={inputCls} value={form.exameCodigo}
                            onChange={(e) => set("exameCodigo", e.target.value)}
                            placeholder="Ex.: 635" />
                        </Field>
                        <Field label="Objetivo">
                          <Select value={form.exameObjetivo} onChange={(v) => set("exameObjetivo", v)}
                            options={objetivosExame} />
                        </Field>
                      </div>
                      <Aviso tipo="validacao">
                        Consulte sempre as informações oficiais do IAVE/EduQA. Esta ferramenta
                        ajuda a estruturar prompts, mas não substitui os documentos oficiais de
                        prova, critérios ou calendário.
                      </Aviso>
                    </div>
                  )}
                </>
              )}

              {/* ===== ETAPA Documentos (penúltima em ambos os modos) ===== */}
              {etapa === etapas.length - 1 && (
                <>
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Icon name="paperclip" className="w-5 h-5 text-sky-600" />Documentos de apoio</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Pode carregar documentos para organizar o seu trabalho ou para usar como
                    referência ao criar a prompt. Na versão atual, o HimalaIA não interpreta
                    automaticamente o conteúdo dos documentos; a prompt gerada pode ajudá-lo a
                    indicar à IA que considere excertos ou documentos que o professor venha a
                    fornecer.
                  </p>
                  <Aviso tipo="privacidade">
                    Não carregue documentos com dados pessoais de alunos, encarregados de
                    educação ou docentes. Evite pautas, relatórios individuais, informações
                    clínicas, medidas seletivas/adicionais identificadas ou documentos internos
                    sensíveis.
                  </Aviso>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nome do documento">
                      <input className={inputCls} value={novoDoc.nome}
                        onChange={(e) => setNovoDoc((d) => ({ ...d, nome: e.target.value }))}
                        placeholder="Ex.: AE_CienciasNaturais_7ano" />
                    </Field>
                    <Field label="Formato">
                      <Select value={novoDoc.extensao}
                        onChange={(v) => setNovoDoc((d) => ({ ...d, extensao: v }))}
                        options={extensoesDocumento} />
                    </Field>
                    <Field label="Tipo de documento">
                      <Select value={novoDoc.tipo}
                        onChange={(v) => setNovoDoc((d) => ({ ...d, tipo: v }))}
                        options={tiposDocumento} />
                    </Field>
                    <Field label="Visibilidade">
                      <Select value={novoDoc.visibilidade}
                        onChange={(v) => setNovoDoc((d) => ({ ...d, visibilidade: v }))}
                        options={["Privado", "Público"]} />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Observações">
                        <input className={inputCls} value={novoDoc.observacoes}
                          onChange={(e) => setNovoDoc((d) => ({ ...d, observacoes: e.target.value }))}
                          placeholder="Notas sobre o documento (opcional)" />
                      </Field>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={adicionarDoc}
                    disabled={!novoDoc.nome.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 text-white px-5 py-2.5 text-sm font-medium hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Icon name="plus" className="w-4 h-4" />
                    Adicionar documento (simulado)
                  </button>
                  {docs.length > 0 && (
                    <ul className="space-y-2">
                      {docs.map((d) => (
                        <li key={d.id}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
                          <span>
                            <Icon name="file" className="w-4 h-4 inline -mt-0.5 mr-1.5 text-slate-400" /><strong>{d.nome}</strong>.{d.extensao.toLowerCase()}
                            {d.tipo && <span className="text-slate-500"> · {d.tipo}</span>}
                            <span className="text-slate-400"> · {d.visibilidade}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setDocs((ds) => ds.filter((x) => x.id !== d.id))}
                            className="text-rose-500 hover:text-rose-700 text-xs font-medium"
                          >
                            Remover
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {/* ===== ETAPA final — Gerar ===== */}
              {etapa === etapas.length && (
                <div className="text-center space-y-4 py-4">
                  <Avatar size="w-16 h-16" className="mx-auto" />
                  <h2 className="font-semibold text-slate-800">O HimalaIA está pronto a responder. Gerar a prompt?</h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Serão geradas três versões da prompt — curta, completa e avançada — a partir
                    das opções que preencheu. Pode voltar atrás a qualquer etapa para ajustar.
                  </p>
                  {erros.length > 0 && (
                    <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-left text-sm text-rose-800 max-w-md mx-auto">
                      <p className="font-medium mb-1">Antes de gerar, complete o seguinte:</p>
                      <ul className="list-disc pl-5 space-y-0.5">
                        {erros.map((e) => <li key={e}>{e}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={gerar}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-8 py-3.5 text-base font-semibold hover:bg-emerald-700 shadow-sm"
                    >
                      <Icon name="sparkles" className="w-5 h-5" />
                      Gerar prompt
                    </button>
                    <button
                      type="button"
                      onClick={limpar}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-600 px-6 py-3.5 text-base font-medium hover:bg-slate-50"
                    >
                      <Icon name="trash" className="w-4 h-4" />
                      Limpar / recomeçar
                    </button>
                  </div>
                </div>
              )}

              {/* Navegação entre etapas */}
              {etapa < etapas.length && (
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEtapa((e) => Math.max(1, e - 1))}
                    disabled={etapa === 1}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <Icon name="chevronLeft" className="w-4 h-4" />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setEtapa((e) => Math.min(etapas.length, e + 1))}
                    className="inline-flex items-center gap-1 rounded-xl bg-sky-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-sky-700"
                  >
                    Seguinte
                    <Icon name="chevronRight" className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ---------- Resultado ---------- */}
        {resultado && (
          <section id="resultado" aria-label="Resultado" className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="sparkles" className="w-5 h-5 text-amber-500" />
              Prompts geradas
            </h2>
            <ResultCard titulo="1 · Prompt curta" badge="rápida de usar" texto={resultado.curta} />
            <ResultCard titulo="2 · Prompt completa" badge="equilibrada" texto={resultado.completa} />
            <ResultCard titulo="3 · Prompt avançada" badge="muito estruturada" texto={resultado.avancada} />

            <ResultCard titulo="4 · Como usar esta prompt">
              <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-700">
                <li>Copie a prompt.</li>
                <li>Cole na ferramenta de IA escolhida.</li>
                <li>Acrescente documentos, excertos ou critérios, se necessário.</li>
                <li>Leia criticamente a resposta.</li>
                <li>Adapte ao contexto da sua turma.</li>
                <li>Confirme conteúdos curriculares e científicos.</li>
              </ol>
            </ResultCard>

            <ResultCard titulo="5 · Cuidados a ter">
              <p className="text-sm text-slate-700 leading-relaxed">
                A IA pode cometer erros, simplificar demasiado, inventar informação ou produzir
                propostas desajustadas. O professor deve validar sempre o rigor científico, a
                adequação curricular, a linguagem, a inclusão e a exequibilidade da atividade.
              </p>
            </ResultCard>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={limpar}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-600 px-6 py-3 text-sm font-medium hover:bg-slate-50"
              >
                <Icon name="trash" className="w-4 h-4" />
                Limpar e criar nova prompt
              </button>
            </div>
          </section>
        )}

        {/* ---------- Avisos fixos ---------- */}
        <section aria-label="Avisos" className="space-y-3 pt-4">
          <Aviso tipo="validacao">
            A prompt gerada deve ser sempre validada pelo professor. Confirme o rigor
            científico, a adequação curricular, a linguagem e a exequibilidade da proposta
            antes de a usar com os alunos.
          </Aviso>
          <Aviso tipo="privacidade">
            Não introduza nomes de alunos, números de processo, dados pessoais, informações
            clínicas ou dados sensíveis. Descreva apenas o perfil geral da turma.
          </Aviso>
          <Aviso tipo="ia">
            As ferramentas de Inteligência Artificial podem cometer erros, simplificar
            conteúdos ou produzir informações incorretas. Use sempre pensamento crítico e
            confirme as fontes quando necessário.
          </Aviso>
        </section>
      </main>

      <footer className="relative bg-sky-900 text-sky-200 mt-10">
        <Montanhas className="absolute top-0 left-0 w-full h-10 text-sky-950 rotate-180" />
        <div className="max-w-5xl mx-auto px-4 py-10 pt-16 text-center text-xs relative z-10">
          <Avatar size="w-10 h-10" className="mx-auto mb-2" />
          <p className="font-semibold text-white text-sm mb-1">O HimalaIA responde…</p>
          <p>Criar melhores perguntas. Obter melhores respostas pedagógicas.</p>
          <p className="mt-2 text-sky-400">
            Nome inspirado no Padre Himalaya (Manuel António Gomes, 1868–1933),
            cientista de Arcos de Valdevez e pioneiro da energia solar.
          </p>
          <p className="mt-4 pt-4 border-t border-sky-800 text-sky-300">
            Bruno Cerqueira, 2026 | O HimalaIA responde…
          </p>
        </div>
      </footer>
    </div>
  );
}
