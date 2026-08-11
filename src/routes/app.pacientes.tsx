import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  FileText,
  HeartPulse,
  Phone,
  Search,
  Mail,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState, PatientStatusBadge } from "@/components/app/ui-kit";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { branches, currency, dentists, patients, type PatientStatus } from "@/data/demo";

export const Route = createFileRoute("/app/pacientes")({
  component: PatientsPage,
});

const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

function PatientsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todos" | PatientStatus>("todos");
  const [branch, setBranch] = useState("todas");
  const [selected, setSelected] = useState<(typeof patients)[number] | null>(null);

  const filtered = useMemo(
    () =>
      patients.filter(
        (p) =>
          (status === "todos" || p.status === status) &&
          (branch === "todas" || p.branch === branch) &&
          (p.name.toLowerCase().includes(query.toLowerCase()) || p.doc.includes(query)),
      ),
    [query, status, branch],
  );

  return (
    <>
      <PageHeader
        title="Pacientes"
        description="Listado unificado del grupo con ficha clínica completa, documentos y consentimientos."
        badge={`${patients.length} pacientes`}
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Exportando listado…")}>
              <Download className="size-4" /> Exportar
            </Button>
            <Button className="gap-2" onClick={() => toast.info("Formulario de alta de paciente")}>
              <UserPlus className="size-4" /> Nuevo paciente
            </Button>
          </>
        }
      />

      <Card className="mb-5 shadow-soft">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por nombre o documento"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="pendiente">Tratamiento pendiente</SelectItem>
            </SelectContent>
          </Select>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Users}
                title="No encontramos pacientes"
                description="Ajusta la búsqueda o los filtros de estado y sucursal para ver resultados."
                action={<Button variant="outline" onClick={() => { setQuery(""); setStatus("todos"); setBranch("todas"); }}>Limpiar filtros</Button>}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Odontólogo</TableHead>
                    <TableHead>Tratamiento</TableHead>
                    <TableHead>Última visita</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id} className="cursor-pointer" onClick={() => setSelected(p)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-primary-soft text-xs text-primary">
                              {initials(p.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold">{p.name}</p>
                            <p className="text-xs text-muted-foreground">DNI {p.doc}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.phone}</TableCell>
                      <TableCell className="text-sm">{dentists.find((d) => d.id === p.dentist)?.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.treatment}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.lastVisit}</TableCell>
                      <TableCell className="text-sm font-medium">{p.balance ? currency(p.balance) : "—"}</TableCell>
                      <TableCell><PatientStatusBadge status={p.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Ver ficha</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-xl">
          {selected ? (
            <>
              <SheetHeader className="p-0">
                <SheetTitle className="text-xl">{selected.name}</SheetTitle>
                <SheetDescription>
                  DNI {selected.doc} · {branches.find((b) => b.id === selected.branch)?.name}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 flex flex-wrap gap-2">
                <PatientStatusBadge status={selected.status} />
                <Badge variant="outline" className="gap-1"><Phone className="size-3" />{selected.phone}</Badge>
                <Badge variant="outline" className="gap-1"><Mail className="size-3" />{selected.email}</Badge>
              </div>

              <Tabs defaultValue="datos" className="mt-6">
                <TabsList className="flex w-full flex-wrap">
                  <TabsTrigger value="datos">Datos</TabsTrigger>
                  <TabsTrigger value="citas">Citas</TabsTrigger>
                  <TabsTrigger value="tratamientos">Tratamientos</TabsTrigger>
                  <TabsTrigger value="documentos">Documentos</TabsTrigger>
                  <TabsTrigger value="notas">Notas</TabsTrigger>
                </TabsList>

                <TabsContent value="datos" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Datos personales</CardTitle></CardHeader>
                    <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                      <Info label="Fecha de nacimiento" value="14/03/1989" />
                      <Info label="Dirección" value="C/ Mayor 118, 3º B" />
                      <Info label="Aseguradora" value="Sanitas Dental" />
                      <Info label="Odontólogo asignado" value={dentists.find((d) => d.id === selected.dentist)?.name ?? "—"} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <HeartPulse className="size-4 text-destructive" /> Antecedentes médicos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {["Alergia a penicilina", "Hipertensión controlada", "Bruxismo", "No fumador"].map((a) => (
                        <Badge key={a} variant="secondary">{a}</Badge>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="citas" className="mt-4 space-y-2">
                  {[
                    { d: "11/08/2026", t: "Control de tratamiento", s: "Confirmada" },
                    { d: "22/07/2026", t: "Limpieza y profilaxis", s: "Atendida" },
                    { d: "03/06/2026", t: "Radiografía panorámica", s: "Atendida" },
                  ].map((c) => (
                    <div key={c.d} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                      <div>
                        <p className="font-medium">{c.t}</p>
                        <p className="text-xs text-muted-foreground">{c.d}</p>
                      </div>
                      <Badge variant="outline">{c.s}</Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="tratamientos" className="mt-4 space-y-2">
                  {[
                    { n: selected.treatment, e: "En curso", p: "3 de 6 sesiones" },
                    { n: "Higiene anual", e: "Completado", p: "1 de 1" },
                  ].map((t) => (
                    <div key={t.n} className="rounded-xl border border-border p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{t.n}</p>
                        <Badge variant="secondary">{t.e}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{t.p}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="documentos" className="mt-4 space-y-2">
                  {[
                    "Radiografía panorámica 06/2026.jpg",
                    "Fotografías intraorales 06/2026.zip",
                    "Consentimiento implantología (firmado).pdf",
                    "Presupuesto aprobado F-2026-0480.pdf",
                  ].map((f) => (
                    <div key={f} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                      <span className="flex items-center gap-2"><FileText className="size-4 text-primary" /> {f}</span>
                      <Button size="sm" variant="ghost">Descargar</Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="notas" className="mt-4">
                  <div className="rounded-xl border border-border p-4 text-sm">
                    <p className="text-muted-foreground">
                      Paciente ansioso ante intervenciones largas: programar sesiones cortas y avisar
                      con recordatorio adicional 2 h antes.
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">Dra. Lucía Ferrer · 22/07/2026</p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
