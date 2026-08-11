export type ModuleKey =
  | "agenda"
  | "pacientes"
  | "clinica"
  | "comunicacion"
  | "marketing"
  | "facturacion"
  | "analitica"
  | "directorio"
  | "seguridad"
  | "multiempresa";

export const modules: {
  key: ModuleKey;
  name: string;
  icon: string;
  description: string;
  bullets: string[];
}[] = [
  {
    key: "agenda",
    name: "Agenda y gestión de citas",
    icon: "CalendarDays",
    description:
      "Calendario diario, semanal y mensual por sucursal, odontólogo y gabinete, con recordatorios automáticos.",
    bullets: [
      "Vistas día, semana y mes",
      "Bloqueo de horarios y lista de espera",
      "Recordatorios por WhatsApp, SMS y correo",
      "Reasignación automática de turnos cancelados",
    ],
  },
  {
    key: "pacientes",
    name: "Gestión de pacientes",
    icon: "Users",
    description:
      "Ficha clínica completa con antecedentes, documentos, consentimientos y estado del paciente.",
    bullets: [
      "Búsqueda y filtros avanzados",
      "Antecedentes médicos y alergias",
      "Radiografías, fotografías y documentos",
      "Consentimientos con firma electrónica",
    ],
  },
  {
    key: "clinica",
    name: "Gestión clínica",
    icon: "Stethoscope",
    description:
      "Odontograma visual, diagnósticos, evoluciones, planes de tratamiento y presupuestos aprobables.",
    bullets: [
      "Odontograma interactivo",
      "Planes de tratamiento por fases",
      "Presupuestos y aprobación digital",
      "Seguimiento del progreso clínico",
    ],
  },
  {
    key: "comunicacion",
    name: "Comunicación con pacientes",
    icon: "MessagesSquare",
    description:
      "Bandeja unificada de WhatsApp, correo y SMS con plantillas y automatizaciones.",
    bullets: [
      "Bandeja unificada multicanal",
      "Plantillas de mensajes",
      "Campañas de reactivación",
      "Historial completo por paciente",
    ],
  },
  {
    key: "marketing",
    name: "Marketing y captación",
    icon: "Megaphone",
    description:
      "Página pública de la clínica, formularios de captación, leads, referidos y reseñas verificadas.",
    bullets: [
      "Perfil público y especialidades",
      "Gestión de leads y embudo",
      "Programa de referidos",
      "Reseñas verificadas y contenido",
    ],
  },
  {
    key: "facturacion",
    name: "Facturación y pagos",
    icon: "Receipt",
    description:
      "Facturas, cobros, presupuestos, métodos de pago y control de la suscripción de la clínica.",
    bullets: [
      "Facturas y pagos pendientes",
      "Planes de financiación",
      "Suscripción y cambio de plan",
      "Alertas de vencimiento",
    ],
  },
  {
    key: "analitica",
    name: "Analítica y reportes",
    icon: "BarChart3",
    description:
      "Indicadores de producción, ocupación, conversión de leads y rendimiento por odontólogo y sucursal.",
    bullets: [
      "Ingresos y tratamientos top",
      "Conversión de leads",
      "Ausencias y cancelaciones",
      "Exportación de reportes",
    ],
  },
  {
    key: "directorio",
    name: "Directorio de clínicas y odontólogos",
    icon: "MapPin",
    description:
      "Perfiles públicos indexables para captar pacientes nuevos desde buscadores.",
    bullets: [
      "Fichas por sucursal",
      "Especialidades y horarios",
      "Reserva online",
      "Valoraciones de pacientes",
    ],
  },
  {
    key: "seguridad",
    name: "Seguridad y control de accesos",
    icon: "ShieldCheck",
    description:
      "Roles granulares, auditoría de actividad, copias de respaldo y trazabilidad clínica.",
    bullets: [
      "Roles y permisos por sucursal",
      "Auditoría de actividad",
      "Doble factor de autenticación",
      "Respaldo automático",
    ],
  },
  {
    key: "multiempresa",
    name: "Administración multiempresa",
    icon: "Building2",
    description:
      "Un solo panel para grupos odontológicos con datos separados por organización y sucursal.",
    bullets: [
      "Sucursales ilimitadas",
      "Consolidado del grupo",
      "Comparativa entre clínicas",
      "Configuración centralizada",
    ],
  },
];

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  setup: number;
  branches: string;
  users: string;
  support: string;
  analytics: string;
  automations: string;
  modules: ModuleKey[];
  highlighted?: boolean;
};

export const plans: Plan[] = [
  {
    id: "inicial",
    name: "Clínica Inicial",
    tagline: "Para clínicas que empiezan a digitalizarse",
    monthly: 79,
    setup: 390,
    branches: "1 sucursal",
    users: "Hasta 5 usuarios",
    support: "Soporte por correo (48 h)",
    analytics: "Reportes básicos",
    automations: "Recordatorios de cita",
    modules: ["agenda", "pacientes", "clinica"],
  },
  {
    id: "profesional",
    name: "Clínica Profesional",
    tagline: "La opción más elegida por clínicas en crecimiento",
    monthly: 149,
    setup: 690,
    branches: "Hasta 2 sucursales",
    users: "Usuarios ilimitados",
    support: "Soporte prioritario (24 h)",
    analytics: "Analítica avanzada",
    automations: "Recordatorios + reactivación",
    modules: ["agenda", "pacientes", "clinica", "comunicacion", "facturacion", "analitica"],
    highlighted: true,
  },
  {
    id: "avanzada",
    name: "Clínica Avanzada",
    tagline: "Para clínicas con alto volumen y equipo comercial",
    monthly: 249,
    setup: 1190,
    branches: "Hasta 5 sucursales",
    users: "Usuarios y empleados ilimitados",
    support: "Soporte dedicado + WhatsApp",
    analytics: "Analítica avanzada + cohortes",
    automations: "Automatizaciones personalizadas",
    modules: [
      "agenda",
      "pacientes",
      "clinica",
      "comunicacion",
      "marketing",
      "facturacion",
      "analitica",
      "directorio",
      "seguridad",
    ],
  },
  {
    id: "grupo",
    name: "Grupo Odontológico",
    tagline: "Multiempresa, multisucursal y administración central",
    monthly: 429,
    setup: 2490,
    branches: "Sucursales ilimitadas",
    users: "Ilimitados por organización",
    support: "Gestor de cuenta y SLA",
    analytics: "Consolidado del grupo + BI",
    automations: "Motor de automatización completo",
    modules: [
      "agenda",
      "pacientes",
      "clinica",
      "comunicacion",
      "marketing",
      "facturacion",
      "analitica",
      "directorio",
      "seguridad",
      "multiempresa",
    ],
  },
];

export const addOns = [
  { name: "Sucursal adicional", price: 39, unit: "mes" },
  { name: "Módulo de marketing", price: 45, unit: "mes" },
  { name: "WhatsApp Business API", price: 35, unit: "mes" },
  { name: "Firma electrónica avanzada", price: 25, unit: "mes" },
  { name: "Portal del paciente", price: 29, unit: "mes" },
  { name: "Migración de historiales", price: 350, unit: "único" },
];

export const branches = [
  { id: "todas", name: "Todas las sucursales" },
  { id: "centro", name: "Clínica Centro" },
  { id: "norte", name: "Clínica Norte" },
  { id: "sur", name: "Clínica Sur" },
];

export const dentists = [
  { id: "d1", name: "Dra. Lucía Ferrer", specialty: "Ortodoncia", branch: "centro" },
  { id: "d2", name: "Dr. Martín Salas", specialty: "Implantología", branch: "centro" },
  { id: "d3", name: "Dra. Camila Ríos", specialty: "Endodoncia", branch: "norte" },
  { id: "d4", name: "Dr. Andrés Peña", specialty: "Odontopediatría", branch: "sur" },
  { id: "d5", name: "Dra. Valeria Moro", specialty: "Estética dental", branch: "norte" },
];

export type AppointmentStatus =
  | "pendiente"
  | "confirmada"
  | "atendida"
  | "cancelada"
  | "ausente";

export const appointments = [
  { id: "c1", time: "08:00", patient: "Marina Delgado", treatment: "Limpieza y profilaxis", dentist: "d1", branch: "centro", room: "Gabinete 1", status: "atendida" as AppointmentStatus },
  { id: "c2", time: "08:45", patient: "Julián Ortega", treatment: "Control de ortodoncia", dentist: "d1", branch: "centro", room: "Gabinete 1", status: "atendida" as AppointmentStatus },
  { id: "c3", time: "09:30", patient: "Sofía Marín", treatment: "Implante unitario", dentist: "d2", branch: "centro", room: "Gabinete 2", status: "confirmada" as AppointmentStatus },
  { id: "c4", time: "10:15", patient: "Tomás Vidal", treatment: "Endodoncia molar", dentist: "d3", branch: "norte", room: "Gabinete 1", status: "confirmada" as AppointmentStatus },
  { id: "c5", time: "11:00", patient: "Renata Quiroga", treatment: "Blanqueamiento", dentist: "d5", branch: "norte", room: "Gabinete 3", status: "pendiente" as AppointmentStatus },
  { id: "c6", time: "11:45", patient: "Ignacio Bravo", treatment: "Extracción cordal", dentist: "d2", branch: "centro", room: "Gabinete 2", status: "cancelada" as AppointmentStatus },
  { id: "c7", time: "12:30", patient: "Elena Cruz", treatment: "Primera consulta", dentist: "d4", branch: "sur", room: "Gabinete 1", status: "pendiente" as AppointmentStatus },
  { id: "c8", time: "15:00", patient: "Pablo Iriarte", treatment: "Carilla cerámica", dentist: "d5", branch: "norte", room: "Gabinete 3", status: "confirmada" as AppointmentStatus },
  { id: "c9", time: "16:00", patient: "Nuria Campos", treatment: "Revisión de implante", dentist: "d2", branch: "centro", room: "Gabinete 2", status: "ausente" as AppointmentStatus },
  { id: "c10", time: "17:00", patient: "Bruno Escalante", treatment: "Sellado infantil", dentist: "d4", branch: "sur", room: "Gabinete 1", status: "confirmada" as AppointmentStatus },
];

export const waitlist = [
  { id: "w1", patient: "Carla Núñez", treatment: "Ortodoncia invisible", preference: "Tardes", branch: "centro" },
  { id: "w2", patient: "Diego Ramallo", treatment: "Limpieza", preference: "Mañanas", branch: "norte" },
  { id: "w3", patient: "Ana Belén Soto", treatment: "Urgencia dolor", preference: "Hoy", branch: "sur" },
];

export type PatientStatus = "activo" | "inactivo" | "lead" | "pendiente";

export const patients = [
  { id: "p1", name: "Marina Delgado", doc: "28.994.113", phone: "+34 611 224 087", email: "marina.delgado@mail.com", branch: "centro", dentist: "d1", status: "activo" as PatientStatus, lastVisit: "2026-08-11", balance: 0, treatment: "Ortodoncia fase 2" },
  { id: "p2", name: "Sofía Marín", doc: "31.220.775", phone: "+34 622 118 340", email: "sofia.marin@mail.com", branch: "centro", dentist: "d2", status: "activo" as PatientStatus, lastVisit: "2026-08-04", balance: 940, treatment: "Implante 46" },
  { id: "p3", name: "Tomás Vidal", doc: "27.001.882", phone: "+34 633 552 019", email: "tomas.vidal@mail.com", branch: "norte", dentist: "d3", status: "pendiente" as PatientStatus, lastVisit: "2026-07-22", balance: 320, treatment: "Endodoncia 26" },
  { id: "p4", name: "Renata Quiroga", doc: "35.774.201", phone: "+34 644 909 771", email: "renata.q@mail.com", branch: "norte", dentist: "d5", status: "lead" as PatientStatus, lastVisit: "—", balance: 0, treatment: "Blanqueamiento (presupuesto)" },
  { id: "p5", name: "Ignacio Bravo", doc: "29.556.412", phone: "+34 655 330 118", email: "i.bravo@mail.com", branch: "centro", dentist: "d2", status: "inactivo" as PatientStatus, lastVisit: "2025-11-19", balance: 0, treatment: "—" },
  { id: "p6", name: "Elena Cruz", doc: "40.112.556", phone: "+34 666 774 552", email: "elena.cruz@mail.com", branch: "sur", dentist: "d4", status: "activo" as PatientStatus, lastVisit: "2026-08-10", balance: 150, treatment: "Odontopediatría" },
  { id: "p7", name: "Pablo Iriarte", doc: "33.887.004", phone: "+34 677 221 664", email: "pablo.iriarte@mail.com", branch: "norte", dentist: "d5", status: "activo" as PatientStatus, lastVisit: "2026-08-09", balance: 1280, treatment: "8 carillas" },
  { id: "p8", name: "Nuria Campos", doc: "26.443.900", phone: "+34 688 110 223", email: "nuria.campos@mail.com", branch: "centro", dentist: "d2", status: "pendiente" as PatientStatus, lastVisit: "2026-06-30", balance: 460, treatment: "Corona sobre implante" },
];

export const revenueSeries = [
  { month: "Feb", ingresos: 41200, citas: 320, leads: 74 },
  { month: "Mar", ingresos: 46800, citas: 356, leads: 88 },
  { month: "Abr", ingresos: 44100, citas: 341, leads: 81 },
  { month: "May", ingresos: 52300, citas: 388, leads: 96 },
  { month: "Jun", ingresos: 57600, citas: 410, leads: 108 },
  { month: "Jul", ingresos: 61250, citas: 432, leads: 121 },
  { month: "Ago", ingresos: 64980, citas: 448, leads: 133 },
];

export const branchActivity = [
  { branch: "Clínica Centro", citas: 186, ocupacion: 92, ingresos: 31200 },
  { branch: "Clínica Norte", citas: 148, ocupacion: 84, ingresos: 21450 },
  { branch: "Clínica Sur", citas: 114, ocupacion: 71, ingresos: 12330 },
];

export const topTreatments = [
  { name: "Ortodoncia invisible", value: 28, ingresos: 24800 },
  { name: "Implantes", value: 22, ingresos: 21400 },
  { name: "Estética / carillas", value: 18, ingresos: 15600 },
  { name: "Endodoncia", value: 17, ingresos: 8900 },
  { name: "Higiene y prevención", value: 15, ingresos: 5400 },
];

export const conversations = [
  { id: "m1", patient: "Renata Quiroga", channel: "WhatsApp", preview: "Hola, quería saber el precio del blanqueamiento…", time: "09:12", unread: 2 },
  { id: "m2", patient: "Tomás Vidal", channel: "SMS", preview: "Confirmo mi cita del jueves, gracias.", time: "08:40", unread: 0 },
  { id: "m3", patient: "Pablo Iriarte", channel: "Correo", preview: "Adjunto el consentimiento firmado.", time: "Ayer", unread: 1 },
  { id: "m4", patient: "Elena Cruz", channel: "WhatsApp", preview: "¿Pueden reprogramar la cita del niño?", time: "Ayer", unread: 0 },
  { id: "m5", patient: "Carla Núñez", channel: "WhatsApp", preview: "Me interesa el plan de financiación.", time: "Lun", unread: 3 },
];

export const messageTemplates = [
  { name: "Recordatorio 24 h", channel: "WhatsApp", uses: 1284 },
  { name: "Confirmación de cita", channel: "SMS", uses: 968 },
  { name: "Paciente inactivo 6 meses", channel: "Correo", uses: 412 },
  { name: "Presupuesto pendiente", channel: "WhatsApp", uses: 233 },
  { name: "Post-operatorio implante", channel: "WhatsApp", uses: 187 },
];

export const leads = [
  { id: "l1", name: "Carla Núñez", source: "Google Ads", interest: "Ortodoncia invisible", stage: "Contactado", value: 3200 },
  { id: "l2", name: "Renata Quiroga", source: "Instagram", interest: "Blanqueamiento", stage: "Nuevo", value: 380 },
  { id: "l3", name: "Hernán Lasso", source: "Directorio", interest: "Implantes", stage: "Presupuesto", value: 4100 },
  { id: "l4", name: "Paula Sanz", source: "Referido", interest: "Limpieza", stage: "Agendado", value: 90 },
  { id: "l5", name: "Marcos Iglesias", source: "Web clínica", interest: "Carillas", stage: "Presupuesto", value: 5600 },
];

export const invoices = [
  { id: "F-2026-0481", patient: "Pablo Iriarte", date: "2026-08-09", amount: 1280, status: "pendiente" },
  { id: "F-2026-0480", patient: "Sofía Marín", date: "2026-08-04", amount: 940, status: "pendiente" },
  { id: "F-2026-0479", patient: "Marina Delgado", date: "2026-08-01", amount: 210, status: "pagada" },
  { id: "F-2026-0478", patient: "Elena Cruz", date: "2026-07-28", amount: 150, status: "vencida" },
  { id: "F-2026-0477", patient: "Nuria Campos", date: "2026-07-25", amount: 460, status: "pagada" },
];

export const roles = [
  { name: "Propietario del grupo", scope: "Todas las organizaciones", users: 1, permissions: "Acceso total, facturación y plan" },
  { name: "Administrador", scope: "Organización", users: 2, permissions: "Todos los módulos activos" },
  { name: "Gerente de sucursal", scope: "Sucursal asignada", users: 3, permissions: "Agenda, pacientes, analítica de su sede" },
  { name: "Odontólogo", scope: "Sucursal asignada", users: 12, permissions: "Su agenda, historia clínica, tratamientos" },
  { name: "Asistente dental", scope: "Sucursal asignada", users: 9, permissions: "Agenda y evoluciones asistidas" },
  { name: "Recepción", scope: "Sucursal asignada", users: 6, permissions: "Citas, pacientes, cobros básicos" },
  { name: "Contabilidad", scope: "Organización", users: 2, permissions: "Facturación, pagos, reportes" },
  { name: "Marketing", scope: "Organización", users: 2, permissions: "Leads, campañas, reseñas" },
];

export const testimonials = [
  {
    quote:
      "Pasamos de tres agendas en papel a un panel único para las tres sedes. Las ausencias bajaron un 34 % en el primer trimestre.",
    name: "Dra. Paula Arriaga",
    role: "Directora, Grupo Dental Arriaga (3 sucursales)",
  },
  {
    quote:
      "La bandeja de WhatsApp con plantillas nos ahorra unas 15 horas de recepción por semana. La implementación tardó menos de dos semanas.",
    name: "Lic. Gonzalo Peralta",
    role: "Gerente, Clínica Sonrisa Plena",
  },
  {
    quote:
      "El odontograma y los presupuestos con aprobación digital nos subieron la tasa de aceptación de tratamientos al 68 %.",
    name: "Dr. Esteban Mora",
    role: "Implantólogo, Centro Odontológico Mora",
  },
];

export const faqs = [
  {
    q: "¿Cómo funciona el modelo de implementación y membresía?",
    a: "Se abona una implementación inicial única que incluye configuración, migración de datos y formación del equipo. A partir de ahí se paga una membresía mensual según el plan y los módulos activos.",
  },
  {
    q: "¿Hay límite de sucursales, odontólogos o pacientes?",
    a: "No. La plataforma es multiempresa y multisucursal sin límites técnicos: el plan define cuántas sedes y usuarios están incluidos, y puedes ampliar cuando lo necesites.",
  },
  {
    q: "¿Puedo activar solo algunos módulos?",
    a: "Sí. Cada clínica activa únicamente los módulos que usa y puede añadir marketing, facturación, directorio u otros en cualquier momento desde el panel.",
  },
  {
    q: "¿Cuánto tarda la puesta en marcha?",
    a: "Entre 5 y 15 días hábiles según el tamaño de la clínica y el volumen de historiales a migrar.",
  },
  {
    q: "¿Qué pasa con la seguridad de los datos clínicos?",
    a: "Los datos se separan por organización y sucursal, con roles granulares, doble factor, auditoría de actividad y copias de respaldo automáticas.",
  },
  {
    q: "¿Puedo cambiar de plan más adelante?",
    a: "Sí, el cambio de plan es inmediato desde el panel de suscripción y se prorratea en la siguiente factura.",
  },
];

export const moduleIconByKey: Record<ModuleKey, string> = Object.fromEntries(
  modules.map((m) => [m.key, m.icon]),
) as Record<ModuleKey, string>;

export const moduleNameByKey: Record<ModuleKey, string> = Object.fromEntries(
  modules.map((m) => [m.key, m.name]),
) as Record<ModuleKey, string>;

export const currency = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
