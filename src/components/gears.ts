/**
 * Interlocking gear trains drawn in SVG.
 *
 * Every gear shares one tooth module, so any two gears mesh when their centres
 * are (r1 + r2) apart. Speeds follow real gear ratios (ω1·n1 = ω2·n2) and each
 * driven gear gets a phase offset so its teeth sit in the driver's gaps.
 * Scrolling the page winds the whole train forward.
 */
import { prefersReducedMotion, s } from '../lib/dom';

const MODULE = 8;

export type Tone = 'brass' | 'copper' | 'iron';

export interface GearSpec {
  teeth: number;
  tone?: Tone;
  /** Index of an earlier gear this one meshes with. Omit for the driver. */
  meshWith?: number;
  /** Direction from the meshing gear to this one, in degrees (0 = right, 90 = down). */
  angle?: number;
  /** Mount on the same axle as gear `meshWith` instead of meshing (spins with it). */
  coaxial?: boolean;
}

interface Placed {
  spec: GearSpec;
  x: number;
  y: number;
  pitch: number;
  offset: number;
  /** Signed ratio relative to the driver: angle = offset + ratio * base. */
  ratio: number;
  rotor: SVGGElement;
}

const pitchRadius = (n: number) => (MODULE * n) / 2;
const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const mod = (a: number, m: number) => ((a % m) + m) % m;

function gearPath(n: number): string {
  const r = pitchRadius(n);
  const outer = r + MODULE;
  const root = r - 1.25 * MODULE;
  const p = (2 * Math.PI) / n;
  const pt = (radius: number, a: number) =>
    `${(radius * Math.cos(a)).toFixed(2)} ${(radius * Math.sin(a)).toFixed(2)}`;

  let d = '';
  for (let i = 0; i < n; i++) {
    const t = i * p;
    d += i === 0 ? `M ${pt(root, t - 0.25 * p)} ` : '';
    d += `L ${pt(outer, t - 0.11 * p)} `;
    d += `A ${outer} ${outer} 0 0 1 ${pt(outer, t + 0.11 * p)} `;
    d += `L ${pt(root, t + 0.25 * p)} `;
    d += `A ${root} ${root} 0 0 1 ${pt(root, t + 0.75 * p)} `;
  }
  d += 'Z ';

  // Lightening hole for larger gears (cut out with even-odd fill).
  if (n >= 14) {
    const hole = root - 1.4 * MODULE;
    d += `M ${hole} 0 A ${hole} ${hole} 0 1 0 ${-hole} 0 A ${hole} ${hole} 0 1 0 ${hole} 0 Z`;
  }
  return d;
}

function gearBody(n: number, tone: Tone): SVGGElement {
  const g = s('g', { class: `gear gear--${tone}` });
  g.append(s('path', { d: gearPath(n), 'fill-rule': 'evenodd', class: 'gear__body' }));

  const root = pitchRadius(n) - 1.25 * MODULE;
  if (n >= 14) {
    const hole = root - 1.4 * MODULE;
    const hub = Math.max(MODULE * 1.6, hole * 0.32);
    const spokes = n >= 30 ? 6 : n >= 20 ? 5 : 4;
    for (let i = 0; i < spokes; i++) {
      g.append(
        s('rect', {
          x: hub * 0.6,
          y: -MODULE * 0.55,
          width: hole - hub * 0.6 + 2,
          height: MODULE * 1.1,
          rx: MODULE * 0.3,
          transform: `rotate(${(360 / spokes) * i})`,
          class: 'gear__body',
        }),
      );
    }
    g.append(s('circle', { r: hub, class: 'gear__body' }));
    g.append(s('circle', { r: hole, class: 'gear__rim', fill: 'none' }));
    g.append(s('circle', { r: hub * 0.62, class: 'gear__hub' }));
  }
  g.append(s('circle', { r: Math.max(3, MODULE * 0.55), class: 'gear__axle' }));
  return g;
}

/** Fraction of a tooth pitch at which a gear's tooth pattern sits at angle `a`. */
const toothPhase = (a: number, offset: number, pitch: number) => mod((a - offset) / pitch, 1);

export interface GearTrain {
  svg: SVGSVGElement;
  destroy(): void;
}

export function createGearTrain(specs: GearSpec[], opts: { label?: string; speed?: number } = {}): GearTrain {
  const placed: Placed[] = [];

  specs.forEach((spec, i) => {
    const pitch = (2 * Math.PI) / spec.teeth;
    if (i === 0 || spec.meshWith === undefined) {
      placed.push({ spec, x: 0, y: 0, pitch, offset: 0, ratio: 1, rotor: s('g') });
      return;
    }
    const a = placed[spec.meshWith];
    if (spec.coaxial) {
      placed.push({ spec, x: a.x, y: a.y, pitch, offset: a.offset, ratio: a.ratio, rotor: s('g') });
      return;
    }
    const phi = rad(spec.angle ?? 0);
    const dist = pitchRadius(a.spec.teeth) + pitchRadius(spec.teeth);
    const x = a.x + dist * Math.cos(phi);
    const y = a.y + dist * Math.sin(phi);
    // Teeth mesh when the two contact phases sum to half a tooth.
    const contact = phi + Math.PI;
    const fracA = toothPhase(phi, a.offset, a.pitch);
    const offset = contact - (0.5 - fracA) * pitch;
    const ratio = -a.ratio * (a.spec.teeth / spec.teeth);
    placed.push({ spec, x, y, pitch, offset, ratio, rotor: s('g') });
  });

  // Fit the viewBox around every gear's outer radius.
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of placed) {
    const outer = pitchRadius(p.spec.teeth) + MODULE + 4;
    minX = Math.min(minX, p.x - outer);
    minY = Math.min(minY, p.y - outer);
    maxX = Math.max(maxX, p.x + outer);
    maxY = Math.max(maxY, p.y + outer);
  }

  const svg = s('svg', {
    class: 'gear-train',
    viewBox: `${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`,
    role: opts.label ? 'img' : 'presentation',
    'aria-hidden': opts.label ? 'false' : 'true',
  });
  if (opts.label) {
    const title = s('title');
    title.textContent = opts.label;
    svg.append(title);
  }

  // Draw large gears first, coaxial pinions on top of their parent.
  for (const p of placed) {
    const mount = s('g', { transform: `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})` });
    p.rotor.append(gearBody(p.spec.teeth, p.spec.tone ?? 'brass'));
    mount.append(p.rotor);
    svg.append(mount);
  }

  const reduced = prefersReducedMotion();
  const degPerSec = opts.speed ?? 14;
  let base = 0;
  let spinUp = reduced ? 1 : 0;
  let last = performance.now();
  let lastScroll = window.scrollY;
  let raf = 0;
  let visible = true;

  const render = () => {
    for (const p of placed) {
      p.rotor.setAttribute('transform', `rotate(${(deg(p.offset) + p.ratio * base).toFixed(3)})`);
    }
  };

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    spinUp = Math.min(1, spinUp + dt / 2.2);
    const eased = 1 - Math.pow(1 - spinUp, 3);
    const scrollDelta = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    base += degPerSec * eased * dt + scrollDelta * 0.25;
    if (visible) render();
    raf = requestAnimationFrame(tick);
  };

  render();
  let io: IntersectionObserver | undefined;
  if (!reduced) {
    io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(svg);
    raf = requestAnimationFrame(tick);
  }

  return {
    svg,
    destroy() {
      cancelAnimationFrame(raf);
      io?.disconnect();
    },
  };
}

/** Preset trains reused across the page. */
export const heroTrain: GearSpec[] = [
  { teeth: 36, tone: 'brass' },
  { teeth: 18, tone: 'copper', meshWith: 0, angle: -38 },
  { teeth: 12, tone: 'iron', meshWith: 1, angle: -95 },
  { teeth: 24, tone: 'copper', meshWith: 0, angle: 62 },
  { teeth: 14, tone: 'brass', meshWith: 3, angle: 10 },
  { teeth: 20, tone: 'iron', meshWith: 0, angle: 168 },
  { teeth: 10, tone: 'brass', meshWith: 5, angle: 235 },
];

export const cornerTrain: GearSpec[] = [
  { teeth: 22, tone: 'brass' },
  { teeth: 12, tone: 'copper', meshWith: 0, angle: -30 },
  { teeth: 16, tone: 'iron', meshWith: 0, angle: 70 },
];
