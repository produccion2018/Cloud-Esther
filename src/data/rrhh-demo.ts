// src/data/rrhh-demo.ts
// Fuente de datos compartida para todo el módulo de Recursos Humanos.

export type EmployeeStatus = "Activo" | "Vacaciones" | "Licencia" | "Inactivo";
export type ContractType =
  | "Tiempo completo"
  | "Medio tiempo"
  | "Profesional"
  | "Monotributo"
  | "Eventual";

export type Employee = {
  id: number;
  name: string;
  role: string;
  area: string;
  branch: string;
  contract: ContractType;
  status: EmployeeStatus;
  startDate: string;
  salary: number;
  vacationTotal: number;
  vacationUsed: number;
  email: string;
  phone: string;
  dni: string;
  address: string;
  birthDate: string;
  emergencyContact: string;
  emergencyPhone: string;
  professionalLicense: string;
  schedule: string;
  contractEnd: string;
};

export const initialEmployees: Employee[] = [
  {
    id: 1, name: "María González", role: "Recepcionista", area: "Administración",
    branch: "Sucursal Centro", contract: "Tiempo completo", status: "Activo",
    startDate: "2023-04-10", salary: 850000, vacationTotal: 21, vacationUsed: 7,
    email: "maria@cloudesther.test", phone: "+54 9 11 5555-1001", dni: "32.456.781",
    address: "Av. Corrientes 1200", birthDate: "1990-05-18", emergencyContact: "Luis González",
    emergencyPhone: "+54 9 11 5555-9001", professionalLicense: "", schedule: "08:00 - 17:00",
    contractEnd: "2027-04-10",
  },
  {
    id: 2, name: "Carlos Rodríguez", role: "Odontólogo", area: "Clínica",
    branch: "Sucursal Centro", contract: "Profesional", status: "Activo",
    startDate: "2022-08-15", salary: 1450000, vacationTotal: 21, vacationUsed: 5,
    email: "carlos@cloudesther.test", phone: "+54 9 11 5555-1002", dni: "30.234.567",
    address: "Tucumán 845", birthDate: "1985-10-04", emergencyContact: "Paula Rodríguez",
    emergencyPhone: "+54 9 11 5555-9002", professionalLicense: "MN 45821", schedule: "09:00 - 18:00",
    contractEnd: "2027-08-15",
  },
  {
    id: 3, name: "Laura Fernández", role: "Asistente dental", area: "Clínica",
    branch: "Sucursal Norte", contract: "Tiempo completo", status: "Vacaciones",
    startDate: "2024-01-22", salary: 780000, vacationTotal: 21, vacationUsed: 10,
    email: "laura@cloudesther.test", phone: "+54 9 11 5555-1003", dni: "35.123.987",
    address: "Belgrano 540", birthDate: "1995-02-12", emergencyContact: "Marta Fernández",
    emergencyPhone: "+54 9 11 5555-9003", professionalLicense: "", schedule: "10:00 - 19:00",
    contractEnd: "2027-01-22",
  },
  {
    id: 4, name: "Ana Martínez", role: "Limpieza", area: "Servicios generales",
    branch: "Sucursal Centro", contract: "Medio tiempo", status: "Activo",
    startDate: "2024-06-03", salary: 520000, vacationTotal: 14, vacationUsed: 4,
    email: "ana@cloudesther.test", phone: "+54 9 11 5555-1004", dni: "37.456.321",
    address: "Rivadavia 1900", birthDate: "1988-07-20", emergencyContact: "José Martínez",
    emergencyPhone: "+54 9 11 5555-9004", professionalLicense: "", schedule: "07:00 - 13:00",
    contractEnd: "2027-06-03",
  },
  {
    id: 5, name: "Jorge Pérez", role: "Mantenimiento", area: "Servicios generales",
    branch: "Sucursal Norte", contract: "Tiempo completo", status: "Licencia",
    startDate: "2021-11-08", salary: 720000, vacationTotal: 21, vacationUsed: 3,
    email: "jorge@cloudesther.test", phone: "+54 9 11 5555-1005", dni: "29.345.678",
    address: "San Martín 430", birthDate: "1982-11-14", emergencyContact: "Laura Pérez",
    emergencyPhone: "+54 9 11 5555-9005", professionalLicense: "", schedule: "08:00 - 17:00",
    contractEnd: "2026-09-10",
  },
  {
    id: 6, name: "Sofía Ramírez", role: "Analista de Finanzas", area: "Administración",
    branch: "Sucursal Centro", contract: "Tiempo completo", status: "Activo",
    startDate: "2025-02-17", salary: 980000, vacationTotal: 21, vacationUsed: 2,
    email: "sofia@cloudesther.test", phone: "+54 9 11 5555-1006", dni: "41.223.456",
    address: "Santa Fe 730", birthDate: "1997-03-30", emergencyContact: "Pedro Ramírez",
    emergencyPhone: "+54 9 11 5555-9006", professionalLicense: "", schedule: "09:00 - 18:00",
    contractEnd: "2027-02-17",
  },
];

// ---------- Legajos digitales ----------

export type LegajoDocCategory =
  | "Contrato" | "Identidad" | "Profesional" | "Salud" | "Académico" | "Otro";

export type LegajoDocument = {
  id: number;
  employeeId: number;
  name: string;
  category: LegajoDocCategory;
  fileType: "PDF" | "Word" | "Imagen";
  uploadedAt: string;
  uploadedBy: string;
  sizeKb: number;
};

export const initialLegajoDocuments: LegajoDocument[] = [
  { id: 1, employeeId: 1, name: "DNI (frente y dorso)", category: "Identidad", fileType: "Imagen", uploadedAt: "2023-04-10", uploadedBy: "RR.HH.", sizeKb: 820 },
  { id: 2, employeeId: 1, name: "CV actualizado", category: "Otro", fileType: "PDF", uploadedAt: "2023-04-10", uploadedBy: "RR.HH.", sizeKb: 340 },
  { id: 3, employeeId: 1, name: "Contrato firmado", category: "Contrato", fileType: "PDF", uploadedAt: "2023-04-11", uploadedBy: "RR.HH.", sizeKb: 512 },
  { id: 4, employeeId: 2, name: "Matrícula profesional", category: "Profesional", fileType: "PDF", uploadedAt: "2022-08-15", uploadedBy: "RR.HH.", sizeKb: 210 },
  { id: 5, employeeId: 2, name: "Título universitario", category: "Académico", fileType: "PDF", uploadedAt: "2022-08-15", uploadedBy: "RR.HH.", sizeKb: 980 },
  { id: 6, employeeId: 2, name: "Apto médico laboral", category: "Salud", fileType: "PDF", uploadedAt: "2026-01-05", uploadedBy: "RR.HH.", sizeKb: 150 },
  { id: 7, employeeId: 3, name: "Contrato firmado", category: "Contrato", fileType: "PDF", uploadedAt: "2024-01-22", uploadedBy: "RR.HH.", sizeKb: 490 },
  { id: 8, employeeId: 5, name: "Certificado médico (licencia actual)", category: "Salud", fileType: "PDF", uploadedAt: "2026-08-20", uploadedBy: "RR.HH.", sizeKb: 205 },
];

// ---------- Contratos ----------

export type ContractStatus = "Vigente" | "Por renovar" | "Vencido" | "Finalizado";

export type EmploymentContract = {
  id: number;
  employeeId: number;
  contractType: ContractType;
  startDate: string;
  endDate: string;
  renewalNoticeDays: number;
  baseSalary: number;
  status: ContractStatus;
  clauses: string[];
};

export const initialContracts: EmploymentContract[] = [
  { id: 1, employeeId: 1, contractType: "Tiempo completo", startDate: "2023-04-10", endDate: "2027-04-10", renewalNoticeDays: 30, baseSalary: 850000, status: "Vigente", clauses: ["Jornada 08:00-17:00", "Convenio Sanidad"] },
  { id: 2, employeeId: 2, contractType: "Profesional", startDate: "2022-08-15", endDate: "2027-08-15", renewalNoticeDays: 60, baseSalary: 1450000, status: "Vigente", clauses: ["Honorarios profesionales", "Exclusividad parcial"] },
  { id: 3, employeeId: 3, contractType: "Tiempo completo", startDate: "2024-01-22", endDate: "2027-01-22", renewalNoticeDays: 30, baseSalary: 780000, status: "Vigente", clauses: ["Jornada 10:00-19:00"] },
  { id: 4, employeeId: 4, contractType: "Medio tiempo", startDate: "2024-06-03", endDate: "2027-06-03", renewalNoticeDays: 30, baseSalary: 520000, status: "Vigente", clauses: ["Jornada reducida 6hs"] },
  { id: 5, employeeId: 5, contractType: "Tiempo completo", startDate: "2021-11-08", endDate: "2026-09-10", renewalNoticeDays: 30, baseSalary: 720000, status: "Por renovar", clauses: ["Jornada 08:00-17:00"] },
  { id: 6, employeeId: 6, contractType: "Tiempo completo", startDate: "2025-02-17", endDate: "2027-02-17", renewalNoticeDays: 30, baseSalary: 980000, status: "Vigente", clauses: ["Jornada 09:00-18:00"] },
];

// ---------- Historial laboral ----------

export type WorkHistoryEventType =
  | "Alta" | "Ascenso" | "Cambio de puesto" | "Aumento salarial"
  | "Sanción" | "Licencia" | "Reincorporación" | "Baja";

export type WorkHistoryEvent = {
  id: number;
  employeeId: number;
  date: string;
  type: WorkHistoryEventType;
  description: string;
};

export const initialWorkHistory: WorkHistoryEvent[] = [
  { id: 1, employeeId: 1, date: "2023-04-10", type: "Alta", description: "Ingreso como Recepcionista, Sucursal Centro." },
  { id: 2, employeeId: 1, date: "2025-05-01", type: "Aumento salarial", description: "Ajuste salarial +12% por revisión anual." },
  { id: 3, employeeId: 2, date: "2022-08-15", type: "Alta", description: "Ingreso como Odontólogo, Sucursal Centro." },
  { id: 4, employeeId: 2, date: "2024-03-10", type: "Ascenso", description: "Pasó a responsable del área Clínica." },
  { id: 5, employeeId: 3, date: "2024-01-22", type: "Alta", description: "Ingreso como Asistente dental, Sucursal Norte." },
  { id: 6, employeeId: 3, date: "2026-08-24", type: "Licencia", description: "Inicio de vacaciones anuales (10 días)." },
  { id: 7, employeeId: 5, date: "2021-11-08", type: "Alta", description: "Ingreso como Mantenimiento, Sucursal Norte." },
  { id: 8, employeeId: 5, date: "2026-08-24", type: "Licencia", description: "Licencia médica con certificado presentado." },
  { id: 9, employeeId: 6, date: "2025-02-17", type: "Alta", description: "Ingreso como Analista de Finanzas." },
];

// ---------- Capacitaciones ----------

export type TrainingStatus = "Programada" | "En curso" | "Completada" | "Cancelada";

export type Training = {
  id: number;
  name: string;
  category: string;
  modality: "Presencial" | "Virtual" | "Híbrida";
  startDate: string;
  endDate: string;
  status: TrainingStatus;
  instructor: string;
  participantIds: number[];
  completedIds: number[];
};

export const initialTrainings: Training[] = [
  { id: 1, name: "Bioseguridad y control de infecciones", category: "Salud y seguridad", modality: "Presencial", startDate: "2026-07-01", endDate: "2026-07-01", status: "Completada", instructor: "Dra. Beatriz Soto", participantIds: [2, 3], completedIds: [2, 3] },
  { id: 2, name: "Atención al paciente y comunicación", category: "Habilidades blandas", modality: "Virtual", startDate: "2026-08-10", endDate: "2026-08-24", status: "Completada", instructor: "RR.HH.", participantIds: [1, 3, 6], completedIds: [1, 6] },
  { id: 3, name: "Uso del nuevo sistema de turnos", category: "Herramientas internas", modality: "Híbrida", startDate: "2026-09-02", endDate: "2026-09-05", status: "Programada", instructor: "Soporte técnico", participantIds: [1, 2, 3, 4, 5, 6], completedIds: [] },
  { id: 4, name: "Primeros auxilios", category: "Salud y seguridad", modality: "Presencial", startDate: "2026-09-15", endDate: "2026-09-15", status: "Programada", instructor: "Cruz Roja", participantIds: [1, 2, 3, 4, 5, 6], completedIds: [] },
];

// ---------- Evaluación de desempeño ----------

export type PerformanceReview = {
  id: number;
  employeeId: number;
  period: string;
  overallScore: number;
  competencies: { name: string; score: number }[];
  strengths: string;
  improvementAreas: string;
  reviewer: string;
  reviewedAt: string;
};

export const initialPerformanceReviews: PerformanceReview[] = [
  {
    id: 1, employeeId: 1, period: "1er semestre 2026", overallScore: 4.3,
    competencies: [
      { name: "Atención al paciente", score: 4.5 },
      { name: "Puntualidad", score: 4.7 },
      { name: "Trabajo en equipo", score: 4.0 },
      { name: "Proactividad", score: 3.9 },
    ],
    strengths: "Excelente trato con pacientes, muy organizada con la agenda.",
    improvementAreas: "Podría tomar más iniciativa en tareas administrativas nuevas.",
    reviewer: "Gerencia", reviewedAt: "2026-07-05",
  },
  {
    id: 2, employeeId: 2, period: "1er semestre 2026", overallScore: 4.8,
    competencies: [
      { name: "Calidad clínica", score: 4.9 },
      { name: "Puntualidad", score: 4.6 },
      { name: "Trabajo en equipo", score: 4.8 },
      { name: "Actualización profesional", score: 4.9 },
    ],
    strengths: "Referente técnico del equipo, muy buena relación con pacientes y colegas.",
    improvementAreas: "Sin observaciones relevantes en este período.",
    reviewer: "Gerencia", reviewedAt: "2026-07-05",
  },
  {
    id: 3, employeeId: 3, period: "1er semestre 2026", overallScore: 3.9,
    competencies: [
      { name: "Atención al paciente", score: 4.1 },
      { name: "Puntualidad", score: 3.5 },
      { name: "Trabajo en equipo", score: 4.2 },
      { name: "Proactividad", score: 3.8 },
    ],
    strengths: "Buena predisposición y aprendizaje rápido de procedimientos.",
    improvementAreas: "Mejorar puntualidad en el horario de entrada.",
    reviewer: "Gerencia", reviewedAt: "2026-07-05",
  },
];

// ---------- Organigrama ----------

export type OrgNode = {
  employeeId: number;
  managerId: number | null;
};

export const orgChart: OrgNode[] = [
  { employeeId: 2, managerId: null },
  { employeeId: 1, managerId: 2 },
  { employeeId: 3, managerId: 2 },
  { employeeId: 6, managerId: 2 },
  { employeeId: 4, managerId: 1 },
  { employeeId: 5, managerId: 1 },
];

// ---------- Matriz de puestos y roles ----------

export type JobPosition = {
  id: number;
  title: string;
  department: string;
  level: "Junior" | "Semi-senior" | "Senior" | "Jefatura" | "Dirección";
  headcount: number;
  filled: number;
  requiredSkills: string[];
  salaryRangeMin: number;
  salaryRangeMax: number;
};

export const jobPositions: JobPosition[] = [
  { id: 1, title: "Recepcionista", department: "Administración", level: "Junior", headcount: 2, filled: 1, requiredSkills: ["Atención al cliente", "Manejo de agenda", "Office"], salaryRangeMin: 750000, salaryRangeMax: 900000 },
  { id: 2, title: "Odontólogo/a", department: "Clínica", level: "Senior", headcount: 3, filled: 1, requiredSkills: ["Matrícula habilitante", "Odontología general", "Atención al paciente"], salaryRangeMin: 1300000, salaryRangeMax: 1800000 },
  { id: 3, title: "Asistente dental", department: "Clínica", level: "Semi-senior", headcount: 3, filled: 1, requiredSkills: ["Esterilización", "Asistencia en consultorio"], salaryRangeMin: 700000, salaryRangeMax: 900000 },
  { id: 4, title: "Analista de Finanzas", department: "Administración", level: "Semi-senior", headcount: 1, filled: 1, requiredSkills: ["Contabilidad básica", "Excel avanzado"], salaryRangeMin: 900000, salaryRangeMax: 1100000 },
  { id: 5, title: "Personal de mantenimiento", department: "Servicios generales", level: "Junior", headcount: 2, filled: 2, requiredSkills: ["Mantenimiento edilicio"], salaryRangeMin: 650000, salaryRangeMax: 800000 },
];

// ---------- Comunicaciones internas ----------

export type Announcement = {
  id: number;
  title: string;
  body: string;
  author: string;
  publishedAt: string;
  audience: "Todo el equipo" | "Clínica" | "Administración" | "Servicios generales";
  pinned: boolean;
};

export const initialAnnouncements: Announcement[] = [
  { id: 1, title: "Nuevo protocolo de esterilización", body: "A partir del lunes se actualiza el protocolo de esterilización de instrumental. Revisar el instructivo en Documentación.", author: "Dirección", publishedAt: "2026-08-20", audience: "Clínica", pinned: true },
  { id: 2, title: "Cierre por feriado", body: "Recordamos que el 7 de septiembre no habrá atención al público por feriado local.", author: "Administración", publishedAt: "2026-08-22", audience: "Todo el equipo", pinned: true },
  { id: 3, title: "Encuesta de clima laboral", body: "Les pedimos completar la encuesta anónima de clima laboral antes de fin de mes.", author: "RR.HH.", publishedAt: "2026-08-18", audience: "Todo el equipo", pinned: false },
];

// ---------- Cumpleaños y eventos ----------

export type CompanyEvent = {
  id: number;
  title: string;
  date: string;
  type: "Aniversario laboral" | "Evento" | "Capacitación" | "Feriado";
  description: string;
};

export const initialCompanyEvents: CompanyEvent[] = [
  { id: 1, title: "Aniversario Carlos Rodríguez (4 años)", date: "2026-08-15", type: "Aniversario laboral", description: "4 años en Cloud Esther." },
  { id: 2, title: "Jornada de integración de equipo", date: "2026-09-20", type: "Evento", description: "Almuerzo y actividad de team building en Sucursal Centro." },
  { id: 3, title: "Feriado nacional", date: "2026-09-07", type: "Feriado", description: "Sin atención al público." },
];

// ---------- Alertas y vencimientos ----------

export type AlertSeverity = "info" | "warning" | "critical";
export type AlertSource = "Documentación" | "Contrato" | "Legajo" | "Capacitación";

export type HrAlert = {
  id: number;
  employeeId: number | null;
  title: string;
  detail: string;
  dueDate: string;
  severity: AlertSeverity;
  source: AlertSource;
};

export const initialHrAlerts: HrAlert[] = [
  { id: 1, employeeId: 2, title: "Matrícula profesional por vencer", detail: "Vence el 18/09/2026, iniciar renovación.", dueDate: "2026-09-18", severity: "warning", source: "Documentación" },
  { id: 2, employeeId: 5, title: "Contrato por renovar", detail: "El contrato de Jorge Pérez vence el 10/09/2026.", dueDate: "2026-09-10", severity: "critical", source: "Contrato" },
  { id: 3, employeeId: 3, title: "Apto médico vencido", detail: "El apto médico de Laura Fernández venció el 10/08/2026.", dueDate: "2026-08-10", severity: "critical", source: "Legajo" },
  { id: 4, employeeId: null, title: "Capacitación obligatoria pendiente", detail: "Primeros auxilios: falta confirmar asistencia de todo el equipo.", dueDate: "2026-09-15", severity: "info", source: "Capacitación" },
];

// ---------- Sucursales y departamentos ----------

export type Branch = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

export const initialBranches: Branch[] = [
  { id: 1, name: "Sucursal Centro", address: "Av. Corrientes 1200, CABA", phone: "+54 11 4555-1000" },
  { id: 2, name: "Sucursal Norte", address: "Av. Cabildo 2450, CABA", phone: "+54 11 4555-2000" },
];

export type Department = {
  id: number;
  name: string;
  branchName: string;
  headEmployeeId: number | null;
};

export const initialDepartments: Department[] = [
  { id: 1, name: "Clínica", branchName: "Sucursal Centro", headEmployeeId: 2 },
  { id: 2, name: "Administración", branchName: "Sucursal Centro", headEmployeeId: 1 },
  { id: 3, name: "Servicios generales", branchName: "Sucursal Centro", headEmployeeId: null },
  { id: 4, name: "Clínica", branchName: "Sucursal Norte", headEmployeeId: 3 },
  { id: 5, name: "Servicios generales", branchName: "Sucursal Norte", headEmployeeId: 5 },
];

// ---------- Reportes de RR.HH. ----------

export type MonthlyHeadcount = { month: string; count: number };

export const headcountTrend: MonthlyHeadcount[] = [
  { month: "Mar", count: 4 },
  { month: "Abr", count: 4 },
  { month: "May", count: 5 },
  { month: "Jun", count: 5 },
  { month: "Jul", count: 5 },
  { month: "Ago", count: 6 },
];

// ---------- Gestión de archivos y documentos Word/PDF ----------

export type CompanyDocCategory = "Política" | "Plantilla" | "Manual" | "Legal" | "Otro";

export type CompanyDocument = {
  id: number;
  name: string;
  category: CompanyDocCategory;
  fileType: "PDF" | "Word";
  updatedAt: string;
  updatedBy: string;
  sizeKb: number;
};

export const initialCompanyDocuments: CompanyDocument[] = [
  { id: 1, name: "Reglamento interno de convivencia", category: "Política", fileType: "PDF", updatedAt: "2026-02-10", updatedBy: "RR.HH.", sizeKb: 640 },
  { id: 2, name: "Plantilla de contrato - Tiempo completo", category: "Plantilla", fileType: "Word", updatedAt: "2026-01-15", updatedBy: "RR.HH.", sizeKb: 88 },
  { id: 3, name: "Manual de bioseguridad", category: "Manual", fileType: "PDF", updatedAt: "2026-07-01", updatedBy: "Dirección", sizeKb: 1240 },
  { id: 4, name: "Modelo de carta de despido", category: "Legal", fileType: "Word", updatedAt: "2025-11-20", updatedBy: "RR.HH.", sizeKb: 52 },
  { id: 5, name: "Protocolo de licencias y ausencias", category: "Política", fileType: "PDF", updatedAt: "2026-03-05", updatedBy: "RR.HH.", sizeKb: 310 },
];

// ---------- Automatizaciones con n8n ----------

export type AutomationStatus = "Activa" | "Pausada" | "Con error";

export type Automation = {
  id: number;
  name: string;
  trigger: string;
  action: string;
  status: AutomationStatus;
  lastRun: string;
  runsThisMonth: number;
};

export const initialAutomations: Automation[] = [
  { id: 1, name: "Alerta de contrato por vencer", trigger: "30 días antes del vencimiento", action: "Enviar email a RR.HH. + notificación interna", status: "Activa", lastRun: "2026-08-24", runsThisMonth: 3 },
  { id: 2, name: "Recordatorio de cumpleaños", trigger: "Todos los días a las 08:00", action: "Publicar en Comunicaciones internas", status: "Activa", lastRun: "2026-08-25", runsThisMonth: 25 },
  { id: 3, name: "Alta de empleado → checklist de onboarding", trigger: "Nuevo empleado creado", action: "Crear tareas de legajo + enviar bienvenida por email", status: "Activa", lastRun: "2026-08-01", runsThisMonth: 1 },
  { id: 4, name: "Backup semanal de legajos a Drive", trigger: "Todos los domingos 23:00", action: "Exportar documentos nuevos a carpeta compartida", status: "Con error", lastRun: "2026-08-23", runsThisMonth: 3 },
];

// ---------- Configuración de RR.HH. ----------

export type HrSettings = {
  vacationDaysPerYear: number;
  contractRenewalNoticeDays: number;
  workWeekHours: number;
  fiscalYearStartMonth: string;
  requireDocumentApproval: boolean;
  notifyOnContractExpiry: boolean;
  notifyOnDocumentExpiry: boolean;
};

export const initialHrSettings: HrSettings = {
  vacationDaysPerYear: 21,
  contractRenewalNoticeDays: 30,
  workWeekHours: 44,
  fiscalYearStartMonth: "Enero",
  requireDocumentApproval: true,
  notifyOnContractExpiry: true,
  notifyOnDocumentExpiry: true,
};

// ---------- Permisos y accesos ----------

export type HrRole = "Administrador" | "RR.HH." | "Jefe de área" | "Solo lectura";

export type AccessGrant = {
  id: number;
  employeeId: number;
  role: HrRole;
  modules: string[];
};

export const initialAccessGrants: AccessGrant[] = [
  { id: 1, employeeId: 6, role: "Administrador", modules: ["Todos los módulos"] },
  { id: 2, employeeId: 1, role: "RR.HH.", modules: ["Empleados", "Legajos", "Vacaciones", "Documentación"] },
  { id: 3, employeeId: 2, role: "Jefe de área", modules: ["Equipo de Clínica", "Evaluación de desempeño"] },
  { id: 4, employeeId: 4, role: "Solo lectura", modules: ["Comunicaciones internas"] },
];

// ---------- Auditoría de acciones ----------

export type AuditAction = "Creación" | "Edición" | "Eliminación" | "Aprobación" | "Exportación";

export type AuditLogEntry = {
  id: number;
  timestamp: string;
  user: string;
  action: AuditAction;
  target: string;
  details: string;
};

export const initialAuditLog: AuditLogEntry[] = [
  { id: 1, timestamp: "2026-08-25 09:12", user: "Sofía Ramírez", action: "Aprobación", target: "Solicitud de licencia · Jorge Pérez", details: "Aprobó licencia médica del 24 al 28/08." },
  { id: 2, timestamp: "2026-08-24 17:40", user: "María González", action: "Creación", target: "Documento · Apto médico laboral", details: "Cargó documento al legajo de Carlos Rodríguez." },
  { id: 3, timestamp: "2026-08-22 11:05", user: "Sofía Ramírez", action: "Edición", target: "Empleado · Ana Martínez", details: "Actualizó horario de 07:00-13:00." },
  { id: 4, timestamp: "2026-08-20 08:30", user: "Dirección", action: "Creación", target: "Comunicado · Nuevo protocolo de esterilización", details: "Publicado para el área Clínica." },
  { id: 5, timestamp: "2026-08-18 15:22", user: "María González", action: "Exportación", target: "Listado de empleados", details: "Exportó CSV con 6 registros." },
];

export const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();

export const money = (value: number) =>
  `$${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;