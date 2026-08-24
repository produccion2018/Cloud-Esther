import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Check,
  CreditCard,
  FileText,
  Filter,
  Plus,
  Receipt,
  Search,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/DashboardShell";
import { StatCard } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { addOns, currency, moduleNameByKey, plans } from "@/data/demo";
import { getAccount } from "@/lib/account";

export const Route = createFileRoute("/app/finanzas")({
  component: FinanzasPage,
});

type InvoiceStatus =
  | "Borrador"
  | "Pendiente"
  | "Pagada"
  | "Vencida"
  | "Anulada";

type BudgetStatus =
  | "Borrador"
  | "Enviado"
  | "Aprobado"
  | "Rechazado"
  | "Convertido";

type CashType = "Ingreso" | "Egreso";

type Invoice = {
  id: string;
  patient: string;
  concept: string;
  amount: number;
  method: string;
  date: string;
  status: InvoiceStatus;
};

type Budget = {
  id: string;
  patient: string;
  treatment: string;
  amount: number;
  date: string;
  validUntil: string;
  status: BudgetStatus;
};

type CashMovement = {
  id: string;
  type: CashType;
  concept: string;
  amount: number;
  method: string;
  date: string;
};

type PaymentMethod = {
  id: string;
  name: string;
  detail: string;
  active: boolean;
  default: boolean;
};

const initialInvoices: Invoice[] = [
  {
    id: "FAC-0001",
    patient: "María González",
    concept: "Limpieza + consulta",
    amount: 85000,
    method: "Transferencia",
    date: "2026-08-21",
    status: "Pagada",
  },
  {
    id: "FAC-0002",
    patient: "Carlos Rodríguez",
    concept: "Restauración dental",
    amount: 145000,
    method: "Tarjeta",
    date: "2026-08-20",
    status: "Pendiente",
  },
  {
    id: "FAC-0003",
    patient: "Laura Martínez",
    concept: "Ortodoncia",
    amount: 210000,
    method: "Transferencia",
    date: "2026-08-18",
    status: "Vencida",
  },
];

const initialBudgets: Budget[] = [
  {
    id: "PRE-0001",
    patient: "Juan Pérez",
    treatment: "Implante dental",
    amount: 580000,
    date: "2026-08-19",
    validUntil: "2026-09-19",
    status: "Enviado",
  },
  {
    id: "PRE-0002",
    patient: "Ana López",
    treatment: "Ortodoncia completa",
    amount: 1250000,
    date: "2026-08-17",
    validUntil: "2026-09-17",
    status: "Aprobado",
  },
];

const initialCash: CashMovement[] = [
  {
    id: "MOV-001",
    type: "Ingreso",
    concept: "Cobro paciente",
    amount: 85000,
    method: "Transferencia",
    date: "2026-08-21",
  },
  {
    id: "MOV-002",
    type: "Ingreso",
    concept: "Cobro consulta",
    amount: 45000,
    method: "Efectivo",
    date: "2026-08-21",
  },
  {
    id: "MOV-003",
    type: "Egreso",
    concept: "Compra de insumos",
    amount: 32000,
    method: "Transferencia",
    date: "2026-08-20",
  },
];

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "pm1",
    name: "Transferencia bancaria",
    detail: "Cuenta principal",
    active: true,
    default: true,
  },
  {
    id: "pm2",
    name: "Efectivo",
    detail: "Caja clínica",
    active: true,
    default: false,
  },
  {
    id: "pm3",
    name: "Tarjeta",
    detail: "Terminal de cobro",
    active: true,
    default: false,
  },
];

const invoiceStatusVariant = (status: InvoiceStatus) => {
  if (status === "Pagada") return "secondary" as const;
  if (status === "Vencida") return "destructive" as const;
  return "outline" as const;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function FinanzasPage() {
  const account = getAccount();
  const currentPlan =
    plans.find((p) => p.id === account?.planId) ?? plans[0]!;

  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [cashMovements, setCashMovements] =
    useState<CashMovement[]>(initialCash);
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(initialPaymentMethods);

  const [invoiceDialog, setInvoiceDialog] = useState(false);
  const [budgetDialog, setBudgetDialog] = useState(false);
  const [cashDialog, setCashDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState<Invoice | null>(null);
  const [budgetDetail, setBudgetDetail] = useState<Budget | null>(null);

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [budgetSearch, setBudgetSearch] = useState("");
  const [invoiceFilter, setInvoiceFilter] =
    useState<InvoiceStatus | "Todos">("Todos");
  const [cashFilter, setCashFilter] =
    useState<CashType | "Todos">("Todos");

  const [autoRenew, setAutoRenew] = useState(true);
  const [enabledAddOns, setEnabledAddOns] = useState<string[]>([]);

  const totalInvoiced = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status !== "Anulada")
        .reduce((sum, invoice) => sum + invoice.amount, 0),
    [invoices],
  );

  const totalCollected = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status === "Pagada")
        .reduce((sum, invoice) => sum + invoice.amount, 0),
    [invoices],
  );

  const totalPending = useMemo(
    () =>
      invoices
        .filter(
          (invoice) =>
            invoice.status === "Pendiente" ||
            invoice.status === "Vencida",
        )
        .reduce((sum, invoice) => sum + invoice.amount, 0),
    [invoices],
  );

  const totalOverdue = useMemo(
    () =>
      invoices
        .filter((invoice) => invoice.status === "Vencida")
        .reduce((sum, invoice) => sum + invoice.amount, 0),
    [invoices],
  );

  const cashBalance = useMemo(
    () =>
      cashMovements.reduce(
        (sum, movement) =>
          movement.type === "Ingreso"
            ? sum + movement.amount
            : sum - movement.amount,
        0,
      ),
    [cashMovements],
  );

  const filteredInvoices = useMemo(() => {
    const search = invoiceSearch.toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.patient.toLowerCase().includes(search) ||
        invoice.concept.toLowerCase().includes(search) ||
        invoice.id.toLowerCase().includes(search);

      const matchesStatus =
        invoiceFilter === "Todos" ||
        invoice.status === invoiceFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, invoiceSearch, invoiceFilter]);

  const filteredBudgets = useMemo(() => {
    const search = budgetSearch.toLowerCase();

    return budgets.filter(
      (budget) =>
        budget.patient.toLowerCase().includes(search) ||
        budget.treatment.toLowerCase().includes(search) ||
        budget.id.toLowerCase().includes(search),
    );
  }, [budgets, budgetSearch]);

  const filteredCash = useMemo(() => {
    if (cashFilter === "Todos") return cashMovements;
    return cashMovements.filter(
      (movement) => movement.type === cashFilter,
    );
  }, [cashMovements, cashFilter]);

  function createInvoice(formData: FormData) {
    const patient = String(formData.get("patient") ?? "").trim();
    const concept = String(formData.get("concept") ?? "").trim();
    const amount = Number(formData.get("amount") ?? 0);
    const method = String(formData.get("method") ?? "").trim();
    const status =
      (String(formData.get("status") ?? "Pendiente") as InvoiceStatus);

    if (!patient || !concept || !amount || !method) {
      toast.error("Completá paciente, concepto, importe y método de pago.");
      return;
    }

    const invoice: Invoice = {
      id: `FAC-${String(invoices.length + 1).padStart(4, "0")}`,
      patient,
      concept,
      amount,
      method,
      date: new Date().toISOString().slice(0, 10),
      status,
    };

    setInvoices((current) => [invoice, ...current]);
    setInvoiceDialog(false);
    toast.success("Comprobante creado.");
  }

  function createBudget(formData: FormData) {
    const patient = String(formData.get("patient") ?? "").trim();
    const treatment = String(formData.get("treatment") ?? "").trim();
    const amount = Number(formData.get("amount") ?? 0);
    const validUntil = String(formData.get("validUntil") ?? "");

    if (!patient || !treatment || !amount || !validUntil) {
      toast.error("Completá todos los campos del presupuesto.");
      return;
    }

    const budget: Budget = {
      id: `PRE-${String(budgets.length + 1).padStart(4, "0")}`,
      patient,
      treatment,
      amount,
      date: new Date().toISOString().slice(0, 10),
      validUntil,
      status: "Borrador",
    };

    setBudgets((current) => [budget, ...current]);
    setBudgetDialog(false);
    toast.success("Presupuesto creado.");
  }

  function createCashMovement(formData: FormData) {
    const type = String(formData.get("type")) as CashType;
    const concept = String(formData.get("concept") ?? "").trim();
    const amount = Number(formData.get("amount") ?? 0);
    const method = String(formData.get("method") ?? "").trim();

    if (!concept || !amount || !method) {
      toast.error("Completá concepto, importe y método.");
      return;
    }

    const movement: CashMovement = {
      id: `MOV-${String(cashMovements.length + 1).padStart(3, "0")}`,
      type,
      concept,
      amount,
      method,
      date: new Date().toISOString().slice(0, 10),
    };

    setCashMovements((current) => [movement, ...current]);
    setCashDialog(false);
    toast.success(
      type === "Ingreso"
        ? "Ingreso registrado."
        : "Egreso registrado.",
    );
  }

  function addPaymentMethod(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const detail = String(formData.get("detail") ?? "").trim();

    if (!name || !detail) {
      toast.error("Completá nombre y detalle.");
      return;
    }

    const method: PaymentMethod = {
      id: crypto.randomUUID(),
      name,
      detail,
      active: true,
      default: paymentMethods.length === 0,
    };

    setPaymentMethods((current) => [...current, method]);
    setPaymentDialog(false);
    toast.success("Método de pago agregado.");
  }

  function markInvoiceAsPaid(id: string) {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === id
          ? { ...invoice, status: "Pagada" }
          : invoice,
      ),
    );

    toast.success("Comprobante marcado como pagado.");
  }

  function updateBudgetStatus(id: string, status: BudgetStatus) {
    setBudgets((current) =>
      current.map((budget) =>
        budget.id === id ? { ...budget, status } : budget,
      ),
    );

    toast.success(`Presupuesto marcado como ${status.toLowerCase()}.`);
  }

  function toggleAddOn(name: string) {
    setEnabledAddOns((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );

    toast.success(
      enabledAddOns.includes(name)
        ? `${name} quitado.`
        : `${name} añadido.`,
    );
  }

  return (
    <>
      <PageHeader
        title="Finanzas"
        description="Facturación, presupuestos y caja diaria de la clínica, consolidados por sucursal."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setCashDialog(true)}
            >
              <Wallet className="size-4" />
              Movimiento
            </Button>

            <Button
              className="gap-2"
              onClick={() => setInvoiceDialog(true)}
            >
              <Plus className="size-4" />
              Nuevo comprobante
            </Button>
          </div>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Facturado"
          value={formatMoney(totalInvoiced)}
          icon={Receipt}
          hint={`${invoices.length} comprobantes`}
        />

        <StatCard
          label="Cobrado"
          value={formatMoney(totalCollected)}
          icon={Wallet}
          hint="Comprobantes pagados"
          tone="success"
        />

        <StatCard
          label="Pendiente"
          value={formatMoney(totalPending)}
          icon={CreditCard}
          hint="Pendiente + vencido"
          tone="warning"
        />

        <StatCard
          label="Vencido"
          value={formatMoney(totalOverdue)}
          icon={CreditCard}
          hint="Requiere seguimiento"
        />

        <StatCard
          label="Saldo de caja"
          value={formatMoney(cashBalance)}
          icon={Wallet}
          hint={`${cashMovements.length} movimientos`}
        />
      </div>

      <Tabs defaultValue="facturacion" className="mt-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="facturacion">
            Facturación
          </TabsTrigger>
          <TabsTrigger value="presupuestos">
            Presupuestos
          </TabsTrigger>
          <TabsTrigger value="caja">
            Caja / Finanzas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="facturacion" className="mt-4">
          <Tabs defaultValue="facturas">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="facturas">Facturas</TabsTrigger>
              <TabsTrigger value="suscripcion">
                Suscripción
              </TabsTrigger>
              <TabsTrigger value="modulos">Módulos</TabsTrigger>
              <TabsTrigger value="metodos">
                Métodos de pago
              </TabsTrigger>
            </TabsList>

            <TabsContent value="facturas" className="mt-4">
              <Card className="ce-card-hover shadow-soft">
                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-base">
                    Comprobantes
                  </CardTitle>

                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Buscar..."
                        value={invoiceSearch}
                        onChange={(e) =>
                          setInvoiceSearch(e.target.value)
                        }
                      />
                    </div>

                    <select
                      value={invoiceFilter}
                      onChange={(e) =>
                        setInvoiceFilter(
                          e.target.value as
                            | InvoiceStatus
                            | "Todos",
                        )
                      }
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option>Todos</option>
                      <option>Pagada</option>
                      <option>Pendiente</option>
                      <option>Vencida</option>
                      <option>Borrador</option>
                      <option>Anulada</option>
                    </select>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {filteredInvoices.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-8 text-center">
                      <Filter className="mx-auto size-8 text-primary/60" />
                      <p className="mt-3 font-semibold">
                        No hay comprobantes
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Probá modificar los filtros o crear un comprobante.
                      </p>
                    </div>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex flex-col gap-4 rounded-xl border border-border p-4 transition hover:border-primary/40 hover:shadow-sm md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Receipt className="size-5" />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold">
                                {invoice.id}
                              </p>

                              <Badge
                                variant={invoiceStatusVariant(
                                  invoice.status,
                                )}
                              >
                                {invoice.status}
                              </Badge>
                            </div>

                            <p className="mt-1 text-sm">
                              {invoice.patient}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {invoice.concept} · {invoice.date} ·{" "}
                              {invoice.method}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">
                            {formatMoney(invoice.amount)}
                          </span>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setInvoiceDetail(invoice)
                            }
                          >
                            Ver
                          </Button>

                          {invoice.status !== "Pagada" &&
                          invoice.status !== "Anulada" ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                markInvoiceAsPaid(invoice.id)
                              }
                            >
                              Marcar pagada
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suscripcion" className="mt-4">
              <div className="grid gap-5 lg:grid-cols-3">
                <Card className="ce-card-hover shadow-soft lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Tu membresía
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary-soft p-5">
                      <div>
                        <Badge className="mb-2">
                          Plan actual
                        </Badge>

                        <p className="font-display text-xl font-bold">
                          {currentPlan.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {currency(currentPlan.monthly)}/mes
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() =>
                          toast.info(
                            "La comparación de planes estará disponible en la configuración de suscripción.",
                          )
                        }
                      >
                        Comparar planes
                      </Button>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-border p-4">
                      <div>
                        <p className="text-sm font-semibold">
                          Renovación automática
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Configuración local de demostración.
                        </p>
                      </div>

                      <Switch
                        checked={autoRenew}
                        onCheckedChange={(value) => {
                          setAutoRenew(value);
                          toast.success(
                            value
                              ? "Renovación automática activada."
                              : "Renovación automática desactivada.",
                          );
                        }}
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        {
                          l: "Sucursales activas",
                          v: currentPlan.branches,
                        },
                        {
                          l: "Usuarios",
                          v: currentPlan.users,
                        },
                        {
                          l: "Módulos activos",
                          v: `${currentPlan.modules.length} incluidos`,
                        },
                      ].map((item) => (
                        <div
                          key={item.l}
                          className="rounded-xl border border-border p-4"
                        >
                          <p className="text-xs text-muted-foreground">
                            {item.l}
                          </p>
                          <p className="mt-1 font-semibold">
                            {item.v}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="ce-card-hover shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Historial de pagos
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="rounded-xl border border-dashed p-6 text-center">
                      <Wallet className="mx-auto size-7 text-primary/60" />
                      <p className="mt-3 text-sm font-semibold">
                        Sin pagos registrados
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Los pagos reales se conectarán posteriormente al sistema
                        de facturación.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="modulos" className="mt-4">
              <Card className="ce-card-hover shadow-soft">
                <CardContent className="divide-y divide-border p-0">
                  {currentPlan.modules.map((module) => (
                    <div
                      key={module}
                      className="flex items-center justify-between gap-4 p-5"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {moduleNameByKey[module]}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Incluido en {currentPlan.name}
                        </p>
                      </div>

                      <Switch
                        defaultChecked
                        onCheckedChange={(checked) =>
                          toast.success(
                            checked
                              ? "Módulo activado en esta sesión."
                              : "Módulo desactivado en esta sesión.",
                          )
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <h3 className="mt-6 text-base font-semibold">
                Extras contratables
              </h3>

              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {addOns.map((addon) => {
                  const enabled = enabledAddOns.includes(addon.name);

                  return (
                    <Card
                      key={addon.name}
                      className="ce-card-hover shadow-soft"
                    >
                      <CardContent className="flex items-center justify-between gap-3 p-5">
                        <div>
                          <p className="text-sm font-semibold">
                            {addon.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {currency(addon.price)} / {addon.unit}
                          </p>
                        </div>

                        <Button
                          size="sm"
                          variant={
                            enabled ? "default" : "secondary"
                          }
                          onClick={() =>
                            toggleAddOn(addon.name)
                          }
                        >
                          {enabled ? (
                            <>
                              <Check className="mr-1 size-4" />
                              Activo
                            </>
                          ) : (
                            "Añadir"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="metodos" className="mt-4">
              <Card className="ce-card-hover shadow-soft">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-base">
                    Métodos de pago
                  </CardTitle>

                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => setPaymentDialog(true)}
                  >
                    <Plus className="size-4" />
                    Agregar
                  </Button>
                </CardHeader>

                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex flex-col gap-3 rounded-xl border border-border p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <CreditCard className="size-5" />
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-2">
                            <p className="font-semibold">
                              {method.name}
                            </p>

                            {method.default ? (
                              <Badge variant="secondary">
                                Predeterminado
                              </Badge>
                            ) : null}
                          </div>

                          <p className="text-xs text-muted-foreground">
                            {method.detail}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            method.active
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {method.active
                            ? "Activo"
                            : "Inactivo"}
                        </Badge>

                        <Switch
                          checked={method.active}
                          onCheckedChange={(checked) =>
                            setPaymentMethods((current) =>
                              current.map((item) =>
                                item.id === method.id
                                  ? {
                                      ...item,
                                      active: checked,
                                    }
                                  : item,
                              ),
                            )
                          }
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setPaymentMethods((current) =>
                              current.filter(
                                (item) =>
                                  item.id !== method.id,
                              ),
                            );
                            toast.success(
                              "Método eliminado.",
                            );
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="presupuestos" className="mt-4">
          <Card className="ce-card-hover shadow-soft">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-base">
                Presupuestos
              </CardTitle>

              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Buscar paciente..."
                    value={budgetSearch}
                    onChange={(e) =>
                      setBudgetSearch(e.target.value)
                    }
                  />
                </div>

                <Button
                  className="gap-2"
                  onClick={() => setBudgetDialog(true)}
                >
                  <Plus className="size-4" />
                  Nuevo presupuesto
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {filteredBudgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex flex-col gap-4 rounded-xl border border-border p-4 transition hover:border-primary/40 hover:shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FileText className="size-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2">
                        <p className="font-semibold">
                          {budget.id}
                        </p>

                        <Badge variant="outline">
                          {budget.status}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm">
                        {budget.patient}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {budget.treatment} · Válido hasta{" "}
                        {budget.validUntil}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">
                      {formatMoney(budget.amount)}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setBudgetDetail(budget)
                      }
                    >
                      Ver
                    </Button>

                    {budget.status === "Borrador" ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateBudgetStatus(
                            budget.id,
                            "Enviado",
                          )
                        }
                      >
                        Enviar
                      </Button>
                    ) : null}

                    {budget.status === "Aprobado" ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          const invoice: Invoice = {
                            id: `FAC-${String(
                              invoices.length + 1,
                            ).padStart(4, "0")}`,
                            patient: budget.patient,
                            concept: budget.treatment,
                            amount: budget.amount,
                            method: "Pendiente",
                            date: new Date()
                              .toISOString()
                              .slice(0, 10),
                            status: "Pendiente",
                          };

                          setInvoices((current) => [
                            invoice,
                            ...current,
                          ]);

                          updateBudgetStatus(
                            budget.id,
                            "Convertido",
                          );

                          toast.success(
                            "Presupuesto convertido en comprobante.",
                          );
                        }}
                      >
                        Convertir en factura
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caja" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="ce-card-hover shadow-soft">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <ArrowUpCircle className="size-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Ingresos
                    </p>
                    <p className="text-xl font-bold">
                      {formatMoney(
                        cashMovements
                          .filter(
                            (movement) =>
                              movement.type === "Ingreso",
                          )
                          .reduce(
                            (sum, movement) =>
                              sum + movement.amount,
                            0,
                          ),
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ce-card-hover shadow-soft">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <ArrowDownCircle className="size-5 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Egresos
                    </p>
                    <p className="text-xl font-bold">
                      {formatMoney(
                        cashMovements
                          .filter(
                            (movement) =>
                              movement.type === "Egreso",
                          )
                          .reduce(
                            (sum, movement) =>
                              sum + movement.amount,
                            0,
                          ),
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ce-card-hover shadow-soft">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">
                  Saldo actual
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {formatMoney(cashBalance)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="ce-card-hover shadow-soft mt-4">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">
                Movimientos de caja
              </CardTitle>

              <div className="flex gap-2">
                <select
                  value={cashFilter}
                  onChange={(e) =>
                    setCashFilter(
                      e.target.value as CashType | "Todos",
                    )
                  }
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option>Todos</option>
                  <option>Ingreso</option>
                  <option>Egreso</option>
                </select>

                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => setCashDialog(true)}
                >
                  <Plus className="size-4" />
                  Registrar
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {filteredCash.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    {movement.type === "Ingreso" ? (
                      <ArrowUpCircle className="size-5 text-emerald-600" />
                    ) : (
                      <ArrowDownCircle className="size-5 text-red-500" />
                    )}

                    <div>
                      <p className="font-medium">
                        {movement.concept}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {movement.date} · {movement.method}
                      </p>
                    </div>
                  </div>

                  <span
                    className={
                      movement.type === "Ingreso"
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-red-500"
                    }
                  >
                    {movement.type === "Ingreso" ? "+" : "-"}
                    {formatMoney(movement.amount)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* NUEVO COMPROBANTE */}
      <Dialog
        open={invoiceDialog}
        onOpenChange={setInvoiceDialog}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo comprobante</DialogTitle>
            <DialogDescription>
              Registrá una operación de facturación en modo local.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              createInvoice(new FormData(event.currentTarget));
            }}
          >
            <div className="space-y-1.5">
              <Label>Paciente</Label>
              <Input
                name="patient"
                placeholder="Nombre del paciente"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Concepto</Label>
              <Input
                name="concept"
                placeholder="Tratamiento / consulta"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Importe</Label>
                <Input
                  name="amount"
                  type="number"
                  min="1"
                  placeholder="0"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Método</Label>
                <select
                  name="method"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {paymentMethods
                    .filter((method) => method.active)
                    .map((method) => (
                      <option
                        key={method.id}
                        value={method.name}
                      >
                        {method.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Estado</Label>
              <select
                name="status"
                defaultValue="Pendiente"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option>Pendiente</option>
                <option>Pagada</option>
                <option>Borrador</option>
              </select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInvoiceDialog(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Crear comprobante
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* NUEVO PRESUPUESTO */}
      <Dialog
        open={budgetDialog}
        onOpenChange={setBudgetDialog}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo presupuesto</DialogTitle>
            <DialogDescription>
              Creá una propuesta económica para un paciente.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              createBudget(new FormData(event.currentTarget));
            }}
          >
            <div className="space-y-1.5">
              <Label>Paciente</Label>
              <Input
                name="patient"
                placeholder="Nombre del paciente"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tratamiento</Label>
              <Textarea
                name="treatment"
                placeholder="Detalle del tratamiento"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Importe</Label>
                <Input
                  name="amount"
                  type="number"
                  min="1"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Válido hasta</Label>
                <Input
                  name="validUntil"
                  type="date"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setBudgetDialog(false)}
              >
                Cancelar
              </Button>

              <Button type="submit">
                Crear presupuesto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MOVIMIENTO DE CAJA */}
      <Dialog
        open={cashDialog}
        onOpenChange={setCashDialog}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar movimiento</DialogTitle>
            <DialogDescription>
              Agregá un ingreso o egreso a la caja.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              createCashMovement(new FormData(event.currentTarget));
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border p-3">
                <input
                  type="radio"
                  name="type"
                  value="Ingreso"
                  defaultChecked
                />
                <ArrowUpCircle className="size-4 text-emerald-600" />
                <span className="text-sm font-medium">
                  Ingreso
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl border p-3">
                <input
                  type="radio"
                  name="type"
                  value="Egreso"
                />
                <ArrowDownCircle className="size-4 text-red-500" />
                <span className="text-sm font-medium">
                  Egreso
                </span>
              </label>
            </div>

            <div className="space-y-1.5">
              <Label>Concepto</Label>
              <Input
                name="concept"
                placeholder="Ej. Cobro consulta"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Importe</Label>
                <Input
                  name="amount"
                  type="number"
                  min="1"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Método</Label>
                <select
                  name="method"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {paymentMethods
                    .filter((method) => method.active)
                    .map((method) => (
                      <option
                        key={method.id}
                        value={method.name}
                      >
                        {method.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCashDialog(false)}
              >
                Cancelar
              </Button>

              <Button type="submit">
                Registrar movimiento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MÉTODO DE PAGO */}
      <Dialog
        open={paymentDialog}
        onOpenChange={setPaymentDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar método de pago</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              addPaymentMethod(new FormData(event.currentTarget));
            }}
          >
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input
                name="name"
                placeholder="Ej. Transferencia bancaria"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Detalle</Label>
              <Input
                name="detail"
                placeholder="Ej. Cuenta Banco Nación"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPaymentDialog(false)}
              >
                Cancelar
              </Button>

              <Button type="submit">
                Agregar método
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DETALLE FACTURA */}
      <Dialog
        open={Boolean(invoiceDetail)}
        onOpenChange={(open) => {
          if (!open) setInvoiceDetail(null);
        }}
      >
        <DialogContent>
          {invoiceDetail ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {invoiceDetail.id}
                </DialogTitle>
                <DialogDescription>
                  Detalle del comprobante.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">
                    Paciente
                  </p>
                  <p className="mt-1 font-medium">
                    {invoiceDetail.patient}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">
                    Estado
                  </p>
                  <Badge className="mt-2">
                    {invoiceDetail.status}
                  </Badge>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">
                    Concepto
                  </p>
                  <p className="mt-1 font-medium">
                    {invoiceDetail.concept}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">
                    Importe
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    {formatMoney(invoiceDetail.amount)}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setInvoiceDetail(null)}
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* DETALLE PRESUPUESTO */}
      <Dialog
        open={Boolean(budgetDetail)}
        onOpenChange={(open) => {
          if (!open) setBudgetDetail(null);
        }}
      >
        <DialogContent>
          {budgetDetail ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {budgetDetail.id}
                </DialogTitle>
                <DialogDescription>
                  Detalle del presupuesto.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">
                    Paciente
                  </p>
                  <p className="mt-1 font-semibold">
                    {budgetDetail.patient}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">
                    Tratamiento
                  </p>
                  <p className="mt-1 font-medium">
                    {budgetDetail.treatment}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border p-4">
                    <p className="text-xs text-muted-foreground">
                      Total
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      {formatMoney(budgetDetail.amount)}
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <p className="text-xs text-muted-foreground">
                      Estado
                    </p>
                    <Badge className="mt-2">
                      {budgetDetail.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {budgetDetail.status === "Enviado" ? (
                  <>
                    <Button
                      onClick={() =>
                        updateBudgetStatus(
                          budgetDetail.id,
                          "Aprobado",
                        )
                      }
                    >
                      <Check className="mr-2 size-4" />
                      Aprobar
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() =>
                        updateBudgetStatus(
                          budgetDetail.id,
                          "Rechazado",
                        )
                      }
                    >
                      <X className="mr-2 size-4" />
                      Rechazar
                    </Button>
                  </>
                ) : null}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setBudgetDetail(null)}
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}