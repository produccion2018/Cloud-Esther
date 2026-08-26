import { useState } from "react";
import { Megaphone, Pin, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { initialAnnouncements, type Announcement } from "@/data/rrhh-demo";

const audienceColor: Record<Announcement["audience"], string> = {
  "Todo el equipo": "border-primary/30 text-primary",
  Clínica: "border-blue-500/30 text-blue-600",
  Administración: "border-violet-500/30 text-violet-600",
  "Servicios generales": "border-amber-500/30 text-amber-600",
};

export default function ComunicacionesTab() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [audienceFilter, setAudienceFilter] = useState("todas");

  const filtered = announcements
    .filter((a) => audienceFilter === "todas" || a.audience === audienceFilter)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt));

  const publishDemo = () => {
    setAnnouncements((current) => [
      {
        id: Date.now(),
        title: "Nuevo comunicado",
        body: "Escribí acá el contenido del comunicado (modo demo).",
        author: "Vos",
        publishedAt: new Date().toISOString().slice(0, 10),
        audience: "Todo el equipo",
        pinned: false,
      },
      ...current,
    ]);
    toast.success("Comunicado publicado.");
  };

  return (
    <Card className="shadow-soft">
      <CardContent className="p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold">Comunicaciones internas</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Anuncios y novedades para todo el equipo o áreas específicas.
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={audienceFilter} onValueChange={setAudienceFilter}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las áreas</SelectItem>
                <SelectItem value="Todo el equipo">Todo el equipo</SelectItem>
                <SelectItem value="Clínica">Clínica</SelectItem>
                <SelectItem value="Administración">Administración</SelectItem>
                <SelectItem value="Servicios generales">Servicios generales</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={publishDemo}>
              <Plus className="mr-2 size-4" /> Publicar
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {a.pinned && <Pin className="size-3.5 text-primary" />}
                  <p className="font-semibold">{a.title}</p>
                </div>
                <Badge variant="outline" className={audienceColor[a.audience]}>
                  {a.audience}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {a.author} · {a.publishedAt}
              </p>
            </div>
          ))}
          {!filtered.length && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              <Megaphone className="mx-auto mb-2 size-8 text-muted-foreground/40" />
              No hay comunicados para este filtro.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}