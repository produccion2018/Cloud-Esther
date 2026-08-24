import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Download,
  FileText,
  FolderOpen,
  HeartPulse,
  History,
  ImagePlus,
  Pencil,
  Plus,
  Receipt,
  Search,
  Stethoscope,
  Trash2,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { branches } from "@/data/demo";

export const Route = createFileRoute("/app/pacientes")({
  component: PatientsPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
  insurance: string;
  insuranceNumber: string;
  branch: string;
  address: string;
  notes: string;
  photo?: string;
};

const demoPatient: Patient = {
  id: "p-001",
  firstName: "Mauro",
  lastName: "Pinto",
  document: "95.222.294",
  phone: "+54 11 5555-8899",
  email: "mauro.pinto@example.com",
  birthDate: "1990-05-18",
  gender: "Masculino",
  insurance: "OSDE",
  insuranceNumber: "OS-45892177",
  branch: "Sucursal Centro",
  address: "Av. Corrientes 1234, Buenos Aires",
  notes: "Paciente interesado en tratamiento integral y seguimiento preventivo.",
};

const demoHistory = [
  {
    date: "21/08/2026",
    title: "Consulta odontológica general",
    professional: "Dra. Laura Fernández",
    specialty: "Odontología general",
    description:
      "Control general. Se realizó evaluación clínica y actualización del odontograma.",
  },
  {
    date: "15/08/2026",
    title: "Estudio diagnóstico",
    professional: "Dr. Martín Gómez",
    specialty: "Radiología odontológica",
    description:
      "Se solicitó radiografía panorámica para evaluar piezas posteriores.",
  },
  {
    date: "02/08/2026",
    title: "Primera consulta",
    professional: "Dra. Laura Fernández",
    specialty: "Odontología general",
    description:
      "Evaluación inicial y planificación de tratamiento.",
  },
];

const demoTreatments = [
  {
    treatment: "Limpieza y profilaxis",
    tooth: "General",
    professional: "Dra. Laura Fernández",
    status: "Completado",
    date: "02/08/2026",
    value: "$45.000",
  },
  {
    treatment: "Restauración estética",
    tooth: "Pieza 21",
    professional: "Dr. Carlos Rodríguez",
    status: "En tratamiento",
    date: "12/08/2026",
    value: "$120.000",
  },
  {
    treatment: "Implante unitario",
    tooth: "Pieza 36",
    professional: "Dr. Martín Gómez",
    status: "Pendiente",
    date: "Próxima etapa",
    value: "$650.000",
  },
];

const demoDocuments = [
  {
    name: "DNI / Documento de identidad",
    type: "Identificación",
    date: "02/08/2026",
    status: "Verificado",
  },
  {
    name: "Consentimiento informado",
    type: "Consentimiento",
    date: "02/08/2026",
    status: "Firmado",
  },
  {
    name: "Radiografía panorámica",
    type: "Estudio diagnóstico",
    date: "15/08/2026",
    status: "Disponible",
  },
  {
    name: "Presupuesto tratamiento integral",
    type: "Presupuesto",
    date: "12/08/2026",
    status: "Vigente",
  },
];

const demoAppointments = [
  {
    date: "21/08/2026",
    time: "10:30",
    treatment: "Control odontológico",
    professional: "Dra. Laura Fernández",
    status: "Confirmado",
  },
  {
    date: "28/08/2026",
    time: "15:00",
    treatment: "Restauración pieza 21",
    professional: "Dr. Carlos Rodríguez",
    status: "Pendiente",
  },
  {
    date: "15/08/2026",
    time: "11:00",
    treatment: "Estudio diagnóstico",
    professional: "Dr. Martín Gómez",
    status: "Atendido",
  },
  {
    date: "02/08/2026",
    time: "09:30",
    treatment: "Primera consulta",
    professional: "Dra. Laura Fernández",
    status: "Atendido",
  },
];

const demoStudies = [
  {
    date: "15/08/2026",
    study: "Radiografía panorámica",
    professional: "Dr. Martín Gómez",
    result: "Sin hallazgos críticos. Se recomienda seguimiento de piezas posteriores.",
    file: "radiografia-panoramica.jpg",
  },
  {
    date: "15/08/2026",
    study: "Radiografía periapical",
    professional: "Dr. Martín Gómez",
    result: "Evaluación de pieza 36.",
    file: "periapical-36.jpg",
  },
];

const demoBudgets = [
  {
    date: "12/08/2026",
    description: "Tratamiento integral",
    total: "$1.250.000",
    insuranceDiscount: "$250.000",
    patientTotal: "$1.000.000",
    status: "Aceptado",
  },
  {
    date: "02/08/2026",
    description: "Limpieza y restauración",
    total: "$165.000",
    insuranceDiscount: "$45.000",
    patientTotal: "$120.000",
    status: "Finalizado",
  },
];

const demoPayments = [
  {
    date: "12/08/2026",
    description: "Seña tratamiento integral",
    method: "Mercado Pago",
    amount: "$250.000",
    status: "Pagado",
  },
  {
    date: "02/08/2026",
    description: "Limpieza y profilaxis",
    method: "Efectivo",
    amount: "$45.000",
    status: "Pagado",
  },
];

const demoProfessionals = [
  {
    name: "Dra. Laura Fernández",
    specialty: "Odontología general",
    role: "Profesional principal",
    attention: "Primera consulta y controles",
  },
  {
    name: "Dr. Carlos Rodríguez",
    specialty: "Odontología estética",
    role: "Tratamiento",
    attention: "Restauración estética pieza 21",
  },
  {
    name: "Dr. Martín Gómez",
    specialty: "Radiología odontológica",
    role: "Diagnóstico",
    attention: "Estudios radiográficos",
  },
];

function NewPatientDialog({
  onCreate,
}: {
  onCreate: (patient: Patient) => void;
}) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    document: "",
    birthDate: "",
    gender: "",
    phone: "",
    email: "",
    insurance: "no-aplica",
    insuranceNumber: "",
    branch: branches.find((b) => b.id !== "todas")?.name ?? "",
    address: "",
    notes: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function createPatient() {
    if (!form.firstName || !form.lastName || !form.document || !form.email) {
      toast.error("Completá nombre, apellido, documento y correo.");
      return;
    }

    const patient: Patient = {
      id: `p-${Date.now()}`,
      firstName: form.firstName,
      lastName: form.lastName,
      document: form.document,
      phone: form.phone,
      email: form.email,
      birthDate: form.birthDate,
      gender: form.gender,
      insurance:
        form.insurance === "no-aplica" ? "Sin obra social" : form.insurance,
      insuranceNumber: form.insuranceNumber,
      branch: form.branch,
      address: form.address,
      notes: form.notes,
    };

    onCreate(patient);
    setOpen(false);

    toast.success("Paciente creado correctamente.");

    setForm({
      firstName: "",
      lastName: "",
      document: "",
      birthDate: "",
      gender: "",
      phone: "",
      email: "",
      insurance: "no-aplica",
      insuranceNumber: "",
      branch: branches.find((b) => b.id !== "todas")?.name ?? "",
      address: "",
      notes: "",
    });
  }

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <UserPlus className="size-4" />
        Nuevo paciente
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo paciente</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* FOTO */}
            <div className="flex items-center gap-4">
              <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-primary/5">
                <ImagePlus className="size-7 text-primary" />
              </div>

              <div>
                <p className="text-sm font-semibold">Foto del paciente</p>
                <p className="text-xs text-muted-foreground">
                  La foto podrá agregarse o cambiarse posteriormente.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Seleccionar foto
                </Button>
              </div>
            </div>

            {/* DATOS PERSONALES */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Datos personales
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Nombre *</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    placeholder="Mauro"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Apellido *</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    placeholder="Pinto"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Documento *</Label>
                  <Input
                    value={form.document}
                    onChange={(e) => update("document", e.target.value)}
                    placeholder="95.222.294"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    El documento debe ser válido y único para el paciente.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label>Fecha de nacimiento</Label>
                  <Input
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => update("birthDate", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Sexo / género</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => update("gender", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                      <SelectItem value="no-informado">
                        Prefiero no informar
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Correo electrónico *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="mauro.pinto@email.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Teléfono</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+54 11 5555-8899"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Sucursal</Label>
                  <Select
                    value={form.branch}
                    onValueChange={(v) => update("branch", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branches
                        .filter((b) => b.id !== "todas")
                        .map((b) => (
                          <SelectItem key={b.id} value={b.name}>
                            {b.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* OBRA SOCIAL */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Obra social / cobertura
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Obra social</Label>
                  <Select
                    value={form.insurance}
                    onValueChange={(v) => update("insurance", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar obra social" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-aplica">
                        No aplica / particular
                      </SelectItem>
                      <SelectItem value="OSDE">OSDE</SelectItem>
                      <SelectItem value="Swiss Medical">
                        Swiss Medical
                      </SelectItem>
                      <SelectItem value="Galeno">Galeno</SelectItem>
                      <SelectItem value="Medifé">Medifé</SelectItem>
                      <SelectItem value="Sancor Salud">
                        Sancor Salud
                      </SelectItem>
                      <SelectItem value="IOMA">IOMA</SelectItem>
                      <SelectItem value="PAMI">PAMI</SelectItem>
                      <SelectItem value="Otro">Otra obra social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Número de afiliado</Label>
                  <Input
                    value={form.insuranceNumber}
                    onChange={(e) =>
                      update("insuranceNumber", e.target.value)
                    }
                    placeholder="OS-45892177"
                  />
                </div>
              </div>
            </div>

            {/* DOMICILIO */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Información de contacto
              </h3>

              <div className="space-y-1.5">
                <Label>Dirección</Label>
                <Input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Av. Corrientes 1234, Buenos Aires"
                />
              </div>
            </div>

            {/* NOTA */}
            <div className="space-y-1.5">
              <Label>Nota de interés</Label>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Información importante sobre el paciente..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>

            <Button onClick={createPatient}>
              Crear paciente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PatientDetail({ patient }: { patient: Patient }) {
  const [section, setSection] = useState("resumen");

  const menu = [
    {
      id: "resumen",
      label: "Resumen",
      icon: Users,
    },
    {
      id: "historia",
      label: "Historia clínica",
      icon: History,
    },
    {
      id: "tratamientos",
      label: "Tratamientos",
      icon: Stethoscope,
    },
    {
      id: "odontograma",
      label: "Odontograma",
      icon: Activity,
    },
    {
      id: "documentos",
      label: "Documentos",
      icon: FolderOpen,
    },
    {
      id: "estudios",
      label: "Estudios y diagnósticos",
      icon: FileText,
    },
    {
      id: "presupuestos",
      label: "Presupuestos",
      icon: Receipt,
    },
    {
      id: "turnos",
      label: "Turnos",
      icon: CalendarDays,
    },
    {
      id: "cuenta",
      label: "Cuenta corriente",
      icon: Wallet,
    },
    {
      id: "profesionales",
      label: "Profesionales",
      icon: HeartPulse,
    },
  ];

  return (
    <Card className={`${cardStyle} mt-6 overflow-hidden`}>
      <CardHeader className="border-b bg-card/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {patient.firstName[0]}
              {patient.lastName[0]}
            </div>

            <div>
              <CardTitle className="text-xl">
                {patient.firstName} {patient.lastName}
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                DNI {patient.document} · {patient.phone}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">Paciente activo</Badge>
                <Badge variant="outline">
                  {patient.insurance}
                </Badge>
                <Badge variant="outline">{patient.branch}</Badge>
              </div>
            </div>
          </div>

          <Button variant="outline" className="gap-2">
            <Pencil className="size-4" />
            Editar paciente
          </Button>
        </div>
      </CardHeader>

      <div className="grid lg:grid-cols-[230px_1fr]">
        {/* NAVEGACIÓN INTERNA DEL PACIENTE */}
        <aside className="border-b bg-muted/20 p-3 lg:border-b-0 lg:border-r">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Carpeta del paciente
          </p>

          <div className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* CONTENIDO */}
        <div className="min-w-0 p-5 lg:p-6">

          {/* RESUMEN */}
          {section === "resumen" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold">
                  Resumen del paciente
                </h3>
                <p className="text-sm text-muted-foreground">
                  Información general y estado actual de {patient.firstName}.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                  label="Documento"
                  value={patient.document}
                />
                <InfoCard
                  label="Correo"
                  value={patient.email}
                />
                <InfoCard
                  label="Obra social"
                  value={patient.insurance}
                />
                <InfoCard
                  label="Afiliado"
                  value={
                    patient.insuranceNumber || "No informado"
                  }
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Tratamiento actual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <strong>Restauración estética</strong>
                    </p>
                    <p className="text-muted-foreground">
                      Pieza 21 · En tratamiento
                    </p>
                    <p className="text-muted-foreground">
                      Profesional: Dr. Carlos Rodríguez
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Próximo turno
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <strong>28/08/2026 · 15:00</strong>
                    </p>
                    <p className="text-muted-foreground">
                      Restauración pieza 21
                    </p>
                    <p className="text-muted-foreground">
                      Dr. Carlos Rodríguez
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Información de contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                  <p>
                    <strong>Teléfono:</strong> {patient.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {patient.email}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {patient.address}
                  </p>
                  <p>
                    <strong>Sucursal:</strong> {patient.branch}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* HISTORIA CLÍNICA */}
          {section === "historia" && (
            <DetailSection
              icon={History}
              title="Historia clínica"
              description="Registro cronológico de las consultas, diagnósticos, procedimientos y profesionales que atendieron al paciente."
              action="Nueva evolución"
            >
              <div className="space-y-4">
                {demoHistory.map((item) => (
                  <Card key={`${item.date}-${item.title}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>

                        <Badge variant="secondary">
                          {item.date}
                        </Badge>
                      </div>

                      <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">
                        Atendido por{" "}
                        <strong>{item.professional}</strong> ·{" "}
                        {item.specialty}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DetailSection>
          )}

          {/* TRATAMIENTOS */}
          {section === "tratamientos" && (
            <DetailSection
              icon={Stethoscope}
              title="Tratamientos"
              description="Tratamientos realizados, en curso y pendientes, incluyendo pieza dental, profesional, estado y valor."
              action="Agregar tratamiento"
            >
              <div className="space-y-3">
                {demoTreatments.map((item) => (
                  <Card key={item.treatment}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold">
                            {item.treatment}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.tooth} · {item.professional}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">
                            {item.status}
                          </Badge>
                          <Badge variant="secondary">
                            {item.value}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DetailSection>
          )}

          {/* ODONTOGRAMA */}
          {section === "odontograma" && (
            <DetailSection
              icon={Activity}
              title="Odontograma"
              description="Estado dental del paciente y registro de tratamientos por pieza."
              action="Editar odontograma"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                    {[
                      "11",
                      "12",
                      "13",
                      "14",
                      "15",
                      "16",
                      "17",
                      "18",
                      "21",
                      "22",
                      "23",
                      "24",
                      "25",
                      "26",
                      "27",
                      "28",
                    ].map((tooth, index) => (
                      <div
                        key={tooth}
                        className={`flex aspect-square items-center justify-center rounded-xl border text-sm font-semibold ${
                          index === 5 || index === 10
                            ? "border-destructive/40 bg-destructive/10 text-destructive"
                            : "border-primary/20 bg-primary/5"
                        }`}
                      >
                        {tooth}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>● Sano</span>
                    <span>● Tratamiento</span>
                    <span>● Restauración</span>
                    <span>● Ausente</span>
                  </div>
                </CardContent>
              </Card>
            </DetailSection>
          )}

          {/* DOCUMENTOS */}
          {section === "documentos" && (
            <DetailSection
              icon={FolderOpen}
              title="Documentos"
              description="Documentación administrativa, consentimientos, estudios y archivos relacionados con el paciente."
              action="Subir documento"
            >
              <div className="space-y-3">
                {demoDocuments.map((doc) => (
                  <Card key={doc.name}>
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="size-5 text-primary" />
                        </div>

                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type} · {doc.date}
                          </p>
                        </div>
                      </div>

                      <Badge variant="secondary">
                        {doc.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DetailSection>
          )}

          {/* ESTUDIOS */}
          {section === "estudios" && (
            <DetailSection
              icon={FileText}
              title="Estudios y diagnósticos"
              description="Radiografías, imágenes, diagnósticos y resultados asociados al paciente."
              action="Cargar estudio"
            >
              <div className="space-y-4">
                {demoStudies.map((study) => (
                  <Card key={study.file}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <FileText className="size-6 text-primary" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold">
                            {study.study}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {study.date} · {study.professional}
                          </p>
                          <p className="mt-2 text-sm">
                            {study.result}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DetailSection>
          )}

          {/* PRESUPUESTOS */}
          {section === "presupuestos" && (
            <DetailSection
              icon={Receipt}
              title="Presupuestos"
              description="Presupuestos realizados, descuentos de obra social, importe del paciente y estado."
              action="Nuevo presupuesto"
            >
              <div className="space-y-3">
                {demoBudgets.map((budget) => (
                  <Card key={budget.description}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold">
                            {budget.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {budget.date}
                          </p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-sm">
                            Total: <strong>{budget.total}</strong>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Cobertura/descuento:{" "}
                            {budget.insuranceDiscount}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            Paciente: {budget.patientTotal}
                          </p>
                        </div>

                        <Badge variant="secondary">
                          {budget.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DetailSection>
          )}

          {/* TURNOS */}
          {section === "turnos" && (
            <DetailSection
              icon={CalendarDays}
              title="Turnos del paciente"
              description="Historial de turnos, asistencia, cancelaciones, confirmaciones y próximos turnos."
              action="Nuevo turno"
            >
              <div className="space-y-3">
                {demoAppointments.map((appointment) => (
                  <Card key={`${appointment.date}-${appointment.time}`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold">
                            {appointment.date} · {appointment.time}
                          </p>
                          <p className="text-sm">
                            {appointment.treatment}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.professional}
                          </p>
                        </div>

                        <Badge variant="secondary">
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DetailSection>
          )}

          {/* CUENTA CORRIENTE */}
          {section === "cuenta" && (
            <DetailSection
              icon={Wallet}
              title="Cuenta corriente"
              description="Pagos, saldos, deudas, medios de pago y movimientos financieros del paciente."
              action="Registrar pago"
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <InfoCard
                  label="Total facturado"
                  value="$1.250.000"
                />
                <InfoCard
                  label="Pagado"
                  value="$295.000"
                />
                <InfoCard
                  label="Saldo pendiente"
                  value="$955.000"
                />
              </div>

              <div className="mt-5 space-y-3">
                {demoPayments.map((payment) => (
                  <Card key={payment.date + payment.description}>
                    <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">
                          {payment.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.date} · {payment.method}
                        </p>
                      </div>

                      <p className="font-semibold">
                        {payment.amount}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DetailSection>
          )}

          {/* PROFESIONALES */}
          {section === "profesionales" && (
            <DetailSection
              icon={HeartPulse}
              title="Profesionales"
              description="Profesionales que atendieron al paciente, especialidad y relación con sus tratamientos."
              action="Asignar profesional"
            >
              <div className="space-y-3">
                {demoProfessionals.map((professional) => (
                  <Card key={professional.name}>
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">
                          {professional.name}
                        </p>
                        <p className="text-sm text-primary">
                          {professional.specialty}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {professional.role} ·{" "}
                          {professional.attention}
                        </p>
                      </div>

                      <Badge variant="outline">
                        Profesional asignado
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DetailSection>
          )}
        </div>
      </div>
    </Card>
  );
}

function DetailSection({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon: typeof History;
  title: string;
  description: string;
  action: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>

          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          {action}
        </Button>
      </div>

      {children}
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([demoPatient]);
  const [query, setQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [status, setStatus] = useState("todos");
  const [branch, setBranch] = useState("todas");

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const search = query.toLowerCase().trim();

      const matchesSearch =
        !search ||
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(search) ||
        patient.document.toLowerCase().includes(search) ||
        patient.phone.toLowerCase().includes(search);

      const matchesBranch =
        branch === "todas" ||
        patient.branch ===
          branches.find((b) => b.id === branch)?.name;

      const matchesStatus =
        status === "todos" || status === "activo";

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [patients, query, branch, status]);

  const selectedPatient = patients.find(
    (patient) => patient.id === selectedPatientId,
  );

  function createPatient(patient: Patient) {
    setPatients((prev) => [patient, ...prev]);
    setSelectedPatientId(patient.id);
  }

  function deletePatient(id: string) {
    const patient = patients.find((p) => p.id === id);

    if (!patient) return;

    if (
      !window.confirm(
        `¿Eliminar al paciente ${patient.firstName} ${patient.lastName}?`,
      )
    ) {
      return;
    }

    setPatients((prev) => prev.filter((p) => p.id !== id));
    setSelectedPatientId(null);
    toast.success("Paciente eliminado.");
  }

  return (
    <>
      <PageHeader
        title="Pacientes"
        description="Listado unificado de pacientes con acceso a su carpeta clínica, tratamientos, documentos, turnos y cuenta corriente."
        badge={`${patients.length} pacientes`}
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() =>
                toast.info("Exportación de pacientes preparada.")
              }
            >
              <Download className="size-4" />
              Exportar
            </Button>

            <NewPatientDialog onCreate={createPatient} />
          </>
        }
      />

      {/* FILTROS */}
      <Card className={`${cardStyle} mb-5`}>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Buscar por nombre, documento o teléfono"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="pendiente">
                Tratamiento pendiente
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* LISTADO */}
      {filteredPatients.length === 0 ? (
        <Card className={cardStyle}>
          <CardContent className="p-6">
            <EmptyState
              icon={Users}
              title="No se encontraron pacientes"
              description="Probá cambiar los filtros o crear un nuevo paciente."
              action={
                <NewPatientDialog onCreate={createPatient} />
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPatients.map((patient) => {
            const selected = selectedPatientId === patient.id;

            return (
              <Card
                key={patient.id}
                className={`${cardStyle} ${
                  selected ? "border-primary shadow-lift" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* IDENTIDAD */}
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {patient.firstName} {patient.lastName}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          DNI {patient.document}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            Activo
                          </Badge>

                          <Badge variant="outline">
                            {patient.insurance}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* DATOS RESUMIDOS */}
                    <div className="grid gap-2 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Teléfono
                        </p>
                        <p>{patient.phone || "Sin teléfono"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Obra social
                        </p>
                        <p>{patient.insurance}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Sucursal
                        </p>
                        <p>{patient.branch}</p>
                      </div>
                    </div>

                    {/* ACCIONES */}
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant={selected ? "default" : "outline"}
                        className="gap-2"
                        onClick={() =>
                          setSelectedPatientId(
                            selected ? null : patient.id,
                          )
                        }
                      >
                        <FolderOpen className="size-4" />

                        {selected
                          ? "Cerrar carpeta"
                          : "Carpeta del paciente"}

                        {selected ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Editar paciente"
                        onClick={() =>
                          toast.info(
                            `Editar ${patient.firstName} ${patient.lastName}`,
                          )
                        }
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Eliminar paciente"
                        onClick={() => deletePatient(patient.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* CARPETA DEL PACIENTE */}
      {selectedPatient ? (
        <PatientDetail patient={selectedPatient} />
      ) : null}
    </>
  );
}