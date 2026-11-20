"use client";

import { useEffect, useRef } from "react";

export default function FogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let visible = !document.hidden;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const embers = Array.from({ length: mobile ? 12 : 22 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 0.7 + Math.random() * 1.4,
      speed: 0.12 + Math.random() * 0.28,
      alpha: 0.12 + Math.random() * 0.32,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = (timestamp: number) => {
      if (!visible || reducedMotion) return;
      if (timestamp - lastFrame < 33) {
        frame = requestAnimationFrame(render);
        return;
      }
      lastFrame = timestamp;
      context.clearRect(0, 0, width, height);

      for (const ember of embers) {
        ember.y -= ember.speed;
        ember.phase += 0.012;
        ember.x += Math.sin(ember.phase) * 0.18;
        if (ember.y < -8) {
          ember.y = height + 8;
          ember.x = Math.random() * width;
        }
        const glow = context.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, ember.radius * 5);
        glow.addColorStop(0, "rgba(0,255,136," + ember.alpha + ")");
        glow.addColorStop(1, "rgba(0,255,136,0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(ember.x, ember.y, ember.radius * 5, 0, Math.PI * 2);
        context.fill();
      }
      frame = requestAnimationFrame(render);
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && !reducedMotion) {
        lastFrame = 0;
        frame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(frame);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (!reducedMotion) frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-60" />;
}
