import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Check,
  FileImage,
  GitCompare,
  Images,
  Link2,
  Maximize2,
  MessageSquare,
  Ruler,
  Search,
  Stethoscope,
  UploadCloud,
  User,
  X,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/app/estudios-diagnostico")({
  component: EstudiosDiagnosticoPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

type Study = {
  id: number;
  type: string;
  title: string;
  date: string;
  professional: string;
  description: string;
  status: string;
};

type MedicalAnnotation = {
  id: number;
  studyId: number;
  studyTitle: string;
  measurement: string;
  observation: string;
  professional: string;
  date: string;
};

const demoStudies: Study[] = [
  {
    id: 1,
    type: "Panorámica",
    title: "Radiografía panorámica",
    date: "21/08/2026",
    professional: "Dra. Laura Gómez",
    description: "Control general y evaluación de piezas dentarias.",
    status: "Informado",
  },
  {
    id: 2,
    type: "Periapical",
    title: "Radiografía periapical pieza 36",
    date: "19/08/2026",
    professional: "Dr. Martín Rodríguez",
    description: "Evaluación de raíz y tejidos periapicales.",
    status: "Informado",
  },
  {
    id: 3,
    type: "Fotografía clínica",
    title: "Fotografía intraoral",
    date: "19/08/2026",
    professional: "Dr. Martín Rodríguez",
    description: "Registro clínico inicial.",
    status: "Sin informar",
  },
  {
    id: 4,
    type: "CBCT / 3D",
    title: "Tomografía CBCT maxilar",
    date: "15/08/2026",
    professional: "Dra. Laura Gómez",
    description: "Estudio 3D para planificación de implante.",
    status: "Informado",
  },
];

function StudyPlaceholder({
  type,
  title,
}: {
  type: string;
  title: string;
}) {
  return (
    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 via-muted to-primary/5">
      <div className="absolute inset-0 opacity-30">
        <div className="grid h-full w-full grid-cols-8 grid-rows-6">
          {Array.from({ length: 48 }).map((_, index) => (
            <div
              key={index}
              className="border border-primary/10"
            />
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-2 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileImage className="size-7" />
        </div>

        <p className="text-sm font-semibold">{type}</p>

        <p className="px-4 text-xs text-muted-foreground">
          {title}
        </p>
      </div>

      <div className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium backdrop-blur">
        Imagen demo
      </div>
    </div>
  );
}

function StudyViewer({
  study,
  onClose,
}: {
  study: Study;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(100);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [annotation, setAnnotation] = useState("");

  return (
    <Dialog open={!!study} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-5 sm:p-6">
        <DialogHeader className="pr-10">
          <DialogTitle className="flex items-center gap-2">
            <FileImage className="size-5 text-primary" />
            {study.title}
          </DialogTitle>

          <DialogDescription>
            {study.type} · {study.date} · realizado por{" "}
            {study.professional}
          </DialogDescription>
        </DialogHeader>

        {/* CIERRE VISIBLE DEL VISOR */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 z-20 rounded-full"
          onClick={onClose}
          aria-label="Cerrar visor"
          title="Cerrar"
        >
          <X className="size-5" />
        </Button>

        <div className="grid gap-4 lg:grid-cols-[1fr_270px]">
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
            <div
              className="relative flex aspect-[4/3] w-full max-w-xl items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 transition-transform duration-300"
              style={{
                transform: `scale(${zoom / 100})`,
              }}
            >
              <div className="absolute inset-8 rounded-full border border-slate-400/30" />

              <div className="absolute inset-16 rounded-full border border-slate-400/20" />

              <div className="text-center">
                <FileImage className="mx-auto size-14 text-slate-500/50" />

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  Visor de {study.type}
                </p>

                <p className="text-xs text-slate-500">
                  Área preparada para imagen real / DICOM / CBCT
                </p>
              </div>

              {showMeasurements ? (
                <>
                  <div className="absolute left-[25%] top-[35%] h-px w-[45%] bg-primary" />

                  <div className="absolute left-[25%] top-[35%] size-2 rounded-full bg-primary" />

                  <div className="absolute right-[30%] top-[35%] size-2 rounded-full bg-primary" />

                  <span className="absolute left-1/2 top-[31%] -translate-x-1/2 rounded bg-primary px-2 py-1 text-[10px] text-white">
                    12.4 mm
                  </span>
                </>
              ) : null}
            </div>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background/90 p-1 shadow-lg backdrop-blur">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setZoom((v) => Math.max(50, v - 10))
                }
              >
                −
              </Button>

              <span className="min-w-14 text-center text-xs font-medium">
                {zoom}%
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setZoom((v) => Math.min(180, v + 10))
                }
              >
                +
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(100)}
                title="Restablecer zoom"
              >
                <Maximize2 className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                title="Cerrar"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Información del estudio
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Paciente
                  </p>

                  <p className="font-medium">Mauro Pinto</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Profesional
                  </p>

                  <p className="font-medium">
                    {study.professional}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Fecha
                  </p>

                  <p className="font-medium">{study.date}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Estado
                  </p>

                  <Badge variant="secondary">
                    {study.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Herramientas
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() =>
                    setZoom((v) => Math.min(180, v + 20))
                  }
                >
                  <ZoomIn className="size-4" />
                  Ampliar imagen
                </Button>

                <Button
                  variant={
                    showMeasurements ? "default" : "outline"
                  }
                  className="w-full justify-start gap-2"
                  onClick={() =>
                    setShowMeasurements((v) => !v)
                  }
                >
                  <Ruler className="size-4" />
                  {showMeasurements
                    ? "Ocultar medición"
                    : "Medir sobre imagen"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() =>
                    toast.info(
                      "Comparador de estudios preparado.",
                    )
                  }
                >
                  <GitCompare className="size-4" />
                  Comparar con otro estudio
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-1.5">
              <Label>Anotación del profesional</Label>

              <Textarea
                value={annotation}
                onChange={(e) =>
                  setAnnotation(e.target.value)
                }
                placeholder="Agregar observación sobre la imagen..."
                rows={3}
              />

              <Button
                size="sm"
                className="mt-2 gap-2"
                disabled={!annotation.trim()}
                onClick={() => {
                  toast.success("Anotación guardada.");
                  setAnnotation("");
                }}
              >
                <Check className="size-4" />
                Guardar anotación
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UploadStudyDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [type, setType] = useState("Panorámica");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Subir estudio</DialogTitle>

          <DialogDescription>
            Cargá un estudio y vinculalo al paciente correspondiente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Paciente</Label>

            <Select defaultValue="mauro">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="mauro">
                  Mauro Pinto
                </SelectItem>

                <SelectItem value="ana">
                  Ana Martínez
                </SelectItem>

                <SelectItem value="juan">
                  Juan González
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Tipo de estudio</Label>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Panorámica">
                  Radiografía panorámica
                </SelectItem>

                <SelectItem value="Periapical">
                  Radiografía periapical
                </SelectItem>

                <SelectItem value="Cefalométrica">
                  Cefalometría
                </SelectItem>

                <SelectItem value="CBCT / 3D">
                  CBCT / Tomografía 3D
                </SelectItem>

                <SelectItem value="Fotografía clínica">
                  Fotografía clínica
                </SelectItem>

                <SelectItem value="Escaneo intraoral">
                  Escaneo intraoral
                </SelectItem>

                <SelectItem value="Otro">
                  Otro
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Fecha del estudio</Label>

            <Input
              type="date"
              defaultValue="2026-08-21"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Profesional solicitante</Label>

            <Select defaultValue="laura">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="laura">
                  Dra. Laura Gómez
                </SelectItem>

                <SelectItem value="martin">
                  Dr. Martín Rodríguez
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-dashed border-primary/40 bg-primary-soft/30 p-6 text-center">
            <UploadCloud className="mx-auto size-8 text-primary" />

            <p className="mt-2 text-sm font-semibold">
              Arrastrá el archivo acá
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, PDF, DICOM u otros formatos de estudio
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                toast.info(
                  "Selector de archivos preparado.",
                )
              }
            >
              Seleccionar archivo
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label>Observaciones</Label>

            <Textarea
              placeholder="Observaciones o indicaciones del estudio..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>

          <Button
            onClick={() => {
              setOpen(false);

              toast.success(
                "Estudio cargado y vinculado a Mauro Pinto.",
              );
            }}
          >
            Guardar estudio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EstudiosDiagnosticoPage() {
  const [query, setQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] =
    useState<Study | null>(null);
  const [selectedType, setSelectedType] = useState("Todos");

  const [selectedAnnotationStudy, setSelectedAnnotationStudy] =
    useState("1");

  const [measurement, setMeasurement] =
    useState("12.4 mm");

  const [observation, setObservation] = useState(
    "Se observa zona compatible con el diagnóstico registrado. Requiere seguimiento.",
  );

  const [savedAnnotations, setSavedAnnotations] =
    useState<MedicalAnnotation[]>([
      {
        id: 1,
        studyId: 1,
        studyTitle: "Radiografía panorámica",
        measurement: "12.4 mm",
        observation:
          "Se observa zona compatible con el diagnóstico registrado. Requiere seguimiento.",
        professional: "Dra. Laura Gómez",
        date: "21/08/2026",
      },
    ]);

  const filteredStudies = demoStudies.filter((study) => {
    const matchesType =
      selectedType === "Todos" ||
      study.type === selectedType;

    const matchesQuery =
      !query ||
      "Mauro Pinto"
        .toLowerCase()
        .includes(query.toLowerCase());

    return matchesType && matchesQuery;
  });

  const selectedAnnotationStudyData =
    demoStudies.find(
      (study) =>
        String(study.id) === selectedAnnotationStudy,
    );

  const saveMedicalAnnotation = () => {
    if (!selectedAnnotationStudyData) {
      toast.error("Seleccioná un estudio.");
      return;
    }

    if (!measurement.trim() && !observation.trim()) {
      toast.error(
        "Ingresá una medición u observación clínica.",
      );
      return;
    }

    const newAnnotation: MedicalAnnotation = {
      id: Date.now(),
      studyId: selectedAnnotationStudyData.id,
      studyTitle: selectedAnnotationStudyData.title,
      measurement: measurement.trim() || "Sin medición",
      observation:
        observation.trim() || "Sin observación registrada",
      professional: selectedAnnotationStudyData.professional,
      date: "24/08/2026",
    };

    setSavedAnnotations((current) => [
      newAnnotation,
      ...current,
    ]);

    toast.success(
      "Anotación médica y medición guardadas.",
    );
  };

  return (
    <>
      <PageHeader
        title="Estudios y diagnóstico por imagen"
        description="Radiografías, fotografías clínicas, CBCT, estudios 3D y documentación diagnóstica vinculados a cada paciente."
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() =>
                toast.info(
                  "Seleccioná un estudio para vincularlo a un plan.",
                )
              }
            >
              <Link2 className="size-4" />
              Vincular a plan
            </Button>

            <Button
              className="gap-2"
              onClick={() => setUploadOpen(true)}
            >
              <UploadCloud className="size-4" />
              Subir estudio
            </Button>
          </>
        }
      />

      <Card className={`${cardStyle} mb-5`}>
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[1fr_220px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Buscar paciente por nombre o documento"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);

                setSelectedPatient(
                  e.target.value
                    .toLowerCase()
                    .includes("mauro") ||
                    e.target.value === "",
                );
              }}
            />
          </div>

          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de estudio" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Todos">
                Todos los estudios
              </SelectItem>

              <SelectItem value="Panorámica">
                Panorámicas
              </SelectItem>

              <SelectItem value="Periapical">
                Periapicales
              </SelectItem>

              <SelectItem value="CBCT / 3D">
                CBCT / 3D
              </SelectItem>

              <SelectItem value="Fotografía clínica">
                Fotografías clínicas
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setSelectedType("Todos");
              setSelectedPatient(true);
            }}
          >
            Limpiar filtros
          </Button>
        </CardContent>
      </Card>

      {selectedPatient ? (
        <Card className={`${cardStyle} mb-5`}>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="size-7" />
              </div>

              <div>
                <p className="text-lg font-bold">
                  Mauro Pinto
                </p>

                <p className="text-sm text-muted-foreground">
                  DNI 95-222-94 · Paciente activo
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {demoStudies.length} estudios
                  </Badge>

                  <Badge variant="secondary">
                    CBCT disponible
                  </Badge>

                  <Badge variant="secondary">
                    Diagnóstico activo
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  toast.info(
                    "Abriendo historia clínica de Mauro Pinto.",
                  )
                }
              >
                <Stethoscope className="size-4" />
                Historia clínica
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  toast.info(
                    "Abriendo odontograma de Mauro Pinto.",
                  )
                }
              >
                <Images className="size-4" />
                Odontograma
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className={`${cardStyle} mb-5`}>
          <CardContent className="p-6">
            <EmptyState
              icon={Images}
              title="Seleccioná un paciente"
              description="Buscá un paciente para consultar sus radiografías, fotografías, estudios 3D y diagnósticos."
            />
          </CardContent>
        </Card>
      )}

      {selectedPatient ? (
        <Tabs defaultValue="galeria">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="galeria">
              <Images className="mr-1.5 size-4" />
              Galería
            </TabsTrigger>

            <TabsTrigger value="comparar">
              <GitCompare className="mr-1.5 size-4" />
              Comparar visitas
            </TabsTrigger>

            <TabsTrigger value="anotaciones">
              <Ruler className="mr-1.5 size-4" />
              Anotaciones y mediciones
            </TabsTrigger>

            <TabsTrigger value="plan">
              <Link2 className="mr-1.5 size-4" />
              Plan de tratamiento
            </TabsTrigger>

            <TabsTrigger value="diagnostico">
              <Stethoscope className="mr-1.5 size-4" />
              Diagnóstico
            </TabsTrigger>
          </TabsList>

          {/* GALERÍA */}
          <TabsContent value="galeria" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Estudios de Mauro Pinto
                  </CardTitle>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Imágenes y estudios ordenados cronológicamente.
                  </p>
                </div>

                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => setUploadOpen(true)}
                >
                  <UploadCloud className="size-4" />
                  Subir estudio
                </Button>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {filteredStudies.map((study) => (
                    <Card
                      key={study.id}
                      className="overflow-hidden border-border transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <StudyPlaceholder
                        type={study.type}
                        title={study.title}
                      />

                      <CardContent className="space-y-3 p-4">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold">
                              {study.title}
                            </p>

                            <Badge
                              variant={
                                study.status === "Informado"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="shrink-0 text-[10px]"
                            >
                              {study.status}
                            </Badge>
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {study.date}
                          </p>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <p>
                            Profesional:{" "}
                            {study.professional}
                          </p>

                          <p className="mt-1">
                            {study.description}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 gap-1.5"
                            onClick={() =>
                              setSelectedStudy(study)
                            }
                          >
                            <Maximize2 className="size-3.5" />
                            Ver estudio
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              toast.success(
                                "Estudio vinculado al plan de tratamiento.",
                              )
                            }
                          >
                            <Link2 className="size-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPARAR */}
          <TabsContent value="comparar" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-base">
                  Comparación de evolución
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  Compará estudios de distintas fechas para evaluar
                  la evolución del paciente.
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Estudio inicial</Label>

                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {demoStudies.map((study) => (
                          <SelectItem
                            key={study.id}
                            value={String(study.id)}
                          >
                            {study.date} · {study.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <StudyPlaceholder
                      type="Estudio inicial"
                      title="15/08/2026 · CBCT / Tomografía 3D"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estudio actual</Label>

                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {demoStudies.map((study) => (
                          <SelectItem
                            key={study.id}
                            value={String(study.id)}
                          >
                            {study.date} · {study.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <StudyPlaceholder
                      type="Estudio actual"
                      title="21/08/2026 · Radiografía panorámica"
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-xl border bg-muted/30 p-4">
                  <p className="text-sm font-semibold">
                    Comparación clínica
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Se detecta evolución entre ambos estudios. Esta
                    sección queda preparada para incorporar comparación
                    visual, mediciones y anotaciones clínicas.
                  </p>
                </div>

                <Button
                  className="mt-4 gap-2"
                  onClick={() =>
                    toast.success(
                      "Comparación de estudios generada.",
                    )
                  }
                >
                  <GitCompare className="size-4" />
                  Comparar estudios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANOTACIONES */}
          <TabsContent value="anotaciones" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Anotaciones y mediciones médicas
                    </CardTitle>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Registrá mediciones, observaciones y hallazgos
                      clínicos asociados a cada estudio.
                    </p>
                  </div>

                  <Badge variant="secondary">
                    {savedAnnotations.length} anotaciones
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                  {/* VISOR */}
                  <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-xl border bg-muted/40">
                    <div className="relative flex aspect-[4/3] w-full max-w-2xl items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
                      <FileImage className="size-16 text-slate-500/40" />

                      <div className="absolute left-[25%] top-[40%] h-px w-[40%] bg-primary" />

                      <div className="absolute left-[25%] top-[40%] size-2 rounded-full bg-primary" />

                      <div className="absolute right-[35%] top-[40%] size-2 rounded-full bg-primary" />

                      <span className="absolute left-1/2 top-[35%] rounded bg-primary px-2 py-1 text-xs text-white">
                        {measurement || "Sin medición"}
                      </span>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border bg-background/90 px-3 py-1.5 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
                        Vista de anotación médica
                      </div>
                    </div>
                  </div>

                  {/* FORMULARIO */}
                  <div className="space-y-4">
                    <div>
                      <Label>Estudio</Label>

                      <Select
                        value={selectedAnnotationStudy}
                        onValueChange={(value) => {
                          setSelectedAnnotationStudy(value);

                          const existing =
                            savedAnnotations.find(
                              (item) =>
                                String(item.studyId) === value,
                            );

                          if (existing) {
                            setMeasurement(
                              existing.measurement ===
                                "Sin medición"
                                ? ""
                                : existing.measurement,
                            );

                            setObservation(
                              existing.observation ===
                                "Sin observación registrada"
                                ? ""
                                : existing.observation,
                            );
                          } else {
                            setMeasurement("");
                            setObservation("");
                          }
                        }}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {demoStudies.map((study) => (
                            <SelectItem
                              key={study.id}
                              value={String(study.id)}
                            >
                              {study.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Tipo de medición</Label>

                      <Select defaultValue="lineal">
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="lineal">
                            Medición lineal
                          </SelectItem>

                          <SelectItem value="angular">
                            Medición angular
                          </SelectItem>

                          <SelectItem value="distancia">
                            Distancia
                          </SelectItem>

                          <SelectItem value="otro">
                            Otra medición
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Medición</Label>

                      <Input
                        className="mt-1.5"
                        placeholder="Ej. 12.4 mm"
                        value={measurement}
                        onChange={(e) =>
                          setMeasurement(e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Observación clínica</Label>

                      <Textarea
                        className="mt-1.5"
                        rows={6}
                        value={observation}
                        onChange={(e) =>
                          setObservation(e.target.value)
                        }
                        placeholder="Describí el hallazgo, zona observada, diagnóstico presuntivo, seguimiento recomendado..."
                      />
                    </div>

                    <div className="rounded-xl bg-primary-soft/40 p-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="mt-0.5 size-4 shrink-0 text-primary" />

                        <div>
                          <p className="text-xs font-semibold">
                            Registro clínico
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            La anotación queda preparada para asociarse
                            al estudio, profesional y fecha cuando se
                            conecte el backend.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        className="flex-1 gap-2"
                        onClick={saveMedicalAnnotation}
                      >
                        <Check className="size-4" />
                        Guardar anotación médica
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setMeasurement("");
                          setObservation("");
                        }}
                      >
                        Limpiar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* HISTORIAL DE ANOTACIONES */}
                <div className="space-y-3 border-t border-border pt-5">
                  <div>
                    <h3 className="text-sm font-semibold">
                      Anotaciones registradas
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Historial de mediciones y observaciones clínicas
                      asociadas a los estudios.
                    </p>
                  </div>

                  {savedAnnotations.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-6 text-center">
                      <Ruler className="mx-auto size-6 text-muted-foreground" />

                      <p className="mt-2 text-sm font-medium">
                        No hay anotaciones registradas
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Seleccioná un estudio y registrá la primera
                        anotación médica.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 lg:grid-cols-2">
                      {savedAnnotations.map((annotation) => (
                        <div
                          key={annotation.id}
                          className="rounded-xl border border-border bg-background/70 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">
                                {annotation.studyTitle}
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {annotation.date} ·{" "}
                                {annotation.professional}
                              </p>
                            </div>

                            <Badge variant="secondary">
                              {annotation.measurement}
                            </Badge>
                          </div>

                          <div className="mt-3 rounded-lg bg-muted/50 p-3">
                            <p className="text-xs font-semibold">
                              Observación clínica
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {annotation.observation}
                            </p>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAnnotationStudy(
                                  String(annotation.studyId),
                                );

                                setMeasurement(
                                  annotation.measurement ===
                                    "Sin medición"
                                    ? ""
                                    : annotation.measurement,
                                );

                                setObservation(
                                  annotation.observation ===
                                    "Sin observación registrada"
                                    ? ""
                                    : annotation.observation,
                                );

                                toast.info(
                                  "Anotación cargada para edición.",
                                );
                              }}
                            >
                              Editar
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedStudy(
                                  demoStudies.find(
                                    (study) =>
                                      study.id ===
                                      annotation.studyId,
                                  ) ?? null,
                                );
                              }}
                            >
                              Ver estudio
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PLAN */}
          <TabsContent value="plan" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-base">
                  Estudios vinculados al tratamiento
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-xl border bg-background/70 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">
                        Implante pieza 36
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Plan de tratamiento · Presupuesto $850.000
                      </p>
                    </div>

                    <Badge variant="secondary">
                      En planificación
                    </Badge>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        Estudios vinculados
                      </p>

                      <p className="mt-1 font-semibold">2</p>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        Último estudio
                      </p>

                      <p className="mt-1 font-semibold">
                        21/08/2026
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        Profesional
                      </p>

                      <p className="mt-1 font-semibold">
                        Dra. Laura Gómez
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="gap-2"
                  onClick={() =>
                    toast.success(
                      "Estudio vinculado al tratamiento.",
                    )
                  }
                >
                  <Link2 className="size-4" />
                  Vincular estudio
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DIAGNÓSTICO */}
          <TabsContent value="diagnostico" className="mt-4">
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-base">
                  Diagnóstico registrado
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-xl border bg-background/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        Diagnóstico odontológico
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Lesión cariosa profunda en pieza 36 con
                        indicación de tratamiento.
                      </p>
                    </div>

                    <Badge>Activo</Badge>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Paciente
                      </p>

                      <p className="text-sm font-medium">
                        Mauro Pinto
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Pieza
                      </p>

                      <p className="text-sm font-medium">36</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Profesional
                      </p>

                      <p className="text-sm font-medium">
                        Dra. Laura Gómez
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-primary/5 p-3">
                    <p className="text-xs font-semibold text-primary">
                      Observación
                    </p>

                    <p className="mt-1 text-sm">
                      Se recomienda tratamiento y control radiográfico
                      posterior.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      toast.success(
                        "Diagnóstico actualizado.",
                      )
                    }
                  >
                    Editar diagnóstico
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.info(
                        "Diagnóstico vinculado a la historia clínica.",
                      )
                    }
                  >
                    Vincular a historia clínica
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : null}

      {selectedStudy ? (
        <StudyViewer
          study={selectedStudy}
          onClose={() => setSelectedStudy(null)}
        />
      ) : null}

      <UploadStudyDialog
        open={uploadOpen}
        setOpen={setUploadOpen}
      />
    </>
  );
}