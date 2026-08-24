import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Boxes,
  Building2,
  CalendarDays,
  ChevronDown,
  FlaskConical,
  FolderOpen,
  IdCard,
  LayoutDashboard,
  Lock,
  Mails,
  Menu,
  MessagesSquare,
  Plug,
  ScanLine,
  Settings,
  Sparkles,
  UserCircle2,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { branches, plans, type ModuleKey } from "@/data/demo";
import { getAccount, type Account } from "@/lib/account";
import { setLastModule } from "@/lib/esther-chat";
import {
  applyStoredThemeColor,
  applyStoredDarkMode,
  getDarkMode,
  getSidebarDarkMode,
  getSidebarDarkVars,
  getSidebarLightMode,
  getSidebarLightVars,
  getThemeColor,
} from "@/lib/theme";

import toothLogo from "@/assets/tooth-logo.png";
import dashboardHeaderScene from "@/assets/fondos/dashboard-header-scene.jpg";
import pacientesPageBg from "@/assets/fondos/pacientes-page-bg.png";
import agendaPageBg from "@/assets/fondos/agenda-page-bg.png";
import clinicaPageBg from "@/assets/fondos/clinica-page-bg.png";
import estudiosPageBg from "@/assets/fondos/estudios-page-bg.png";
import laboratorioPageBg from "@/assets/fondos/laboratorio-page-bg.png";
import comunicacionPageBg from "@/assets/fondos/comunicacion-page-bg.png";
import marketingPageBg from "@/assets/fondos/marketing-page-bg.png";
import portalPacientePageBg from "@/assets/fondos/portal-paciente-page-bg.png";
import inventarioPageBg from "@/assets/fondos/inventario-page-bg.png";
import equipoPageBg from "@/assets/fondos/equipo-page-bg.png";
import finanzasPageBg from "@/assets/fondos/finanzas-page-bg.png";
import analiticaPageBg from "@/assets/fondos/analitica-page-bg.png";
import iaEstherPageBg from "@/assets/fondos/ia-esther-page-bg.png";
import multiempresaPageBg from "@/assets/fondos/multiempresa-page-bg.png";
import integracionesPageBg from "@/assets/fondos/integraciones-page-bg.png";
import documentosPageBg from "@/assets/fondos/documentos-page-bg.png";
import configuracionPageBg from "@/assets/fondos/configuracion-page-bg.png";

const PAGE_BACKGROUND_BY_ROUTE: Partial<Record<string, string>> = {
  "/app/pacientes": pacientesPageBg,
  "/app/agenda": agendaPageBg,
  "/app/clinica": clinicaPageBg,
  "/app/estudios-diagnostico": estudiosPageBg,
  "/app/laboratorio": laboratorioPageBg,
  "/app/comunicacion": comunicacionPageBg,
  "/app/marketing": marketingPageBg,
  "/app/portal-paciente": portalPacientePageBg,
  "/app/inventario": inventarioPageBg,
  "/app/equipo": equipoPageBg,
  "/app/finanzas": finanzasPageBg,
  "/app/analitica": analiticaPageBg,
  "/app/ia-esther": iaEstherPageBg,
  "/app/multiempresa": multiempresaPageBg,
  "/app/integraciones": integracionesPageBg,
  "/app/documentos": documentosPageBg,
  "/app/configuracion": configuracionPageBg,
};

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  moduleKey?: ModuleKey;
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Clínico",
    items: [
      {
        to: "/app",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        to: "/app/agenda",
        label: "Agenda y turnos",
        icon: CalendarDays,
        moduleKey: "agenda",
      },
      {
        to: "/app/pacientes",
        label: "Pacientes",
        icon: Users,
        moduleKey: "pacientes",
      },
      {
        to: "/app/clinica",
        label: "Gestión clínica",
        icon: Boxes,
        moduleKey: "clinica",
      },
      {
        to: "/app/estudios-diagnostico",
        label: "Estudios y diagnóstico",
        icon: ScanLine,
        moduleKey: "estudios-diagnostico",
      },
      {
        to: "/app/laboratorio",
        label: "Laboratorio",
        icon: FlaskConical,
        moduleKey: "laboratorio",
      },
    ],
  },

  /*
   * CENTRO DE OPERACIONES
   *
   * Se mantienen todos los módulos que ya existían dentro de "Operación".
   * El cambio es principalmente de organización y nomenclatura para que
   * Cloud Esther tenga un área claramente identificada como Centro de
   * Operaciones.
   *
   * No se crean rutas ficticias: solamente se utilizan rutas que ya existen.
   */
  {
    label: "Centro de Operaciones",
    items: [
      {
        to: "/app/comunicacion",
        label: "Comunicación",
        icon: MessagesSquare,
        moduleKey: "comunicacion",
      },
      {
        to: "/app/notificaciones",
        label: "Notificaciones",
        icon: Bell,
        moduleKey: "notificaciones",
      },
      {
        to: "/app/marketing",
        label: "Marketing y captación",
        icon: Boxes,
        moduleKey: "marketing",
      },
      {
        to: "/app/portal-paciente",
        label: "Portal del paciente",
        icon: UserCircle2,
        moduleKey: "portal-paciente",
      },
      {
        to: "/app/inventario",
        label: "Inventario",
        icon: Boxes,
        moduleKey: "inventario",
      },
      {
        to: "/app/equipo",
        label: "Equipo y RRHH",
        icon: IdCard,
      },
    ],
  },

  {
    label: "Administración",
    items: [
      {
        to: "/app/finanzas",
        label: "Finanzas",
        icon: Wallet,
        moduleKey: "facturacion",
      },
      {
        to: "/app/analitica",
        label: "Analítica",
        icon: BarChart3,
        moduleKey: "analitica",
      },
      {
        to: "/app/ia-esther",
        label: "IA Esther",
        icon: Sparkles,
        moduleKey: "ia-esther",
      },
      {
        to: "/app/multiempresa",
        label: "Multiempresa",
        icon: Mails,
        moduleKey: "multiempresa",
      },
      {
        to: "/app/integraciones",
        label: "Integraciones",
        icon: Plug,
        moduleKey: "integraciones",
      },
      {
        to: "/app/documentos",
        label: "Documentos y seguridad",
        icon: FolderOpen,
        moduleKey: "documentos",
      },
      {
        to: "/app/configuracion",
        label: "Configuración",
        icon: Settings,
      },
    ],
  },
];

const navItems: NavItem[] = navGroups.flatMap((group) => group.items);

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

function SidebarContent({
  account,
  onNavigate,
}: {
  account: Account;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const plan = plans.find((p) => p.id === account.planId);

  return (
    <div className="flex h-full flex-col">
      {/* LOGO / CLÍNICA */}
      <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-5 sm:h-24">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary shadow-soft">
          <img
            src={toothLogo}
            alt="Cloud Esther"
            className="size-6.5 object-contain"
          />
        </span>

        <div className="min-w-0 leading-tight">
          <p className="truncate font-display text-base font-bold text-sidebar-foreground">
            Cloud Esther
          </p>

          <p className="truncate text-xs text-sidebar-foreground/70">
            {account.clinicName}
          </p>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="ce-sidebar-scroll flex-1 space-y-5 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to);

                const unlocked =
                  !item.moduleKey ||
                  !!plan?.modules.includes(item.moduleKey);

                /*
                 * Módulo bloqueado por plan.
                 * No se elimina de la navegación: se muestra claramente
                 * como disponible mediante ampliación de plan.
                 */
                if (!unlocked) {
                  return (
                    <div
                      key={item.to}
                      className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/35"
                      title={`El módulo "${item.label}" no está incluido en tu plan`}
                    >
                      <item.icon className="size-4.5 shrink-0" />

                      <span className="truncate">{item.label}</span>

                      <Lock className="ml-auto size-3.5 shrink-0" />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                      active
                        ? "bg-primary font-semibold text-white shadow-lift ring-1 ring-white/25"
                        : "font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-0.5"
                    }`}
                  >
                    <item.icon className="size-4.5 shrink-0" />

                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* PLAN */}
      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-xl bg-sidebar-accent p-3">
          <p className="text-xs font-semibold text-sidebar-accent-foreground">
            {plan ? plan.name : "Sin plan"}
          </p>

          <p className="mt-1 text-xs text-sidebar-accent-foreground/70">
            Cuenta recién creada
          </p>

          <Button
            asChild
            size="sm"
            variant="secondary"
            className="mt-3 w-full"
          >
            <Link to="/app/finanzas" onClick={onNavigate}>
              Gestionar suscripción
            </Link>
          </Button>
        </div>

        <Link
          to="/"
          onClick={onNavigate}
          className="mt-3 block px-3 text-xs text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground"
        >
          ← Volver al sitio público
        </Link>
      </div>
    </div>
  );
}

function HeaderControls({
  account,
  now,
  open,
  setOpen,
  light,
  sidebarStyle,
}: {
  account: Account;
  now: Date;
  open: boolean;
  setOpen: (value: boolean) => void;
  light?: boolean;
  sidebarStyle?: React.CSSProperties;
}) {
  const pillClass = light
    ? "border border-border bg-card text-card-foreground shadow-soft hover:bg-muted/60"
    : "bg-white/90 text-neutral-900 shadow-lift backdrop-blur hover:bg-white";

  return (
    <>
      {/* MENÚ MOBILE */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="secondary"
            size="icon"
            className={pillClass}
            aria-label="Abrir navegación"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-72 bg-sidebar p-0"
          style={sidebarStyle}
        >
          <SidebarContent
            account={account}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* FECHA Y HORA */}
      <span
        className={`hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-medium sm:flex ${pillClass}`}
      >
        <CalendarDays className="size-3.5 text-primary" />

        {now.toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}

        <span className="text-muted-foreground">·</span>

        {now.toLocaleTimeString("es-AR", {
          hour: "numeric",
          minute: "2-digit",
        })}
      </span>

      {/* CONTROLES */}
      <div className="ml-auto flex items-center gap-1.5">
        {/* SELECTOR DE SUCURSAL */}
        <Select defaultValue="todas">
          <SelectTrigger
            className={`hidden h-9 w-[170px] sm:flex ${pillClass}`}
          >
            <Building2 className="size-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* NOTIFICACIONES */}
        <Button
          variant="secondary"
          size="icon"
          className={`relative size-9 rounded-full ${pillClass}`}
          aria-label="Notificaciones"
        >
          <Bell className="size-4" />
        </Button>

        {/* MENSAJES */}
        <Button
          variant="secondary"
          size="icon"
          className={`hidden size-9 rounded-full sm:flex ${pillClass}`}
          aria-label="Mensajes"
        >
          <MessagesSquare className="size-4" />
        </Button>

        {/* CONFIGURACIÓN */}
        <Button
          asChild
          variant="secondary"
          size="icon"
          className={`hidden size-9 rounded-full sm:flex ${pillClass}`}
          aria-label="Configuración"
        >
          <Link to="/app/configuracion">
            <Settings className="size-4" />
          </Link>
        </Button>

        {/* USUARIO */}
        <div
          className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 ${pillClass}`}
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {initials(account.contactName) || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold">{account.contactName}</p>

            <p className="text-[11px] text-muted-foreground">Dueño/a</p>
          </div>

          <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" />
        </div>
      </div>
    </>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState<Account | null | "loading">(
    "loading",
  );
  const [now, setNow] = useState(() => new Date());
  const [sidebarStyle, setSidebarStyle] = useState<
    Record<string, string> | undefined
  >(undefined);

  const navigate = useNavigate();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const found = getAccount();

    if (!found) {
      navigate({ to: "/registro" });
      return;
    }

    setAccount(found);

    applyStoredDarkMode();
    applyStoredThemeColor();
    recomputeSidebarStyle();
  }, [navigate]);

  function recomputeSidebarStyle() {
    const isFullDark = getDarkMode();

    if (!isFullDark && getSidebarDarkMode()) {
      setSidebarStyle(
        getSidebarDarkVars(getThemeColor()) as Record<string, string>,
      );
    } else if (isFullDark && getSidebarLightMode()) {
      setSidebarStyle(
        getSidebarLightVars(getThemeColor()) as Record<string, string>,
      );
    } else {
      setSidebarStyle(undefined);
    }
  }

  useEffect(() => {
    window.addEventListener(
      "cloud-esther-theme-change",
      recomputeSidebarStyle,
    );

    return () => {
      window.removeEventListener(
        "cloud-esther-theme-change",
        recomputeSidebarStyle,
      );
    };
  }, []);

  /*
   * Esther recuerda el último módulo visitado para poder utilizarlo
   * como contexto visual/conversacional.
   */
  useEffect(() => {
    const item = navItems.find((navItem) =>
      navItem.exact
        ? pathname === navItem.to
        : pathname.startsWith(navItem.to),
    );

    if (item && item.to !== "/app/ia-esther") {
      setLastModule(item.label);
    }
  }, [pathname]);

  if (account === "loading" || account === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Cargando…
      </div>
    );
  }

  const plan = plans.find((p) => p.id === account.planId);

  const currentNavItem = navItems.find((item) =>
    item.exact
      ? pathname === item.to
      : pathname.startsWith(item.to),
  );

  const blocked =
    !!currentNavItem?.moduleKey &&
    !plan?.modules.includes(currentNavItem.moduleKey);

  const pageBackground =
    pathname === "/app"
      ? undefined
      : PAGE_BACKGROUND_BY_ROUTE[currentNavItem?.to ?? ""];

  return (
    <div className="min-h-screen bg-muted/40">
      {/* SIDEBAR DESKTOP */}
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-sidebar-border bg-sidebar lg:block"
        style={sidebarStyle}
      >
        <SidebarContent account={account} />
      </aside>

      <div className="lg:pl-72">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* HEADER DEL DASHBOARD */}
          {pathname === "/app" ? (
            <header className="group relative h-56 overflow-hidden rounded-3xl shadow-lift transition-shadow duration-300 hover:shadow-2xl sm:h-64 lg:h-72">
              <style>{`
                @keyframes dashboard-header-zoom {
                  0%, 100% {
                    transform: scale(1.03);
                    opacity: 0.92;
                  }

                  50% {
                    transform: scale(1.14);
                    opacity: 1;
                  }
                }
              `}</style>

              <img
                src={dashboardHeaderScene}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                style={{
                  animation:
                    "dashboard-header-zoom 12s ease-in-out infinite",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />

              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-background/25 sm:w-24" />

              <div className="relative flex h-full items-start gap-2 p-4 sm:p-5">
                <HeaderControls
                  account={account}
                  now={now}
                  open={open}
                  setOpen={setOpen}
                  sidebarStyle={sidebarStyle}
                />
              </div>
            </header>
          ) : (
            <div className="flex items-center gap-2">
              <HeaderControls
                account={account}
                now={now}
                open={open}
                setOpen={setOpen}
                sidebarStyle={sidebarStyle}
                light
              />
            </div>
          )}

          {/* CONTENIDO */}
          <div className="relative mt-4 sm:mt-6">
            {pageBackground ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/50 via-primary-soft/20 to-transparent" />

                <img
                  src={pageBackground}
                  alt=""
                  className="pointer-events-none absolute -right-4 top-0 w-72 opacity-40 sm:w-96 lg:w-[28rem]"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 55%, transparent 92%)",
                    maskImage:
                      "linear-gradient(to bottom, black 55%, transparent 92%)",
                  }}
                />
              </>
            ) : null}

            <div className="relative">
              {blocked ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
                  <p className="text-base font-semibold">
                    Este módulo no está incluido en tu plan
                  </p>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    {plan?.name ?? "Tu plan"} no incluye esta sección. Podés
                    ampliarlo desde Facturación.
                  </p>

                  <Button asChild className="mt-5" size="sm">
                    <Link to="/app/finanzas">Ver planes</Link>
                  </Button>
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  badge,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  badge?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

          {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </div>

        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}