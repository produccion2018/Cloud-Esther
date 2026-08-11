import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus, Pencil, Plus } from "lucide-react";
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
import { addOns, currency, moduleNameByKey, modules, plans } from "@/data/demo";

export const Route = createFileRoute("/planes")({
  head: () => ({
    meta: [
      { title: "Planes y precios para clínicas odontológicas | DentalisPro" },
      {
        name: "description",
        content:
          "Cuatro planes escalonados: Clínica Inicial, Profesional, Avanzada y Grupo Odontológico. Implementación inicial + membresía mensual y módulos adicionales.",
      },
      { property: "og:title", content: "Planes y precios | DentalisPro" },
      {
        property: "og:description",
        content: "Precios configurables, módulos adicionales y sucursales ilimitadas.",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [editable, setEditable] = useState(false);
  const [prices, setPrices] = useState<Record<string, { monthly: number; setup: number }>>(
    Object.fromEntries(plans.map((p) => [p.id, { monthly: p.monthly, setup: p.setup }])),
  );

  const factor = annual ? 0.85 : 1;

  return (
    <PublicLayout>
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
            Implementación inicial y membresía mensual, sin permanencia
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Elige el plan según el tamaño de tu clínica o grupo. Todos incluyen pacientes ilimitados
            y puedes ampliar sucursales, usuarios y módulos en cualquier momento.
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
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-4">
          {plans.map((plan) => {
            const p = prices[plan.id] ?? { monthly: plan.monthly, setup: plan.setup };
            return (
              <Card
                key={plan.id}
                className={`relative flex h-full flex-col shadow-soft ${
                  plan.highlighted ? "border-primary ring-2 ring-primary/25" : "border-border/70"
                }`}
              >
                {plan.highlighted ? (
                  <Badge className="absolute -top-3 left-6">Más elegido</Badge>
                ) : null}
                <CardContent className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-semibold">{plan.name}</h2>
                  <p className="mt-1 min-h-10 text-sm text-muted-foreground">{plan.tagline}</p>

                  <div className="mt-5">
                    {editable ? (
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Membresía mensual (€)</Label>
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
                          <Label className="text-xs text-muted-foreground">Implementación (€)</Label>
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
                <TableHead className="min-w-56">Módulo</TableHead>
                {plans.map((p) => (
                  <TableHead key={p.id} className="text-center">{p.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((m) => (
                <TableRow key={m.key}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  {plans.map((p) => (
                    <TableCell key={p.id} className="text-center">
                      {p.modules.includes(m.key) ? (
                        <Check className="mx-auto size-4 text-success" />
                      ) : (
                        <Minus className="mx-auto size-4 text-muted-foreground/50" />
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
