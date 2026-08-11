import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Gift, Globe, Star, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { StatCard } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, dentists, leads } from "@/data/demo";

export const Route = createFileRoute("/app/marketing")({
  component: MarketingPage,
});

const stages = ["Nuevo", "Contactado", "Presupuesto", "Agendado"];

function MarketingPage() {
  return (
    <>
      <PageHeader
        title="Marketing y captación"
        description="Perfil público, leads, campañas, referidos y reseñas verificadas de la clínica."
        actions={
          <Button variant="outline" className="gap-2" onClick={() => toast.info("Abriendo página pública de la clínica")}>
            <ExternalLink className="size-4" /> Ver página pública
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Leads del mes" value="133" delta={18} icon={Users} />
        <StatCard label="Tasa de conversión" value="34 %" delta={6} icon={TrendingUp} tone="success" />
        <StatCard label="Valoración media" value="4,8 / 5" delta={2} icon={Star} tone="warning" hint="212 reseñas" />
        <StatCard label="Visitas a la web" value="8.412" delta={11} icon={Globe} tone="info" />
      </div>

      <Tabs defaultValue="leads" className="mt-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="perfil">Perfil público</TabsTrigger>
          <TabsTrigger value="referidos">Referidos</TabsTrigger>
          <TabsTrigger value="resenas">Reseñas</TabsTrigger>
          <TabsTrigger value="contenido">Contenido</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="mt-4 space-y-5">
          <div className="grid gap-4 lg:grid-cols-4">
            {stages.map((s) => (
              <Card key={s} className="shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    {s}
                    <Badge variant="secondary">{leads.filter((l) => l.stage === s).length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {leads.filter((l) => l.stage === s).map((l) => (
                    <div key={l.id} className="rounded-xl border border-border p-3">
                      <p className="text-sm font-semibold">{l.name}</p>
                      <p className="text-xs text-muted-foreground">{l.interest}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">{l.source}</Badge>
                        <span className="text-xs font-medium">{currency(l.value)}</span>
                      </div>
                    </div>
                  ))}
                  {leads.filter((l) => l.stage === s).length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      Sin leads en esta etapa
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Origen de los leads</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Canal</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Citas</TableHead>
                    <TableHead>Conversión</TableHead>
                    <TableHead>Ingresos atribuidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { c: "Google Ads", l: 48, a: 19, v: "40 %", i: 18400 },
                    { c: "Instagram", l: 33, a: 9, v: "27 %", i: 6200 },
                    { c: "Directorio DentalisPro", l: 26, a: 12, v: "46 %", i: 11800 },
                    { c: "Referidos", l: 18, a: 11, v: "61 %", i: 9400 },
                    { c: "Web de la clínica", l: 8, a: 4, v: "50 %", i: 3900 },
                  ].map((r) => (
                    <TableRow key={r.c}>
                      <TableCell className="font-medium">{r.c}</TableCell>
                      <TableCell>{r.l}</TableCell>
                      <TableCell>{r.a}</TableCell>
                      <TableCell><Badge variant="secondary">{r.v}</Badge></TableCell>
                      <TableCell className="font-medium">{currency(r.i)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perfil" className="mt-4">
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="shadow-soft lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Página pública de la clínica</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-2xl bg-hero-gradient p-6 text-primary-foreground">
                  <p className="font-display text-xl font-bold">Grupo Dental Arriaga</p>
                  <p className="mt-1 text-primary-foreground/85">
                    Odontología integral, implantología y ortodoncia invisible · 3 sedes
                  </p>
                  <Button size="sm" variant="secondary" className="mt-4">Reservar cita online</Button>
                </div>
                <div>
                  <p className="font-semibold">Especialidades destacadas</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Implantología", "Ortodoncia invisible", "Estética dental", "Endodoncia", "Odontopediatría"].map((e) => (
                      <Badge key={e} variant="secondary">{e}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Formularios de captación activos</p>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>· Primera consulta gratuita — 62 envíos este mes</li>
                    <li>· Presupuesto de ortodoncia — 41 envíos</li>
                    <li>· Urgencias 24 h — 30 envíos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Equipo publicado</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {dentists.map((d) => (
                  <div key={d.id} className="rounded-xl border border-border p-3">
                    <p className="text-sm font-semibold">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.specialty}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referidos" className="mt-4">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-success-soft text-success">
                  <Gift className="size-5" />
                </span>
                <div>
                  <p className="text-base font-semibold">Programa “Trae a un amigo”</p>
                  <p className="text-sm text-muted-foreground">
                    30 € de descuento para el paciente que refiere y 20 € para el nuevo paciente.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { l: "Referidos este mes", v: "18" },
                  { l: "Convertidos en cita", v: "11" },
                  { l: "Ingresos generados", v: currency(9400) },
                ].map((k) => (
                  <div key={k.l} className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted-foreground">{k.l}</p>
                    <p className="mt-1 font-display text-xl font-bold">{k.v}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resenas" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { n: "María J.", t: "Trato excelente y puntualidad absoluta. El recordatorio por WhatsApp es muy cómodo.", s: 5 },
              { n: "Carlos R.", t: "Me explicaron el presupuesto con detalle y lo firmé desde el móvil.", s: 5 },
              { n: "Lucía P.", t: "Muy buena atención, aunque la sala de espera estaba llena.", s: 4 },
              { n: "Andrés M.", t: "El implante fue indoloro y el seguimiento posterior impecable.", s: 5 },
            ].map((r) => (
              <Card key={r.n} className="shadow-soft">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{r.n}</p>
                    <div className="flex">
                      {Array.from({ length: r.s }).map((_, i) => (
                        <Star key={i} className="size-4 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">“{r.t}”</p>
                  <Badge variant="secondary" className="mt-3">Reseña verificada</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contenido" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { t: "Cómo cuidar tus implantes dentales", tipo: "Blog", v: "1.240 lecturas" },
              { t: "Ortodoncia invisible: preguntas frecuentes", tipo: "Vídeo", v: "3.870 visualizaciones" },
              { t: "Guía de higiene infantil", tipo: "Descargable", v: "412 descargas" },
            ].map((c) => (
              <Card key={c.t} className="shadow-soft">
                <CardContent className="p-5">
                  <Badge variant="outline">{c.tipo}</Badge>
                  <p className="mt-3 text-sm font-semibold">{c.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.v}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
