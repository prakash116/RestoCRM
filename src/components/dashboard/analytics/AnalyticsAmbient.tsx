"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";

/** Decorative Three.js market field used only inside the analytics masthead. */
export default function AnalyticsAmbient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const scene = new Scene();
    const camera = new PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const rootStyles = getComputedStyle(document.documentElement);
    const accentChannels = rootStyles.getPropertyValue("--accent-rgb").trim() || "147 167 224";
    const accent = new Color(`rgb(${accentChannels.replace(/\s+/g, ",")})`);

    const gridGeometry = new PlaneGeometry(19, 10, 28, 14);
    const gridPositions = gridGeometry.getAttribute("position") as BufferAttribute;
    const baseGrid = new Float32Array(gridPositions.array as ArrayLike<number>);

    const gridMaterial = new MeshBasicMaterial({
      color: accent,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const grid = new Mesh(gridGeometry, gridMaterial);
    grid.rotation.z = -0.08;
    scene.add(grid);

    const pointMaterial = new PointsMaterial({
      color: accent,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const points = new Points(gridGeometry, pointMaterial);
    points.rotation.z = grid.rotation.z;
    scene.add(points);

    const marketGeometry = new BufferGeometry();
    const marketPositions = new Float32Array(42 * 3);
    for (let index = 0; index < 42; index += 1) {
      const progress = index / 41;
      marketPositions[index * 3] = -9 + progress * 18;
      marketPositions[index * 3 + 1] =
        -2.6 + progress * 5.4 + Math.sin(index * 0.72) * 0.38 + Math.cos(index * 0.24) * 0.22;
      marketPositions[index * 3 + 2] = 0.9;
    }
    marketGeometry.setAttribute("position", new BufferAttribute(marketPositions, 3));

    const marketMaterial = new LineBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const marketLine = new Line(marketGeometry, marketMaterial);
    marketLine.rotation.z = -0.08;
    scene.add(marketLine);

    function resize() {
      if (!parent) return;
      const { clientWidth, clientHeight } = parent;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    let pointerX = 0;
    let pointerY = 0;
    function onPointerMove(event: PointerEvent) {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let frame = 0;
    let running = false;
    let visible = true;
    let elapsed = 0;
    let last = performance.now();

    function tick(now: number) {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += delta;

      const positions = gridPositions.array as Float32Array;
      for (let index = 0; index < positions.length; index += 3) {
        const x = baseGrid[index];
        const y = baseGrid[index + 1];
        positions[index + 2] =
          Math.sin(x * 0.62 + elapsed * 0.55) * 0.2 +
          Math.cos(y * 0.88 + elapsed * 0.4) * 0.14;
      }
      gridPositions.needsUpdate = true;

      scene.rotation.y += (pointerX * 0.045 - scene.rotation.y) * 0.025;
      scene.rotation.x += (-pointerY * 0.025 - scene.rotation.x) * 0.025;
      marketLine.position.y = Math.sin(elapsed * 0.6) * 0.08;

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (running || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    function onVisibilityChange() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      gridGeometry.dispose();
      gridMaterial.dispose();
      pointMaterial.dispose();
      marketGeometry.dispose();
      marketMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full opacity-60"
    />
  );
}
