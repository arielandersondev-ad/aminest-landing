import { createStore } from "@/lib/store";

/**
 * Mientras la escena de portada se reproduce, el navbar se oculta para no tapar la animación.
 * Empieza en "playing" también en el servidor, igual que al cargar la página.
 */
export type IntroPhase = "playing" | "done";

export const introStore = createStore<IntroPhase>("playing");
