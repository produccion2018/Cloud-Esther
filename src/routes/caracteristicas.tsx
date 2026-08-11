import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { modules } from "@/data/demo";

export const Route = createFileRoute("/caracteristicas")({
  head: () => ({
    meta: [
      { title: "Módulos y características | DentalisPro" },
      {
        name: "description",
        content:
          "Agenda, pacientes, gestión clínica, comunicación, marketing, facturación, analítica, directorio, seguridad y multiempresa para clínicas odontológicas.",
      },
      { property: "og:title", content: "Módulos y características | DentalisPro" },
      {
        property: "og:description",
        content: "Diez módulos activables para clínicas odontológicas de cualquier tamaño.",
      },
    ],
  }),
  component: Features,
});

function Features() {
  return (
    <PublicLayout>
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
            Todos los módulos que tu clínica necesita, activables uno a uno
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Cada módulo funciona de forma independiente y comparte los mismos datos de pacientes,
            sucursales y equipo. Activa lo que uses hoy y amplía cuando crezcas.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((m) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[m.icon] ?? Icons.Circle;
            return (
              <Card key={m.key} className="h-full border-border/70 shadow-soft transition-shadow hover:shadow-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h2 className="text-lg font-semibold">{m.name}</h2>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{m.description}</p>
                  <ul className="mt-5 space-y-2">
                    {m.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
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
