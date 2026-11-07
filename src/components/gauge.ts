/**
 * Brass pressure gauge. The needle sweeps to its reading (with a little
 * mechanical overshoot) when the gauge scrolls into view.
 */
import { h, s } from '../lib/dom';

export interface GaugeOptions {
  label: string;
  value: number;
  max: number;
  unit: string;
}

const CX = 100;
const CY = 100;
const R = 78;

function polar(r: number, angleDeg: number) {
  const a = ((angleDeg - 180) * Math.PI) / 180; // 0° = far left, 180° = far right
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

export function createGauge({ label, value, max, unit }: GaugeOptions): HTMLElement {
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  const svg = s('svg', { viewBox: '0 0 200 122', class: 'gauge__dial', 'aria-hidden': 'true' });

  svg.append(s('path', { d: `M ${CX - R - 12} ${CY} A ${R + 12} ${R + 12} 0 0 1 ${CX + R + 12} ${CY}`, class: 'gauge__bezel' }));
  svg.append(s('path', { d: `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY} Z`, class: 'gauge__face' }));

  // Red zone over the last fifth of the dial.
  const rz0 = polar(R - 6, 144);
  const rz1 = polar(R - 6, 180);
  svg.append(s('path', { d: `M ${rz0.x} ${rz0.y} A ${R - 6} ${R - 6} 0 0 1 ${rz1.x} ${rz1.y}`, class: 'gauge__redzone' }));

  for (let i = 0; i <= 20; i++) {
    const major = i % 5 === 0;
    const a = (180 / 20) * i;
    const p0 = polar(R - 2, a);
    const p1 = polar(R - (major ? 16 : 9), a);
    svg.append(s('line', { x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, class: major ? 'gauge__tick gauge__tick--major' : 'gauge__tick' }));
  }

  const needle = s('g', { class: 'gauge__needle' });
  needle.append(s('path', { d: `M ${CX - 3.5} ${CY} L ${CX} ${CY - R + 14} L ${CX + 3.5} ${CY} Z` }));
  svg.append(needle);
  svg.append(s('circle', { cx: CX, cy: CY, r: 9, class: 'gauge__pivot' }));
  svg.append(s('circle', { cx: CX, cy: CY, r: 3.5, class: 'gauge__pivot-cap' }));

  const readout = h('span', { class: 'gauge__value' }, '0');
  const el = h(
    'figure',
    {
      class: 'gauge',
      'data-reveal': '',
      style: `--needle: ${(-90 + 180 * ratio).toFixed(1)}deg`,
      role: 'img',
      'aria-label': `${label}: ${value} of ${max} ${unit}`,
    },
    svg,
    h('figcaption', { class: 'gauge__caption' }, h('span', { class: 'gauge__label' }, label), h('span', { class: 'gauge__reading' }, readout, ` / ${max} ${unit}`)),
  );

  // Count the readout up alongside the needle.
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 1400);
        readout.textContent = String(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },
    { threshold: 0.4 },
  );
  observer.observe(el);
  return el;
}
