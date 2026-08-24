import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { PublicLayout } from "@/components/site/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAccount, type Account } from "@/lib/account";
import { plans } from "@/data/demo";
import toothLogo from "@/assets/tooth-logo.png";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Creá tu cuenta | Cloud Esther" },
      {
        name: "description",
        content: "Registrate y entrá a probar el panel de Cloud Esther con tu propia cuenta.",
      },
    ],
  }),
  component: RegisterPage,
});

const trustPoints = [
  { icon: Zap, text: "Acceso inmediato, sin esperar a que te contacten" },
  { icon: ShieldCheck, text: "Datos cifrados y aislados por clínica" },
  { icon: CheckCircle2, text: "Sin tarjeta de crédito, cambiá de plan cuando quieras" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState<Account["planId"]>("inicial");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const clinicName = String(data.get("clinicName") ?? "").trim();
    const contactName = String(data.get("contactName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (clinicName.length < 2 || contactName.length < 2) {
      toast.error("Completá el nombre de la clínica y tu nombre.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Introducí un correo válido.");
      return;
    }
    if (password.length < 6) {
      toast.error("La contraseña tiene que tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    saveAccount({ clinicName, contactName, email, planId });
    setTimeout(() => {
      toast.success(`¡Cuenta creada! Bienvenido, ${contactName}.`);
      navigate({ to: "/app" });
    }, 500);
  }

  return (
    <PublicLayout>
      <section className="bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-0 overflow-hidden rounded-none px-0 sm:px-6 sm:py-14 lg:grid-cols-2 lg:rounded-3xl lg:shadow-lift">
          {/* Panel de marca — solo desktop */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#7c3aed] p-10 text-white lg:flex">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
                  <img src={toothLogo} alt="" className="size-6 object-contain" />
                </span>
                <span className="font-display text-lg font-bold">Cloud Esther</span>
              </div>

              <h1 className="mt-12 text-3xl font-bold leading-tight xl:text-4xl">
                Probá Cloud Esther con tu propia clínica
              </h1>
              <p className="mt-4 max-w-sm text-white/75">
                Creá tu cuenta y entrá al panel al instante. Explorá agenda, pacientes,
                facturación y el resto de los módulos con datos reales de tu clínica.
              </p>
            </div>

            <ul className="space-y-4">
              {trustPoints.map((t) => (
                <li key={t.text} className="flex items-start gap-3 text-sm text-white/85">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <t.icon className="size-3.5" />
                  </span>
                  {t.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Encabezado mobile — reemplaza al panel de marca en pantallas chicas */}
          <div className="bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#7c3aed] px-4 py-10 text-center text-white sm:px-6 lg:hidden">
            <h1 className="text-3xl font-bold">Probá Cloud Esther ahora</h1>
            <p className="mt-3 text-sm text-white/75">
              Creá tu cuenta y entrá al panel al instante, sin esperar a que te contacte nadie.
            </p>
          </div>

          {/* Formulario */}
          <Card className="rounded-none border-0 shadow-none lg:rounded-none lg:border-l lg:border-border lg:shadow-none">
            <CardContent className="p-6 sm:p-10">
              <div className="mb-7">
                <h2 className="text-xl font-bold tracking-tight">Creá tu cuenta</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Completá tus datos para acceder al panel de demostración.
                </p>
              </div>

              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="clinicName">Nombre de la clínica</Label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="clinicName"
                      name="clinicName"
                      placeholder="Clínica Dental Sonrisa"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contactName">Tu nombre</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="contactName"
                      name="contactName"
                      placeholder="Dra. Paula Arriaga"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="direccion@clinica.com"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Plan</Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {plans.map((p) => {
                      const active = planId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPlanId(p.id as Account["planId"])}
                          className={`rounded-xl border p-3 text-left transition-colors ${
                            active
                              ? "border-primary bg-primary-soft/60 ring-1 ring-primary"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold">{p.name}</span>
                            {active ? <CheckCircle2 className="size-4 shrink-0 text-primary" /> : null}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {p.modules.length} módulos
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                  {loading ? (
                    "Creando cuenta…"
                  ) : (
                    <>
                      <Sparkles className="size-4" /> Crear cuenta y entrar al panel
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Sin tarjeta de crédito. Podés cambiar de plan en cualquier momento.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}