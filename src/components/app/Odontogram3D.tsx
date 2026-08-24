import { useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { LOWER_TEETH, UPPER_TEETH, type ToothStatus } from "@/lib/odontograma";

const STATUS_COLOR: Record<ToothStatus, string> = {
  sano: "#f6f4ef",
  caries: "#8a3420",
  obturado: "#6f7fd6",
  corona: "#e0ac35",
  implante: "#b9bcc4",
  ausente: "#000000",
};

const GUM_COLOR = "#d97a8e";

const RADIUS_X = 1.9;
const RADIUS_Z = 1.5;
const SPREAD = Math.PI * 0.78;

function archPoint(angle: number, y: number) {
  const x = Math.sin(angle) * RADIUS_X;
  const z = Math.cos(angle) * RADIUS_Z - RADIUS_Z * 0.35;
  return new THREE.Vector3(x, y, z);
}

function Tooth({
  angle,
  y,
  status,
  upper,
}: {
  angle: number;
  y: number;
  status: ToothStatus;
  upper: boolean;
}) {
  if (status === "ausente") return null;

  const { x, z } = archPoint(angle, y);

  return (
    <mesh position={[x, y, z]} rotation={[upper ? -0.15 : 0.15, angle, 0]} castShadow>
      <capsuleGeometry args={[0.16, 0.34, 4, 8]} />
      <meshStandardMaterial
        color={STATUS_COLOR[status]}
        roughness={0.35}
        metalness={status === "implante" ? 0.6 : 0.05}
      />
    </mesh>
  );
}

// Arco de encía: un "caño" rosado que sigue la misma curva que los dientes,
// ubicado justo donde nacen las piezas (arriba de la corona en la arcada
// superior, abajo en la inferior). Es lo que da la sensación de "boca" en
// vez de dientes sueltos flotando.
function Gum({ y, teethCount }: { y: number; teethCount: number }) {
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = -SPREAD / 2 + t * SPREAD * (teethCount / (teethCount - 1) * (steps / steps));
      points.push(archPoint(-SPREAD / 2 + t * SPREAD, y));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [y, teethCount]);

  return (
    <mesh receiveShadow castShadow>
      <tubeGeometry args={[curve, 48, 0.24, 12, false]} />
      <meshStandardMaterial color={GUM_COLOR} roughness={0.6} />
    </mesh>
  );
}

function Arch({
  teeth,
  y,
  upper,
  statusByTooth,
}: {
  teeth: number[];
  y: number;
  upper: boolean;
  statusByTooth: Partial<Record<number, ToothStatus>>;
}) {
  const gumY = upper ? y + 0.32 : y - 0.32;

  return (
    <group>
      <Gum y={gumY} teethCount={teeth.length} />
      {teeth.map((n, i) => {
        const t = i / (teeth.length - 1);
        const angle = -SPREAD / 2 + t * SPREAD;
        return (
          <Tooth key={n} angle={angle} y={y} status={statusByTooth[n] ?? "sano"} upper={upper} />
        );
      })}
    </group>
  );
}

export function Odontogram3D({
  statusByTooth = {},
}: {
  statusByTooth?: Partial<Record<number, ToothStatus>>;
}) {
  const jawOpen = 0.55;

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-primary-soft/30 to-transparent">
      <Canvas camera={{ position: [0, 1.6, 5.2], fov: 40 }} shadows>
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} />
        <group>
          <Arch teeth={UPPER_TEETH} y={jawOpen / 2} upper statusByTooth={statusByTooth} />
          <Arch teeth={LOWER_TEETH} y={-jawOpen / 2} upper={false} statusByTooth={statusByTooth} />
        </group>
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enableZoom
          minDistance={2.5}
          maxDistance={9}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}