import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  initialEmployees,
  initialTrainings,
  initials,
  type TrainingStatus,
} from "@/data/rrhh-demo";

function statusVariant(status: TrainingStatus): "default" | "outline" | "destructive" | "secondary" {
  switch (status) {
    case "Completada": return "default";
    case "En curso": return "outline";
    case "Cancelada": return "destructive";
    default: return "secondary";
  }
}

export default function CapacitacionesTab() {
  const [trainings, setTrainings] = useState(initialTrainings);

  const upcoming = trainings.filter((t) => t.status === "Programada").length;
  const completedThisYear = trainings.filter((t) => t.status === "Completada").length;
  const totalParticipations = trainings.reduce((sum, t) => sum + t.participantIds.length, 0);

  const markCompleted = (trainingId: number, employeeId: number) => {
    setTrainings((current) =>
      current.map((t) =>
        t.id === trainingId && !t.completedIds.includes(employeeId)
          ? { ...t, completedIds: [...t.completedIds, employeeId] }
          : t,
      ),
    );
    toast.success("Asistencia registrada.");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={CalendarClock} label="Capacitaciones programadas" value={upcoming.toString()} />
        <Metric icon={CheckCircle2} label="Completadas" value={completedThisYear.toString()} />
        <Metric icon={Users} label="Participaciones totales" value={totalParticipations.toString()} />
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Capacitaciones</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Cursos, talleres y entrenamientos del equipo.
              </p>
            </div>
            <Button onClick={() => toast.success("Nueva capacitación preparada en modo demo.")}>
              <Plus className="mr-2 size-4" /> Nueva capacitación
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {trainings.map((training) => (
            <div key={training.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <GraduationCap className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{training.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {training.category} · {training.modality} · {training.instructor}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {training.startDate} → {training.endDate}
                    </p>
                  </div>
                </div>
                <Badge variant={statusVariant(training.status)}>{training.status}</Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                <BookOpen className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Participantes:</span>
                {training.participantIds.map((id) => {
                  const employee = initialEmployees.find((e) => e.id === id);
                  if (!employee) return null;
                  const done = training.completedIds.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => markCompleted(training.id, id)}
                      className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition ${
                        done
                          ? "border-primary/30 bg-primary-soft text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <Avatar className="size-4">
                        <AvatarFallback className="text-[9px]">{initials(employee.name)}</AvatarFallback>
                      </Avatar>
                      {employee.name.split(" ")[0]}
                      {done && <CheckCircle2 className="size-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <Card className="shadow-soft">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}