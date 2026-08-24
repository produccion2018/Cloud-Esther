import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  FileCheck2,
  FileText,
  History,
  LockKeyhole,
  Receipt,
  RefreshCw,
  UserCircle2,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState, StatCard } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/portal-paciente")({
  component: PortalPacientePage,
});

// Estilo original conservado.
const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

type DialogType =
  | "turno"
  | "historial"
  | "comprobante"
  | "documento"
  | "seguridad"
  | "nuevo-turno"
  | null;

const demoAppointments = [
  {
    id: "t1",
    date: "Jueves 27 de agosto",
    time: "10:30",
    treatment: "Control de ortodoncia",
    dentist: "Dra. Lucía Ferrer",
    branch: "Clínica Centro",
    status: "Confirmado",
  },
  {
    id: "t2",
    date: "Martes 11 de agosto",
    time: "09:15",
    treatment: "Ajuste de aparatología",
    dentist: "Dra. Lucía Ferrer",
    branch: "Clínica Centro",
    status: "Atendido",
  },
  {
    id: "t3",
    date: "Lunes 20 de julio",
    time: "11:00",
    treatment: "Control clínico",
    dentist: "Dra. Lucía Ferrer",
    branch: "Clínica Centro",
    status: "Atendido",
  },
];

const demoHistory = [
  {
    date: "11 ago 2026",
    treatment: "Control de ortodoncia",
    detail: "Revisión de evolución y ajuste de aparatología.",
    dentist: "Dra. Lucía Ferrer",
    status: "Realizado",
  },
  {
    date: "04 ago 2026",
    treatment: "Ajuste de aparatología",
    detail: "Ajuste del arco y control de higiene oral.",
    dentist: "Dra. Lucía Ferrer",
    status: "Realizado",
  },
  {
    date: "20 jul 2026",
    treatment: "Control clínico",
    detail: "Evaluación general y seguimiento del plan de tratamiento.",
    dentist: "Dra. Lucía Ferrer",
    status: "Realizado",
  },
];

const demoReceipts = [
  {
    id: "F-2026-0481",
    date: "09/08/2026",
    amount: "$128.000",
    status: "Pendiente",
  },
  {
    id: "F-2026-0479",
    date: "01/08/2026",
    amount: "$21.000",
    status: "Pagada",
  },
  {
    id: "F-2026-0468",
    date: "15/07/2026",
    amount: "$18.500",
    status: "Pagada",
  },
];

const demoDocuments = [
  {
    id: "doc-1",
    name: "Consentimiento informado — Ortodoncia",
    type: "Consentimiento",
    date: "11/08/2026",
    status: "Firmado",
  },
  {
    id: "doc-2",
    name: "Plan de tratamiento",
    type: "Plan clínico",
    date: "04/08/2026",
    status: "Firmado",
  },
  {
    id: "doc-3",
    name: "Indicaciones posteriores al tratamiento",
    type: "Indicaciones",
    date: "11/08/2026",
    status: "Disponible",
  },
];

function PortalPacientePage() {
  const [portalActive, setPortalActive] = useState(true);
  const [dialog, setDialog] = useState<DialogType>(null);
  const [selectedAppointment, setSelectedAppointment] = useState(
    demoAppointments[0],
  );

  async function copyPortalLink() {
    const link = "https://portal.cloudesther.com/clinica-centro";

    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link del portal copiado.");
    } catch {
      toast.info(`Link del portal: ${link}`);
    }
  }

  function openAppointment(appointment = demoAppointments[0]) {
    setSelectedAppointment(appointment);
    setDialog("turno");
  }

  function confirmAppointment() {
    toast.success("Turno confirmado como ejemplo.");
    setDialog(null);
  }

  function requestReschedule() {
    setDialog("nuevo-turno");
  }

  function downloadDemo(name: string) {
    toast.success(`Descarga de "${name}" iniciada como ejemplo.`);
  }

  return (
    <>
      <PageHeader
        title="Portal del paciente"
        description="Un acceso propio para que cada paciente vea sus turnos, historial y comprobantes, sin tener que llamar a la clínica."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={copyPortalLink}
            >
              <Copy className="size-4" />
              Copiar link de acceso
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setDialog("seguridad")}
            >
              <LockKeyhole className="size-4" />
              Acceso y seguridad
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pacientes con acceso"
          value="128"
          icon={Users}
          hint="12 nuevos este mes"
        />
        <StatCard
          label="Turnos pedidos desde el portal"
          value="46"
          icon={CalendarClock}
          tone="info"
          hint="18 % del total"
        />
        <StatCard
          label="Documentos firmados"
          value="94"
          icon={FileCheck2}
          tone="success"
          hint="8 pendientes"
        />
        <StatCard
          label="Visitas este mes"
          value="312"
          icon={History}
          tone="warning"
          hint="+14 % vs. mes anterior"
        />
      </div>

      <Card className={`${cardStyle} mt-6`}>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Portal activo</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Mientras esté activo, tus pacientes pueden entrar a su portal
              con el link de acceso.
            </p>
          </div>

          <Switch
            checked={portalActive}
            onCheckedChange={(value) => {
              setPortalActive(value);
              toast.success(
                value
                  ? "Portal del paciente activado."
                  : "Portal del paciente desactivado.",
              );
            }}
          />
        </CardHeader>
      </Card>

      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Así ve tu paciente su portal
            </p>
            <p className="text-xs text-muted-foreground">
              Vista previa con datos ficticios.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => toast.info("Vista previa del portal del paciente.")}
          >
            <Eye className="size-4" />
            Vista previa
          </Button>
        </div>

        <Card className={cardStyle}>
          <CardContent className="p-6">
            {/* CABECERA DEL PORTAL */}
            <div className="rounded-2xl bg-hero-gradient p-6 text-primary-foreground">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-white/15">
                    <UserCircle2 className="size-6" />
                  </span>

                  <div>
                    <p className="font-display text-lg font-bold">
                      Hola, Marina Delgado
                    </p>
                    <p className="text-sm text-primary-foreground/85">
                      Clínica Centro · Dra. Lucía Ferrer
                    </p>
                  </div>
                </div>

                <Badge className="border-white/20 bg-white/15 text-white hover:bg-white/20">
                  Portal activo
                </Badge>
              </div>
            </div>

            {/* PRÓXIMO TURNO */}
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <Badge variant="outline">Próximo turno</Badge>

                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1.5"
                  onClick={() => setDialog("nuevo-turno")}
                >
                  <CalendarClock className="size-4" />
                  Pedir otro turno
                </Button>
              </div>

              <Card className="border-primary/20 bg-primary-soft/40 shadow-none">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <CalendarClock className="size-5" />
                      </div>

                      <div>
                        <p className="font-semibold">
                          {demoAppointments[0].treatment}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {demoAppointments[0].date} ·{" "}
                          {demoAppointments[0].time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {demoAppointments[0].dentist} ·{" "}
                          {demoAppointments[0].branch}
                        </p>

                        <Badge className="mt-2" variant="secondary">
                          {demoAppointments[0].status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => confirmAppointment()}
                        className="gap-1.5"
                      >
                        <CheckCircle2 className="size-4" />
                        Confirmar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => requestReschedule()}
                        className="gap-1.5"
                      >
                        <RefreshCw className="size-4" />
                        Reprogramar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* TABS */}
            <Tabs defaultValue="turnos" className="mt-6">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="turnos">Turnos</TabsTrigger>
                <TabsTrigger value="historial">Historial</TabsTrigger>
                <TabsTrigger value="comprobantes">
                  Comprobantes
                </TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>

              {/* TURNOS */}
              <TabsContent value="turnos" className="mt-4">
                <div className="space-y-3">
                  {demoAppointments.map((appointment, index) => (
                    <Card
                      key={appointment.id}
                      className="border-border/70 bg-background shadow-none"
                    >
                      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <CalendarClock className="size-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              {appointment.treatment}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.date} · {appointment.time}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.dentist} · {appointment.branch}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              index === 0 ? "default" : "secondary"
                            }
                          >
                            {appointment.status}
                          </Badge>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAppointment(appointment)}
                          >
                            Ver detalle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  className="mt-4 gap-2"
                  onClick={() => setDialog("nuevo-turno")}
                >
                  <CalendarClock className="size-4" />
                  Solicitar nuevo turno
                </Button>
              </TabsContent>

              {/* HISTORIAL */}
              <TabsContent value="historial" className="mt-4">
                <div className="space-y-3">
                  {demoHistory.map((item) => (
                    <Card
                      key={`${item.date}-${item.treatment}`}
                      className="border-border/70 bg-background shadow-none"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                              <History className="size-4" />
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                {item.treatment}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {item.date} · {item.dentist}
                              </p>
                              <p className="mt-2 text-sm text-muted-foreground">
                                {item.detail}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDialog("historial")}
                          >
                            Ver detalle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* COMPROBANTES */}
              <TabsContent value="comprobantes" className="mt-4">
                <div className="space-y-3">
                  {demoReceipts.map((receipt) => (
                    <Card
                      key={receipt.id}
                      className="border-border/70 bg-background shadow-none"
                    >
                      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <Receipt className="size-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              {receipt.id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {receipt.date} · {receipt.amount}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              receipt.status === "Pagada"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {receipt.status}
                          </Badge>

                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => {
                              setDialog("comprobante");
                            }}
                          >
                            <Eye className="size-4" />
                            Ver
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() =>
                              downloadDemo(`comprobante ${receipt.id}`)
                            }
                          >
                            <Download className="size-4" />
                            Descargar
                          </Button>

                          {receipt.status === "Pendiente" ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                toast.success(
                                  "Pago abierto como ejemplo.",
                                )
                              }
                            >
                              Pagar
                            </Button>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* DOCUMENTOS */}
              <TabsContent value="documentos" className="mt-4">
                <div className="space-y-3">
                  {demoDocuments.map((document) => (
                    <Card
                      key={document.id}
                      className="border-border/70 bg-background shadow-none"
                    >
                      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <FileText className="size-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              {document.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {document.type} · {document.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              document.status === "Firmado"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {document.status}
                          </Badge>

                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => setDialog("documento")}
                          >
                            <Eye className="size-4" />
                            Ver
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => downloadDemo(document.name)}
                          >
                            <Download className="size-4" />
                            Descargar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* DIALOG — DETALLE DEL TURNO */}
      <Dialog
        open={dialog === "turno"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del turno</DialogTitle>
            <DialogDescription>
              Información de la cita del paciente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="font-semibold">{selectedAppointment.treatment}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedAppointment.date} · {selectedAppointment.time}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem
                label="Profesional"
                value={selectedAppointment.dentist}
              />
              <InfoItem
                label="Sucursal"
                value={selectedAppointment.branch}
              />
              <InfoItem label="Estado" value={selectedAppointment.status} />
              <InfoItem label="Paciente" value="Marina Delgado" />
            </div>
          </div>

          <DialogFooter className="flex-wrap">
            <Button
              variant="outline"
              onClick={() => setDialog("nuevo-turno")}
              className="gap-1.5"
            >
              <RefreshCw className="size-4" />
              Reprogramar
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                toast.success("Cancelación registrada como ejemplo.");
                setDialog(null);
              }}
              className="gap-1.5"
            >
              <XCircle className="size-4" />
              Cancelar turno
            </Button>

            <Button onClick={confirmAppointment} className="gap-1.5">
              <CheckCircle2 className="size-4" />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG — NUEVO / REPROGRAMAR */}
      <Dialog
        open={dialog === "nuevo-turno"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar turno</DialogTitle>
            <DialogDescription>
              Vista de ejemplo del flujo de solicitud de turno del paciente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {[
              "Lunes 31 de agosto · 09:30",
              "Martes 1 de septiembre · 11:00",
              "Miércoles 2 de septiembre · 15:30",
            ].map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  toast.success(`Turno seleccionado: ${slot}`);
                  setDialog(null);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left transition hover:border-primary hover:bg-primary-soft"
              >
                <div>
                  <p className="text-sm font-semibold">{slot}</p>
                  <p className="text-xs text-muted-foreground">
                    Dra. Lucía Ferrer · Clínica Centro
                  </p>
                </div>

                <CalendarClock className="size-4 text-primary" />
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG — HISTORIAL */}
      <Dialog
        open={dialog === "historial"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del tratamiento</DialogTitle>
            <DialogDescription>
              Información clínica disponible para el paciente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <InfoItem
              label="Tratamiento"
              value="Control de ortodoncia"
            />
            <InfoItem
              label="Profesional"
              value="Dra. Lucía Ferrer"
            />
            <InfoItem
              label="Fecha"
              value="11 de agosto de 2026"
            />

            <Separator />

            <div>
              <p className="text-sm font-semibold">Evolución</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Evolución favorable. Se realizó control de aparatología y
                ajuste correspondiente según el plan de tratamiento.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold">Indicaciones</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Mantener higiene oral y continuar con las indicaciones
                entregadas por el profesional.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => downloadDemo("detalle del tratamiento")}
              className="gap-1.5"
            >
              <Download className="size-4" />
              Descargar
            </Button>

            <Button onClick={() => setDialog(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG — COMPROBANTE */}
      <Dialog
        open={dialog === "comprobante"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comprobante F-2026-0481</DialogTitle>
            <DialogDescription>
              Vista previa del comprobante del paciente.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Clínica Centro</p>
              <Badge variant="outline">Pendiente</Badge>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <InfoItem label="Paciente" value="Marina Delgado" />
              <InfoItem label="Fecha" value="09/08/2026" />
              <InfoItem label="Concepto" value="Ortodoncia fase 2" />
              <InfoItem label="Total" value="$128.000" />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => downloadDemo("F-2026-0481")}
              className="gap-1.5"
            >
              <Download className="size-4" />
              Descargar
            </Button>

            <Button
              onClick={() => {
                toast.success("Pago abierto como ejemplo.");
                setDialog(null);
              }}
            >
              Pagar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG — DOCUMENTO */}
      <Dialog
        open={dialog === "documento"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Consentimiento informado</DialogTitle>
            <DialogDescription>
              Vista previa del documento asociado al paciente.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border bg-muted/20 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <FileCheck2 className="size-5" />
              </div>

              <div>
                <p className="font-semibold">
                  Consentimiento informado — Ortodoncia
                </p>
                <p className="text-xs text-muted-foreground">
                  Firmado el 11/08/2026
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <p className="text-sm leading-6 text-muted-foreground">
              Documento de ejemplo asociado al plan de tratamiento de
              ortodoncia del paciente. En producción, este documento se
              almacenará de forma segura y estará disponible según los
              permisos correspondientes.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                downloadDemo("Consentimiento informado — Ortodoncia")
              }
              className="gap-1.5"
            >
              <Download className="size-4" />
              Descargar
            </Button>

            <Button onClick={() => setDialog(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG — SEGURIDAD */}
      <Dialog
        open={dialog === "seguridad"}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Acceso y seguridad</DialogTitle>
            <DialogDescription>
              Información de ejemplo sobre el acceso del paciente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <InfoItem
              label="Paciente"
              value="Marina Delgado"
            />
            <InfoItem
              label="Último acceso"
              value="21/08/2026 · 09:42"
            />
            <InfoItem
              label="Dispositivo"
              value="Android · Chrome"
            />
            <InfoItem
              label="Estado"
              value="Acceso activo"
            />

            <Separator />

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold">
                Seguridad del portal
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                La autenticación real, recuperación de contraseña, sesiones,
                tokens y permisos de acceso se implementarán en la capa de
                seguridad del sistema.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                toast.success(
                  "Solicitud de restablecimiento creada como ejemplo.",
                );
              }}
            >
              Restablecer acceso
            </Button>

            <Button onClick={() => setDialog(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}