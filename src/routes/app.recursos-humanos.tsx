import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Employee = {
  id: number;
  name: string;
  role: string;
  area: string;
  branch: string;
  contract: string;
  status: "Activo" | "Vacaciones" | "Licencia" | "Inactivo";
  startDate: string;
  salary: number;
  vacationTotal: number;
  vacationUsed: number;
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "María González",
    role: "Recepcionista",
    area: "Administración",
    branch: "Sucursal Centro",
    contract: "Tiempo completo",
    status: "Activo",
    startDate: "2023-04-10",
    salary: 850000,
    vacationTotal: 21,
    vacationUsed: 7,
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    role: "Odontólogo",
    area: "Clínica",
    branch: "Sucursal Centro",
    contract: "Profesional",
    status: "Activo",
    startDate: "2022-08-15",
    salary: 1450000,
    vacationTotal: 21,
    vacationUsed: 5,
  },
  {
    id: 3,
    name: "Laura Fernández",
    role: "Asistente dental",
    area: "Clínica",
    branch: "Sucursal Norte",
    contract: "Tiempo completo",
    status: "Vacaciones",
    startDate: "2024-01-22",
    salary: 780000,
    vacationTotal: 21,
    vacationUsed: 10,
  },
  {
    id: 4,
    name: "Ana Martínez",
    role: "Limpieza",
    area: "Servicios generales",
    branch: "Sucursal Centro",
    contract: "Medio tiempo",
    status: "Activo",
    startDate: "2024-06-03",
    salary: 520000,
    vacationTotal: 14,
    vacationUsed: 4,
  },
  {
    id: 5,
    name: "Jorge Pérez",
    role: "Mantenimiento",
    area: "Servicios generales",
    branch: "Sucursal Norte",
    contract: "Tiempo completo",
    status: "Licencia",
    startDate: "2021-11-08",
    salary: 720000,
    vacationTotal: 21,
    vacationUsed: 3,
  },
  {
    id: 6,
    name: "Sofía Ramírez",
    role: "Analista de Finanzas",
    area: "Administración",
    branch: "Sucursal Centro",
    contract: "Tiempo completo",
    status: "Activo",
    startDate: "2025-02-17",
    salary: 980000,
    vacationTotal: 21,
    vacationUsed: 2,
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export default function EquipoPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.role.toLowerCase().includes(search.toLowerCase()) ||
        employee.area.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "todos" ||
        employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Activo",
  ).length;

  const vacationEmployees = employees.filter(
    (employee) => employee.status === "Vacaciones",
  ).length;

  const licenseEmployees = employees.filter(
    (employee) => employee.status === "Licencia",
  ).length;

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      id: Date.now(),
      name: "Nuevo empleado",
      role: "Nuevo cargo",
      area: "Administración",
      branch: "Sucursal Centro",
      contract: "Tiempo completo",
      status: "Activo",
      startDate: new Date().toISOString().slice(0, 10),
      salary: 0,
      vacationTotal: 21,
      vacationUsed: 0,
    };

    setEmployees((current) => [newEmployee, ...current]);

    toast.success("Empleado agregado correctamente");
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <PageHeader
        title="Equipo y Recursos Humanos"
        description="Gestioná empleados, contratos, vacaciones, nómina y documentación de tu organización."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Download className="mr-2 size-4" />
              Exportar
            </Button>

            <Button onClick={handleAddEmployee}>
              <UserPlus className="mr-2 size-4" />
              Agregar empleado
            </Button>
          </div>
        }
      />

      {/* ESTADÍSTICAS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="ce-card-hover">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Total empleados
              </p>

              <p className="mt-1 text-2xl font-bold">
                {employees.length}
              </p>

              <p className="mt-1 text-xs text-success">
                Equipo registrado
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Users className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="ce-card-hover">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Empleados activos
              </p>

              <p className="mt-1 text-2xl font-bold">
                {activeEmployees}
              </p>

              <p className="mt-1 text-xs text-success">
                Personal trabajando
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-success-soft text-success">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="ce-card-hover">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                En vacaciones
              </p>

              <p className="mt-1 text-2xl font-bold">
                {vacationEmployees}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Ausencias programadas
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <CalendarDays className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="ce-card-hover">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Licencias
              </p>

              <p className="mt-1 text-2xl font-bold">
                {licenseEmployees}
              </p>

              <p className="mt-1 text-xs text-warning">
                Requieren seguimiento
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <Clock3 className="size-5" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ALERTAS */}

      <div className="grid gap-4 lg:grid-cols-3">

        <Card className="ce-card-hover">
          <CardContent className="flex gap-3 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <AlertTriangle className="size-5" />
            </div>

            <div>
              <p className="font-semibold">
                Contratos por vencer
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                2 contratos requieren revisión durante los próximos 30 días.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="ce-card-hover">
          <CardContent className="flex gap-3 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <CalendarDays className="size-5" />
            </div>

            <div>
              <p className="font-semibold">
                Próximas vacaciones
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                3 empleados tienen vacaciones programadas.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="ce-card-hover">
          <CardContent className="flex gap-3 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success">
              <Wallet className="size-5" />
            </div>

            <div>
              <p className="font-semibold">
                Nómina
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                La liquidación mensual se encuentra en revisión.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* EMPLEADOS */}

      <Card className="ce-card-hover">

        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <CardTitle>Empleados</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Personas que forman parte de tu organización.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar empleado..."
                  className="pl-9 sm:w-64"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="sm:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="todos">
                    Todos
                  </SelectItem>

                  <SelectItem value="Activo">
                    Activos
                  </SelectItem>

                  <SelectItem value="Vacaciones">
                    Vacaciones
                  </SelectItem>

                  <SelectItem value="Licencia">
                    Licencia
                  </SelectItem>

                  <SelectItem value="Inactivo">
                    Inactivos
                  </SelectItem>
                </SelectContent>
              </Select>

            </div>

          </div>
        </CardHeader>

        <CardContent>

          <div className="space-y-3">

            {filteredEmployees.map((employee) => (

              <div
                key={employee.id}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft sm:flex-row sm:items-center"
              >

                {/* PERSONA */}

                <div className="flex min-w-0 flex-1 items-center gap-3">

                  <Avatar className="size-11 shrink-0">
                    <AvatarFallback className="bg-primary-soft font-semibold text-primary">
                      {initials(employee.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {employee.name}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                      {employee.role}
                    </p>
                  </div>

                </div>

                {/* ÁREA */}

                <div className="hidden min-w-32 lg:block">
                  <p className="text-xs text-muted-foreground">
                    Área
                  </p>

                  <p className="text-sm font-medium">
                    {employee.area}
                  </p>
                </div>

                {/* CONTRATO */}

                <div className="hidden min-w-36 md:block">
                  <p className="text-xs text-muted-foreground">
                    Contrato
                  </p>

                  <p className="text-sm font-medium">
                    {employee.contract}
                  </p>
                </div>

                {/* ESTADO */}

                <div>
                  <Badge
                    variant={
                      employee.status === "Activo"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {employee.status}
                  </Badge>
                </div>

                {/* ACCIONES */}

                <Dialog
                  open={selectedEmployee?.id === employee.id}
                  onOpenChange={(open) =>
                    !open && setSelectedEmployee(null)
                  }
                >

                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setSelectedEmployee(employee)
                      }
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">

                    <DialogHeader>
                      <DialogTitle>
                        {employee.name}
                      </DialogTitle>
                    </DialogHeader>

                    <EmployeeDetail employee={employee} />

                  </DialogContent>

                </Dialog>

              </div>

            ))}

          </div>

          {filteredEmployees.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto size-10 text-muted-foreground/40" />

              <p className="mt-3 font-semibold">
                No encontramos empleados
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Probá modificando la búsqueda o los filtros.
              </p>
            </div>
          )}

        </CardContent>

      </Card>

    </div>
  );
}

function EmployeeDetail({
  employee,
}: {
  employee: Employee;
}) {
  const vacationAvailable =
    employee.vacationTotal - employee.vacationUsed;

  return (
    <div className="space-y-6">

      {/* PERFIL */}

      <div className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4 sm:flex-row sm:items-center">

        <Avatar className="size-16">
          <AvatarFallback className="bg-primary text-lg text-primary-foreground">
            {initials(employee.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-display text-xl font-bold">
            {employee.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {employee.role} · {employee.area}
          </p>

          <div className="mt-2">
            <Badge>{employee.status}</Badge>
          </div>
        </div>

        <Button variant="outline">
          <Pencil className="mr-2 size-4" />
          Editar
        </Button>

      </div>

      {/* RESUMEN */}

      <div className="grid gap-3 sm:grid-cols-4">

        <MiniStat
          icon={<BriefcaseBusiness className="size-4" />}
          label="Contrato"
          value={employee.contract}
        />

        <MiniStat
          icon={<CalendarDays className="size-4" />}
          label="Vacaciones"
          value={`${vacationAvailable} días`}
        />

        <MiniStat
          icon={<Wallet className="size-4" />}
          label="Salario"
          value={`$${employee.salary.toLocaleString("es-AR")}`}
        />

        <MiniStat
          icon={<Clock3 className="size-4" />}
          label="Ingreso"
          value={employee.startDate}
        />

      </div>

      {/* SECCIONES RRHH */}

      <div className="grid gap-3 sm:grid-cols-2">

        <HrSection
          icon={<BriefcaseBusiness className="size-5" />}
          title="Contrato"
          description="Condiciones laborales, jornada y vencimiento."
        />

        <HrSection
          icon={<Wallet className="size-5" />}
          title="Nómina"
          description="Salarios, bonificaciones y liquidaciones."
        />

        <HrSection
          icon={<CalendarDays className="size-5" />}
          title="Vacaciones"
          description={`${vacationAvailable} días disponibles.`}
        />

        <HrSection
          icon={<Clock3 className="size-5" />}
          title="Ausencias"
          description="Licencias, permisos e inasistencias."
        />

        <HrSection
          icon={<FolderOpen className="size-5" />}
          title="Documentos"
          description="Contratos, certificados y documentación."
        />

        <HrSection
          icon={<FileText className="size-5" />}
          title="Historial"
          description="Cambios y actividad del empleado."
        />

      </div>

    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-2 text-primary">
        {icon}

        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function HrSection({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="ce-card-hover flex items-start gap-3 rounded-2xl border bg-card p-4 text-left"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        {icon}
      </div>

      <div>
        <p className="font-semibold">
          {title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </button>
  );
}