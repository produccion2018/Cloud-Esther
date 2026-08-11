import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, PhoneCall } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modules } from "@/data/demo";

export const Route = createFileRoute("/demostracion")({
  head: () => ({
    meta: [
      { title: "Solicitar demostración | DentalisPro" },
      {
        name: "description",
        content:
          "Agenda una demostración personalizada de DentalisPro con tus sucursales, equipo y módulos de interés. Respondemos en menos de 24 horas laborables.",
      },
      { property: "og:title", content: "Solicitar demostración | DentalisPro" },
      {
        property: "og:description",
        content: "Demostración guiada para clínicas odontológicas y grupos multisucursal.",
      },
    ],
  }),
  component: DemoRequest,
});

type Errors = Partial<Record<string, string>>;

function DemoRequest() {
  const [selected, setSelected] = useState<string[]>(["agenda", "pacientes"]);
  const [branchCount, setBranchCount] = useState("1");
  const [staffCount, setStaffCount] = useState("1-5");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function toggle(key: string) {
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    const clinic = String(data.get("clinic") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (clinic.length < 2) next["clinic"] = "Indica el nombre de la clínica.";
    if (contact.length < 2) next["contact"] = "Indica el nombre de contacto.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next["email"] = "Introduce un correo válido.";
    if (phone.replace(/\D/g, "").length < 7) next["phone"] = "Introduce un teléfono válido.";
    if (selected.length === 0) next["modules"] = "Selecciona al menos un módulo de interés.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Revisa los campos marcados en rojo.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Solicitud enviada. Te contactaremos en menos de 24 h.");
    }, 900);
  }

  return (
    <PublicLayout>
      <section className="bg-soft-gradient">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">
            Solicita una demostración para tu clínica
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Cuéntanos cómo trabaja tu clínica y preparamos una sesión de 30 minutos con tu caso real:
            sucursales, especialidades, agenda y módulos de interés.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {sent ? (
            <Card className="border-success/40 shadow-soft">
              <CardContent className="flex flex-col items-center p-12 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-success-soft text-success">
                  <CheckCircle2 className="size-7" />
                </span>
                <h2 className="mt-5 text-2xl font-bold">¡Solicitud recibida!</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Un especialista en implantación de DentalisPro te escribirá en menos de 24 horas
                  laborables para coordinar la demostración.
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                  Enviar otra solicitud
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-soft">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={onSubmit} noValidate className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Nombre de la clínica" error={errors["clinic"]}>
                      <Input name="clinic" placeholder="Clínica Dental Sonrisa" aria-invalid={!!errors["clinic"]} />
                    </Field>
                    <Field label="Nombre de contacto" error={errors["contact"]}>
                      <Input name="contact" placeholder="Dra. Paula Arriaga" aria-invalid={!!errors["contact"]} />
                    </Field>
                    <Field label="Correo electrónico" error={errors["email"]}>
                      <Input name="email" type="email" placeholder="direccion@clinica.com" aria-invalid={!!errors["email"]} />
                    </Field>
                    <Field label="Teléfono" error={errors["phone"]}>
                      <Input name="phone" placeholder="+34 600 000 000" aria-invalid={!!errors["phone"]} />
                    </Field>
                    <Field label="Número de sucursales">
                      <Select value={branchCount} onValueChange={setBranchCount}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["1", "2-3", "4-6", "7-15", "Más de 15"].map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Cantidad de empleados">
                      <Select value={staffCount} onValueChange={setStaffCount}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["1-5", "6-15", "16-40", "41-100", "Más de 100"].map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Módulos de interés</Label>
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                      {modules.map((m) => (
                        <label
                          key={m.key}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-sm transition-colors hover:bg-muted/60"
                        >
                          <Checkbox
                            checked={selected.includes(m.key)}
                            onCheckedChange={() => toggle(m.key)}
                          />
                          {m.name}
                        </label>
                      ))}
                    </div>
                    {errors["modules"] ? (
                      <p className="mt-2 text-sm text-destructive">{errors["modules"]}</p>
                    ) : null}
                  </div>

                  <Field label="Comentarios">
                    <Textarea
                      name="comments"
                      rows={4}
                      placeholder="Cuéntanos qué software usas actualmente, cuántas citas gestionas al mes o qué problema quieres resolver."
                    />
                  </Field>

                  <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                    {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                    {loading ? "Enviando solicitud…" : "Solicitar demostración"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Al enviar aceptas que contactemos contigo para coordinar la demostración.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="border-border/70 shadow-soft">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold">Qué incluye la sesión</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Recorrido por el panel con datos de tu clínica",
                  "Plan de implementación y tiempos",
                  "Presupuesto de membresía y módulos",
                  "Plan de migración de historiales",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> {i}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-primary-soft shadow-soft">
            <CardContent className="p-6">
              <PhoneCall className="size-5 text-primary" />
              <h3 className="mt-3 text-base font-semibold">¿Prefieres hablar ahora?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Llámanos de lunes a viernes de 9:00 a 19:00.
              </p>
              <p className="mt-3 font-display text-lg font-bold text-primary">+34 900 123 456</p>
            </CardContent>
          </Card>
        </aside>
      </section>
    </PublicLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
