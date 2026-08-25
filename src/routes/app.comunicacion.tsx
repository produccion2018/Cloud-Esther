import { createFileRoute } from "@tanstack/react-router";
import {
  BellRing,
  CalendarClock,
  Check,
  CheckCircle2,
  CheckCheck,
  Clock,
  Copy,
  Eye,
  Filter,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Search,
  Send,
  Smartphone,
  Sparkles,
  Trash2,
  Users,
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

type Message = {
  side: "in" | "out";
  text: string;
  time: string;
};

type Campaign = {
  id: string;
  name: string;
  reached: number;
  appointments: number;
  status: "En curso" | "Finalizada" | "Programada" | "Pausada";
};

type Automation = {
  id: string;
  name: string;
  channel: string;
  enabled: boolean;
};

const initialCampaigns: Campaign[] = [
  { id: "c1", name: "Reactivación pacientes inactivos 6 meses", reached: 412, appointments: 58, status: "En curso" },
  { id: "c2", name: "Revisión anual de higiene", reached: 690, appointments: 141, status: "En curso" },
  { id: "c3", name: "Promoción blanqueamiento verano", reached: 1200, appointments: 96, status: "Finalizada" },
  { id: "c4", name: "Seguimiento presupuestos sin aceptar", reached: 87, appointments: 23, status: "Programada" },
];

const initialAutomations: Automation[] = [
  { id: "a1", name: "Recordatorio de cita 24 h antes", channel: "WhatsApp", enabled: true },
  { id: "a2", name: "Confirmación al agendar", channel: "SMS", enabled: true },
  { id: "a3", name: "Encuesta de satisfacción tras la visita", channel: "Correo", enabled: true },
  { id: "a4", name: "Aviso de presupuesto pendiente a 7 días", channel: "WhatsApp", enabled: false },
  { id: "a5", name: "Felicitación de cumpleaños", channel: "Correo", enabled: true },
];

const defaultMessages: Message[] = [
  { side: "in", text: "Hola, quería consultar por las fechas disponibles esta semana.", time: "09:12" },
  { side: "out", text: "¡Hola! Claro, te paso la información y las fechas disponibles.", time: "09:15" },
  { side: "in", text: "Perfecto, ¿tienen algo por la tarde?", time: "09:18" },
  { side: "out", text: "Sí, el jueves a las 17:00 con la Dra. Moro. ¿Te la reservo?", time: "09:20" },
];

function CommunicationPage() {
  const [active, setActive] = useState(conversations[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const current = conversations.find((c) => c.id === active) ?? conversations[0];

  const [rules, setRules] = useState(reminderRules);
  const [log, setLog] = useState(reminderLog);
  const [logChannel, setLogChannel] = useState("todos");
  const [search, setSearch] = useState("");
  const [automations, setAutomations] = useState(initialAutomations);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [templateEditor, setTemplateEditor] = useState<{
    name: string;
    channel: string;
    content: string;
    isNew: boolean;
  } | null>(null);

  const updateRule = (
    id: string,
    patch: Partial<(typeof reminderRules)[number]>,
  ) => {
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
    () =>
      (logChannel === "todos"
        ? log
        : log.filter((l) => l.channel === logChannel)
      ).filter((l) =>
        `${l.patient} ${l.rule} ${l.target}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [log, logChannel, search],
  );

  const activeRules = rules.filter((r) => r.enabled).length;
  const sent30d = rules.reduce(
    (sum, r) => sum + (r.enabled ? r.sent30d : 0),
    0,
  );

  const currentMessages = current
    ? messages[current.id] ?? defaultMessages
    : [];

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !current) return;

    const now = new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => ({
      ...prev,
      [current.id]: [...(prev[current.id] ?? defaultMessages), { side: "out", text, time: now }],
    }));
    setDraft("");
    toast.success("Mensaje enviado en modo demo.");
  };

  const openTemplateEditor = (template?: (typeof messageTemplates)[number]) => {
    setTemplateEditor({
      name: template?.name ?? "Nueva plantilla",
      channel: template?.channel ?? "WhatsApp",
      content:
        "Hola {{paciente}}, te contactamos desde Cloud Esther para recordarte {{detalle}}. ¿Necesitas ayuda con tu próxima cita?",
      isNew: !template,
    });
  };

  const saveTemplate = () => {
    if (!templateEditor?.name.trim()) {
      toast.error("Escribe un nombre para la plantilla.");
      return;
    }
    toast.success(
      templateEditor.isNew
        ? "Plantilla creada en modo demo."
        : "Plantilla actualizada en modo demo.",
    );
    setTemplateEditor(null);
  };

  const toggleAutomation = (id: string, enabled: boolean) => {
    setAutomations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled } : item)),
    );
    toast.success(enabled ? "Automatización activada." : "Automatización pausada.");
  };

  const updateCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((campaign) => {
        if (campaign.id !== id) return campaign;
        const next = campaign.status === "Pausada" ? "En curso" : "Pausada";
        return { ...campaign, status: next };
      }),
    );
    toast.success("Estado de campaña actualizado en modo demo.");
  };

  return (
    <>
      <PageHeader
        title="Comunicación"
        description="Gestiona conversaciones, recordatorios, plantillas, campañas y automatizaciones desde un único centro."
        badge="6 sin leer"
      />

      <Tabs defaultValue="bandeja" className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            <TabsTrigger value="bandeja">Bandeja</TabsTrigger>
            <TabsTrigger value="recordatorios">Recordatorios</TabsTrigger>
            <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
            <TabsTrigger value="campanas">Campañas</TabsTrigger>
            <TabsTrigger value="automatizaciones">Automatizaciones</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bandeja" className="mt-0">
          <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
            <Card className="overflow-hidden shadow-soft">
              <CardHeader className="border-b border-border pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">Conversaciones</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      WhatsApp, SMS y correo en una sola bandeja
                    </p>
                  </div>
                  <Button size="icon" variant="outline" onClick={() => toast.info("Nueva conversación: modo demo.")} aria-label="Nueva conversación">
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Buscar conversación..." />
                </div>
              </CardHeader>
              <CardContent className="max-h-[610px] space-y-1 overflow-y-auto p-2">
                {conversations.map((c) => {
                  const Icon = channelIcon[c.channel] ?? Mail;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActive(c.id)}
                      className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
                        active === c.id
                          ? "bg-primary-soft ring-1 ring-primary/15"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Avatar className="size-10 shrink-0">
                        <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                          {c.patient
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
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

            <Card className="overflow-hidden shadow-soft">
              <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary-soft text-primary">
                      {current?.patient
                        ?.split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">{current?.patient ?? "Sin conversación"}</CardTitle>
                    <p className="text-xs text-muted-foreground">Paciente · conversación activa</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{current?.channel ?? "—"}</Badge>
                  <Button size="icon" variant="ghost" onClick={() => toast.info("Más acciones: modo demo.")} aria-label="Más acciones">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex min-h-[520px] flex-col p-4">
                <div className="mb-3 flex items-center justify-center">
                  <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">
                    Hoy
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {currentMessages.map((message, index) => (
                    <Bubble
                      key={`${current?.id}-${index}-${message.time}`}
                      side={message.side}
                      text={message.text}
                      time={message.time}
                    />
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-2">
                  <div className="flex gap-2">
                    <Input
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      placeholder="Escribe un mensaje..."
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      className="shrink-0 rounded-xl"
                      disabled={!draft.trim()}
                      onClick={sendMessage}
                      aria-label="Enviar mensaje"
                    >
                      <Send className="size-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between px-2 pt-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 gap-1.5 text-xs"
                      onClick={() => {
                        setDraft("Hola {{paciente}}, te escribimos desde Cloud Esther para confirmar tu próxima cita.");
                        toast.info("Plantilla insertada.");
                      }}
                    >
                      <Sparkles className="size-3.5" /> Usar plantilla
                    </Button>
                    <span className="text-[10px] text-muted-foreground">Enter para enviar</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recordatorios" className="mt-0 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <MiniStat icon={BellRing} label="Reglas activas" value={`${activeRules} de ${rules.length}`} />
            <MiniStat icon={Send} label="Enviados últimos 30 días" value={sent30d.toLocaleString("es-AR")} />
            <MiniStat icon={CheckCircle2} label="Tasa de confirmación" value="87 %" />
          </div>

          <Card className="shadow-soft">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarClock className="size-4 text-primary" /> Reglas de recordatorio
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Automatiza el contacto antes y después de cada cita.
                </p>
              </div>
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
                    <FieldSelect
                      label="Momento de envío"
                      value={r.offset}
                      disabled={!r.enabled}
                      options={offsetOptions}
                      onChange={(v) => {
                        updateRule(r.id, { offset: v });
                        toast.success("Programación actualizada.");
                      }}
                    />

                    <FieldSelect
                      label="Plantilla"
                      value={r.template}
                      disabled={!r.enabled}
                      options={messageTemplates.map((t) => t.name)}
                      onChange={(v) => {
                        updateRule(r.id, { template: v });
                        toast.success("Plantilla asignada.");
                      }}
                    />

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
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="size-4 text-primary" /> Historial de recordatorios
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Consulta entregas, aperturas y confirmaciones.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-9 w-56 pl-8"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={logChannel} onValueChange={setLogChannel}>
                  <SelectTrigger className="w-40"><Filter className="mr-2 size-3.5" /><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los canales</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Correo">Correo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                    {filteredLog.length ? (
                      filteredLog.map((l) => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                          No hay registros que coincidan con la búsqueda.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" /> En modo demo no se realizan envíos reales: los recordatorios se registran en el historial.
          </p>
        </TabsContent>

        <TabsContent value="plantillas" className="mt-0 space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Plantillas de comunicación</h2>
              <p className="text-sm text-muted-foreground">Mensajes reutilizables para acelerar la atención.</p>
            </div>
            <Button className="gap-2" onClick={() => openTemplateEditor()}>
              <Plus className="size-4" /> Nueva plantilla
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {messageTemplates.map((t) => (
              <Card key={t.name} className="group shadow-soft transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        {t.channel === "Correo" ? <Mail className="size-4" /> : <MessageCircle className="size-4" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{t.name}</p>
                        <Badge variant="outline" className="mt-1">{t.channel}</Badge>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => toast.info("Más acciones de plantilla: modo demo.")} aria-label="Más acciones">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">Enviada {t.uses} veces</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button size="sm" variant="secondary" className="gap-2" onClick={() => openTemplateEditor(t)}>
                      <Pencil className="size-3.5" /> Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        void navigator.clipboard?.writeText(t.name);
                        toast.success("Nombre de plantilla copiado.");
                      }}
                    >
                      <Copy className="size-3.5" /> Copiar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campanas" className="mt-0 space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Campañas</h2>
              <p className="text-sm text-muted-foreground">Segmenta pacientes y mide el resultado de cada acción.</p>
            </div>
            <Button className="gap-2" onClick={() => toast.success("Nueva campaña preparada en modo demo.")}>
              <Plus className="size-4" /> Nueva campaña
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {campaigns.map((c) => (
              <Card key={c.id} className="shadow-soft">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <Users className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{c.name}</p>
                        <Badge variant={c.status === "En curso" ? "default" : "outline"} className="mt-1">
                          {c.status}
                        </Badge>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => toast.info("Acciones de campaña: modo demo.")} aria-label="Acciones de campaña">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Alcanzados</p>
                      <p className="mt-1 text-xl font-bold">{c.reached.toLocaleString("es-AR")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Citas generadas</p>
                      <p className="mt-1 text-xl font-bold text-success">{c.appointments}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" className="gap-2" onClick={() => toast.info(`Detalle de «${c.name}» en modo demo.`)}>
                      <Eye className="size-3.5" /> Ver detalle
                    </Button>
                    {c.status !== "Finalizada" && (
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => updateCampaignStatus(c.id)}>
                        {c.status === "Pausada" ? <Play className="size-3.5" /> : <Clock className="size-3.5" />}
                        {c.status === "Pausada" ? "Reanudar" : "Pausar"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automatizaciones" className="mt-0 space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Automatizaciones</h2>
              <p className="text-sm text-muted-foreground">Flujos automáticos para mantener el contacto sin trabajo manual.</p>
            </div>
            <Button className="gap-2" onClick={() => toast.success("Nueva automatización preparada en modo demo.")}>
              <Plus className="size-4" /> Nueva automatización
            </Button>
          </div>

          <Card className="shadow-soft">
            <CardContent className="divide-y divide-border p-0">
              {automations.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/30">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${a.enabled ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"}`}>
                      <Zap className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{a.name}</p>
                      <p className="text-xs text-muted-foreground">Canal: {a.channel}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge variant="outline" className={a.enabled ? "border-success/25 text-success" : ""}>
                      {a.enabled ? "Activa" : "Pausada"}
                    </Badge>
                    <Switch checked={a.enabled} onCheckedChange={(value) => toggleAutomation(a.id, value)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="rounded-2xl border border-primary/15 bg-primary-soft/50 p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>Las automatizaciones se aplican por sucursal según el plan contratado. En esta versión frontend los cambios se mantienen durante la sesión.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {templateEditor ? (
        <TemplateEditor
          value={templateEditor}
          onChange={setTemplateEditor}
          onClose={() => setTemplateEditor(null)}
          onSave={saveTemplate}
        />
      ) : null}
    </>
  );
}

function FieldSelect({
  label,
  value,
  disabled,
  options,
  onChange,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger disabled={disabled}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TemplateEditor({
  value,
  onChange,
  onClose,
  onSave,
}: {
  value: { name: string; channel: string; content: string; isNew: boolean };
  onChange: (value: { name: string; channel: string; content: string; isNew: boolean }) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Editor de plantilla">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="font-semibold">{value.isNew ? "Nueva plantilla" : "Editar plantilla"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">Configura el mensaje que utilizará el equipo.</p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Cerrar">
            <span className="text-lg">×</span>
          </Button>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input
                value={value.name}
                onChange={(e) => onChange({ ...value, name: e.target.value })}
                placeholder="Ej. Confirmación de cita"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Canal</Label>
              <Select value={value.channel} onValueChange={(channel) => onChange({ ...value, channel })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Correo">Correo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Contenido</Label>
              <span className="text-[11px] text-muted-foreground">{value.content.length} caracteres</span>
            </div>
            <textarea
              className="min-h-40 w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              value={value.content}
              onChange={(e) => onChange({ ...value, content: e.target.value })}
              placeholder="Escribe el mensaje..."
            />
            <p className="text-[11px] text-muted-foreground">
              Variables disponibles: {"{{paciente}}"}, {"{{detalle}}"}, {"{{fecha}}"}.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border bg-muted/20 p-4">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button className="gap-2" onClick={onSave}><Check className="size-4" /> Guardar plantilla</Button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ side, text, time }: { side: "in" | "out"; text: string; time: string }) {
  return (
    <div className={`flex ${side === "out" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
          side === "out"
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground"
        }`}
      >
        <p>{text}</p>
        <p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${side === "out" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {time}
          {side === "out" ? <CheckCheck className="size-3" /> : null}
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
