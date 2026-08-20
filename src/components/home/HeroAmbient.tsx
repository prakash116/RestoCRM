"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";

const PARTICLE_COUNT = 140;

/**
 * Ambient warm motes behind the hero composition — the out-of-focus bokeh you
 * get shooting food under warm restaurant light.
 *
 * Loaded only after the hero is interactive, and only on capable desktop
 * hardware (see `HeroAmbientLoader`). The loop stops entirely when the tab is
 * hidden or the canvas scrolls out of view, so it never burns battery on a
 * page the visitor has left behind.
 */
export default function HeroAmbient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const scene = new Scene();
    const camera = new PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 14;

    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    // Cap at 1.5: a 3× device pixel ratio triples fragment cost for an effect
    // nobody is looking at directly.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    /* Soft radial sprite, drawn once into a 64px canvas. */
    const sprite = document.createElement("canvas");
    sprite.width = 64;
    sprite.height = 64;
    const ctx = sprite.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,236,214,1)");
      gradient.addColorStop(0.45, "rgba(240,161,42,0.42)");
      gradient.addColorStop(1, "rgba(240,161,42,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new CanvasTexture(sprite);

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const drift = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      drift[i] = 0.25 + Math.random() * 0.55;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));

    const material = new PointsMaterial({
      size: 0.55,
      map: texture,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      color: new Color("#f0a12a"),
      opacity: 0.75,
      sizeAttenuation: true,
    });

    const points = new Points(geometry, material);
    scene.add(points);

    function resize() {
      if (!parent) return;
      const { clientWidth, clientHeight } = parent;
      if (clientWidth === 0 || clientHeight === 0) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    }
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    /* Gentle pointer parallax, normalised to the viewport. */
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

      const attribute = geometry.getAttribute("position") as BufferAttribute;
      const array = attribute.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const yIndex = i * 3 + 1;
        array[yIndex] += drift[i] * delta * 0.6;
        // Recycle motes that drift off the top back to the bottom.
        if (array[yIndex] > 9) array[yIndex] = -9;
      }
      attribute.needsUpdate = true;

      points.rotation.y = Math.sin(elapsed * 0.06) * 0.12 + pointerX * 0.06;
      points.rotation.x = pointerY * 0.04;

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
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full opacity-70"
    />
  );
}
