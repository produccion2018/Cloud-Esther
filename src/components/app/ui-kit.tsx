import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus, PatientStatus } from "@/data/demo";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
  hint,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "info";
  hint?: string;
}) {
  const toneClass = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning/15 text-warning-foreground",
    info: "bg-accent text-accent-foreground",
  }[tone];

  return (
    <Card className="ce-card-hover relative overflow-hidden shadow-soft">
      {/* Círculo decorativo suave, recortado por el borde de la tarjeta —
          mismo detalle visual de la referencia, puramente estético. */}
      <div className="pointer-events-none absolute -right-5 -top-5 size-20 rounded-full bg-muted/70" />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <span className={`flex size-10 items-center justify-center rounded-xl ${toneClass}`}>
            <Icon className="size-5" />
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          {typeof delta === "number" ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
                delta >= 0 ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive"
              }`}
            >
              {delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {delta >= 0 ? "+" : ""}
              {delta}%
            </span>
          ) : null}
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}

const appointmentStyles: Record<AppointmentStatus, string> = {
  pendiente: "bg-warning/15 text-warning-foreground border-warning/30",
  confirmada: "bg-primary-soft text-primary border-primary/25",
  atendida: "bg-success-soft text-success border-success/25",
  cancelada: "bg-destructive/10 text-destructive border-destructive/25",
  ausente: "bg-muted text-muted-foreground border-border",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <Badge variant="outline" className={`capitalize ${appointmentStyles[status]}`}>
      {status}
    </Badge>
  );
}

const patientStyles: Record<PatientStatus, string> = {
  activo: "bg-success-soft text-success border-success/25",
  inactivo: "bg-muted text-muted-foreground border-border",
  lead: "bg-accent text-accent-foreground border-primary/20",
  pendiente: "bg-warning/15 text-warning-foreground border-warning/30",
};

export function PatientStatusBadge({ status }: { status: PatientStatus }) {
  const label = status === "pendiente" ? "tratamiento pendiente" : status;
  return (
    <Badge variant="outline" className={`capitalize ${patientStyles[status]}`}>
      {label}
    </Badge>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}