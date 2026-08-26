import { useMemo, useState } from "react";
import {
  Download,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  initialEmployees,
  initialLegajoDocuments,
  initials,
  type LegajoDocCategory,
  type LegajoDocument,
} from "@/data/rrhh-demo";

const categoryColor: Record<LegajoDocCategory, string> = {
  Contrato: "border-primary/30 text-primary",
  Identidad: "border-blue-500/30 text-blue-600",
  Profesional: "border-violet-500/30 text-violet-600",
  Salud: "border-warning/30 text-warning",
  Académico: "border-emerald-500/30 text-emerald-600",
  Otro: "border-muted-foreground/30 text-muted-foreground",
};

function FileIcon({ fileType }: { fileType: LegajoDocument["fileType"] }) {
  if (fileType === "Imagen") return <ImageIcon className="size-5" />;
  return <FileText className="size-5" />;
}

export default function LegajosTab() {
  const [documents, setDocuments] = useState(initialLegajoDocuments);
  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("todos");

  const filtered = useMemo(() => {
    return initialEmployees
      .filter((e) => employeeFilter === "todos" || String(e.id) === employeeFilter)
      .map((employee) => ({
        employee,
        docs: documents.filter(
          (d) =>
            d.employeeId === employee.id &&
            (!search || d.name.toLowerCase().includes(search.toLowerCase())),
        ),
      }))
      .filter((group) => !search || group.docs.length > 0);
  }, [documents, search, employeeFilter]);

  const uploadDemo = (employeeId: number) => {
    setDocuments((current) => [
      {
        id: Date.now(),
        employeeId,
        name: "Documento subido (demo)",
        category: "Otro",
        fileType: "PDF",
        uploadedAt: new Date().toISOString().slice(0, 10),
        uploadedBy: "Vos",
        sizeKb: 128,
      },
      ...current,
    ]);
    toast.success("Documento agregado al legajo.");
  };

  const removeDoc = (id: number) => {
    setDocuments((current) => current.filter((d) => d.id !== id));
    toast.success("Documento eliminado.");
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Legajos digitales</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Toda la documentación de cada empleado, centralizada por legajo.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar documento..."
                  className="pl-9 sm:w-64"
                />
              </div>
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger className="sm:w-48">
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
          </div>
        </CardHeader>
      </Card>

      {filtered.map(({ employee, docs }) => (
        <Card key={employee.id} className="shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary-soft text-primary">
                    {initials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {employee.role} · {docs.length} documento{docs.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => uploadDemo(employee.id)}>
                <Upload className="mr-2 size-4" /> Subir documento
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-xl border p-3 transition hover:border-primary/30"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <FileIcon fileType={doc.fileType} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.uploadedAt} · {doc.sizeKb} KB
                  </p>
                  <Badge variant="outline" className={`mt-1 ${categoryColor[doc.category]}`}>
                    {doc.category}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    onClick={() => toast.info(`Descargando ${doc.name}...`)}
                    aria-label="Descargar"
                  >
                    <Download className="size-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-destructive"
                    onClick={() => removeDoc(doc.id)}
                    aria-label="Eliminar"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {!docs.length && (
              <div className="col-span-full py-6 text-center text-sm text-muted-foreground">
                <FolderOpen className="mx-auto mb-2 size-8 text-muted-foreground/40" />
                Este legajo todavía no tiene documentos cargados.
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}