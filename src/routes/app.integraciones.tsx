import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Globe,
  Mail,
  MessagesSquare,
  Plug,
  Receipt,
  ScanLine,
  Send,
  Webhook,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { StatCard } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/app/integraciones")({
  component: IntegracionesPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: typeof Plug;
  category: string;
  available: boolean;
};

const integrations: Integration[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    description:
      "Enviá recordatorios, confirmaciones y comunicaciones desde el WhatsApp de la clínica.",
    icon: MessagesSquare,
    category: "Comunicación",
    available: true,
  },
  {
    id: "email",
    name: "Correo electrónico",
    description:
      "Enviá recordatorios, comprobantes, presupuestos y comunicaciones por email.",
    icon: Mail,
    category: "Comunicación",
    available: true,
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description:
      "Sincronizá los turnos de cada odontólogo con su calendario de Google.",
    icon: CalendarDays,
    category: "Agenda",
    available: true,
  },
  {
    id: "pagos",
    name: "Pasarela de pagos",
    description:
      "Cobrá presupuestos y facturas con tarjeta desde el propio panel.",
    icon: CreditCard,
    category: "Finanzas",
    available: true,
  },
  {
    id: "facturacion",
    name: "Facturación electrónica",
    description:
      "Emití comprobantes fiscales válidos directamente desde Finanzas.",
    icon: Receipt,
    category: "Finanzas",
    available: true,
  },
  {
    id: "n8n",
    name: "n8n",
    description:
      "Automatizá procesos entre Cloud Esther y otras herramientas mediante workflows.",
    icon: Workflow,
    category: "Automatización",
    available: true,
  },
  {
    id: "doctoralia",
    name: "Doctoralia",
    description:
      "Sincronizá tu agenda con tu perfil de Doctoralia para evitar cargar turnos dos veces.",
    icon: Globe,
    category: "Agenda",
    available: true,
  },
  {
    id: "dicom",
    name: "Radiología digital (DICOM)",
    description:
      "Importá radiografías y estudios desde equipos compatibles con DICOM.",
    icon: ScanLine,
    category: "Clínico",
    available: true,
  },
  {
    id: "webhooks",
    name: "Webhooks personalizados",
    description:
      "Enviá eventos de Cloud Esther hacia sistemas externos.",
    icon: Webhook,
    category: "Desarrolladores",
    available: true,
  },
];

const reminderChannels = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Recordatorios y confirmaciones por WhatsApp.",
    icon: MessagesSquare,
  },
  {
    id: "email",
    name: "Email",
    description: "Recordatorios y comunicaciones por correo.",
    icon: Mail,
  },
];

function IntegracionesPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    whatsapp: false,
    email: false,
  });

  function toggleIntegration(id: string, name: string) {
    setConnected((prev) => {
      const next = !prev[id];

      toast.info(
        next
          ? `${name} quedó marcada para configuración. La conexión real requiere sus credenciales/API.`
          : `${name} desactivada.`,
      );

      return {
        ...prev,
        [id]: next,
      };
    });
  }

  function toggleReminder(id: string, name: string) {
    setReminders((prev) => {
      const next = !prev[id];

      toast.info(
        next
          ? `${name}: recordatorios preparados para configuración.`
          : `${name}: recordatorios desactivados.`,
      );

      return {
        ...prev,
        [id]: next,
      };
    });
  }

  const connectedCount = useMemo(
    () => Object.values(connected).filter(Boolean).length,
    [connected],
  );

  const activeReminderChannels = useMemo(
    () => Object.values(reminders).filter(Boolean).length,
    [reminders],
  );

  return (
    <>
      <PageHeader
        title="Integraciones"
        description="Conectá Cloud Esther con las herramientas que ya usa tu clínica."
      />

      {/* RESUMEN */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Integraciones activas"
          value={String(connectedCount)}
          icon={Plug}
          tone="success"
        />

        <StatCard
          label="Disponibles"
          value={String(integrations.length)}
          icon={Globe}
        />

        <StatCard
          label="Canales de recordatorio"
          value={String(activeReminderChannels)}
          icon={Send}
          tone="info"
        />

        <StatCard
          label="Webhooks"
          value={connected.webhooks ? "Activo" : "0"}
          icon={Webhook}
          tone="warning"
        />
      </div>

      {/* RECORDATORIOS */}
      <Card className={`${cardStyle} mt-6`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Send className="size-5 text-primary" />
            Recordatorios automáticos
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border bg-primary-soft/30 p-4">
            <p className="text-sm font-semibold">
              Recordatorios de turnos
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Configurá los canales que Cloud Esther podrá utilizar para
              recordar turnos y solicitar confirmaciones a los pacientes.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {reminderChannels.map((channel) => {
              const Icon = channel.icon;
              const enabled = !!reminders[channel.id];

              return (
                <div
                  key={channel.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="size-5" />
                    </span>

                    <div>
                      <p className="text-sm font-semibold">
                        {channel.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {channel.description}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={enabled}
                    onCheckedChange={() =>
                      toggleReminder(channel.id, channel.name)
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-dashed border-primary/30 p-4">
            <CheckCircle2 className="size-4 shrink-0 text-primary" />

            <p className="text-xs text-muted-foreground">
              Los canales pueden quedar preparados desde el panel. La
              conexión efectiva con WhatsApp, email u otros proveedores
              requiere configurar sus APIs y credenciales.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* INTEGRACIONES */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isConfigured = !!connected[integration.id];

          return (
            <Card key={integration.id} className={cardStyle}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="size-5" />
                    </span>

                    <div>
                      <p className="text-sm font-semibold">
                        {integration.name}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <Badge
                          variant={
                            isConfigured ? "default" : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {isConfigured
                            ? "Preparado"
                            : "No configurado"}
                        </Badge>

                        <Badge
                          variant="outline"
                          className="text-[10px]"
                        >
                          {integration.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Switch
                    checked={isConfigured}
                    onCheckedChange={() =>
                      toggleIntegration(
                        integration.id,
                        integration.name,
                      )
                    }
                  />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {integration.description}
                </p>

                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() =>
                    toast.info(
                      `${integration.name}: configuración avanzada pendiente de integración real.`,
                    )
                  }
                >
                  Configurar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}