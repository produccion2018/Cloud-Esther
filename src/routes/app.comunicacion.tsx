import { createFileRoute } from "@tanstack/react-router";
import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Send,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  conversations,
  messageTemplates,
  reminderLog,
  reminderRules,
  type ReminderLogStatus,
} from "@/data/demo";

export const Route = createFileRoute("/app/comunicacion")({
  component: CommunicationPage,
});

const offsetOptions = [
  "72 h antes",
  "48 h antes",
  "24 h antes",
  "2 h antes",
  "24 h después",
  "7 días después",
  "6 meses después",
];

const statusStyles: Record<ReminderLogStatus, string> = {
  entregado: "bg-primary-soft text-primary border-primary/25",
  leído: "bg-accent text-accent-foreground border-primary/20",
  confirmado: "bg-success-soft text-success border-success/25",
  pendiente: "bg-warning/15 text-warning-foreground border-warning/30",
  fallido: "bg-destructive/10 text-destructive border-destructive/25",
};


const channelIcon: Record<string, typeof Mail> = {
  WhatsApp: MessageCircle,
  SMS: Smartphone,
  Correo: Mail,
};

function CommunicationPage() {
  const [active, setActive] = useState(conversations[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const current = conversations.find((c) => c.id === active) ?? conversations[0];

  const [rules, setRules] = useState(reminderRules);
  const [log, setLog] = useState(reminderLog);
  const [logChannel, setLogChannel] = useState("todos");

  const updateRule = (id: string, patch: Partial<(typeof reminderRules)[number]>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const sendTest = (ruleName: string, channel: "WhatsApp" | "Correo") => {
    setLog((prev) => [
      {
        id: `test-${Date.now()}`,
        patient: "Paciente de prueba",
        rule: ruleName,
        channel,
        target: channel === "Correo" ? "demo@clinica.test" : "+54 9 11 0000-0000",
        sentAt: "Ahora",
        status: "entregado" as ReminderLogStatus,
        preview: `Envío de prueba (modo demo) de «${ruleName}».`,
      },
      ...prev,
    ]);
    toast.success(`Prueba enviada por ${channel} (modo demo).`);
  };

  const filteredLog = useMemo(
    () => (logChannel === "todos" ? log : log.filter((l) => l.channel === logChannel)),
    [log, logChannel],
  );

  const activeRules = rules.filter((r) => r.enabled).length;
  const sent30d = rules.reduce((sum, r) => sum + (r.enabled ? r.sent30d : 0), 0);

  return (
    <>
      <PageHeader
        title="Comunicación"
        description="Bandeja unificada de WhatsApp, SMS y correo con plantillas, recordatorios automáticos y campañas."
        badge="6 sin leer"
      />

      <Tabs defaultValue="bandeja">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="bandeja">Bandeja</TabsTrigger>
          <TabsTrigger value="recordatorios">Recordatorios</TabsTrigger>
          <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
          <TabsTrigger value="campanas">Campañas</TabsTrigger>
          <TabsTrigger value="automatizaciones">Automatizaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="recordatorios" className="mt-4 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <MiniStat icon={BellRing} label="Reglas activas" value={`${activeRules} de ${rules.length}`} />
            <MiniStat icon={Send} label="Enviados últimos 30 días" value={sent30d.toLocaleString("es-AR")} />
            <MiniStat icon={CheckCircle2} label="Tasa de confirmación" value="87 %" />
          </div>

          <Card className="shadow-soft">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="size-4 text-primary" /> Reglas de recordatorio
              </CardTitle>
              <Badge variant="outline">Modo demo</Badge>
            </CardHeader>
            <CardContent className="divide-y divide-border p-0">
              {rules.map((r) => (
                <div key={r.id} className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{r.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.description}</p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        {r.sent30d} envíos · {r.openRate} % de apertura
                      </p>
                    </div>
                    <Switch
                      checked={r.enabled}
                      onCheckedChange={(v) => {
                        updateRule(r.id, { enabled: v });
                        toast.success(v ? "Recordatorio activado." : "Recordatorio desactivado.");
                      }}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Momento de envío</Label>
                      <Select
                        value={r.offset}
                        onValueChange={(v) => {
                          updateRule(r.id, { offset: v });
                          toast.success("Programación actualizada.");
                        }}
                      >
                        <SelectTrigger disabled={!r.enabled}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {offsetOptions.map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Plantilla</Label>
                      <Select
                        value={r.template}
                        onValueChange={(v) => {
                          updateRule(r.id, { template: v });
                          toast.success("Plantilla asignada.");
                        }}
                      >
                        <SelectTrigger disabled={!r.enabled}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {messageTemplates.map((t) => (
                            <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs text-muted-foreground">Canales</Label>
                      <div className="flex flex-wrap gap-2">
                        <ChannelToggle
                          icon={MessageCircle}
                          label="WhatsApp"
                          active={r.whatsapp}
                          disabled={!r.enabled}
                          onToggle={() => updateRule(r.id, { whatsapp: !r.whatsapp })}
                        />
                        <ChannelToggle
                          icon={Mail}
                          label="Correo"
                          active={r.email}
                          disabled={!r.enabled}
                          onToggle={() => updateRule(r.id, { email: !r.email })}
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="gap-2"
                          disabled={!r.enabled || (!r.whatsapp && !r.email)}
                          onClick={() => sendTest(r.name, r.whatsapp ? "WhatsApp" : "Correo")}
                        >
                          <Send className="size-3.5" /> Enviar prueba
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="size-4 text-primary" /> Historial de recordatorios
              </CardTitle>
              <Select value={logChannel} onValueChange={setLogChannel}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los canales</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Correo">Correo</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Regla</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Enviado</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLog.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">
                          {l.patient}
                          <p className="max-w-xs truncate text-xs font-normal text-muted-foreground">{l.preview}</p>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{l.rule}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 text-sm">
                            {l.channel === "Correo" ? <Mail className="size-3.5" /> : <MessageCircle className="size-3.5" />}
                            {l.channel}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{l.target}</TableCell>
                        <TableCell className="text-muted-foreground">{l.sentAt}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`capitalize ${statusStyles[l.status]}`}>{l.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" /> En modo demo no se realizan envíos reales: los recordatorios se registran en el historial.
          </p>
        </TabsContent>


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

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <Card className="shadow-soft">
      <CardContent className="flex items-center gap-3 p-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-display text-lg font-bold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ChannelToggle({
  icon: Icon,
  label,
  active,
  disabled,
  onToggle,
}: {
  icon: typeof Mail;
  label: string;
  active: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      disabled={disabled}
      aria-pressed={active}
      className="gap-2"
      onClick={onToggle}
    >
      <Icon className="size-3.5" /> {label}
    </Button>
  );
}
