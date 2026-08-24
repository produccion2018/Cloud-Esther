import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  MessageCircleQuestion,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/app/DashboardShell";
import { EstherCharacter, type EstherPose } from "@/components/app/EstherCharacter";
import { EmptyState } from "@/components/app/ui-kit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/ia-esther")({
  component: IaEstherPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

function IaEstherPage() {
  const [visible, setVisible] = useState(true);
  const [pose, setPose] = useState<EstherPose>("idle");

  function toggle(target: EstherPose) {
    setPose((p) => (p === target ? "idle" : target));
  }

  return (
    <>
      <PageHeader
        title="IA Esther"
        description="Tu asistente dentro de Cloud Esther — probá acá abajo cómo se ve y se mueve, antes de decidir dónde más mostrarla en el panel."
      />

      <Card className={cardStyle}>
        <CardContent className="flex flex-col items-center gap-6 p-10">
          <div className="flex min-h-[300px] items-center justify-center">
            <EstherCharacter
              visible={visible}
              pose={pose}
              size={260}
              onGestureComplete={() => setPose("idle")}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={() => setVisible((v) => !v)}>
              {visible ? "Ocultar" : "Mostrar"}
            </Button>
            <Button onClick={() => setPose("greeting")} disabled={!visible}>
              Saludar
            </Button>
            <Button
              variant={pose === "thinking" ? "default" : "outline"}
              onClick={() => toggle("thinking")}
              disabled={!visible}
            >
              Pensando
            </Button>
            <Button
              variant={pose === "speaking" ? "default" : "outline"}
              onClick={() => toggle("speaking")}
              disabled={!visible}
            >
              Hablando
            </Button>
            <Button
              variant={pose === "listening" ? "default" : "outline"}
              onClick={() => toggle("listening")}
              disabled={!visible}
            >
              Escuchando
            </Button>
            <Button onClick={() => setPose("celebrating")} disabled={!visible}>
              Festejar
            </Button>
            <Button onClick={() => setPose("confused")} disabled={!visible}>
              Confundida
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Tip: cuando está en reposo, hacele clic a Esther para una reacción sorpresa — y movés el mouse cerca de ella para ver cómo te sigue con la mirada.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="asistente" className="mt-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="asistente">Asistente</TabsTrigger>
          <TabsTrigger value="apoyo">Apoyo clínico</TabsTrigger>
          <TabsTrigger value="gestion">Gestión y alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="asistente" className="mt-4">
          <Card className={cardStyle}>
            <CardContent className="p-6">
              <EmptyState
                icon={MessageCircleQuestion}
                title="El chat con Esther todavía no está conectado"
                description="Acá va a poder responder preguntas sobre tu clínica, ayudarte a encontrar información y guiarte por el panel — por ahora estamos armando solo su presencia visual."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apoyo" className="mt-4">
          <Card className={cardStyle}>
            <CardContent className="p-6">
              <EmptyState
                icon={Stethoscope}
                title="Apoyo clínico todavía no está conectado"
                description="Sugerencias sobre tratamientos, interacciones y protocolos van a aparecer acá una vez que Esther tenga su motor de IA conectado."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gestion" className="mt-4">
          <Card className={cardStyle}>
            <CardContent className="p-6">
              <EmptyState
                icon={AlertTriangle}
                title="Sin alertas de gestión todavía"
                description="Esther va a poder avisarte de cosas como stock bajo, pagos pendientes o turnos sin confirmar, apenas esté conectada al resto del sistema."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}