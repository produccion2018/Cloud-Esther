/* Selector de color del panel (Configuración > Apariencia). En vez de pisar
   una sola variable, pisa las ~13 variables de --color-* que dependen del
   tono de marca en styles.css (--primary, --primary-soft, --secondary,
   --accent, --sidebar-primary, --sidebar-accent, --chart-1, etc.) — todas
   comparten el mismo patrón oklch(L C H) que el violeta original, cambiando
   solo el ángulo de tono H. Así cambia TODO el panel de una, no una sola
   pieza suelta. Sin backend todavía: se guarda en localStorage. */

export type ThemeColor = "violeta" | "azul" | "verde" | "rosa" | "rojo";

export const THEME_COLORS: { id: ThemeColor; label: string; hue: number; swatch: string }[] = [
  { id: "violeta", label: "Violeta", hue: 292, swatch: "oklch(0.53 0.21 292)" },
  { id: "azul", label: "Azul", hue: 250, swatch: "oklch(0.53 0.21 250)" },
  { id: "verde", label: "Verde", hue: 150, swatch: "oklch(0.53 0.21 150)" },
  { id: "rosa", label: "Rosa", hue: 350, swatch: "oklch(0.53 0.21 350)" },
  { id: "rojo", label: "Rojo", hue: 25, swatch: "oklch(0.53 0.21 25)" },
];

const STORAGE_KEY = "cloud-esther-theme-color";

export function getThemeColor(): ThemeColor {
  if (typeof window === "undefined") return "violeta";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return (THEME_COLORS.find((t) => t.id === saved)?.id ?? "violeta") as ThemeColor;
}

export function applyThemeColor(id: ThemeColor) {
  const theme = THEME_COLORS.find((t) => t.id === id);
  if (!theme) return;
  const h = theme.hue;
  const isDark = document.documentElement.classList.contains("dark");
  const root = document.documentElement.style;

  if (isDark) {
    // Mismas fórmulas L/C que el bloque .dark de styles.css, cambiando
    // solo el tono (H) — si esto no distingue modo oscuro, el color queda
    // siempre con la versión clara pisada encima del fondo oscuro,
    // ilegible (eso es lo que estaba pasando).
    root.setProperty("--primary", `oklch(0.68 0.17 ${h})`);
    root.setProperty("--primary-foreground", `oklch(0.18 0.04 ${h})`);
    root.setProperty("--primary-soft", `oklch(0.3 0.07 ${h})`);
    root.setProperty("--secondary", `oklch(0.3 0.06 ${h})`);
    root.setProperty("--secondary-foreground", `oklch(0.96 0.008 ${h})`);
    root.setProperty("--accent", `oklch(0.33 0.07 ${h})`);
    root.setProperty("--accent-foreground", `oklch(0.96 0.008 ${h})`);
    root.setProperty("--ring", `oklch(0.68 0.17 ${h})`);
    root.setProperty("--chart-1", `oklch(0.68 0.17 ${h})`);
    root.setProperty("--sidebar-primary", `oklch(0.68 0.17 ${h})`);
    root.setProperty("--sidebar-primary-foreground", `oklch(0.18 0.04 ${h})`);
    root.setProperty("--sidebar-accent", `oklch(0.3 0.06 ${h})`);
    root.setProperty("--sidebar-accent-foreground", `oklch(0.96 0.008 ${h})`);
    root.setProperty("--sidebar-ring", `oklch(0.68 0.17 ${h})`);
  } else {
    // Mismo patrón L/C que cada variable ya tiene en styles.css :root,
    // solo cambia el tono (H) al final de cada oklch(...).
    root.setProperty("--primary", `oklch(0.53 0.21 ${h})`);
    root.setProperty("--primary-foreground", `oklch(0.99 0.005 ${h})`);
    root.setProperty("--primary-soft", `oklch(0.94 0.045 ${h})`);
    root.setProperty("--secondary", `oklch(0.93 0.045 ${h})`);
    root.setProperty("--secondary-foreground", `oklch(0.34 0.1 ${h})`);
    root.setProperty("--accent", `oklch(0.9 0.075 ${h})`);
    root.setProperty("--accent-foreground", `oklch(0.3 0.09 ${h})`);
    root.setProperty("--ring", `oklch(0.53 0.21 ${h})`);
    root.setProperty("--chart-1", `oklch(0.53 0.21 ${h})`);
    root.setProperty("--sidebar-primary", `oklch(0.53 0.21 ${h})`);
    root.setProperty("--sidebar-primary-foreground", `oklch(0.99 0.005 ${h})`);
    root.setProperty("--sidebar-accent", `oklch(0.94 0.045 ${h})`);
    root.setProperty("--sidebar-accent-foreground", `oklch(0.34 0.1 ${h})`);
    root.setProperty("--sidebar-ring", `oklch(0.53 0.21 ${h})`);
  }

  window.localStorage.setItem(STORAGE_KEY, id);
  window.dispatchEvent(new CustomEvent("cloud-esther-theme-change"));
}

/* Al cargar cualquier página del panel, si ya hay un color guardado de
   una visita anterior, aplicarlo de nuevo — si no, cada refresh volvería
   siempre al violeta por defecto. Se llama una vez desde DashboardShell. */
export function applyStoredThemeColor() {
  applyThemeColor(getThemeColor());
}

/* Modo oscuro: styles.css ya tiene todo el bloque .dark { ... } listo con
   los colores oscuros — acá solo se agrega/saca esa clase del <html> y se
   guarda la preferencia. El color de marca elegido en THEME_COLORS se
   mantiene igual con la clase puesta o no, porque se aplica con estilo
   inline (pisa por encima de cualquier clase). */
const DARK_MODE_KEY = "cloud-esther-dark-mode";

export function getDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DARK_MODE_KEY) === "true";
}

export function setDarkMode(enabled: boolean) {
  document.documentElement.classList.toggle("dark", enabled);
  window.localStorage.setItem(DARK_MODE_KEY, String(enabled));
  applyThemeColor(getThemeColor());
}

export function applyStoredDarkMode() {
  document.documentElement.classList.toggle("dark", getDarkMode());
}

/* NUEVO — independiente de "Modo oscuro": permite oscurecer SOLO el
   sidebar, dejando el resto del panel en claro. No reemplaza nada de lo
   anterior, es un interruptor aparte. Como el sidebar no cuelga de la
   clase .dark del <html> en este caso, no alcanza con togglear una clase
   — hay que pisar las 7 variables --sidebar-* directo como estilo inline
   sobre el contenedor del sidebar, con la versión oscura del color
   elegido (si no, quedaría con el violeta fijo del bloque .dark). */
const SIDEBAR_DARK_KEY = "cloud-esther-sidebar-dark";

export function getSidebarDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_DARK_KEY) === "true";
}

export function setSidebarDarkMode(enabled: boolean) {
  window.localStorage.setItem(SIDEBAR_DARK_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent("cloud-esther-theme-change"));
}

export function getSidebarDarkVars(themeId: ThemeColor): Record<string, string> {
  const theme = THEME_COLORS.find((t) => t.id === themeId);
  const h = theme?.hue ?? 292;
  return {
    "--sidebar": `oklch(0.215 0.038 ${h})`,
    "--sidebar-foreground": "oklch(0.95 0.008 290)",
    "--sidebar-primary": `oklch(0.68 0.17 ${h})`,
    "--sidebar-primary-foreground": `oklch(0.18 0.04 ${h})`,
    "--sidebar-accent": `oklch(0.3 0.06 ${h})`,
    "--sidebar-accent-foreground": "oklch(0.96 0.008 290)",
    "--sidebar-border": "oklch(1 0 0 / 12%)",
  };
}

/* Modo invertido de lo anterior: forzar el sidebar CLARO aunque el resto
   del panel esté en modo oscuro general. Misma idea, mismo mecanismo
   (variables --sidebar-* inline), pero con la fórmula clara de :root en
   vez de la oscura de .dark — independiente del switch de arriba. */
const SIDEBAR_LIGHT_KEY = "cloud-esther-sidebar-light";

export function getSidebarLightMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_LIGHT_KEY) === "true";
}

export function setSidebarLightMode(enabled: boolean) {
  window.localStorage.setItem(SIDEBAR_LIGHT_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent("cloud-esther-theme-change"));
}

export function getSidebarLightVars(themeId: ThemeColor): Record<string, string> {
  const theme = THEME_COLORS.find((t) => t.id === themeId);
  const h = theme?.hue ?? 292;
  return {
    "--sidebar": "oklch(0.99 0.006 290)",
    "--sidebar-foreground": "oklch(0.3 0.04 285)",
    "--sidebar-primary": `oklch(0.53 0.21 ${h})`,
    "--sidebar-primary-foreground": `oklch(0.99 0.005 ${h})`,
    "--sidebar-accent": `oklch(0.94 0.045 ${h})`,
    "--sidebar-accent-foreground": `oklch(0.34 0.1 ${h})`,
    "--sidebar-border": "oklch(0.92 0.012 285)",
  };
}