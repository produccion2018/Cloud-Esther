import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  FileSignature,
  ImagePlus,
  Send,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency } from "@/data/demo";

export const Route = createFileRoute("/app/clinica")({
  component: ClinicalPage,
});

const upper = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const toothState: Record<number, "sano" | "caries" | "obturado" | "ausente" | "implante" | "corona"> = {
  16: "obturado",
  26: "caries",
  36: "corona",
  46: "implante",
  38: "ausente",
  11: "obturado",
  24: "caries",
};

const stateStyles: Record<string, string> = {
  sano: "border-border bg-card text-muted-foreground",
  caries: "border-destructive/40 bg-destructive/10 text-destructive",
  obturado: "border-primary/40 bg-primary-soft text-primary",
  corona: "border-warning/50 bg-warning/15 text-warning-foreground",
  implante: "border-success/40 bg-success-soft text-success",
  ausente: "border-border bg-muted text-muted-foreground line-through",
};

function Tooth({ n }: { n: number }) {
  const state = toothState[n] ?? "sano";
  return (
    <button
      type="button"
      onClick={() => toast.info(`Pieza ${n}: ${state}`)}
      className={`flex h-12 w-9 flex-col items-center justify-center rounded-md border text-[10px] font-semibold transition-transform hover:scale-105 ${stateStyles[state]}`}
      aria-label={`Pieza ${n}, estado ${state}`}
    >
      <span className="text-xs">{n}</span>
    </button>
  );
}

function ClinicalPage() {
  const [note, setNote] = useState("");

  return (
    <>
      <PageHeader
        title="Gestión clínica"
        description="Odontograma, diagnósticos, evoluciones, planes de tratamiento y presupuestos de Sofía Marín."
        badge="Implante 46"
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Archivo adjuntado a la historia clínica.")}>
              <ImagePlus className="size-4" /> Adjuntar radiografía
            </Button>
            <Button className="gap-2" onClick={() => toast.success("Plan enviado al paciente para su aprobación.")}>
              <Send className="size-4" /> Enviar tratamiento al paciente
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="shadow-soft xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="size-4 text-primary" /> Odontograma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 overflow-x-auto">
              <div className="flex min-w-[620px] justify-center gap-1.5">
                {upper.map((n) => <Tooth key={n} n={n} />)}
              </div>
              <div className="flex min-w-[620px] justify-center gap-1.5">
                {lower.map((n) => <Tooth key={n} n={n} />)}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {Object.keys(stateStyles).map((s) => (
                <span key={s} className={`rounded-full border px-2.5 py-1 capitalize ${stateStyles[s]}`}>
                  {s}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Progreso del tratamiento</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { f: "Fase 1 · Diagnóstico y estudio", v: 100 },
              { f: "Fase 2 · Cirugía de implante", v: 70 },
              { f: "Fase 3 · Corona definitiva", v: 15 },
              { f: "Fase 4 · Mantenimiento", v: 0 },
            ].map((p) => (
              <div key={p.f}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{p.f}</span>
                  <span className="text-muted-foreground">{p.v}%</span>
                </div>
                <Progress value={p.v} className="mt-2" />
              </div>
            ))}
            <div className="rounded-xl bg-success-soft p-3 text-sm text-success">
              <CheckCircle2 className="mb-1 size-4" />
              Presupuesto aprobado digitalmente el 04/08/2026 con firma electrónica.
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="diagnosticos" className="mt-5">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="diagnosticos">Diagnósticos</TabsTrigger>
          <TabsTrigger value="evoluciones">Evoluciones</TabsTrigger>
          <TabsTrigger value="plan">Plan de tratamiento</TabsTrigger>
          <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnosticos" className="mt-4">
          <Card className="shadow-soft">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pieza</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Odontólogo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { p: "46", d: "Ausencia dentaria — indicación de implante", o: "Dr. Martín Salas", f: "12/06/2026", e: "En tratamiento" },
                    { p: "26", d: "Caries oclusal profunda", o: "Dra. Camila Ríos", f: "12/06/2026", e: "Pendiente" },
                    { p: "24", d: "Caries interproximal", o: "Dra. Camila Ríos", f: "12/06/2026", e: "Pendiente" },
                    { p: "36", d: "Corona metal-cerámica en buen estado", o: "Dr. Martín Salas", f: "12/06/2026", e: "Control" },
                  ].map((r) => (
                    <TableRow key={r.p}>
                      <TableCell className="font-semibold">{r.p}</TableCell>
                      <TableCell>{r.d}</TableCell>
                      <TableCell className="text-muted-foreground">{r.o}</TableCell>
                      <TableCell className="text-muted-foreground">{r.f}</TableCell>
                      <TableCell><Badge variant="outline">{r.e}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evoluciones" className="mt-4 space-y-4">
          <Card className="shadow-soft">
            <CardContent className="space-y-4 p-6">
              {[
                { f: "04/08/2026", o: "Dr. Martín Salas", t: "Colocación de implante 46. Sin complicaciones. Se indica amoxicilina 875 mg cada 12 h por 7 días y control en 10 días." },
                { f: "22/07/2026", o: "Dra. Lucía Ferrer", t: "Profilaxis completa y revisión periodontal. Índice de placa 18 %." },
                { f: "12/06/2026", o: "Dr. Martín Salas", t: "Estudio radiográfico y planificación quirúrgica con guía." },
              ].map((e) => (
                <div key={e.f} className="border-l-2 border-primary/40 pl-4">
                  <p className="text-sm font-semibold">{e.f} · {e.o}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.t}</p>
                </div>
              ))}
              <div className="pt-2">
                <Textarea
                  rows={3}
                  placeholder="Añadir nueva evolución clínica…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button
                  className="mt-3"
                  disabled={note.trim().length === 0}
                  onClick={() => { setNote(""); toast.success("Evolución registrada en la historia clínica."); }}
                >
                  Guardar evolución
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="mt-4">
          <Card className="shadow-soft">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fase</TableHead>
                    <TableHead>Procedimiento</TableHead>
                    <TableHead>Sesiones</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { fa: "1", p: "Estudio radiográfico y planificación", s: "1", i: 120, e: "Completado" },
                    { fa: "2", p: "Cirugía de implante 46", s: "1", i: 980, e: "En curso" },
                    { fa: "3", p: "Corona sobre implante", s: "2", i: 720, e: "Programado" },
                    { fa: "4", p: "Obturaciones 26 y 24", s: "2", i: 180, e: "Programado" },
                  ].map((r) => (
                    <TableRow key={r.fa}>
                      <TableCell className="font-semibold">{r.fa}</TableCell>
                      <TableCell>{r.p}</TableCell>
                      <TableCell className="text-muted-foreground">{r.s}</TableCell>
                      <TableCell className="font-medium">{currency(r.i)}</TableCell>
                      <TableCell><Badge variant="secondary">{r.e}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presupuesto" className="mt-4">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Presupuesto P-2026-0117</p>
                  <p className="font-display text-3xl font-bold">{currency(2000)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Financiable en 12 cuotas de {currency(167)} sin intereses.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-2" onClick={() => toast.success("Presupuesto enviado por WhatsApp.")}>
                    <Send className="size-4" /> Enviar al paciente
                  </Button>
                  <Button className="gap-2" onClick={() => toast.success("Firma electrónica solicitada.")}>
                    <FileSignature className="size-4" /> Solicitar firma
                  </Button>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-success/30 bg-success-soft p-4 text-sm text-success">
                Aprobado digitalmente por la paciente el 04/08/2026 · IP registrada · Firma
                electrónica avanzada almacenada en la historia clínica.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
