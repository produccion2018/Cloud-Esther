import { useMemo, useState } from "react";
import { AlertTriangle, FileSignature, Search } from "lucide-react";
import { toast } from "sonner";

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
  initialContracts,
  initialEmployees,
  initials,
  money,
  type ContractStatus,
} from "@/data/rrhh-demo";

function statusVariant(status: ContractStatus): "default" | "outline" | "destructive" | "secondary" {
  switch (status) {
    case "Vigente": return "default";
    case "Por renovar": return "outline";
    case "Vencido": return "destructive";
    default: return "secondary";
  }
}

export default function ContratosTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const rows = useMemo(() => {
    return initialContracts
      .map((contract) => ({
        contract,
        employee: initialEmployees.find((e) => e.id === contract.employeeId)!,
      }))
      .filter(({ employee, contract }) => {
        const matchesSearch = !search || employee.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "todos" || contract.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [search, statusFilter]);

  const toRenew = initialContracts.filter((c) => c.status === "Por renovar").length;

  return (
    <div className="space-y-4">
      {toRenew > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4">
          <AlertTriangle className="size-5 shrink-0 text-warning" />
          <p className="text-sm">
            <span className="font-semibold">{toRenew} contrato{toRenew === 1 ? "" : "s"}</span>{" "}
            {toRenew === 1 ? "está" : "están"} próximo{toRenew === 1 ? "" : "s"} a vencer y requiere{toRenew === 1 ? "" : "n"} renovación.
          </p>
        </div>
      )}

      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Contratos</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Modalidad, vigencia, cláusulas y vencimientos por empleado.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar empleado..."
                  className="pl-9 sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Vigente">Vigentes</SelectItem>
                  <SelectItem value="Por renovar">Por renovar</SelectItem>
                  <SelectItem value="Vencido">Vencidos</SelectItem>
                  <SelectItem value="Finalizado">Finalizados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map(({ contract, employee }) => (
            <div
              key={contract.id}
              className="flex flex-col gap-4 rounded-2xl border p-4 lg:flex-row lg:items-center"
            >
              <Avatar className="size-10 shrink-0">
                <AvatarFallback className="bg-primary-soft text-primary">
                  {initials(employee.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{employee.name}</p>
                <p className="text-sm text-muted-foreground">
                  {contract.contractType} · {employee.role}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vigencia</p>
                <p className="text-sm font-medium">
                  {contract.startDate} → {contract.endDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Salario base</p>
                <p className="text-sm font-semibold">{money(contract.baseSalary)}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {contract.clauses.map((clause) => (
                  <Badge key={clause} variant="outline" className="text-xs font-normal">
                    {clause}
                  </Badge>
                ))}
              </div>
              <Badge variant={statusVariant(contract.status)}>{contract.status}</Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toast.info(`Vista del contrato de ${employee.name}.`)}
              >
                <FileSignature className="mr-2 size-4" /> Ver
              </Button>
            </div>
          ))}
          {!rows.length && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No hay contratos que coincidan con esos filtros.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}