import { AlertOctagon, AlertTriangle, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { initialEmployees, initialHrAlerts, type AlertSeverity } from "@/data/rrhh-demo";

const severityStyle: Record<AlertSeverity, { icon: typeof Info; color: string; badge: "outline" | "destructive" | "secondary" }> = {
  info: { icon: Info, color: "bg-blue-500/15 text-blue-600", badge: "secondary" },
  warning: { icon: AlertTriangle, color: "bg-warning/15 text-warning", badge: "outline" },
  critical: { icon: AlertOctagon, color: "bg-destructive/15 text-destructive", badge: "destructive" },
};

export default function AlertasTab() {
  const sorted = [...initialHrAlerts].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const critical = initialHrAlerts.filter((a) => a.severity === "critical").length;

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Alertas y vencimientos</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Documentación, contratos y capacitaciones que requieren atención.
            </p>
          </div>
          {critical > 0 && (
            <Badge variant="destructive">{critical} crítica{critical === 1 ? "" : "s"}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((alert) => {
          const employee = initialEmployees.find((e) => e.id === alert.employeeId);
          const style = severityStyle[alert.severity];
          const Icon = style.icon;
          return (
            <div key={alert.id} className="flex items-start gap-3 rounded-2xl border p-4">
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${style.color}`}>
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{alert.title}</p>
                  <Badge variant={style.badge}>{alert.source}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{alert.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {employee ? `${employee.name} · ` : ""}Vence {alert.dueDate}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}