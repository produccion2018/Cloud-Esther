import type { DentalEvolution, DentalSurface, ToothStatus } from "@/lib/odontograma";

export type Patient = {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  dentist: string;
  activeTreatment: string;
  nextAppointment: string;
  alerts: string[];
  recentEvolutions: string[];
};

export type AIMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  cards?: AIAnalysis[];
};

export type AIConversation = {
  id: string;
  title: string;
  messages: AIMessage[];
  patientContext?: Patient;
};

export type AIAnalysis = {
  label: string;
  value: string;
  trend?: string;
  tone?: "primary" | "success" | "warning" | "muted";
};

export type ClinicalAnalysisContext = {
  patient: Patient;
  tooth?: number;
  surface?: DentalSurface;
  condition?: ToothStatus;
  evolutions?: DentalEvolution[];
};
