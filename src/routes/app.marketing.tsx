import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  ExternalLink,
  FileText,
  Gift,
  Globe,
  MessageSquareText,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState, StatCard } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currency, dentists, leads } from "@/data/demo";

export const Route = createFileRoute("/app/marketing")({
  component: MarketingPage,
});

// Estilo de tarjeta compartido por TODAS las Card de este archivo: fondo con
// degradé violeta/lavanda muy sutil (mismo tono que --gradient-soft, hue 292,
// la identidad de marca) que se apaga a transparente, borde violeta suave en
// reposo, y hover con borde violeta sólido + sombra + se levanta un toque.
const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

const stages = ["Nuevo", "Contactado", "Presupuesto", "Agendado"];

function MarketingPage() {
  const agendados = leads.filter((l) => l.stage === "Agendado").length;
  const enSeguimiento = leads.length - agendados;

  return (
    <>
      <PageHeader
        title="Marketing y captación"
        description="Leads, perfil público, referidos, contenido y presencia de tu clínica en el directorio de Cloud Esther."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => toast.info("Abriendo página pública de la clínica")}
          >
            <ExternalLink className="size-4" /> Ver página pública
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Leads totales"
          value={String(leads.length)}
          icon={Users}
          hint={`${agendados} agendados`}
        />
        <StatCard
          label="En seguimiento"
          value={String(enSeguimiento)}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Valoración media"
          value="—"
          icon={Star}
          tone="warning"
          hint="Sin reseñas todavía"
        />
        <StatCard
          label="Visitas al perfil"
          value="—"
          icon={Globe}
          tone="info"
          hint="Sin datos de tráfico todavía"
        />
      </div>

      <Tabs defaultValue="marketing" className="mt-6">
        <TabsList>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="directorio">Directorio público</TabsTrigger>
        </TabsList>

        {/* ---------- MARKETING ---------- */}
        <TabsContent value="marketing" className="mt-4">
          <Tabs defaultValue="leads">
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
                  <Card key={s} className={cardStyle}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        {s}
                        <Badge variant="secondary">
                          {leads.filter((l) => l.stage === s).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {leads
                        .filter((l) => l.stage === s)
                        .map((l) => (
                          <div key={l.id} className="rounded-xl border border-border p-3">
                            <p className="text-sm font-semibold">{l.name}</p>
                            <p className="text-xs text-muted-foreground">{l.interest}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <Badge variant="outline" className="text-[10px]">
                                {l.source}
                              </Badge>
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

              <EmptyState
                icon={TrendingUp}
                title="Todavía no hay datos de origen por canal"
                description="Cuando conectes Google Ads, redes sociales o el directorio público, vas a ver acá cuántos leads y qué ingresos trae cada canal."
              />
            </TabsContent>

            <TabsContent value="perfil" className="mt-4">
              <div className="grid gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <EmptyState
                    icon={Globe}
                    title="Tu página pública todavía no está configurada"
                    description="Cargá el nombre de la clínica, especialidades destacadas y formularios de captación para publicar tu página."
                    action={<Button size="sm">Configurar página pública</Button>}
                  />
                </div>
                <Card className={cardStyle}>
                  <CardHeader>
                    <CardTitle className="text-base">Equipo publicado</CardTitle>
                  </CardHeader>
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
              <EmptyState
                icon={Gift}
                title="Todavía no armaste un programa de referidos"
                description="Definí un beneficio para el paciente que recomienda y otro para el paciente nuevo, y acá vas a ver cuántos referidos se convirtieron en citas."
                action={<Button size="sm">Crear programa de referidos</Button>}
              />
            </TabsContent>

            <TabsContent value="resenas" className="mt-4">
              <EmptyState
                icon={MessageSquareText}
                title="Todavía no hay reseñas verificadas"
                description="Las reseñas que dejen tus pacientes desde el portal del paciente o el directorio público van a aparecer acá."
              />
            </TabsContent>

            <TabsContent value="contenido" className="mt-4">
              <EmptyState
                icon={FileText}
                title="Todavía no publicaste contenido"
                description="Blogs, videos y guías descargables que compartas con tus pacientes van a listarse acá, con sus lecturas y descargas."
                action={<Button size="sm">Crear contenido</Button>}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ---------- DIRECTORIO PÚBLICO ---------- */}
        <TabsContent value="directorio" className="mt-4">
          <EmptyState
            icon={Building2}
            title="Tu clínica todavía no está publicada en el directorio"
            description="El directorio público de Cloud Esther es un buscador donde pacientes de cualquier clínica que use la plataforma pueden encontrarte por especialidad y ubicación. Publicá tu ficha para empezar a recibir leads desde ahí (ya aparece como canal en el origen de tus leads)."
            action={<Button size="sm">Publicar en el directorio</Button>}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}