"use client";

import { useCallback, useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  phase: number;
};

/** Horizontal color ramp mirrored from gigolabs ParticleCanvas. */
function colorAt(xRatio: number) {
  if (xRatio < 0.5) {
    const t = 2 * xRatio;
    const r = Math.round(251 + -17 * t);
    const g = Math.round(188 + -121 * t);
    const b = Math.round(5 + 48 * t);
    return `${r},${g},${b}`;
  }

  const t = (xRatio - 0.5) * 2;
  const r = Math.round(234 + -168 * t);
  const g = Math.round(67 + 66 * t);
  const b = Math.round(53 + 191 * t);
  return `${r},${g},${b}`;
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);

  const seedParticles = useCallback((width: number, height: number) => {
    const count = Math.min(
      Math.max(Math.floor((width * height) / 1800), 200),
      750,
    );
    const next: Particle[] = [];

    for (let i = 0; i < count; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      next.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 2 * Math.random() + 1,
        color: colorAt(x / width),
        alpha: 0.4 * Math.random() + 0.1,
        phase: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = next;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedParticles(rect.width, rect.height);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    const tick = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, width, height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.phase += 0.015;
        p.vx += 0.008 * Math.cos(p.phase);
        p.vy += 0.008 * Math.sin(0.8 * p.phase);

        if (mouseX > -1000) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 500 && dist > 0.001) {
            const falloff = (500 - dist) / 500;
            const boost = dist < 100 ? 1.5 : 1;
            p.vx += (dx / dist) * falloff * 0.4 * boost;
            p.vy += (dy / dist) * falloff * 0.4 * boost;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle + Math.PI / 2) * falloff * 0.5 * boost;
            p.vy += Math.sin(angle + Math.PI / 2) * falloff * 0.5 * boost;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;

        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }

        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
        }

        p.color = colorAt(p.x / width);

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const angle = Math.atan2(p.vy, p.vx);
        const streak = p.size * (3 + Math.min(2 * speed, 8));
        const thickness = p.size;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);

        const gradient = ctx.createLinearGradient(-streak / 2, 0, streak / 2, 0);
        gradient.addColorStop(0, `rgba(${p.color}, 0)`);
        gradient.addColorStop(0.5, `rgba(${p.color}, ${p.alpha})`);
        gradient.addColorStop(1, `rgba(${p.color}, ${1.5 * p.alpha})`);

        ctx.beginPath();
        ctx.moveTo(-streak / 2, 0);
        ctx.lineTo(streak / 2, 0);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = thickness;
        ctx.lineCap = "round";
        ctx.stroke();

        if (speed > 0.5) {
          ctx.beginPath();
          ctx.arc(streak / 2, 0, 0.8 * thickness, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(${p.color}, ${0.8 * p.alpha})`;
          ctx.fill();
        }

        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      observer.disconnect();
    };
  }, [seedParticles]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-90"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none block size-full"
      />
    </div>
  );
}
