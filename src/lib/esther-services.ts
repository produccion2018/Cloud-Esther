import type { AIAnalysis, AIMessage, ClinicalAnalysisContext, Patient } from "@/lib/esther-types";

export const estherPatientContext: Patient = {
  id: "PAT-00001",
  name: "Juan Pérez",
  age: 38,
  lastVisit: "21/08/2026",
  dentist: "Dra. María González",
  activeTreatment: "Endodoncia pieza 16",
  nextAppointment: "26/08/2026 · 10:30",
  alerts: ["Control de pieza 16 pendiente", "Limpieza semestral próxima a vencer"],
  recentEvolutions: [
    "Caries profunda registrada en pieza 16.",
    "Se indicó radiografía periapical y evaluación endodóntica.",
    "Paciente refiere sensibilidad al frío.",
  ],
};

export const estherSuggestions = [
  "¿Qué pacientes tienen tratamientos pendientes?",
  "Analiza la agenda de hoy",
  "¿Qué tratamientos generan más ingresos?",
  "Muéstrame pacientes que no han regresado",
  "Analiza la evolución de este paciente",
  "¿Qué odontólogos tienen mayor cantidad de tratamientos activos?",
  "Resume la actividad de la clínica",
  "¿Qué pacientes necesitan seguimiento?",
  "Analiza los turnos cancelados",
  "Genera un resumen de la jornada",
];

const responseMap: Record<string, { content: string; cards: AIAnalysis[] }> = {
  "¿Qué pacientes tienen tratamientos pendientes?": {
    content:
      "Encontré **18 pacientes con tratamientos pendientes**. Los casos más relevantes son controles endodónticos, rehabilitaciones con presupuesto aprobado y pacientes que no confirmaron su próximo turno. Recomendación: priorizar los 6 casos con más de 21 días sin evolución registrada.",
    cards: [
      { label: "Pendientes", value: "18", trend: "+4 esta semana", tone: "warning" },
      { label: "Alta prioridad", value: "6", trend: "Seguimiento sugerido", tone: "primary" },
      { label: "Presupuestos", value: "$1.84M", trend: "Potencial", tone: "success" },
    ],
  },
  "Analiza la agenda de hoy": {
    content:
      "La agenda de hoy tiene **32 turnos**, con ocupación del **87%** y 3 espacios recuperables. Detecté 2 pacientes sin confirmación y un bloque ideal para adelantar tratamientos cortos. No hay sobrecarga crítica para el equipo clínico.",
    cards: [
      { label: "Turnos", value: "32", trend: "87% ocupación", tone: "success" },
      { label: "Sin confirmar", value: "2", trend: "Enviar recordatorio", tone: "warning" },
      { label: "Huecos útiles", value: "3", trend: "45 min totales", tone: "primary" },
    ],
  },
  "¿Qué tratamientos generan más ingresos?": {
    content:
      "En los últimos 30 días, los tratamientos con mayor facturación fueron **endodoncia**, **implantes** y **coronas cerámicas**. La endodoncia lidera por volumen, mientras implantes tiene el ticket promedio más alto.",
    cards: [
      { label: "Endodoncia", value: "$2.4M", trend: "31% del total", tone: "primary" },
      { label: "Implantes", value: "$1.9M", trend: "Ticket alto", tone: "success" },
      { label: "Coronas", value: "$1.3M", trend: "+12%", tone: "muted" },
    ],
  },
  "Muéstrame pacientes que no han regresado": {
    content:
      "Hay **11 pacientes sin regreso** después de una indicación clínica. Sugiero segmentarlos por urgencia: 4 con dolor/sensibilidad, 3 con presupuestos pendientes y 4 controles preventivos.",
    cards: [
      { label: "Sin regreso", value: "11", trend: "Últimos 60 días", tone: "warning" },
      { label: "Con síntomas", value: "4", trend: "Prioridad", tone: "primary" },
      { label: "Preventivos", value: "4", trend: "Campaña", tone: "success" },
    ],
  },
  "Analiza la evolución de este paciente": {
    content:
      "Juan Pérez muestra una evolución compatible con seguimiento endodóntico de pieza 16. La información disponible sugiere controlar dolor, radiografía y continuidad del plan. **No emito diagnóstico automático**: este resumen organiza los datos para revisión profesional.",
    cards: [
      { label: "Pieza foco", value: "16", trend: "Caries profunda", tone: "warning" },
      { label: "Evoluciones", value: "3", trend: "Últimos 14 días", tone: "primary" },
      { label: "Próximo turno", value: "26/08", trend: "10:30", tone: "success" },
    ],
  },
  "¿Qué odontólogos tienen mayor cantidad de tratamientos activos?": {
    content:
      "Los tratamientos activos se concentran en tres profesionales. La carga está equilibrada, aunque Endodoncia concentra mayor complejidad clínica y debería reservar bloques protegidos.",
    cards: [
      { label: "Dr. Rodríguez", value: "24", trend: "Endodoncia", tone: "primary" },
      { label: "Dra. González", value: "19", trend: "General", tone: "success" },
      { label: "Dra. Farías", value: "14", trend: "Rehab.", tone: "muted" },
    ],
  },
  "Resume la actividad de la clínica": {
    content:
      "Resumen operativo: **156 turnos gestionados**, 92% de confirmación, facturación proyectada estable y 7 alertas de seguimiento clínico. La oportunidad más clara está en recuperar controles pendientes y presupuestos aprobados sin turno asignado.",
    cards: [
      { label: "Turnos", value: "156", trend: "+8%", tone: "success" },
      { label: "Confirmación", value: "92%", trend: "Alta", tone: "primary" },
      { label: "Alertas", value: "7", trend: "Revisar", tone: "warning" },
    ],
  },
  "¿Qué pacientes necesitan seguimiento?": {
    content:
      "Priorizo 9 pacientes para seguimiento: 3 por evolución clínica reciente, 2 por tratamientos iniciados sin próximo turno y 4 por higiene/control preventivo vencido.",
    cards: [
      { label: "Seguimiento", value: "9", trend: "Hoy", tone: "warning" },
      { label: "Clínicos", value: "3", trend: "Alta prioridad", tone: "primary" },
      { label: "Preventivos", value: "4", trend: "Recordatorio", tone: "success" },
    ],
  },
  "Analiza los turnos cancelados": {
    content:
      "Las cancelaciones están en **6,4%**, por debajo del umbral configurado. Se concentran en primeras consultas y turnos de última hora. Recomendación: reforzar recordatorios 24 h antes y lista de espera automática.",
    cards: [
      { label: "Cancelaciones", value: "6,4%", trend: "Controlado", tone: "success" },
      { label: "Primera consulta", value: "42%", trend: "Del total", tone: "warning" },
      { label: "Recuperables", value: "5", trend: "Lista de espera", tone: "primary" },
    ],
  },
  "Genera un resumen de la jornada": {
    content:
      "Jornada lista para revisión: 32 turnos, 2 pacientes sin confirmar, 3 evoluciones clínicas esperadas y 1 caso endodóntico para seguimiento. Conviene revisar stock de anestesia y confirmar el turno de las 16:30.",
    cards: [
      { label: "Turnos", value: "32", trend: "Hoy", tone: "primary" },
      { label: "Evoluciones", value: "3", trend: "Registrar", tone: "success" },
      { label: "Alertas", value: "2", trend: "Operativas", tone: "warning" },
    ],
  },
};

export function getEstherDemoResponse(question: string, context?: ClinicalAnalysisContext): Omit<AIMessage, "id" | "role" | "createdAt"> {
  if (context) {
    return {
      content: `Analicé el contexto de **${context.patient.name}** y la pieza ${context.tooth ?? "seleccionada"}. Este resumen organiza antecedentes, estado dental y próximos pasos para revisión profesional, sin reemplazar el criterio clínico del odontólogo.`,
      cards: [
        { label: "Paciente", value: context.patient.name, trend: context.patient.activeTreatment, tone: "primary" },
        { label: "Pieza", value: String(context.tooth ?? 16), trend: context.condition ?? "caries", tone: "warning" },
        { label: "Evoluciones", value: String(context.evolutions?.length ?? 3), trend: "Demo", tone: "success" },
      ],
    };
  }

  return (
    responseMap[question] ?? {
      content:
        "Puedo ayudarte a ordenar esta consulta con datos demo de agenda, pacientes, tratamientos y gestión. Cuando se conecte el backend, esta misma interfaz podrá consultar información real autorizada de Cloud Esther.",
      cards: [
        { label: "Modo", value: "Demo", trend: "Sin backend", tone: "primary" },
        { label: "Fuente", value: "Mock", trend: "Reemplazable", tone: "muted" },
        { label: "Acción", value: "Lista", trend: "Frontend", tone: "success" },
      ],
    }
  );
}

export function buildInitialEstherMessages(context?: ClinicalAnalysisContext): AIMessage[] {
  const now = new Date().toISOString();
  if (context) {
    const response = getEstherDemoResponse("Analiza el estado odontológico de este paciente.", context);
    return [
      {
        id: "ctx-user",
        role: "user",
        content: "Analiza el estado odontológico de este paciente.",
        createdAt: now,
      },
      {
        id: "ctx-esther",
        role: "assistant",
        createdAt: now,
        ...response,
      },
    ];
  }

  return [
    {
      id: "welcome-esther",
      role: "assistant",
      content:
        "Hola, soy Esther. Estoy lista para ayudarte a analizar la actividad clínica y administrativa de tu consultorio con datos demo.",
      createdAt: now,
      cards: [
        { label: "Disponibilidad", value: "Activa", trend: "Modo demo", tone: "success" },
        { label: "Áreas", value: "8", trend: "Gestión clínica", tone: "primary" },
      ],
    },
  ];
}
