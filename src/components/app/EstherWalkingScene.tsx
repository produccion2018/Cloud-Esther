import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import poseWalking from "@/assets/esther-pose-walking.png";
import poseBending from "@/assets/esther-pose-bending.png";
import poseWaving from "@/assets/esther-pose-waving.png";
import poseResting from "@/assets/esther-pose-resting.png";
import { getAccount } from "@/lib/account";
import { getTimeGreeting } from "@/lib/greeting";

type Phase = "walking" | "dropped" | "waving" | "resting";

// Tiempos mas lentos que la version anterior, a pedido del usuario: el
// caminar en si pasa de 2.6s a 5.5s, y el resto de los momentos se corre
// proporcionalmente para que la secuencia entera se sienta pausada.
const TIMINGS = {
  arrive: 5500,
  waveStart: 6400,
  waveEnd: 9200,
};

const POSE_IMAGE: Record<Phase, string> = {
  walking: poseWalking,
  dropped: poseBending,
  waving: poseWaving,
  resting: poseResting,
};

function SpeakingAura() {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-3xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: [0.12, 0.28, 0.12], scale: [0.85, 1.05, 0.85] }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function EstherWalkingScene({ className }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>("walking");
  const [greeting, setGreeting] = useState("");
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timers.current.push(
      setTimeout(() => setPhase("dropped"), TIMINGS.arrive),

      setTimeout(() => {
        const account = getAccount();
        const name = account?.contactName?.split(" ")[0] ?? "";
        setGreeting(
          `Hola${name ? `, ${name}` : ""}. ${getTimeGreeting()}. Estoy lista para ayudarte con el balance o lo que necesites de tu clínica.`,
        );
        setPhase("waving");
      }, TIMINGS.waveStart),

      setTimeout(() => setPhase("resting"), TIMINGS.waveEnd),
    );

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const walking = phase === "walking";
  const showBubble = greeting !== "" && !bubbleDismissed;

  return (
    <div
      className={`relative h-[380px] w-full max-w-[620px] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-soft/70 via-background to-accent/30 ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute -left-12 -top-12 size-52 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-12 size-60 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute inset-x-8 bottom-14 border-t border-dashed border-primary/20" />

      <AnimatePresence>{phase === "waving" ? <SpeakingAura /> : null}</AnimatePresence>

      {/* Se desliza desde afuera de pantalla por la DERECHA hasta el centro
          mientras camina (5.5s, pausado) — su cuerpo en la foto está
          orientado mirando hacia la izquierda, por eso entra por la derecha
          y avanza hacia la izquierda/centro, no al revés. */}
      <motion.div
        className="absolute bottom-14 left-1/2 h-[250px] w-[145px]"
        animate={{ x: walking ? 380 : 16 }}
        transition={{ duration: 5.5, ease: [0.4, 0.05, 0.3, 1] }}
      >
        <motion.div
          className="relative h-full w-full"
          animate={walking ? { y: [0, -5, 0] } : { y: 0 }}
          transition={
            walking
              ? { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.4 }
          }
        >
          {/* sombra en el piso */}
          <motion.div
            className="absolute -bottom-2 left-1/2 h-3 w-[60%] -translate-x-1/2 rounded-full bg-primary/25"
            animate={
              walking
                ? { scaleX: [1, 0.8, 1], opacity: [0.35, 0.2, 0.35] }
                : { scaleX: 1, opacity: 0.3 }
            }
            transition={
              walking
                ? { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
          />

          {/* Foto de Esther: se turna sola segun la fase, con fundido cruzado. */}
          <AnimatePresence mode="wait">
            <motion.img
              key={phase}
              src={POSE_IMAGE[phase]}
              alt="Esther"
              className="absolute inset-0 h-full w-full select-none object-contain object-bottom"
              draggable={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* globito de saludo, con boton de cerrar */}
          <AnimatePresence>
            {showBubble ? (
              <motion.div
                className="absolute left-[66px] w-[220px] rounded-2xl rounded-bl-sm border border-primary/30 bg-card p-4 shadow-lift"
                style={{ top: -72 }}
                initial={{ opacity: 0, scale: 0.7, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 4, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setBubbleDismissed(true)}
                  aria-label="Cerrar mensaje"
                  className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-soft hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="size-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wide text-primary">
                    IA Esther
                  </span>
                </div>
                <p className="text-sm font-medium leading-snug text-foreground">
                  {greeting}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}