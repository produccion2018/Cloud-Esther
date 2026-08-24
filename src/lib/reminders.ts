export type Reminder = {
  id: string;
  title: string;
  note?: string;
  dueAt: string; // fecha y hora en formato ISO local, ej. "2026-08-20T09:30"
  done: boolean;
  createdBy: string;
};

const STORAGE_KEY = "ce_reminders";

/* Recordatorios manuales del equipo — separados de "notificaciones"
   automáticas hacia el paciente. Viven en localStorage, igual que la
   cuenta y el tema, hasta que haya backend real. */
export function getReminders(): Reminder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Reminder[]) : [];
  } catch {
    return [];
  }
}

function persist(reminders: Reminder[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

export function addReminder(input: {
  title: string;
  note?: string;
  dueAt: string;
  createdBy: string;
}): Reminder {
  const reminder: Reminder = {
    id: crypto.randomUUID(),
    done: false,
    ...input,
  };
  persist([...getReminders(), reminder]);
  return reminder;
}

export function toggleReminder(id: string) {
  persist(getReminders().map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
}

export function deleteReminder(id: string) {
  persist(getReminders().filter((r) => r.id !== id));
}