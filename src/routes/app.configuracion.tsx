import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Building2,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  FileText,
  Globe2,
  KeyRound,
  Laptop,
  Mail,
  MessageCircle,
  Moon,
  Palette,
  Plus,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  UserPlus,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState } from "@/components/app/ui-kit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { plans, roles } from "@/data/demo";
import { getAccount } from "@/lib/account";
import {
  applyThemeColor,
  getDarkMode,
  getSidebarDarkMode,
  getSidebarLightMode,
  getThemeColor,
  setDarkMode,
  setSidebarDarkMode,
  setSidebarLightMode,
  THEME_COLORS,
  type ThemeColor,
} from "@/lib/theme";

export const Route = createFileRoute("/app/configuracion")({
  component: SettingsPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary hover:shadow-lift";

const STORAGE_KEYS = {
  clinic: "cloud_esther_config_clinic",
  communication: "cloud_esther_config_communication",
  reminders: "cloud_esther_config_reminders",
  notifications: "cloud_esther_config_notifications",
  agenda: "cloud_esther_config_agenda",
  roles: "cloud_esther_config_roles",
};

type ClinicData = {
  businessName: string;
  legalName: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  timezone: string;
  currency: string;
};

type CommunicationSettings = {
  whatsappEnabled: boolean;
  whatsappConfigured: boolean;
  whatsappReminders: boolean;
  whatsappConfirmation: boolean;
  whatsappReception: boolean;
  emailEnabled: boolean;
  emailReminders: boolean;
  emailConfirmation: boolean;
  showChannelStatus: boolean;
  chatBackground: string;
};

type ReminderSettings = {
  appointmentReminder: boolean;
  confirmationRequest: boolean;
  secondReminder: boolean;
  allowReschedule: boolean;
  sendBeforeHours: string;
  secondReminderHours: string;
};

type NotificationSettings = {
  appointmentCreated: boolean;
  appointmentCancelled: boolean;
  appointmentConfirmed: boolean;
  paymentReceived: boolean;
  newPatient: boolean;
  systemAlerts: boolean;
};

type AgendaSettings = {
  defaultDuration: string;
  bufferBefore: string;
  bufferAfter: string;
  allowOverlap: boolean;
  showPatientPhone: boolean;
  allowOnlineBooking: boolean;
};

type PermissionState = Record<string, boolean>;

type AuditAction =
  | "Creación"
  | "Modificación"
  | "Eliminación"
  | "Acceso"
  | "Cancelación"
  | "Compra"
  | "Exportación"
  | "Configuración";

type AuditStatus = "Correcto" | "Advertencia" | "Bloqueado";

type AuditEntry = {
  id: number;
  user: string;
  role: string;
  module: string;
  action: AuditAction;
  description: string;
  date: string;
  time: string;
  ip: string;
  device: string;
  status: AuditStatus;
};

const defaultClinicData: ClinicData = {
  businessName: "",
  legalName: "",
  taxId: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "Argentina",
  timezone: "America/Argentina/Buenos_Aires",
  currency: "ARS",
};

const defaultCommunication: CommunicationSettings = {
  whatsappEnabled: false,
  whatsappConfigured: false,
  whatsappReminders: true,
  whatsappConfirmation: true,
  whatsappReception: true,
  emailEnabled: true,
  emailReminders: true,
  emailConfirmation: true,
  showChannelStatus: true,
  chatBackground: "lavanda",
};

const defaultReminders: ReminderSettings = {
  appointmentReminder: true,
  confirmationRequest: true,
  secondReminder: false,
  allowReschedule: true,
  sendBeforeHours: "24",
  secondReminderHours: "2",
};

const defaultNotifications: NotificationSettings = {
  appointmentCreated: true,
  appointmentCancelled: true,
  appointmentConfirmed: true,
  paymentReceived: true,
  newPatient: true,
  systemAlerts: true,
};

const defaultAgenda: AgendaSettings = {
  defaultDuration: "30",
  bufferBefore: "0",
  bufferAfter: "10",
  allowOverlap: false,
  showPatientPhone: true,
  allowOnlineBooking: false,
};

const permissionModules = [
  "Dashboard",
  "Pacientes",
  "Agenda",
  "Historia Clínica",
  "Odontólogos",
  "Secretarias",
  "Asistentes",
  "Administración",
  "Recursos Humanos",
  "Inventario",
  "Finanzas",
  "Analítica",
  "Integraciones",
  "Multiempresa",
  "IA Esther",
  "Configuración",
  "Centro de Seguridad",
  "Centro de Monitoreo",
];

const permissionActions = [
  "Ver",
  "Crear",
  "Editar",
  "Eliminar",
  "Exportar",
];

const auditActions: AuditAction[] = [
  "Creación",
  "Modificación",
  "Eliminación",
  "Acceso",
  "Cancelación",
  "Compra",
  "Exportación",
  "Configuración",
];

const auditModules = [
  "Todos los módulos",
  "Pacientes",
  "Agenda",
  "Historia Clínica",
  "Odontólogos",
  "Finanzas",
  "Inventario",
  "Configuración",
  "Usuarios",
  "Sistema",
];

const demoAuditEntries: AuditEntry[] = [
  {
    id: 1,
    user: "Alejandro Rodríguez",
    role: "Administrador",
    module: "Pacientes",
    action: "Creación",
    description: "Creó el paciente María González.",
    date: "21/08/2026",
    time: "14:42:18",
    ip: "192.168.1.25",
    device: "Chrome · Windows 11",
    status: "Correcto",
  },
  {
    id: 2,
    user: "Laura Martínez",
    role: "Secretaria",
    module: "Agenda",
    action: "Modificación",
    description: "Modificó el horario de la cita #1048.",
    date: "21/08/2026",
    time: "14:36:51",
    ip: "192.168.1.31",
    device: "Chrome · Windows 11",
    status: "Correcto",
  },
  {
    id: 3,
    user: "Dr. Carlos Pérez",
    role: "Odontólogo",
    module: "Historia Clínica",
    action: "Acceso",
    description: "Consultó la historia clínica del paciente #382.",
    date: "21/08/2026",
    time: "14:22:07",
    ip: "192.168.1.42",
    device: "Safari · macOS",
    status: "Correcto",
  },
  {
    id: 4,
    user: "Alejandro Rodríguez",
    role: "Administrador",
    module: "Finanzas",
    action: "Compra",
    description: "Registró una compra de insumos odontológicos.",
    date: "21/08/2026",
    time: "13:58:44",
    ip: "192.168.1.25",
    device: "Chrome · Windows 11",
    status: "Correcto",
  },
  {
    id: 5,
    user: "Laura Martínez",
    role: "Secretaria",
    module: "Agenda",
    action: "Cancelación",
    description: "Canceló la cita #1039.",
    date: "21/08/2026",
    time: "13:41:09",
    ip: "192.168.1.31",
    device: "Chrome · Windows 11",
    status: "Correcto",
  },
  {
    id: 6,
    user: "Sistema",
    role: "Automático",
    module: "Configuración",
    action: "Configuración",
    description: "Se modificaron preferencias generales de la clínica.",
    date: "21/08/2026",
    time: "12:30:12",
    ip: "10.0.0.1",
    device: "Cloud Esther Server",
    status: "Correcto",
  },
  {
    id: 7,
    user: "Dr. Carlos Pérez",
    role: "Odontólogo",
    module: "Historia Clínica",
    action: "Modificación",
    description: "Actualizó la evolución clínica del paciente #382.",
    date: "21/08/2026",
    time: "11:48:32",
    ip: "192.168.1.42",
    device: "Safari · macOS",
    status: "Correcto",
  },
  {
    id: 8,
    user: "Alejandro Rodríguez",
    role: "Administrador",
    module: "Usuarios",
    action: "Eliminación",
    description: "Eliminó un usuario del equipo.",
    date: "21/08/2026",
    time: "10:17:55",
    ip: "192.168.1.25",
    device: "Chrome · Windows 11",
    status: "Advertencia",
  },
];

const whatsappBackgrounds = [
  {
    id: "lavanda",
    label: "Lavanda Esther",
    className:
      "bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100",
  },
  {
    id: "blanco",
    label: "Blanco",
    className: "bg-white",
  },
  {
    id: "gris",
    label: "Gris suave",
    className: "bg-gradient-to-br from-slate-100 to-slate-200",
  },
  {
    id: "violeta",
    label: "Violeta",
    className:
      "bg-gradient-to-br from-violet-200 via-purple-100 to-indigo-100",
  },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // La configuración continúa funcionando durante la sesión.
  }
}

function SettingRow({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-transparent p-3 transition-colors hover:border-primary/15 hover:bg-background/60">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            checked
              ? "bg-primary-soft text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="size-4" />
        </span>

        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>

          <p className="text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
      />
    </div>
  );
}

function AuditActionBadge({
  action,
}: {
  action: AuditAction;
}) {
  const classes: Record<AuditAction, string> = {
    Creación:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Modificación:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    Eliminación:
      "bg-red-500/10 text-red-700 dark:text-red-400",
    Acceso:
      "bg-violet-500/10 text-violet-700 dark:text-violet-400",
    Cancelación:
      "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    Compra:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Exportación:
      "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
    Configuración:
      "bg-primary/10 text-primary",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${classes[action]}`}
    >
      {action}
    </span>
  );
}

function AuditStatusBadge({
  status,
}: {
  status: AuditStatus;
}) {
  const classes: Record<AuditStatus, string> = {
    Correcto:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Advertencia:
      "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    Bloqueado:
      "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${classes[status]}`}
    >
      {status}
    </span>
  );
}

function SettingsPage() {
  const account = getAccount();

  const currentPlan =
    plans.find((p) => p.id === account?.planId) ?? plans[0]!;

  const [themeColor, setThemeColor] =
    useState<ThemeColor>("violeta");

  const [darkMode, setDarkModeState] = useState(false);

  const [sidebarDark, setSidebarDarkState] =
    useState(false);

  const [sidebarLight, setSidebarLightState] =
    useState(false);

  const [clinic, setClinic] =
    useState<ClinicData>(defaultClinicData);

  const [communication, setCommunication] =
    useState<CommunicationSettings>(
      defaultCommunication,
    );

  const [reminders, setReminders] =
    useState<ReminderSettings>(
      defaultReminders,
    );

  const [notifications, setNotifications] =
    useState<NotificationSettings>(
      defaultNotifications,
    );

  const [agenda, setAgenda] =
    useState<AgendaSettings>(
      defaultAgenda,
    );

  const [selectedRole, setSelectedRole] =
    useState<string | null>(null);

  const [rolePermissions, setRolePermissions] =
    useState<Record<string, PermissionState>>({});

  const [customRoles, setCustomRoles] =
    useState<string[]>([]);

  const [showRoleEditor, setShowRoleEditor] =
    useState(false);

  const [newRoleName, setNewRoleName] =
    useState("");

  const [auditSearch, setAuditSearch] =
    useState("");

  const [auditModule, setAuditModule] =
    useState("Todos los módulos");

  const [auditAction, setAuditAction] =
    useState<AuditAction | "Todas">("Todas");

  useEffect(() => {
    setThemeColor(getThemeColor());
    setDarkModeState(getDarkMode());
    setSidebarDarkState(getSidebarDarkMode());
    setSidebarLightState(getSidebarLightMode());

    setClinic(
      readStorage(STORAGE_KEYS.clinic, {
        ...defaultClinicData,
        businessName: account?.clinicName ?? "",
        email: account?.email ?? "",
      }),
    );

    setCommunication(
      readStorage(
        STORAGE_KEYS.communication,
        defaultCommunication,
      ),
    );

    setReminders(
      readStorage(
        STORAGE_KEYS.reminders,
        defaultReminders,
      ),
    );

    setNotifications(
      readStorage(
        STORAGE_KEYS.notifications,
        defaultNotifications,
      ),
    );

    setAgenda(
      readStorage(
        STORAGE_KEYS.agenda,
        defaultAgenda,
      ),
    );

    setCustomRoles(
      readStorage(
        STORAGE_KEYS.roles,
        [],
      ),
    );
  }, [account?.clinicName, account?.email]);

  const allRoleNames = useMemo(
    () => [
      ...roles.map((role) => role.name),
      ...customRoles,
    ],
    [customRoles],
  );

  useEffect(() => {
    if (
      !selectedRole &&
      allRoleNames.length > 0
    ) {
      setSelectedRole(allRoleNames[0]!);
    }
  }, [allRoleNames, selectedRole]);

  const filteredAuditEntries = useMemo(() => {
    const search = auditSearch
      .trim()
      .toLowerCase();

    return demoAuditEntries.filter((entry) => {
      const matchesSearch =
        !search ||
        [
          entry.user,
          entry.role,
          entry.module,
          entry.action,
          entry.description,
          entry.ip,
          entry.device,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

      const matchesModule =
        auditModule === "Todos los módulos" ||
        entry.module === auditModule;

      const matchesAction =
        auditAction === "Todas" ||
        entry.action === auditAction;

      return (
        matchesSearch &&
        matchesModule &&
        matchesAction
      );
    });
  }, [
    auditSearch,
    auditModule,
    auditAction,
  ]);

  function chooseColor(id: ThemeColor) {
    applyThemeColor(id);
    setThemeColor(id);

    toast.success(
      "Color del panel actualizado.",
    );
  }

  function toggleDarkMode(
    enabled: boolean,
  ) {
    setDarkMode(enabled);
    setDarkModeState(enabled);

    toast.success(
      enabled
        ? "Modo oscuro activado."
        : "Modo oscuro desactivado.",
    );
  }

  function toggleSidebarDark(
    enabled: boolean,
  ) {
    setSidebarDarkMode(enabled);
    setSidebarDarkState(enabled);

    toast.success(
      enabled
        ? "Sidebar oscuro activado."
        : "Sidebar oscuro desactivado.",
    );
  }

  function toggleSidebarLight(
    enabled: boolean,
  ) {
    setSidebarLightMode(enabled);
    setSidebarLightState(enabled);

    toast.success(
      enabled
        ? "Sidebar claro activado."
        : "Sidebar claro desactivado.",
    );
  }

  function updateClinic<K extends keyof ClinicData>(
    key: K,
    value: ClinicData[K],
  ) {
    setClinic((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateCommunication<
    K extends keyof CommunicationSettings,
  >(
    key: K,
    value: CommunicationSettings[K],
  ) {
    setCommunication((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateReminder<
    K extends keyof ReminderSettings,
  >(
    key: K,
    value: ReminderSettings[K],
  ) {
    setReminders((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateNotification<
    K extends keyof NotificationSettings,
  >(
    key: K,
    value: NotificationSettings[K],
  ) {
    setNotifications((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateAgenda<
    K extends keyof AgendaSettings,
  >(
    key: K,
    value: AgendaSettings[K],
  ) {
    setAgenda((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function saveAllSettings() {
    writeStorage(
      STORAGE_KEYS.clinic,
      clinic,
    );

    writeStorage(
      STORAGE_KEYS.communication,
      communication,
    );

    writeStorage(
      STORAGE_KEYS.reminders,
      reminders,
    );

    writeStorage(
      STORAGE_KEYS.notifications,
      notifications,
    );

    writeStorage(
      STORAGE_KEYS.agenda,
      agenda,
    );

    writeStorage(
      STORAGE_KEYS.roles,
      customRoles,
    );

    toast.success(
      "Configuración guardada correctamente.",
      {
        description:
          "Las preferencias disponibles en frontend quedaron guardadas en este dispositivo.",
      },
    );
  }

  function getRolePermissions(
    roleName: string,
  ): PermissionState {
    if (rolePermissions[roleName]) {
      return rolePermissions[roleName]!;
    }

    const initial: PermissionState = {};

    permissionModules.forEach(
      (module) => {
        permissionActions.forEach(
          (action) => {
            initial[
              `${module}:${action}`
            ] = action === "Ver";
          },
        );
      },
    );

    return initial;
  }

  function togglePermission(
    roleName: string,
    permission: string,
  ) {
    setRolePermissions((current) => {
      const existing =
        getRolePermissions(roleName);

      return {
        ...current,
        [roleName]: {
          ...existing,
          [permission]:
            !existing[permission],
        },
      };
    });
  }

  function toggleModule(
    roleName: string,
    module: string,
    enabled: boolean,
  ) {
    setRolePermissions((current) => {
      const existing =
        getRolePermissions(roleName);

      const updated = {
        ...existing,
      };

      permissionActions.forEach(
        (action) => {
          updated[
            `${module}:${action}`
          ] = enabled;
        },
      );

      return {
        ...current,
        [roleName]: updated,
      };
    });
  }

  function createRole() {
    const name =
      newRoleName.trim();

    if (!name) {
      toast.error(
        "Ingresá un nombre para el rol.",
      );

      return;
    }

    if (
      allRoleNames.includes(name)
    ) {
      toast.error(
        "Ya existe un rol con ese nombre.",
      );

      return;
    }

    setCustomRoles(
      (current) => [
        ...current,
        name,
      ],
    );

    setSelectedRole(name);
    setNewRoleName("");
    setShowRoleEditor(false);

    toast.success(
      `Rol "${name}" creado.`,
    );
  }

  function deleteCustomRole(
    roleName: string,
  ) {
    setCustomRoles(
      (current) =>
        current.filter(
          (role) =>
            role !== roleName,
        ),
    );

    setRolePermissions(
      (current) => {
        const updated = {
          ...current,
        };

        delete updated[roleName];

        return updated;
      },
    );

    if (
      selectedRole === roleName
    ) {
      setSelectedRole(
        roles[0]?.name ??
          null,
      );
    }

    toast.success(
      `Rol "${roleName}" eliminado.`,
    );
  }

  const activeRolePermissions =
    selectedRole
      ? getRolePermissions(
          selectedRole,
        )
      : {};

  return (
    <>
      <PageHeader
        title="Configuración"
        description="Configurá tu organización, equipo, roles, comunicación, recordatorios, agenda, seguridad, auditoría y apariencia de Cloud Esther."
        actions={
          <Button
            className="gap-2"
            onClick={saveAllSettings}
          >
            <Save className="size-4" />
            Guardar cambios
          </Button>
        }
      />

      <Tabs defaultValue="clinica">
        <div className="w-full overflow-x-auto">
          <TabsList className="flex h-auto min-w-max flex-nowrap gap-0.5 rounded-xl p-1">
            <TabsTrigger
              value="clinica"
              className="shrink-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs"
            >
              <Building2 className="mr-1 size-3.5" />
              Clínica
            </TabsTrigger>

            <TabsTrigger
              value="sucursales"
              className="shrink-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs"
            >
              Sucursales
            </TabsTrigger>

            <TabsTrigger
              value="equipo"
              className="shrink-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs"
            >
              <Users className="mr-1 size-3.5" />
              Equipo
            </TabsTrigger>

            <TabsTrigger
              value="roles"
              className="shrink-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs"
            >
              <ShieldCheck className="mr-1 size-3.5" />
              Roles y permisos
            </TabsTrigger>

            <TabsTrigger
              value="comunicacion"
              className="shrink-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs"
            >
              <MessageCircle className="mr-1 size-3.5" />
              Comunicación
            </TabsTrigger>

            <TabsTrigger
              value="recordatorios"
              className="shrink-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs"
            >
              <Bell className="mr-1 size-3.5" />
              Recordatorios
            </TabsTrigger>

            <TabsTrigger
              value="notificaciones"
              className="shrink-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs"
            >
              Notificaciones
            </TabsTrigger>

            <TabsTrigger
              value="horarios"
              className="shrink-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs"
            >
              <CalendarClock className="mr-1 size-3.5" />
              Agenda
            </TabsTrigger>

            <TabsTrigger
              value="apariencia"
              className="shrink-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs"
            >
              <Palette className="mr-1 size-3.5" />
              Apariencia
            </TabsTrigger>

            <TabsTrigger
              value="auditoria"
              className="shrink-0 whitespace-nowrap px-2.5 text-[11px] sm:px-3 sm:text-xs"
            >
              <Activity className="mr-1 size-3.5" />
              Auditoría
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========================================================= */}
        {/* CLÍNICA */}
        {/* ========================================================= */}

        <TabsContent
          value="clinica"
          className="mt-4 space-y-5"
        >
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-4 text-primary" />
                Datos de la organización
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  key: "legalName",
                  label: "Razón social",
                  placeholder:
                    "Ej: Clínica Dental Sonrisa S.A.",
                },
                {
                  key: "taxId",
                  label: "CUIT",
                  placeholder:
                    "30-00000000-0",
                },
                {
                  key: "businessName",
                  label: "Nombre comercial",
                  placeholder:
                    "Nombre de tu clínica",
                },
                {
                  key: "email",
                  label:
                    "Correo de contacto",
                  placeholder:
                    "contacto@tuclinica.com",
                },
                {
                  key: "phone",
                  label: "Teléfono",
                  placeholder:
                    "+54 9 11 0000 0000",
                },
                {
                  key: "address",
                  label:
                    "Dirección fiscal",
                  placeholder:
                    "Calle, número, ciudad",
                },
                {
                  key: "city",
                  label: "Ciudad",
                  placeholder:
                    "Buenos Aires",
                },
              ].map((field) => (
                <div
                  key={field.key}
                  className="space-y-1.5"
                >
                  <Label>
                    {field.label}
                  </Label>

                  <Input
                    value={
                      clinic[
                        field.key as keyof ClinicData
                      ]
                    }
                    onChange={(event) =>
                      updateClinic(
                        field.key as keyof ClinicData,
                        event.target.value,
                      )
                    }
                    placeholder={
                      field.placeholder
                    }
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <Label>País</Label>

                <Input
                  value={clinic.country}
                  onChange={(event) =>
                    updateClinic(
                      "country",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>
                  Zona horaria
                </Label>

                <Input
                  value={
                    clinic.timezone
                  }
                  onChange={(event) =>
                    updateClinic(
                      "timezone",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Moneda</Label>

                <Input
                  value={
                    clinic.currency
                  }
                  onChange={(event) =>
                    updateClinic(
                      "currency",
                      event.target.value,
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe2 className="size-4 text-primary" />
                Preferencias regionales
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">
                  País
                </p>

                <p className="mt-1 font-semibold">
                  {clinic.country ||
                    "Sin definir"}
                </p>
              </div>

              <div className="rounded-2xl border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">
                  Moneda
                </p>

                <p className="mt-1 font-semibold">
                  {clinic.currency ||
                    "Sin definir"}
                </p>
              </div>

              <div className="rounded-2xl border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">
                  Zona horaria
                </p>

                <p className="mt-1 truncate font-semibold">
                  {clinic.timezone ||
                    "Sin definir"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================= */}
        {/* SUCURSALES */}
        {/* ========================================================= */}

        <TabsContent
          value="sucursales"
          className="mt-4"
        >
          <Card className={cardStyle}>
            <CardContent className="p-6">
              <EmptyState
                icon={Building2}
                title="Todavía no configuraste sucursales"
                description={`Tu plan (${currentPlan.name}) incluye ${currentPlan.branches.toLowerCase()}. Agregá la primera para organizar agenda, equipo y gabinetes.`}
                action={
                  <Button
                    size="sm"
                    onClick={() =>
                      toast.info(
                        "Formulario de alta de sucursal",
                        {
                          description:
                            "La estructura está preparada. La persistencia real de sucursales requiere backend.",
                        },
                      )
                    }
                  >
                    <Plus className="mr-1.5 size-4" />
                    Agregar sucursal
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================= */}
        {/* EQUIPO */}
        {/* ========================================================= */}

        <TabsContent
          value="equipo"
          className="mt-4 space-y-5"
        >
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-primary" />
                Equipo y usuarios
              </CardTitle>
            </CardHeader>

            <CardContent>
              <EmptyState
                icon={UserPlus}
                title="Todavía no agregaste a tu equipo"
                description="Desde aquí podrás administrar odontólogos, secretarias, asistentes y administradores, asignándoles roles y sucursales."
                action={
                  <Button
                    size="sm"
                    onClick={() =>
                      toast.info(
                        "Formulario de alta de usuario",
                        {
                          description:
                            "La creación real de usuarios requiere autenticación y backend.",
                        },
                      )
                    }
                  >
                    <UserPlus className="mr-1.5 size-4" />
                    Agregar usuario
                  </Button>
                }
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className={cardStyle}>
              <CardContent className="p-5">
                <p className="text-2xl font-bold">
                  0
                </p>

                <p className="text-xs text-muted-foreground">
                  Usuarios
                </p>
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardContent className="p-5">
                <p className="text-2xl font-bold">
                  {allRoleNames.length}
                </p>

                <p className="text-xs text-muted-foreground">
                  Roles disponibles
                </p>
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardContent className="p-5">
                <p className="text-2xl font-bold">
                  {currentPlan.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  Plan actual
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========================================================= */}
        {/* ROLES */}
        {/* ========================================================= */}

        <TabsContent
          value="roles"
          className="mt-4 space-y-5"
        >
          <Card className={cardStyle}>
            <CardHeader className="flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="size-4 text-primary" />
                  Roles y permisos
                </CardTitle>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Definí qué puede consultar, crear,
                  modificar, eliminar o exportar cada
                  tipo de usuario.
                </p>
              </div>

              <Button
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={() =>
                  setShowRoleEditor(
                    (current) =>
                      !current,
                  )
                }
              >
                <Plus className="size-4" />
                Nuevo rol
              </Button>
            </CardHeader>

            {showRoleEditor && (
              <CardContent className="border-t pt-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={newRoleName}
                    onChange={(event) =>
                      setNewRoleName(
                        event.target.value,
                      )
                    }
                    placeholder="Ej: Coordinador de clínica"
                  />

                  <Button
                    onClick={createRole}
                  >
                    <Check className="mr-1.5 size-4" />
                    Crear rol
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRoleEditor(
                        false,
                      );

                      setNewRoleName(
                        "",
                      );
                    }}
                  >
                    <X className="mr-1.5 size-4" />
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            )}

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Rol
                    </TableHead>

                    <TableHead>
                      Alcance
                    </TableHead>

                    <TableHead>
                      Usuarios
                    </TableHead>

                    <TableHead>
                      Permisos
                    </TableHead>

                    <TableHead className="text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {roles.map(
                    (role) => (
                      <TableRow
                        key={role.name}
                      >
                        <TableCell className="font-medium">
                          {role.name}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {role.scope}
                        </TableCell>

                        <TableCell>
                          0
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          {role.permissions}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() =>
                              setSelectedRole(
                                role.name,
                              )
                            }
                          >
                            <Settings2 className="size-3.5" />
                            Gestionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )}

                  {customRoles.map(
                    (roleName) => (
                      <TableRow
                        key={roleName}
                      >
                        <TableCell className="font-medium">
                          {roleName}
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          Personalizado
                        </TableCell>

                        <TableCell>
                          0
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                          Configuración personalizada
                        </TableCell>

                        <TableCell className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setSelectedRole(
                                roleName,
                              )
                            }
                          >
                            <Settings2 className="mr-1.5 size-3.5" />
                            Gestionar
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              deleteCustomRole(
                                roleName,
                              )
                            }
                          >
                            <Trash2 className="size-3.5 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedRole && (
            <Card className={cardStyle}>
              <CardHeader>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Permisos de:{" "}
                      {selectedRole}
                    </CardTitle>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Los cambios se aplican
                      en la interfaz y quedan
                      preparados para una futura
                      persistencia de permisos.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2 text-xs">
                    <KeyRound className="size-3.5 text-primary" />
                    Configuración de acceso
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {permissionModules.map(
                  (module) => {
                    const moduleEnabled =
                      permissionActions.some(
                        (action) =>
                          activeRolePermissions[
                            `${module}:${action}`
                          ],
                      );

                    return (
                      <div
                        key={module}
                        className="rounded-2xl border bg-background/40 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold">
                              {module}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Control de acceso al módulo.
                            </p>
                          </div>

                          <Switch
                            checked={
                              moduleEnabled
                            }
                            onCheckedChange={(
                              checked,
                            ) =>
                              toggleModule(
                                selectedRole,
                                module,
                                checked,
                              )
                            }
                            aria-label={`Activar módulo ${module}`}
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {permissionActions.map(
                            (action) => {
                              const permission =
                                `${module}:${action}`;

                              const enabled =
                                !!activeRolePermissions[
                                  permission
                                ];

                              return (
                                <button
                                  key={
                                    permission
                                  }
                                  type="button"
                                  onClick={() =>
                                    togglePermission(
                                      selectedRole,
                                      permission,
                                    )
                                  }
                                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                                    enabled
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border bg-background text-muted-foreground hover:border-primary/30"
                                  }`}
                                >
                                  {enabled && (
                                    <Check className="mr-1 inline size-3" />
                                  )}

                                  {action}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ========================================================= */}
        {/* COMUNICACIÓN */}
        {/* ========================================================= */}

        <TabsContent
          value="comunicacion"
          className="mt-4 space-y-5"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="size-4 text-primary" />
                  WhatsApp
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <SettingRow
                  icon={MessageCircle}
                  title="Activar canal WhatsApp"
                  description="Habilita las opciones de comunicación por WhatsApp en la interfaz."
                  checked={
                    communication.whatsappEnabled
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateCommunication(
                      "whatsappEnabled",
                      checked,
                    )
                  }
                />

                <div className="rounded-2xl border bg-background/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">
                        Estado de conexión
                      </p>

                      <p className="text-xs text-muted-foreground">
                        No se considera conectado
                        hasta configurar la
                        API/credenciales reales.
                      </p>
                    </div>

                    <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                      No configurado
                    </span>
                  </div>
                </div>

                <SettingRow
                  icon={Bell}
                  title="Recordatorios por WhatsApp"
                  description="Preparar recordatorios de turnos mediante este canal."
                  checked={
                    communication.whatsappReminders
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateCommunication(
                      "whatsappReminders",
                      checked,
                    )
                  }
                />

                <SettingRow
                  icon={Check}
                  title="Confirmaciones por WhatsApp"
                  description="Permitir confirmar o gestionar turnos desde el canal."
                  checked={
                    communication.whatsappConfirmation
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateCommunication(
                      "whatsappConfirmation",
                      checked,
                    )
                  }
                />

                <SettingRow
                  icon={Smartphone}
                  title="Atención por WhatsApp"
                  description="Preparar WhatsApp como canal de recepción."
                  checked={
                    communication.whatsappReception
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateCommunication(
                      "whatsappReception",
                      checked,
                    )
                  }
                />
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="size-4 text-primary" />
                  Correo electrónico
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <SettingRow
                  icon={Mail}
                  title="Activar email"
                  description="Habilita las comunicaciones por correo."
                  checked={
                    communication.emailEnabled
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateCommunication(
                      "emailEnabled",
                      checked,
                    )
                  }
                />

                <SettingRow
                  icon={Bell}
                  title="Recordatorios por email"
                  description="Enviar recordatorios cuando exista un servicio de correo configurado."
                  checked={
                    communication.emailReminders
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateCommunication(
                      "emailReminders",
                      checked,
                    )
                  }
                />

                <SettingRow
                  icon={Check}
                  title="Confirmaciones por email"
                  description="Preparar confirmaciones de turno."
                  checked={
                    communication.emailConfirmation
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateCommunication(
                      "emailConfirmation",
                      checked,
                    )
                  }
                />

                <SettingRow
                  icon={ClipboardList}
                  title="Mostrar estado del canal"
                  description="Mostrar si el canal está configurado, preparado o no configurado."
                  checked={
                    communication.showChannelStatus
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateCommunication(
                      "showChannelStatus",
                      checked,
                    )
                  }
                />
              </CardContent>
            </Card>
          </div>

          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="size-4 text-primary" />
                Apariencia de WhatsApp
              </CardTitle>

              <p className="text-xs text-muted-foreground">
                Personalizá el fondo visual del
                área de conversación de Cloud
                Esther. Esto no modifica el fondo
                de la aplicación WhatsApp real.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {whatsappBackgrounds.map(
                  (background) => (
                    <button
                      key={background.id}
                      type="button"
                      onClick={() =>
                        updateCommunication(
                          "chatBackground",
                          background.id,
                        )
                      }
                      className={`relative overflow-hidden rounded-2xl border-2 p-1 text-left transition-all hover:-translate-y-1 ${
                        communication.chatBackground ===
                        background.id
                          ? "border-primary shadow-lift"
                          : "border-transparent"
                      }`}
                    >
                      <div
                        className={`flex h-28 items-end rounded-xl p-3 ${background.className}`}
                      >
                        <div className="w-full rounded-xl border bg-white/80 p-2 shadow-sm backdrop-blur">
                          <div className="h-2 w-20 rounded-full bg-primary/20" />
                          <div className="mt-2 h-2 w-28 rounded-full bg-muted" />
                        </div>
                      </div>

                      <p className="px-2 py-2 text-xs font-medium">
                        {background.label}
                      </p>

                      {communication.chatBackground ===
                        background.id && (
                        <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </button>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Sparkles className="size-4" />
                </span>

                <div>
                  <p className="text-sm font-semibold">
                    Estado de integración
                  </p>

                  <p className="text-xs text-muted-foreground">
                    WhatsApp está preparado visualmente,
                    pero todavía no está conectado a una
                    API real.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Preparado
              </span>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================= */}
        {/* RECORDATORIOS */}
        {/* ========================================================= */}

        <TabsContent
          value="recordatorios"
          className="mt-4 space-y-5"
        >
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="size-4 text-primary" />
                Recordatorios de turnos
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-2 lg:grid-cols-2">
              <SettingRow
                icon={Bell}
                title="Recordatorio de turno"
                description="Preparar un recordatorio automático antes de la cita."
                checked={
                  reminders.appointmentReminder
                }
                onCheckedChange={(
                  checked,
                ) =>
                  updateReminder(
                    "appointmentReminder",
                    checked,
                  )
                }
              />

              <SettingRow
                icon={Check}
                title="Solicitar confirmación"
                description="Permitir que el paciente confirme el turno."
                checked={
                  reminders.confirmationRequest
                }
                onCheckedChange={(
                  checked,
                ) =>
                  updateReminder(
                    "confirmationRequest",
                    checked,
                  )
                }
              />

              <SettingRow
                icon={Clock3}
                title="Segundo recordatorio"
                description="Preparar un segundo aviso cercano al turno."
                checked={
                  reminders.secondReminder
                }
                onCheckedChange={(
                  checked,
                ) =>
                  updateReminder(
                    "secondReminder",
                    checked,
                  )
                }
              />

              <SettingRow
                icon={CalendarClock}
                title="Permitir reprogramación"
                description="Preparar la posibilidad de solicitar otro horario."
                checked={
                  reminders.allowReschedule
                }
                onCheckedChange={(
                  checked,
                ) =>
                  updateReminder(
                    "allowReschedule",
                    checked,
                  )
                }
              />
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="text-base">
                Tiempos de envío
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>
                  Primer recordatorio —
                  horas antes
                </Label>

                <Input
                  type="number"
                  min="1"
                  max="168"
                  value={
                    reminders.sendBeforeHours
                  }
                  onChange={(event) =>
                    updateReminder(
                      "sendBeforeHours",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>
                  Segundo recordatorio —
                  horas antes
                </Label>

                <Input
                  type="number"
                  min="1"
                  max="48"
                  value={
                    reminders.secondReminderHours
                  }
                  onChange={(event) =>
                    updateReminder(
                      "secondReminderHours",
                      event.target.value,
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-5 text-primary" />

                <div>
                  <p className="text-sm font-semibold">
                    Canales preparados
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Cloud Esther puede preparar WhatsApp,
                    email y eventualmente SMS como canales
                    de recordatorio. El envío real, entrega,
                    confirmación, fallos y reintentos
                    dependen de las integraciones externas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================= */}
        {/* NOTIFICACIONES */}
        {/* ========================================================= */}

        <TabsContent
          value="notificaciones"
          className="mt-4"
        >
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="size-4 text-primary" />
                Notificaciones internas
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-2 lg:grid-cols-2">
              <SettingRow
                icon={CalendarClock}
                title="Nueva cita"
                description="Avisar cuando se cree una nueva cita."
                checked={
                  notifications.appointmentCreated
                }
                onCheckedChange={(
                  checked,
                ) =>
                  updateNotification(
                    "appointmentCreated",
                    checked,
                  )
                }
              />

              <SettingRow
                icon={X}
                title="Cita cancelada"
                description="Avisar cuando se cancele una cita."
                checked={
                  notifications.appointmentCancelled
                }
                onCheckedChange={(
                  checked,
                ) =>
                  updateNotification(
                    "appointmentCancelled",
                    checked,
                  )
                }
              />

              <SettingRow
                icon={Check}
                title="Cita confirmada"
                description="Avisar cuando un paciente confirme."
                checked={
                  notifications.appointmentConfirmed
                }
                onCheckedChange={(
                  checked,
                ) =>
                  updateNotification(
                    "appointmentConfirmed",
                    checked,
                  )
                }
              />

              <SettingRow
                icon={WalletCards}
                title="Pago recibido"
                description="Avisar cuando se registre un pago."
                checked={
                  notifications.paymentReceived
                }
                onCheckedChange={(
                  checked,
                ) =>
                  updateNotification(
                    "paymentReceived",
                    checked,
                  )
                }
              />

              <SettingRow
                icon={UserPlus}
                title="Paciente nuevo"
                description="Avisar cuando se registre un paciente."
                checked={
                  notifications.newPatient
                }
                onCheckedChange={(
                  checked,
                ) =>
                  updateNotification(
                    "newPatient",
                    checked,
                  )
                }
              />

              <SettingRow
                icon={ShieldCheck}
                title="Alertas del sistema"
                description="Mostrar alertas importantes de Cloud Esther."
                checked={
                  notifications.systemAlerts
                }
                onCheckedChange={(
                  checked,
                ) =>
                  updateNotification(
                    "systemAlerts",
                    checked,
                  )
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================= */}
        {/* AGENDA */}
        {/* ========================================================= */}

        <TabsContent
          value="horarios"
          className="mt-4 space-y-5"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock3 className="size-4 text-primary" />
                  Horarios laborales
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="mb-2 text-xs text-muted-foreground">
                  Configurá los horarios generales de atención.
                </p>

                {[
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                ].map((day) => (
                  <div
                    key={day}
                    className="flex flex-wrap items-center gap-2 rounded-xl border border-transparent p-2 hover:bg-background/60"
                  >
                    <span className="w-24 text-sm font-medium">
                      {day}
                    </span>

                    <Input
                      className="w-24"
                      defaultValue="09:00"
                      type="time"
                    />

                    <span className="text-muted-foreground">
                      —
                    </span>

                    <Input
                      className="w-24"
                      defaultValue={
                        day === "Sábado"
                          ? "14:00"
                          : "20:00"
                      }
                      type="time"
                    />

                    <Switch
                      defaultChecked={
                        day !== "Sábado"
                      }
                      aria-label={`Activar ${day}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="size-4 text-primary" />
                  Gabinetes
                </CardTitle>
              </CardHeader>

              <CardContent>
                <EmptyState
                  icon={Building2}
                  title="Todavía no configuraste gabinetes"
                  description="Agregá tus gabinetes o boxes de atención para asignarlos posteriormente en la agenda."
                  action={
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.info(
                          "Formulario de alta de gabinete",
                        )
                      }
                    >
                      <Plus className="mr-1.5 size-4" />
                      Agregar gabinete
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </div>

          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="size-4 text-primary" />
                Preferencias de agenda
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>
                  Duración predeterminada del turno
                </Label>

                <Input
                  type="number"
                  min="5"
                  max="240"
                  value={
                    agenda.defaultDuration
                  }
                  onChange={(event) =>
                    updateAgenda(
                      "defaultDuration",
                      event.target.value,
                    )
                  }
                />

                <p className="text-xs text-muted-foreground">
                  Minutos.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>
                  Tiempo de preparación anterior
                </Label>

                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={
                    agenda.bufferBefore
                  }
                  onChange={(event) =>
                    updateAgenda(
                      "bufferBefore",
                      event.target.value,
                    )
                  }
                />

                <p className="text-xs text-muted-foreground">
                  Minutos.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>
                  Tiempo posterior al turno
                </Label>

                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={
                    agenda.bufferAfter
                  }
                  onChange={(event) =>
                    updateAgenda(
                      "bufferAfter",
                      event.target.value,
                    )
                  }
                />

                <p className="text-xs text-muted-foreground">
                  Minutos.
                </p>
              </div>

              <div className="space-y-2">
                <SettingRow
                  icon={CalendarClock}
                  title="Permitir solapamientos"
                  description="Permite reservar horarios superpuestos."
                  checked={
                    agenda.allowOverlap
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateAgenda(
                      "allowOverlap",
                      checked,
                    )
                  }
                />

                <SettingRow
                  icon={Smartphone}
                  title="Mostrar teléfono del paciente"
                  description="Mostrarlo en la agenda."
                  checked={
                    agenda.showPatientPhone
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateAgenda(
                      "showPatientPhone",
                      checked,
                    )
                  }
                />

                <SettingRow
                  icon={Globe2}
                  title="Reserva online"
                  description="Preparar agenda para futuras reservas online."
                  checked={
                    agenda.allowOnlineBooking
                  }
                  onCheckedChange={(
                    checked,
                  ) =>
                    updateAgenda(
                      "allowOnlineBooking",
                      checked,
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================= */}
        {/* APARIENCIA */}
        {/* ========================================================= */}

        <TabsContent
          value="apariencia"
          className="mt-4 space-y-5"
        >
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Moon className="size-4 text-primary" />
                Modo oscuro
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">
                    Activar modo oscuro
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Cambia el fondo y los textos de
                    todo el panel.
                  </p>
                </div>

                <Switch
                  checked={darkMode}
                  onCheckedChange={
                    toggleDarkMode
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Moon className="size-4 text-primary" />
                Sidebar oscuro
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">
                    Oscurecer solo el menú lateral
                  </p>

                  <p className="text-xs text-muted-foreground">
                    El resto del panel se mantiene
                    claro, independientemente del
                    modo general.
                  </p>
                </div>

                <Switch
                  checked={sidebarDark}
                  onCheckedChange={
                    toggleSidebarDark
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sun className="size-4 text-primary" />
                Sidebar claro
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">
                    Mantener sidebar claro
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Útil cuando el modo oscuro general
                    está activo.
                  </p>
                </div>

                <Switch
                  checked={sidebarLight}
                  onCheckedChange={
                    toggleSidebarLight
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="size-4 text-primary" />
                Color del panel
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Elegí el color principal utilizado
                por botones, enlaces y elementos
                principales del panel.
              </p>

              <div className="flex flex-wrap gap-3">
                {THEME_COLORS.map(
                  (theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() =>
                        chooseColor(
                          theme.id,
                        )
                      }
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all hover:-translate-y-1 ${
                        themeColor ===
                        theme.id
                          ? "border-primary shadow-lift"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <span
                        className="size-10 rounded-full shadow-soft"
                        style={{
                          backgroundColor:
                            theme.swatch,
                        }}
                      />

                      <span className="text-xs font-medium">
                        {theme.label}
                      </span>

                      {themeColor ===
                        theme.id && (
                        <Check className="size-3.5 text-primary" />
                      )}
                    </button>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-primary" />
                Identidad de Cloud Esther
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">
                  Organización
                </p>

                <p className="mt-1 font-semibold">
                  {clinic.businessName ||
                    account?.clinicName ||
                    "Sin configurar"}
                </p>
              </div>

              <div className="rounded-2xl border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">
                  Plan
                </p>

                <p className="mt-1 font-semibold">
                  {currentPlan.name}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================= */}
        {/* AUDITORÍA */}
        {/* ========================================================= */}

        <TabsContent
          value="auditoria"
          className="mt-4 space-y-5"
        >
          <Card className={cardStyle}>
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="size-4 text-primary" />
                    Auditoría del sistema
                  </CardTitle>

                  <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
                    Registro detallado de las acciones realizadas
                    dentro de Cloud Esther. Permite identificar
                    quién realizó una acción, qué módulo fue
                    afectado, qué operación ejecutó, cuándo ocurrió,
                    desde qué IP y desde qué dispositivo o
                    computadora.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2 text-xs">
                  <ShieldCheck className="size-3.5 text-primary" />
                  Registro de actividad
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={auditSearch}
                    onChange={(event) =>
                      setAuditSearch(
                        event.target.value,
                      )
                    }
                    placeholder="Buscar usuario, módulo, IP..."
                    className="pl-9"
                  />
                </div>

                <div className="relative">
                  <select
                    value={auditModule}
                    onChange={(event) =>
                      setAuditModule(
                        event.target.value,
                      )
                    }
                    className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                  >
                    {auditModules.map(
                      (module) => (
                        <option
                          key={module}
                          value={module}
                        >
                          {module}
                        </option>
                      ),
                    )}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <div className="relative">
                  <select
                    value={auditAction}
                    onChange={(event) =>
                      setAuditAction(
                        event.target.value as
                          | AuditAction
                          | "Todas",
                      )
                    }
                    className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                  >
                    <option value="Todas">
                      Todas las acciones
                    </option>

                    {auditActions.map(
                      (action) => (
                        <option
                          key={action}
                          value={action}
                        >
                          {action}
                        </option>
                      ),
                    )}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setAuditSearch("");
                    setAuditModule(
                      "Todos los módulos",
                    );
                    setAuditAction(
                      "Todas",
                    );
                  }}
                >
                  <X className="size-4" />
                  Limpiar filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className={cardStyle}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {demoAuditEntries.length}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Eventos registrados
                    </p>
                  </div>

                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Activity className="size-4" />
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        new Set(
                          demoAuditEntries.map(
                            (entry) =>
                              entry.user,
                          ),
                        ).size
                      }
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Usuarios activos
                    </p>
                  </div>

                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Users className="size-4" />
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        demoAuditEntries.filter(
                          (entry) =>
                            entry.action ===
                            "Eliminación",
                        ).length
                      }
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Eliminaciones
                    </p>
                  </div>

                  <span className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                    <Trash2 className="size-4" />
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        demoAuditEntries.filter(
                          (entry) =>
                            entry.status ===
                            "Advertencia",
                        ).length
                      }
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Eventos con advertencia
                    </p>
                  </div>

                  <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                    <ShieldCheck className="size-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className={cardStyle}>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">
                    Registro de actividad
                  </CardTitle>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {filteredAuditEntries.length} eventos
                    encontrados con los filtros actuales.
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() =>
                    toast.info(
                      "Exportación de auditoría",
                      {
                        description:
                          "La exportación real a CSV, XLSX o PDF quedará conectada al backend.",
                      },
                    )
                  }
                >
                  <FileText className="size-3.5" />
                  Exportar auditoría
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        Usuario
                      </TableHead>

                      <TableHead>
                        Módulo
                      </TableHead>

                      <TableHead>
                        Acción
                      </TableHead>

                      <TableHead>
                        Descripción
                      </TableHead>

                      <TableHead>
                        Fecha / hora
                      </TableHead>

                      <TableHead>
                        IP
                      </TableHead>

                      <TableHead>
                        Computadora / dispositivo
                      </TableHead>

                      <TableHead>
                        Estado
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredAuditEntries.map(
                      (entry) => (
                        <TableRow
                          key={entry.id}
                        >
                          <TableCell>
                            <div className="min-w-[150px]">
                              <p className="font-medium">
                                {entry.user}
                              </p>

                              <p className="text-[11px] text-muted-foreground">
                                {entry.role}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="whitespace-nowrap text-xs font-medium">
                              {entry.module}
                            </span>
                          </TableCell>

                          <TableCell>
                            <AuditActionBadge
                              action={
                                entry.action
                              }
                            />
                          </TableCell>

                          <TableCell>
                            <p className="min-w-[260px] max-w-[360px] text-xs leading-5 text-muted-foreground">
                              {
                                entry.description
                              }
                            </p>
                          </TableCell>

                          <TableCell>
                            <div className="flex min-w-[120px] items-center gap-2">
                              <Clock3 className="size-3.5 text-muted-foreground" />

                              <div>
                                <p className="text-xs font-medium">
                                  {entry.date}
                                </p>

                                <p className="text-[11px] text-muted-foreground">
                                  {entry.time}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="whitespace-nowrap font-mono text-[11px]">
                              {entry.ip}
                            </span>
                          </TableCell>

                          <TableCell>
                            <div className="flex min-w-[170px] items-center gap-2">
                              <Laptop className="size-3.5 text-muted-foreground" />

                              <span className="text-xs text-muted-foreground">
                                {entry.device}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <AuditStatusBadge
                              status={
                                entry.status
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ),
                    )}

                    {filteredAuditEntries.length ===
                      0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="h-32 text-center"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Search className="size-5 text-muted-foreground" />

                            <p className="text-sm font-medium">
                              No se encontraron
                              registros
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Probá modificando
                              los filtros de
                              auditoría.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className={cardStyle}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 text-primary" />

                <div>
                  <p className="text-sm font-semibold">
                    Auditoría preparada para backend
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Esta interfaz define visualmente el registro
                    que deberá recibir la auditoría real. El backend
                    deberá registrar automáticamente el usuario,
                    rol, módulo afectado, tipo de acción, descripción,
                    fecha, hora, IP, dispositivo/computadora,
                    resultado de la operación y, cuando corresponda,
                    el identificador del registro afectado.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "Quién realizó la acción",
                      "Módulo afectado",
                      "Creación",
                      "Modificación",
                      "Eliminación",
                      "Acceso",
                      "Cancelación",
                      "Compra",
                      "Exportación",
                      "Fecha y hora",
                      "Dirección IP",
                      "Computadora / dispositivo",
                    ].map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-full border bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}