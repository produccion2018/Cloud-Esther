import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  Building2,
  CheckCircle2,
  Clock,
  HeartPulse,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
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
import toothLogo from "@/assets/tooth-logo.png";

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
  component: Landing,
});

const benefits = [
  {
    icon: TrendingUp,
    title: "Más pacientes",
    text: "Captación desde el directorio, formularios web y campañas de reactivación de pacientes inactivos.",
  },
  {
    icon: Clock,
    title: "Menos tareas administrativas",
    text: "Recordatorios automáticos, confirmaciones y plantillas de mensajes que liberan horas de recepción.",
  },
  {
    icon: BarChart3,
    title: "Mejor control",
    text: "Producción, ocupación de gabinetes y rendimiento por odontólogo en tiempo real.",
  },
  {
    icon: Building2,
    title: "Crecimiento multisucursal",
    text: "Abre nuevas sedes sin cambiar de sistema: datos separados y consolidado del grupo.",
  },
];

function Landing() {
  return (
    <PublicLayout>
      {/* Hero — degradé violeta de marca (Cloud Esther), sin foto de fondo,
          texto claro */}
      <section className="relative overflow-hidden text-primary-foreground">
        <div className="absolute inset-0 bg-hero-gradient" />

        {/* Diente grande decorativo, en el espacio vacío a la derecha
            (solo pantallas grandes — en mobile no hay lugar para él).
            Wrapper con 2 "patitas" propias debajo, para que la caminata
            se sienta más como un personaje y no solo un objeto deslizándose. */}
        <div
          className="pointer-events-none absolute -right-10 top-[24%] hidden w-80 opacity-90 drop-shadow-2xl animate-tooth-entrance lg:block xl:w-[26rem]"
        >
          <img src={toothLogo} alt="" className="relative z-10 w-full" />
          <span className="tooth-foot tooth-foot-left" />
          <span className="tooth-foot tooth-foot-right" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6 lg:pb-28 lg:pt-6">
          <Badge className="mb-5 gap-1.5 border-primary-foreground/25 bg-primary-foreground/15 px-3 py-1.5 text-primary-foreground hover:bg-primary-foreground/15">
            <Sparkles className="size-3.5" /> Implementación guiada + membresía mensual
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Gestiona toda tu clínica odontológica desde un solo lugar
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/85">
            Una plataforma modular y escalable para clínicas pequeñas, medianas, grandes y grupos
            odontológicos. Activa únicamente los módulos que necesitas y amplía tu plan cuando
            crezcas, sin límite de sucursales, odontólogos, empleados ni pacientes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/demostracion">
                Solicitar demostración <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/planes">Ver planes</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-foreground/85">
            {["Sin permanencia", "Migración de historiales incluida", "Formación del equipo", "Datos cifrados"].map(
              (i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-primary-foreground" /> {i}
                </span>
              ),
            )}
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CalendarDays, k: "38.400", v: "citas gestionadas al mes" },
              { icon: HeartPulse, k: "-34 %", v: "de ausencias tras 3 meses" },
              { icon: Users, k: "+21 %", v: "de pacientes nuevos" },
              { icon: ShieldCheck, k: "99,9 %", v: "de disponibilidad" },
            ].map((s) => (
              <Card key={s.k} className="border-border/70 shadow-soft">
                <CardContent className="flex items-center gap-3 p-5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <s.icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-xl font-bold">{s.k}</p>
                    <p className="text-xs text-muted-foreground">{s.v}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Resultados que tu clínica puede medir</h2>
          <p className="mt-4 text-muted-foreground">
            Cloud Esther conecta la agenda, la historia clínica y la comunicación con el paciente
            para que tu equipo dedique el tiempo a tratar, no a administrar.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <Card key={b.title} className="h-full border-border/70 shadow-soft transition-shadow hover:shadow-lift">
              <CardContent className="p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <b.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Módulos resumen */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">Diez módulos, una sola plataforma</h2>
              <p className="mt-4 text-muted-foreground">
                Empieza por la agenda y la historia clínica, y añade marketing, facturación o
                administración multiempresa cuando lo necesites.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/caracteristicas">Ver todos los módulos</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <div
                key={m.key}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">Clínicas que ya trabajan con Cloud Esther</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="h-full border-border/70 shadow-soft">
              <CardContent className="flex h-full flex-col p-6">
                <Quote className="size-6 text-primary" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">"{t.quote}"</p>
                <div className="mt-6 border-t border-border pt-4">
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
                <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-hero-gradient p-10 text-primary-foreground shadow-lift sm:p-14">
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
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/app">Explorar el panel de demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}