import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  MessageCircleQuestion,
  Mic,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users2,
  Wallet,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { EstherWalkingScene } from "@/components/app/EstherWalkingScene";
import { EmptyState } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  addEstherQuestion,
  getEstherHistory,
  getLastModule,
  type EstherQuestion,
} from "@/lib/esther-chat";

export const Route = createFileRoute("/app/ia-esther")({
  component: IaEstherPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

type ChatMessage = {
  id: string;
  role: "user" | "esther";
  text: string;
};

const quickPrompts = [
  {
    text: "¿Cuántos turnos hay hoy?",
    icon: CalendarDays,
  },
  {
    text: "¿Cuánto facturamos este mes?",
    icon: Wallet,
  },
  {
    text: "¿Cuántos odontólogos tenemos activos?",
    icon: Users2,
  },
  {
    text: "¿Hay algo importante que deba revisar?",
    icon: AlertTriangle,
  },
];

const capabilities = [
  {
    title: "Agenda inteligente",
    description:
      "Consultar turnos, ocupación, cancelaciones y espacios disponibles.",
    icon: CalendarDays,
  },
  {
    title: "Análisis financiero",
    description:
      "Analizar ingresos, pagos, vencimientos y evolución financiera.",
    icon: TrendingUp,
  },
  {
    title: "Pacientes",
    description:
      "Encontrar información y generar análisis sobre pacientes y actividad.",
    icon: Users2,
  },
  {
    title: "Apoyo clínico",
    description:
      "Preparar análisis y asistencia clínica cuando el motor de IA esté conectado.",
    icon: Stethoscope,
  },
  {
    title: "Reportes",
    description:
      "Ayudarte a interpretar indicadores y preparar reportes de gestión.",
    icon: BarChart3,
  },
  {
    title: "Alertas",
    description:
      "Detectar situaciones que requieran atención dentro de la clínica.",
    icon: AlertTriangle,
  },
];

function IaEstherPage() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<EstherQuestion[]>([]);
  const [lastModule, setLastModuleState] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState("asistente");

  useEffect(() => {
    setHistory(getEstherHistory());
    setLastModuleState(getLastModule());
  }, []);

  const hasConversation = chatMessages.length > 0;

  const pendingCapabilities = useMemo(
    () => [
      "Motor de IA conectado",
      "Acceso seguro a datos clínicos",
      "Análisis financiero automático",
      "Generación inteligente de reportes",
    ],
    [],
  );

  function submitQuestion(text: string) {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    addEstherQuestion(trimmed);

    setHistory(getEstherHistory());

    setChatMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "user",
        text: trimmed,
      },
      {
        id: crypto.randomUUID(),
        role: "esther",
        text:
          "Recibí tu consulta. La interfaz de Esther ya está preparada para procesarla, pero el motor de IA todavía necesita conectarse al backend para generar una respuesta real.",
      },
    ]);

    setMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuestion(message);
  }

  function useQuickPrompt(prompt: string) {
    setMessage(prompt);
    setActiveTab("asistente");
  }

  function clearConversation() {
    setChatMessages([]);
    toast.success("Conversación limpiada.");
  }

  return (
    <>
      <PageHeader
        title="IA Esther"
        description="Tu asistente inteligente dentro de Cloud Esther. Consultá, analizá y entendé mejor tu clínica."
        badge="Esther AI"
      />

      {/* ESTHER */}
      <Card className={`${cardStyle} overflow-hidden`}>
        <CardContent className="p-0">
          <EstherWalkingScene />
        </CardContent>
      </Card>

      {/* BIENVENIDA */}
      <Card className={`${cardStyle} mt-5`}>
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-7" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">
                  Hola, ¿en qué puedo ayudarte?
                </h2>

                <Badge variant="secondary" className="gap-1">
                  <Bot className="size-3.5" />
                  Esther
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Estoy preparada para ayudarte a consultar y analizar
                información de Cloud Esther.
              </p>

              {lastModule ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Vi que estabas en{" "}
                  <span className="font-semibold text-primary">
                    {lastModule}
                  </span>
                  . Podemos continuar desde ahí.
                </p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PREGUNTAS RÁPIDAS */}
      <Card className={`${cardStyle} mt-5`}>
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="text-sm font-semibold">
              ¿Qué querés consultar?
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Elegí una consulta rápida o escribile directamente a Esther.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {quickPrompts.map((prompt) => {
              const Icon = prompt.icon;

              return (
                <Button
                  key={prompt.text}
                  type="button"
                  variant="outline"
                  className="h-auto justify-start gap-2 rounded-xl px-4 py-3 text-left"
                  onClick={() => useQuickPrompt(prompt.text)}
                >
                  <Icon className="size-4 shrink-0 text-primary" />

                  <span className="whitespace-normal text-xs">
                    {prompt.text}
                  </span>
                </Button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 rounded-full"
              onClick={() =>
                toast.info(
                  "El reconocimiento de voz requiere una integración adicional.",
                )
              }
              aria-label="Hablar con Esther"
            >
              <Mic className="size-4" />
            </Button>

            <Input
              placeholder="Escribile una pregunta a Esther..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="h-11 rounded-full"
            />

            <Button
              type="submit"
              size="icon"
              className="shrink-0 rounded-full"
              disabled={!message.trim()}
              aria-label="Enviar pregunta"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* CONVERSACIÓN */}
      {hasConversation ? (
        <Card className={`${cardStyle} mt-5`}>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircleQuestion className="size-4 text-primary" />
              Conversación con Esther
            </CardTitle>

            <Button
              size="sm"
              variant="ghost"
              onClick={clearConversation}
            >
              Limpiar
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {chatMessages.map((chat) => (
              <div
                key={chat.id}
                className={`flex ${
                  chat.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                    chat.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary/15 bg-primary/5"
                  }`}
                >
                  {chat.role === "esther" ? (
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Sparkles className="size-3.5" />
                      Esther
                    </div>
                  ) : null}

                  <p>{chat.text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {/* CAPACIDADES */}
      <div className="mt-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold">
            Centro de inteligencia
          </h2>

          <p className="text-sm text-muted-foreground">
            Estas son las áreas en las que Esther podrá ayudarte.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {capabilities.map((capability) => {
            const Icon = capability.icon;

            return (
              <Card
                key={capability.title}
                className={cardStyle}
              >
                <CardContent className="p-5">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-4 font-semibold">
                    {capability.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {capability.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* TABS */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-7"
      >
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="asistente">
            Asistente
          </TabsTrigger>

          <TabsTrigger value="apoyo">
            Apoyo clínico
          </TabsTrigger>

          <TabsTrigger value="gestion">
            Gestión y alertas
          </TabsTrigger>

          <TabsTrigger value="historial">
            Historial
          </TabsTrigger>
        </TabsList>

        {/* ASISTENTE */}
        <TabsContent value="asistente" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className={`${cardStyle} lg:col-span-2`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircleQuestion className="size-4 text-primary" />
                  Preguntale a Esther
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  La interfaz de conversación está disponible. Las
                  respuestas inteligentes requieren conectar el motor de IA
                  con los datos autorizados de Cloud Esther.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span className="text-sm font-semibold">
                        Interfaz disponible
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Preguntas, historial y navegación preparados.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2">
                      <Clock3 className="size-4 text-primary" />
                      <span className="text-sm font-semibold">
                        Motor pendiente
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Falta conectar el servicio de IA real.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-base">
                  Consultas sugeridas
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt.text}
                    variant="ghost"
                    className="h-auto w-full justify-start whitespace-normal px-3 py-3 text-left"
                    onClick={() => useQuickPrompt(prompt.text)}
                  >
                    {prompt.text}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* APOYO CLÍNICO */}
        <TabsContent value="apoyo" className="mt-4">
          <Card className={cardStyle}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Stethoscope className="size-7" />
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                  Apoyo clínico con Esther
                </h3>

                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Esta sección queda preparada para análisis clínicos,
                  protocolos, interpretación de información y asistencia al
                  profesional.
                </p>

                <Badge className="mt-4" variant="outline">
                  Motor clínico de IA pendiente
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GESTIÓN */}
        <TabsContent value="gestion" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Agenda",
                description: "Turnos, cancelaciones y ocupación.",
                icon: CalendarDays,
              },
              {
                title: "Finanzas",
                description: "Ingresos, pagos y vencimientos.",
                icon: Wallet,
              },
              {
                title: "Equipo",
                description: "Actividad y rendimiento del personal.",
                icon: Users2,
              },
              {
                title: "Alertas",
                description: "Situaciones que requieren atención.",
                icon: AlertTriangle,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.title}
                  className={cardStyle}
                >
                  <CardContent className="p-5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>

                    <h3 className="mt-4 font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>

                    <Badge
                      variant="outline"
                      className="mt-4"
                    >
                      Preparado para integración
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className={`${cardStyle} mt-4`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="size-4 text-primary" />
                Centro de alertas inteligentes
              </CardTitle>
            </CardHeader>

            <CardContent>
              <EmptyState
                icon={ShieldCheck}
                title="Todavía no hay alertas inteligentes"
                description="Cuando Esther tenga acceso autorizado a los datos de Cloud Esther podrá detectar situaciones que requieran atención."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORIAL */}
        <TabsContent value="historial" className="mt-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="size-4 text-primary" />
                Historial de consultas
              </CardTitle>
            </CardHeader>

            <CardContent>
              {history.length === 0 ? (
                <EmptyState
                  icon={History}
                  title="Todavía no hay consultas"
                  description="Las preguntas que hagas a Esther aparecerán acá."
                />
              ) : (
                <div className="space-y-2">
                  {history.map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => {
                        setMessage(question.text);
                        setActiveTab("asistente");
                      }}
                      className="flex w-full items-start gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary-soft/40"
                    >
                      <History className="mt-0.5 size-4 shrink-0 text-primary" />

                      <span className="text-sm">
                        {question.text}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CAPACIDADES PENDIENTES */}
      <Card className={`${cardStyle} mt-6`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Workflow className="size-4 text-primary" />
            Preparación del motor Esther
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pendingCapabilities.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border p-4"
              >
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="size-3.5 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {item}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Preparación posterior
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}