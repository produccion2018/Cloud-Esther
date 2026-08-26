import { Briefcase, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { jobPositions, money } from "@/data/rrhh-demo";

const levelColor: Record<string, string> = {
  Junior: "border-emerald-500/30 text-emerald-600",
  "Semi-senior": "border-blue-500/30 text-blue-600",
  Senior: "border-violet-500/30 text-violet-600",
  Jefatura: "border-amber-500/30 text-amber-600",
  Dirección: "border-destructive/30 text-destructive",
};

export default function MatrizPuestosTab() {
  const totalHeadcount = jobPositions.reduce((sum, p) => sum + p.headcount, 0);
  const totalFilled = jobPositions.reduce((sum, p) => sum + p.filled, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-soft">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs text-muted-foreground">Dotación total planificada</p>
              <p className="mt-1 text-2xl font-bold">{totalHeadcount} puestos</p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Briefcase className="size-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs text-muted-foreground">Puestos cubiertos</p>
              <p className="mt-1 text-2xl font-bold">{totalFilled}/{totalHeadcount}</p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Users className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Matriz de puestos y roles</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Perfiles definidos, requisitos y bandas salariales por puesto.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobPositions.map((position) => (
            <div key={position.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{position.title}</p>
                  <p className="text-sm text-muted-foreground">{position.department}</p>
                </div>
                <Badge variant="outline" className={levelColor[position.level]}>
                  {position.level}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {position.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs font-normal">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-sm">
                <span>
                  Cobertura: <span className="font-semibold">{position.filled}/{position.headcount}</span>
                </span>
                <span className="text-muted-foreground">
                  {money(position.salaryRangeMin)} – {money(position.salaryRangeMax)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}