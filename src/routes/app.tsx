import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/app/DashboardShell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Panel de gestión | DentalisPro" },
      {
        name: "description",
        content:
          "Panel de gestión multisucursal para clínicas odontológicas: agenda, pacientes, historia clínica, comunicación, facturación y analítica.",
      },
      { property: "og:title", content: "Panel de gestión | DentalisPro" },
      {
        property: "og:description",
        content: "Demostración navegable del panel de gestión para clínicas odontológicas.",
      },
    ],
  }),
  component: () => (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  ),
});
