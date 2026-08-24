/* Maneja los datos de la cuenta recién registrada. Sin backend real todavía
   (es un prototipo): se guarda en localStorage del navegador. Cuando se
   conecte un backend de verdad, este es el único archivo que hay que
   reemplazar — el resto del panel solo llama a getAccount()/saveAccount(). */

export type Account = {
  clinicName: string;
  contactName: string;
  email: string;
  planId: "inicial" | "profesional" | "avanzada" | "grupo";
};

const STORAGE_KEY = "cloud-esther-account";

export function getAccount(): Account | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Account;
  } catch {
    return null;
  }
}

export function saveAccount(account: Account) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
}

export function clearAccount() {
  window.localStorage.removeItem(STORAGE_KEY);
}