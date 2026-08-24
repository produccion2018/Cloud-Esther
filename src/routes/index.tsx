import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileCheck2,
  HeartPulse,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, testimonials, modules } from "@/data/demo";
import ilustracionMasPacientes from "@/assets/beneficios/mas-pacientes.png";
import ilustracionMenosTareas from "@/assets/beneficios/menos-tareas.png";
import ilustracionMejorControl from "@/assets/beneficios/mejor-control.png";
import ilustracionCrecimiento from "@/assets/beneficios/crecimiento-multisucursal.png";
import iconoCitas from "@/assets/stats/citas-gestionadas.png";
import iconoAusencias from "@/assets/stats/ausencias-recordatorios.png";
import iconoPacientes from "@/assets/stats/pacientes-nuevos.png";
import iconoModulos from "@/assets/stats/modulos-plataforma.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cloud Esther | Software de gestión para clínicas odontológicas" },
      {
        name: "description",
        content:
          "Plataforma modular y multisucursal para clínicas odontológicas: agenda, historia clínica, comunicación, marketing, facturación y analítica en un solo panel.",
      },
      { property: "og:title", content: "Cloud Esther | Gestiona toda tu clínica odontológica" },
      {
        property: "og:description",
        content:
          "Implementación guiada y membresía mensual. Activa solo los módulos que tu clínica necesita y crece sin límite de sucursales.",
      },
    ],
  }),
  // ⚠️ reconstruido: si tu archivo viejo usaba otro nombre acá, avisame
  component: HomePage,
});

// 2x2, cada uno con su propio ícono (no el mismo repetido 4 veces)
const heroChecks = [
  { icon: CheckCircle2, label: "Sin permanencia" },
  { icon: FileCheck2, label: "Migración de historiales incluida" },
  { icon: UsersRound, label: "Formación del equipo" },
  { icon: ShieldCheck, label: "Datos siempre seguros" },
];

const stats = [
  { icon: iconoCitas, value: "2.450+", label: "Citas gestionadas por nuestros primeros clientes" },
  { icon: iconoAusencias, value: "35%", label: "De ausencias con recordatorios automáticos" },
  { icon: iconoPacientes, value: "1.200+", label: "De pacientes nuevos captados" },
  { icon: iconoModulos, value: "20", label: "Módulos incluidos por plataforma" },
];

const beneficios = [
  {
    img: ilustracionMasPacientes,
    title: "Más pacientes, sin esfuerzo extra",
    body: "Tu perfil en el directorio público y las campañas de marketing integradas ayudan a captar pacientes nuevos, sin depender de otra herramienta aparte.",
  },
  {
    img: ilustracionMenosTareas,
    title: "Menos tareas administrativas",
    body: "Recordatorios automáticos, agenda inteligente y facturación integrada le sacan trabajo repetitivo a tu equipo, todos los días.",
  },
  {
    img: ilustracionMejorControl,
    title: "Mejor control de tu clínica",
    body: "Analítica en tiempo real de producción, ocupación y facturación por sucursal y por odontólogo, sin planillas sueltas.",
  },
  {
    img: ilustracionCrecimiento,
    title: "Crecé a más sucursales sin fricción",
    body: "Sumá sedes nuevas cuando lo necesites, con datos separados por sucursal y un panel consolidado para todo el grupo.",
  },
];

const valores = [
  { icon: TrendingUp, label: "En crecimiento constante" },
  { icon: Clock, label: "Siempre disponible" },
  { icon: BarChart3, label: "Basado en datos reales" },
  { icon: Building2, label: "Pensado para escalar" },
];

const planTiers = [
  { name: "Esther Inicial", desc: "Para consultorios que recién arrancan", highlight: false },
  { name: "Esther Profesional", desc: "Para clínicas en crecimiento", highlight: true },
  { name: "Esther Avanzada", desc: "Para clínicas con varias especialidades", highlight: false },
  { name: "Esther Grupo", desc: "Para grupos multisucursal", highlight: false },
];

const floatingBadges = [
  { icon: CalendarDays, label: "Turnos", className: "-left-8 top-10 sm:-left-14", duration: 3.2, delay: 0 },
  { icon: Users, label: "Pacientes", className: "-right-6 top-32 sm:-right-10", duration: 3.6, delay: 0.4 },
  { icon: HeartPulse, label: "Resumen", className: "-left-6 bottom-8 sm:-left-12", duration: 3, delay: 0.8 },
];

const recentPatients = [
  { name: "Laura Gómez", treatment: "Limpieza dental", color: "bg-primary" },
  { name: "Marcos Ruiz", treatment: "Control ortodoncia", color: "bg-accent" },
  { name: "Sofía Paz", treatment: "Blanqueamiento", color: "bg-success" },
];

function HomePage() {
  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#150f30] via-[#3b1470] to-[#5b21b6] py-20 text-white sm:py-28 lg:py-32">
        <div className="pointer-events-none absolute -left-24 top-1/3 size-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 size-[32rem] rounded-full bg-accent/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10">
          <div>
            <Badge className="gap-1.5 border-white/15 bg-white/10 px-4 py-1.5 text-white backdrop-blur">
              <Sparkles className="size-3.5" /> Software ideal para clínicas y profesionales
            </Badge>

            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Gestiona tu clínica.
              <br />
              <span className="text-violet-300">Hazla crecer.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base text-white/75 sm:text-lg">
              Plataforma modular y escalable para clínicas y consultorios, que permite
              administrar turnos, pacientes, tratamientos, facturación y más, todo en un solo
              lugar: simple, seguro y eficiente.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/registro">
                  Probar gratis 14 días <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-transparent px-6 text-white hover:bg-white/10"
              >
                <Link to="/demostracion">Solicitar demostración</Link>
              </Button>
            </div>

            <div className="mt-9 grid grid-cols-1 gap-x-8 gap-y-3 text-sm text-white/80 sm:grid-cols-2">
              {heroChecks.map((c) => (
                <span key={c.label} className="flex items-center gap-2">
                  <c.icon className="size-4 shrink-0 text-violet-300" /> {c.label}
                </span>
              ))}
            </div>
          </div>

          {/* Mockup del panel: laptop con mini-dashboard adentro + tarjetitas
              flotando alrededor. Hecho en código (no es una foto) para poder
              animarlo con movimiento continuo/infinito. */}
          <div className="relative mx-auto w-full max-w-lg py-10">
            <motion.div
              className="relative rounded-t-2xl border-[10px] border-b-0 border-[#1f1f2e] bg-[#0f0f1a] p-2.5 shadow-2xl"
              animate={{ y: [0, -16, 0], rotateZ: [0, 0.5, 0, -0.5, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="overflow-hidden rounded-lg bg-white text-neutral-900">
                <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2">
                  <span className="text-xs font-bold text-primary">Cloud Esther</span>
                  <div className="hidden h-5 w-24 rounded-full bg-neutral-100 sm:block" />
                  <div className="flex items-center gap-1.5">
                    <span className="size-5 rounded-full bg-primary/15" />
                    <span className="size-5 rounded-full bg-primary text-[7px] font-bold text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-[64px_1fr] gap-0">
                  <div className="space-y-2 border-r border-neutral-100 bg-neutral-50/60 p-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-6 rounded-md ${i === 0 ? "bg-primary/15" : "bg-neutral-100"}`}
                      />
                    ))}
                  </div>
                  <div className="space-y-2.5 p-3">
                    <p className="text-[11px] font-bold">Dashboard</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 rounded-md bg-primary-soft p-2.5">
                        <div className="flex items-baseline justify-between">
                          <p className="text-[9px] font-semibold text-primary">Ingresos</p>
                          <p className="text-xs font-bold text-primary">$24.580</p>
                        </div>
                        <div className="mt-2 flex h-12 items-end gap-1">
                          {[40, 65, 35, 80, 55, 70, 45].map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h}%` }}
                              className="w-2 rounded-t bg-primary/70"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="rounded-md border border-neutral-100 p-2 text-center">
                        <div className="mx-auto size-10 rounded-full border-[5px] border-primary border-r-accent border-t-success" />
                        <p className="mt-1 text-[7px] text-muted-foreground">Tratamientos</p>
                      </div>
                    </div>
                    <div className="rounded-md border border-neutral-100 p-2.5">
                      <p className="text-[9px] font-semibold">Pacientes recientes</p>
                      <div className="mt-1.5 space-y-1.5">
                        {recentPatients.map((p) => (
                          <div key={p.name} className="flex items-center gap-2">
                            <span className={`size-4 shrink-0 rounded-full ${p.color}`} />
                            <span className="truncate text-[8px] font-medium">{p.name}</span>
                            <span className="ml-auto truncate text-[7px] text-muted-foreground">
                              {p.treatment}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="mx-auto h-4 w-[114%] -translate-x-[6%] rounded-b-2xl bg-gradient-to-b from-[#3a3a4d] to-[#25252f]" />

            {floatingBadges.map((b) => (
              <motion.div
                key={b.label}
                className={`absolute flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 text-neutral-900 shadow-lift ${b.className}`}
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: b.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: b.delay,
                }}
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <b.icon className="size-4" />
                </span>
                <span className="text-xs font-semibold">{b.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BARRA DE METRICAS */}
      <section className="border-b border-border bg-card py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.label} className="flex items-start gap-3">
              <img src={s.icon} alt="" className="size-10 shrink-0" />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="mx-auto max-w-6xl space-y-20 px-4 py-20 sm:px-6">
        {beneficios.map((f, i) => (
          <div
            key={f.title}
            className={`grid items-center gap-10 lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <img src={f.img} alt="" className="mx-auto w-full max-w-sm" />
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">{f.title}</h3>
              <p className="mt-3 text-muted-foreground">{f.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* QUIENES SOMOS */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Badge variant="secondary" className="gap-1.5">
            <Building2 className="size-3.5" /> Quiénes somos
          </Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Un equipo enfocado en clínicas odontológicas
          </h2>
          <p className="mt-4 text-muted-foreground">
            Construimos Cloud Esther para que cada clínica, sin importar su tamaño, tenga acceso
            a herramientas de gestión profesionales, sin depender de planillas sueltas ni de
            varios sistemas desconectados entre sí. Trabajamos junto a odontólogos y
            administradores para que cada módulo resuelva un problema real del día a día.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-4">
            {valores.map((v) => (
              <div key={v.label} className="flex flex-col items-center gap-2">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <v.icon className="size-5" />
                </span>
                <span className="text-sm font-medium">{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES (teaser — el detalle y los precios reales viven en /planes) */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Un plan para cada etapa de tu clínica</h2>
          <p className="mt-3 text-muted-foreground">
            Activá solo lo que necesitás hoy, y ampliá cuando tu clínica crezca.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {planTiers.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-3xl border p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
                p.highlight
                  ? "border-transparent bg-hero-gradient text-primary-foreground"
                  : "border-border bg-card"
              }`}
            >
              {p.highlight ? (
                <Badge className="mb-4 w-fit border-white/30 bg-white/15 text-white">
                  Más elegido
                </Badge>
              ) : null}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p
                className={`mt-2 text-sm ${
                  p.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {p.desc}
              </p>
              <Button asChild className="mt-8" variant={p.highlight ? "secondary" : "default"}>
                <Link to="/planes">
                  Ver detalle y precio <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">Lo que dicen nuestros clientes</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="shadow-soft">
              <CardContent className="p-6">
                <Quote className="size-6 text-primary/40" />
                {/* ⚠️ reconstruido: asumí que el campo se llama "quote" — si en
                    tu demo.ts se llama distinto (ej. t.text, t.content), avisame */}
                <p className="mt-3 text-sm text-muted-foreground">{t.quote}</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Preguntas frecuentes</h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="ce-card-hover ce-gradient-flow overflow-hidden rounded-3xl bg-hero-gradient p-10 text-primary-foreground shadow-lift sm:p-14">
          <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
            Digitaliza tu clínica en menos de dos semanas
          </h2>
          <p className="mt-4 max-w-xl text-primary-foreground/85">
            Te acompañamos en la configuración, la migración de historiales y la formación de tu
            equipo. Después, solo una membresía mensual y cero permanencia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/demostracion">Solicitar demostración</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/app">Explorar el panel de demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold">Cloud Esther</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Software de gestión para clínicas odontológicas que quieren crecer.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold">Producto</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/caracteristicas" className="hover:text-foreground">Características</Link></li>
              <li><Link to="/planes" className="hover:text-foreground">Planes y precios</Link></li>
              <li><Link to="/demostracion" className="hover:text-foreground">Solicitar demostración</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Empresa</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-default">Quiénes somos</span></li>
              <li><span className="cursor-default">Contacto</span></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Cuenta</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/registro" className="hover:text-foreground">Probar gratis</Link></li>
              <li><Link to="/app" className="hover:text-foreground">Ingresar al panel</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Cloud Esther. Todos los derechos reservados.
        </div>
      </footer>
    </PublicLayout>
  );
}