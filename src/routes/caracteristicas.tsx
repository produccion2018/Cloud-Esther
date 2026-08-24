import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { modules } from "@/data/demo";
import caracteristicasHero from "@/assets/caracteristicas-hero.png";

export const Route = createFileRoute("/caracteristicas")({
  head: () => ({
    meta: [
      { title: "Módulos y características | Cloud Esther" },
      {
        name: "description",
        content:
          "Agenda, pacientes, gestión clínica, comunicación, marketing, facturación, analítica, directorio, seguridad, multiempresa y más para clínicas odontológicas.",
      },
      { property: "og:title", content: "Módulos y características | Cloud Esther" },
      {
        property: "og:description",
        content: "20 módulos activables para clínicas odontológicas de cualquier tamaño.",
      },
    ],
  }),
  component: Features,
});

/* Fila de un módulo: muñeco a la izquierda + tarjeta angosta a la derecha.
   Aparece con un fade + desplazamiento suave la primera vez que entra en
   pantalla al scrollear (IntersectionObserver, sin librerías nuevas). */
function ModuleRow({ module: m }: { module: (typeof modules)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[m.icon] ?? Icons.Circle;

  return (
    <div
      ref={ref}
      className={`ce-card-hover flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <span
        className={`block w-20 shrink-0 transition-all duration-700 ease-out sm:w-24 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: visible ? "150ms" : "0ms" }}
      >
        <img
          src={m.avatar}
          alt=""
          className={`w-full drop-shadow-lg ${visible ? "animate-avatar-float" : ""}`}
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Icon className="size-4 shrink-0 text-primary" />
          <h2 className="text-base font-semibold">{m.name}</h2>
          {m.tag ? (
            <Badge className="bg-primary text-primary-foreground">{m.tag}</Badge>
          ) : null}
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.description}</p>
        <ul className="mt-2.5 space-y-1">
          {m.bullets.map((b) => (
            <li key={b} className="flex items-start gap-1.5 text-xs">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Features() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#7c3aed]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <h1 className="max-w-xl text-4xl font-bold text-white sm:text-5xl">
              Todos los módulos que tu clínica necesita, activables uno a uno
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/75">
              Cada módulo funciona de forma independiente y comparte los mismos datos de pacientes,
              sucursales y equipo. Activa lo que uses hoy y amplía cuando crezcas.
            </p>
          </div>
          <img
            src={caracteristicasHero}
            alt="Módulos de Cloud Esther conectados: Agenda, Historia Clínica, Facturación, Analítica, Marketing y Seguridad"
            className="mx-auto w-full max-w-md drop-shadow-2xl animate-avatar-float lg:max-w-none"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {modules.map((m) => (
            <ModuleRow key={m.key} module={m} />
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-border bg-card p-8 text-center shadow-soft sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">¿Quieres verlo con datos de tu clínica?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Preparamos una demostración con tu número de sucursales, especialidades y volumen de
            citas reales.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/demostracion">Solicitar demostración</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/planes">Ver planes y precios</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}