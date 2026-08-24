import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  CalendarCheck2,
  Download,
  FileSpreadsheet,
  PieChart as PieChartIcon,
  TrendingDown,
  TrendingUp,
  Users2,
  UserRoundCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { StatCard } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
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

export const Route = createFileRoute("/app/analitica")({
  component: AnalyticsPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

type Period = "30d" | "3m" | "6m" | "12m";

type MonthlyData = {
  month: string;
  income: number;
  appointments: number;
  completed: number;
  cancelled: number;
  newPatients: number;
  recurringPatients: number;
};

type TreatmentData = {
  name: string;
  count: number;
  revenue: number;
};

type DentistData = {
  name: string;
  specialty: string;
  appointments: number;
  completed: number;
  revenue: number;
  occupancy: number;
};

type BranchData = {
  name: string;
  appointments: number;
  completed: number;
  revenue: number;
  occupancy: number;
};

const monthlyData: MonthlyData[] = [
  {
    month: "Mar",
    income: 18200000,
    appointments: 286,
    completed: 249,
    cancelled: 21,
    newPatients: 48,
    recurringPatients: 142,
  },
  {
    month: "Abr",
    income: 19650000,
    appointments: 301,
    completed: 264,
    cancelled: 19,
    newPatients: 53,
    recurringPatients: 151,
  },
  {
    month: "May",
    income: 21400000,
    appointments: 318,
    completed: 279,
    cancelled: 18,
    newPatients: 57,
    recurringPatients: 164,
  },
  {
    month: "Jun",
    income: 23150000,
    appointments: 332,
    completed: 291,
    cancelled: 17,
    newPatients: 61,
    recurringPatients: 172,
  },
  {
    month: "Jul",
    income: 24780000,
    appointments: 349,
    completed: 309,
    cancelled: 15,
    newPatients: 67,
    recurringPatients: 184,
  },
  {
    month: "Ago",
    income: 26100000,
    appointments: 362,
    completed: 321,
    cancelled: 14,
    newPatients: 71,
    recurringPatients: 191,
  },
];

const treatmentData: TreatmentData[] = [
  {
    name: "Limpieza dental",
    count: 86,
    revenue: 4300000,
  },
  {
    name: "Ortodoncia",
    count: 54,
    revenue: 8100000,
  },
  {
    name: "Implantes",
    count: 31,
    revenue: 12400000,
  },
  {
    name: "Blanqueamiento",
    count: 42,
    revenue: 5040000,
  },
  {
    name: "Restauraciones",
    count: 67,
    revenue: 6030000,
  },
];

const dentistData: DentistData[] = [
  {
    name: "Dra. Lucía Ferrer",
    specialty: "Ortodoncia",
    appointments: 112,
    completed: 101,
    revenue: 8400000,
    occupancy: 90,
  },
  {
    name: "Dr. Martín Salas",
    specialty: "Implantología",
    appointments: 94,
    completed: 86,
    revenue: 10100000,
    occupancy: 84,
  },
  {
    name: "Dra. Valentina Ruiz",
    specialty: "Odontología general",
    appointments: 126,
    completed: 111,
    revenue: 6900000,
    occupancy: 88,
  },
  {
    name: "Dr. Nicolás Torres",
    specialty: "Cirugía",
    appointments: 72,
    completed: 61,
    revenue: 5700000,
    occupancy: 76,
  },
];

const branchData: BranchData[] = [
  {
    name: "Clínica Centro",
    appointments: 218,
    completed: 194,
    revenue: 16200000,
    occupancy: 91,
  },
  {
    name: "Clínica Norte",
    appointments: 156,
    completed: 137,
    revenue: 9800000,
    occupancy: 83,
  },
  {
    name: "Clínica Sur",
    appointments: 112,
    completed: 96,
    revenue: 6900000,
    occupancy: 76,
  },
];

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-AR");

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function downloadCsv(
  filename: string,
  rows: Array<Record<string, string | number>>,
) {
  if (!rows.length) {
    toast.error("No hay datos para exportar.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const escapeCsv = (value: string | number) =>
    `"${String(value).replaceAll('"', '""')}"`;

  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header])).join(","),
    ),
  ].join("\n");

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);

  toast.success("Reporte exportado correctamente.");
}

function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("6m");
  const [branch, setBranch] = useState("todas");
  const [dentist, setDentist] = useState("todos");

  const visibleMonths = useMemo(() => {
    switch (period) {
      case "30d":
        return monthlyData.slice(-1);
      case "3m":
        return monthlyData.slice(-3);
      case "12m":
        return monthlyData;
      default:
        return monthlyData.slice(-6);
    }
  }, [period]);

  const totals = useMemo(() => {
    const income = visibleMonths.reduce(
      (sum, item) => sum + item.income,
      0,
    );

    const appointments = visibleMonths.reduce(
      (sum, item) => sum + item.appointments,
      0,
    );

    const completed = visibleMonths.reduce(
      (sum, item) => sum + item.completed,
      0,
    );

    const cancelled = visibleMonths.reduce(
      (sum, item) => sum + item.cancelled,
      0,
    );

    const newPatients = visibleMonths.reduce(
      (sum, item) => sum + item.newPatients,
      0,
    );

    const recurringPatients = visibleMonths.reduce(
      (sum, item) => sum + item.recurringPatients,
      0,
    );

    const occupancy =
      appointments > 0
        ? Math.round((completed / appointments) * 100)
        : 0;

    return {
      income,
      appointments,
      completed,
      cancelled,
      newPatients,
      recurringPatients,
      occupancy,
    };
  }, [visibleMonths]);

  const previousPeriodIncome = useMemo(() => {
    if (period === "30d") {
      return monthlyData[monthlyData.length - 2]?.income ?? 0;
    }

    const count =
      period === "3m" ? 3 : period === "12m" ? 6 : 6;

    const currentStart = monthlyData.length - count;

    return monthlyData
      .slice(
        Math.max(0, currentStart - count),
        currentStart,
      )
      .reduce((sum, item) => sum + item.income, 0);
  }, [period]);

  const incomeGrowth = useMemo(() => {
    if (!previousPeriodIncome) return 0;

    return Math.round(
      ((totals.income - previousPeriodIncome) /
        previousPeriodIncome) *
        100,
    );
  }, [previousPeriodIncome, totals.income]);

  const maxIncome = Math.max(
    ...visibleMonths.map((item) => item.income),
    1,
  );

  const maxTreatmentCount = Math.max(
    ...treatmentData.map((item) => item.count),
    1,
  );

  const filteredDentists = useMemo(() => {
    if (dentist === "todos") {
      return dentistData;
    }

    return dentistData.filter(
      (item) => item.name === dentist,
    );
  }, [dentist]);

  const filteredBranches = useMemo(() => {
    if (branch === "todas") {
      return branchData;
    }

    return branchData.filter(
      (item) => item.name === branch,
    );
  }, [branch]);

  function exportProduction() {
    downloadCsv(
      "cloud-esther-produccion-mensual.csv",
      visibleMonths.map((item) => ({
        Periodo: item.month,
        Ingresos: item.income,
        Citas: item.appointments,
        Completadas: item.completed,
        Canceladas: item.cancelled,
        "Pacientes nuevos": item.newPatients,
        "Pacientes recurrentes": item.recurringPatients,
      })),
    );
  }

  function exportCancellations() {
    downloadCsv(
      "cloud-esther-cancelaciones.csv",
      visibleMonths.map((item) => ({
        Periodo: item.month,
        Citas: item.appointments,
        Canceladas: item.cancelled,
        "Tasa de cancelacion":
          `${Math.round(
            (item.cancelled / item.appointments) * 100,
          )}%`,
      })),
    );
  }

  function exportPatients() {
    downloadCsv(
      "cloud-esther-pacientes.csv",
      visibleMonths.map((item) => ({
        Periodo: item.month,
        "Pacientes nuevos": item.newPatients,
        "Pacientes recurrentes": item.recurringPatients,
        Total:
          item.newPatients +
          item.recurringPatients,
      })),
    );
  }

  function exportFullReport() {
    downloadCsv(
      "cloud-esther-analitica-completa.csv",
      visibleMonths.map((item) => ({
        Periodo: item.month,
        Ingresos: item.income,
        Citas: item.appointments,
        Completadas: item.completed,
        Canceladas: item.cancelled,
        "Pacientes nuevos": item.newPatients,
        "Pacientes recurrentes": item.recurringPatients,
      })),
    );
  }

  return (
    <>
      <PageHeader
        title="Analítica y reportes"
        description="Producción, ocupación, conversión y rendimiento por odontólogo y sucursal."
        actions={
          <>
            <Select
              value={period}
              onValueChange={(value) =>
                setPeriod(value as Period)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="30d">
                  Últimos 30 días
                </SelectItem>

                <SelectItem value="3m">
                  Últimos 3 meses
                </SelectItem>

                <SelectItem value="6m">
                  Últimos 6 meses
                </SelectItem>

                <SelectItem value="12m">
                  Últimos 12 meses
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="gap-2"
              onClick={exportFullReport}
            >
              <Download className="size-4" />
              Exportar reporte
            </Button>
          </>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/5 text-primary"
        >
          Datos de demostración
        </Badge>

        <span className="text-xs text-muted-foreground">
          Los datos reales se conectarán con Agenda,
          Pacientes y Finanzas.
        </span>
      </div>

      {/* FILTROS */}
      <Card className={`${cardStyle} mt-5`}>
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-end">
          <div className="w-full md:max-w-xs">
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Sucursal
            </label>

            <Select
              value={branch}
              onValueChange={setBranch}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las sucursales" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="todas">
                  Todas las sucursales
                </SelectItem>

                {branchData.map((item) => (
                  <SelectItem
                    key={item.name}
                    value={item.name}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:max-w-xs">
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Odontólogo
            </label>

            <Select
              value={dentist}
              onValueChange={setDentist}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los odontólogos" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="todos">
                  Todos los odontólogos
                </SelectItem>

                {dentistData.map((item) => (
                  <SelectItem
                    key={item.name}
                    value={item.name}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:ml-auto">
            <Button
              variant="outline"
              onClick={() => {
                setBranch("todas");
                setDentist("todos");
                setPeriod("6m");
              }}
            >
              Restablecer filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Ingresos"
          value={formatCurrency(totals.income)}
          icon={TrendingUp}
          hint={`${incomeGrowth >= 0 ? "+" : ""}${incomeGrowth}% vs. período anterior`}
          tone="success"
        />

        <StatCard
          label="Citas"
          value={formatNumber(totals.appointments)}
          icon={CalendarCheck2}
          hint={`${formatNumber(totals.completed)} completadas`}
        />

        <StatCard
          label="Ocupación"
          value={`${totals.occupancy}%`}
          icon={Activity}
          hint="Citas completadas"
          tone="info"
        />

        <StatCard
          label="Cancelaciones"
          value={formatNumber(totals.cancelled)}
          icon={TrendingDown}
          hint={`${Math.round(
            (totals.cancelled /
              Math.max(totals.appointments, 1)) *
              100,
          )}% de las citas`}
          tone="warning"
        />

        <StatCard
          label="Pacientes nuevos"
          value={formatNumber(totals.newPatients)}
          icon={UserRoundCheck}
          hint="Período seleccionado"
        />

        <StatCard
          label="Recurrentes"
          value={formatNumber(totals.recurringPatients)}
          icon={Users2}
          hint="Pacientes atendidos nuevamente"
        />
      </div>

      {/* INGRESOS Y CITAS */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className={cardStyle}>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Ingresos por período
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Evolución de la facturación
              </p>
            </div>

            <BarChart3 className="size-5 text-primary" />
          </CardHeader>

          <CardContent>
            <div className="space-y-5">
              {visibleMonths.map((item) => (
                <div key={item.month}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium">
                      {item.month}
                    </span>

                    <span className="font-semibold">
                      {formatCurrency(item.income)}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{
                        width: `${Math.max(
                          5,
                          (item.income / maxIncome) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={cardStyle}>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Citas por período
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Comparación entre citas y atenciones realizadas
              </p>
            </div>

            <CalendarCheck2 className="size-5 text-primary" />
          </CardHeader>

          <CardContent>
            <div className="space-y-5">
              {visibleMonths.map((item) => {
                const completion =
                  item.appointments > 0
                    ? Math.round(
                        (item.completed /
                          item.appointments) *
                          100,
                      )
                    : 0;

                return (
                  <div key={item.month}>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-medium">
                        {item.month}
                      </span>

                      <span className="text-muted-foreground">
                        {item.completed}/
                        {item.appointments}{" "}
                        completadas
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/70 transition-all duration-700"
                        style={{
                          width: `${completion}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TRATAMIENTOS */}
      <Card className={`${cardStyle} mt-5`}>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Tratamientos más realizados
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Ranking de tratamientos y producción asociada
            </p>
          </div>

          <PieChartIcon className="size-5 text-primary" />
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            {treatmentData.map((treatment, index) => (
              <div
                key={treatment.name}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {treatment.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {treatment.count} tratamientos
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold">
                    {formatCurrency(
                      treatment.revenue,
                    )}
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/70 transition-all duration-700"
                    style={{
                      width: `${Math.max(
                        5,
                        (treatment.count /
                          maxTreatmentCount) *
                          100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SUCURSALES */}
      <Card className={`${cardStyle} mt-5`}>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Rendimiento por sucursal
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Producción, citas y ocupación
            </p>
          </div>

          <BarChart3 className="size-5 text-primary" />
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">
                    Sucursal
                  </th>
                  <th className="pb-3 font-medium">
                    Citas
                  </th>
                  <th className="pb-3 font-medium">
                    Completadas
                  </th>
                  <th className="pb-3 font-medium">
                    Ocupación
                  </th>
                  <th className="pb-3 text-right font-medium">
                    Ingresos
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBranches.map(
                  (item) => (
                    <tr
                      key={item.name}
                      className="border-b last:border-0"
                    >
                      <td className="py-4 font-medium">
                        {item.name}
                      </td>

                      <td className="py-4">
                        {item.appointments}
                      </td>

                      <td className="py-4">
                        {item.completed}
                      </td>

                      <td className="py-4">
                        <Badge
                          variant={
                            item.occupancy >= 85
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {item.occupancy}%
                        </Badge>
                      </td>

                      <td className="py-4 text-right font-semibold">
                        {formatCurrency(
                          item.revenue,
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ODONTÓLOGOS */}
      <Card className={`${cardStyle} mt-5`}>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Rendimiento por odontólogo
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Producción, citas y ocupación individual
            </p>
          </div>

          <Users2 className="size-5 text-primary" />
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredDentists.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-border p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.specialty}
                    </p>
                  </div>

                  <Badge variant="outline">
                    {item.occupancy}% ocupación
                  </Badge>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-[11px] text-muted-foreground">
                      Citas
                    </p>

                    <p className="mt-1 font-semibold">
                      {item.appointments}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-[11px] text-muted-foreground">
                      Completadas
                    </p>

                    <p className="mt-1 font-semibold">
                      {item.completed}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-[11px] text-muted-foreground">
                      Producción
                    </p>

                    <p className="mt-1 text-xs font-semibold">
                      {formatCurrency(
                        item.revenue,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>Ocupación</span>
                    <span>{item.occupancy}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{
                        width: `${item.occupancy}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PACIENTES */}
      <Card className={`${cardStyle} mt-5`}>
        <CardHeader>
          <CardTitle className="text-base">
            Pacientes nuevos vs. recurrentes
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <UserRoundCheck className="size-5 text-primary" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Pacientes nuevos
                  </p>

                  <p className="text-2xl font-bold">
                    {formatNumber(
                      totals.newPatients,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${
                      ((totals.newPatients /
                        Math.max(
                          totals.newPatients +
                            totals.recurringPatients,
                          1,
                        )) *
                        100)
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <Users2 className="size-5 text-primary" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Pacientes recurrentes
                  </p>

                  <p className="text-2xl font-bold">
                    {formatNumber(
                      totals.recurringPatients,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/50"
                  style={{
                    width: `${
                      ((totals.recurringPatients /
                        Math.max(
                          totals.newPatients +
                            totals.recurringPatients,
                          1,
                        )) *
                        100)
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EXPORTACIONES */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Card className={cardStyle}>
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="mt-0.5 size-5 text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  Producción mensual
                </p>

                <p className="text-xs text-muted-foreground">
                  CSV · Período seleccionado
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={exportProduction}
            >
              Exportar
            </Button>
          </CardContent>
        </Card>

        <Card className={cardStyle}>
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="mt-0.5 size-5 text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  Cancelaciones
                </p>

                <p className="text-xs text-muted-foreground">
                  CSV · Período seleccionado
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={exportCancellations}
            >
              Exportar
            </Button>
          </CardContent>
        </Card>

        <Card className={cardStyle}>
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="mt-0.5 size-5 text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  Pacientes
                </p>

                <p className="text-xs text-muted-foreground">
                  CSV · Nuevos vs. recurrentes
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={exportPatients}
            >
              Exportar
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}