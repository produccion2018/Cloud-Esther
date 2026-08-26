import { useRef, useState } from "react";
import { FileSpreadsheet, Upload, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { initialEmployees } from "@/data/rrhh-demo";

export default function ImportExportTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastImport, setLastImport] = useState<string | null>(null);

  const exportEmployeesCsv = () => {
    const rows = initialEmployees
      .map((e) => `${e.name};${e.role};${e.area};${e.branch};${e.status};${e.salary}`)
      .join("\n");
    const blob = new Blob(
      [`Nombre;Cargo;Área;Sucursal;Estado;Salario\n${rows}`],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "empleados-rrhh.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Exportación de empleados generada.");
  };

  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLastImport(file.name);
    toast.success(`"${file.name}" listo para procesar (modo demo, sin backend aún).`);
    e.target.value = "";
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Upload className="size-4 text-primary" /> Importar desde Excel
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Subí una planilla de empleados, asistencia o vacaciones en formato .xlsx o .csv.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileSelected}
          />
          <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
            <FileSpreadsheet className="mr-2 size-4" /> Seleccionar archivo
          </Button>
          {lastImport && (
            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary-soft/40 p-3 text-sm">
              <CheckCircle2 className="size-4 text-primary" />
              <span className="truncate">{lastImport}</span>
              <Badge variant="outline" className="ml-auto">Pendiente de procesar</Badge>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            La validación y carga real a la base de datos se conecta cuando esté el backend.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download className="size-4 text-primary" /> Exportar a Excel
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Descargá los datos actuales del equipo en formato de planilla.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full" onClick={exportEmployeesCsv}>
            <Download className="mr-2 size-4" /> Exportar listado de empleados
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => toast.info("Exportación de nómina: modo demo.")}
          >
            <Download className="mr-2 size-4" /> Exportar nómina del período
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}