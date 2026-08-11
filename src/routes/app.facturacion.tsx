import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CreditCard, Download, Plus, Receipt, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { StatCard } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addOns, currency, invoices, moduleNameByKey, plans } from "@/data/demo";

export const Route = createFileRoute("/app/facturacion")({
  component: BillingPage,
});

const statusVariant: Record<string, string> = {
  pagada: "bg-success-soft text-success border-success/25",
  pendiente: "bg-warning/15 text-warning-foreground border-warning/30",
  vencida: "bg-destructive/10 text-destructive border-destructive/25",
};

function BillingPage() {
  const currentPlan = plans[3]!;

  return (
    <>
      <PageHeader
        title="Facturación y suscripción"
        description="Facturas de pacientes, cobros pendientes y gestión de la membresía del grupo."
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Exportando facturas…")}>
              <Download className="size-4" /> Exportar
            </Button>
            <Button className="gap-2" onClick={() => toast.info("Nueva factura")}>
              <Plus className="size-4" /> Nueva factura
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Facturado este mes" value={currency(64980)} delta={12} icon={Receipt} />
        <StatCard label="Cobrado" value={currency(58210)} delta={9} icon={Wallet} tone="success" />
        <StatCard label="Pendiente de cobro" value={currency(6770)} icon={CreditCard} tone="warning" hint="14 facturas" />
        <StatCard label="Vencido +30 días" value={currency(1120)} delta={-22} icon={AlertTriangle} tone="warning" />
      </div>

      <Tabs defaultValue="facturas" className="mt-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="facturas">Facturas</TabsTrigger>
          <TabsTrigger value="suscripcion">Suscripción</TabsTrigger>
          <TabsTrigger value="modulos">Módulos</TabsTrigger>
          <TabsTrigger value="metodos">Métodos de pago</TabsTrigger>
        </TabsList>

        <TabsContent value="facturas" className="mt-4">
          <Card className="shadow-soft">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº factura</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.id}</TableCell>
                      <TableCell>{i.patient}</TableCell>
                      <TableCell className="text-muted-foreground">{i.date}</TableCell>
                      <TableCell className="font-medium">{currency(i.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize ${statusVariant[i.status]}`}>
                          {i.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`Recordatorio enviado a ${i.patient}.`)}>
                          Enviar recordatorio
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suscripcion" className="mt-4">
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="shadow-soft lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Tu membresía</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary-soft p-5">
                  <div>
                    <Badge className="mb-2">Plan actual</Badge>
                    <p className="font-display text-xl font-bold">{currentPlan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currency(currentPlan.monthly)}/mes · renueva el 01/09/2026
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => toast.info("Comparativa de planes")}>Cambiar de plan</Button>
                    <Button onClick={() => toast.success("Renovación automática activa.")}>Gestionar</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <p className="text-sm font-semibold">Renovación automática</p>
                    <p className="text-xs text-muted-foreground">Se cobrará el día 1 de cada mes.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { l: "Sucursales activas", v: "3 de ilimitadas" },
                    { l: "Usuarios", v: "37 activos" },
                    { l: "Módulos activos", v: `${currentPlan.modules.length} de 10` },
                  ].map((k) => (
                    <div key={k.l} className="rounded-xl border border-border p-4">
                      <p className="text-xs text-muted-foreground">{k.l}</p>
                      <p className="mt-1 font-semibold">{k.v}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Historial de pagos</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {["01/08/2026", "01/07/2026", "01/06/2026", "01/05/2026"].map((d) => (
                  <div key={d} className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div>
                      <p className="font-medium">{currency(429)}</p>
                      <p className="text-xs text-muted-foreground">{d}</p>
                    </div>
                    <Badge variant="outline" className="bg-success-soft text-success">Pagado</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modulos" className="mt-4">
          <Card className="shadow-soft">
            <CardContent className="divide-y divide-border p-0">
              {currentPlan.modules.map((m) => (
                <div key={m} className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-semibold">{moduleNameByKey[m]}</p>
                    <p className="text-xs text-muted-foreground">Incluido en {currentPlan.name}</p>
                  </div>
                  <Switch defaultChecked onCheckedChange={() => toast.success("Módulo actualizado.")} />
                </div>
              ))}
            </CardContent>
          </Card>
          <h3 className="mt-6 text-base font-semibold">Extras contratables</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((a) => (
              <Card key={a.name} className="shadow-soft">
                <CardContent className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <p className="text-sm font-semibold">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{currency(a.price)} / {a.unit}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => toast.success(`${a.name} añadido a tu suscripción.`)}>
                    Añadir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metodos" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { t: "Visa terminada en 4421", d: "Caduca 08/2028", p: true },
              { t: "Domiciliación SEPA ES91 •••• 3344", d: "Titular: Grupo Dental Arriaga SL", p: false },
            ].map((m) => (
              <Card key={m.t} className="shadow-soft">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <CreditCard className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{m.t}</p>
                      <p className="text-xs text-muted-foreground">{m.d}</p>
                    </div>
                  </div>
                  {m.p ? <Badge>Principal</Badge> : <Button size="sm" variant="ghost">Hacer principal</Button>}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 size-4 text-warning-foreground" />
            <p>Tu tarjeta principal caduca en 24 meses. Recibirás un aviso 30 días antes del vencimiento.</p>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
