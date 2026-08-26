import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { initialEmployees, initials, orgChart } from "@/data/rrhh-demo";

function NodeCard({ employeeId }: { employeeId: number }) {
  const employee = initialEmployees.find((e) => e.id === employeeId);
  if (!employee) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2 shadow-soft">
      <Avatar className="size-8">
        <AvatarFallback className="bg-primary-soft text-xs text-primary">
          {initials(employee.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{employee.name}</p>
        <p className="truncate text-xs text-muted-foreground">{employee.role}</p>
      </div>
    </div>
  );
}

export default function OrganigramaTab() {
  const roots = orgChart.filter((n) => n.managerId === null);
  const childrenOf = (managerId: number) =>
    orgChart.filter((n) => n.managerId === managerId);

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Organigrama</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Estructura jerárquica del equipo por reporte directo.
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="flex min-w-max flex-col items-center gap-8 py-4">
          {roots.map((root) => (
            <div key={root.employeeId} className="flex flex-col items-center">
              <NodeCard employeeId={root.employeeId} />
              {childrenOf(root.employeeId).length > 0 && (
                <>
                  <div className="h-6 w-px bg-border" />
                  <div className="flex gap-8">
                    {childrenOf(root.employeeId).map((child) => (
                      <div key={child.employeeId} className="flex flex-col items-center">
                        <NodeCard employeeId={child.employeeId} />
                        {childrenOf(child.employeeId).length > 0 && (
                          <>
                            <div className="h-6 w-px bg-border" />
                            <div className="flex gap-6">
                              {childrenOf(child.employeeId).map((grandchild) => (
                                <NodeCard key={grandchild.employeeId} employeeId={grandchild.employeeId} />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}