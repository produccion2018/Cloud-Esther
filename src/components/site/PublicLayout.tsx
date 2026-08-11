import { Link } from "@tanstack/react-router";
import { Menu, Stethoscope } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/caracteristicas", label: "Características" },
  { to: "/planes", label: "Planes y precios" },
  { to: "/demostracion", label: "Demostración" },
];

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span
        className={`flex size-9 items-center justify-center rounded-xl ${
          inverted ? "bg-primary-foreground/15" : "bg-hero-gradient"
        }`}
      >
        <Stethoscope className={`size-5 ${inverted ? "text-primary-foreground" : "text-primary-foreground"}`} />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        Dentalis<span className="text-primary">Pro</span>
      </span>
    </Link>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-primary-soft text-primary" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link to="/app">Ver el panel</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/demostracion">Solicitar demostración</Link>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" aria-label="Abrir menú">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <div className="mt-6 flex flex-col gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link to="/app" className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                  Ver el panel
                </Link>
                <Button asChild className="mt-4">
                  <Link to="/demostracion">Solicitar demostración</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-24 border-t border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Software de gestión para clínicas odontológicas y grupos multisucursal. Implementación
              guiada y membresía mensual sin permanencia.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Producto</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/caracteristicas" className="hover:text-foreground">Módulos</Link></li>
              <li><Link to="/planes" className="hover:text-foreground">Planes y precios</Link></li>
              <li><Link to="/app" className="hover:text-foreground">Panel de gestión</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Empresa</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/demostracion" className="hover:text-foreground">Solicitar demostración</Link></li>
              <li>soporte@dentalispro.com</li>
              <li>+34 900 123 456</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          © 2026 DentalisPro. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
