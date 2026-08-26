import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Download, Lock, Plus, Stethoscope, Workflow } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAccount } from "@/lib/account";
import { plans } from "@/data/demo";

export const Route = createFileRoute("/app/equipo")({
  component: EquipoPage,
});

// Estilo de tarjeta compartido por TODAS las Card de este archivo: fondo con
// degradé violeta/lavanda muy sutil (mismo tono que --gradient-soft, hue 292,
// la identidad de marca) que se apaga a transparente, borde violeta suave en
// reposo, y hover con borde violeta sólido + sombra + se levanta un toque.
const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

function LockedTab({ title, description }: { title: string; description: string }) {
  return (
    <Card className={cardStyle}>
      <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Lock className="size-6" />
        </span>
        <div>
          <p className="text-base font-semibold">{title}</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild size="sm" className="mt-2">
          <Link to="/app/finanzas">Ver planes</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function EquipoPage() {
  const account = getAccount();
  const plan = plans.find((p) => p.id === account?.planId);
  const hasRRHH = !!plan?.modules.includes("recursos-humanos");
  const hasAutomatizacion = !!plan?.modules.includes("equipo-profesional");

  return (
    <>
      <PageHeader
        title="Equipo y RRHH"
        description="Odontólogos y asistentes con su propia agenda, legajos de personal y automatización con IA."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => toast.info("Todavía no hay datos para exportar.")}
          >
            <Download className="size-4" /> Exportar (Excel / PDF)
          </Button>
        }
      />

      <Tabs defaultValue="equipo">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="equipo">Equipo</TabsTrigger>
          <TabsTrigger value="rrhh" className="gap-1.5">
            Recursos humanos
            {!hasRRHH ? <Lock className="size-3" /> : null}
          </TabsTrigger>
          <TabsTrigger value="automatizacion" className="gap-1.5">
            Automatización n8n
            {!hasAutomatizacion ? <Lock className="size-3" /> : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipo" className="mt-4">
          <Card className={cardStyle}>
            <CardContent className="p-6">
              <EmptyState
                icon={Stethoscope}
                title="Todavía no cargaste al equipo"
                description="Agregá odontólogos y asistentes para asignarles agenda, especialidad y comisiones por tratamiento."
                action={
                  <Button
                    className="gap-1.5"
                    onClick={() => toast.info("Formulario de alta de profesional")}
                  >
                    <Plus className="size-4" /> Agregar profesional
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rrhh" className="mt-4">
          {hasRRHH ? (
            <Card className={cardStyle}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant="secondary">Con IA</Badge>
                  <p className="text-xs text-muted-foreground">
                    Vacaciones, nómina, contratos y capacitación del equipo.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Módulo disponible</Badge>
                    <p className="text-xs text-muted-foreground">
                      Gestión de empleados, legajos, documentación, vacaciones, licencias y nómina.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-primary/15 bg-background/60 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">Abrir Recursos humanos</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Accedé al módulo completo para cargar empleados y administrar sus documentos.
                        </p>
                      </div>
                      <Button asChild className="shrink-0 gap-1.5">
                        <Link to="/app/recursos-humanos">
                          <Briefcase className="size-4" /> Abrir módulo
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <LockedTab
              title="Recursos humanos no está en tu plan actual"
              description="Legajos, vacaciones, nómina y contratos con ayuda de IA están disponibles desde el plan Profesional."
            />
          )}
        </TabsContent>

        <TabsContent value="automatizacion" className="mt-4">
          {hasAutomatizacion ? (
            <Card className={cardStyle}>
              <CardContent className="p-6">
                <EmptyState
                  icon={Workflow}
                  title="Todavía no conectaste ninguna automatización"
                  description="Con n8n podés encadenar acciones automáticas para tu equipo — por ejemplo, que al cargar un empleado nuevo se le envíe solo el checklist de capacitación por WhatsApp, se cree su usuario y se avise al gerente, sin que nadie tenga que acordarse de hacerlo a mano."
                  action={<Button size="sm">Conectar n8n</Button>}
                />
              </CardContent>
            </Card>
          ) : (
            <LockedTab
              title="Automatización n8n no está en tu plan actual"
              description="Encadená acciones automáticas para tu equipo (capacitación, altas, avisos) desde el plan Avanzada en adelante."
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}