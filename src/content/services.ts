export type ServiceIconName = "web" | "systems" | "custom";

export interface Service {
  icon: ServiceIconName;
  title: string;
  description: string;
  highlights: readonly string[];
}

export const SERVICES: readonly Service[] = [
  {
    icon: "web",
    title: "Páginas web y landings",
    description:
      "Sitios rápidos, claros y fáciles de actualizar, pensados para que tus visitas te escriban.",
    highlights: [
      "Diseño a medida y adaptable a celular",
      "Formularios y botón de WhatsApp",
      "Posicionamiento básico en Google",
    ],
  },
  {
    icon: "systems",
    title: "Sistemas web",
    description:
      "Agendas, CRM y paneles que reemplazan planillas y cuadernos por una sola herramienta.",
    highlights: ["Agenda de citas y pacientes", "CRM e historiales", "Usuarios, roles y reportes"],
  },
  {
    icon: "custom",
    title: "Desarrollo a medida",
    description:
      "Cuando lo que necesitas no existe, lo construimos: integraciones, automatizaciones e IA.",
    highlights: [
      "Chatbots y asistentes con IA",
      "Integración con otros sistemas",
      "Automatización de tareas repetitivas",
    ],
  },
];
