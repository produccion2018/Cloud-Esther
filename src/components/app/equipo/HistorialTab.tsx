import { useMemo, useState } from "react";
import {
  ArrowUpCircle,
  Award,
  Ban,
  DoorOpen,
  DoorClosed,
  RefreshCcw,
  TrendingUp,
  UserCheck,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  initialEmployees,
  initialWorkHistory,
  initials,
  type WorkHistoryEventType,
} from "@/data/rrhh-demo";

const eventStyle: Record<WorkHistoryEventType, { icon: typeof UserCheck; color: string }> = {
  Alta: { icon: DoorOpen, color: "bg-emerald-500/15 text-emerald-600" },
  Ascenso: { icon: ArrowUpCircle, color: "bg-primary-soft text-primary" },
  "Cambio de puesto": { icon: RefreshCcw, color: "bg-blue-500/15 text-blue-600" },
  "Aumento salarial": { icon: TrendingUp, color: "bg-violet-500/15 text-violet-600" },
  Sanción: { icon: Ban, color: "bg-destructive/15 text-destructive" },
  Licencia: { icon: UserCheck, color: "bg-warning/15 text-warning" },
  Reincorporación: { icon: Award, color: "bg-emerald-500/15 text-emerald-600" },
  Baja: { icon: DoorClosed, color: "bg-muted text-muted-foreground" },
};

export default function HistorialTab() {
  const [employeeFilter, setEmployeeFilter] = useState("todos");

  const events = useMemo(() => {
    return initialWorkHistory
      .filter((ev) => employeeFilter === "todos" || String(ev.employeeId) === employeeFilter)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [employeeFilter]);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Historial laboral</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Línea de tiempo de altas, ascensos, sanciones y bajas de cada empleado.
            </p>
          </div>
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los empleados</SelectItem>
              {initialEmployees.map((e) => (
                <SelectItem key={e.id} value={String(e.id)}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-5 pl-6">
          <div className="absolute bottom-2 left-[11px] top-2 w-px bg-border" />
          {events.map((event) => {
            const employee = initialEmployees.find((e) => e.id === event.employeeId);
            const style = eventStyle[event.type];
            const Icon = style.icon;
            return (
              <div key={event.id} className="relative flex gap-4">
                <span
                  className={`absolute -left-6 flex size-6 shrink-0 items-center justify-center rounded-full ring-4 ring-background ${style.color}`}
                >
                  <Icon className="size-3.5" />
                </span>
                <div className="flex-1 rounded-2xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="bg-primary-soft text-[10px] text-primary">
                          {initials(employee?.name ?? "?")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold">{employee?.name}</span>
                      <span className="text-xs text-muted-foreground">· {event.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            );
          })}
          {!events.length && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Sin eventos registrados para este filtro.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}