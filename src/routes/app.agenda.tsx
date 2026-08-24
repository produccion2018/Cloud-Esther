import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarCheck,
  CalendarDays,
  Check,
  Clock,
  Lock,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  UserPlus,
  Users,
  X,
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Textarea } from "@/components/ui/textarea";

import {
  appointments as demoAppointments,
  branches,
  dentists,
  waitlist as demoWaitlist,
  type AppointmentStatus,
} from "@/data/demo";

export const Route = createFileRoute("/app/agenda")({
  component: AgendaPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const treatments = [
  "Primera consulta",
  "Limpieza y profilaxis",
  "Control de ortodoncia",
  "Implante unitario",
  "Endodoncia",
  "Blanqueamiento",
  "Urgencia",
];

const rooms = [
  "Gabinete 1",
  "Gabinete 2",
  "Gabinete 3",
];

const statusLabels: Record<AppointmentStatus, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  atendida: "Atendida",
  cancelada: "Cancelada",
  ausente: "Ausente",
};

const statusVariant = (status: AppointmentStatus) => {
  if (status === "confirmada") return "default";
  if (status === "atendida") return "secondary";
  if (status === "cancelada") return "destructive";
  return "outline";
};

function NewAppointmentDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onCreate: (data: {
    patient: string;
    branch: string;
    dentist: string;
    room: string;
    date: string;
    time: string;
    treatment: string;
    notes: string;
  }) => void;
}) {
  const [patient, setPatient] = useState("");
  const [branch, setBranch] = useState("centro");
  const [dentist, setDentist] = useState("d1");
  const [room, setRoom] = useState("Gabinete 1");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [treatment, setTreatment] = useState(treatments[0]);
  const [notes, setNotes] = useState("");

  const handleCreate = () => {
    if (!patient.trim()) {
      toast.error("Ingresá el paciente.");
      return;
    }

    if (!date || !time) {
      toast.error("Seleccioná fecha y hora.");
      return;
    }

    onCreate({
      patient,
      branch,
      dentist,
      room,
      date,
      time,
      treatment,
      notes,
    });

    setPatient("");
    setDate("");
    setTime("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva cita</DialogTitle>
          <DialogDescription>
            Asigná paciente, odontólogo, gabinete y horario.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Paciente</Label>
            <Input
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              placeholder="Buscar paciente por nombre o documento"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Sucursal</Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches
                  .filter((b) => b.id !== "todas")
                  .map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Odontólogo</Label>
            <Select value={dentist} onValueChange={setDentist}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dentists.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Gabinete</Label>
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Tratamiento</Label>
            <Select value={treatment} onValueChange={setTreatment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {treatments.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Hora</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notas</Label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Indicaciones para el gabinete o el paciente"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button onClick={handleCreate}>
            Crear cita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BlockScheduleDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");

  const save = () => {
    if (!date || !from || !to) {
      toast.error("Completá fecha y horario.");
      return;
    }

    toast.success("Horario bloqueado correctamente.");
    onOpenChange(false);
    setDate("");
    setFrom("");
    setTo("");
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bloquear horario</DialogTitle>
          <DialogDescription>
            Reservá un período en el que no se podrán crear turnos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Desde</Label>
              <Input
                type="time"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Hasta</Label>
              <Input
                type="time"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Motivo</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. Reunión, mantenimiento, vacaciones..."
            />
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
            Bloquear horario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AppointmentActions({
  status,
  onStatusChange,
  onEdit,
}: {
  status: AppointmentStatus;
  onStatusChange: (status: AppointmentStatus) => void;
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {status === "pendiente" && (
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() => onStatusChange("confirmada")}
        >
          <Check className="size-3.5" />
          Confirmar
        </Button>
      )}

      {status === "confirmada" && (
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() => onStatusChange("atendida")}
        >
          <Check className="size-3.5" />
          Atendida
        </Button>
      )}

      {(status === "pendiente" || status === "confirmada") && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={onEdit}
          >
            <Pencil className="size-3.5" />
            Editar
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() => onStatusChange("cancelada")}
          >
            <X className="size-3.5" />
            Cancelar
          </Button>
        </>
      )}

      {status === "atendida" && (
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() => onStatusChange("ausente")}
        >
          Marcar ausente
        </Button>
      )}
    </div>
  );
}

function AgendaPage() {
  const [branch, setBranch] = useState("todas");
  const [dentist, setDentist] = useState("todos");
  const [room, setRoom] = useState("todos");
  const [treatment, setTreatment] = useState("todos");

  const [appointments, setAppointments] = useState(demoAppointments);
  const [waitlist, setWaitlist] = useState(demoWaitlist);

  const [newAppointmentOpen, setNewAppointmentOpen] =
    useState(false);

  const [blockOpen, setBlockOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const [waitPatient, setWaitPatient] = useState("");
  const [waitTreatment, setWaitTreatment] = useState(
    treatments[0],
  );
  const [waitPreference, setWaitPreference] = useState(
    "Tardes",
  );
  const [waitBranch, setWaitBranch] = useState("centro");

  const filtered = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesBranch =
        branch === "todas" || appointment.branch === branch;

      const matchesDentist =
        dentist === "todos" ||
        appointment.dentist === dentist;

      const matchesRoom =
        room === "todos" ||
        appointment.room === room;

      const matchesTreatment =
        treatment === "todos" ||
        appointment.treatment === treatment;

      return (
        matchesBranch &&
        matchesDentist &&
        matchesRoom &&
        matchesTreatment
      );
    });
  }, [appointments, branch, dentist, room, treatment]);

  const stats = useMemo(() => {
    return {
      total: filtered.length,
      confirmadas: filtered.filter(
        (a) => a.status === "confirmada",
      ).length,
      pendientes: filtered.filter(
        (a) => a.status === "pendiente",
      ).length,
      atendidas: filtered.filter(
        (a) => a.status === "atendida",
      ).length,
      canceladas: filtered.filter(
        (a) => a.status === "cancelada",
      ).length,
    };
  }, [filtered]);

  const updateStatus = (
    id: string,
    status: AppointmentStatus,
  ) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status }
          : appointment,
      ),
    );

    toast.success(
      `Turno ${statusLabels[status].toLowerCase()}.`,
    );
  };

  const createAppointment = (data: {
    patient: string;
    branch: string;
    dentist: string;
    room: string;
    date: string;
    time: string;
    treatment: string;
    notes: string;
  }) => {
    const newAppointment = {
      id: `new-${Date.now()}`,
      time: data.time,
      patient: data.patient,
      treatment: data.treatment,
      dentist: data.dentist,
      branch: data.branch,
      room: data.room,
      status: "pendiente" as AppointmentStatus,
    };

    setAppointments((current) => [
      ...current,
      newAppointment,
    ]);

    toast.success(
      "Cita creada y recordatorio programado.",
    );
  };

  const addToWaitlist = () => {
    if (!waitPatient.trim()) {
      toast.error("Ingresá el nombre del paciente.");
      return;
    }

    setWaitlist((current) => [
      ...current,
      {
        id: `w-${Date.now()}`,
        patient: waitPatient,
        treatment: waitTreatment,
        preference: waitPreference,
        branch: waitBranch,
      },
    ]);

    setWaitPatient("");
    setWaitlistOpen(false);

    toast.success("Paciente agregado a la lista de espera.");
  };

  const removeFromWaitlist = (id: string) => {
    setWaitlist((current) =>
      current.filter((item) => item.id !== id),
    );

    toast.success("Paciente retirado de la lista de espera.");
  };

  const editingAppointment = appointments.find(
    (appointment) => appointment.id === editingId,
  );

  return (
    <>
      <PageHeader
        title="Agenda y turnos"
        description="Gestioná citas, disponibilidad, profesionales, gabinetes y lista de espera desde una única agenda."
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setBlockOpen(true)}
            >
              <Lock className="size-4" />
              Bloquear horario
            </Button>

            <Button
              className="gap-2"
              onClick={() => setNewAppointmentOpen(true)}
            >
              <Plus className="size-4" />
              Nueva cita
            </Button>
          </>
        }
      />

      {/* KPIs */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: CalendarDays,
          },
          {
            label: "Confirmadas",
            value: stats.confirmadas,
            icon: Check,
          },
          {
            label: "Pendientes",
            value: stats.pendientes,
            icon: Clock,
          },
          {
            label: "Atendidas",
            value: stats.atendidas,
            icon: CalendarCheck,
          },
          {
            label: "Canceladas",
            value: stats.canceladas,
            icon: X,
          },
        ].map((item) => (
          <Card key={item.label} className={cardStyle}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-xl font-bold">
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card className={`${cardStyle} mb-5`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Filtros de agenda
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger>
              <SelectValue placeholder="Sucursal" />
            </SelectTrigger>

            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={dentist}
            onValueChange={setDentist}
          >
            <SelectTrigger>
              <SelectValue placeholder="Odontólogo" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todos">
                Todos los odontólogos
              </SelectItem>

              {dentists.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={room} onValueChange={setRoom}>
            <SelectTrigger>
              <SelectValue placeholder="Gabinete" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todos">
                Todos los gabinetes
              </SelectItem>

              {rooms.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={treatment}
            onValueChange={setTreatment}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tratamiento" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todos">
                Todos los tratamientos
              </SelectItem>

              {treatments.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Tabs defaultValue="dia">
            <TabsList className="flex w-full justify-start overflow-x-auto">
              <TabsTrigger value="dia">
                Día
              </TabsTrigger>

              <TabsTrigger value="semana">
                Semana
              </TabsTrigger>

              <TabsTrigger value="mes">
                Mes
              </TabsTrigger>

              <TabsTrigger value="turnos">
                Turnos
              </TabsTrigger>
            </TabsList>

            {/* DÍA */}
            <TabsContent value="dia" className="mt-4">
              <Card className={cardStyle}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarDays className="size-4 text-primary" />
                    Agenda del día
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {filtered.length === 0 ? (
                    <EmptyState
                      icon={CalendarDays}
                      title="No tenés citas cargadas"
                      description="Creá una nueva cita para comenzar a gestionar la agenda."
                    />
                  ) : (
                    filtered.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="min-w-16 text-center">
                              <p className="text-lg font-bold">
                                {appointment.time}
                              </p>

                              <Clock className="mx-auto mt-1 size-3.5 text-muted-foreground" />
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold">
                                  {appointment.patient}
                                </p>

                                <Badge
                                  variant={statusVariant(
                                    appointment.status,
                                  )}
                                >
                                  {
                                    statusLabels[
                                      appointment.status
                                    ]
                                  }
                                </Badge>
                              </div>

                              <p className="mt-1 text-sm text-muted-foreground">
                                {appointment.treatment}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span>
                                  {
                                    dentists.find(
                                      (d) =>
                                        d.id ===
                                        appointment.dentist,
                                    )?.name
                                  }
                                </span>

                                <span>
                                  {
                                    branches.find(
                                      (b) =>
                                        b.id ===
                                        appointment.branch,
                                    )?.name
                                  }
                                </span>

                                <span>
                                  {appointment.room}
                                </span>
                              </div>
                            </div>
                          </div>

                          <AppointmentActions
                            status={appointment.status}
                            onEdit={() =>
                              setEditingId(appointment.id)
                            }
                            onStatusChange={(status) =>
                              updateStatus(
                                appointment.id,
                                status,
                              )
                            }
                          />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEMANA */}
            <TabsContent value="semana" className="mt-4">
              <Card className={cardStyle}>
                <CardContent className="overflow-x-auto p-4">
                  <div className="min-w-[720px]">
                    <div className="grid grid-cols-[64px_repeat(6,1fr)] gap-2">
                      <div />

                      {weekDays.map((day) => (
                        <div
                          key={day}
                          className="pb-2 text-center text-xs font-semibold text-muted-foreground"
                        >
                          {day}
                        </div>
                      ))}

                      {[
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "15:00",
                        "16:00",
                        "17:00",
                      ].map((hour) => (
                        <div
                          key={hour}
                          className="contents"
                        >
                          <div className="py-3 text-xs text-muted-foreground">
                            {hour}
                          </div>

                          {weekDays.map((day) => {
                            const appointment =
                              filtered.find(
                                (a) =>
                                  a.time === hour,
                              );

                            return (
                              <button
                                key={`${hour}-${day}`}
                                type="button"
                                onClick={() => {
                                  if (appointment) {
                                    setEditingId(
                                      appointment.id,
                                    );
                                  } else {
                                    setNewAppointmentOpen(
                                      true,
                                    );
                                  }
                                }}
                                className="min-h-16 rounded-lg border border-dashed border-border/70 p-1 text-left transition hover:border-primary hover:bg-primary/5"
                              >
                                {appointment ? (
                                  <div className="rounded-md bg-primary/10 p-2">
                                    <p className="truncate text-[11px] font-semibold">
                                      {
                                        appointment.patient
                                      }
                                    </p>

                                    <p className="truncate text-[10px] text-muted-foreground">
                                      {
                                        appointment.treatment
                                      }
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground">
                                    Libre
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* MES */}
            <TabsContent value="mes" className="mt-4">
              <Card className={cardStyle}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Este mes
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-muted-foreground">
                    {[
                      "L",
                      "M",
                      "X",
                      "J",
                      "V",
                      "S",
                      "D",
                    ].map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>

                  <div className="mt-2 grid grid-cols-7 gap-1.5">
                    {Array.from(
                      { length: 30 },
                      (_, i) => i + 1,
                    ).map((day) => {
                      const dayAppointments =
                        filtered.slice(
                          (day - 1) % Math.max(filtered.length, 1),
                          ((day - 1) %
                            Math.max(
                              filtered.length,
                              1,
                            )) +
                            1,
                        );

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() =>
                            setNewAppointmentOpen(true)
                          }
                          className="min-h-20 rounded-lg border border-border p-1.5 text-left text-xs transition hover:border-primary hover:bg-primary/5"
                        >
                          <span className="font-semibold">
                            {day}
                          </span>

                          {dayAppointments.length > 0 ? (
                            <div className="mt-1 rounded bg-primary/10 p-1 text-[10px] text-primary">
                              {dayAppointments.length} turno
                            </div>
                          ) : (
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              Libre
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TURNOS */}
            <TabsContent value="turnos" className="mt-4">
              <Card className={cardStyle}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarCheck className="size-4 text-primary" />
                    Gestión rápida de turnos
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {filtered.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">
                          {appointment.patient}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {appointment.time} ·{" "}
                          {appointment.treatment}
                        </p>
                      </div>

                      <AppointmentActions
                        status={appointment.status}
                        onEdit={() =>
                          setEditingId(appointment.id)
                        }
                        onStatusChange={(status) =>
                          updateStatus(
                            appointment.id,
                            status,
                          )
                        }
                      />
                    </div>
                  ))}

                  {filtered.length === 0 && (
                    <EmptyState
                      icon={CalendarCheck}
                      title="No hay turnos"
                      description="No hay turnos que coincidan con los filtros seleccionados."
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-5">
          {/* LISTA DE ESPERA */}
          <Card className={cardStyle}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="size-4 text-primary" />
                  Lista de espera
                </CardTitle>

                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => setWaitlistOpen(true)}
                >
                  <UserPlus className="size-3.5" />
                  Agregar
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {waitlist.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Sin pacientes en espera"
                  description="Agregá pacientes que quieran ocupar un turno liberado."
                />
              ) : (
                waitlist.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {item.patient}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {item.treatment}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Badge variant="secondary">
                            {item.preference}
                          </Badge>

                          <Badge variant="outline">
                            {
                              branches.find(
                                (b) =>
                                  b.id === item.branch,
                              )?.name
                            }
                          </Badge>
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          removeFromWaitlist(item.id)
                        }
                        aria-label="Eliminar de lista de espera"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* RECORDATORIOS */}
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="text-base">
                Recordatorios automáticos
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                {
                  canal: "WhatsApp",
                  regla: "24 h antes de la cita",
                },
                {
                  canal: "SMS",
                  regla: "2 h antes de la cita",
                },
                {
                  canal: "Correo",
                  regla: "Al confirmar la cita",
                },
              ].map((item) => (
                <div
                  key={item.canal}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {item.canal}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.regla}
                    </p>
                  </div>

                  <Badge variant="secondary">
                    Activo
                  </Badge>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast.info(
                    "Configuración de recordatorios abierta.",
                  )
                }
              >
                Configurar recordatorios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* NUEVA CITA */}
      <NewAppointmentDialog
        open={newAppointmentOpen}
        onOpenChange={setNewAppointmentOpen}
        onCreate={createAppointment}
      />

      {/* BLOQUEAR HORARIO */}
      <BlockScheduleDialog
        open={blockOpen}
        onOpenChange={setBlockOpen}
      />

      {/* EDITAR / REPROGRAMAR */}
      <Dialog
        open={!!editingId}
        onOpenChange={(open) => {
          if (!open) setEditingId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reprogramar / editar turno
            </DialogTitle>

            <DialogDescription>
              Modificá la información del turno seleccionado.
            </DialogDescription>
          </DialogHeader>

          {editingAppointment && (
            <div className="grid gap-4">
              <div>
                <Label>Paciente</Label>
                <Input
                  defaultValue={
                    editingAppointment.patient
                  }
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Tratamiento</Label>

                <Select
                  defaultValue={
                    editingAppointment.treatment
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {treatments.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Fecha</Label>
                  <Input
                    type="date"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    defaultValue={
                      editingAppointment.time
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label>Estado</Label>

                <Select
                  defaultValue={
                    editingAppointment.status
                  }
                  onValueChange={(value) =>
                    updateStatus(
                      editingAppointment.id,
                      value as AppointmentStatus,
                    )
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {(
                      Object.keys(
                        statusLabels,
                      ) as AppointmentStatus[]
                    ).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                      >
                        {statusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingId(null)}
            >
              Cancelar
            </Button>

            <Button
              onClick={() => {
                setEditingId(null);
                toast.success(
                  "Turno actualizado correctamente.",
                );
              }}
            >
              <RefreshCcw className="mr-2 size-4" />
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AGREGAR A LISTA DE ESPERA */}
      <Dialog
        open={waitlistOpen}
        onOpenChange={setWaitlistOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Agregar a lista de espera
            </DialogTitle>

            <DialogDescription>
              Guardá los datos básicos para contactar al paciente
              cuando se libere un turno.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div>
              <Label>Paciente</Label>
              <Input
                value={waitPatient}
                onChange={(e) =>
                  setWaitPatient(e.target.value)
                }
                placeholder="Nombre del paciente"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Tratamiento</Label>

              <Select
                value={waitTreatment}
                onValueChange={setWaitTreatment}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {treatments.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Preferencia</Label>

              <Select
                value={waitPreference}
                onValueChange={setWaitPreference}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Mañanas">
                    Mañanas
                  </SelectItem>
                  <SelectItem value="Tardes">
                    Tardes
                  </SelectItem>
                  <SelectItem value="Hoy">
                    Hoy
                  </SelectItem>
                  <SelectItem value="Cualquier horario">
                    Cualquier horario
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sucursal</Label>

              <Select
                value={waitBranch}
                onValueChange={setWaitBranch}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {branches
                    .filter((b) => b.id !== "todas")
                    .map((b) => (
                      <SelectItem
                        key={b.id}
                        value={b.id}
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWaitlistOpen(false)}
            >
              Cancelar
            </Button>

            <Button onClick={addToWaitlist}>
              <UserPlus className="mr-2 size-4" />
              Agregar paciente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}