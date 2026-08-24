import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  FolderOpen,
  Lock,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState } from "@/components/app/ui-kit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { plans } from "@/data/demo";
import { getAccount } from "@/lib/account";

export const Route = createFileRoute("/app/documentos")({
  component: DocumentosPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary hover:shadow-lift";

type SecuritySetting = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresBackend?: boolean;
};

const initialSecuritySettings: SecuritySetting[] = [
  {
    id: "two-factor",
    name: "Doble factor obligatorio",
    description: "Para todos los roles administrativos",
    enabled: true,
    requiresBackend: true,
  },
  {
    id: "auto-logout",
    name: "Cierre de sesión automático",
    description: "Tras 30 minutos de inactividad",
    enabled: true,
    requiresBackend: true,
  },
  {
    id: "daily-backups",
    name: "Copias de respaldo diarias",
    description: "Retención de 90 días",
    enabled: true,
    requiresBackend: true,
  },
  {
    id: "ip-restriction",
    name: "Restricción por IP",
    description: "Solo redes autorizadas de la clínica",
    enabled: false,
    requiresBackend: true,
  },
];

function LockedTab({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className={cardStyle}>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Lock className="size-7" />
        </span>

        <div>
          <p className="text-base font-semibold">{title}</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <Button asChild size="sm" className="mt-1">
          <Link to="/app/finanzas">Ver planes</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function SecuritySettingRow({
  setting,
  onChange,
}: {
  setting: SecuritySetting;
  onChange: (id: string, enabled: boolean) => void;
}) {
  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-transparent p-3 transition-colors hover:border-primary/15 hover:bg-background/60">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
            setting.enabled
              ? "bg-primary-soft text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {setting.enabled ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <Lock className="size-4" />
          )}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-medium">{setting.name}</p>
          <p className="text-xs leading-5 text-muted-foreground">
            {setting.description}
          </p>
        </div>
      </div>

      <Switch
        checked={setting.enabled}
        onCheckedChange={(checked) => onChange(setting.id, checked)}
        aria-label={`${setting.name}: ${setting.enabled ? "activado" : "desactivado"}`}
      />
    </div>
  );
}

function DocumentosPage() {
  const account = getAccount();
  const plan = plans.find((p) => p.id === account?.planId);
  const hasSeguridad = !!plan?.modules.includes("seguridad");

  const [securitySettings, setSecuritySettings] = useState(
    initialSecuritySettings,
  );

  const handleUpload = () => {
    toast.info("Carga de documentos", {
      description:
        "La interfaz está preparada. El almacenamiento real requiere backend.",
    });
  };

  const handleSecurityChange = (id: string, enabled: boolean) => {
    setSecuritySettings((current) =>
      current.map((setting) =>
        setting.id === id ? { ...setting, enabled } : setting,
      ),
    );

    const setting = securitySettings.find((item) => item.id === id);

    toast.success(
      `${setting?.name ?? "Configuración"} ${enabled ? "activada" : "desactivada"}`,
      {
        description:
          "El cambio queda aplicado en la interfaz. La persistencia real requiere backend.",
      },
    );
  };

  return (
    <>
      <PageHeader
        title="Documentos y seguridad"
        description="Gestioná consentimientos, documentos de pacientes y las políticas de seguridad de tu clínica."
        actions={
          <Button className="gap-2" onClick={handleUpload}>
            <Upload className="size-4" />
            Subir documento
          </Button>
        }
      />

      <Tabs defaultValue="documentos" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap gap-1">
          <TabsTrigger value="documentos" className="gap-1.5">
            <FolderOpen className="size-4" />
            Documentos
          </TabsTrigger>

          <TabsTrigger value="seguridad" className="gap-1.5">
            <ShieldCheck className="size-4" />
            Seguridad
            {!hasSeguridad ? <Lock className="size-3" /> : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentos" className="mt-4 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className={cardStyle}>
              <CardContent className="flex items-center gap-3 p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <FileText className="size-5" />
                </span>

                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">
                    Documentos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardContent className="flex items-center gap-3 p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <FileCheck2 className="size-5" />
                </span>

                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">
                    Firmados
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardContent className="flex items-center gap-3 p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <ClipboardList className="size-5" />
                </span>

                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">
                    Pendientes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className={cardStyle}>
            <CardContent className="p-6">
              <EmptyState
                icon={FolderOpen}
                title="Todavía no hay documentos cargados"
                description="Podés preparar consentimientos informados, contratos, formularios y otros documentos. La gestión real de archivos y su almacenamiento requiere backend."
                action={
                  <Button
                    className="gap-1.5"
                    onClick={handleUpload}
                  >
                    <Upload className="size-4" />
                    Subir primer documento
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="mt-4">
          {hasSeguridad ? (
            <div className="grid gap-5 lg:grid-cols-2">
              <Card className={cardStyle}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldCheck className="size-4 text-success" />
                    Seguridad y respaldos
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-1">
                  {securitySettings.map((setting) => (
                    <SecuritySettingRow
                      key={setting.id}
                      setting={setting}
                      onChange={handleSecurityChange}
                    />
                  ))}
                </CardContent>
              </Card>

              <Card className={cardStyle}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ClipboardList className="size-4 text-primary" />
                    Auditoría de actividad
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <EmptyState
                    icon={ClipboardList}
                    title="Sin actividad registrada todavía"
                    description="La interfaz está preparada para mostrar las acciones importantes del equipo: cambios de citas, facturación, permisos, configuración y otras operaciones."
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <LockedTab
              title="Seguridad no está en tu plan actual"
              description="Doble factor, cierre de sesión automático, respaldos y auditoría están disponibles en los planes que incluyen este módulo."
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}