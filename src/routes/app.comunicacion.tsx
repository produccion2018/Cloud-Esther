import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Send, Smartphone, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { conversations, messageTemplates } from "@/data/demo";

export const Route = createFileRoute("/app/comunicacion")({
  component: CommunicationPage,
});

const channelIcon: Record<string, typeof Mail> = {
  WhatsApp: MessageCircle,
  SMS: Smartphone,
  Correo: Mail,
};

function CommunicationPage() {
  const [active, setActive] = useState(conversations[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const current = conversations.find((c) => c.id === active) ?? conversations[0];

  return (
    <>
      <PageHeader
        title="Comunicación"
        description="Bandeja unificada de WhatsApp, SMS y correo con plantillas, campañas y automatizaciones."
        badge="6 sin leer"
      />

      <Tabs defaultValue="bandeja">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="bandeja">Bandeja</TabsTrigger>
          <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
          <TabsTrigger value="campanas">Campañas</TabsTrigger>
          <TabsTrigger value="automatizaciones">Automatizaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="bandeja" className="mt-4">
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Conversaciones</CardTitle></CardHeader>
              <CardContent className="space-y-1 p-3">
                {conversations.map((c) => {
                  const Icon = channelIcon[c.channel] ?? Mail;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActive(c.id)}
                      className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors ${
                        active === c.id ? "bg-primary-soft" : "hover:bg-muted"
                      }`}
                    >
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
                          {c.patient.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold">{c.patient}</p>
                          <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{c.preview}</p>
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Icon className="size-3" /> {c.channel}
                        </span>
                      </div>
                      {c.unread > 0 ? (
                        <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {c.unread}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-soft lg:col-span-2">
              <CardHeader className="flex-row items-center justify-between border-b border-border">
                <CardTitle className="text-base">{current?.patient}</CardTitle>
                <Badge variant="secondary">{current?.channel}</Badge>
              </CardHeader>
              <CardContent className="flex h-[420px] flex-col p-4">
                <div className="flex-1 space-y-3 overflow-y-auto">
                  <Bubble side="in" text={current?.preview ?? ""} time="09:12" />
                  <Bubble side="out" text="¡Hola! Claro, te paso la información y las fechas disponibles esta semana." time="09:15" />
                  <Bubble side="in" text="Perfecto, ¿tienen algo por la tarde?" time="09:18" />
                  <Bubble side="out" text="Sí, el jueves a las 17:00 con la Dra. Moro. ¿Te la reservo?" time="09:20" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Input
                    placeholder="Escribe un mensaje o usa una plantilla…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                  <Button
                    className="gap-2"
                    disabled={draft.trim().length === 0}
                    onClick={() => { setDraft(""); toast.success("Mensaje enviado."); }}
                  >
                    <Send className="size-4" /> Enviar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plantillas" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {messageTemplates.map((t) => (
              <Card key={t.name} className="shadow-soft">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <Badge variant="outline">{t.channel}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Enviada {t.uses} veces</p>
                  <Button size="sm" variant="secondary" className="mt-4 w-full" onClick={() => toast.info("Editor de plantilla")}>
                    Editar plantilla
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campanas" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { n: "Reactivación pacientes inactivos 6 meses", a: 412, c: 58, e: "En curso" },
              { n: "Revisión anual de higiene", a: 690, c: 141, e: "En curso" },
              { n: "Promoción blanqueamiento verano", a: 1200, c: 96, e: "Finalizada" },
              { n: "Seguimiento presupuestos sin aceptar", a: 87, c: 23, e: "Programada" },
            ].map((c) => (
              <Card key={c.n} className="shadow-soft">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold">{c.n}</p>
                    <Badge variant={c.e === "En curso" ? "default" : "outline"}>{c.e}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Alcanzados</p><p className="font-semibold">{c.a}</p></div>
                    <div><p className="text-xs text-muted-foreground">Citas generadas</p><p className="font-semibold text-success">{c.c}</p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automatizaciones" className="mt-4">
          <Card className="shadow-soft">
            <CardContent className="divide-y divide-border p-0">
              {[
                { n: "Recordatorio de cita 24 h antes", c: "WhatsApp", on: true },
                { n: "Confirmación al agendar", c: "SMS", on: true },
                { n: "Encuesta de satisfacción tras la visita", c: "Correo", on: true },
                { n: "Aviso de presupuesto pendiente a 7 días", c: "WhatsApp", on: false },
                { n: "Felicitación de cumpleaños", c: "Correo", on: true },
              ].map((a) => (
                <div key={a.n} className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Zap className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{a.n}</p>
                      <p className="text-xs text-muted-foreground">Canal: {a.c}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={a.on} onCheckedChange={() => toast.success("Automatización actualizada.")} />
                </div>
              ))}
            </CardContent>
          </Card>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" /> Las automatizaciones se aplican por sucursal según el plan contratado.
          </p>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Bubble({ side, text, time }: { side: "in" | "out"; text: string; time: string }) {
  return (
    <div className={`flex ${side === "out" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
          side === "out"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        <p>{text}</p>
        <p className={`mt-1 text-[10px] ${side === "out" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {time}
        </p>
      </div>
    </div>
  );
}
