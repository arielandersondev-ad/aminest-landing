export interface ProcessStep {
  title: string;
  description: string;
}

export const PROCESS_STEPS: readonly ProcessStep[] = [
  { title: "Conversamos", description: "Entendemos tu negocio, cómo trabajas hoy y qué te quita tiempo." },
  { title: "Diseñamos", description: "Te mostramos pantallas y un plan con alcance, plazos y costo claros." },
  { title: "Desarrollamos", description: "Construimos por etapas y ves avances reales en cada entrega." },
  {
    title: "Acompañamos",
    description: "Capacitamos a tu equipo y damos soporte cuando el sistema ya está en uso.",
  },
];
