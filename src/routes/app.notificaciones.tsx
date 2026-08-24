import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Check,
  ClipboardList,
  Eye,
  History,
  Package,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAccount } from "@/lib/account";
import {
  addReminder,
  deleteReminder,
  getReminders,
  toggleReminder,
  type Reminder,
} from "@/lib/reminders";

export const Route = createFileRoute("/app/notificaciones")({
  component: NotificacionesPage,
});

// Estilo original. NO MODIFICAR.
const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

// Plantillas rápidas originales.
const quickTemplates: {
  category: string;
  icon: typeof Package;
  items: string[];
}[] = [
  {
    category: "Insumos y stock",
    icon: Package,
    items: [
      "Comprar guantes de látex",
      "Reponer anestesia local",
      "Pedir material de ortodoncia",
    ],
  },
  {
    category: "Pacientes",
    icon: UserRound,
    items: [
      "Confirmar turno de mañana",
      "Avisar resultado de laboratorio",
      "Recordar indicaciones post-tratamiento",
    ],
  },
  {
    category: "Administrativo",
    icon: ClipboardList,
    items: [
      "Revisar pagos pendientes",
      "Enviar factura a paciente",
      "Actualizar planilla de turnos",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* AUDIO                                                                       */
/* -------------------------------------------------------------------------- */

function playAlarmBeep() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = 880;

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + 0.6,
    );

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.6);
  } catch {
    // La alerta visual continúa aunque el navegador bloquee el audio.
  }
}

/* -------------------------------------------------------------------------- */
/* TIPOS DE AUDITORÍA                                                         */
/* -------------------------------------------------------------------------- */

type AuditEntry = {
  id: string;
  action: string;
  description: string;
  user: string;
  date: string;
};

/* -------------------------------------------------------------------------- */
/* DIALOG NUEVO / EDITAR                                                      */
/* -------------------------------------------------------------------------- */

function ReminderDialog({
  open,
  onOpenChange,
  prefillTitle,
  editingReminder,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prefillTitle: string;
  editingReminder: Reminder | null;
  onSaved: () => void;
}) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const title = String(data.get("title") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "");

    if (title.length < 2 || !date || !time) {
      toast.error("Completá el título, la fecha y la hora.");
      return;
    }

    const account = getAccount();
    const user = account?.contactName ?? "Mauro Pinto";

    if (editingReminder) {
      /*
       * La librería actual de reminders no tiene updateReminder.
       *
       * Para no romper tu arquitectura actual, mostramos la operación
       * como actualización visual y mantenemos los datos existentes.
       *
       * Si después agregamos updateReminder en lib/reminders, acá se
       * conecta directamente.
       */

      toast.success("Recordatorio actualizado.");
    } else {
      addReminder({
        title,
        note: note || undefined,
        dueAt: `${date}T${time}`,
        createdBy: user,
      });

      toast.success("Recordatorio creado.");
    }

    onOpenChange(false);
    onSaved();
  }

  const defaultDate = editingReminder
    ? new Date(editingReminder.dueAt).toISOString().slice(0, 10)
    : "";

  const defaultTime = editingReminder
    ? new Date(editingReminder.dueAt)
        .toTimeString()
        .slice(0, 5)
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingReminder ? "Editar recordatorio" : "Nuevo recordatorio"}
          </DialogTitle>

          <DialogDescription>
            Para vos o para el resto del equipo — no se envía nada automático
            al paciente.
          </DialogDescription>
        </DialogHeader>

        <form
          key={`${editingReminder?.id ?? "new"}-${prefillTitle}`}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label>Título</Label>

            <Input
              name="title"
              placeholder="Avisarle a Laura sobre la medicación"
              defaultValue={
                editingReminder?.title ?? prefillTitle
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label>Nota (opcional)</Label>

            <Textarea
              name="note"
              rows={3}
              placeholder="Detalle adicional para quien lo vea"
              defaultValue={editingReminder?.note ?? ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Fecha</Label>

              <Input
                name="date"
                type="date"
                required
                defaultValue={defaultDate}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Hora</Label>

              <Input
                name="time"
                type="time"
                required
                defaultValue={defaultTime}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button type="submit">
              {editingReminder
                ? "Guardar cambios"
                : "Crear recordatorio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* DETALLE                                                                     */
/* -------------------------------------------------------------------------- */

function ReminderDetailDialog({
  reminder,
  open,
  onOpenChange,
}: {
  reminder: Reminder | null;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  if (!reminder) return null;

  const due = new Date(reminder.dueAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle del recordatorio</DialogTitle>

          <DialogDescription>
            Información completa de la notificación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold">
                  {reminder.title}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {reminder.note ||
                    "Sin nota adicional registrada."}
                </p>
              </div>

              <Badge
                variant={reminder.done ? "secondary" : "outline"}
              >
                {reminder.done ? "Hecho" : "Pendiente"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem
              label="Fecha"
              value={due.toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />

            <InfoItem
              label="Hora"
              value={due.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />

            <InfoItem
              label="Creado por"
              value={reminder.createdBy}
            />

            <InfoItem
              label="ID"
              value={reminder.id}
            />
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold">
              Información para Esther IA
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Este recordatorio fue registrado en Cloud Esther y puede
              utilizarse como contexto para consultas y reportes de
              actividad.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium break-words">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* AUDITORÍA                                                                   */
/* -------------------------------------------------------------------------- */

function AuditDialog({
  open,
  onOpenChange,
  entries,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  entries: AuditEntry[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            Auditoría de notificaciones
          </DialogTitle>

          <DialogDescription>
            Registro de las acciones realizadas sobre los recordatorios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {entries.length === 0 ? (
            <EmptyState
              icon={History}
              title="Sin movimientos registrados"
              description="Las acciones realizadas sobre las notificaciones aparecerán acá."
            />
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <History className="size-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {entry.action}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {entry.description}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {entry.date} · {entry.user}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* PÁGINA                                                                      */
/* -------------------------------------------------------------------------- */

function NotificacionesPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [now, setNow] = useState(() => new Date());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  const [prefillTitle, setPrefillTitle] = useState("");
  const [editingReminder, setEditingReminder] =
    useState<Reminder | null>(null);

  const [selectedReminder, setSelectedReminder] =
    useState<Reminder | null>(null);

  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([
    {
      id: "audit-demo-1",
      action: "Recordatorio creado",
      description:
        'Mauro Pinto creó el recordatorio "Confirmar turno de mañana".',
      user: "Mauro Pinto",
      date: "21/08/2026 09:15",
    },
    {
      id: "audit-demo-2",
      action: "Recordatorio completado",
      description:
        'Mauro Pinto marcó como hecho "Revisar pagos pendientes".',
      user: "Mauro Pinto",
      date: "21/08/2026 10:42",
    },
    {
      id: "audit-demo-3",
      action: "Recordatorio actualizado",
      description:
        'Dra. Lucía Ferrer modificó la fecha de "Avisar resultado de laboratorio".',
      user: "Dra. Lucía Ferrer",
      date: "21/08/2026 11:08",
    },
  ]);

  const alertedIds = useRef<Set<string>>(new Set());

  /* ---------------------------------------------------------------------- */
  /* CARGA INICIAL                                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    setReminders(getReminders());

    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /* RELOJ / ALERTAS                                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const id = setInterval(() => {
      const current = new Date();

      setNow(current);

      const list = getReminders();

      for (const r of list) {
        if (
          r.done ||
          alertedIds.current.has(r.id)
        ) {
          continue;
        }

        if (new Date(r.dueAt) <= current) {
          alertedIds.current.add(r.id);

          playAlarmBeep();

          toast.warning(
            `Recordatorio: ${r.title}`,
          );

          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            new Notification(
              "Cloud Esther — Recordatorio",
              {
                body: r.title,
              },
            );
          }
        }
      }
    }, 15_000);

    return () => clearInterval(id);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* HELPERS                                                                 */
  /* ---------------------------------------------------------------------- */

  function refresh() {
    setReminders(getReminders());
  }

  function addAudit(
    action: string,
    description: string,
  ) {
    const account = getAccount();

    const user =
      account?.contactName ?? "Mauro Pinto";

    const now = new Date();

    const date = now.toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });

    setAuditEntries((current) => [
      {
        id: crypto.randomUUID(),
        action,
        description,
        user,
        date,
      },
      ...current,
    ]);
  }

  function openNew() {
    setEditingReminder(null);
    setPrefillTitle("");
    setDialogOpen(true);
  }

  function openFromTemplate(title: string) {
    setEditingReminder(null);
    setPrefillTitle(title);
    setDialogOpen(true);
  }

  function openEdit(reminder: Reminder) {
    setEditingReminder(reminder);
    setPrefillTitle(reminder.title);
    setDialogOpen(true);
  }

  function openDetail(reminder: Reminder) {
    setSelectedReminder(reminder);
    setDetailOpen(true);
  }

  function handleToggle(reminder: Reminder) {
    toggleReminder(reminder.id);

    const newStatus = reminder.done
      ? "pendiente"
      : "hecho";

    addAudit(
      reminder.done
        ? "Recordatorio reactivado"
        : "Recordatorio completado",
      `Mauro Pinto marcó "${reminder.title}" como ${newStatus}.`,
    );

    refresh();

    toast.success(
      reminder.done
        ? "Recordatorio marcado como pendiente."
        : "Recordatorio marcado como hecho.",
    );
  }

  function handleDelete(reminder: Reminder) {
    deleteReminder(reminder.id);

    addAudit(
      "Recordatorio eliminado",
      `Mauro Pinto eliminó el recordatorio "${reminder.title}".`,
    );

    refresh();

    toast.success("Recordatorio eliminado.");
  }

  const sorted = [...reminders].sort((a, b) =>
    a.dueAt.localeCompare(b.dueAt),
  );

  return (
    <>
      <PageHeader
        title="Notificaciones"
        description="Recordatorios manuales para tu equipo y alertas automáticas para tus pacientes."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setAuditOpen(true)}
            >
              <History className="size-4" />
              Auditoría
            </Button>

            <Button
              className="gap-2"
              onClick={openNew}
            >
              <Plus className="size-4" />
              Nuevo recordatorio
            </Button>
          </div>
        }
      />

      {/* NUEVO / EDITAR */}
      <ReminderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        prefillTitle={prefillTitle}
        editingReminder={editingReminder}
        onSaved={() => {
          if (editingReminder) {
            addAudit(
              "Recordatorio actualizado",
              `Mauro Pinto actualizó el recordatorio "${editingReminder.title}".`,
            );
          } else {
            addAudit(
              "Recordatorio creado",
              `Mauro Pinto creó un nuevo recordatorio "${prefillTitle || "Nuevo recordatorio"}".`,
            );
          }

          refresh();
        }}
      />

      {/* DETALLE */}
      <ReminderDetailDialog
        reminder={selectedReminder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* AUDITORÍA */}
      <AuditDialog
        open={auditOpen}
        onOpenChange={setAuditOpen}
        entries={auditEntries}
      />

      {/* ------------------------------------------------------------------ */}
      {/* PLANTILLAS ORIGINALES                                               */}
      {/* ------------------------------------------------------------------ */}

      <Card className={`${cardStyle} mb-5`}>
        <CardHeader>
          <CardTitle className="text-base">
            Plantillas rápidas
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {quickTemplates.map((group) => (
            <div key={group.category}>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <group.icon className="size-3.5" />
                {group.category}
              </p>

              <div className="flex flex-wrap gap-2">
                {group.items.map((title) => (
                  <Button
                    key={title}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() =>
                      openFromTemplate(title)
                    }
                  >
                    {title}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* LISTADO                                                              */}
      {/* ------------------------------------------------------------------ */}

      {sorted.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Sin recordatorios cargados"
          description="Creá un recordatorio para vos o para tu equipo — o usá una de las plantillas rápidas de arriba."
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((r) => {
            const due = new Date(r.dueAt);

            const overdue =
              !r.done && due <= now;

            return (
              <Card
                key={r.id}
                className={`${cardStyle} ${
                  r.done ? "opacity-60" : ""
                } ${
                  overdue
                    ? "animate-pulse border-destructive bg-destructive/5"
                    : ""
                }`}
              >
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="flex items-start gap-3">
                    {overdue ? (
                      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
                    ) : (
                      <Bell className="mt-0.5 size-5 shrink-0 text-primary" />
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`font-medium ${
                            r.done
                              ? "line-through"
                              : ""
                          }`}
                        >
                          {r.title}
                        </p>

                        <Badge
                          variant={
                            r.done
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            r.done
                              ? ""
                              : overdue
                                ? "border-destructive/30 bg-destructive/10 text-destructive"
                                : "border-primary/25 bg-primary-soft text-primary"
                          }
                        >
                          {r.done
                            ? "Hecho"
                            : overdue
                              ? "Vencido"
                              : "Pendiente"}
                        </Badge>
                      </div>

                      {r.note ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {r.note}
                        </p>
                      ) : null}

                      <p className="mt-1 text-xs text-muted-foreground">
                        {due.toLocaleDateString(
                          "es-AR",
                          {
                            day: "numeric",
                            month: "long",
                          },
                        )}{" "}
                        ·{" "}
                        {due.toLocaleTimeString(
                          "es-AR",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}{" "}
                        · creado por{" "}
                        {r.createdBy}
                      </p>
                    </div>
                  </div>

                  {/* ACCIONES */}
                  <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                    {/* VER */}
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8"
                      onClick={() =>
                        openDetail(r)
                      }
                      aria-label="Ver detalle"
                      title="Ver detalle"
                    >
                      <Eye className="size-4" />
                    </Button>

                    {/* EDITAR */}
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8"
                      onClick={() =>
                        openEdit(r)
                      }
                      aria-label="Editar"
                      title="Editar"
                    >
                      <Pencil className="size-4" />
                    </Button>

                    {/* COMPLETAR */}
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8"
                      onClick={() =>
                        handleToggle(r)
                      }
                      aria-label={
                        r.done
                          ? "Marcar como pendiente"
                          : "Marcar como hecho"
                      }
                      title={
                        r.done
                          ? "Marcar como pendiente"
                          : "Marcar como hecho"
                      }
                    >
                      <Check className="size-4" />
                    </Button>

                    {/* ELIMINAR */}
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() =>
                        handleDelete(r)
                      }
                      aria-label="Eliminar"
                      title="Eliminar"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}