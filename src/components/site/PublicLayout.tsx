import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUp, Menu, MessageCircle } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import toothLogo from "@/assets/tooth-logo.png";

/* "Demostración" ya NO va acá — antes duplicaba exactamente lo mismo que el
   botón violeta "Solicitar demostración" del header (mismo destino,
   /demostracion). El link de solicitar demo ahora vive solo en el botón,
   no repetido en el nav. */
const nav = [
  { to: "/", label: "Inicio" },
  { to: "/caracteristicas", label: "Características" },
  { to: "/planes", label: "Planes y precios" },
];

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary">
        <img src={toothLogo} alt="Cloud Esther" className="size-6 object-contain" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        Cloud <span className="text-primary">Esther</span>
      </span>
    </Link>
  );
}

/* "Inicio" siempre fuerza una recarga completa del navegador (no navegación
   SPA), para que la animación de entrada del diente se repita desde cero
   cada vez que se hace clic, sin pasar por el indicador de carga del router. */
function HomeNavLink({
  label,
  className,
  onNavigate,
}: {
  label: string;
  className: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href="/"
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.();
        window.location.href = "/";
      }}
      className={className}
    >
      {label}
    </a>
  );
}

/* Botón flotante "volver arriba": invisible mientras estás cerca del tope,
   aparece con un fade suave al bajar, lleva de nuevo al inicio con scroll
   suave. Vive acá para aparecer en todas las páginas públicas, no solo
   en el Hero. */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-all duration-300 hover:bg-primary/90 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-sky-gradient">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) =>
              item.to === "/" ? (
                <HomeNavLink
                  key={item.to}
                  label={item.label}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === "/"
                      ? "bg-primary-soft text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                />
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: false }}
                  activeProps={{ className: "bg-primary-soft text-primary" }}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link to="/registro">Probar gratis</Link>
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
                {nav.map((item) =>
                  item.to === "/" ? (
                    <HomeNavLink
                      key={item.to}
                      label={item.label}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    />
                  ) : (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
                <Link to="/registro" className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                  Probar gratis
                </Link>
                <Button asChild className="mt-4">
                  <Link to="/demostracion">Solicitar demostración</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="mt-24 border-t border-border bg-accent/50">
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
              <li>soporte@cloudesther.com</li>
              {/* TODO: número de WhatsApp real — este es un placeholder, reemplazar
                  cuando esté dado de alta y actualizar también el href de wa.me */}
              <li className="flex items-center gap-1.5">
                <MessageCircle className="size-4" /> +54 9 11 0000 0000
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          © 2026 Cloud Esther. Todos los derechos reservados.
        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
}