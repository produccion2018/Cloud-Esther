import { useState } from "react";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  initialEmployees,
  initialPerformanceReviews,
  initials,
} from "@/data/rrhh-demo";

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{score.toFixed(1)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${(score / 5) * 100}%` }} />
      </div>
    </div>
  );
}

export default function EvaluacionTab() {
  const [employeeFilter, setEmployeeFilter] = useState("todos");

  const reviews = initialPerformanceReviews.filter(
    (r) => employeeFilter === "todos" || String(r.employeeId) === employeeFilter,
  );

  const average =
    initialPerformanceReviews.reduce((sum, r) => sum + r.overallScore, 0) /
    Math.max(1, initialPerformanceReviews.length);

  return (
    <div className="space-y-4">
      <Card className="shadow-soft">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-xs text-muted-foreground">Promedio general del equipo</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold">{average.toFixed(1)}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`size-4 ${n <= Math.round(average) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los empleados</SelectItem>
              {initialEmployees.map((e) => (
                <SelectItem key={e.id} value={String(e.id)}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {reviews.map((review) => {
          const employee = initialEmployees.find((e) => e.id === review.employeeId);
          return (
            <Card key={review.id} className="shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-primary-soft text-primary">
                        {initials(employee?.name ?? "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{employee?.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{review.period} · {employee?.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{review.overallScore.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">general</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2.5">
                  {review.competencies.map((c) => (
                    <ScoreBar key={c.name} label={c.name} score={c.score} />
                  ))}
                </div>
                <div className="grid gap-2 rounded-xl bg-muted/50 p-3 text-xs">
                  <p><span className="font-semibold">Fortalezas:</span> {review.strengths}</p>
                  <p><span className="font-semibold">A mejorar:</span> {review.improvementAreas}</p>
                </div>
                <p className="text-right text-xs text-muted-foreground">
                  Evaluado por {review.reviewer} · {review.reviewedAt}
                </p>
              </CardContent>
            </Card>
          );
        })}
        {!reviews.length && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            Sin evaluaciones para este filtro.
          </p>
        )}
      </div>
    </div>
  );
}