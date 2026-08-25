import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  FolderOpen,
  HeartPulse,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EmployeeStatus = "Activo" | "Vacaciones" | "Licencia" | "Inactivo";
type ContractType = "Tiempo completo" | "Medio tiempo" | "Profesional" | "Monotributo" | "Eventual";

type Employee = {
  id: number;
  name: string;
  role: string;
  area: string;
  branch: string;
  contract: ContractType;
  status: EmployeeStatus;
  startDate: string;
  salary: number;
  vacationTotal: number;
  vacationUsed: number;
  email: string;
  phone: string;
  dni: string;
  address: string;
  birthDate: string;
  emergencyContact: string;
  emergencyPhone: string;
  professionalLicense: string;
  schedule: string;
  contractEnd: string;
};

type Attendance = {
  id: number;
  employeeId: number;
  date: string;
  entry: string;
  exit: string;
  status: "Presente" | "Tarde" | "Ausente" | "Licencia";
  hours: number;
};

type LeaveRequest = {
  id: number;
  employeeId: number;
  type: "Vacaciones" | "Licencia médica" | "Personal" | "Maternidad/Paternidad" | "Otro";
  from: string;
  to: string;
  days: number;
  status: "Pendiente" | "Aprobada" | "Rechazada";
  note: string;
};

type DocumentItem = {
  id: number;
  employeeId: number;
  name: string;
  category: "Contrato" | "Identidad" | "Profesional" | "Salud" | "Otro";
  expiresAt: string;
  status: "Vigente" | "Por vencer" | "Vencido";
};

const initialEmployees: Employee[] = [
  {
    id: 1, name: "María González", role: "Recepcionista", area: "Administración",
    branch: "Sucursal Centro", contract: "Tiempo completo", status: "Activo",
    startDate: "2023-04-10", salary: 850000, vacationTotal: 21, vacationUsed: 7,
    email: "maria@cloudesther.test", phone: "+54 9 11 5555-1001", dni: "32.456.781",
    address: "Av. Corrientes 1200", birthDate: "1990-05-18", emergencyContact: "Luis González",
    emergencyPhone: "+54 9 11 5555-9001", professionalLicense: "", schedule: "08:00 - 17:00",
    contractEnd: "2027-04-10",
  },
  {
    id: 2, name: "Carlos Rodríguez", role: "Odontólogo", area: "Clínica",
    branch: "Sucursal Centro", contract: "Profesional", status: "Activo",
    startDate: "2022-08-15", salary: 1450000, vacationTotal: 21, vacationUsed: 5,
    email: "carlos@cloudesther.test", phone: "+54 9 11 5555-1002", dni: "30.234.567",
    address: "Tucumán 845", birthDate: "1985-10-04", emergencyContact: "Paula Rodríguez",
    emergencyPhone: "+54 9 11 5555-9002", professionalLicense: "MN 45821", schedule: "09:00 - 18:00",
    contractEnd: "2027-08-15",
  },
  {
    id: 3, name: "Laura Fernández", role: "Asistente dental", area: "Clínica",
    branch: "Sucursal Norte", contract: "Tiempo completo", status: "Vacaciones",
    startDate: "2024-01-22", salary: 780000, vacationTotal: 21, vacationUsed: 10,
    email: "laura@cloudesther.test", phone: "+54 9 11 5555-1003", dni: "35.123.987",
    address: "Belgrano 540", birthDate: "1995-02-12", emergencyContact: "Marta Fernández",
    emergencyPhone: "+54 9 11 5555-9003", professionalLicense: "", schedule: "10:00 - 19:00",
    contractEnd: "2027-01-22",
  },
  {
    id: 4, name: "Ana Martínez", role: "Limpieza", area: "Servicios generales",
    branch: "Sucursal Centro", contract: "Medio tiempo", status: "Activo",
    startDate: "2024-06-03", salary: 520000, vacationTotal: 14, vacationUsed: 4,
    email: "ana@cloudesther.test", phone: "+54 9 11 5555-1004", dni: "37.456.321",
    address: "Rivadavia 1900", birthDate: "1988-07-20", emergencyContact: "José Martínez",
    emergencyPhone: "+54 9 11 5555-9004", professionalLicense: "", schedule: "07:00 - 13:00",
    contractEnd: "2027-06-03",
  },
  {
    id: 5, name: "Jorge Pérez", role: "Mantenimiento", area: "Servicios generales",
    branch: "Sucursal Norte", contract: "Tiempo completo", status: "Licencia",
    startDate: "2021-11-08", salary: 720000, vacationTotal: 21, vacationUsed: 3,
    email: "jorge@cloudesther.test", phone: "+54 9 11 5555-1005", dni: "29.345.678",
    address: "San Martín 430", birthDate: "1982-11-14", emergencyContact: "Laura Pérez",
    emergencyPhone: "+54 9 11 5555-9005", professionalLicense: "", schedule: "08:00 - 17:00",
    contractEnd: "2026-09-10",
  },
  {
    id: 6, name: "Sofía Ramírez", role: "Analista de Finanzas", area: "Administración",
    branch: "Sucursal Centro", contract: "Tiempo completo", status: "Activo",
    startDate: "2025-02-17", salary: 980000, vacationTotal: 21, vacationUsed: 2,
    email: "sofia@cloudesther.test", phone: "+54 9 11 5555-1006", dni: "41.223.456",
    address: "Santa Fe 730", birthDate: "1997-03-30", emergencyContact: "Pedro Ramírez",
    emergencyPhone: "+54 9 11 5555-9006", professionalLicense: "", schedule: "09:00 - 18:00",
    contractEnd: "2027-02-17",
  },
];

const initialAttendance: Attendance[] = [
  { id: 1, employeeId: 1, date: "2026-08-25", entry: "08:02", exit: "17:04", status: "Presente", hours: 9.0 },
  { id: 2, employeeId: 2, date: "2026-08-25", entry: "09:14", exit: "18:00", status: "Tarde", hours: 8.7 },
  { id: 3, employeeId: 3, date: "2026-08-25", entry: "-", exit: "-", status: "Licencia", hours: 0 },
  { id: 4, employeeId: 4, date: "2026-08-25", entry: "07:00", exit: "13:02", status: "Presente", hours: 6.0 },
  { id: 5, employeeId: 5, date: "2026-08-25", entry: "-", exit: "-", status: "Licencia", hours: 0 },
  { id: 6, employeeId: 6, date: "2026-08-25", entry: "09:00", exit: "18:01", status: "Presente", hours: 9.0 },
];

const initialLeaves: LeaveRequest[] = [
  { id: 1, employeeId: 3, type: "Vacaciones", from: "2026-08-24", to: "2026-09-04", days: 10, status: "Aprobada", note: "Vacaciones anuales" },
  { id: 2, employeeId: 5, type: "Licencia médica", from: "2026-08-24", to: "2026-08-28", days: 5, status: "Pendiente", note: "Certificado presentado" },
  { id: 3, employeeId: 1, type: "Vacaciones", from: "2026-09-14", to: "2026-09-25", days: 10, status: "Pendiente", note: "Descanso anual" },
];

const initialDocuments: DocumentItem[] = [
  { id: 1, employeeId: 2, name: "Matrícula profesional", category: "Profesional", expiresAt: "2026-09-18", status: "Por vencer" },
  { id: 2, employeeId: 2, name: "Contrato profesional", category: "Contrato", expiresAt: "2027-08-15", status: "Vigente" },
  { id: 3, employeeId: 1, name: "DNI", category: "Identidad", expiresAt: "2030-04-12", status: "Vigente" },
  { id: 4, employeeId: 5, name: "Contrato laboral", category: "Contrato", expiresAt: "2026-09-10", status: "Por vencer" },
  { id: 5, employeeId: 3, name: "Apto médico", category: "Salud", expiresAt: "2026-08-10", status: "Vencido" },
];

const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase();

const money = (value: number) =>
  `$${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;

export default function EquipoPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [leaves, setLeaves] = useState(initialLeaves);
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [branchFilter, setBranchFilter] = useState("todas");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("resumen");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState<Employee>(blankEmployee());

  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      [employee.name, employee.role, employee.area, employee.branch, employee.email, employee.dni]
        .some((value) => value.toLowerCase().includes(q));
    const matchesStatus = statusFilter === "todos" || employee.status === statusFilter;
    const matchesBranch = branchFilter === "todas" || employee.branch === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  }), [employees, search, statusFilter, branchFilter]);

  const activeEmployees = employees.filter((e) => e.status === "Activo").length;
  const vacationEmployees = employees.filter((e) => e.status === "Vacaciones").length;
  const licenseEmployees = employees.filter((e) => e.status === "Licencia").length;
  const pendingLeaves = leaves.filter((l) => l.status === "Pendiente").length;
  const expiringDocs = documents.filter((d) => d.status !== "Vigente").length;
  const monthlyPayroll = employees.filter((e) => e.status !== "Inactivo").reduce((sum, e) => sum + e.salary, 0);
  const presentToday = attendance.filter((a) => a.status === "Presente" || a.status === "Tarde").length;

  const saveEmployee = () => {
    if (!newEmployee.name.trim() || !newEmployee.role.trim()) {
      toast.error("Nombre y cargo son obligatorios.");
      return;
    }

    if (editingEmployee) {
      setEmployees((current) => current.map((e) => e.id === editingEmployee.id ? { ...newEmployee, id: editingEmployee.id } : e));
      toast.success("Empleado actualizado.");
    } else {
      setEmployees((current) => [{ ...newEmployee, id: Date.now() }, ...current]);
      toast.success("Empleado agregado.");
    }
    setEmployeeDialog(false);
    setEditingEmployee(null);
    setNewEmployee(blankEmployee());
  };

  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee(employee);
    setEmployeeDialog(true);
  };

  const deleteEmployee = (employee: Employee) => {
    setEmployees((current) => current.filter((e) => e.id !== employee.id));
    setSelectedEmployee(null);
    toast.success(`${employee.name} fue eliminado en modo demo.`);
  };

  const approveLeave = (id: number, approved: boolean) => {
    setLeaves((current) => current.map((l) => l.id === id ? { ...l, status: approved ? "Aprobada" : "Rechazada" } : l));
    toast.success(approved ? "Solicitud aprobada." : "Solicitud rechazada.");
  };

  const markAttendance = (employeeId: number) => {
    setAttendance((current) => {
      const exists = current.find((a) => a.employeeId === employeeId && a.date === "2026-08-25");
      if (!exists) return [...current, { id: Date.now(), employeeId, date: "2026-08-25", entry: "09:00", exit: "-", status: "Presente", hours: 0 }];
      return current.map((a) => a.id === exists.id ? { ...a, entry: a.entry === "-" ? "09:00" : a.entry, status: "Presente" } : a);
    });
    toast.success("Asistencia registrada.");
  };

  const exportDemo = () => {
    const rows = employees.map((e) => `${e.name};${e.role};${e.branch};${e.status};${e.salary}`).join("\n");
    const blob = new Blob([`Nombre;Cargo;Sucursal;Estado;Salario\n${rows}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cloud-esther-recursos-humanos.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Exportación generada.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipo y Recursos Humanos"
        description="Gestioná personal, contratos, asistencia, vacaciones, licencias, nómina y documentación desde un único módulo."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportDemo}>
              <Download className="mr-2 size-4" /> Exportar
            </Button>
            <Button onClick={() => { setEditingEmployee(null); setNewEmployee(blankEmployee()); setEmployeeDialog(true); }}>
              <UserPlus className="mr-2 size-4" /> Agregar empleado
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric icon={Users} label="Total empleados" value={employees.length.toString()} hint={`${activeEmployees} activos`} />
        <Metric icon={CheckCircle2} label="Presentes hoy" value={`${presentToday}/${employees.length}`} hint="Control de asistencia" />
        <Metric icon={CalendarDays} label="Vacaciones" value={vacationEmployees.toString()} hint="Actualmente ausentes" />
        <Metric icon={Clock3} label="Licencias" value={licenseEmployees.toString()} hint={`${pendingLeaves} solicitudes pendientes`} />
        <Metric icon={Wallet} label="Nómina estimada" value={money(monthlyPayroll)} hint="Mensual · modo demo" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AlertCard icon={AlertTriangle} title="Documentación por revisar" text={`${expiringDocs} documentos vencidos o próximos a vencer.`} action={() => setActiveTab("documentos")} />
        <AlertCard icon={CalendarDays} title="Solicitudes pendientes" text={`${pendingLeaves} licencias o vacaciones esperan aprobación.`} action={() => setActiveTab("vacaciones")} />
        <AlertCard icon={FileCheck2} title="Contratos" text="Revisá vencimientos, modalidad y condiciones laborales." action={() => setActiveTab("empleados")} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="empleados">Personal</TabsTrigger>
          <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
          <TabsTrigger value="vacaciones">Vacaciones y licencias</TabsTrigger>
          <TabsTrigger value="nomina">Nómina</TabsTrigger>
          <TabsTrigger value="documentos">Documentación</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Estado del equipo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressRow label="Activos" value={activeEmployees} total={employees.length} />
                <ProgressRow label="Vacaciones" value={vacationEmployees} total={employees.length} />
                <ProgressRow label="Licencia" value={licenseEmployees} total={employees.length} />
                <ProgressRow label="Inactivos" value={employees.filter((e) => e.status === "Inactivo").length} total={employees.length} />
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Acciones rápidas</CardTitle></CardHeader>
              <CardContent className="grid gap-2">
                <QuickAction icon={UserPlus} label="Nuevo empleado" onClick={() => { setNewEmployee(blankEmployee()); setEmployeeDialog(true); }} />
                <QuickAction icon={Clock3} label="Registrar asistencia" onClick={() => setActiveTab("asistencia")} />
                <QuickAction icon={CalendarDays} label="Gestionar vacaciones" onClick={() => setActiveTab("vacaciones")} />
                <QuickAction icon={FolderOpen} label="Revisar documentos" onClick={() => setActiveTab("documentos")} />
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Próximos vencimientos y eventos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {documents.filter((d) => d.status !== "Vigente").slice(0, 3).map((doc) => {
                const employee = employees.find((e) => e.id === doc.employeeId);
                return (
                  <div key={doc.id} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={doc.status === "Vencido" ? "destructive" : "outline"}>{doc.status}</Badge>
                      <span className="text-xs text-muted-foreground">{doc.expiresAt}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{employee?.name}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empleados" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Personal</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Ficha laboral completa de cada integrante.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar nombre, DNI, cargo..." className="pl-9 sm:w-72" />
                  </div>
                  <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las sucursales</SelectItem>
                      <SelectItem value="Sucursal Centro">Sucursal Centro</SelectItem>
                      <SelectItem value="Sucursal Norte">Sucursal Norte</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="sm:w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="Activo">Activos</SelectItem>
                      <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                      <SelectItem value="Licencia">Licencia</SelectItem>
                      <SelectItem value="Inactivo">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="group flex flex-col gap-4 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft sm:flex-row sm:items-center">
                  <button type="button" onClick={() => setSelectedEmployee(employee)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <Avatar className="size-11 shrink-0">
                      <AvatarFallback className="bg-primary-soft font-semibold text-primary">{initials(employee.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{employee.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{employee.role} · {employee.area}</p>
                      <p className="truncate text-xs text-muted-foreground">{employee.branch} · {employee.schedule}</p>
                    </div>
                  </button>
                  <div className="hidden min-w-36 lg:block">
                    <p className="text-xs text-muted-foreground">Contrato</p>
                    <p className="text-sm font-medium">{employee.contract}</p>
                    <p className="text-xs text-muted-foreground">Vence {employee.contractEnd}</p>
                  </div>
                  <div className="hidden min-w-32 md:block">
                    <p className="text-xs text-muted-foreground">Salario</p>
                    <p className="text-sm font-semibold">{money(employee.salary)}</p>
                  </div>
                  <StatusBadge status={employee.status} />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedEmployee(employee)} aria-label="Ver empleado"><MoreHorizontal className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(employee)} aria-label="Editar empleado"><Pencil className="size-4" /></Button>
                  </div>
                </div>
              ))}
              {!filteredEmployees.length && <EmptyState text="No encontramos empleados con esos filtros." />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asistencia">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Control de asistencia</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Entrada, salida, horas trabajadas y novedades.</p>
                </div>
                <Button onClick={() => { const first = employees.find((e) => !attendance.some((a) => a.employeeId === e.id)); if (first) markAttendance(first.id); else toast.info("Todo el personal ya tiene registro de hoy."); }}>
                  <Clock3 className="mr-2 size-4" /> Registrar entrada
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead><tr className="border-b text-left text-xs text-muted-foreground"><th className="p-3">Empleado</th><th className="p-3">Entrada</th><th className="p-3">Salida</th><th className="p-3">Horas</th><th className="p-3">Estado</th><th className="p-3 text-right">Acción</th></tr></thead>
                <tbody>
                  {employees.map((employee) => {
                    const record = attendance.find((a) => a.employeeId === employee.id && a.date === "2026-08-25");
                    return (
                      <tr key={employee.id} className="border-b last:border-0">
                        <td className="p-3 font-medium">{employee.name}<div className="text-xs font-normal text-muted-foreground">{employee.role}</div></td>
                        <td className="p-3">{record?.entry ?? "-"}</td>
                        <td className="p-3">{record?.exit ?? "-"}</td>
                        <td className="p-3">{record?.hours ? `${record.hours.toFixed(1)} h` : "-"}</td>
                        <td className="p-3"><AttendanceBadge status={record?.status ?? "Ausente"} /></td>
                        <td className="p-3 text-right"><Button size="sm" variant="outline" onClick={() => markAttendance(employee.id)} disabled={record?.status === "Licencia"}>{record?.entry && record.entry !== "-" ? "Actualizar" : "Registrar"}</Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vacaciones" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Vacaciones y licencias</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Aprobá solicitudes y controlá saldos.</p>
                </div>
                <Button onClick={() => toast.success("Nueva solicitud preparada en modo demo.")}><Plus className="mr-2 size-4" /> Nueva solicitud</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaves.map((leave) => {
                const employee = employees.find((e) => e.id === leave.employeeId);
                return (
                  <div key={leave.id} className="flex flex-col gap-4 rounded-2xl border p-4 lg:flex-row lg:items-center">
                    <Avatar className="size-10"><AvatarFallback className="bg-primary-soft text-primary">{initials(employee?.name ?? "?")}</AvatarFallback></Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{employee?.name}</p>
                      <p className="text-sm text-muted-foreground">{leave.type} · {leave.note}</p>
                    </div>
                    <div><p className="text-xs text-muted-foreground">Período</p><p className="text-sm font-medium">{leave.from} → {leave.to}</p></div>
                    <div><p className="text-xs text-muted-foreground">Días</p><p className="text-sm font-semibold">{leave.days}</p></div>
                    <Badge variant={leave.status === "Aprobada" ? "default" : leave.status === "Rechazada" ? "destructive" : "outline"}>{leave.status}</Badge>
                    {leave.status === "Pendiente" && (
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" onClick={() => approveLeave(leave.id, true)} aria-label="Aprobar"><Check className="size-4" /></Button>
                        <Button size="icon" variant="outline" onClick={() => approveLeave(leave.id, false)} aria-label="Rechazar"><X className="size-4" /></Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {employees.filter((e) => e.status !== "Inactivo").map((employee) => (
              <Card key={employee.id}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10"><AvatarFallback className="bg-primary-soft text-primary">{initials(employee.name)}</AvatarFallback></Avatar>
                    <div className="min-w-0"><p className="truncate text-sm font-semibold">{employee.name}</p><p className="text-xs text-muted-foreground">Saldo anual</p></div>
                  </div>
                  <div className="mt-4 flex items-end justify-between"><span className="text-2xl font-bold">{employee.vacationTotal - employee.vacationUsed}</span><span className="text-xs text-muted-foreground">días disponibles</span></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (employee.vacationUsed / employee.vacationTotal) * 100)}%` }} /></div>
                  <p className="mt-2 text-xs text-muted-foreground">{employee.vacationUsed} usados de {employee.vacationTotal}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nomina">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Nómina y remuneraciones</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Resumen salarial preparado para futura conexión con backend.</p>
                </div>
                <Button variant="outline" onClick={() => toast.info("La liquidación real se conectará al backend.")}><FileText className="mr-2 size-4" /> Ver liquidación</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-5 grid gap-4 sm:grid-cols-3">
                <MiniKpi label="Bruto estimado" value={money(monthlyPayroll)} />
                <MiniKpi label="Empleados liquidados" value={employees.filter((e) => e.status !== "Inactivo").length.toString()} />
                <MiniKpi label="Promedio salarial" value={money(Math.round(monthlyPayroll / Math.max(1, activeEmployees)))} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-sm">
                  <thead><tr className="border-b text-left text-xs text-muted-foreground"><th className="p-3">Empleado</th><th className="p-3">Cargo</th><th className="p-3">Contrato</th><th className="p-3">Salario</th><th className="p-3">Estado</th><th className="p-3" /></tr></thead>
                  <tbody>{employees.filter((e) => e.status !== "Inactivo").map((e) => <tr key={e.id} className="border-b last:border-0"><td className="p-3 font-medium">{e.name}</td><td className="p-3 text-muted-foreground">{e.role}</td><td className="p-3">{e.contract}</td><td className="p-3 font-semibold">{money(e.salary)}</td><td className="p-3"><Badge variant="outline">Pendiente</Badge></td><td className="p-3 text-right"><Button size="sm" variant="ghost" onClick={() => toast.info(`Liquidación de ${e.name}: modo demo.`)}>Detalle</Button></td></tr>)}</tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos">
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Documentación del personal</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Contratos, DNI, matrículas, aptos y vencimientos.</p>
                </div>
                <Button onClick={() => toast.success("Carga de documento preparada en modo demo.")}><Plus className="mr-2 size-4" /> Agregar documento</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc) => {
                const employee = employees.find((e) => e.id === doc.employeeId);
                return (
                  <div key={doc.id} className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><FileText className="size-5" /></div>
                    <div className="min-w-0 flex-1"><p className="font-semibold">{doc.name}</p><p className="text-xs text-muted-foreground">{employee?.name} · {doc.category}</p></div>
                    <div><p className="text-xs text-muted-foreground">Vencimiento</p><p className="text-sm font-medium">{doc.expiresAt}</p></div>
                    <Badge variant={doc.status === "Vencido" ? "destructive" : "outline"} className={doc.status === "Por vencer" ? "border-warning/30 text-warning" : ""}>{doc.status}</Badge>
                    <div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => toast.info(`Vista previa de ${doc.name}.`)}><FolderOpen className="size-4" /></Button><Button size="icon" variant="ghost" onClick={() => setDocuments((current) => current.filter((d) => d.id !== doc.id))}><Trash2 className="size-4" /></Button></div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={employeeDialog} onOpenChange={setEmployeeDialog}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? "Editar empleado" : "Agregar empleado"}</DialogTitle>
          </DialogHeader>
          <EmployeeForm employee={newEmployee} onChange={setNewEmployee} onSave={saveEmployee} onCancel={() => setEmployeeDialog(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
          {selectedEmployee && (
            <EmployeeDetail
              employee={selectedEmployee}
              onEdit={() => { setSelectedEmployee(null); openEdit(selectedEmployee); }}
              onDelete={() => deleteEmployee(selectedEmployee)}
              onClose={() => setSelectedEmployee(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function blankEmployee(): Employee {
  return {
    id: 0, name: "", role: "", area: "Administración", branch: "Sucursal Centro",
    contract: "Tiempo completo", status: "Activo", startDate: new Date().toISOString().slice(0, 10),
    salary: 0, vacationTotal: 21, vacationUsed: 0, email: "", phone: "", dni: "", address: "",
    birthDate: "", emergencyContact: "", emergencyPhone: "", professionalLicense: "",
    schedule: "09:00 - 18:00", contractEnd: "", 
  };
}

function EmployeeForm({ employee, onChange, onSave, onCancel }: {
  employee: Employee; onChange: (employee: Employee) => void; onSave: () => void; onCancel: () => void;
}) {
  const set = <K extends keyof Employee>(key: K, value: Employee[K]) => onChange({ ...employee, [key]: value });

  return (
    <div className="space-y-6">
      <SectionTitle icon={Users} title="Datos personales" text="Información básica y de contacto." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="Nombre completo" required><Input value={employee.name} onChange={(e) => set("name", e.target.value)} /></FormField>
        <FormField label="DNI"><Input value={employee.dni} onChange={(e) => set("dni", e.target.value)} /></FormField>
        <FormField label="Fecha de nacimiento"><Input type="date" value={employee.birthDate} onChange={(e) => set("birthDate", e.target.value)} /></FormField>
        <FormField label="Email"><Input type="email" value={employee.email} onChange={(e) => set("email", e.target.value)} /></FormField>
        <FormField label="Teléfono"><Input value={employee.phone} onChange={(e) => set("phone", e.target.value)} /></FormField>
        <FormField label="Dirección"><Input value={employee.address} onChange={(e) => set("address", e.target.value)} /></FormField>
        <FormField label="Contacto de emergencia"><Input value={employee.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} /></FormField>
        <FormField label="Teléfono de emergencia"><Input value={employee.emergencyPhone} onChange={(e) => set("emergencyPhone", e.target.value)} /></FormField>
      </div>

      <SectionTitle icon={BriefcaseBusiness} title="Información laboral" text="Cargo, sucursal, modalidad y jornada." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="Cargo" required><Input value={employee.role} onChange={(e) => set("role", e.target.value)} /></FormField>
        <FormField label="Área"><Input value={employee.area} onChange={(e) => set("area", e.target.value)} /></FormField>
        <FormField label="Sucursal"><Select value={employee.branch} onValueChange={(v) => set("branch", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Sucursal Centro">Sucursal Centro</SelectItem><SelectItem value="Sucursal Norte">Sucursal Norte</SelectItem></SelectContent></Select></FormField>
        <FormField label="Tipo de contrato"><Select value={employee.contract} onValueChange={(v) => set("contract", v as ContractType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Tiempo completo", "Medio tiempo", "Profesional", "Monotributo", "Eventual"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></FormField>
        <FormField label="Estado"><Select value={employee.status} onValueChange={(v) => set("status", v as EmployeeStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Activo", "Vacaciones", "Licencia", "Inactivo"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></FormField>
        <FormField label="Horario"><Input value={employee.schedule} onChange={(e) => set("schedule", e.target.value)} /></FormField>
        <FormField label="Fecha de ingreso"><Input type="date" value={employee.startDate} onChange={(e) => set("startDate", e.target.value)} /></FormField>
        <FormField label="Vencimiento contrato"><Input type="date" value={employee.contractEnd} onChange={(e) => set("contractEnd", e.target.value)} /></FormField>
        <FormField label="Matrícula profesional"><Input value={employee.professionalLicense} onChange={(e) => set("professionalLicense", e.target.value)} /></FormField>
      </div>

      <SectionTitle icon={Wallet} title="Remuneración y vacaciones" text="Valores preparados para futura liquidación real." />
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Salario"><Input type="number" value={employee.salary} onChange={(e) => set("salary", Number(e.target.value))} /></FormField>
        <FormField label="Días de vacaciones"><Input type="number" value={employee.vacationTotal} onChange={(e) => set("vacationTotal", Number(e.target.value))} /></FormField>
        <FormField label="Días usados"><Input type="number" value={employee.vacationUsed} onChange={(e) => set("vacationUsed", Number(e.target.value))} /></FormField>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button onClick={onSave}><Check className="mr-2 size-4" /> Guardar empleado</Button>
      </div>
    </div>
  );
}

function EmployeeDetail({ employee, onEdit, onDelete, onClose }: {
  employee: Employee; onEdit: () => void; onDelete: () => void; onClose: () => void;
}) {
  const vacationAvailable = Math.max(0, employee.vacationTotal - employee.vacationUsed);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-5 sm:flex-row sm:items-center">
        <Avatar className="size-16"><AvatarFallback className="bg-primary text-lg text-primary-foreground">{initials(employee.name)}</AvatarFallback></Avatar>
        <div className="min-w-0 flex-1"><h3 className="font-display text-xl font-bold">{employee.name}</h3><p className="text-sm text-muted-foreground">{employee.role} · {employee.area} · {employee.branch}</p><div className="mt-2"><StatusBadge status={employee.status} /></div></div>
        <div className="flex gap-2"><Button variant="outline" onClick={onEdit}><Pencil className="mr-2 size-4" /> Editar</Button><Button variant="ghost" onClick={onClose}>Cerrar</Button></div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <MiniKpi label="Contrato" value={employee.contract} />
        <MiniKpi label="Vacaciones" value={`${vacationAvailable} días`} />
        <MiniKpi label="Salario" value={money(employee.salary)} />
        <MiniKpi label="Ingreso" value={employee.startDate} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailCard icon={Users} title="Datos personales"><DetailLine label="DNI" value={employee.dni || "—"} /><DetailLine label="Nacimiento" value={employee.birthDate || "—"} /><DetailLine label="Email" value={employee.email || "—"} /><DetailLine label="Teléfono" value={employee.phone || "—"} /><DetailLine label="Dirección" value={employee.address || "—"} /></DetailCard>
        <DetailCard icon={HeartPulse} title="Emergencia y salud"><DetailLine label="Contacto" value={employee.emergencyContact || "—"} /><DetailLine label="Teléfono" value={employee.emergencyPhone || "—"} /><DetailLine label="Matrícula" value={employee.professionalLicense || "No corresponde"} /></DetailCard>
        <DetailCard icon={BriefcaseBusiness} title="Relación laboral"><DetailLine label="Área" value={employee.area} /><DetailLine label="Jornada" value={employee.schedule} /><DetailLine label="Ingreso" value={employee.startDate} /><DetailLine label="Contrato vence" value={employee.contractEnd || "Sin vencimiento"} /></DetailCard>
        <DetailCard icon={CalendarDays} title="Vacaciones"><DetailLine label="Total anual" value={`${employee.vacationTotal} días`} /><DetailLine label="Utilizados" value={`${employee.vacationUsed} días`} /><DetailLine label="Disponibles" value={`${vacationAvailable} días`} /></DetailCard>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-4">
        <div><p className="text-sm font-semibold">Zona de administración</p><p className="text-xs text-muted-foreground">Eliminar es una acción de demo; el backend deberá gestionar bajas y auditoría.</p></div>
        <Button variant="outline" className="text-destructive" onClick={onDelete}><Trash2 className="mr-2 size-4" /> Eliminar</Button>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, hint }: { icon: typeof Users; label: string; value: string; hint: string }) {
  return <Card className="shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md"><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{hint}</p></div><div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="size-5" /></div></CardContent></Card>;
}

function AlertCard({ icon: Icon, title, text, action }: { icon: typeof AlertTriangle; title: string; text: string; action: () => void }) {
  return <button type="button" onClick={action} className="rounded-2xl border bg-card p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"><div className="flex gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="size-5" /></div><div className="min-w-0 flex-1"><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-muted-foreground">{text}</p></div><ChevronRight className="mt-1 size-4 text-muted-foreground" /></div></button>;
}

function QuickAction({ icon: Icon, label, onClick }: { icon: typeof Users; label: string; onClick: () => void }) {
  return <Button variant="outline" className="justify-start gap-3" onClick={onClick}><span className="flex size-7 items-center justify-center rounded-lg bg-primary-soft text-primary"><Icon className="size-3.5" /></span>{label}</Button>;
}

function ProgressRow({ label, value, total }: { label: string; value: number; total: number }) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return <div><div className="mb-1.5 flex justify-between text-sm"><span>{label}</span><span className="font-semibold">{value} <span className="font-normal text-muted-foreground">({percent}%)</span></span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} /></div></div>;
}

function StatusBadge({ status }: { status: EmployeeStatus }) {
  return <Badge variant={status === "Activo" ? "default" : status === "Licencia" ? "outline" : "secondary"}>{status}</Badge>;
}

function AttendanceBadge({ status }: { status: Attendance["status"] }) {
  return <Badge variant={status === "Presente" ? "default" : status === "Ausente" ? "destructive" : "outline"}>{status}</Badge>;
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border bg-card p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 truncate text-sm font-semibold">{value}</p></div>;
}

function DetailCard({ icon: Icon, title, children }: { icon: typeof Users; title: string; children: React.ReactNode }) {
  return <Card><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-sm"><span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary"><Icon className="size-4" /></span>{title}</CardTitle></CardHeader><CardContent className="space-y-2">{children}</CardContent></Card>;
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-border/60 py-2 last:border-0"><span className="text-xs text-muted-foreground">{label}</span><span className="max-w-[65%] text-right text-sm font-medium">{value}</span></div>;
}

function SectionTitle({ icon: Icon, title, text }: { icon: typeof Users; title: string; text: string }) {
  return <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="size-4" /></div><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{text}</p></div></div>;
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}{required ? " *" : ""}</Label>{children}</div>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="py-12 text-center"><Users className="mx-auto size-10 text-muted-foreground/40" /><p className="mt-3 font-semibold">{text}</p></div>;
}
