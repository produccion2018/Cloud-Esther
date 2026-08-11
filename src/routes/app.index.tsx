import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  CalendarCheck,
  CalendarX2,
  Download,
  Gauge,
  Plus,
  Stethoscope,
  UserPlus,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/app/DashboardShell";
import { AppointmentStatusBadge, StatCard } from "@/components/app/ui-kit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  appointments,
  branchActivity,
  currency,
  dentists,
  revenueSeries,
} from "@/data/demo";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const dentistName = (id: string) => dentists.find((d) => d.id === id)?.name ?? "—";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--card)",
  fontSize: 12,
};

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Buenos días, Dra. Arriaga"
        description="Resumen consolidado del grupo — martes 11 de agosto de 2026"
        badge="3 sucursales"
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="size-4" /> Exportar
            </Button>
            <Button asChild className="gap-2">
              <Link to="/app/agenda">
                <Plus className="size-4" /> Nueva cita
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Citas del día" value="48" delta={8} icon={CalendarCheck} hint="12 pendientes de confirmar" />
        <StatCard label="Pacientes nuevos" value="17" delta={21} icon={UserPlus} tone="success" hint="este mes: 133" />
        <StatCard label="Tratamientos activos" value="264" delta={5} icon={Stethoscope} tone="info" />
        <StatCard label="Ingresos del período" value={currency(64980)} delta={12} icon={Wallet} tone="success" hint="agosto 2026" />
        <StatCard label="Cancelaciones" value="6" delta={-14} icon={CalendarX2} tone="warning" hint="tasa 4,2 %" />
        <StatCard label="Tasa de ocupación" value="86 %" delta={3} icon={Gauge} hint="gabinetes ocupados" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Ingresos por mes</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -12, right: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => currency(v)} />
                <Area dataKey="ingresos" stroke="var(--primary)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Actividad por sucursal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {branchActivity.map((b) => (
              <div key={b.branch}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{b.branch}</span>
                  <span className="text-muted-foreground">{b.citas} citas</span>
                </div>
                <Progress value={b.ocupacion} className="mt-2" />
                <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>Ocupación {b.ocupacion} %</span>
                  <span>{currency(b.ingresos)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Citas por mes</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries} margin={{ left: -18, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="citas" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Conversión de leads</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries} margin={{ left: -18, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line dataKey="leads" stroke="var(--success)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5 shadow-soft">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="size-4 text-primary" /> Próximas citas de hoy
          </CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/agenda">Ver agenda completa</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hora</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Tratamiento</TableHead>
                  <TableHead>Odontólogo</TableHead>
                  <TableHead>Gabinete</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.slice(0, 7).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.time}</TableCell>
                    <TableCell>{a.patient}</TableCell>
                    <TableCell className="text-muted-foreground">{a.treatment}</TableCell>
                    <TableCell>{dentistName(a.dentist)}</TableCell>
                    <TableCell className="text-muted-foreground">{a.room}</TableCell>
                    <TableCell><AppointmentStatusBadge status={a.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
