import { Building2, Phone, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  initialBranches,
  initialDepartments,
  initialEmployees,
  initials,
} from "@/data/rrhh-demo";

export default function SucursalesTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {initialBranches.map((branch) => {
          const branchEmployees = initialEmployees.filter((e) => e.branch === branch.name);
          const departments = initialDepartments.filter((d) => d.branchName === branch.name);
          return (
            <Card key={branch.id} className="shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{branch.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{branch.address}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="size-3" /> {branch.phone}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    <Users className="mr-1 size-3" /> {branchEmployees.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {departments.map((dept) => {
                  const head = initialEmployees.find((e) => e.id === dept.headEmployeeId);
                  const deptEmployees = branchEmployees.filter((e) => e.area === dept.name);
                  return (
                    <div key={dept.id} className="rounded-xl border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{dept.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {deptEmployees.length} persona{deptEmployees.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {head ? (
                          <>
                            <Avatar className="size-6">
                              <AvatarFallback className="bg-primary-soft text-[10px] text-primary">
                                {initials(head.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              Responsable: {head.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sin responsable asignado</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}