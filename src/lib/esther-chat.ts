export type EstherQuestion = { id: string; text: string; askedAt: string };

const HISTORY_KEY = "ce_esther_history";
const LAST_MODULE_KEY = "ce_esther_last_module";

/* Últimas preguntas que le escribiste a Esther — no hay respuestas reales
   todavía (sin backend de IA), solo se guarda lo que vos preguntaste, para
   que quede a mano y no se pierda cuando cierres la página. */
export function getEstherHistory(): EstherQuestion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as EstherQuestion[]) : [];
  } catch {
    return [];
  }
}

export function addEstherQuestion(text: string) {
  const entry: EstherQuestion = {
    id: crypto.randomUUID(),
    text,
    askedAt: new Date().toISOString(),
  };
  const next = [entry, ...getEstherHistory()].slice(0, 8);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

/* Último módulo del panel que visitaste antes de entrar a IA Esther —
   la usa para saludarte con contexto ("vi que estabas en Finanzas..."). */
export function setLastModule(label: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_MODULE_KEY, label);
}

export function getLastModule(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LAST_MODULE_KEY);
}