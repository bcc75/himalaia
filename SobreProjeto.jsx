import { useState } from "react";

/* =========================================================================
   O HimalaIA responde... — Página "Sobre o projeto"  (/sobre)
   =========================================================================
   NOTA DE ARQUITETURA: neste protótipo, cada página é um ficheiro autónomo,
   pelo que Avatar, Icon e Montanhas estão duplicados a partir de /prompts.
   Quando o projeto passar a uma app React com routing (ex.: React Router),
   estes elementos devem ser extraídos para /components partilhados:
     components/Avatar.jsx · components/Icon.jsx · components/Montanhas.jsx
   ========================================================================= */

/* ---------------------------------------------------------------------- */
/* 0. IDENTIDADE VISUAL (partilhada com /prompts)                          */
/* ---------------------------------------------------------------------- */

const AVATAR_HIMALAIA =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEREhMSERIWFhIVGBUWFRMYFRkXGBcQGBgXGBYXGhUYHSggGBolHRYXITIhJSktLi4uGR8zRDMtOCktLysBCgoKDg0OGhAQGy4gHSYvMDctLS8tKy01LS0uNTAuLy0rLS0tLS0tKy0tLS0tLS0tLysrLS0vMi0tLTctLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAwADAQEAAAAAAAAAAAAABQYHAgMECAH/xABCEAABAwIEAwYCBgYJBQAAAAABAAIDBBEFEiExBkFRBxMiYXGBMpEUI0JScqFigqKxwfAVJDNTc5Ky0eEWNWNkwv/EABoBAQADAQEBAAAAAAAAAAAAAAABAgQDBQb/xAApEQEBAAICAQMDAgcAAAAAAAAAAQIRAzESBCFBMnHREzMFIlFhgZGx/9oADAMBAAIRAxEAPwDDUREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAXZDFm/CLXPS/8dDp5L8ijLjYe5OwHUr35RYC2g+Fp6ncnz/4HJWk9t1G3nMQ5AkXGp0uPQdVxkhAPO3IblXDC+EJahodnDQRcXBOh22tZdeMcEVkJjAjMrXmzTGC6x+64W8PW5031XPym1/DLW9K19BD2l0V7taXOY46kNF3OaQBewBJbuAL6628CsE0EsEhZI0xysINti07tII9iCF48dp2gslY3K2UHM0bNnabSNA5DVrgOQeByUoRaIilAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIPfDEQ1unxanXly0/P9YL1YVSGonaxu3M9GDc/n+YXDJZrTbXID+R/PZTvDWGta0GUvb3hGjHFriNmDw6nUnTzU8t8U8WPlWr4FSBrQANlYYolnGE101PMAyrL4WlveQzN+saw2PxEZtiCL9QtAxSrkbT95ThhkNsuckMDdLk212usmo121TO1bhsyRCsiHjhFpR1p73zerDr6F3RZiyPvI5oueUys8pIwSdurM49cvRbDhtRU1BOavhLh8UDI2PYWndrtQ6xBWW0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";

function Avatar({ size = "w-12 h-12", className = "" }) {
  return (
    <img
      src={AVATAR_HIMALAIA}
      alt="Avatar do Padre Himalaya, ícone da plataforma"
      className={`${size} rounded-full object-cover ring-2 ring-sky-300/60 shadow-md ${className}`}
    />
  );
}

/* Subconjunto do sistema de ícones da plataforma (grelha 24x24, traço 1.8) */
const iconPaths = {
  bookOpen: (
    <>
      <path d="M12 5.2C10 3.9 7.4 3.3 4 3.3v14.2c3.4 0 6 .6 8 1.9 2-1.3 4.6-1.9 8-1.9V3.3c-3.4 0-6 .6-8 1.9z" />
      <path d="M12 5.2v14.2" />
    </>
  ),
  // Sol — Padre Himalaya, pioneiro da energia solar (pirelióforo)
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M15.8 5.2a3 3 0 0 1 0 5.6M17.8 15.4c1.7.8 2.7 2.3 2.7 4.6" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M12 3a6 6 0 0 0-3.9 10.6c.6.5.9 1.3.9 2.1h6c0-.8.3-1.6.9-2.1A6 6 0 0 0 12 3z" />
      <path d="M9.5 18.5h5M10.5 21h3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.8" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  tableCheck: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9.5h17M9.5 9.5v10" />
      <path d="M12.5 14.5l1.8 1.8 3.2-3.5" />
    </>
  ),
  shieldLock: (
    <>
      <path d="M12 3l7 2.8v5.4c0 4.4-2.9 7.4-7 8.8-4.1-1.4-7-4.4-7-8.8V5.8z" />
      <rect x="9.6" y="11" width="4.8" height="3.8" rx="0.8" />
      <path d="M10.8 11V9.9a1.2 1.2 0 0 1 2.4 0V11" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.2 8.8l-1.9 4.5-4.5 1.9 1.9-4.5z" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 4c.5 3.5 2 5 5.5 5.5C13 10 11.5 11.5 11 15c-.5-3.5-2-5-5.5-5.5C9 9 10.5 7.5 11 4z" />
      <path d="M17.8 14.5c.3 1.8 1.1 2.6 2.9 2.9-1.8.3-2.6 1.1-2.9 2.9-.3-1.8-1.1-2.6-2.9-2.9 1.8-.3 2.6-1.1 2.9-2.9z" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  chevronDown: <path d="M6 9.5l6 6 6-6" />,
  quote: (
    <>
      <path d="M9.5 7.5c-2.5.8-4 2.6-4 5.5v3.5h4.5v-4.5H7.2c.1-1.6 1-2.7 2.3-3.2z" />
      <path d="M18.5 7.5c-2.5.8-4 2.6-4 5.5v3.5H19v-4.5h-2.8c.1-1.6 1-2.7 2.3-3.2z" />
    </>
  ),
};

function Icon({ name, className = "w-5 h-5" }) {
  const paths = iconPaths[name];
  if (!paths) return null;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths}
    </svg>
  );
}

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
/* 1. DADOS DE CONTEÚDO                                                    */
/*    O conteúdo vive separado do JSX para ser fácil de rever e corrigir.  */
/* ---------------------------------------------------------------------- */

const areasPlataforma = [
  { icon: "bookOpen", texto: "Criação de prompts pedagógicas" },
  { icon: "lightbulb", texto: "Apoio à planificação de aulas" },
  { icon: "target", texto: "Preparação para provas e exames" },
  { icon: "tableCheck", texto: "Construção de rubricas e critérios de avaliação" },
  { icon: "shieldLock", texto: "Cidadania digital, ética, privacidade e cibersegurança" },
  { icon: "compass", texto: "Recursos, modelos e exemplos para professores" },
];

const principios = [
  "A tecnologia deve estar ao serviço da aprendizagem.",
  "A IA deve ser usada com sentido crítico e responsabilidade.",
  "O professor continua a ser essencial na validação pedagógica.",
  "Os dados pessoais dos alunos devem ser protegidos.",
  "As propostas geradas devem ser sempre adaptadas ao contexto.",
  "A inovação só faz sentido quando melhora a prática educativa.",
];

/* ---------------------------------------------------------------------- */
/* 2. COMPONENTES DE SECÇÃO                                                */
/* ---------------------------------------------------------------------- */

function SectionCard({ icon, eyebrow, titulo, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      {eyebrow && (
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-2">
          {icon && <Icon name={icon} className="w-4 h-4" />}
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-bold text-slate-800 mb-4">{titulo}</h2>
      <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* 3. PÁGINA                                                               */
/* ---------------------------------------------------------------------- */

export default function SobreProjeto() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ---------- Cabeçalho (coerente com /prompts) ---------- */}
      <header className="relative bg-sky-900 text-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-20 relative z-10">
          <div className="flex items-center gap-3">
            <Avatar />
            <div>
              <p className="text-lg font-bold tracking-tight">O HimalaIA responde…</p>
              <p className="text-sky-200 text-xs">Plataforma de apoio pedagógico ao uso de IA</p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold">Sobre o projeto</h1>
            <p className="mt-4 max-w-2xl mx-auto text-sky-100 text-sm sm:text-base leading-relaxed">
              Uma plataforma educativa criada para apoiar professores na utilização
              pedagógica da Inteligência Artificial — com intenção, sentido crítico,
              responsabilidade e enquadramento pedagógico.
            </p>
            <p className="mt-6 inline-block rounded-full bg-sky-800/70 border border-sky-700 px-5 py-2 text-xs sm:text-sm text-sky-100">
              A qualidade da resposta começa, muitas vezes, na qualidade da pergunta.
            </p>
          </div>
        </div>
        <Montanhas className="absolute bottom-0 left-0 w-full h-16 text-sky-300" />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* ---------- A plataforma ---------- */}
        <SectionCard icon="sparkles" eyebrow="A plataforma" titulo="O que é o HimalaIA?">
          <p>
            <strong>O HimalaIA responde…</strong> nasce da convicção de que a IA pode ser
            uma ferramenta útil na educação, desde que seja usada com intenção, sentido
            crítico, responsabilidade e enquadramento pedagógico.
          </p>
          <p>
            Mais do que gerar respostas automáticas, o HimalaIA pretende ajudar os docentes
            a formular melhores perguntas, estruturar melhor os seus pedidos e transformar
            ideias em prompts claras, completas e adaptadas ao contexto educativo português.
          </p>
        </SectionCard>

        {/* ---------- Quem sou ---------- */}
        <SectionCard icon="users" eyebrow="O autor" titulo="Quem é Bruno Cerqueira?">
          <p>
            Sou <strong>Bruno Cerqueira</strong>, professor de Informática, formador e
            consultor em Educação Digital, Tecnologia Educativa e Inteligência Artificial.
          </p>
          <p>
            Exerço funções no <strong>Agrupamento de Escolas de Valdevez</strong>, onde
            integro a equipa de Direção e desenvolvo trabalho nas áreas da transformação
            digital, comunicação escolar, recursos digitais, literacia digital,
            cibersegurança e integração pedagógica da IA.
          </p>
          <p>
            Ao longo do meu percurso, tenho procurado criar pontes entre tecnologia,
            inovação, aprendizagem, pensamento crítico e prática docente. Acredito numa
            escola capaz de integrar ferramentas digitais sem perder de vista aquilo que
            realmente importa: os alunos, os professores, o conhecimento, a criatividade,
            a ética e a dimensão humana da educação.
          </p>
          <p>
            Este projeto resulta dessa experiência e desse caminho: apoiar professores de
            forma prática, clara e acessível, ajudando-os a usar a Inteligência Artificial
            como instrumento de trabalho pedagógico, e não como substituto do pensamento
            profissional docente.
          </p>
        </SectionCard>

        {/* ---------- Padre Himalaya ---------- */}
        <SectionCard icon="sun" eyebrow="A inspiração" titulo="Quem foi o Padre Himalaya?">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="shrink-0 mx-auto sm:mx-0 text-center">
              <Avatar size="w-28 h-28" />
              <p className="mt-2 text-xs text-slate-400 max-w-28">
                Avatar do Padre Himalaya, ícone da plataforma
              </p>
            </div>
            <div className="space-y-4">
              <p>
                O nome <strong>HimalaIA</strong> inspira-se no <strong>Padre Himalaya</strong>,
                nome pelo qual ficou conhecido Manuel António Gomes, sacerdote, cientista e
                inventor português natural de Cendufe, Arcos de Valdevez.
              </p>
              <p>
                O Padre Himalaya destacou-se pelo seu espírito visionário, pela curiosidade
                científica e pelo interesse em soluções inovadoras para o seu tempo. É
                particularmente lembrado pelo seu trabalho ligado ao aproveitamento da
                energia solar e pelo desenvolvimento do <strong>pirelióforo</strong>, um
                engenho concebido para concentrar a luz do sol através de espelhos.
              </p>
              <p>
                A sua figura representa ousadia, investigação, criatividade, conhecimento e
                futuro. Por isso, é uma inspiração natural para um projeto educativo que
                procura aproximar ciência, tecnologia, inteligência artificial e pedagogia.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ---------- Porquê o nome ---------- */}
        <SectionCard icon="lightbulb" eyebrow="O nome" titulo='Porquê "O HimalaIA responde…"?'>
          <p>
            O nome junta a referência ao <strong>Padre Himalaya</strong> com a sigla{" "}
            <strong>IA</strong>, de Inteligência Artificial.
          </p>
          <p>
            Mas a ideia do projeto não é apenas fazer com que a IA "responda". A verdadeira
            intenção é ajudar o professor a perguntar melhor, a orientar melhor os pedidos,
            a definir melhor os objetivos e a usar a tecnologia com mais consciência
            pedagógica.
          </p>
          <blockquote className="flex gap-3 rounded-xl bg-sky-50 border border-sky-200 px-5 py-4 text-sky-900 font-medium">
            <Icon name="quote" className="w-5 h-5 shrink-0 mt-0.5 text-sky-400" />
            <span>O HimalaIA responde, mas também ajuda a pensar a pergunta.</span>
          </blockquote>
        </SectionCard>

        {/* ---------- Missão ---------- */}
        <SectionCard icon="target" eyebrow="A missão" titulo="Apoiar quem ensina">
          <p>
            A missão de <strong>O HimalaIA responde…</strong> é apoiar professores na
            criação de prompts pedagógicas, planificações, atividades, rubricas, recursos
            de avaliação e propostas de trabalho com Inteligência Artificial.
          </p>
          <p>
            A plataforma foi pensada para ser simples, prática e útil, respeitando o
            contexto da escola portuguesa, os ciclos de ensino, as disciplinas, as
            Aprendizagens Essenciais, a avaliação, a inclusão e o uso responsável da
            tecnologia.
          </p>

          <h3 className="pt-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            O que pode encontrar nesta plataforma
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 list-none pl-0">
            {areasPlataforma.map((a) => (
              <li key={a.texto}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Icon name={a.icon} className="w-5 h-5 mt-0.5 shrink-0 text-emerald-600" />
                <span className="text-sm text-slate-700">{a.texto}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* ---------- Uma ferramenta para professores ---------- */}
        <SectionCard icon="users" eyebrow="O papel da plataforma" titulo="Uma ferramenta para professores">
          <p>O HimalaIA não substitui o professor.</p>
          <p>
            Também não substitui o ChatGPT, o Claude, o Gemini, o Copilot ou qualquer outra
            ferramenta de Inteligência Artificial.
          </p>
          <p>
            O seu papel é diferente: ajudar o docente a estruturar melhor o pedido que faz
            à IA, tornando-o mais claro, mais pedagógico, mais completo e mais adequado ao
            contexto real da sala de aula.
          </p>
          <p className="font-medium text-slate-700">
            Porque usar IA na educação não é apenas saber escrever comandos. É saber
            formular intenções pedagógicas.
          </p>
        </SectionCard>

        {/* ---------- Princípios ---------- */}
        <SectionCard icon="shieldLock" eyebrow="Ética e pedagogia" titulo="Princípios do projeto">
          <ul className="space-y-3 list-none pl-0">
            {principios.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <Icon name="check" className="w-5 h-5 mt-0.5 shrink-0 text-emerald-600" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* ---------- Frase orientadora ---------- */}
        <section className="relative overflow-hidden rounded-2xl bg-sky-900 text-white px-6 py-10 text-center shadow-sm">
          <Montanhas className="absolute bottom-0 left-0 w-full h-12 text-sky-300" />
          <div className="relative z-10">
            <Icon name="sun" className="w-8 h-8 mx-auto mb-4 text-amber-300" />
            <p className="text-lg sm:text-xl font-bold">
              Criar melhores perguntas. Obter melhores respostas pedagógicas.
            </p>
          </div>
        </section>
      </main>

      {/* ---------- Rodapé (coerente com /prompts) ---------- */}
      <footer className="relative bg-sky-900 text-sky-200 mt-10">
        <Montanhas className="absolute top-0 left-0 w-full h-10 text-sky-950 rotate-180" />
        <div className="max-w-4xl mx-auto px-4 py-10 pt-16 text-center text-xs relative z-10">
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
