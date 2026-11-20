export type ProjectMockup = "clinic-agenda" | "dental-chart";

export interface Project {
  id: string;
  client: string;
  title: string;
  summary: string;
  features: readonly string[];
  tags: readonly string[];
  mockup: ProjectMockup;
  mockupLabel: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: "oftalmologia",
    client: "Clínica oftalmológica",
    title: "Agenda de citas y pacientes con asistente de IA",
    summary:
      "La clínica organiza sus citas por especialista y tiene la ficha de cada paciente en un solo lugar. Un chatbot responde las dudas frecuentes y sugiere preguntas según el historial del paciente.",
    features: [
      "Agenda por día y por especialista, con horarios libres a la vista",
      "Chatbot con el modelo de IA Qwen que atiende consultas a toda hora",
      "Preguntas frecuentes sugeridas según el historial de cada paciente",
    ],
    tags: ["Agenda", "Pacientes", "Chatbot", "Qwen"],
    mockup: "clinic-agenda",
    mockupLabel: "Ejemplo de la agenda con chatbot",
  },
  {
    id: "odontologia",
    client: "Consultorios odontológicos",
    title: "CRM para odontólogos con historial clínico",
    summary:
      "Cada paciente tiene su odontograma, sus tratamientos y su historial en una ficha. El odontólogo ve de un vistazo qué se hizo, qué falta y cuándo volver a citarlo.",
    features: [
      "Odontograma por pieza dental, con nomenclatura FDI",
      "Historial clínico con tratamientos y evolución",
      "Seguimiento de pacientes y próximos controles",
    ],
    tags: ["CRM", "Historial clínico", "Odontograma"],
    mockup: "dental-chart",
    mockupLabel: "Ejemplo de ficha de paciente con odontograma",
  },
];

/* Datos de ejemplo que se muestran dentro de las maquetas */

export const CLINIC_AGENDA = {
  title: "Agenda · Oftalmología",
  days: ["Lun", "Mar", "Mié", "Jue", "Vie"],
  activeDay: "Mar",
  slots: [
    { time: "08:30", title: "Control de presión ocular", detail: "Tonometría" },
    { time: "09:15", title: "Fondo de ojo", detail: "Con dilatación" },
    { time: "10:00", title: null, detail: "Horario libre" },
    { time: "10:45", title: "Medida de vista", detail: "Refracción" },
  ],
  chat: {
    question: "¿Puedo manejar después del fondo de ojo?",
    answer:
      "Es mejor que no. La dilatación dura unas 4 horas y nubla la vista. Te recomendamos venir acompañado.",
    suggestions: ["¿Cuánto dura la cita?", "¿Debo suspender las gotas?"],
  },
} as const;

export type ToothState = "caries" | "restoration" | "endodontics";

export const DENTAL_CHART = {
  title: "Ficha del paciente · ejemplo",
  patient: "Paciente de ejemplo",
  nextCheckup: "en 6 meses",
  /** Arcadas superior e inferior en nomenclatura FDI; cada fila se parte en dos cuadrantes. */
  arches: [
    [
      [18, 17, 16, 15, 14, 13, 12, 11],
      [21, 22, 23, 24, 25, 26, 27, 28],
    ],
    [
      [48, 47, 46, 45, 44, 43, 42, 41],
      [31, 32, 33, 34, 35, 36, 37, 38],
    ],
  ],
  teeth: { 16: "restoration", 25: "caries", 46: "endodontics", 36: "restoration" } as Record<
    number,
    ToothState
  >,
  legend: [
    { state: "caries", label: "Caries" },
    { state: "restoration", label: "Restauración" },
    { state: "endodontics", label: "Endodoncia" },
  ] as const,
  history: [
    { tooth: "Pieza 46", treatment: "Tratamiento de conducto", status: "Terminado", done: true },
    { tooth: "Pieza 25", treatment: "Caries oclusal", status: "Pendiente", done: false },
  ],
} as const;
