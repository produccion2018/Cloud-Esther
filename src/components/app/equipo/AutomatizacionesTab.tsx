import { useState } from "react";
import { AlertCircle, Pause, Play, Workflow, Zap } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { initialAutomations, type AutomationStatus } from "@/data/rrhh-demo";

function statusVariant(status: AutomationStatus): "default" | "outline" | "destructive" {
  switch (status) {
    case "Activa": return "default";
    case "Pausada": return "outline";
    case "Con error": return "destructive";
  }
}

export default function AutomatizacionesTab() {
  const [automations, setAutomations] = useState(initialAutomations);

  const toggle = (id: number) => {
    setAutomations((current) =>
      current.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "Activa" ? "Pausada" : "Activa" }
          : a,
      ),
    );
    toast.success("Automatización actualizada.");
  };

  const active = automations.filter((a) => a.status === "Activa").length;
  const errors = automations.filter((a) => a.status === "Con error").length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={Zap} label="Automatizaciones activas" value={active.toString()} />
        <Metric icon={Workflow} label="Total configuradas" value={automations.length.toString()} />
        <Metric icon={AlertCircle} label="Con error" value={errors.toString()} warn={errors > 0} />
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Automatizaciones con n8n</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Flujos conectados a n8n que disparan acciones automáticas del módulo de RR.HH.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {automations.map((automation) => (
            <div key={automation.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Workflow className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{automation.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Disparador: {automation.trigger}
                    </p>
                    <p className="text-sm text-muted-foreground">Acción: {automation.action}</p>
                  </div>
                </div>
                <Badge variant={statusVariant(automation.status)}>{automation.status}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
                <span>
                  Última ejecución: {automation.lastRun} · {automation.runsThisMonth} veces este mes
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggle(automation.id)}
                  disabled={automation.status === "Con error"}
                >
                  {automation.status === "Activa" ? (
                    <>
                      <Pause className="mr-2 size-3.5" /> Pausar
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 size-3.5" /> Activar
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value, warn }: { icon: typeof Zap; label: string; value: string; warn?: boolean }) {
  return (
    <Card className="shadow-soft">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`mt-1 text-2xl font-bold tracking-tight ${warn ? "text-destructive" : ""}`}>{value}</p>
        </div>
        <div className={`flex size-11 items-center justify-center rounded-xl ${warn ? "bg-destructive/15 text-destructive" : "bg-primary-soft text-primary"}`}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}