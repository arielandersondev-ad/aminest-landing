/** Configuración del tema. Sin dependencias de React: la usa también el layout del servidor. */
export type ThemePreference = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "aminest-tema";
export const THEME_ORDER: readonly ThemePreference[] = ["system", "light", "dark"];
export const THEME_LABELS: Record<ThemePreference, string> = {
  system: "Sistema",
  light: "Claro",
  dark: "Oscuro",
};

export const isThemePreference = (value: unknown): value is ThemePreference =>
  THEME_ORDER.includes(value as ThemePreference);

/**
 * Se ejecuta en <head> antes de pintar, para que la página no parpadee con el tema equivocado.
 * Debe ser autosuficiente: no puede importar nada.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
