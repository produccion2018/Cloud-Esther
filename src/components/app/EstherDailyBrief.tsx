import { Sparkles } from "lucide-react";
import estherHead from "@/assets/esther-head.png";
import { getAccount } from "@/lib/account";
import { getTimeGreeting } from "@/lib/greeting";

// Mensaje que Esther dispara sola al entrar al Dashboard, sin que se lo
// pidan. Hoy no hay turnos/facturación reales para resumir, así que es
// honesta al respecto en vez de inventar números — cuando haya datos
// reales de la jornada, es acá donde se conectan para armar el resumen.
export function EstherDailyBrief() {
  const account = getAccount();
  const name = account?.contactName?.split(" ")[0] ?? "";

  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-primary/25 bg-gradient-to-b from-[oklch(0.96_0.025_292)]/70 to-transparent p-4 shadow-soft">
      <img
        src={estherHead}
        alt="Esther"
        className="size-12 shrink-0 rounded-full border-2 border-primary/30 bg-card object-cover"
      />
      <div className="min-w-0">
        <p className="mb-0.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
          <Sparkles className="size-3.5" /> IA Esther
        </p>
        <p className="text-sm text-foreground">
          Hola{name ? `, ${name}` : ""}. {getTimeGreeting()}. Todavía no tengo turnos ni facturación
          cargados para resumirte hoy — apenas empieces a cargar actividad, te cuento acá lo más
          importante de la jornada cada vez que entres.
        </p>
      </div>
    </div>
  );
}