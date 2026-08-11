import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessagesSquare,
  Receipt,
  Search,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { branches } from "@/data/demo";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/app/pacientes", label: "Pacientes", icon: Users },
  { to: "/app/clinica", label: "Gestión clínica", icon: Stethoscope },
  { to: "/app/comunicacion", label: "Comunicación", icon: MessagesSquare },
  { to: "/app/marketing", label: "Marketing", icon: Megaphone },
  { to: "/app/facturacion", label: "Facturación", icon: Receipt },
  { to: "/app/analitica", label: "Analítica", icon: BarChart3 },
  { to: "/app/configuracion", label: "Configuración", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-hero-gradient">
          <Stethoscope className="size-5 text-primary-foreground" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold">DentalisPro</p>
          <p className="text-xs text-muted-foreground">Grupo Dental Arriaga</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="size-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-xl bg-primary-soft p-3">
          <p className="text-xs font-semibold text-secondary-foreground">Plan Grupo Odontológico</p>
          <p className="mt-1 text-xs text-muted-foreground">Renueva el 01/09/2026</p>
          <Button asChild size="sm" variant="secondary" className="mt-3 w-full">
            <Link to="/app/facturacion" onClick={onNavigate}>
              Gestionar suscripción
            </Link>
          </Button>
        </div>
        <Link
          to="/"
          onClick={onNavigate}
          className="mt-3 block px-3 text-xs text-muted-foreground hover:text-foreground"
        >
          ← Volver al sitio público
        </Link>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" aria-label="Abrir navegación">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="relative hidden max-w-xs flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar paciente, cita o factura" className="pl-9" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Select defaultValue="todas">
              <SelectTrigger className="hidden w-[190px] sm:flex">
                <Building2 className="size-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="relative" aria-label="Notificaciones">
              <Bell className="size-4.5" />
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                3
              </span>
            </Button>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">PA</AvatarFallback>
              </Avatar>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-semibold">Dra. Paula Arriaga</p>
                <p className="text-[11px] text-muted-foreground">Propietaria del grupo</p>
              </div>
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
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
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
