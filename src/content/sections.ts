/**
 * Única fuente de verdad sobre las secciones de la landing:
 * su orden en la pista horizontal, su nombre visible y dónde aparecen en el navbar.
 */
export type SectionId =
  | "inicio"
  | "nosotros"
  | "servicios"
  | "proyectos"
  | "proximamente"
  | "proceso"
  | "contacto";

export interface SiteSection {
  id: SectionId;
  label: string;
  /** Mitad del navbar donde aparece el enlace; sin valor, solo está en el menú móvil. */
  navSide?: "left" | "right";
  /** Las secciones con fondo vino necesitan un navbar más opaco para leerse. */
  tone?: "band";
}

export const SECTIONS: readonly SiteSection[] = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Nosotros" },
  { id: "servicios", label: "Servicios", navSide: "left" },
  { id: "proyectos", label: "Proyectos", navSide: "left" },
  { id: "proximamente", label: "Próximamente", navSide: "left", tone: "band" },
  { id: "proceso", label: "Cómo trabajamos", navSide: "right" },
  { id: "contacto", label: "Contacto", navSide: "right" },
];

export const QUOTE_CTA = {
  label: "Cotiza",
  longLabel: "Cotiza tu proyecto",
  target: "contacto",
} as const satisfies { label: string; longLabel: string; target: SectionId };

export const sectionHref = (id: SectionId) => `#${id}`;

export function sectionIndexOf(id: string): number {
  return SECTIONS.findIndex((section) => section.id === id);
}
