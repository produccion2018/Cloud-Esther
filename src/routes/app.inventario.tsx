import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Warehouse,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/DashboardShell";
import { EmptyState, StatCard } from "@/components/app/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/inventario")({
  component: InventarioPage,
});

const cardStyle =
  "border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent shadow-soft transition-all duration-500 hover:border-primary hover:shadow-lift hover:-translate-y-1";

type StockStatus = "normal" | "bajo" | "agotado";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  branch: string;
  quantity: number;
  minimum: number;
  unit: string;
  supplier: string;
  updatedAt: string;
};

type PurchaseOrder = {
  id: string;
  supplier: string;
  branch: string;
  items: number;
  status: "Pendiente" | "En tránsito" | "Recibida";
  date: string;
};

const initialInventory: InventoryItem[] = [
  {
    id: "i1",
    name: "Guantes de látex",
    category: "Protección",
    branch: "Clínica Centro",
    quantity: 24,
    minimum: 10,
    unit: "cajas",
    supplier: "Dental Supply",
    updatedAt: "Hoy, 09:20",
  },
  {
    id: "i2",
    name: "Anestesia local",
    category: "Anestesia",
    branch: "Clínica Centro",
    quantity: 6,
    minimum: 10,
    unit: "cajas",
    supplier: "OdontoMed",
    updatedAt: "Hoy, 08:45",
  },
  {
    id: "i3",
    name: "Material de ortodoncia",
    category: "Ortodoncia",
    branch: "Clínica Norte",
    quantity: 18,
    minimum: 8,
    unit: "kits",
    supplier: "OrthoPro",
    updatedAt: "Ayer, 17:10",
  },
  {
    id: "i4",
    name: "Resina composite",
    category: "Operatoria",
    branch: "Clínica Sur",
    quantity: 3,
    minimum: 8,
    unit: "unidades",
    supplier: "Dental Supply",
    updatedAt: "Ayer, 15:30",
  },
  {
    id: "i5",
    name: "Mascarillas",
    category: "Protección",
    branch: "Clínica Centro",
    quantity: 42,
    minimum: 15,
    unit: "cajas",
    supplier: "Dental Supply",
    updatedAt: "Ayer, 11:20",
  },
];

const initialOrders: PurchaseOrder[] = [
  {
    id: "OC-2026-001",
    supplier: "OdontoMed",
    branch: "Clínica Centro",
    items: 3,
    status: "En tránsito",
    date: "21/08/2026",
  },
  {
    id: "OC-2026-002",
    supplier: "Dental Supply",
    branch: "Clínica Norte",
    items: 5,
    status: "Pendiente",
    date: "20/08/2026",
  },
  {
    id: "OC-2026-003",
    supplier: "OrthoPro",
    branch: "Clínica Centro",
    items: 2,
    status: "Recibida",
    date: "18/08/2026",
  },
];

function getStockStatus(item: InventoryItem): StockStatus {
  if (item.quantity <= 0) return "agotado";
  if (item.quantity <= item.minimum) return "bajo";
  return "normal";
}

function statusLabel(status: StockStatus) {
  if (status === "agotado") return "Agotado";
  if (status === "bajo") return "Stock bajo";
  return "Normal";
}

function statusClass(status: StockStatus) {
  if (status === "agotado") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }

  if (status === "bajo") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-600";
  }

  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600";
}

function NuevoInsumoDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (item: InventoryItem) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") ?? "").trim();
    const category = String(form.get("category") ?? "");
    const branch = String(form.get("branch") ?? "");
    const quantity = Number(form.get("quantity") ?? 0);
    const minimum = Number(form.get("minimum") ?? 0);
    const unit = String(form.get("unit") ?? "").trim();
    const supplier = String(form.get("supplier") ?? "").trim();

    if (!name || !category || !branch || !unit) {
      toast.error("Completá los campos obligatorios.");
      return;
    }

    const newItem: InventoryItem = {
      id: `i-${Date.now()}`,
      name,
      category,
      branch,
      quantity,
      minimum,
      unit,
      supplier: supplier || "Sin proveedor",
      updatedAt: "Ahora",
    };

    onCreate(newItem);
    onOpenChange(false);
    toast.success("Insumo agregado al inventario.");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo insumo</DialogTitle>
          <DialogDescription>
            Registrá un insumo y definí el mínimo de stock para recibir alertas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nombre *</Label>
            <Input
              name="name"
              placeholder="Ej. Guantes de nitrilo"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Categoría *</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Protección">Protección</SelectItem>
                  <SelectItem value="Anestesia">Anestesia</SelectItem>
                  <SelectItem value="Operatoria">Operatoria</SelectItem>
                  <SelectItem value="Ortodoncia">Ortodoncia</SelectItem>
                  <SelectItem value="Implantología">Implantología</SelectItem>
                  <SelectItem value="Higiene">Higiene</SelectItem>
                  <SelectItem value="Otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Sucursal *</Label>
              <Select name="branch" required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clínica Centro">
                    Clínica Centro
                  </SelectItem>
                  <SelectItem value="Clínica Norte">
                    Clínica Norte
                  </SelectItem>
                  <SelectItem value="Clínica Sur">
                    Clínica Sur
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Cantidad</Label>
              <Input name="quantity" type="number" min="0" defaultValue="0" />
            </div>

            <div className="space-y-1.5">
              <Label>Mínimo</Label>
              <Input name="minimum" type="number" min="0" defaultValue="5" />
            </div>

            <div className="space-y-1.5">
              <Label>Unidad *</Label>
              <Input
                name="unit"
                placeholder="cajas"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Proveedor</Label>
            <Input
              name="supplier"
              placeholder="Ej. Dental Supply"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button type="submit">
              <Plus className="mr-2 size-4" />
              Crear insumo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function InventarioPage() {
  const [inventory, setInventory] =
    useState<InventoryItem[]>(initialInventory);

  const [orders, setOrders] =
    useState<PurchaseOrder[]>(initialOrders);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("todas");

  const alerts = useMemo(
    () =>
      inventory.filter(
        (item) => getStockStatus(item) !== "normal",
      ),
    [inventory],
  );

  const totalStock = inventory.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const pendingOrders = orders.filter(
    (order) => order.status !== "Recibida",
  ).length;

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesBranch =
      branchFilter === "todas" ||
      item.branch === branchFilter;

    return matchesSearch && matchesBranch;
  });

  function updateQuantity(id: string, amount: number) {
    setInventory((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          quantity: Math.max(0, item.quantity + amount),
          updatedAt: "Ahora",
        };
      }),
    );
  }

  function deleteItem(id: string) {
    setInventory((current) =>
      current.filter((item) => item.id !== id),
    );

    toast.success("Insumo eliminado.");
  }

  function createOrder() {
    const order: PurchaseOrder = {
      id: `OC-2026-${String(orders.length + 1).padStart(3, "0")}`,
      supplier: "Proveedor pendiente",
      branch: "Clínica Centro",
      items: alerts.length || 1,
      status: "Pendiente",
      date: new Date().toLocaleDateString("es-AR"),
    };

    setOrders((current) => [order, ...current]);

    toast.success("Orden de compra creada.");
  }

  return (
    <>
      <PageHeader
        title="Inventario"
        description="Controlá insumos, stock, reposición, compras y consumo de cada sucursal."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={createOrder}
            >
              <ShoppingCart className="size-4" />
              Nueva orden
            </Button>

            <Button
              className="gap-2"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="size-4" />
              Nuevo insumo
            </Button>
          </div>
        }
      />

      <NuevoInsumoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={(item) =>
          setInventory((current) => [item, ...current])
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Insumos registrados"
          value={String(inventory.length)}
          icon={Boxes}
          hint={`${totalStock} unidades/cajas en stock`}
        />

        <StatCard
          label="Alertas activas"
          value={String(alerts.length)}
          icon={AlertTriangle}
          tone={alerts.length ? "warning" : "success"}
          hint={
            alerts.length
              ? "Revisar reposición"
              : "Stock controlado"
          }
        />

        <StatCard
          label="Órdenes pendientes"
          value={String(pendingOrders)}
          icon={ShoppingCart}
          tone="info"
        />

        <StatCard
          label="Consumo del mes"
          value="—"
          icon={TrendingDown}
          hint="Se calculará con los movimientos"
        />
      </div>

      <Tabs defaultValue="stock" className="mt-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="stock">
            <Boxes className="mr-2 size-4" />
            Stock
          </TabsTrigger>

          <TabsTrigger value="alertas">
            <AlertTriangle className="mr-2 size-4" />
            Alertas
            {alerts.length > 0 && (
              <Badge
                variant="destructive"
                className="ml-2"
              >
                {alerts.length}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="ordenes">
            <ShoppingCart className="mr-2 size-4" />
            Órdenes de compra
          </TabsTrigger>

          <TabsTrigger value="consumo">
            <TrendingDown className="mr-2 size-4" />
            Consumo
          </TabsTrigger>
        </TabsList>

        {/* STOCK */}

        <TabsContent value="stock" className="mt-4">
          <Card className={cardStyle}>
            <CardHeader>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-base">
                  Inventario por sucursal
                </CardTitle>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Buscar insumo..."
                      className="pl-9 sm:w-64"
                    />
                  </div>

                  <Select
                    value={branchFilter}
                    onValueChange={setBranchFilter}
                  >
                    <SelectTrigger className="sm:w-48">
                      <Warehouse className="mr-2 size-4" />
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="todas">
                        Todas las sucursales
                      </SelectItem>
                      <SelectItem value="Clínica Centro">
                        Clínica Centro
                      </SelectItem>
                      <SelectItem value="Clínica Norte">
                        Clínica Norte
                      </SelectItem>
                      <SelectItem value="Clínica Sur">
                        Clínica Sur
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {filteredInventory.length === 0 ? (
                <EmptyState
                  icon={Boxes}
                  title="No encontramos insumos"
                  description="Probá con otro nombre o cambiá el filtro de sucursal."
                />
              ) : (
                <div className="space-y-3">
                  {filteredInventory.map((item) => {
                    const status = getStockStatus(item);

                    const percentage =
                      item.minimum > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (item.quantity /
                                (item.minimum * 3)) *
                                100,
                            ),
                          )
                        : 100;

                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-border bg-background/50 p-4 transition-colors hover:bg-muted/30"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold">
                                {item.name}
                              </p>

                              <Badge
                                variant="outline"
                                className={statusClass(status)}
                              >
                                {statusLabel(status)}
                              </Badge>
                            </div>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.category} · {item.branch} ·
                              {" "}
                              {item.supplier}
                            </p>

                            <div className="mt-3">
                              <div className="mb-1 flex justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Nivel de stock
                                </span>

                                <span className="font-medium">
                                  {item.quantity} {item.unit}
                                  {" · "}mín. {item.minimum}
                                </span>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    status === "agotado"
                                      ? "bg-destructive"
                                      : status === "bajo"
                                        ? "bg-amber-500"
                                        : "bg-primary"
                                  }`}
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="size-8"
                              onClick={() =>
                                updateQuantity(item.id, -1)
                              }
                              disabled={item.quantity <= 0}
                            >
                              <Minus className="size-4" />
                            </Button>

                            <div className="min-w-16 text-center">
                              <p className="text-lg font-bold">
                                {item.quantity}
                              </p>
                              <p className="text-[10px] uppercase text-muted-foreground">
                                {item.unit}
                              </p>
                            </div>

                            <Button
                              size="icon"
                              variant="outline"
                              className="size-8"
                              onClick={() =>
                                updateQuantity(item.id, 1)
                              }
                            >
                              <Plus className="size-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-8 text-destructive hover:text-destructive"
                              onClick={() =>
                                deleteItem(item.id)
                              }
                              aria-label={`Eliminar ${item.name}`}
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALERTAS */}

        <TabsContent value="alertas" className="mt-4">
          <Card className={cardStyle}>
            <CardHeader>
              <CardTitle className="text-base">
                Alertas de reposición
              </CardTitle>
            </CardHeader>

            <CardContent>
              {alerts.length === 0 ? (
                <EmptyState
                  icon={AlertTriangle}
                  title="Sin alertas de stock"
                  description="Todos los insumos están por encima del mínimo configurado."
                />
              ) : (
                <div className="space-y-3">
                  {alerts.map((item) => {
                    const status = getStockStatus(item);

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />

                          <div>
                            <p className="font-semibold">
                              {item.name}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {item.branch} · quedan{" "}
                              <strong>
                                {item.quantity} {item.unit}
                              </strong>{" "}
                              · mínimo {item.minimum}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => {
                            updateQuantity(
                              item.id,
                              Math.max(
                                1,
                                item.minimum * 2 -
                                  item.quantity,
                              ),
                            );

                            toast.success(
                              `Stock de ${item.name} actualizado.`,
                            );
                          }}
                        >
                          <ShoppingCart className="mr-2 size-4" />
                          Reponer
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ORDENES */}

        <TabsContent value="ordenes" className="mt-4">
          <Card className={cardStyle}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">
                Órdenes de compra
              </CardTitle>

              <Button
                size="sm"
                onClick={createOrder}
              >
                <Plus className="mr-2 size-4" />
                Nueva orden
              </Button>
            </CardHeader>

            <CardContent>
              {orders.length === 0 ? (
                <EmptyState
                  icon={ShoppingCart}
                  title="Sin órdenes de compra"
                  description="Creá una orden para comenzar a gestionar reposiciones."
                />
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <ShoppingCart className="size-5" />
                        </div>

                        <div>
                          <p className="font-semibold">
                            {order.id}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {order.supplier} · {order.branch}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {order.items} productos ·{" "}
                            {order.date}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={
                          order.status === "Recibida"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                            : order.status === "En tránsito"
                              ? "border-blue-500/30 bg-blue-500/10 text-blue-600"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-600"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONSUMO */}

        <TabsContent value="consumo" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-base">
                  Consumo mensual
                </CardTitle>
              </CardHeader>

              <CardContent>
                <EmptyState
                  icon={TrendingDown}
                  title="Calculando consumo"
                  description="El sistema calculará automáticamente el consumo cuando se registren movimientos de entrada y salida."
                />
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-base">
                  Mayor consumo
                </CardTitle>
              </CardHeader>

              <CardContent>
                <EmptyState
                  icon={TrendingUp}
                  title="Sin datos suficientes"
                  description="Acá aparecerán los insumos con mayor consumo."
                />
              </CardContent>
            </Card>

            <Card className={cardStyle}>
              <CardHeader>
                <CardTitle className="text-base">
                  Movimientos
                </CardTitle>
              </CardHeader>

              <CardContent>
                <EmptyState
                  icon={ClipboardList}
                  title="Sin movimientos"
                  description="Las entradas, salidas, ajustes y transferencias entre sucursales aparecerán acá."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}