import { Cake, CalendarHeart, PartyPopper, Sparkle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { initialCompanyEvents, initialEmployees, initials, type CompanyEvent } from "@/data/rrhh-demo";

const typeStyle: Record<CompanyEvent["type"], { icon: typeof Cake; color: string }> = {
  "Aniversario laboral": { icon: CalendarHeart, color: "bg-primary-soft text-primary" },
  Evento: { icon: PartyPopper, color: "bg-violet-500/15 text-violet-600" },
  Capacitación: { icon: Sparkle, color: "bg-blue-500/15 text-blue-600" },
  Feriado: { icon: Cake, color: "bg-amber-500/15 text-amber-600" },
};

function nextBirthday(birthDate: string) {
  if (!birthDate) return null;
  const today = new Date("2026-08-25");
  const [, month, day] = birthDate.split("-").map(Number);
  let next = new Date(today.getFullYear(), month - 1, day);
  if (next < today) next = new Date(today.getFullYear() + 1, month - 1, day);
  return next;
}

export default function EventosTab() {
  const birthdays = initialEmployees
    .map((e) => ({ employee: e, next: nextBirthday(e.birthDate) }))
    .filter((b) => b.next !== null)
    .sort((a, b) => a.next!.getTime() - b.next!.getTime());

  const events = [...initialCompanyEvents].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cake className="size-4 text-primary" /> Cumpleaños
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {birthdays.map(({ employee, next }) => (
            <div key={employee.id} className="flex items-center gap-3 rounded-xl border p-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary-soft text-primary">
                  {initials(employee.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{employee.name}</p>
                <p className="text-xs text-muted-foreground">{employee.role}</p>
              </div>
              <Badge variant="outline">
                {next!.toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Próximos eventos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.map((event) => {
            const style = typeStyle[event.type];
            const Icon = style.icon;
            return (
              <div key={event.id} className="flex gap-3 rounded-xl border p-3">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${style.color}`}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{event.date}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}