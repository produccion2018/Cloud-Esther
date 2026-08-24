import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Link2,
  MapPin,
  Settings2,
  Wallet,
  Users2,
  Activity,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState, StatCard } from "@/components/app/ui-kit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { plans } from "@/data/demo";
import { getAccount } from "@/lib/account";

export const Route = createFileRoute("/app/multiempresa")({
  component: MultiempresaPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

const statusLegend = [
  {
    label: "Activa",
    tone: "bg-success",
  },
  {
    label: "En mantenimiento",
    tone: "bg-warning",
  },
  {
    label: "Inactiva",
    tone: "bg-destructive",
  },
];

const WORLD_ATLAS_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Branch = {
  id: string;
  name: string;
  address: string;
  status: "Activa" | "En mantenimiento" | "Inactiva";
};

function WorldMap() {
  return (
    <div className="h-64 w-full overflow-hidden rounded-2xl bg-muted">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: 140,
          center: [-40, 10],
        }}
        width={800}
        height={420}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Geographies geography={WORLD_ATLAS_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="var(--primary-soft)"
                stroke="var(--border)"
                strokeWidth={0.6}
                style={{
                  default: {
                    outline: "none",
                  },
                  hover: {
                    outline: "none",
                    fill: "var(--primary-soft)",
                  },
                  pressed: {
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

function BranchStatus({
  status,
}: {
  status: Branch["status"];
}) {
  const config = {
    Activa: {
      icon: CheckCircle2,
      className: "text-success",
    },
    "En mantenimiento": {
      icon: Settings2,
      className: "text-warning",
    },
    Inactiva: {
      icon: Activity,
      className: "text-destructive",
    },
  };

  const item = config[status];
  const Icon = item.icon;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <Icon className={`size-3.5 ${item.className}`} />
      {status}
    </span>
  );
}

function MultiempresaPage() {
  const account = getAccount();

  const plan =
    plans.find((p) => p.id === account?.planId) ?? plans[0];

  const [selectedBranch, setSelectedBranch] = useState("all");

  /*
   * Las sucursales reales deberán venir posteriormente del backend.
   * No se inventan clínicas ni direcciones.
   */
  const branches: Branch[] = [];

  const visibleBranches = useMemo(() => {
    if (selectedBranch === "all") {
      return branches;
    }

    return branches.filter(
      (branch) => branch.id === selectedBranch,
    );
  }, [branches, selectedBranch]);

  const activeBranches = branches.filter(
    (branch) => branch.status === "Activa",
  ).length;

  const maintenanceBranches = branches.filter(
    (branch) => branch.status === "En mantenimiento",
  ).length;

  const inactiveBranches = branches.filter(
    (branch) => branch.status === "Inactiva",
  ).length;

  function handleLinkBranch() {
    toast.info("Formulario para vincular una nueva sucursal.");
  }

  function handleBranchChange(value: string) {
    setSelectedBranch(value);

    if (value === "all") {
      toast.info("Mostrando todas las sucursales.");
      return;
    }

    const branch = branches.find((item) => item.id === value);

    if (branch) {
      toast.success(`Sucursal seleccionada: ${branch.name}`);
    }
  }

  return (
    <>
      <PageHeader
        title="Administración multiempresa"
        description="Un solo panel para administrar grupos odontológicos, empresas y sucursales desde un mismo entorno."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              asChild
            >
              <Link to="/app/configuracion">
                <Settings2 className="size-4" />
                Configuración
              </Link>
            </Button>

            <Button
              className="gap-2"
              onClick={handleLinkBranch}
            >
              <Link2 className="size-4" />
              Vincular sucursal
            </Button>
          </div>
        }
      />

      {/* CONTEXTO EMPRESA / SUCURSAL */}
      <Card className={cardStyle}>
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                <h2 className="font-display text-base font-bold">
                  Contexto de administración
                </h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Seleccioná la sucursal sobre la que querés trabajar.
                Cuando exista un grupo odontológico, Esther también podrá
                utilizar este contexto.
              </p>
            </div>

            <div className="w-full lg:w-72">
              <Select
                value={selectedBranch}
                onValueChange={handleBranchChange}
                disabled={branches.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    Todas las sucursales
                  </SelectItem>

                  {branches.map((branch) => (
                    <SelectItem
                      key={branch.id}
                      value={branch.id}
                    >
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {branches.length === 0 ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                <Building2 className="size-5 text-primary" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Todavía no hay sucursales vinculadas
                </p>

                <p className="text-xs text-muted-foreground">
                  Cuando agregues una sede, aparecerá automáticamente
                  en este selector.
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* MÉTRICAS */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Sucursales"
          value={branches.length}
          icon={Building2}
          hint={`Límite: ${plan?.branches ?? "—"}`}
        />

        <StatCard
          label="Activas"
          value={activeBranches}
          icon={CheckCircle2}
          tone="success"
        />

        <StatCard
          label="Mantenimiento"
          value={maintenanceBranches}
          icon={Settings2}
          tone="warning"
        />

        <StatCard
          label="Inactivas"
          value={inactiveBranches}
          icon={Activity}
          tone="danger"
        />

        <StatCard
          label="Facturación consolidada"
          value="—"
          icon={Wallet}
          hint="Sin datos todavía"
        />
      </div>

      {/* MAPA */}
      <Card className={`${cardStyle} mt-5`}>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              Mapa de clínicas
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Visualización geográfica de las sedes vinculadas.
            </p>
          </div>

          <Button
            asChild
            variant="ghost"
            size="sm"
          >
            <Link to="/app/configuracion">
              Configurar sucursales
              <ChevronDown className="ml-1 size-4 rotate-[-90deg]" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          <WorldMap />

          {visibleBranches.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                icon={MapPin}
                title="Todavía no hay ubicaciones configuradas"
                description="Cuando cargues la dirección de cada sede en Configuración, las ubicaciones podrán utilizarse para mostrar las clínicas en el mapa."
                action={
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                  >
                    <Link to="/app/configuracion">
                      Ir a Configuración
                    </Link>
                  </Button>
                }
              />
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
            {statusLegend.map((status) => (
              <span
                key={status.label}
                className="inline-flex items-center gap-1.5"
              >
                <span
                  className={`size-2 rounded-full ${status.tone}`}
                />
                {status.label}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* LISTADO DE SUCURSALES */}
      <Card className={`${cardStyle} mt-5`}>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Sucursales vinculadas
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Administración individual de cada sede.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={handleLinkBranch}
          >
            <Link2 className="size-4" />
            Vincular
          </Button>
        </CardHeader>

        <CardContent>
          {visibleBranches.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No hay sucursales vinculadas"
              description="Vinculá una sucursal para comenzar a administrar sus datos, usuarios, agenda y actividad."
              action={
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={handleLinkBranch}
                >
                  <Link2 className="size-4" />
                  Vincular sucursal
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {visibleBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex flex-col gap-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
                      <Building2 className="size-5 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {branch.name}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {branch.address}
                      </p>

                      <div className="mt-2">
                        <BranchStatus status={branch.status} />
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.info(
                        `Administrar ${branch.name}`,
                      )
                    }
                  >
                    Administrar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CONSOLIDADO */}
      <Card className={`${cardStyle} mt-5`}>
        <CardHeader>
          <CardTitle className="text-base">
            Consolidado del grupo
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="size-4" />
                <span className="text-xs">
                  Facturación
                </span>
              </div>

              <p className="mt-2 text-lg font-bold">
                —
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Sin datos todavía
              </p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users2 className="size-4" />
                <span className="text-xs">
                  Pacientes
                </span>
              </div>

              <p className="mt-2 text-lg font-bold">
                —
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Sin datos todavía
              </p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="size-4" />
                <span className="text-xs">
                  Ocupación
                </span>
              </div>

              <p className="mt-2 text-lg font-bold">
                —
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Sin datos todavía
              </p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="size-4" />
                <span className="text-xs">
                  Sedes activas
                </span>
              </div>

              <p className="mt-2 text-lg font-bold">
                {activeBranches}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                De {branches.length} vinculadas
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-primary-soft/50 p-4">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 size-5 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  Preparado para grupos odontológicos
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Esta sección está preparada para trabajar con
                  múltiples empresas y sucursales. La consolidación
                  real de datos dependerá de la integración del
                  backend multi-tenant.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}