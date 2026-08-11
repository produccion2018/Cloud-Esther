import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock, Lock, Plus, RefreshCcw, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { AppointmentStatusBadge, EmptyState } from "@/components/app/ui-kit";
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
  DialogTrigger,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { appointments, branches, dentists, waitlist } from "@/data/demo";

export const Route = createFileRoute("/app/agenda")({
  component: AgendaPage,
});

const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00"];
const weekDays = ["Lun 10", "Mar 11", "Mié 12", "Jue 13", "Vie 14", "Sáb 15"];
const treatments = [
  "Primera consulta",
  "Limpieza y profilaxis",
  "Control de ortodoncia",
  "Implante unitario",
  "Endodoncia",
  "Blanqueamiento",
  "Urgencia",
];

function NewAppointmentDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" /> Nueva cita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva cita</DialogTitle>
          <DialogDescription>Asigna paciente, odontólogo, gabinete y horario.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Paciente</Label>
            <Input placeholder="Buscar paciente por nombre o documento" />
          </div>
          <div className="space-y-1.5">
            <Label>Sucursal</Label>
            <Select defaultValue="centro">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {branches.filter((b) => b.id !== "todas").map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Odontólogo</Label>
            <Select defaultValue="d1">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {dentists.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Fecha</Label>
            <Input type="date" defaultValue="2026-08-11" />
          </div>
          <div className="space-y-1.5">
            <Label>Hora</Label>
            <Input type="time" defaultValue="09:30" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Tratamiento</Label>
            <Select defaultValue="Primera consulta">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {treatments.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notas</Label>
            <Textarea rows={3} placeholder="Indicaciones para el gabinete o el paciente" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast.success("Cita creada y recordatorio programado por WhatsApp.");
            }}
          >
            Crear cita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AgendaPage() {
  const [branch, setBranch] = useState("todas");
  const [dentist, setDentist] = useState("todos");
  const [room, setRoom] = useState("todos");
  const [treatment, setTreatment] = useState("todos");

  const filtered = useMemo(
    () =>
      appointments.filter(
        (a) =>
          (branch === "todas" || a.branch === branch) &&
          (dentist === "todos" || a.dentist === dentist) &&
          (room === "todos" || a.room === room) &&
          (treatment === "todos" || a.treatment === treatment),
      ),
    [branch, dentist, room, treatment],
  );

  return (
    <>
      <PageHeader
        title="Agenda"
        description="Citas de todas las sedes con filtros por odontólogo, gabinete y tratamiento."
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => toast.info("Horario bloqueado de 14:00 a 15:00.")}>
              <Lock className="size-4" /> Bloquear horario
            </Button>
            <NewAppointmentDialog />
          </>
        }
      />

      <Card className="mb-5 shadow-soft">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger><SelectValue placeholder="Sucursal" /></SelectTrigger>
            <SelectContent>
              {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={dentist} onValueChange={setDentist}>
            <SelectTrigger><SelectValue placeholder="Odontólogo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los odontólogos</SelectItem>
              {dentists.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={room} onValueChange={setRoom}>
            <SelectTrigger><SelectValue placeholder="Gabinete" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los gabinetes</SelectItem>
              {["Gabinete 1", "Gabinete 2", "Gabinete 3"].map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={treatment} onValueChange={setTreatment}>
            <SelectTrigger><SelectValue placeholder="Tratamiento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tratamientos</SelectItem>
              {[...new Set(appointments.map((a) => a.treatment))].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Tabs defaultValue="dia">
            <TabsList>
              <TabsTrigger value="dia">Día</TabsTrigger>
              <TabsTrigger value="semana">Semana</TabsTrigger>
              <TabsTrigger value="mes">Mes</TabsTrigger>
            </TabsList>

            <TabsContent value="dia" className="mt-4">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarDays className="size-4 text-primary" /> Martes 11 de agosto de 2026
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filtered.length === 0 ? (
                    <EmptyState
                      icon={CalendarDays}
                      title="Sin citas con estos filtros"
                      description="Prueba a cambiar la sucursal, el odontólogo o el gabinete seleccionado."
                    />
                  ) : (
                    filtered.map((a) => (
                      <div
                        key={a.id}
                        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center"
                      >
                        <div className="flex w-20 shrink-0 items-center gap-2 text-sm font-semibold">
                          <Clock className="size-4 text-primary" /> {a.time}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{a.patient}</p>
                          <p className="text-sm text-muted-foreground">
                            {a.treatment} · {dentists.find((d) => d.id === a.dentist)?.name} · {a.room}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <AppointmentStatusBadge status={a.status} />
                          <Button size="sm" variant="outline" onClick={() => toast.success(`Cita de ${a.patient} confirmada.`)}>
                            Confirmar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toast.info("Abriendo reprogramación…")}>
                            Reprogramar
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="semana" className="mt-4">
              <Card className="shadow-soft">
                <CardContent className="overflow-x-auto p-4">
                  <div className="min-w-[720px]">
                    <div className="grid grid-cols-[64px_repeat(6,1fr)] gap-2">
                      <div />
                      {weekDays.map((d) => (
                        <div key={d} className="pb-2 text-center text-xs font-semibold text-muted-foreground">
                          {d}
                        </div>
                      ))}
                      {hours.map((h, hi) => (
                        <>
                          <div key={h} className="py-3 text-xs text-muted-foreground">{h}</div>
                          {weekDays.map((d, di) => {
                            const appt = appointments[(hi * 3 + di) % appointments.length];
                            const show = (hi + di) % 3 !== 1 && appt;
                            return (
                              <div
                                key={`${h}-${d}`}
                                className="min-h-14 rounded-lg border border-dashed border-border/70 p-1"
                              >
                                {show ? (
                                  <div className="h-full rounded-md bg-primary-soft p-1.5 text-[11px] leading-tight text-primary">
                                    <p className="font-semibold">{appt.patient.split(" ")[0]}</p>
                                    <p className="truncate opacity-80">{appt.treatment}</p>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mes" className="mt-4">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-base">Agosto 2026</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-muted-foreground">
                    {["L", "M", "X", "J", "V", "S", "D"].map((d) => <div key={d}>{d}</div>)}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const count = (day * 7) % 13;
                      return (
                        <div
                          key={day}
                          className={`min-h-16 rounded-lg border p-1.5 text-left text-xs ${
                            day === 11 ? "border-primary bg-primary-soft" : "border-border"
                          }`}
                        >
                          <span className="font-semibold">{day}</span>
                          {count > 0 ? (
                            <p className="mt-1 rounded bg-secondary px-1 py-0.5 text-[10px] text-secondary-foreground">
                              {count} citas
                            </p>
                          ) : (
                            <p className="mt-1 text-[10px] text-muted-foreground">Libre</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-5">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-primary" /> Lista de espera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {waitlist.map((w) => (
                <div key={w.id} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-semibold">{w.patient}</p>
                  <p className="text-xs text-muted-foreground">{w.treatment} · {w.preference}</p>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-2 w-full gap-1.5"
                    onClick={() => toast.success(`Turno reasignado a ${w.patient}.`)}
                  >
                    <RefreshCcw className="size-3.5" /> Asignar turno liberado
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Recordatorios automáticos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { canal: "WhatsApp", regla: "24 h antes de la cita", estado: "Activo" },
                { canal: "SMS", regla: "2 h antes de la cita", estado: "Activo" },
                { canal: "Correo", regla: "Al confirmar la cita", estado: "Activo" },
                { canal: "Notificación", regla: "Paciente sin confirmar 48 h", estado: "Pausado" },
              ].map((r) => (
                <div key={r.canal} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{r.canal}</p>
                    <p className="text-xs text-muted-foreground">{r.regla}</p>
                  </div>
                  <Badge variant={r.estado === "Activo" ? "secondary" : "outline"}>{r.estado}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
