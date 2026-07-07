import React, { useEffect, useState } from "react";

/* =====================================================================
   O HimalaIA responde… — App.jsx (raiz da aplicação)
   ---------------------------------------------------------------------
   Mini-router por HASH (#/rota), sem dependências externas.

   Como funciona:
   - Os links usam href="#/prompts", "#/rubricas", "#/sobre", "#/".
   - O browser NÃO recarrega a página; apenas muda o hash do URL.
   - O hook useHashRoute ouve o evento "hashchange" e o App decide
     que componente de página renderizar.

   ⚠️ NOTA ARQUITETURAL:
   Quando o projeto migrar para React Router (BrowserRouter + <Link>),
   substituir este hook por rotas reais e extrair Avatar, Icon e
   Montanhas para /components. Até lá, este padrão cumpre a regra
   "sem dependências além do React".
   ===================================================================== */

import SobrePage from "./SobreProjeto";    // ficheiro enviado pelo Bruno
import PromptsPage from "./HimalaiaPrompts"; // ficheiro enviado pelo Bruno
import RubricasPage from "./RubricasPage"; // ajustar o caminho se necessário

/* ----- hook de rota por hash ----- */
function useHashRoute() {
  const lerRota = () => window.location.hash.replace(/^#/, "") || "/";
  const [rota, setRota] = useState(lerRota);

  useEffect(() => {
    const aoMudar = () => {
      setRota(lerRota());
      window.scrollTo({ top: 0 }); // cada "página" começa no topo
    };
    window.addEventListener("hashchange", aoMudar);
    return () => window.removeEventListener("hashchange", aoMudar);
  }, []);

  return rota;
}

/* =====================================================================
   Componentes visuais mínimos da página inicial
   (duplicados intencionalmente — ver nota arquitetural acima)
   ===================================================================== */
const AVATAR_BASE64 = null; // ⚠️ colar aqui a string base64 do avatar (~4,7 KB)

const ICONES = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M20 19v2.5H6.5" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.6 2.6L16 9.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  lockShield: (
    <>
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" />
      <path d="M9.5 12.5l2 2 3.5-3.5" />
    </>
  ),
  folder: (
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.2" />
    </>
  ),
};

function Icon({ name, className = "w-6 h-6" }) {
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
      {ICONES[name] || ICONES.info}
    </svg>
  );
}

function Montanhas({ className = "" }) {
  return (
    <svg viewBox="0 0 1200 160" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M0 160 L180 60 L300 120 L470 20 L620 110 L790 40 L950 120 L1080 70 L1200 130 L1200 160 Z" fill="currentColor" opacity="0.25" />
      <path d="M0 160 L140 100 L320 140 L520 70 L700 140 L900 80 L1060 140 L1200 100 L1200 160 Z" fill="currentColor" opacity="0.45" />
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

/* ----- links do menu principal (partilhados pelo header e rodapé) ----- */
const MENU = [
  { href: "#/", rota: "/", label: "Início" },
  { href: "#/prompts", rota: "/prompts", label: "Prompts" },
  { href: "#/rubricas", rota: "/rubricas", label: "Rubricas" },
  { href: "#/sobre", rota: "/sobre", label: "Sobre" },
];

/* ----- áreas da plataforma mostradas em cartões na página inicial ----- */
const AREAS = [
  {
    icon: "book",
    titulo: "Prompts Pedagógicos",
    texto:
      "Construa prompts pedagógicos claros e eficazes, adaptados ao ciclo, ano, disciplina e objetivo de aprendizagem.",
    href: "#/prompts",
  },
  {
    icon: "checkCircle",
    titulo: "Rubricas",
    texto:
      "Crie critérios de avaliação, níveis de desempenho, grelhas e feedback formativo de forma clara e pedagógica.",
    href: "#/rubricas",
  },
  { icon: "calendar", titulo: "Planificação", texto: "Planeie aulas, sequências e projetos com apoio estruturado.", emBreve: true },
  { icon: "target", titulo: "Exames", texto: "Prepare os alunos para provas e exames com critérios claros.", emBreve: true },
  { icon: "lockShield", titulo: "Cidadania Digital", texto: "Trabalhe segurança, privacidade e pensamento crítico online.", emBreve: true },
  { icon: "folder", titulo: "Recursos", texto: "Materiais de apoio, guias e boas práticas para a sala de aula.", emBreve: true },
];

/* =====================================================================
   Página inicial
   ===================================================================== */
function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="relative bg-sky-900 text-white overflow-hidden">
        <Montanhas className="absolute inset-x-0 bottom-0 h-24 text-sky-700 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-20">
          <div className="flex items-center gap-4">
            <Avatar />
            <div>
              <p className="text-sky-200 text-sm">O HimalaIA responde…</p>
              <p className="font-semibold text-lg leading-tight">
                Ferramentas pedagógicas com IA, à medida dos professores
              </p>
            </div>
          </div>

          <nav aria-label="Menu principal" className="mt-5">
            <ul className="flex flex-wrap gap-2">
              {MENU.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={l.rota === "/" ? "page" : undefined}
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300
                      ${
                        l.rota === "/"
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

          <div className="mt-8 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold">O HimalaIA responde…</h1>
            <p className="mt-3 text-sky-100">
              Inspirado no Padre Himalaya, pioneiro da energia solar natural de
              Arcos de Valdevez, o HimalaIA ajuda professores portugueses a usar
              a Inteligência Artificial de forma pedagógica, crítica e responsável.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
          Áreas da plataforma
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AREAS.map((a) =>
            a.emBreve ? (
              /* Sem link — nunca criar links quebrados para áreas futuras */
              <div
                key={a.titulo}
                className="rounded-2xl border border-slate-200 bg-white/60 p-5 opacity-75"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                    <Icon name={a.icon} />
                  </span>
                  <h3 className="font-semibold text-slate-700">{a.titulo}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-500">{a.texto}</p>
                <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 rounded-full px-3 py-1">
                  Em breve
                </span>
              </div>
            ) : (
              <a
                key={a.titulo}
                href={a.href}
                className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm transition
                  hover:border-sky-400 hover:shadow-md
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 block"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                    <Icon name={a.icon} />
                  </span>
                  <h3 className="font-semibold text-slate-800">{a.titulo}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{a.texto}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-sky-800">
                  Abrir →
                </span>
              </a>
            )
          )}
        </div>
      </main>

      <footer className="bg-sky-900 text-sky-100 mt-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9" />
            <p className="text-sm">Bruno Cerqueira, 2026 | O HimalaIA responde…</p>
          </div>
          <nav aria-label="Rodapé">
            <ul className="flex gap-4 text-sm">
              {MENU.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/* =====================================================================
   App — decide que página renderizar em função do hash
   ===================================================================== */
export default function App() {
  const rota = useHashRoute();

  switch (rota) {
    case "/sobre":
      return <SobrePage />;
    case "/prompts":
      return <PromptsPage />;
    case "/rubricas":
      return <RubricasPage />;
    default:
      return <HomePage />; // "/" e rotas desconhecidas voltam ao início
  }
}
