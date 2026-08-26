import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  headcountTrend,
  initialContracts,
  initialEmployees,
  initialLegajoDocuments,
  initialTrainings,
  money,
} from "@/data/rrhh-demo";

export default function ReportesTab() {
  const totalPayroll = initialEmployees
    .filter((e) => e.status !== "Inactivo")
    .reduce((sum, e) => sum + e.salary, 0);

  const byArea = Array.from(new Set(initialEmployees.map((e) => e.area))).map((area) => ({
    area,
    count: initialEmployees.filter((e) => e.area === area).length,
  }));

  const contractsExpiringSoon = initialContracts.filter((c) => c.status === "Por renovar").length;
  const trainingsCompleted = initialTrainings.filter((t) => t.status === "Completada").length;

  const exportReport = () => {
    toast.success("Reporte generado (modo demo).");
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Reportes de RR.HH.</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Indicadores clave de dotación, costos y actividad del equipo.
              </p>
            </div>
            <Button variant="outline" onClick={exportReport}>
              <Download className="mr-2 size-4" /> Exportar reporte
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniKpi label="Dotación actual" value={initialEmployees.length.toString()} />
          <MiniKpi label="Costo laboral mensual" value={money(totalPayroll)} />
          <MiniKpi label="Contratos por renovar" value={contractsExpiringSoon.toString()} />
          <MiniKpi label="Capacitaciones completadas" value={trainingsCompleted.toString()} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Dotación por área</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {byArea.map(({ area, count }) => (
              <div key={area}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{area}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(count / initialEmployees.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Evolución de la dotación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-3">
              {headcountTrend.map((point) => (
                <div key={point.month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-primary/80"
                    style={{ height: `${(point.count / 6) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{point.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Documentación por legajo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Promedio de {(initialLegajoDocuments.length / initialEmployees.length).toFixed(1)} documentos
            cargados por empleado en el legajo digital.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}