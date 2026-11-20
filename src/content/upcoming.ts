export type UpcomingIconName = "payments" | "paper-to-digital" | "calendar";

export interface UpcomingModule {
  icon: UpcomingIconName;
  status: string;
  title: string;
  description: string;
}

export const UPCOMING_MODULES: readonly UpcomingModule[] = [
  {
    icon: "payments",
    status: "En desarrollo",
    title: "Pasarela de pagos",
    description:
      "Cobra en línea desde tu página o sistema: reservas pagadas, cuotas y pagos de servicios.",
  },
  {
    icon: "paper-to-digital",
    status: "En desarrollo",
    title: "Formularios en papel a digital con IA",
    description:
      "Fotografía una ficha llenada a mano y la IA la lee y la convierte en datos dentro de tu sistema.",
  },
  {
    icon: "calendar",
    status: "En desarrollo",
    title: "Integración con Google Calendar",
    description:
      "Las citas de tu sistema aparecen solas en el calendario de cada profesional, sin cargarlas dos veces.",
  },
];
