import { useEffect, useRef } from 'react';

// ── Configuration ──
const COLORS = [
  { r: 0, g: 240, b: 255, opacity: 0.15 }, // neon-cyan  (70%)
  { r: 255, g: 0, b: 229, opacity: 0.1 },  // neon-magenta (20%)
  { r: 57, g: 255, b: 20, opacity: 0.08 },  // neon-green (10%)
] as const;

const COLOR_WEIGHTS = [0.7, 0.2, 0.1];
const CONNECTION_DISTANCE = 150;
const CONNECTION_OPACITY = 0.08;
const CONNECTION_HIGHLIGHT_OPACITY = 0.15;
const CONNECTION_WIDTH = 0.5;
const DRIFT_SPEED = 0.2;
const MOUSE_RADIUS = 120;
const MOUSE_REPULSION = 0.8;
const PULSE_SPEED = 0.02;
const MIN_RADIUS = 1.5;
const MAX_RADIUS = 3;
const RESIZE_DEBOUNCE = 200;
const MAX_DPR = 2;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorIndex: number;
  pulseOffset: number;
}

function getParticleCount(width: number): number {
  if (width < 480) return 15;
  if (width < 768) return 30;
  return 60;
}

function pickColorIndex(): number {
  const r = Math.random();
  if (r < COLOR_WEIGHTS[0]) return 0;
  if (r < COLOR_WEIGHTS[0] + COLOR_WEIGHTS[1]) return 1;
  return 2;
}

function createParticles(width: number, height: number): Particle[] {
  const count = getParticleCount(width);
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * DRIFT_SPEED,
      vy: Math.sin(angle) * DRIFT_SPEED,
      radius: MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS),
      colorIndex: pickColorIndex(),
      pulseOffset: Math.random() * Math.PI * 2,
    };
  });
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    particles: Particle[];
    mouse: { x: number; y: number; active: boolean };
    animationId: number;
    time: number;
    paused: boolean;
    isMobile: boolean;
  }>({
    particles: [],
    mouse: { x: 0, y: 0, active: false },
    animationId: 0,
    time: 0,
    paused: false,
    isMobile: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, MAX_DPR);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.isMobile = w < 480;
      state.particles = createParticles(w, h);
    }

    resize();

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, RESIZE_DEBOUNCE);
    }

    // Mouse tracking
    function handleMouseMove(e: MouseEvent) {
      if (state.isMobile) return;
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
      state.mouse.active = true;
    }

    function handleMouseLeave() {
      state.mouse.active = false;
    }

    // Visibility
    function handleVisibility() {
      state.paused = document.hidden;
    }

    // Animation loop
    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);

      const { particles, mouse } = state;
      state.time += 1;

      // Update positions
      if (!prefersReducedMotion) {
        for (const p of particles) {
          // Mouse repulsion
          if (mouse.active && !state.isMobile) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
              const force =
                ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_REPULSION;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          // Wrap around edges
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const fade = 1 - dist / CONNECTION_DISTANCE;

            // Highlight connections near mouse
            let opacity = CONNECTION_OPACITY * fade;
            if (mouse.active && !state.isMobile) {
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              const mouseDist = Math.sqrt(
                (midX - mouse.x) ** 2 + (midY - mouse.y) ** 2,
              );
              if (mouseDist < MOUSE_RADIUS) {
                opacity =
                  CONNECTION_HIGHLIGHT_OPACITY *
                  fade *
                  (1 - mouseDist / MOUSE_RADIUS) +
                  CONNECTION_OPACITY * fade;
              }
            }

            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            ctx!.lineWidth = CONNECTION_WIDTH;
            ctx!.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const color = COLORS[p.colorIndex];
        const pulse = prefersReducedMotion
          ? 1
          : 0.8 + 0.2 * Math.sin(state.time * PULSE_SPEED + p.pulseOffset);
        const r = p.radius * pulse;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.opacity})`;
        ctx!.fill();
      }
    }

    // Render once for reduced motion, otherwise animate
    if (prefersReducedMotion) {
      draw();
    } else {
      function loop() {
        if (!state.paused) draw();
        state.animationId = requestAnimationFrame(loop);
      }
      state.animationId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(state.animationId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
