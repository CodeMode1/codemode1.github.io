/**
 * Reusable page pieces: riveted plates, section headers, icons, tags,
 * scroll reveals, typewriter and the nav scroll gauge.
 */
import { h, prefersReducedMotion, svgFrom } from '../lib/dom';

const ICONS = {
  bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke-width="2"/><path d="M12 7v5l3.5 2" fill="none" stroke-width="2" stroke-linecap="round"/></svg>',
  stack:
    '<svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5" fill="none" stroke-width="2" stroke-linejoin="round"/><path d="m3 17 9 5 9-5" fill="none" stroke-width="2" stroke-linejoin="round"/></svg>',
  cog:
    '<svg viewBox="0 0 24 24"><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.4 7.4 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7.4 7.4 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.4 7.4 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.4 7.4 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg>',
} as const;

export type IconName = keyof typeof ICONS;

export function icon(name: IconName, className = 'icon'): SVGSVGElement {
  const svg = svgFrom(ICONS[name].replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '));
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  return svg;
}

export function sectionHeader(kicker: string, title: string, lede?: string): HTMLElement {
  return h(
    'header',
    { class: 'section-header', 'data-reveal': '' },
    h('p', { class: 'section-header__kicker' }, h('span', { class: 'ornament', 'aria-hidden': 'true' }), kicker, h('span', { class: 'ornament', 'aria-hidden': 'true' })),
    h('h2', { class: 'section-header__title' }, title),
    lede ? h('p', { class: 'section-header__lede' }, lede) : null,
  );
}

export function plate(className: string, ...children: (Node | string | null)[]): HTMLElement {
  return h('article', { class: `plate ${className}`, 'data-reveal': '' }, ...children);
}

export function tag(label: string): HTMLElement {
  return h('span', { class: 'tag' }, label);
}

/** Fade/slide elements in as they enter the viewport, staggered per parent. */
export function initReveals(root: ParentNode = document): void {
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const siblingsIndex = new Map<Element, number>();
  for (const el of items) {
    const parent = el.parentElement ?? document.body;
    const i = siblingsIndex.get(parent) ?? 0;
    siblingsIndex.set(parent, i + 1);
    el.style.setProperty('--reveal-delay', `${Math.min(i, 8) * 90}ms`);
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );
  items.forEach((el) => io.observe(el));
}

/** Type, pause, erase and cycle through phrases. */
export function typewriter(target: HTMLElement, phrases: string[]): void {
  if (prefersReducedMotion()) {
    target.textContent = phrases[0];
    return;
  }
  let phrase = 0;
  let chars = 0;
  let deleting = false;
  const step = () => {
    const text = phrases[phrase];
    chars += deleting ? -1 : 1;
    target.textContent = text.slice(0, chars);
    let delay = deleting ? 28 : 55 + Math.random() * 40;
    if (!deleting && chars === text.length) {
      deleting = true;
      delay = 2200;
    } else if (deleting && chars === 0) {
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      delay = 400;
    }
    window.setTimeout(step, delay);
  };
  window.setTimeout(step, 900);
}

/** Fill the nav's pressure pipe as the page scrolls and highlight the current section. */
export function initNav(nav: HTMLElement): void {
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  const sections = links
    .map((a) => document.querySelector<HTMLElement>(a.getAttribute('href') ?? ''))
    .filter((el): el is HTMLElement => el !== null);

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.style.setProperty('--progress', String(max > 0 ? window.scrollY / max : 0));
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.35) current = section.id;
    }
    for (const a of links) a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  const toggle = nav.querySelector<HTMLButtonElement>('.nav__toggle');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }),
  );
}
