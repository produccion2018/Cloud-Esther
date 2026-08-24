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
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { Odontogram3D } from "@/components/app/Odontogram3D";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const evolutions = [
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

const treatments = [
  {
    tooth: "16",
    treatment: "Endodoncia",
    professional: "Dr. Carlos Rodríguez",
    status: "Pendiente",
    date: "—",
    price: "$180.000",
  },
  {
    tooth: "26",
    treatment: "Restauración estética",
    professional: "Dra. María González",
    status: "Realizado",
    date: "12/08/2026",
    price: "$85.000",
  },
  {
    tooth: "11",
    treatment: "Blanqueamiento",
    professional: "Dra. María González",
    status: "Planificado",
    date: "—",
    price: "$120.000",
  },
];

const studies = [
  {
    name: "Radiografía panorámica",
    date: "21/08/2026",
    professional: "Dra. María González",
    result: "Solicitada",
    type: "Imagen diagnóstica",
  },
  {
    name: "Radiografía periapical pieza 16",
    date: "14/08/2026",
    professional: "Dr. Carlos Rodríguez",
    result: "Compromiso pulpar probable",
    type: "Imagen diagnóstica",
  },
];

const prescriptions = [
  {
    date: "21/08/2026",
    professional: "Dra. María González",
    medication: "Ibuprofeno 600 mg",
    indication: "1 comprimido cada 8 horas durante 3 días.",
    status: "Activa",
  },
];

const budgets = [
  {
    number: "PRES-00042",
    date: "21/08/2026",
    description: "Tratamiento endodóntico pieza 16",
    total: "$180.000",
    insuranceCoverage: "$72.000",
    patientAmount: "$108.000",
    status: "Pendiente de aprobación",
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
  },
  {
    action: "Carga de estudio diagnóstico",
    user: "María López",
    role: "Secretaria",
    date: "21/08/2026",
    time: "10:41",
    device: "PC-Recepción-01",
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
        strokeDasharray={status === "ausente" ? "2.5 2" : undefined}
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
}: {
  number: number;
  status: ToothStatus;
}) {
  return (
    <button
      type="button"
      title={`Pieza ${number} · ${TOOTH_STATUS_LABELS[status]}`}
      onClick={() =>
        toast.info(
          `Pieza ${number}: ${TOOTH_STATUS_LABELS[status]}`,
        )
      }
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
}: {
  statusByTooth: Partial<Record<number, ToothStatus>>;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-center gap-1 overflow-x-auto rounded-2xl bg-primary-soft/40 px-4 py-3">
        {UPPER_TEETH.map((n) => (
          <ToothCell
            key={n}
            number={n}
            status={statusByTooth[n] ?? "sano"}
          />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-1 overflow-x-auto rounded-2xl bg-primary-soft/40 px-4 py-3">
        {LOWER_TEETH.map((n) => (
          <ToothCell
            key={n}
            number={n}
            status={statusByTooth[n] ?? "sano"}
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

function PatientSummary() {
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
        </div>
      </CardContent>
    </Card>
  );
}

function ClinicaPage() {
  const [query, setQuery] = useState("Mauro Pinto");
  const [selectedPatient, setSelectedPatient] = useState(true);

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
              onClick={() =>
                toast.info("Registro de auditoría")
              }
            >
              <ShieldCheck className="size-4" />
              Auditoría
            </Button>

            <Button
              className="gap-2"
              onClick={() =>
                toast.info("Nueva evolución clínica")
              }
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
                  e.target.value.toLowerCase().includes("mauro"),
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
            <EmptyClinicalState />
          </CardContent>
        </Card>
      ) : (
        <PatientSummary />
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

          {/* ================= ODONTOGRAMA ================= */}

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
                      Arrastrá para girar · rueda del mouse para hacer zoom
                    </p>

                    <Odontogram3D
                      statusByTooth={statusByTooth}
                    />

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
                          • Pieza 16: diagnóstico de caries profunda.
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

          {/* ================= HISTORIA CLÍNICA ================= */}

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
                    onClick={() =>
                      toast.info("Formulario de nueva evolución")
                    }
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
                            {item.professional} · {item.specialty}
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

          {/* ================= TRATAMIENTOS ================= */}

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
                  onClick={() =>
                    toast.info("Nuevo tratamiento")
                  }
                >
                  <Plus className="size-3.5" />
                  Agregar tratamiento
                </Button>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-3">Pieza</th>
                        <th className="pb-3">Tratamiento</th>
                        <th className="pb-3">Profesional</th>
                        <th className="pb-3">Fecha</th>
                        <th className="pb-3">Estado</th>
                        <th className="pb-3">Importe</th>
                      </tr>
                    </thead>

                    <tbody>
                      {treatments.map((item) => (
                        <tr
                          key={`${item.tooth}-${item.treatment}`}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= ESTUDIOS ================= */}

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
                  onClick={() =>
                    toast.info("Nuevo estudio diagnóstico")
                  }
                >
                  <Plus className="size-3.5" />
                  Agregar estudio
                </Button>
              </CardHeader>

              <CardContent className="space-y-3">
                {studies.map((study) => (
                  <div
                    key={study.name}
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

                    <Badge variant="secondary">
                      {study.result}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= RECETAS ================= */}

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
                  onClick={() =>
                    toast.info("Nueva receta")
                  }
                >
                  <Plus className="size-3.5" />
                  Nueva receta
                </Button>
              </CardHeader>

              <CardContent className="space-y-3">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.medication}
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

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() =>
                        toast.info("Vista previa de receta")
                      }
                    >
                      Ver / imprimir receta
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= PRESUPUESTOS ================= */}

          <TabsContent value="presupuestos" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wallet className="size-4 text-primary" />
                  Presupuestos relacionados con la atención
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {budgets.map((budget) => (
                  <div
                    key={budget.number}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">
                          {budget.number}
                        </p>

                        <p className="text-sm">
                          {budget.description}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Fecha: {budget.date}
                        </p>
                      </div>

                      <Badge variant="secondary">
                        {budget.status}
                      </Badge>
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

          {/* ================= AUDITORÍA ================= */}

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
                    registrar usuario, rol, fecha, hora y dispositivo.
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
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : null}
    </>
  );
}

function EmptyClinicalState() {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary-soft">
        <Smile className="size-6 text-primary" />
      </div>

      <p className="mt-4 font-semibold">
        Seleccioná un paciente
      </p>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Buscá un paciente por nombre, DNI o teléfono para acceder
        a su ficha clínica.
      </p>

      <Button
        className="mt-5 gap-1.5"
        onClick={() =>
          toast.info("Formulario de alta de paciente")
        }
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