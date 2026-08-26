import { useState } from "react";
import { ClipboardList, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { initialAuditLog, type AuditAction } from "@/data/rrhh-demo";

const actionColor: Record<AuditAction, "default" | "outline" | "destructive" | "secondary"> = {
  Creación: "default",
  Edición: "outline",
  Eliminación: "destructive",
  Aprobación: "secondary",
  Exportación: "outline",
};

export default function AuditoriaTab() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("todas");

  const filtered = initialAuditLog.filter((entry) => {
    const matchesSearch =
      !search ||
      entry.target.toLowerCase().includes(search.toLowerCase()) ||
      entry.user.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "todas" || entry.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <ClipboardList className="size-5" />
            </div>
            <div>
              <CardTitle>Auditoría de acciones</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Registro de quién hizo qué dentro del módulo de RR.HH.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar usuario o registro..."
                className="pl-9 sm:w-64"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="Creación">Creación</SelectItem>
                <SelectItem value="Edición">Edición</SelectItem>
                <SelectItem value="Eliminación">Eliminación</SelectItem>
                <SelectItem value="Aprobación">Aprobación</SelectItem>
                <SelectItem value="Exportación">Exportación</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {filtered.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center">
            <span className="shrink-0 text-xs text-muted-foreground sm:w-36">{entry.timestamp}</span>
            <Badge variant={actionColor[entry.action]} className="shrink-0">
              {entry.action}
            </Badge>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{entry.target}</p>
              <p className="text-xs text-muted-foreground">{entry.details}</p>
            </div>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">{entry.user}</span>
          </div>
        ))}
        {!filtered.length && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No hay registros que coincidan con esos filtros.
          </p>
        )}
      </CardContent>
    </Card>
  );
}