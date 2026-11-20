import { useSyncExternalStore } from "react";
import { isThemePreference, THEME_ORDER, THEME_STORAGE_KEY, type ThemePreference } from "./themeConfig";

const listeners = new Set<() => void>();

/** La fuente de verdad en el cliente es el atributo data-theme que dejó el script inicial. */
function readPreference(): ThemePreference {
  const attr = document.documentElement.getAttribute("data-theme");
  return isThemePreference(attr) ? attr : "system";
}

export function setThemePreference(preference: ThemePreference): void {
  const root = document.documentElement;
  if (preference === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", preference);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* almacenamiento bloqueado (modo privado): el tema se aplica igual, solo no se recuerda */
  }
  listeners.forEach((listener) => listener());
}

export function nextThemePreference(current: ThemePreference): ThemePreference {
  return THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    readPreference,
    () => "system",
  );
}
