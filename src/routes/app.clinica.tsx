import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ClipboardPlus,
  Clock,
  FileText,
  History,
  ImageIcon,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  Smile,
  Stethoscope,
  User,
  UserPlus,
  Wallet,
  XCircle,
  Edit3,
  Eye,
  Printer,
  Download,
  Save,
  Trash2,
  FilePlus2,
  Upload,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { Odontogram3D } from "@/components/app/Odontogram3D";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  TOOTH_STATUS_LABELS,
  UPPER_TEETH,
  LOWER_TEETH,
  type ToothStatus,
} from "@/lib/odontograma";

export const Route = createFileRoute("/app/clinica")({
  component: ClinicaPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

const patient = {
  id: "PAT-00001",
  name: "Mauro Pinto",
  document: "95.222.294",
  birthDate: "15/04/1989",
  phone: "+54 11 5555-8899",
  email: "mauro.pinto@example.com",
  insurance: "OSDE",
  affiliateNumber: "OSD-458921",
  professional: "Dra. María González",
  specialty: "Odontología general",
  status: "Activo",
};

const initialEvolutions = [
  {
    id: 1,
    date: "21/08/2026",
    time: "10:30",
    professional: "Dra. María González",
    specialty: "Odontología general",
    diagnosis: "Caries profunda en pieza 16.",
    evolution:
      "Paciente refiere sensibilidad al frío. Se realiza evaluación clínica y se solicita radiografía.",
    treatment: "Evaluación + indicación de estudio radiográfico.",
  },
  {
    id: 2,
    date: "14/08/2026",
    time: "09:15",
    professional: "Dr. Carlos Rodríguez",
    specialty: "Endodoncia",
    diagnosis: "Compromiso pulpar probable en pieza 16.",
    evolution:
      "Se evalúa estudio radiográfico y se recomienda tratamiento endodóntico.",
    treatment: "Derivación a Endodoncia.",
  },
];

const initialTreatments = [
  {
    id: "TRAT-001",
    tooth: "16",
    treatment: "Endodoncia",
    professional: "Dr. Carlos Rodríguez",
    status: "Pendiente",
    date: "—",
    price: "$180.000",
    observations: "Evaluar compromiso pulpar.",
  },
  {
    id: "TRAT-002",
    tooth: "26",
    treatment: "Restauración estética",
    professional: "Dra. María González",
    status: "Realizado",
    date: "12/08/2026",
    price: "$85.000",
    observations: "Restauración realizada correctamente.",
  },
  {
    id: "TRAT-003",
    tooth: "11",
    treatment: "Blanqueamiento",
    professional: "Dra. María González",
    status: "Planificado",
    date: "—",
    price: "$120.000",
    observations: "Pendiente de coordinación.",
  },
];

const initialStudies = [
  {
    id: "EST-001",
    name: "Radiografía panorámica",
    date: "21/08/2026",
    professional: "Dra. María González",
    result: "Solicitada",
    type: "Imagen diagnóstica",
    observations: "Pendiente de carga del estudio.",
  },
  {
    id: "EST-002",
    name: "Radiografía periapical pieza 16",
    date: "14/08/2026",
    professional: "Dr. Carlos Rodríguez",
    result: "Compromiso pulpar probable",
    type: "Imagen diagnóstica",
    observations: "Se observa posible compromiso pulpar.",
  },
];

const initialPrescriptions = [
  {
    id: "REC-0001",
    date: "21/08/2026",
    professional: "Dra. María González",
    medication: "Ibuprofeno 600 mg",
    indication: "1 comprimido cada 8 horas durante 3 días.",
    status: "Activa",
    diagnosis: "Dolor odontogénico.",
    route: "Vía oral",
    duration: "3 días",
    quantity: "9 comprimidos",
    observations: "Tomar después de las comidas.",
  },
];

const initialBudgets = [
  {
    number: "PRES-00042",
    date: "21/08/2026",
    description: "Tratamiento endodóntico pieza 16",
    total: "$180.000",
    insuranceCoverage: "$72.000",
    patientAmount: "$108.000",
    status: "Pendiente de aprobación",
    professional: "Dr. Carlos Rodríguez",
    validUntil: "21/09/2026",
    observations: "Presupuesto sujeto a evaluación clínica.",
    items: [
      {
        description: "Tratamiento endodóntico pieza 16",
        quantity: 1,
        price: "$180.000",
        subtotal: "$180.000",
      },
    ],
  },
];

const auditEvents = [
  {
    action: "Modificación de historia clínica",
    user: "Dra. María González",
    role: "Odontóloga",
    date: "21/08/2026",
    time: "10:32",
    device: "PC-Consultorio-02",
    detail:
      "Se modificó la evolución clínica correspondiente a la atención del paciente.",
  },
  {
    action: "Carga de estudio diagnóstico",
    user: "María López",
    role: "Secretaria",
    date: "21/08/2026",
    time: "10:41",
    device: "PC-Recepción-01",
    detail:
      "Se registró un nuevo estudio diagnóstico en la ficha clínica.",
  },
];

function ToothIcon({
  status,
}: {
  status: ToothStatus;
}) {
  const fill = {
    sano: "oklch(0.97 0.005 90)",
    caries: "oklch(0.97 0.005 90)",
    obturado: "oklch(0.97 0.005 90)",
    corona: "oklch(0.82 0.13 85)",
    implante: "oklch(0.9 0.005 90)",
    ausente: "oklch(0.94 0 0)",
  }[status];

  const stroke = {
    sano: "oklch(0.7 0.02 90)",
    caries: "oklch(0.7 0.02 90)",
    obturado: "oklch(0.7 0.02 90)",
    corona: "oklch(0.65 0.12 80)",
    implante: "oklch(0.55 0.01 90)",
    ausente: "oklch(0.75 0 0)",
  }[status];

  return (
    <svg viewBox="0 0 28 34" className="h-8 w-7">
      <path
        d="M5 3 Q14 -1 23 3 L23 15 Q23 27 14 33 Q5 27 5 15 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={1.4}
        strokeDasharray={
          status === "ausente" ? "2.5 2" : undefined
        }
        opacity={status === "ausente" ? 0.6 : 1}
      />

      {status === "caries" ? (
        <ellipse
          cx={14}
          cy={13}
          rx={4}
          ry={3.2}
          fill="oklch(0.4 0.16 25)"
        />
      ) : null}

      {status === "obturado" ? (
        <circle
          cx={14}
          cy={13}
          r={3.4}
          fill="oklch(0.6 0.15 260)"
        />
      ) : null}

      {status === "implante" ? (
        <rect
          x={11.5}
          y={16}
          width={5}
          height={12}
          rx={1}
          fill="oklch(0.6 0.01 90)"
        />
      ) : null}

      {status === "ausente" ? (
        <path
          d="M9 11 L19 25 M19 11 L9 25"
          stroke="oklch(0.6 0.18 25)"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

function ToothCell({
  number,
  status,
  onSelect,
}: {
  number: number;
  status: ToothStatus;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      title={`Pieza ${number} · ${TOOTH_STATUS_LABELS[status]}`}
      onClick={onSelect}
      className="flex shrink-0 flex-col items-center gap-0.5 rounded-lg p-1 transition-all hover:-translate-y-0.5 hover:bg-primary/10"
    >
      <span className="text-[10px] font-medium text-muted-foreground">
        {number}
      </span>

      <ToothIcon status={status} />
    </button>
  );
}

function FlatOdontogram({
  statusByTooth,
  onSelectTooth,
}: {
  statusByTooth: Partial<Record<number, ToothStatus>>;
  onSelectTooth: (tooth: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-center gap-1 overflow-x-auto rounded-2xl bg-primary-soft/40 px-4 py-3">
        {UPPER_TEETH.map((n) => (
          <ToothCell
            key={n}
            number={n}
            status={statusByTooth[n] ?? "sano"}
            onSelect={() => onSelectTooth(n)}
          />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-1 overflow-x-auto rounded-2xl bg-primary-soft/40 px-4 py-3">
        {LOWER_TEETH.map((n) => (
          <ToothCell
            key={n}
            number={n}
            status={statusByTooth[n] ?? "sano"}
            onSelect={() => onSelectTooth(n)}
          />
        ))}
      </div>

      <StatusLegend />
    </div>
  );
}

function StatusLegend() {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-4 border-t border-border pt-4">
      {(Object.keys(TOOTH_STATUS_LABELS) as ToothStatus[]).map(
        (s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className="h-5 w-4 shrink-0">
              <ToothIcon status={s} />
            </span>

            <span className="text-xs text-muted-foreground">
              {TOOTH_STATUS_LABELS[s]}
            </span>
          </div>
        ),
      )}
    </div>
  );
}

function PatientSummary({
  onEdit,
}: {
  onEdit: () => void;
}) {
  return (
    <Card className={`${cardStyle} mb-5`}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-primary-soft">
              <User className="size-8 text-primary" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">
                  {patient.name}
                </h2>

                <Badge variant="secondary">
                  {patient.status}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                DNI {patient.document} · {patient.birthDate}
              </p>

              <p className="text-sm text-muted-foreground">
                {patient.phone} · {patient.email}
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Obra social
              </p>
              <p className="font-semibold">{patient.insurance}</p>
              <p className="text-xs text-muted-foreground">
                Afiliado {patient.affiliateNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Profesional principal
              </p>
              <p className="font-semibold">
                {patient.professional}
              </p>
              <p className="text-xs text-muted-foreground">
                {patient.specialty}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Última atención
              </p>
              <p className="font-semibold">21/08/2026</p>
              <p className="text-xs text-muted-foreground">
                10:30 hs
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onEdit}
          >
            <Edit3 className="size-4" />
            Editar paciente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ClinicaPage() {
  const [query, setQuery] = useState("Mauro Pinto");
  const [selectedPatient, setSelectedPatient] = useState(true);

  const [evolutions, setEvolutions] =
    useState(initialEvolutions);
  const [treatments, setTreatments] =
    useState(initialTreatments);
  const [studies, setStudies] =
    useState(initialStudies);
  const [prescriptions, setPrescriptions] =
    useState(initialPrescriptions);
  const [budgets, setBudgets] =
    useState(initialBudgets);

  const [modal, setModal] = useState<
    | "evolution"
    | "treatment"
    | "study"
    | "prescription"
    | "budget"
    | "budget-detail"
    | "prescription-detail"
    | "tooth"
    | "audit"
    | "patient"
    | "treatment-detail"
    | "study-detail"
    | null
  >(null);

  const [selectedBudget, setSelectedBudget] =
    useState<(typeof initialBudgets)[number] | null>(null);

  const [selectedPrescription, setSelectedPrescription] =
    useState<(typeof initialPrescriptions)[number] | null>(
      null,
    );

  const [selectedTreatment, setSelectedTreatment] =
    useState<(typeof initialTreatments)[number] | null>(null);

  const [selectedStudy, setSelectedStudy] =
    useState<(typeof initialStudies)[number] | null>(null);

  const [selectedTooth, setSelectedTooth] =
    useState<number | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    if (
      query.toLowerCase().includes("mauro") ||
      query.toLowerCase().includes("pinto")
    ) {
      return [patient];
    }

    return [];
  }, [query]);

  const statusByTooth: Partial<Record<number, ToothStatus>> = {
    16: "caries",
    26: "obturado",
    11: "corona",
    36: "implante",
    38: "ausente",
  };

  function closeModal() {
    setModal(null);
  }

  function handleNewEvolution(data: {
    diagnosis: string;
    evolution: string;
    treatment: string;
    professional: string;
    specialty: string;
  }) {
    setEvolutions((current) => [
      {
        id: current.length + 1,
        date: "24/08/2026",
        time: "11:30",
        ...data,
      },
      ...current,
    ]);

    toast.success("Nueva evolución clínica registrada");
    closeModal();
  }

  function handleNewTreatment(data: {
    tooth: string;
    treatment: string;
    professional: string;
    status: string;
    price: string;
    observations: string;
  }) {
    setTreatments((current) => [
      {
        id: `TRAT-${String(current.length + 1).padStart(
          3,
          "0",
        )}`,
        ...data,
        date: data.status === "Realizado" ? "24/08/2026" : "—",
      },
      ...current,
    ]);

    toast.success("Tratamiento agregado");
    closeModal();
  }

  function handleNewStudy(data: {
    name: string;
    type: string;
    professional: string;
    result: string;
    observations: string;
  }) {
    setStudies((current) => [
      {
        id: `EST-${String(current.length + 1).padStart(
          3,
          "0",
        )}`,
        ...data,
        date: "24/08/2026",
      },
      ...current,
    ]);

    toast.success("Estudio registrado");
    closeModal();
  }

  function handleNewPrescription(data: {
    medication: string;
    indication: string;
    diagnosis: string;
    route: string;
    duration: string;
    quantity: string;
    observations: string;
  }) {
    setPrescriptions((current) => [
      {
        id: `REC-${String(current.length + 1).padStart(
          4,
          "0",
        )}`,
        date: "24/08/2026",
        professional: "Dra. María González",
        status: "Activa",
        ...data,
      },
      ...current,
    ]);

    toast.success("Receta creada correctamente");
    closeModal();
  }

  function handleNewBudget(data: {
    description: string;
    total: string;
    insuranceCoverage: string;
    patientAmount: string;
    professional: string;
    validUntil: string;
    observations: string;
  }) {
    const budget = {
      number: `PRES-${String(budgets.length + 42).padStart(
        5,
        "0",
      )}`,
      date: "24/08/2026",
      status: "Pendiente de aprobación",
      items: [
        {
          description: data.description,
          quantity: 1,
          price: data.total,
          subtotal: data.total,
        },
      ],
      ...data,
    };

    setBudgets((current) => [budget, ...current]);

    toast.success("Presupuesto creado");
    closeModal();
  }

  function approveBudget(
    budgetNumber: string,
    status: "Aprobado" | "Rechazado",
  ) {
    setBudgets((current) =>
      current.map((budget) =>
        budget.number === budgetNumber
          ? {
              ...budget,
              status,
            }
          : budget,
      ),
    );

    setSelectedBudget((current) =>
      current
        ? {
            ...current,
            status,
          }
        : null,
    );

    toast.success(
      status === "Aprobado"
        ? "Presupuesto aprobado"
        : "Presupuesto rechazado",
    );
  }

  return (
    <>
      <PageHeader
        title="Gestión clínica"
        description="Historia clínica, odontograma, tratamientos, estudios, recetas y evolución de cada paciente."
        badge="Ficha clínica"
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setModal("audit")}
            >
              <ShieldCheck className="size-4" />
              Auditoría
            </Button>

            <Button
              className="gap-2"
              onClick={() => setModal("evolution")}
            >
              <Plus className="size-4" />
              Nueva evolución
            </Button>
          </>
        }
      />

      <Card className={`${cardStyle} mb-5`}>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Buscar paciente por nombre, DNI o teléfono"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedPatient(
                  e.target.value
                    .toLowerCase()
                    .includes("mauro"),
                );
              }}
            />
          </div>

          {query && results.length > 0 ? (
            <div className="mt-3 rounded-xl border border-border bg-card p-3">
              <button
                type="button"
                onClick={() => setSelectedPatient(true)}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-primary-soft">
                  <User className="size-4 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {patient.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    DNI {patient.document} · {patient.phone}
                  </p>
                </div>
              </button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {!selectedPatient ? (
        <Card className={`${cardStyle} mb-5`}>
          <CardContent className="p-6">
            <EmptyClinicalState
              onNewPatient={() => setModal("patient")}
            />
          </CardContent>
        </Card>
      ) : (
        <PatientSummary
          onEdit={() => setModal("patient")}
        />
      )}

      {selectedPatient ? (
        <Tabs defaultValue="odontograma">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="odontograma">
              Odontograma
            </TabsTrigger>

            <TabsTrigger value="historia">
              Historia clínica
            </TabsTrigger>

            <TabsTrigger value="tratamientos">
              Tratamientos
            </TabsTrigger>

            <TabsTrigger value="estudios">
              Estudios
            </TabsTrigger>

            <TabsTrigger value="recetas">
              Recetas
            </TabsTrigger>

            <TabsTrigger value="presupuestos">
              Presupuestos
            </TabsTrigger>

            <TabsTrigger value="auditoria">
              Auditoría
            </TabsTrigger>
          </TabsList>

          <TabsContent value="odontograma" className="mt-4">
            <Tabs defaultValue="3d">
              <TabsList>
                <TabsTrigger value="3d">
                  Vista 3D
                </TabsTrigger>

                <TabsTrigger value="fdi">
                  Vista plana FDI
                </TabsTrigger>

                <TabsTrigger value="comparar">
                  Comparar evolución
                </TabsTrigger>
              </TabsList>

              <TabsContent value="3d" className="mt-4">
                <Card className={cardStyle}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Smile className="size-4 text-primary" />
                      Odontograma 3D — {patient.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6">
                    <p className="mb-4 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Arrastrá para girar · rueda del mouse para
                      hacer zoom
                    </p>

                    <Odontogram3D
                      statusByTooth={statusByTooth}
                    />

                    <div className="mt-4 flex justify-center">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          setSelectedTooth(16);
                          setModal("tooth");
                        }}
                      >
                        <Edit3 className="size-4" />
                        Gestionar pieza dental
                      </Button>
                    </div>

                    <StatusLegend />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fdi" className="mt-4">
                <Card className={cardStyle}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Odontograma FDI
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6">
                    <FlatOdontogram
                      statusByTooth={statusByTooth}
                      onSelectTooth={(tooth) => {
                        setSelectedTooth(tooth);
                        setModal("tooth");
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparar" className="mt-4">
                <Card className={cardStyle}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <History className="size-4 text-primary" />
                      Evolución del odontograma
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <EvolutionSnapshot
                        date="14/08/2026"
                        label="Primera evaluación"
                      />

                      <EvolutionSnapshot
                        date="21/08/2026"
                        label="Estado actual"
                      />
                    </div>

                    <div className="rounded-xl bg-primary-soft/40 p-4">
                      <p className="text-sm font-semibold">
                        Cambios detectados
                      </p>

                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>
                          • Pieza 16: diagnóstico de caries
                          profunda.
                        </li>

                        <li>
                          • Pieza 26: restauración registrada.
                        </li>

                        <li>
                          • Se solicitó radiografía periapical.
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="historia" className="mt-4">
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              <Card className={cardStyle}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ClipboardPlus className="size-4 text-primary" />
                    Historia clínica
                  </CardTitle>

                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setModal("evolution")}
                  >
                    <Plus className="size-3.5" />
                    Nueva evolución
                  </Button>
                </CardHeader>

                <CardContent className="space-y-5">
                  {evolutions.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold">
                            {item.date} · {item.time}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {item.professional} ·{" "}
                            {item.specialty}
                          </p>
                        </div>

                        <Badge variant="secondary">
                          Evolución #{item.id}
                        </Badge>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Diagnóstico
                          </p>

                          <p className="mt-1 text-sm">
                            {item.diagnosis}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Tratamiento / indicación
                          </p>

                          <p className="mt-1 text-sm">
                            {item.treatment}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-lg bg-muted/50 p-3">
                        <p className="text-xs font-semibold">
                          Evolución
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.evolution}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-5">
                <ClinicalInfoCard
                  title="Antecedentes"
                  icon={Activity}
                  items={[
                    "Sin alergias medicamentosas declaradas",
                    "Hipertensión: no declarada",
                    "Diabetes: no declarada",
                    "Cirugías previas: apendicectomía",
                  ]}
                />

                <ClinicalInfoCard
                  title="Profesionales"
                  icon={Stethoscope}
                  items={[
                    "Dra. María González — Odontología general",
                    "Dr. Carlos Rodríguez — Endodoncia",
                  ]}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tratamientos" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Stethoscope className="size-4 text-primary" />
                  Tratamientos de {patient.name}
                </CardTitle>

                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setModal("treatment")}
                >
                  <Plus className="size-3.5" />
                  Agregar tratamiento
                </Button>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-3">Pieza</th>
                        <th className="pb-3">Tratamiento</th>
                        <th className="pb-3">Profesional</th>
                        <th className="pb-3">Fecha</th>
                        <th className="pb-3">Estado</th>
                        <th className="pb-3">Importe</th>
                        <th className="pb-3 text-right">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {treatments.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b last:border-0"
                        >
                          <td className="py-3 font-semibold">
                            {item.tooth}
                          </td>

                          <td className="py-3">
                            {item.treatment}
                          </td>

                          <td className="py-3">
                            {item.professional}
                          </td>

                          <td className="py-3">
                            {item.date}
                          </td>

                          <td className="py-3">
                            <Badge
                              variant={
                                item.status === "Realizado"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item.status}
                            </Badge>
                          </td>

                          <td className="py-3 font-medium">
                            {item.price}
                          </td>

                          <td className="py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                              onClick={() => {
                                setSelectedTreatment(item);
                                setModal("treatment-detail");
                              }}
                            >
                              <Eye className="size-3.5" />
                              Ver
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estudios" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="size-4 text-primary" />
                  Estudios y diagnóstico
                </CardTitle>

                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setModal("study")}
                >
                  <Plus className="size-3.5" />
                  Agregar estudio
                </Button>
              </CardHeader>

              <CardContent className="space-y-3">
                {studies.map((study) => (
                  <div
                    key={study.id}
                    className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary-soft">
                        <ImageIcon className="size-5 text-primary" />
                      </div>

                      <div>
                        <p className="font-semibold">
                          {study.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {study.type} · {study.date}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Profesional: {study.professional}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {study.result}
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                          setSelectedStudy(study);
                          setModal("study-detail");
                        }}
                      >
                        <Eye className="size-3.5" />
                        Ver estudio
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recetas" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Pill className="size-4 text-primary" />
                  Recetas y prescripciones
                </CardTitle>

                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setModal("prescription")}
                >
                  <Plus className="size-3.5" />
                  Nueva receta
                </Button>
              </CardHeader>

              <CardContent className="space-y-3">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {prescription.medication}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {prescription.date} ·{" "}
                          {prescription.professional}
                        </p>
                      </div>

                      <Badge variant="secondary">
                        {prescription.status}
                      </Badge>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                      {prescription.indication}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                          setSelectedPrescription(
                            prescription,
                          );
                          setModal("prescription-detail");
                        }}
                      >
                        <Eye className="size-3.5" />
                        Ver receta
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() =>
                          toast.success(
                            "Preparando impresión de receta",
                          )
                        }
                      >
                        <Printer className="size-3.5" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presupuestos" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wallet className="size-4 text-primary" />
                  Presupuestos relacionados con la atención
                </CardTitle>

                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setModal("budget")}
                >
                  <Plus className="size-3.5" />
                  Nuevo presupuesto
                </Button>
              </CardHeader>

              <CardContent className="space-y-3">
                {budgets.map((budget) => (
                  <div
                    key={budget.number}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">
                            {budget.number}
                          </p>

                          <Badge variant="secondary">
                            {budget.status}
                          </Badge>
                        </div>

                        <p className="mt-1 text-sm">
                          {budget.description}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Fecha: {budget.date} · Profesional:{" "}
                          {budget.professional}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => {
                            setSelectedBudget(budget);
                            setModal("budget-detail");
                          }}
                        >
                          <Eye className="size-3.5" />
                          Ver presupuesto
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() =>
                            toast.info(
                              "Formulario de edición de presupuesto",
                            )
                          }
                        >
                          <Edit3 className="size-3.5" />
                          Editar
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() =>
                            toast.success(
                              "Preparando impresión del presupuesto",
                            )
                          }
                        >
                          <Printer className="size-3.5" />
                          Imprimir
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <InfoValue
                        label="Total"
                        value={budget.total}
                      />

                      <InfoValue
                        label="Cobertura obra social"
                        value={budget.insuranceCoverage}
                      />

                      <InfoValue
                        label="A cargo del paciente"
                        value={budget.patientAmount}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auditoria" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="size-4 text-primary" />
                  Registro de auditoría clínica
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="rounded-xl bg-primary-soft/40 p-4">
                  <p className="text-sm font-semibold">
                    Trazabilidad completa
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Cada modificación importante de la ficha debe
                    registrar usuario, rol, fecha, hora y
                    dispositivo.
                  </p>
                </div>

                {auditEvents.map((event, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-primary-soft">
                        <ShieldCheck className="size-4 text-primary" />
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold">
                          {event.action}
                        </p>

                        <p className="mt-1 text-sm">
                          {event.user}{" "}
                          <span className="text-muted-foreground">
                            · {event.role}
                          </span>
                        </p>

                        <p className="mt-2 text-xs text-muted-foreground">
                          {event.date} · {event.time} ·{" "}
                          {event.device}
                        </p>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 gap-1.5 px-0"
                          onClick={() => setModal("audit")}
                        >
                          <Eye className="size-3.5" />
                          Ver detalle
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : null}

      {modal === "evolution" ? (
        <EvolutionModal
          onClose={closeModal}
          onSave={handleNewEvolution}
        />
      ) : null}

      {modal === "treatment" ? (
        <TreatmentModal
          onClose={closeModal}
          onSave={handleNewTreatment}
        />
      ) : null}

      {modal === "study" ? (
        <StudyModal
          onClose={closeModal}
          onSave={handleNewStudy}
        />
      ) : null}

      {modal === "prescription" ? (
        <PrescriptionModal
          onClose={closeModal}
          onSave={handleNewPrescription}
        />
      ) : null}

      {modal === "budget" ? (
        <BudgetModal
          onClose={closeModal}
          onSave={handleNewBudget}
        />
      ) : null}

      {modal === "budget-detail" && selectedBudget ? (
        <BudgetDetailModal
          budget={selectedBudget}
          onClose={closeModal}
          onApprove={() =>
            approveBudget(selectedBudget.number, "Aprobado")
          }
          onReject={() =>
            approveBudget(selectedBudget.number, "Rechazado")
          }
        />
      ) : null}

      {modal === "prescription-detail" &&
      selectedPrescription ? (
        <PrescriptionDetailModal
          prescription={selectedPrescription}
          onClose={closeModal}
        />
      ) : null}

      {modal === "treatment-detail" && selectedTreatment ? (
        <TreatmentDetailModal
          treatment={selectedTreatment}
          onClose={closeModal}
        />
      ) : null}

      {modal === "study-detail" && selectedStudy ? (
        <StudyDetailModal
          study={selectedStudy}
          onClose={closeModal}
        />
      ) : null}

      {modal === "tooth" && selectedTooth ? (
        <ToothModal
          tooth={selectedTooth}
          status={statusByTooth[selectedTooth] ?? "sano"}
          onClose={closeModal}
        />
      ) : null}

      {modal === "audit" ? (
        <AuditModal onClose={closeModal} />
      ) : null}

      {modal === "patient" ? (
        <PatientModal onClose={closeModal} />
      ) : null}
    </>
  );
}

function ModalShell({
  title,
  description,
  icon: Icon,
  children,
  onClose,
  size = "max-w-2xl",
}: {
  title: string;
  description?: string;
  icon: typeof Activity;
  children: React.ReactNode;
  onClose: () => void;
  size?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[92vh] w-full ${size} overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
              <Icon className="size-5 text-primary" />
            </div>

            <div>
              <h2 className="text-lg font-bold">{title}</h2>

              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>

      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ModalActions({
  onClose,
  saveLabel = "Guardar",
}: {
  onClose: () => void;
  saveLabel?: string;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-border pt-4">
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>

      <Button type="submit" className="gap-2">
        <Save className="size-4" />
        {saveLabel}
      </Button>
    </div>
  );
}

function EvolutionModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: {
    diagnosis: string;
    evolution: string;
    treatment: string;
    professional: string;
    specialty: string;
  }) => void;
}) {
  const [diagnosis, setDiagnosis] = useState("");
  const [evolution, setEvolution] = useState("");
  const [treatment, setTreatment] = useState("");
  const [professional, setProfessional] =
    useState("Dra. María González");
  const [specialty, setSpecialty] =
    useState("Odontología general");

  return (
    <ModalShell
      title="Nueva evolución clínica"
      description="Registrá una nueva atención, diagnóstico, evolución e indicaciones del paciente."
      icon={ClipboardPlus}
      onClose={onClose}
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();

          if (!diagnosis || !evolution) {
            toast.error(
              "Completá al menos el diagnóstico y la evolución.",
            );
            return;
          }

          onSave({
            diagnosis,
            evolution,
            treatment,
            professional,
            specialty,
          });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Profesional"
            value={professional}
            onChange={setProfessional}
          />

          <Field
            label="Especialidad"
            value={specialty}
            onChange={setSpecialty}
          />
        </div>

        <Field
          label="Diagnóstico"
          value={diagnosis}
          onChange={setDiagnosis}
          placeholder="Ej. Caries profunda en pieza 16"
        />

        <TextareaField
          label="Evolución clínica"
          value={evolution}
          onChange={setEvolution}
          placeholder="Describí síntomas, hallazgos y evolución del paciente..."
        />

        <TextareaField
          label="Tratamiento / indicación"
          value={treatment}
          onChange={setTreatment}
          placeholder="Indicaciones, tratamiento realizado o recomendado..."
        />

        <div className="rounded-xl bg-primary-soft/40 p-4 text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="size-4 text-primary" />
            Trazabilidad
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            En la implementación real estos datos quedarán
            asociados al usuario, fecha, hora y dispositivo.
          </p>
        </div>

        <ModalActions onClose={onClose} saveLabel="Registrar evolución" />
      </form>
    </ModalShell>
  );
}

function TreatmentModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: {
    tooth: string;
    treatment: string;
    professional: string;
    status: string;
    price: string;
    observations: string;
  }) => void;
}) {
  const [tooth, setTooth] = useState("");
  const [treatment, setTreatment] = useState("");
  const [professional, setProfessional] =
    useState("Dra. María González");
  const [status, setStatus] = useState("Planificado");
  const [price, setPrice] = useState("");
  const [observations, setObservations] = useState("");

  return (
    <ModalShell
      title="Agregar tratamiento"
      description="Registrá el tratamiento odontológico asociado al paciente."
      icon={Stethoscope}
      onClose={onClose}
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();

          if (!treatment) {
            toast.error("Ingresá el tratamiento.");
            return;
          }

          onSave({
            tooth,
            treatment,
            professional,
            status,
            price,
            observations,
          });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Pieza dental"
            value={tooth}
            onChange={setTooth}
            placeholder="Ej. 16"
          />

          <SelectField
            label="Estado"
            value={status}
            onChange={setStatus}
            options={[
              "Planificado",
              "Pendiente",
              "En tratamiento",
              "Realizado",
              "Cancelado",
            ]}
          />
        </div>

        <Field
          label="Tratamiento"
          value={treatment}
          onChange={setTreatment}
          placeholder="Ej. Endodoncia"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Profesional"
            value={professional}
            onChange={setProfessional}
          />

          <Field
            label="Importe"
            value={price}
            onChange={setPrice}
            placeholder="$180.000"
          />
        </div>

        <TextareaField
          label="Observaciones"
          value={observations}
          onChange={setObservations}
        />

        <ModalActions
          onClose={onClose}
          saveLabel="Agregar tratamiento"
        />
      </form>
    </ModalShell>
  );
}

function StudyModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: {
    name: string;
    type: string;
    professional: string;
    result: string;
    observations: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] =
    useState("Imagen diagnóstica");
  const [professional, setProfessional] =
    useState("Dra. María González");
  const [result, setResult] = useState("Solicitada");
  const [observations, setObservations] = useState("");

  return (
    <ModalShell
      title="Agregar estudio diagnóstico"
      description="Registrá radiografías, fotografías, tomografías u otros estudios."
      icon={ImageIcon}
      onClose={onClose}
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();

          if (!name) {
            toast.error("Ingresá el nombre del estudio.");
            return;
          }

          onSave({
            name,
            type,
            professional,
            result,
            observations,
          });
        }}
      >
        <Field
          label="Nombre del estudio"
          value={name}
          onChange={setName}
          placeholder="Ej. Radiografía panorámica"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Tipo"
            value={type}
            onChange={setType}
            options={[
              "Imagen diagnóstica",
              "Radiografía",
              "Tomografía CBCT",
              "Fotografía clínica",
              "Laboratorio",
              "Otro",
            ]}
          />

          <SelectField
            label="Resultado / estado"
            value={result}
            onChange={setResult}
            options={[
              "Solicitada",
              "Pendiente",
              "Disponible",
              "Revisada",
            ]}
          />
        </div>

        <Field
          label="Profesional solicitante"
          value={professional}
          onChange={setProfessional}
        />

        <div className="rounded-xl border border-dashed border-primary/40 bg-primary-soft/30 p-5 text-center">
          <Upload className="mx-auto size-7 text-primary" />

          <p className="mt-2 text-sm font-semibold">
            Cargar archivo o imagen
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Interfaz preparada para integración de archivos.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 gap-2"
            onClick={() =>
              toast.info(
                "La carga real de archivos requiere almacenamiento/backend.",
              )
            }
          >
            <Upload className="size-3.5" />
            Seleccionar archivo
          </Button>
        </div>

        <TextareaField
          label="Observaciones / resultado"
          value={observations}
          onChange={setObservations}
        />

        <ModalActions
          onClose={onClose}
          saveLabel="Registrar estudio"
        />
      </form>
    </ModalShell>
  );
}

function PrescriptionModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: {
    medication: string;
    indication: string;
    diagnosis: string;
    route: string;
    duration: string;
    quantity: string;
    observations: string;
  }) => void;
}) {
  const [medication, setMedication] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [indication, setIndication] = useState("");
  const [route, setRoute] = useState("Vía oral");
  const [duration, setDuration] = useState("");
  const [quantity, setQuantity] = useState("");
  const [observations, setObservations] =
    useState("");

  return (
    <ModalShell
      title="Nueva receta"
      description="Completá los datos de la prescripción médica."
      icon={Pill}
      onClose={onClose}
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();

          if (!medication || !indication) {
            toast.error(
              "Completá el medicamento y la indicación.",
            );
            return;
          }

          onSave({
            medication,
            diagnosis,
            indication,
            route,
            duration,
            quantity,
            observations,
          });
        }}
      >
        <div className="rounded-xl bg-primary-soft/40 p-4">
          <p className="text-sm font-semibold">
            Paciente
          </p>

          <p className="mt-1 text-sm">
            {patient.name} · DNI {patient.document}
          </p>
        </div>

        <Field
          label="Medicamento"
          value={medication}
          onChange={setMedication}
          placeholder="Ej. Ibuprofeno 600 mg"
        />

        <Field
          label="Diagnóstico / motivo"
          value={diagnosis}
          onChange={setDiagnosis}
          placeholder="Motivo de la prescripción"
        />

        <TextareaField
          label="Indicación"
          value={indication}
          onChange={setIndication}
          placeholder="Ej. 1 comprimido cada 8 horas..."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            label="Vía"
            value={route}
            onChange={setRoute}
            options={[
              "Vía oral",
              "Vía tópica",
              "Vía sublingual",
              "Otra",
            ]}
          />

          <Field
            label="Duración"
            value={duration}
            onChange={setDuration}
            placeholder="3 días"
          />

          <Field
            label="Cantidad"
            value={quantity}
            onChange={setQuantity}
            placeholder="9 comprimidos"
          />
        </div>

        <TextareaField
          label="Observaciones"
          value={observations}
          onChange={setObservations}
          placeholder="Indicaciones adicionales..."
        />

        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
          <div className="flex gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-warning" />

            <p className="text-xs text-muted-foreground">
              La firma digital, validación profesional y
              emisión legal de la receta deberán integrarse
              posteriormente con el backend y los servicios
              correspondientes.
            </p>
          </div>
        </div>

        <ModalActions
          onClose={onClose}
          saveLabel="Crear receta"
        />
      </form>
    </ModalShell>
  );
}

function BudgetModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: {
    description: string;
    total: string;
    insuranceCoverage: string;
    patientAmount: string;
    professional: string;
    validUntil: string;
    observations: string;
  }) => void;
}) {
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState("");
  const [insuranceCoverage, setInsuranceCoverage] =
    useState("");
  const [patientAmount, setPatientAmount] =
    useState("");
  const [professional, setProfessional] =
    useState("Dra. María González");
  const [validUntil, setValidUntil] =
    useState("21/09/2026");
  const [observations, setObservations] =
    useState("");

  return (
    <ModalShell
      title="Nuevo presupuesto"
      description="Creá un presupuesto detallado para el tratamiento del paciente."
      icon={Wallet}
      onClose={onClose}
      size="max-w-3xl"
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();

          if (!description || !total) {
            toast.error(
              "Completá la descripción y el importe total.",
            );
            return;
          }

          onSave({
            description,
            total,
            insuranceCoverage,
            patientAmount,
            professional,
            validUntil,
            observations,
          });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Descripción"
            value={description}
            onChange={setDescription}
            placeholder="Ej. Tratamiento endodóntico pieza 16"
          />

          <Field
            label="Profesional"
            value={professional}
            onChange={setProfessional}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Total"
            value={total}
            onChange={setTotal}
            placeholder="$180.000"
          />

          <Field
            label="Cobertura obra social"
            value={insuranceCoverage}
            onChange={setInsuranceCoverage}
            placeholder="$72.000"
          />

          <Field
            label="A cargo del paciente"
            value={patientAmount}
            onChange={setPatientAmount}
            placeholder="$108.000"
          />
        </div>

        <Field
          label="Vigencia hasta"
          type="date"
          value={validUntil}
          onChange={setValidUntil}
        />

        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                Detalle del presupuesto
              </p>

              <p className="text-xs text-muted-foreground">
                Los ítems podrán ampliarse cuando exista
                integración con el módulo de tratamientos.
              </p>
            </div>

            <FilePlus2 className="size-5 text-primary" />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm">
            <span>
              {description || "Nuevo tratamiento"}
            </span>

            <span className="font-semibold">
              {total || "$0"}
            </span>
          </div>
        </div>

        <TextareaField
          label="Observaciones"
          value={observations}
          onChange={setObservations}
        />

        <ModalActions
          onClose={onClose}
          saveLabel="Crear presupuesto"
        />
      </form>
    </ModalShell>
  );
}

function BudgetDetailModal({
  budget,
  onClose,
  onApprove,
  onReject,
}: {
  budget: (typeof initialBudgets)[number];
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <ModalShell
      title={`Presupuesto ${budget.number}`}
      description="Detalle completo del presupuesto clínico."
      icon={Wallet}
      onClose={onClose}
      size="max-w-4xl"
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <InfoValue
            label="Estado"
            value={budget.status}
          />

          <InfoValue
            label="Fecha"
            value={budget.date}
          />

          <InfoValue
            label="Vigencia"
            value={budget.validUntil}
          />

          <InfoValue
            label="Profesional"
            value={budget.professional}
          />
        </div>

        <div className="rounded-xl border border-border">
          <div className="border-b border-border p-4">
            <p className="font-semibold">
              Detalle de tratamientos
            </p>
          </div>

          {budget.items.map((item, index) => (
            <div
              key={index}
              className="grid gap-3 border-b border-border p-4 last:border-0 sm:grid-cols-[1fr_80px_140px_140px]"
            >
              <div>
                <p className="font-medium">
                  {item.description}
                </p>
              </div>

              <p className="text-sm">
                x{item.quantity}
              </p>

              <p className="text-sm">{item.price}</p>

              <p className="font-semibold">
                {item.subtotal}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <InfoValue
            label="Total"
            value={budget.total}
          />

          <InfoValue
            label="Obra social"
            value={budget.insuranceCoverage}
          />

          <InfoValue
            label="Paciente"
            value={budget.patientAmount}
          />
        </div>

        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm font-semibold">
            Observaciones
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {budget.observations || "Sin observaciones."}
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() =>
                toast.success(
                  "Preparando PDF del presupuesto",
                )
              }
            >
              <Download className="size-4" />
              Descargar PDF
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() =>
                toast.success(
                  "Preparando impresión del presupuesto",
                )
              }
            >
              <Printer className="size-4" />
              Imprimir
            </Button>
          </div>

          {budget.status === "Pendiente de aprobación" ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={onReject}
              >
                <XCircle className="size-4" />
                Rechazar
              </Button>

              <Button
                className="gap-2"
                onClick={onApprove}
              >
                <CheckCircle2 className="size-4" />
                Aprobar presupuesto
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </ModalShell>
  );
}

function PrescriptionDetailModal({
  prescription,
  onClose,
}: {
  prescription: (typeof initialPrescriptions)[number];
  onClose: () => void;
}) {
  return (
    <ModalShell
      title="Vista de receta"
      description="Previsualización de la prescripción."
      icon={Pill}
      onClose={onClose}
      size="max-w-3xl"
    >
      <div className="rounded-xl border-2 border-primary/20 bg-background p-6">
        <div className="flex items-start justify-between border-b border-border pb-5">
          <div>
            <p className="text-lg font-bold">
              RECETA / PRESCRIPCIÓN
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Cloud Esther · Ficha clínica
            </p>
          </div>

          <Badge variant="secondary">
            {prescription.status}
          </Badge>
        </div>

        <div className="py-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Paciente
          </p>

          <p className="mt-1 font-semibold">
            {patient.name}
          </p>

          <p className="text-sm text-muted-foreground">
            DNI {patient.document}
          </p>
        </div>

        <div className="rounded-xl bg-primary-soft/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Medicamento
          </p>

          <p className="mt-1 text-lg font-bold">
            {prescription.medication}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <InfoValue
              label="Vía"
              value={prescription.route}
            />

            <InfoValue
              label="Duración"
              value={prescription.duration}
            />

            <InfoValue
              label="Cantidad"
              value={prescription.quantity}
            />
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Indicación
            </p>

            <p className="mt-1 text-sm">
              {prescription.indication}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <InfoValue
            label="Diagnóstico"
            value={prescription.diagnosis}
          />

          <InfoValue
            label="Profesional"
            value={prescription.professional}
          />
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <p className="text-xs text-muted-foreground">
            Observaciones
          </p>

          <p className="mt-1 text-sm">
            {prescription.observations ||
              "Sin observaciones."}
          </p>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              toast.success(
                "Preparando impresión de receta",
              )
            }
          >
            <Printer className="size-4" />
            Imprimir receta
          </Button>

          <Button
            className="gap-2"
            onClick={() =>
              toast.success(
                "Preparando descarga de receta",
              )
            }
          >
            <Download className="size-4" />
            Descargar
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function TreatmentDetailModal({
  treatment,
  onClose,
}: {
  treatment: (typeof initialTreatments)[number];
  onClose: () => void;
}) {
  return (
    <ModalShell
      title="Detalle del tratamiento"
      description={`Tratamiento asociado a la pieza ${treatment.tooth}.`}
      icon={Stethoscope}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoValue
            label="Pieza dental"
            value={treatment.tooth}
          />

          <InfoValue
            label="Estado"
            value={treatment.status}
          />

          <InfoValue
            label="Tratamiento"
            value={treatment.treatment}
          />

          <InfoValue
            label="Profesional"
            value={treatment.professional}
          />

          <InfoValue
            label="Fecha"
            value={treatment.date}
          />

          <InfoValue
            label="Importe"
            value={treatment.price}
          />
        </div>

        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm font-semibold">
            Observaciones
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {treatment.observations ||
              "Sin observaciones."}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              toast.info(
                "Formulario de edición de tratamiento",
              )
            }
          >
            <Edit3 className="size-4" />
            Editar tratamiento
          </Button>

          <Button
            className="gap-2"
            onClick={() =>
              toast.success(
                "Tratamiento marcado para continuar",
              )
            }
          >
            <ClipboardCheck className="size-4" />
            Actualizar estado
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function StudyDetailModal({
  study,
  onClose,
}: {
  study: (typeof initialStudies)[number];
  onClose: () => void;
}) {
  return (
    <ModalShell
      title="Detalle del estudio"
      description="Información diagnóstica asociada al paciente."
      icon={ImageIcon}
      onClose={onClose}
      size="max-w-3xl"
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoValue
            label="Estudio"
            value={study.name}
          />

          <InfoValue
            label="Tipo"
            value={study.type}
          />

          <InfoValue
            label="Fecha"
            value={study.date}
          />

          <InfoValue
            label="Estado / resultado"
            value={study.result}
          />

          <InfoValue
            label="Profesional"
            value={study.professional}
          />
        </div>

        <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary-soft/20">
          <div className="text-center">
            <ImageIcon className="mx-auto size-10 text-primary/60" />

            <p className="mt-3 font-semibold">
              Visor de estudio
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              El visor real de imágenes y archivos requiere
              almacenamiento e integración backend.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm font-semibold">
            Observaciones
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {study.observations}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              toast.info(
                "La descarga se habilitará con almacenamiento de archivos.",
              )
            }
          >
            <Download className="size-4" />
            Descargar estudio
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function ToothModal({
  tooth,
  status,
  onClose,
}: {
  tooth: number;
  status: ToothStatus;
  onClose: () => void;
}) {
  const [newStatus, setNewStatus] =
    useState<ToothStatus>(status);

  return (
    <ModalShell
      title={`Pieza dental ${tooth}`}
      description="Gestioná el estado, diagnóstico y observaciones de la pieza."
      icon={Smile}
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="flex flex-col items-center rounded-xl bg-primary-soft/30 p-6">
          <ToothIcon status={newStatus} />

          <p className="mt-2 text-lg font-bold">
            Pieza {tooth}
          </p>

          <p className="text-sm text-muted-foreground">
            {TOOTH_STATUS_LABELS[newStatus]}
          </p>
        </div>

        <SelectField
          label="Estado de la pieza"
          value={newStatus}
          onChange={(value) =>
            setNewStatus(value as ToothStatus)
          }
          options={
            Object.keys(
              TOOTH_STATUS_LABELS,
            ) as ToothStatus[]
          }
        />

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            className="justify-between"
            onClick={() => {
              onClose();
              toast.info(
                `Nuevo tratamiento para pieza ${tooth}`,
              );
            }}
          >
            <span className="flex items-center gap-2">
              <Stethoscope className="size-4" />
              Agregar tratamiento
            </span>

            <ChevronRight className="size-4" />
          </Button>

          <Button
            variant="outline"
            className="justify-between"
            onClick={() => {
              onClose();
              toast.info(
                `Nueva evolución para pieza ${tooth}`,
              );
            }}
          >
            <span className="flex items-center gap-2">
              <ClipboardPlus className="size-4" />
              Agregar evolución
            </span>

            <ChevronRight className="size-4" />
          </Button>
        </div>

        <TextareaField
          label="Observaciones"
          value=""
          onChange={() => undefined}
          placeholder={`Observaciones clínicas de la pieza ${tooth}...`}
        />

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            className="gap-2"
            onClick={() => {
              toast.success(
                `Pieza ${tooth} actualizada como ${TOOTH_STATUS_LABELS[newStatus]}`,
              );
              onClose();
            }}
          >
            <Save className="size-4" />
            Guardar pieza
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function AuditModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <ModalShell
      title="Auditoría clínica"
      description="Registro de trazabilidad de las acciones realizadas sobre la ficha."
      icon={ShieldCheck}
      onClose={onClose}
      size="max-w-3xl"
    >
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <InfoValue
            label="Eventos"
            value="2 registrados"
          />

          <InfoValue
            label="Usuario actual"
            value="Dra. María González"
          />

          <InfoValue
            label="Estado"
            value="Trazabilidad activa"
          />
        </div>

        {auditEvents.map((event, index) => (
          <div
            key={index}
            className="rounded-xl border border-border p-4"
          >
            <div className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                <ShieldCheck className="size-4 text-primary" />
              </div>

              <div className="flex-1">
                <p className="font-semibold">
                  {event.action}
                </p>

                <p className="mt-1 text-sm">
                  {event.user} · {event.role}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {event.date} · {event.time} ·{" "}
                  {event.device}
                </p>

                <div className="mt-3 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-semibold">
                    Detalle
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end border-t border-border pt-4">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              toast.success(
                "Exportación de auditoría preparada",
              )
            }
          >
            <Download className="size-4" />
            Exportar auditoría
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function PatientModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState(patient.name);
  const [document, setDocument] =
    useState(patient.document);
  const [birthDate, setBirthDate] =
    useState(patient.birthDate);
  const [phone, setPhone] = useState(patient.phone);
  const [email, setEmail] = useState(patient.email);
  const [insurance, setInsurance] =
    useState(patient.insurance);
  const [affiliate, setAffiliate] =
    useState(patient.affiliateNumber);

  return (
    <ModalShell
      title="Datos del paciente"
      description="Editá la información personal y administrativa de la ficha."
      icon={User}
      onClose={onClose}
      size="max-w-3xl"
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();

          toast.success(
            "Datos del paciente actualizados en la interfaz",
          );

          onClose();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nombre completo"
            value={name}
            onChange={setName}
          />

          <Field
            label="DNI"
            value={document}
            onChange={setDocument}
          />

          <Field
            label="Fecha de nacimiento"
            value={birthDate}
            onChange={setBirthDate}
          />

          <Field
            label="Teléfono"
            value={phone}
            onChange={setPhone}
          />

          <Field
            label="Correo electrónico"
            value={email}
            onChange={setEmail}
          />

          <Field
            label="Obra social"
            value={insurance}
            onChange={setInsurance}
          />

          <Field
            label="Número de afiliado"
            value={affiliate}
            onChange={setAffiliate}
          />
        </div>

        <div className="rounded-xl bg-primary-soft/40 p-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />

            <p className="text-sm font-semibold">
              Información administrativa
            </p>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            En la versión conectada estos datos se
            sincronizarán con el módulo de pacientes.
          </p>
        </div>

        <ModalActions
          onClose={onClose}
          saveLabel="Guardar cambios"
        />
      </form>
    </ModalShell>
  );
}

function EmptyClinicalState({
  onNewPatient,
}: {
  onNewPatient: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary-soft">
        <Smile className="size-6 text-primary" />
      </div>

      <p className="mt-4 font-semibold">
        Seleccioná un paciente
      </p>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Buscá un paciente por nombre, DNI o teléfono para
        acceder a su ficha clínica.
      </p>

      <Button
        className="mt-5 gap-1.5"
        onClick={onNewPatient}
      >
        <UserPlus className="size-4" />
        Nuevo paciente
      </Button>
    </div>
  );
}

function ClinicalInfoCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof Activity;
  items: string[];
}) {
  return (
    <Card className={cardStyle}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-lg bg-muted/50 p-3 text-sm"
          >
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InfoValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function EvolutionSnapshot({
  date,
  label,
}: {
  date: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{label}</p>

          <p className="text-xs text-muted-foreground">
            {date}
          </p>
        </div>

        <CheckCircle2 className="size-5 text-primary" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-lg font-bold">1</p>

          <p className="text-[10px] text-muted-foreground">
            Caries
          </p>
        </div>

        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-lg font-bold">1</p>

          <p className="text-[10px] text-muted-foreground">
            Obturadas
          </p>
        </div>

        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-lg font-bold">1</p>

          <p className="text-[10px] text-muted-foreground">
            Ausentes
          </p>
        </div>
      </div>
    </div>
  );
}