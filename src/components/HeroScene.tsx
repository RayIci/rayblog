import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Vector3,
  BufferAttribute,
} from "three";
import type { Points, LineSegments as ThreeLineSegments } from "three";

interface MouseVec {
  x: number; // NDC [-1, 1]
  y: number;
}

const PARTICLE_COUNT = 220;
const BOUNDS = 7;
const CONNECT_DIST = 1.5;
const SPEED = 0.0022;
const ATTRACT_RADIUS = 2.2;
const ATTRACT_STRENGTH = 0.005;
const COLOR = "#6366f1";

function ParticleNetwork() {
  const { camera } = useThree();

  // Mouse state — populated by window listeners so pointer-events CSS never blocks it
  const mouseRef = useRef<MouseVec>({ x: 0, y: 0 });
  const hasMouse = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
      hasMouse.current = true;
    };
    const onLeave = () => {
      hasMouse.current = false;
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const positions = useMemo(
    () =>
      new Float32Array(
        Array.from(
          { length: PARTICLE_COUNT * 3 },
          () => (Math.random() * 2 - 1) * BOUNDS,
        ),
      ),
    [],
  );

  const motionParams = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        freqX: 0.18 + Math.random() * 0.22,
        freqY: 0.14 + Math.random() * 0.18,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        freqZ: 0.06 + Math.random() * 0.08,
        phaseZ: Math.random() * Math.PI * 2,
      })),
    [],
  );

  const pointsRef = useRef<Points>(null!);
  const linesRef = useRef<ThreeLineSegments>(null!);

  const pointsGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const linesGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute(
      "position",
      new Float32BufferAttribute(
        new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6),
        3,
      ),
    );
    // Nothing drawn until first useFrame update — prevents degenerate
    // zero-position segments from appearing at the origin on first render
    geo.setDrawRange(0, 0);
    return geo;
  }, []);

  const mouseWorld = useRef(new Vector3());

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Unproject mouse NDC to world space only when mouse is on the page
    let mx = 0;
    let my = 0;
    if (hasMouse.current) {
      const mouse = mouseRef.current;
      mouseWorld.current.set(mouse.x, mouse.y, 0.5).unproject(camera);
      const dir = mouseWorld.current.clone().sub(camera.position).normalize();
      const distToCam = -camera.position.z / dir.z;
      const mw = camera.position.clone().add(dir.multiplyScalar(distToCam));
      mx = mw.x;
      my = mw.y;
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const p = motionParams[i];

      // Continuous curved motion via Lissajous-like velocity
      positions[i3] += Math.cos(t * p.freqX + p.phaseX) * SPEED;
      positions[i3 + 1] += Math.sin(t * p.freqY + p.phaseY) * SPEED;
      positions[i3 + 2] += Math.sin(t * p.freqZ + p.phaseZ) * SPEED * 0.3;

      // Cursor attraction — only when cursor is on the page
      if (hasMouse.current) {
        const dx = mx - positions[i3];
        const dy = my - positions[i3 + 1];
        const d2 = dx * dx + dy * dy;
        if (d2 < ATTRACT_RADIUS * ATTRACT_RADIUS && d2 > 0.0001) {
          const d = Math.sqrt(d2);
          const force =
            ((ATTRACT_RADIUS - d) / ATTRACT_RADIUS) * ATTRACT_STRENGTH;
          positions[i3] += (dx / d) * force;
          positions[i3 + 1] += (dy / d) * force;
        }
      }

      // Wrap at bounds
      if (positions[i3] > BOUNDS) positions[i3] = -BOUNDS;
      else if (positions[i3] < -BOUNDS) positions[i3] = BOUNDS;
      if (positions[i3 + 1] > BOUNDS) positions[i3 + 1] = -BOUNDS;
      else if (positions[i3 + 1] < -BOUNDS) positions[i3 + 1] = BOUNDS;
      if (positions[i3 + 2] > BOUNDS * 0.4) positions[i3 + 2] = -BOUNDS * 0.4;
      else if (positions[i3 + 2] < -BOUNDS * 0.4)
        positions[i3 + 2] = BOUNDS * 0.4;
    }

    // Rebuild connection lines between nearby particles
    const lineArr = (linesGeo.attributes.position as BufferAttribute)
      .array as Float32Array;
    let lineIdx = 0;
    const cd2 = CONNECT_DIST * CONNECT_DIST;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const j3 = j * 3;
        const dx = positions[i3] - positions[j3];
        const dy = positions[i3 + 1] - positions[j3 + 1];
        const dz = positions[i3 + 2] - positions[j3 + 2];
        if (dx * dx + dy * dy + dz * dz < cd2) {
          lineArr[lineIdx++] = positions[i3];
          lineArr[lineIdx++] = positions[i3 + 1];
          lineArr[lineIdx++] = positions[i3 + 2];
          lineArr[lineIdx++] = positions[j3];
          lineArr[lineIdx++] = positions[j3 + 1];
          lineArr[lineIdx++] = positions[j3 + 2];
        }
      }
    }

    (pointsGeo.attributes.position as BufferAttribute).needsUpdate = true;
    (linesGeo.attributes.position as BufferAttribute).needsUpdate = true;
    linesGeo.setDrawRange(0, lineIdx / 3);
  });

  return (
    <>
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial
          color={COLOR}
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.75}
        />
      </points>
      <lineSegments ref={linesRef} geometry={linesGeo}>
        <lineBasicMaterial color={COLOR} transparent opacity={0.15} />
      </lineSegments>
    </>
  );
}

export function HeroScene() {
  return (
    <div className="h-full w-full">
      <Suspense fallback={null}>
        <Canvas
          camera={{ fov: 60, position: [0, 0, 6] }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent", pointerEvents: "none" }}
        >
          <ParticleNetwork />
        </Canvas>
      </Suspense>
    </div>
  );
}
