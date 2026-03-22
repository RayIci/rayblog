import { useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import type { Mesh } from "three";

interface MouseRef {
  x: number;
  y: number;
}

interface TiltRef {
  x: number;
  y: number;
}

function TorusKnot({ mouseRef }: { mouseRef: React.RefObject<MouseRef> }) {
  const meshRef = useRef<Mesh>(null!);
  const tiltRef = useRef<TiltRef>({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    // Lerp tilt toward current mouse position
    const mouse = mouseRef.current ?? { x: 0, y: 0 };
    tiltRef.current.x += (mouse.y * 0.4 - tiltRef.current.x) * 0.04;
    tiltRef.current.y += (mouse.x * 0.4 - tiltRef.current.y) * 0.04;

    meshRef.current.rotation.x = t * 0.1 + tiltRef.current.x;
    meshRef.current.rotation.y = t * 0.15 + tiltRef.current.y;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.1, 0.32, 200, 20]} />
      <meshBasicMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

export function HeroScene() {
  const mouseRef = useRef<MouseRef>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
  }, []);

  return (
    <div
      className="h-[420px] w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ fov: 45, position: [0, 0, 7] }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <TorusKnot mouseRef={mouseRef} />
        </Canvas>
      </Suspense>
    </div>
  );
}
