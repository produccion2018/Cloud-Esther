import { useState } from "react";
import { Save, Settings2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { initialHrSettings } from "@/data/rrhh-demo";

export default function ConfiguracionTab() {
  const [settings, setSettings] = useState(initialHrSettings);

  const save = () => {
    toast.success("Configuración de RR.HH. guardada.");
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Settings2 className="size-5" />
          </div>
          <div>
            <CardTitle>Configuración de RR.HH.</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Parámetros generales que aplican a todo el módulo.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Días de vacaciones por año (base)</Label>
            <Input
              type="number"
              value={settings.vacationDaysPerYear}
              onChange={(e) => setSettings((s) => ({ ...s, vacationDaysPerYear: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Aviso de renovación de contrato (días)</Label>
            <Input
              type="number"
              value={settings.contractRenewalNoticeDays}
              onChange={(e) => setSettings((s) => ({ ...s, contractRenewalNoticeDays: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Horas semanales de jornada completa</Label>
            <Input
              type="number"
              value={settings.workWeekHours}
              onChange={(e) => setSettings((s) => ({ ...s, workWeekHours: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Inicio del año fiscal</Label>
            <Input
              value={settings.fiscalYearStartMonth}
              onChange={(e) => setSettings((s) => ({ ...s, fiscalYearStartMonth: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          <SettingRow
            label="Requerir aprobación de documentos cargados"
            checked={settings.requireDocumentApproval}
            onChange={(v) => setSettings((s) => ({ ...s, requireDocumentApproval: v }))}
          />
          <SettingRow
            label="Notificar vencimientos de contratos"
            checked={settings.notifyOnContractExpiry}
            onChange={(v) => setSettings((s) => ({ ...s, notifyOnContractExpiry: v }))}
          />
          <SettingRow
            label="Notificar vencimientos de documentación"
            checked={settings.notifyOnDocumentExpiry}
            onChange={(v) => setSettings((s) => ({ ...s, notifyOnDocumentExpiry: v }))}
          />
        </div>

        <div className="flex justify-end border-t pt-4">
          <Button onClick={save}>
            <Save className="mr-2 size-4" /> Guardar configuración
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}