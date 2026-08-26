import { useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import { toast } from "sonner";

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

import { initialCompanyDocuments, type CompanyDocCategory } from "@/data/rrhh-demo";

const categoryColor: Record<CompanyDocCategory, string> = {
  Política: "border-primary/30 text-primary",
  Plantilla: "border-blue-500/30 text-blue-600",
  Manual: "border-violet-500/30 text-violet-600",
  Legal: "border-destructive/30 text-destructive",
  Otro: "border-muted-foreground/30 text-muted-foreground",
};

export default function ArchivosTab() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");

  const filtered = initialCompanyDocuments.filter((doc) => {
    const matchesSearch = !search || doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "todas" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Gestión de archivos y documentos</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Políticas, plantillas, manuales y documentos legales del área de RR.HH.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar documento..."
                className="pl-9 sm:w-56"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="Política">Política</SelectItem>
                <SelectItem value="Plantilla">Plantilla</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => toast.success("Documento agregado (modo demo).")}>
              <Plus className="mr-2 size-4" /> Agregar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {filtered.map((doc) => (
          <div key={doc.id} className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{doc.name}</p>
              <p className="text-xs text-muted-foreground">
                {doc.fileType} · {doc.sizeKb} KB · Actualizado {doc.updatedAt} por {doc.updatedBy}
              </p>
            </div>
            <Badge variant="outline" className={categoryColor[doc.category]}>
              {doc.category}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toast.info(`Descargando ${doc.name}...`)}
            >
              Descargar
            </Button>
          </div>
        ))}
        {!filtered.length && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No hay documentos que coincidan con esos filtros.
          </p>
        )}
      </CardContent>
    </Card>
  );
}