import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { branchActivity, currency, revenueSeries, topTreatments } from "@/data/demo";

export const Route = createFileRoute("/app/analitica")({
  component: AnalyticsPage,
});

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--card)",
  fontSize: 12,
};

function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analítica y reportes"
        description="Producción, ocupación, conversión y rendimiento por odontólogo y sucursal."
        actions={
          <>
            <Select defaultValue="6m">
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="12m">Últimos 12 meses</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2" onClick={() => toast.success("Reporte exportado en CSV.")}>
              <Download className="size-4" /> Exportar reporte
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Ingresos y citas por período</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries} margin={{ left: -14, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="ingresos" name="Ingresos (€)" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="citas" name="Citas" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Tratamientos más vendidos</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topTreatments} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {topTreatments.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v} %`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Conversión de leads y pacientes nuevos</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries} margin={{ left: -18, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="leads" name="Leads" stroke="var(--chart-1)" strokeWidth={2.5} />
                <Line dataKey="citas" name="Citas" stroke="var(--chart-3)" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Rendimiento por sucursal</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {branchActivity.map((b) => (
              <div key={b.branch}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{b.branch}</span>
                  <span className="text-muted-foreground">{currency(b.ingresos)}</span>
                </div>
                <Progress value={b.ocupacion} className="mt-2" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {b.citas} citas · ocupación {b.ocupacion} %
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5 shadow-soft">
        <CardHeader><CardTitle className="text-base">Rendimiento por odontólogo</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Odontólogo</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Citas</TableHead>
                  <TableHead>Producción</TableHead>
                  <TableHead>Aceptación de presupuestos</TableHead>
                  <TableHead>Ausencias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { n: "Dra. Lucía Ferrer", e: "Ortodoncia", c: 118, p: 21400, a: "72 %", au: "3,1 %" },
                  { n: "Dr. Martín Salas", e: "Implantología", c: 86, p: 28900, a: "68 %", au: "2,4 %" },
                  { n: "Dra. Camila Ríos", e: "Endodoncia", c: 94, p: 9800, a: "61 %", au: "5,2 %" },
                  { n: "Dr. Andrés Peña", e: "Odontopediatría", c: 102, p: 7300, a: "77 %", au: "6,0 %" },
                  { n: "Dra. Valeria Moro", e: "Estética dental", c: 74, p: 15600, a: "64 %", au: "4,4 %" },
                ].map((r) => (
                  <TableRow key={r.n}>
                    <TableCell className="font-medium">{r.n}</TableCell>
                    <TableCell className="text-muted-foreground">{r.e}</TableCell>
                    <TableCell>{r.c}</TableCell>
                    <TableCell className="font-medium">{currency(r.p)}</TableCell>
                    <TableCell><Badge variant="secondary">{r.a}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{r.au}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          { t: "Reporte de producción mensual", d: "PDF · Todas las sedes" },
          { t: "Cancelaciones y ausencias", d: "CSV · Últimos 6 meses" },
          { t: "Pacientes nuevos vs. recurrentes", d: "XLSX · Año 2026" },
        ].map((r) => (
          <Card key={r.t} className="shadow-soft">
            <CardContent className="flex items-center justify-between gap-3 p-5">
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{r.t}</p>
                  <p className="text-xs text-muted-foreground">{r.d}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Reporte generado.")}>
                Exportar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
