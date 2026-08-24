import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock, Pencil, Plus } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState } from "react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  addOns,
  currency,
  moduleIconByKey,
  moduleNameByKey,
  modules,
  plans,
} from "@/data/demo";
import orbitHero from "@/assets/planes-orbit-hero.png";

export const Route = createFileRoute("/planes")({
  head: () => ({
    meta: [
      { title: "Planes y precios para clínicas odontológicas | Cloud Esther" },
      {
        name: "description",
        content:
          "Cuatro planes escalonados: Clínica Inicial, Profesional, Avanzada y Grupo Odontológico. Implementación inicial + membresía mensual y módulos adicionales.",
      },
      { property: "og:title", content: "Planes y precios | Cloud Esther" },
      {
        property: "og:description",
        content: "Precios configurables, módulos adicionales y sucursales ilimitadas.",
      },
    ],
  }),
  component: Pricing,
});

/* Escena de los 20 módulos: ilustración 3D isométrica única, generada con
   IA (plataformas conectadas al diente central), en vez de armar la
   composición con código. Los nombres de cada módulo se superponen por
   separado con posiciones en % (ORBIT_LABEL_POSITIONS) para que sigan
   siendo fáciles de editar/traducir sin regenerar la imagen.
   OJO: la imagen en sí es fija — si se agrega un módulo 21, hay que pedir
   una nueva versión de la ilustración con esa plataforma de más, y sumarle
   su posición acá. */
const ORBIT_LABEL_POSITIONS: Partial<Record<string, { x: number; y: number }>> = {
  agenda: { x: 24, y: 22 },
  clinica: { x: 35, y: 28 },
  "portal-paciente": { x: 41, y: 18 },
  notificaciones: { x: 59, y: 16 },
  analitica: { x: 54, y: 23 },
  comunicacion: { x: 76, y: 22 },
  facturacion: { x: 70, y: 36 },
  laboratorio: { x: 89, y: 39 },
  pacientes: { x: 13, y: 37 },
  directorio: { x: 23, y: 44 },
  turnos: { x: 7, y: 52 },
  integraciones: { x: 23, y: 62 },
  "estudios-diagnostico": { x: 13, y: 70 },
  multiempresa: { x: 27, y: 86 },
  "recursos-humanos": { x: 42, y: 91 },
  inventario: { x: 60, y: 91 },
  seguridad: { x: 75, y: 87 },
  "caja-finanzas": { x: 78, y: 60 },
  marketing: { x: 87, y: 74 },
  "ia-esther": { x: 90, y: 54 },
};

/* Resuelve el ícono lucide a partir del nombre guardado como string en
   demo.ts (m.icon, ej. "CalendarDays"), sin tener que mapear cada módulo
   a mano. Si el nombre no existe en lucide-react, no rompe: no renderiza
   nada. */
function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

function ModulesOrbit() {
  return (
    <div
      className="relative mx-auto hidden w-full max-w-[560px] shrink-0 lg:block animate-avatar-float"
      style={{ aspectRatio: "1021 / 625" }}
    >
      <img
        src={orbitHero}
        alt="Los 20 módulos de Cloud Esther conectados alrededor del diente"
        className="absolute inset-0 h-full w-full object-contain drop-shadow-xl"
      />
      {modules.map((m) => {
        const pos = ORBIT_LABEL_POSITIONS[m.key];
        if (!pos) return null;
        return (
          <span
            key={m.key}
            title={m.name}
            className="absolute -translate-x-1/2 text-center text-[9px] font-medium leading-tight text-foreground/80"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: 66 }}
          >
            {m.name}
          </span>
        );
      })}
    </div>
  );
}

function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [editable, setEditable] = useState(false);
  const [prices, setPrices] = useState<Record<string, { monthly: number; setup: number }>>(
    Object.fromEntries(plans.map((p) => [p.id, { monthly: p.monthly, setup: p.setup }])),
  );

  const factor = annual ? 0.85 : 1;

  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#7c3aed]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <h1 className="max-w-3xl text-4xl font-bold text-white sm:text-5xl">
              Implementación inicial y membresía mensual, sin permanencia
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/75">
              Elige el plan según el tamaño de tu clínica o grupo. Todos incluyen pacientes
              ilimitados y puedes ampliar sucursales, usuarios y módulos en cualquier momento.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 shadow-soft">
                <Label htmlFor="annual" className="text-sm">Pago anual (−15 %)</Label>
                <Switch id="annual" checked={annual} onCheckedChange={setAnnual} />
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 shadow-soft">
                <Pencil className="size-4 text-muted-foreground" />
                <Label htmlFor="edit" className="text-sm">Precios configurables</Label>
                <Switch id="edit" checked={editable} onCheckedChange={setEditable} />
              </div>
            </div>
          </div>
          <ModulesOrbit />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid items-start gap-5 lg:grid-cols-4">
          {plans.map((plan, planIndex) => {
            const p = prices[plan.id] ?? { monthly: plan.monthly, setup: plan.setup };
            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col shadow-soft ${
                  plan.highlighted ? "border-primary ring-2 ring-primary/25" : "border-border/70"
                }`}
              >
                {plan.highlighted ? (
                  <Badge className="absolute -top-3 left-6">Más elegido</Badge>
                ) : null}
                <CardContent className="flex flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Nivel {planIndex + 1}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">{plan.name}</h2>
                  <p className="mt-1 min-h-10 text-sm text-muted-foreground">{plan.tagline}</p>

                  <div className="mt-5">
                    {editable ? (
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Membresía mensual ($)</Label>
                          <Input
                            type="number"
                            min={0}
                            value={p.monthly}
                            onChange={(e) =>
                              setPrices((s) => ({
                                ...s,
                                [plan.id]: { setup: p.setup, monthly: Number(e.target.value) },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Implementación ($)</Label>
                          <Input
                            type="number"
                            min={0}
                            value={p.setup}
                            onChange={(e) =>
                              setPrices((s) => ({
                                ...s,
                                [plan.id]: { monthly: p.monthly, setup: Number(e.target.value) },
                              }))
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-display text-3xl font-bold">
                          {currency(Math.round(p.monthly * factor))}
                          <span className="text-sm font-medium text-muted-foreground">/mes</span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          + {currency(p.setup)} de implementación inicial
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {plan.modules.map((m) => (
                      <div
                        key={m}
                        title={moduleNameByKey[m]}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <ModuleIcon name={moduleIconByKey[m]} className="size-4" />
                      </div>
                    ))}
                  </div>

                  <ul className="mt-6 space-y-2.5 text-sm">
                    {[plan.branches, plan.users, plan.support, plan.analytics, plan.automations].map(
                      (f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 shrink-0 text-success" />
                          <span>{f}</span>
                        </li>
                      ),
                    )}
                  </ul>

                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Módulos incluidos
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {plan.modules.map((m) => (
                        <li key={m} className="flex items-start gap-2 text-muted-foreground">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                          {moduleNameByKey[m]}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    asChild
                    className="mt-6 w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    <Link to="/demostracion">Solicitar demostración</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Comparativa */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-bold">Comparativa de módulos por plan</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-56 text-xs font-semibold uppercase tracking-wide text-primary">
                  Módulo
                </TableHead>
                {plans.map((p) => (
                  <TableHead
                    key={p.id}
                    className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {p.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((m) => (
                <TableRow key={m.key}>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2 text-primary">
                      <ModuleIcon name={m.icon} className="size-4 shrink-0" />
                      {m.name}
                    </span>
                  </TableCell>
                  {plans.map((p) => (
                    <TableCell key={p.id} className="text-center">
                      {p.modules.includes(m.key) ? (
                        <Check className="mx-auto size-4 text-success" />
                      ) : (
                        <Lock className="mx-auto size-4 text-muted-foreground/40" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Add-ons */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="text-2xl font-bold">Módulos y extras adicionales</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Contrátalos sobre cualquier plan y actívalos al instante desde el panel de suscripción.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addOns.map((a) => (
            <Card key={a.name} className="border-border/70 shadow-soft">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {currency(a.price)} / {a.unit}
                  </p>
                </div>
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <Plus className="size-4" /> Añadir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}