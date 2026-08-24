import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  CalendarCheck,
  CalendarX2,
  Command,
  FileSpreadsheet,
  FileText,
  Gauge,
  Plus,
  Printer,
  Search,
  Share2,
  Stethoscope,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState, StatCard } from "@/components/app/ui-kit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { dentists } from "@/data/demo";
import { getAccount } from "@/lib/account";
import heroEscena from "@/assets/hero-escena.png";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const quickAccess = [
  { label: "Agenda del día", icon: CalendarCheck, to: "/app/agenda" },
  { label: "Buscar paciente", icon: Users, to: "/app/pacientes" },
  { label: "Crear presupuesto", icon: FileSpreadsheet, to: "/app/presupuestos" },
  { label: "Recordatorios", icon: Activity, to: "/app/notificaciones" },
];

const chartActions = [
  { label: "PDF", icon: FileText },
  { label: "Excel", icon: FileSpreadsheet },
  { label: "Imprimir", icon: Printer },
  { label: "Compartir", icon: Share2 },
];

const emptyMonths = ["Mar", "Abr", "May", "Jun", "Jul", "Ago"].map((month) => ({
  month,
  ingresos: 0,
}));

const emptyProduction = dentists.map((d) => ({
  name: d.name.split(" ").slice(-1)[0],
  produccion: 0,
}));

function Dashboard() {
  const account = getAccount();
  const firstName = account?.contactName.split(" ")[0] ?? "";

  return (
    <>
      <div className="relative mb-5 overflow-hidden rounded-3xl bg-hero-gradient p-6 text-primary-foreground shadow-lift sm:p-8">
        <img
          src={heroEscena}
          alt=""
          className="pointer-events-none absolute -right-8 top-1/2 hidden w-64 -translate-y-1/2 opacity-90 drop-shadow-2xl lg:block xl:w-72"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
              {firstName ? `Hola, ${firstName}` : "Hola"}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Centro de operaciones
            </h1>
            <p className="mt-1 max-w-md text-sm text-primary-foreground/85">
              Todo lo que pasa hoy en {account?.clinicName ?? "tu clínica"}, en una sola pantalla.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild className="gap-2 rounded-full shadow-lift">
              <Link to="/app/agenda">
                <Plus className="size-4" /> Nueva cita
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2 rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/app/pacientes">
                <UserPlus className="size-4" /> Nuevo paciente
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar paciente, turno, factura…"
          className="h-12 rounded-2xl border-border bg-card pl-11 pr-16 text-sm shadow-soft"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex">
          <Command className="size-2.5" />K
        </kbd>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Citas del día" value="0" icon={CalendarCheck} hint="Todavía no cargaste citas" />
        <StatCard label="Pacientes nuevos" value="0" icon={UserPlus} hint="este mes" />
        <StatCard label="Tratamientos activos" value="0" icon={Stethoscope} tone="info" />
        <StatCard label="Ingresos del período" value="—" icon={Wallet} hint="sin facturación cargada" />
        <StatCard label="Cancelaciones" value="0" icon={CalendarX2} hint="tasa —" />
        <StatCard label="Tasa de ocupación" value="—" icon={Gauge} hint="sin gabinetes configurados" />
      </div>

      <Card className="ce-card-hover mt-5 shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 pt-0">
          {quickAccess.map((q) => (
            <Button
              key={q.label}
              asChild
              variant="outline"
              className="h-auto gap-2 rounded-full px-4 py-2 shadow-soft"
            >
              <Link to={q.to}>
                <q.icon className="size-4 text-primary" />
                <span className="text-sm font-medium">{q.label}</span>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="ce-card-hover shadow-soft lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Evolución de la clínica</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">Últimos 6 meses</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {chartActions.map((a) => (
                <Button
                  key={a.label}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => toast.info("Disponible cuando haya datos para exportar.")}
                >
                  <a.icon className="size-3.5" /> {a.label}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emptyMonths} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[0, 10]} />
                  <Area type="monotone" dataKey="ingresos" stroke="var(--primary)" strokeWidth={2.5} fill="url(#incomeFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Todavía no hay ingresos cargados
            </p>
          </CardContent>
        </Card>

        <Card className="ce-card-hover shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Actividad por sucursal</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Activity}
              title="Sin sucursales con actividad"
              description="Configurá tu primera sucursal desde Configuración."
              action={
                <Button asChild size="sm" variant="outline">
                  <Link to="/app/configuracion">Configurar sucursal</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="ce-card-hover shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Producción por odontólogo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emptyProduction} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} domain={[0, 10]} />
                  <Bar dataKey="produccion" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Sin producción registrada este mes
            </p>
          </CardContent>
        </Card>

        <Card className="ce-card-hover shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Activity}
              title="Todavía no hay actividad"
              description="Las acciones de tu equipo —turnos confirmados, facturas emitidas, cambios en historias clínicas— van a aparecer acá en orden."
            />
          </CardContent>
        </Card>
      </div>

      <Card className="ce-card-hover mt-5 shadow-soft">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="size-4 text-primary" /> Próximas citas de hoy
          </CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/agenda">Ir a la agenda</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={CalendarCheck}
            title="No tenés citas cargadas todavía"
            description="Creá tu primera cita para empezar a ver tu agenda del día acá."
            action={
              <Button asChild size="sm" className="gap-1.5">
                <Link to="/app/agenda">
                  <Plus className="size-3.5" /> Nueva cita
                </Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    </>
  );
}