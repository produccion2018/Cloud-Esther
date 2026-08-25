import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Download,
  Eye,
  FileText,
  FileUp,
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
  Upload,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type PatientDocument = {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  file?: File;
  previewUrl?: string;
};

type ToothState =
  | "Sano"
  | "Caries"
  | "Restauración"
  | "Corona"
  | "Implante"
  | "Ausente"
  | "Tratamiento"
  | "Extracción indicada";

type Tooth = {
  number: string;
  state: ToothState;
  observation: string;
};

const toothNumbers = [
  "18",
  "17",
  "16",
  "15",
  "14",
  "13",
  "12",
  "11",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "48",
  "47",
  "46",
  "45",
  "44",
  "43",
  "42",
  "41",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
];

const toothStateOptions: ToothState[] = [
  "Sano",
  "Caries",
  "Restauración",
  "Corona",
  "Implante",
  "Ausente",
  "Tratamiento",
  "Extracción indicada",
];

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
  notes:
    "Paciente interesado en tratamiento integral y seguimiento preventivo.",
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

const demoDocuments: PatientDocument[] = [
  {
    id: "doc-001",
    name: "DNI / Documento de identidad",
    type: "Identificación",
    date: "02/08/2026",
    status: "Verificado",
  },
  {
    id: "doc-002",
    name: "Consentimiento informado",
    type: "Consentimiento",
    date: "02/08/2026",
    status: "Firmado",
  },
  {
    id: "doc-003",
    name: "Radiografía panorámica",
    type: "Estudio diagnóstico",
    date: "15/08/2026",
    status: "Disponible",
  },
  {
    id: "doc-004",
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
    result:
      "Sin hallazgos críticos. Se recomienda seguimiento de piezas posteriores.",
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

function createInitialTeeth(): Tooth[] {
  return toothNumbers.map((number) => ({
    number,
    state:
      number === "21"
        ? "Restauración"
        : number === "36"
          ? "Tratamiento"
          : "Sano",
    observation:
      number === "21"
        ? "Restauración estética en tratamiento."
        : number === "36"
          ? "Implante unitario planificado."
          : "",
  }));
}

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

            <div>
              <h3 className="mb-3 text-sm font-semibold">Datos personales</h3>

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

            <Button onClick={createPatient}>Crear paciente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditPatientDialog({
  patient,
  open,
  onOpenChange,
  onSave,
}: {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patient: Patient) => void;
}) {
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

  useEffect(() => {
    if (patient) {
      setForm({
        firstName: patient.firstName,
        lastName: patient.lastName,
        document: patient.document,
        birthDate: patient.birthDate,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email,
        insurance: patient.insurance || "no-aplica",
        insuranceNumber: patient.insuranceNumber,
        branch: patient.branch,
        address: patient.address,
        notes: patient.notes,
      });
    }
  }, [patient]);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    if (!patient) return;

    if (!form.firstName || !form.lastName || !form.document || !form.email) {
      toast.error("Completá nombre, apellido, documento y correo.");
      return;
    }

    onSave({
      ...patient,
      firstName: form.firstName,
      lastName: form.lastName,
      document: form.document,
      birthDate: form.birthDate,
      gender: form.gender,
      phone: form.phone,
      email: form.email,
      insurance:
        form.insurance === "no-aplica" ? "Sin obra social" : form.insurance,
      insuranceNumber: form.insuranceNumber,
      branch: form.branch,
      address: form.address,
      notes: form.notes,
    });

    toast.success("Paciente actualizado correctamente.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar paciente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold">Datos personales</h3>

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
                  className="text-sm"
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
                  onChange={(e) => update("insuranceNumber", e.target.value)}
                  placeholder="OS-45892177"
                />
              </div>
            </div>
          </div>

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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button onClick={save}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddTreatmentDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (treatment: (typeof demoTreatments)[number]) => void;
}) {
  const [form, setForm] = useState({
    treatment: "",
    tooth: "",
    professional: demoProfessionals[0]?.name ?? "",
    status: "Pendiente",
    date: "",
    value: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit() {
    if (!form.treatment) {
      toast.error("Completá el nombre del tratamiento.");
      return;
    }

    onAdd({
      treatment: form.treatment,
      tooth: form.tooth || "General",
      professional: form.professional,
      status: form.status,
      date: form.date || "Sin fecha",
      value: form.value || "A confirmar",
    });

    toast.success(
      "Tratamiento agregado (solo se muestra en pantalla, no se envió a ningún backend).",
    );

    onOpenChange(false);

    setForm({
      treatment: "",
      tooth: "",
      professional: demoProfessionals[0]?.name ?? "",
      status: "Pendiente",
      date: "",
      value: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar tratamiento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Tratamiento *</Label>
            <Input
              value={form.treatment}
              onChange={(e) => update("treatment", e.target.value)}
              placeholder="Restauración estética"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Pieza dental</Label>
              <Input
                value={form.tooth}
                onChange={(e) => update("tooth", e.target.value)}
                placeholder="Pieza 21"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Profesional</Label>
              <Select
                value={form.professional}
                onValueChange={(v) => update("professional", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {demoProfessionals.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select
                value={form.status}
                onValueChange={(v) => update("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En tratamiento">
                    En tratamiento
                  </SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Fecha</Label>
              <Input
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                placeholder="12/08/2026"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Valor</Label>
            <Input
              value={form.value}
              onChange={(e) => update("value", e.target.value)}
              placeholder="$120.000"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button onClick={submit}>Guardar tratamiento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UploadDocumentDialog({
  open,
  onOpenChange,
  onUpload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (document: PatientDocument) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [documentType, setDocumentType] = useState("Identificación");
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function reset() {
    setDocumentType("Identificación");
    setDocumentName("");
    setFile(null);
    setPreviewUrl("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleFile(fileToUpload: File | undefined) {
    if (!fileToUpload) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(fileToUpload.type)) {
      toast.error("Formato no permitido. Usá JPG, PNG, WEBP o PDF.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (fileToUpload.size > maxSize) {
      toast.error("El archivo supera el límite de 10 MB.");
      return;
    }

    setFile(fileToUpload);

    if (!documentName) {
      setDocumentName(
        fileToUpload.name.replace(/\.[^/.]+$/, ""),
      );
    }
  }

  function submit() {
    if (!file) {
      toast.error("Seleccioná un archivo.");
      return;
    }

    if (!documentName.trim()) {
      toast.error("Ingresá un nombre para el documento.");
      return;
    }

    const newDocument: PatientDocument = {
      id: `doc-${Date.now()}`,
      name: documentName.trim(),
      type: documentType,
      date: new Date().toLocaleDateString("es-AR"),
      status: "Cargado",
      file,
      previewUrl: file.type.startsWith("image/") ? previewUrl : undefined,
    };

    onUpload(newDocument);

    toast.success(
      "Documento cargado en la carpeta del paciente. El almacenamiento permanente quedará conectado al backend.",
    );

    reset();
    onOpenChange(false);
  }

  function formatFileSize(size: number) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);

        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Subir documento</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tipo de documento</Label>

              <Select
                value={documentType}
                onValueChange={setDocumentType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Identificación">
                    DNI / Documento
                  </SelectItem>

                  <SelectItem value="Obra social">
                    Obra social / cobertura
                  </SelectItem>

                  <SelectItem value="Consentimiento">
                    Consentimiento informado
                  </SelectItem>

                  <SelectItem value="Comprobante">
                    Comprobante de pago
                  </SelectItem>

                  <SelectItem value="Presupuesto">
                    Presupuesto
                  </SelectItem>

                  <SelectItem value="Estudio diagnóstico">
                    Estudio diagnóstico
                  </SelectItem>

                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Nombre del documento</Label>

              <Input
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="DNI frente"
              />
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {!file ? (
            <button
              type="button"
              className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/25 bg-primary/5 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-primary/10"
              onClick={() => inputRef.current?.click()}
            >
              <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <Upload className="size-7 text-primary" />
              </div>

              <p className="font-semibold">
                Seleccionar archivo
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                DNI, comprobante, consentimiento, estudio o PDF
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                JPG, PNG, WEBP o PDF · Máximo 10 MB
              </p>
            </button>
          ) : (
            <div className="rounded-2xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    {file.type.startsWith("image/") ? (
                      <ImagePlus className="size-5 text-primary" />
                    ) : (
                      <FileText className="size-5 text-primary" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {file.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {file.type || "Archivo"} ·{" "}
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Quitar archivo"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl("");

                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>

              {previewUrl ? (
                <div className="mt-4 overflow-hidden rounded-xl border bg-muted/20">
                  <img
                    src={previewUrl}
                    alt="Vista previa del documento"
                    className="max-h-72 w-full object-contain"
                  />
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/30 p-4">
                  <FileText className="size-8 text-primary" />

                  <div>
                    <p className="text-sm font-medium">
                      Documento PDF
                    </p>

                    <p className="text-xs text-muted-foreground">
                      El archivo está seleccionado y listo para cargar.
                    </p>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-2"
                onClick={() => inputRef.current?.click()}
              >
                <FileUp className="size-4" />
                Cambiar archivo
              </Button>
            </div>
          )}

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">
                Importante:
              </strong>{" "}
              esta versión permite seleccionar y visualizar el archivo
              desde el frontend. Para conservarlo permanentemente y
              asociarlo al paciente en Cloud Esther será necesario
              conectar posteriormente el backend y almacenamiento de
              archivos.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            className="gap-2"
            onClick={submit}
            disabled={!file}
          >
            <Upload className="size-4" />
            Cargar documento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OdontogramDialog({
  open,
  onOpenChange,
  teeth,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teeth: Tooth[];
  onSave: (teeth: Tooth[]) => void;
}) {
  const [localTeeth, setLocalTeeth] = useState<Tooth[]>(teeth);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(
    teeth[0]?.number ?? null,
  );

  useEffect(() => {
    if (open) {
      setLocalTeeth(teeth);
      setSelectedTooth(teeth[0]?.number ?? null);
    }
  }, [open, teeth]);

  const selected = localTeeth.find(
    (tooth) => tooth.number === selectedTooth,
  );

  function updateSelected(
    key: keyof Tooth,
    value: string,
  ) {
    if (!selectedTooth) return;

    setLocalTeeth((prev) =>
      prev.map((tooth) =>
        tooth.number === selectedTooth
          ? {
              ...tooth,
              [key]: value,
            }
          : tooth,
      ),
    );
  }

  function getToothClasses(state: ToothState) {
    switch (state) {
      case "Caries":
        return "border-destructive/50 bg-destructive/10 text-destructive";

      case "Restauración":
        return "border-primary/50 bg-primary/15 text-primary";

      case "Corona":
        return "border-amber-500/50 bg-amber-500/10 text-amber-700";

      case "Implante":
        return "border-emerald-500/50 bg-emerald-500/10 text-emerald-700";

      case "Ausente":
        return "border-muted-foreground/30 bg-muted text-muted-foreground line-through";

      case "Tratamiento":
        return "border-blue-500/50 bg-blue-500/10 text-blue-700";

      case "Extracción indicada":
        return "border-orange-500/50 bg-orange-500/10 text-orange-700";

      default:
        return "border-border bg-background text-foreground";
    }
  }

  function save() {
    onSave(localTeeth);
    toast.success("Odontograma actualizado correctamente.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Editar odontograma</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="mb-4 text-center">
              <p className="text-sm font-semibold">
                Arcada superior
              </p>
              <p className="text-xs text-muted-foreground">
                Seleccioná una pieza para editar su estado.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
              {localTeeth.slice(0, 16).map((tooth) => (
                <button
                  key={tooth.number}
                  type="button"
                  onClick={() => setSelectedTooth(tooth.number)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    getToothClasses(tooth.state)
                  } ${
                    selectedTooth === tooth.number
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                >
                  <span>{tooth.number}</span>

                  {tooth.state !== "Sano" && (
                    <span className="mt-0.5 max-w-full truncate px-0.5 text-[8px] font-normal">
                      {tooth.state}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="my-5 border-t" />

            <div className="mb-4 text-center">
              <p className="text-sm font-semibold">
                Arcada inferior
              </p>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
              {localTeeth.slice(16).map((tooth) => (
                <button
                  key={tooth.number}
                  type="button"
                  onClick={() => setSelectedTooth(tooth.number)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    getToothClasses(tooth.state)
                  } ${
                    selectedTooth === tooth.number
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                >
                  <span>{tooth.number}</span>

                  {tooth.state !== "Sano" && (
                    <span className="mt-0.5 max-w-full truncate px-0.5 text-[8px] font-normal">
                      {tooth.state}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Estado de la pieza
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {toothStateOptions.map((state) => (
                    <button
                      key={state}
                      type="button"
                      onClick={() =>
                        updateSelected("state", state)
                      }
                      className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors ${
                        selected?.state === state
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Pieza {selectedTooth ?? "—"}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Estado actual</Label>

                  <Select
                    value={selected?.state ?? "Sano"}
                    onValueChange={(value) =>
                      updateSelected("state", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {toothStateOptions.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Observación</Label>

                  <Textarea
                    rows={5}
                    value={selected?.observation ?? ""}
                    onChange={(e) =>
                      updateSelected(
                        "observation",
                        e.target.value,
                      )
                    }
                    placeholder="Observaciones clínicas de la pieza..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex flex-wrap gap-3 text-xs">
              {toothStateOptions.map((state) => (
                <div key={state} className="flex items-center gap-2">
                  <span
                    className={`size-3 rounded-full border ${getToothClasses(
                      state,
                    )}`}
                  />
                  <span>{state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button onClick={save}>
            Guardar odontograma
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewEvolutionDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (evolution: (typeof demoHistory)[number]) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    professional: demoProfessionals[0]?.name ?? "",
    specialty: demoProfessionals[0]?.specialty ?? "",
    date: new Date().toLocaleDateString("es-AR"),
    description: "",
  });

  function reset() {
    setForm({
      title: "",
      professional: demoProfessionals[0]?.name ?? "",
      specialty: demoProfessionals[0]?.specialty ?? "",
      date: new Date().toLocaleDateString("es-AR"),
      description: "",
    });
  }

  function submit() {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Completá el motivo y la evolución clínica.");
      return;
    }

    onSave({
      date: form.date || new Date().toLocaleDateString("es-AR"),
      title: form.title.trim(),
      professional: form.professional,
      specialty: form.specialty,
      description: form.description.trim(),
    });
    toast.success("Nueva evolución agregada en pantalla.");
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva evolución clínica</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Motivo / título *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Consulta odontológica general"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Fecha</Label>
              <Input
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                placeholder="24/08/2026"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Profesional</Label>
              <Select
                value={form.professional}
                onValueChange={(value) => {
                  const professional = demoProfessionals.find((p) => p.name === value);
                  setForm((prev) => ({
                    ...prev,
                    professional: value,
                    specialty: professional?.specialty ?? prev.specialty,
                  }));
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {demoProfessionals.map((professional) => (
                    <SelectItem key={professional.name} value={professional.name}>
                      {professional.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Evolución / observaciones clínicas *</Label>
            <Textarea
              rows={7}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describí la evolución, hallazgos, procedimientos realizados, indicaciones y observaciones..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Guardar evolución</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewBudgetDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (budget: (typeof demoBudgets)[number]) => void;
}) {
  const [form, setForm] = useState({
    description: "",
    date: new Date().toLocaleDateString("es-AR"),
    total: "",
    insuranceDiscount: "",
    patientTotal: "",
    status: "Pendiente",
  });

  function submit() {
    if (!form.description.trim() || !form.total.trim()) {
      toast.error("Completá la descripción y el total del presupuesto.");
      return;
    }
    onSave({
      date: form.date,
      description: form.description.trim(),
      total: form.total.trim(),
      insuranceDiscount: form.insuranceDiscount || "$0",
      patientTotal: form.patientTotal || form.total,
      status: form.status,
    });
    toast.success("Nuevo presupuesto agregado en pantalla.");
    setForm({ description: "", date: new Date().toLocaleDateString("es-AR"), total: "", insuranceDiscount: "", patientTotal: "", status: "Pendiente" });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>Nuevo presupuesto</DialogTitle></DialogHeader>
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2"><Label>Descripción *</Label><Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Tratamiento integral" /></div>
            <div className="space-y-1.5"><Label>Fecha</Label><Input value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Total *</Label><Input value={form.total} onChange={(e) => setForm((p) => ({ ...p, total: e.target.value }))} placeholder="$1.250.000" /></div>
            <div className="space-y-1.5"><Label>Descuento / cobertura</Label><Input value={form.insuranceDiscount} onChange={(e) => setForm((p) => ({ ...p, insuranceDiscount: e.target.value }))} placeholder="$250.000" /></div>
            <div className="space-y-1.5"><Label>Total paciente</Label><Input value={form.patientTotal} onChange={(e) => setForm((p) => ({ ...p, patientTotal: e.target.value }))} placeholder="$1.000.000" /></div>
            <div className="space-y-1.5"><Label>Estado</Label><Select value={form.status} onValueChange={(value) => setForm((p) => ({ ...p, status: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pendiente">Pendiente</SelectItem><SelectItem value="Enviado">Enviado</SelectItem><SelectItem value="Aceptado">Aceptado</SelectItem><SelectItem value="Finalizado">Finalizado</SelectItem></SelectContent></Select></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={submit}>Guardar presupuesto</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewAppointmentDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (appointment: (typeof demoAppointments)[number]) => void;
}) {
  const [form, setForm] = useState({
    date: "",
    time: "",
    treatment: "",
    professional: demoProfessionals[0]?.name ?? "",
    status: "Pendiente",
  });

  function submit() {
    if (!form.date || !form.time || !form.treatment.trim()) {
      toast.error("Completá fecha, hora y motivo del turno.");
      return;
    }
    onSave({ ...form, treatment: form.treatment.trim() });
    toast.success("Nuevo turno agregado en pantalla.");
    setForm({ date: "", time: "", treatment: "", professional: demoProfessionals[0]?.name ?? "", status: "Pendiente" });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>Nuevo turno</DialogTitle></DialogHeader>
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Fecha *</Label><Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Hora *</Label><Input type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label>Motivo / tratamiento *</Label><Input value={form.treatment} onChange={(e) => setForm((p) => ({ ...p, treatment: e.target.value }))} placeholder="Control odontológico" /></div>
            <div className="space-y-1.5"><Label>Profesional</Label><Select value={form.professional} onValueChange={(value) => setForm((p) => ({ ...p, professional: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{demoProfessionals.map((p) => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Estado</Label><Select value={form.status} onValueChange={(value) => setForm((p) => ({ ...p, status: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pendiente">Pendiente</SelectItem><SelectItem value="Confirmado">Confirmado</SelectItem><SelectItem value="Atendido">Atendido</SelectItem></SelectContent></Select></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={submit}>Guardar turno</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RegisterPaymentDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payment: (typeof demoPayments)[number]) => void;
}) {
  const [form, setForm] = useState({
    date: new Date().toLocaleDateString("es-AR"),
    description: "",
    method: "Efectivo",
    amount: "",
    status: "Pagado",
  });

  function submit() {
    if (!form.description.trim() || !form.amount.trim()) {
      toast.error("Completá el concepto y el importe.");
      return;
    }
    onSave({ ...form, description: form.description.trim(), amount: form.amount.trim() });
    toast.success("Pago registrado en pantalla.");
    setForm({ date: new Date().toLocaleDateString("es-AR"), description: "", method: "Efectivo", amount: "", status: "Pagado" });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Registrar pago</DialogTitle></DialogHeader>
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Fecha</Label><Input value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>Importe *</Label><Input value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} placeholder="$250.000" /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label>Concepto *</Label><Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Seña tratamiento integral" /></div>
            <div className="space-y-1.5"><Label>Medio de pago</Label><Select value={form.method} onValueChange={(value) => setForm((p) => ({ ...p, method: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Efectivo">Efectivo</SelectItem><SelectItem value="Transferencia">Transferencia</SelectItem><SelectItem value="Mercado Pago">Mercado Pago</SelectItem><SelectItem value="Tarjeta">Tarjeta</SelectItem><SelectItem value="Otro">Otro</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Estado</Label><Select value={form.status} onValueChange={(value) => setForm((p) => ({ ...p, status: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pagado">Pagado</SelectItem><SelectItem value="Pendiente">Pendiente</SelectItem></SelectContent></Select></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={submit}>Registrar pago</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddProfessionalDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (professional: (typeof demoProfessionals)[number]) => void;
}) {
  const [form, setForm] = useState({ name: "", specialty: "", role: "Profesional asignado", attention: "" });

  function submit() {
    if (!form.name.trim() || !form.specialty.trim()) {
      toast.error("Completá nombre y especialidad del profesional.");
      return;
    }
    onSave({ name: form.name.trim(), specialty: form.specialty.trim(), role: form.role, attention: form.attention.trim() || "Atención del paciente" });
    toast.success("Profesional agregado en pantalla.");
    setForm({ name: "", specialty: "", role: "Profesional asignado", attention: "" });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Adicionar profesional</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Nombre del profesional *</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Dra. Laura Fernández" /></div>
          <div className="space-y-1.5"><Label>Especialidad *</Label><Input value={form.specialty} onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))} placeholder="Odontología general" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Rol</Label><Input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="Profesional principal" /></div>
            <div className="space-y-1.5"><Label>Atención / tratamiento</Label><Input value={form.attention} onChange={(e) => setForm((p) => ({ ...p, attention: e.target.value }))} placeholder="Controles y seguimiento" /></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={submit}>Adicionar profesional</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function UploadStudyDialog({
  open,
  onOpenChange,
  onUpload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (study: (typeof demoStudies)[number]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [study, setStudy] = useState("");
  const [date, setDate] = useState("");
  const [professional, setProfessional] = useState(
    demoProfessionals[0]?.name ?? "",
  );
  const [result, setResult] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function reset() {
    setStudy("");
    setDate("");
    setProfessional(demoProfessionals[0]?.name ?? "");
    setResult("");
    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function submit() {
    if (!study.trim()) {
      toast.error("Ingresá el nombre del estudio.");
      return;
    }

    if (!file) {
      toast.error("Seleccioná el archivo del estudio.");
      return;
    }

    onUpload({
      date: date || new Date().toLocaleDateString("es-AR"),
      study: study.trim(),
      professional,
      result: result.trim() || "Estudio cargado. Resultado pendiente.",
      file: file.name,
    });

    toast.success(
      "Estudio cargado correctamente en la vista del paciente.",
    );

    reset();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) reset();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Cargar estudio</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tipo / nombre del estudio *</Label>
              <Input
                value={study}
                onChange={(e) => setStudy(e.target.value)}
                placeholder="Radiografía panorámica"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Profesional</Label>
              <Select
                value={professional}
                onValueChange={setProfessional}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {demoProfessionals.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Resultado / observaciones</Label>
            <Textarea
              rows={4}
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Ingresá el resultado o las observaciones del estudio..."
            />
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <button
            type="button"
            className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/25 bg-primary/5 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/10"
            onClick={() => inputRef.current?.click()}
          >
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <FileUp className="size-6 text-primary" />
            </div>

            <p className="font-semibold">
              {file ? file.name : "Seleccionar archivo del estudio"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, WEBP o PDF · El archivo queda disponible en
              frontend en esta versión.
            </p>
          </button>

          {file ? (
            <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="size-5 shrink-0 text-primary" />
                <span className="truncate text-sm font-medium">
                  {file.name}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Quitar archivo"
                onClick={() => {
                  setFile(null);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : null}

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Importante:</strong>{" "}
              esta carga funciona visualmente en el frontend. El
              almacenamiento permanente del archivo se conectará
              posteriormente al backend.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button className="gap-2" onClick={submit} disabled={!file}>
            <Upload className="size-4" />
            Cargar estudio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PatientDetail({
  patient,
  onEditPatient,
}: {
  patient: Patient;
  onEditPatient: (patient: Patient) => void;
}) {
  const [section, setSection] = useState("resumen");
  const [historyEntries, setHistoryEntries] = useState(demoHistory);
  const [treatments, setTreatments] = useState(demoTreatments);
  const [budgets, setBudgets] = useState(demoBudgets);
  const [appointments, setAppointments] = useState(demoAppointments);
  const [payments, setPayments] = useState(demoPayments);
  const [professionals, setProfessionals] = useState(demoProfessionals);
  const [studies, setStudies] = useState(demoStudies);

  const [addTreatmentOpen, setAddTreatmentOpen] = useState(false);
  const [newEvolutionOpen, setNewEvolutionOpen] = useState(false);
  const [newBudgetOpen, setNewBudgetOpen] = useState(false);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [registerPaymentOpen, setRegisterPaymentOpen] = useState(false);
  const [addProfessionalOpen, setAddProfessionalOpen] = useState(false);
  const [uploadStudyOpen, setUploadStudyOpen] = useState(false);

  const [documents, setDocuments] =
    useState<PatientDocument[]>(demoDocuments);

  const [uploadDocumentOpen, setUploadDocumentOpen] =
    useState(false);

  const [previewDocument, setPreviewDocument] =
    useState<PatientDocument | null>(null);

  const [odontogramOpen, setOdontogramOpen] =
    useState(false);

  const [teeth, setTeeth] =
    useState<Tooth[]>(createInitialTeeth);

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

  function deleteDocument(id: string) {
    const document = documents.find((doc) => doc.id === id);

    if (!document) return;

    if (
      !window.confirm(
        `¿Eliminar el documento "${document.name}"?`,
      )
    ) {
      return;
    }

    setDocuments((prev) =>
      prev.filter((doc) => doc.id !== id),
    );

    toast.success("Documento eliminado de la vista.");
  }

  function openDocument(document: PatientDocument) {
    if (!document.file) {
      toast.info(
        "Este documento es un registro demo y todavía no tiene un archivo real asociado.",
      );
      return;
    }

    if (document.file.type.startsWith("image/")) {
      setPreviewDocument(document);
      return;
    }

    const url = URL.createObjectURL(document.file);
    window.open(url, "_blank", "noopener,noreferrer");

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60_000);
  }

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
                <Badge variant="secondary">
                  Paciente activo
                </Badge>

                <Badge variant="outline">
                  {patient.insurance}
                </Badge>

                <Badge variant="outline">
                  {patient.branch}
                </Badge>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onEditPatient(patient)}
          >
            <Pencil className="size-4" />
            Editar paciente
          </Button>
        </div>
      </CardHeader>

      <div className="grid lg:grid-cols-[230px_1fr]">
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

        <div className="min-w-0 p-5 lg:p-6">
          {section === "resumen" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold">
                  Resumen del paciente
                </h3>

                <p className="text-sm text-muted-foreground">
                  Información general y estado actual de{" "}
                  {patient.firstName}.
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
                  valueClassName="min-w-0 break-all text-xs font-medium sm:text-sm"
                />

                <InfoCard
                  label="Obra social"
                  value={patient.insurance}
                />

                <InfoCard
                  label="Afiliado"
                  value={
                    patient.insuranceNumber ||
                    "No informado"
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
                      <strong>
                        Restauración estética
                      </strong>
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
                      <strong>
                        28/08/2026 · 15:00
                      </strong>
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
                    <strong>Teléfono:</strong>{" "}
                    {patient.phone}
                  </p>

                  <p className="min-w-0 break-all text-sm">
                    <strong>Email:</strong>{" "}
                    {patient.email}
                  </p>

                  <p>
                    <strong>Dirección:</strong>{" "}
                    {patient.address}
                  </p>

                  <p>
                    <strong>Sucursal:</strong>{" "}
                    {patient.branch}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {section === "historia" && (
            <DetailSection
              icon={History}
              title="Historia clínica"
              description="Registro cronológico de las consultas, diagnósticos, procedimientos y profesionales que atendieron al paciente."
              action="Nueva evolución"
              onAction={() => setNewEvolutionOpen(true)}
            >
              <div className="space-y-4">
                {historyEntries.map((item) => (
                  <Card
                    key={`${item.date}-${item.title}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <div>
                          <p className="font-semibold">
                            {item.title}
                          </p>

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
                        <strong>
                          {item.professional}
                        </strong>{" "}
                        · {item.specialty}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DetailSection>
          )}

          {section === "tratamientos" && (
            <DetailSection
              icon={Stethoscope}
              title="Tratamientos"
              description="Tratamientos realizados, en curso y pendientes, incluyendo pieza dental, profesional, estado y valor."
              action="Agregar tratamiento"
              onAction={() => setAddTreatmentOpen(true)}
            >
              <div className="space-y-3">
                {treatments.map((item) => (
                  <Card key={item.treatment}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold">
                            {item.treatment}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {item.tooth} ·{" "}
                            {item.professional}
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

          {section === "odontograma" && (
            <DetailSection
              icon={Activity}
              title="Odontograma"
              description="Estado dental del paciente y registro de tratamientos por pieza."
              action="Editar odontograma"
              onAction={() => setOdontogramOpen(true)}
            >
              <div className="space-y-5">
                <Card>
                  <CardContent className="p-5">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">
                          Odontograma actual
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Seleccioná “Editar odontograma” para
                          modificar las piezas.
                        </p>
                      </div>

                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                          setOdontogramOpen(true)
                        }
                      >
                        <Pencil className="size-4" />
                        Editar
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
                      {teeth.map((tooth) => (
                        <button
                          key={tooth.number}
                          type="button"
                          onClick={() => {
                            setOdontogramOpen(true);
                          }}
                          className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-[11px] font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${
                            tooth.state === "Sano"
                              ? "border-border bg-background"
                              : tooth.state === "Caries"
                                ? "border-destructive/40 bg-destructive/10 text-destructive"
                                : tooth.state ===
                                    "Restauración"
                                  ? "border-primary/40 bg-primary/10 text-primary"
                                  : tooth.state ===
                                      "Implante"
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                                    : tooth.state ===
                                        "Ausente"
                                      ? "border-muted-foreground/30 bg-muted text-muted-foreground line-through"
                                      : "border-blue-500/40 bg-blue-500/10 text-blue-700"
                          }`}
                        >
                          <span>{tooth.number}</span>

                          {tooth.state !== "Sano" && (
                            <span className="mt-0.5 max-w-full truncate px-0.5 text-[7px] font-normal">
                              {tooth.state}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Observaciones registradas
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      {teeth
                        .filter(
                          (tooth) =>
                            tooth.state !== "Sano" ||
                            tooth.observation,
                        )
                        .map((tooth) => (
                          <div
                            key={tooth.number}
                            className="flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="text-sm font-semibold">
                                Pieza {tooth.number}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {tooth.observation ||
                                  "Sin observación adicional."}
                              </p>
                            </div>

                            <Badge variant="outline">
                              {tooth.state}
                            </Badge>
                          </div>
                        ))}

                      {teeth.every(
                        (tooth) =>
                          tooth.state === "Sano" &&
                          !tooth.observation,
                      ) && (
                        <p className="text-sm text-muted-foreground">
                          No hay observaciones registradas.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DetailSection>
          )}

          {section === "documentos" && (
            <DetailSection
              icon={FolderOpen}
              title="Documentos"
              description="Documentación administrativa, consentimientos, estudios y archivos relacionados con el paciente."
              action="Subir documento"
              onAction={() =>
                setUploadDocumentOpen(true)
              }
            >
              <div className="space-y-3">
                {documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          {doc.file?.type.startsWith(
                            "image/",
                          ) ? (
                            <ImagePlus className="size-5 text-primary" />
                          ) : (
                            <FileText className="size-5 text-primary" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {doc.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {doc.type} · {doc.date}
                          </p>

                          {doc.file && (
                            <p className="mt-1 text-[11px] text-primary">
                              Archivo real seleccionado ·{" "}
                              {(doc.file.size / 1024).toFixed(
                                1,
                              )}{" "}
                              KB
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="secondary">
                          {doc.status}
                        </Badge>

                        {doc.file && (
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Ver documento"
                            onClick={() =>
                              openDocument(doc)
                            }
                          >
                            <Eye className="size-4" />
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Eliminar documento"
                          onClick={() =>
                            deleteDocument(doc.id)
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
                <div className="flex gap-3">
                  <Upload className="mt-0.5 size-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-semibold">
                      Documentación del paciente
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Podés cargar DNI, comprobantes, consentimientos,
                      presupuestos, estudios y otros archivos. En esta
                      versión el archivo se mantiene en memoria del
                      frontend; posteriormente se conectará con el
                      almacenamiento permanente del sistema.
                    </p>
                  </div>
                </div>
              </div>
            </DetailSection>
          )}

          {section === "estudios" && (
            <DetailSection
              icon={FileText}
              title="Estudios y diagnósticos"
              description="Radiografías, imágenes, diagnósticos y resultados asociados al paciente."
              action="Cargar estudio"
              onAction={() => setUploadStudyOpen(true)}
            >
              <div className="space-y-4">
                {studies.map((study) => (
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
                            {study.date} ·{" "}
                            {study.professional}
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

          {section === "presupuestos" && (
            <DetailSection
              icon={Receipt}
              title="Presupuestos"
              description="Presupuestos realizados, descuentos de obra social, importe del paciente y estado."
              action="Nuevo presupuesto"
              onAction={() => setNewBudgetOpen(true)}
            >
              <div className="space-y-3">
                {budgets.map((budget) => (
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
                            Total:{" "}
                            <strong>
                              {budget.total}
                            </strong>
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Cobertura/descuento:{" "}
                            {budget.insuranceDiscount}
                          </p>

                          <p className="text-sm font-semibold text-primary">
                            Paciente:{" "}
                            {budget.patientTotal}
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

          {section === "turnos" && (
            <DetailSection
              icon={CalendarDays}
              title="Turnos del paciente"
              description="Historial de turnos, asistencia, cancelaciones, confirmaciones y próximos turnos."
              action="Nuevo turno"
              onAction={() => setNewAppointmentOpen(true)}
            >
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <Card
                    key={`${appointment.date}-${appointment.time}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold">
                            {appointment.date} ·{" "}
                            {appointment.time}
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

          {section === "cuenta" && (
            <DetailSection
              icon={Wallet}
              title="Cuenta corriente"
              description="Pagos, saldos, deudas, medios de pago y movimientos financieros del paciente."
              action="Registrar pago"
              onAction={() => setRegisterPaymentOpen(true)}
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
                {payments.map((payment) => (
                  <Card
                    key={
                      payment.date +
                      payment.description
                    }
                  >
                    <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">
                          {payment.description}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {payment.date} ·{" "}
                          {payment.method}
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

          {section === "profesionales" && (
            <DetailSection
              icon={HeartPulse}
              title="Profesionales"
              description="Profesionales que atendieron al paciente, especialidad y relación con sus tratamientos."
              action="Adicionar profesional"
              onAction={() => setAddProfessionalOpen(true)}
            >
              <div className="space-y-3">
                {professionals.map((professional) => (
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

      <NewEvolutionDialog
        open={newEvolutionOpen}
        onOpenChange={setNewEvolutionOpen}
        onSave={(evolution) => setHistoryEntries((prev) => [evolution, ...prev])}
      />

      <NewBudgetDialog
        open={newBudgetOpen}
        onOpenChange={setNewBudgetOpen}
        onSave={(budget) => setBudgets((prev) => [budget, ...prev])}
      />

      <NewAppointmentDialog
        open={newAppointmentOpen}
        onOpenChange={setNewAppointmentOpen}
        onSave={(appointment) => setAppointments((prev) => [appointment, ...prev])}
      />

      <RegisterPaymentDialog
        open={registerPaymentOpen}
        onOpenChange={setRegisterPaymentOpen}
        onSave={(payment) => setPayments((prev) => [payment, ...prev])}
      />

      <AddProfessionalDialog
        open={addProfessionalOpen}
        onOpenChange={setAddProfessionalOpen}
        onSave={(professional) => setProfessionals((prev) => [professional, ...prev])}
      />

      <AddTreatmentDialog
        open={addTreatmentOpen}
        onOpenChange={setAddTreatmentOpen}
        onAdd={(treatment) =>
          setTreatments((prev) => [
            treatment,
            ...prev,
          ])
        }
      />

      <UploadDocumentDialog
        open={uploadDocumentOpen}
        onOpenChange={setUploadDocumentOpen}
        onUpload={(document) =>
          setDocuments((prev) => [
            document,
            ...prev,
          ])
        }
      />

      <OdontogramDialog
        open={odontogramOpen}
        onOpenChange={setOdontogramOpen}
        teeth={teeth}
        onSave={setTeeth}
      />

      <UploadStudyDialog
        open={uploadStudyOpen}
        onOpenChange={setUploadStudyOpen}
        onUpload={(study) =>
          setStudies((prev) => [study, ...prev])
        }
      />

      <Dialog
        open={Boolean(previewDocument)}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewDocument(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {previewDocument?.name}
            </DialogTitle>
          </DialogHeader>

          {previewDocument?.previewUrl ? (
            <div className="flex max-h-[70vh] items-center justify-center overflow-hidden rounded-xl border bg-muted/20 p-3">
              <img
                src={previewDocument.previewUrl}
                alt={previewDocument.name}
                className="max-h-[65vh] max-w-full object-contain"
              />
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setPreviewDocument(null)
              }
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function DetailSection({
  icon: Icon,
  title,
  description,
  action,
  onAction,
  children,
}: {
  icon: typeof History;
  title: string;
  description: string;
  action: string;
  onAction?: () => void;
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
            <h3 className="text-lg font-semibold">
              {title}
            </h3>

            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          className="gap-1.5"
          onClick={
            onAction ??
            (() =>
              toast.info(
                `${action}: disponible próximamente en esta sección.`,
              ))
          }
        >
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
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p
          className={`mt-1 font-semibold ${
            valueClassName ?? ""
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([
    demoPatient,
  ]);

  const [query, setQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] =
    useState<string | null>(null);

  const [status, setStatus] = useState("todos");
  const [branch, setBranch] = useState("todas");

  const [editingPatient, setEditingPatient] =
    useState<Patient | null>(null);

  const [editDialogOpen, setEditDialogOpen] =
    useState(false);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const search = query.toLowerCase().trim();

      const matchesSearch =
        !search ||
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(search) ||
        patient.document
          .toLowerCase()
          .includes(search) ||
        patient.phone
          .toLowerCase()
          .includes(search);

      const matchesBranch =
        branch === "todas" ||
        patient.branch ===
          branches.find(
            (b) => b.id === branch,
          )?.name;

      const matchesStatus =
        status === "todos" ||
        status === "activo";

      return (
        matchesSearch &&
        matchesBranch &&
        matchesStatus
      );
    });
  }, [patients, query, branch, status]);

  const selectedPatient = patients.find(
    (patient) =>
      patient.id === selectedPatientId,
  );

  function createPatient(patient: Patient) {
    setPatients((prev) => [
      patient,
      ...prev,
    ]);

    setSelectedPatientId(patient.id);
  }

  function openEditPatient(patient: Patient) {
    setEditingPatient(patient);
    setEditDialogOpen(true);
  }

  function updatePatient(updated: Patient) {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === updated.id
          ? updated
          : p,
      ),
    );
  }

  function deletePatient(id: string) {
    const patient = patients.find(
      (p) => p.id === id,
    );

    if (!patient) return;

    if (
      !window.confirm(
        `¿Eliminar al paciente ${patient.firstName} ${patient.lastName}?`,
      )
    ) {
      return;
    }

    setPatients((prev) =>
      prev.filter((p) => p.id !== id),
    );

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
                toast.info(
                  "Exportación de pacientes preparada.",
                )
              }
            >
              <Download className="size-4" />
              Exportar
            </Button>

            <NewPatientDialog
              onCreate={createPatient}
            />
          </>
        }
      />

      <Card className={`${cardStyle} mb-5`}>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Buscar por nombre, documento o teléfono"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
            />
          </div>

          <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todos">
                Todos los estados
              </SelectItem>

              <SelectItem value="activo">
                Activo
              </SelectItem>

              <SelectItem value="inactivo">
                Inactivo
              </SelectItem>

              <SelectItem value="lead">
                Lead
              </SelectItem>

              <SelectItem value="pendiente">
                Tratamiento pendiente
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={branch}
            onValueChange={setBranch}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {branches.map((b) => (
                <SelectItem
                  key={b.id}
                  value={b.id}
                >
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filteredPatients.length === 0 ? (
        <Card className={cardStyle}>
          <CardContent className="p-6">
            <EmptyState
              icon={Users}
              title="No se encontraron pacientes"
              description="Probá cambiar los filtros o crear un nuevo paciente."
              action={
                <NewPatientDialog
                  onCreate={createPatient}
                />
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPatients.map((patient) => {
            const selected =
              selectedPatientId ===
              patient.id;

            return (
              <Card
                key={patient.id}
                className={`${cardStyle} ${
                  selected
                    ? "border-primary shadow-lift"
                    : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {patient.firstName}{" "}
                          {patient.lastName}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          DNI{" "}
                          {patient.document}
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

                    <div className="grid gap-2 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Teléfono
                        </p>

                        <p>
                          {patient.phone ||
                            "Sin teléfono"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Obra social
                        </p>

                        <p>
                          {patient.insurance}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Sucursal
                        </p>

                        <p>
                          {patient.branch}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant={
                          selected
                            ? "default"
                            : "outline"
                        }
                        className="gap-2"
                        onClick={() =>
                          setSelectedPatientId(
                            selected
                              ? null
                              : patient.id,
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
                          openEditPatient(
                            patient,
                          )
                        }
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Eliminar paciente"
                        onClick={() =>
                          deletePatient(
                            patient.id,
                          )
                        }
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

      {selectedPatient ? (
        <PatientDetail
          patient={selectedPatient}
          onEditPatient={openEditPatient}
        />
      ) : null}

      <EditPatientDialog
        patient={editingPatient}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={updatePatient}
      />
    </>
  );
}