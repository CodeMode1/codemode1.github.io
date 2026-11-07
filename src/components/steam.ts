/**
 * Soft steam puffs drifting up from vents near the bottom of the screen.
 * Runs on one fixed canvas behind the content; pauses when the tab is hidden
 * and stays off entirely for visitors who prefer reduced motion.
 */
import { prefersReducedMotion } from '../lib/dom';

interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  growth: number;
  life: number;
  maxLife: number;
}

/** Vent positions as fractions of the viewport width. */
const VENTS = [0.06, 0.94, 0.5];

export function startSteam(canvas: HTMLCanvasElement): void {
  if (prefersReducedMotion()) {
    canvas.remove();
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const puffs: Puff[] = [];
  let w = 0, h = 0, dpr = 1;
  let raf = 0;
  let last = performance.now();
  let spawnClock = 0;

  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const spawn = () => {
    const vent = VENTS[Math.floor(Math.random() * VENTS.length)];
    const centre = vent === 0.5;
    puffs.push({
      x: vent * w + (Math.random() - 0.5) * 30,
      y: h + 20,
      vx: (Math.random() - 0.5) * 12 + (vent < 0.5 ? 6 : vent > 0.5 ? -6 : 0),
      vy: -(centre ? 22 : 34) - Math.random() * 26,
      r: 14 + Math.random() * 18,
      growth: 10 + Math.random() * 14,
      life: 0,
      maxLife: 6 + Math.random() * 5,
    });
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    spawnClock += dt;
    const rate = w < 640 ? 0.32 : 0.18;
    while (spawnClock > rate) {
      spawnClock -= rate;
      if (puffs.length < 70) spawn();
    }

    ctx.clearRect(0, 0, w, h);
    for (let i = puffs.length - 1; i >= 0; i--) {
      const p = puffs[i];
      p.life += dt;
      if (p.life > p.maxLife) {
        puffs.splice(i, 1);
        continue;
      }
      p.x += (p.vx + Math.sin((p.life + i) * 0.9) * 6) * dt;
      p.y += p.vy * dt;
      p.r += p.growth * dt;
      const t = p.life / p.maxLife;
      const alpha = Math.sin(Math.PI * t) * 0.16;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `rgba(240, 232, 214, ${alpha})`);
      g.addColorStop(1, 'rgba(240, 232, 214, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  };

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  });
  raf = requestAnimationFrame(frame);
}
