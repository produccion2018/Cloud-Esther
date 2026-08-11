import { createFileRoute } from "@tanstack/react-router";
import { Building2, Plug, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { dentists, roles } from "@/data/demo";

export const Route = createFileRoute("/app/configuracion")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Configuración"
        description="Datos de la organización, sucursales, equipo, permisos, integraciones y seguridad."
        actions={
          <Button className="gap-2" onClick={() => toast.success("Cambios guardados.")}>
            <Save className="size-4" /> Guardar cambios
          </Button>
        }
      />

      <Tabs defaultValue="clinica">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="clinica">Clínica</TabsTrigger>
          <TabsTrigger value="sucursales">Sucursales</TabsTrigger>
          <TabsTrigger value="equipo">Equipo</TabsTrigger>
          <TabsTrigger value="roles">Roles y permisos</TabsTrigger>
          <TabsTrigger value="horarios">Horarios y gabinetes</TabsTrigger>
          <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="clinica" className="mt-4">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Datos de la organización</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[
                { l: "Razón social", v: "Grupo Dental Arriaga S.L." },
                { l: "CIF", v: "B-88452117" },
                { l: "Nombre comercial", v: "Grupo Dental Arriaga" },
                { l: "Correo de contacto", v: "direccion@dentalarriaga.com" },
                { l: "Teléfono", v: "+34 910 445 220" },
                { l: "Dirección fiscal", v: "C/ Serrano 118, Madrid" },
              ].map((f) => (
                <div key={f.l} className="space-y-1.5">
                  <Label>{f.l}</Label>
                  <Input defaultValue={f.v} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sucursales" className="mt-4">
          <Card className="shadow-soft">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sucursal</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Gabinetes</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { n: "Clínica Centro", d: "C/ Serrano 118, Madrid", g: 4, e: 18 },
                    { n: "Clínica Norte", d: "Av. Alberto Alcocer 22, Madrid", g: 3, e: 12 },
                    { n: "Clínica Sur", d: "C/ Getafe 9, Leganés", g: 2, e: 7 },
                  ].map((b) => (
                    <TableRow key={b.n}>
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-2"><Building2 className="size-4 text-primary" />{b.n}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{b.d}</TableCell>
                      <TableCell>{b.g}</TableCell>
                      <TableCell>{b.e}</TableCell>
                      <TableCell><Badge variant="secondary">Activa</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipo" className="mt-4">
          <Card className="shadow-soft">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Sucursal</TableHead>
                    <TableHead>Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dentists.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell className="text-muted-foreground">{d.specialty}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">{d.branch}</TableCell>
                      <TableCell><Badge variant="outline">Odontólogo</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card className="shadow-soft">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rol</TableHead>
                    <TableHead>Alcance</TableHead>
                    <TableHead>Usuarios</TableHead>
                    <TableHead>Permisos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((r) => (
                    <TableRow key={r.name}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-muted-foreground">{r.scope}</TableCell>
                      <TableCell>{r.users}</TableCell>
                      <TableCell className="text-muted-foreground">{r.permissions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="mt-3 text-sm text-muted-foreground">
            Cada usuario accede únicamente a la información de su sucursal y de los módulos
            autorizados por su rol.
          </p>
        </TabsContent>

        <TabsContent value="horarios" className="mt-4">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Horarios laborales</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((d) => (
                  <div key={d} className="flex items-center justify-between gap-3">
                    <span className="w-24 text-sm font-medium">{d}</span>
                    <Input className="max-w-28" defaultValue="09:00" />
                    <span className="text-muted-foreground">—</span>
                    <Input className="max-w-28" defaultValue={d === "Sábado" ? "14:00" : "20:00"} />
                    <Switch defaultChecked={d !== "Sábado"} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Gabinetes</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { n: "Gabinete 1 — Centro", e: "Polivalente" },
                  { n: "Gabinete 2 — Centro", e: "Cirugía e implantes" },
                  { n: "Gabinete 3 — Norte", e: "Estética" },
                  { n: "Gabinete 4 — Sur", e: "Odontopediatría" },
                ].map((g) => (
                  <div key={g.n} className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{g.n}</p>
                      <p className="text-xs text-muted-foreground">{g.e}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integraciones" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "WhatsApp Business API", s: "Conectado" },
              { n: "Pasarela de pagos", s: "Conectado" },
              { n: "Facturación electrónica", s: "Conectado" },
              { n: "Google Calendar", s: "Desconectado" },
              { n: "Radiología digital (DICOM)", s: "Conectado" },
              { n: "Contabilidad externa", s: "Desconectado" },
            ].map((i) => (
              <Card key={i.n} className="shadow-soft">
                <CardContent className="flex items-center justify-between gap-3 p-5">
                  <div className="flex items-start gap-3">
                    <Plug className="mt-0.5 size-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">{i.n}</p>
                      <p className="text-xs text-muted-foreground">{i.s}</p>
                    </div>
                  </div>
                  <Button size="sm" variant={i.s === "Conectado" ? "ghost" : "secondary"} onClick={() => toast.info("Gestionar integración")}>
                    {i.s === "Conectado" ? "Configurar" : "Conectar"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seguridad" className="mt-4">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="size-4 text-success" /> Seguridad y respaldos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { n: "Doble factor obligatorio", d: "Para todos los roles administrativos", on: true },
                  { n: "Cierre de sesión automático", d: "Tras 30 minutos de inactividad", on: true },
                  { n: "Copias de respaldo diarias", d: "Retención de 90 días", on: true },
                  { n: "Restricción por IP", d: "Solo redes de la clínica", on: false },
                ].map((s) => (
                  <div key={s.n} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{s.n}</p>
                      <p className="text-xs text-muted-foreground">{s.d}</p>
                    </div>
                    <Switch defaultChecked={s.on} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Auditoría de actividad</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  { u: "Recepción Centro", a: "Reprogramó la cita de Elena Cruz", t: "hace 12 min" },
                  { u: "Dr. Martín Salas", a: "Firmó la evolución del paciente Sofía Marín", t: "hace 1 h" },
                  { u: "Contabilidad", a: "Exportó el reporte de facturación de julio", t: "hace 3 h" },
                  { u: "Administrador", a: "Activó el módulo de marketing en Clínica Sur", t: "ayer" },
                ].map((l) => (
                  <div key={l.a} className="rounded-xl border border-border p-3">
                    <p className="font-medium">{l.u}</p>
                    <p className="text-xs text-muted-foreground">{l.a} · {l.t}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
