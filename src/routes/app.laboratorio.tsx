import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  FlaskConical,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Truck,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState, StatCard } from "@/components/app/ui-kit";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/app/laboratorio")({
  component: LaboratorioPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

/* =========================================================
   DATOS DEMO
   Datos ficticios para mostrar la estructura.
========================================================= */

const demoPatient = {
  name: "Mauro Pinto",
  document: "95-222-94",
  phone: "11 5555-2222",
};

const demoLaboratory = {
  name: "Laboratorio Dental Premium",
  contact: "Carlos Rodríguez",
  phone: "11 4444-8899",
  email: "contacto@labpremium.com",
  address: "Av. Corrientes 2450, CABA",
};

const demoOrder = {
  id: "LAB-000125",
  patient: "Mauro Pinto",
  professional: "Dra. Laura Martínez",
  treatment: "Corona cerámica pieza 16",
  teeth: "Pieza 16",
  laboratory: "Laboratorio Dental Premium",
  requested: "20/08/2026",
  estimated: "28/08/2026",
  status: "En proceso",
  priority: "Normal",
  cost: "$185.000",
  paid: "$92.500",
  remaining: "$92.500",
  observations:
    "Corona cerámica color A2. Se adjunta impresión digital y fotografías clínicas.",
};

const auditEntries = [
  {
    action: "Pedido de laboratorio creado",
    user: "Dra. Laura Martínez",
    date: "20/08/2026",
    time: "14:32",
    computer: "PC-GABINETE-01",
  },
  {
    action: "Estado cambiado a 'En proceso'",
    user: "Mauro Gómez",
    date: "21/08/2026",
    time: "09:14",
    computer: "PC-ADMIN-02",
  },
  {
    action: "Fecha estimada de entrega modificada",
    user: "Mauro Gómez",
    date: "21/08/2026",
    time: "09:18",
    computer: "PC-ADMIN-02",
  },
];

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

function LaboratorioPage() {
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showLaboratories, setShowLaboratories] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  const [search, setSearch] = useState("");

  return (
    <>
      <PageHeader
        title="Laboratorio"
        description="Pedidos a laboratorios externos por paciente y tratamiento, con estado en tiempo real y fecha estimada de entrega."
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowAudit(true)}
            >
              <ShieldCheck className="size-4" />
              Auditoría
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowLaboratories(true)}
            >
              <Building2 className="size-4" />
              Laboratorios
            </Button>

            <Button
              className="gap-2"
              onClick={() => setShowNewOrder(true)}
            >
              <Plus className="size-4" />
              Nuevo pedido
            </Button>
          </>
        }
      />

      {/* =====================================================
          ESTADÍSTICAS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pedidos recibidos" value="1" icon={Package} />

        <StatCard
          label="En proceso"
          value="1"
          icon={Clock}
          tone="info"
        />

        <StatCard
          label="Por entregar"
          value="1"
          icon={FlaskConical}
          tone="warning"
        />

        <StatCard
          label="Entregados"
          value="0"
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      {/* =====================================================
          BUSCADOR
      ===================================================== */}

      <Card className={`${cardStyle} mt-6`}>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Buscar por paciente, pedido o laboratorio"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pedidos" className="mt-6">
        <TabsList>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="estado">Estado en tiempo real</TabsTrigger>
          <TabsTrigger value="laboratorios">
            Listado por laboratorio
          </TabsTrigger>
        </TabsList>

        {/* ===================================================
            PEDIDOS
        =================================================== */}

        <TabsContent value="pedidos" className="mt-4">
          <Card className={cardStyle}>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-semibold">
                      Pedido #{demoOrder.id}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Creado el {demoOrder.requested}
                    </p>
                  </div>

                  <Badge variant="secondary">
                    {demoOrder.status}
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Info
                    label="Paciente"
                    value={demoOrder.patient}
                    icon={User}
                  />

                  <Info
                    label="Profesional"
                    value={demoOrder.professional}
                    icon={User}
                  />

                  <Info
                    label="Tratamiento"
                    value={demoOrder.treatment}
                    icon={FlaskConical}
                  />

                  <Info
                    label="Pieza"
                    value={demoOrder.teeth}
                  />

                  <Info
                    label="Laboratorio"
                    value={demoOrder.laboratory}
                    icon={Building2}
                  />

                  <Info
                    label="Entrega estimada"
                    value={demoOrder.estimated}
                    icon={Truck}
                  />
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm font-medium">
                    Observaciones
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {demoOrder.observations}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Info
                    label="Costo total"
                    value={demoOrder.cost}
                  />

                  <Info
                    label="Pagado"
                    value={demoOrder.paid}
                  />

                  <Info
                    label="Saldo"
                    value={demoOrder.remaining}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="gap-2"
                    onClick={() => setShowOrder(true)}
                  >
                    <Eye className="size-4" />
                    Ver pedido
                  </Button>

                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() =>
                      toast.info("Editor del pedido de laboratorio")
                    }
                  >
                    <Pencil className="size-4" />
                    Editar
                  </Button>

                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() =>
                      toast.success(
                        "Documento adjunto al pedido.",
                      )
                    }
                  >
                    <FileText className="size-4" />
                    Adjuntar documentación
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================================================
            ESTADO EN TIEMPO REAL
        =================================================== */}

        <TabsContent value="estado" className="mt-4">
          <Card className={cardStyle}>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">
                    Seguimiento del pedido #{demoOrder.id}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Paciente: {demoOrder.patient}
                  </p>
                </div>

                <div className="space-y-4">
                  <TimelineItem
                    title="Pedido recibido"
                    description="El laboratorio recibió la solicitud."
                    date="20/08/2026 · 14:35"
                    done
                  />

                  <TimelineItem
                    title="En proceso"
                    description="El laboratorio comenzó la fabricación de la corona."
                    date="21/08/2026 · 09:10"
                    done
                  />

                  <TimelineItem
                    title="Control de calidad"
                    description="Pendiente de revisión por el laboratorio."
                    date="Estimado: 27/08/2026"
                  />

                  <TimelineItem
                    title="Listo para entregar"
                    description="El pedido será enviado a la clínica."
                    date="Estimado: 28/08/2026"
                  />
                </div>

                <div className="rounded-xl border bg-primary/5 p-4">
                  <p className="font-medium">
                    Última actualización
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    21/08/2026 a las 09:10 — Laboratorio Dental Premium
                    informó que el trabajo continúa en proceso.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================================================
            LABORATORIOS
        =================================================== */}

        <TabsContent value="laboratorios" className="mt-4">
          <Card className={cardStyle}>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      Laboratorios registrados
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Laboratorios externos disponibles para asignar pedidos.
                    </p>
                  </div>

                  <Button
                    className="gap-2"
                    onClick={() =>
                      toast.info("Formulario de alta de laboratorio")
                    }
                  >
                    <Plus className="size-4" />
                    Agregar
                  </Button>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div className="flex gap-3">
                      <Building2 className="mt-1 size-5 text-primary" />

                      <div>
                        <p className="font-semibold">
                          {demoLaboratory.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Contacto: {demoLaboratory.contact}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {demoLaboratory.phone}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {demoLaboratory.email}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {demoLaboratory.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        Activo
                      </Badge>

                      <Button
                        variant="outline"
                        size="icon"
                        title="Editar laboratorio"
                        onClick={() =>
                          toast.info("Editar laboratorio")
                        }
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* =====================================================
          MODAL — NUEVO PEDIDO
      ===================================================== */}

      <Dialog open={showNewOrder} onOpenChange={setShowNewOrder}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo pedido de laboratorio</DialogTitle>

            <DialogDescription>
              Asociá el pedido a un paciente, tratamiento y laboratorio.
            </DialogDescription>
          </DialogHeader>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4"
            title="Cerrar"
            onClick={() => setShowNewOrder(false)}
          >
            <X className="size-4" />
          </Button>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Paciente</Label>

              <Input
                value="Mauro Pinto"
                readOnly
              />
            </div>

            <div className="space-y-1.5">
              <Label>Odontólogo</Label>

              <Select defaultValue="laura">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="laura">
                    Dra. Laura Martínez
                  </SelectItem>

                  <SelectItem value="carlos">
                    Dr. Carlos Gómez
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Laboratorio</Label>

              <Select defaultValue="premium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="premium">
                    Laboratorio Dental Premium
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Tratamiento</Label>

              <Input
                value="Corona cerámica pieza 16"
                readOnly
              />
            </div>

            <div className="space-y-1.5">
              <Label>Pieza</Label>

              <Input value="16" readOnly />
            </div>

            <div className="space-y-1.5">
              <Label>Fecha de solicitud</Label>

              <Input type="date" defaultValue="2026-08-21" />
            </div>

            <div className="space-y-1.5">
              <Label>Entrega estimada</Label>

              <Input type="date" defaultValue="2026-08-28" />
            </div>

            <div className="space-y-1.5">
              <Label>Prioridad</Label>

              <Select defaultValue="normal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Costo</Label>

              <Input defaultValue="185000" />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Indicaciones al laboratorio</Label>

              <Textarea
                rows={4}
                defaultValue="Corona cerámica color A2. Se adjunta impresión digital y fotografías clínicas."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewOrder(false)}
            >
              Cancelar
            </Button>

            <Button
              onClick={() => {
                setShowNewOrder(false);

                toast.success(
                  "Pedido de laboratorio creado correctamente.",
                );
              }}
            >
              Crear pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          MODAL — VER PEDIDO
      ===================================================== */}

      <Dialog open={showOrder} onOpenChange={setShowOrder}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Pedido #{demoOrder.id}
            </DialogTitle>

            <DialogDescription>
              Detalle completo del pedido de laboratorio.
            </DialogDescription>
          </DialogHeader>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4"
            title="Cerrar"
            onClick={() => setShowOrder(false)}
          >
            <X className="size-4" />
          </Button>

          <div className="space-y-5">
            <div className="flex justify-between gap-4 rounded-xl border p-4">
              <div>
                <p className="font-semibold">
                  {demoOrder.patient}
                </p>

                <p className="text-sm text-muted-foreground">
                  DNI: {demoPatient.document}
                </p>
              </div>

              <Badge>{demoOrder.status}</Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Tratamiento" value={demoOrder.treatment} />

              <Info label="Pieza" value={demoOrder.teeth} />

              <Info
                label="Profesional"
                value={demoOrder.professional}
              />

              <Info
                label="Laboratorio"
                value={demoOrder.laboratory}
              />

              <Info
                label="Solicitado"
                value={demoOrder.requested}
              />

              <Info
                label="Entrega estimada"
                value={demoOrder.estimated}
              />
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium">
                Observaciones
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {demoOrder.observations}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="font-medium">
                Documentación
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  Fotografía clínica
                </Badge>

                <Badge variant="secondary">
                  Impresión digital
                </Badge>

                <Badge variant="secondary">
                  Orden odontológica
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowOrder(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          MODAL — LABORATORIOS
      ===================================================== */}

      <Dialog
        open={showLaboratories}
        onOpenChange={setShowLaboratories}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Laboratorios externos
            </DialogTitle>

            <DialogDescription>
              Administrá los laboratorios con los que trabaja la clínica.
            </DialogDescription>
          </DialogHeader>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4"
            title="Cerrar"
            onClick={() => setShowLaboratories(false)}
          >
            <X className="size-4" />
          </Button>

          <div className="rounded-xl border p-4">
            <div className="flex gap-3">
              <Building2 className="mt-1 size-5 text-primary" />

              <div className="flex-1">
                <p className="font-semibold">
                  {demoLaboratory.name}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Contacto: {demoLaboratory.contact}
                </p>

                <p className="text-sm text-muted-foreground">
                  Teléfono: {demoLaboratory.phone}
                </p>

                <p className="text-sm text-muted-foreground">
                  Email: {demoLaboratory.email}
                </p>

                <p className="text-sm text-muted-foreground">
                  Dirección: {demoLaboratory.address}
                </p>

                <div className="mt-3">
                  <Badge variant="secondary">
                    Laboratorio activo
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowLaboratories(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          MODAL — AUDITORÍA
      ===================================================== */}

      <Dialog open={showAudit} onOpenChange={setShowAudit}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Auditoría — Laboratorio
            </DialogTitle>

            <DialogDescription>
              Registro de las acciones realizadas dentro del módulo.
            </DialogDescription>
          </DialogHeader>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4"
            title="Cerrar auditoría"
            onClick={() => setShowAudit(false)}
          >
            <X className="size-4" />
          </Button>

          <div className="space-y-3">
            {auditEntries.map((entry, index) => (
              <div
                key={index}
                className="rounded-xl border p-4"
              >
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-5 text-primary" />

                  <div>
                    <p className="font-medium">
                      {entry.action}
                    </p>

                    <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                      <span>
                        Usuario: {entry.user}
                      </span>

                      <span>
                        Fecha: {entry.date}
                      </span>

                      <span>
                        Hora: {entry.time}
                      </span>

                      <span>
                        Computadora: {entry.computer}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowAudit(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* =========================================================
   COMPONENTES AUXILIARES
========================================================= */

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof User;
}) {
  return (
    <div className="rounded-xl border p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-2">
        {Icon ? (
          <Icon className="size-4 text-primary" />
        ) : null}

        <p className="text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  description,
  date,
  done = false,
}: {
  title: string;
  description: string;
  date: string;
  done?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border ${
          done ? "border-primary bg-primary/10" : "border-border"
        }`}
      >
        {done ? (
          <CheckCircle2 className="size-4 text-primary" />
        ) : (
          <Clock className="size-4 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 border-b pb-4">
        <p className="font-medium">
          {title}
        </p>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {date}
        </p>
      </div>
    </div>
  );
}