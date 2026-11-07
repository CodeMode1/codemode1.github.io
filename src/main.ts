import './styles.css';
import data from './data/repos.json';
import { chronicle, creed, expertise, featured, frameworkRepos, interests, profile, type Tag } from './data/profile';
import { h } from './lib/dom';
import { cornerTrain, createGearTrain, heroTrain } from './components/gears';
import { createGauge } from './components/gauge';
import { startSteam } from './components/steam';
import { icon, initNav, initReveals, plate, sectionHeader, tag, typewriter } from './components/ui';

interface Repo {
  name: string;
  description: string;
  url: string;
  fork: boolean;
  parent?: { fullName: string; url: string };
  createdAt: string;
  pushedAt: string;
  languages: Record<string, number>;
}

const repos = data.repos as unknown as Repo[];
const byName = new Map(repos.map((r) => [r.name, r]));
const ownRepos = repos.filter((r) => !r.fork);
const year = (iso: string) => iso.slice(0, 4);
const topLanguages = (r: Repo, n = 3) =>
  Object.entries(r.languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([lang]) => lang);

const mount = (id: string, ...nodes: Node[]) => document.getElementById(id)?.append(...nodes);
const container = (...nodes: (Node | null)[]) => h('div', { class: 'container' }, ...nodes);

/** Display fonts draw "1" like a capital I, so digits get a lining-numeral face. */
const brandName = (name: string): Node[] =>
  name.split(/(\d+)/).filter(Boolean).map((part) => (/^\d+$/.test(part) ? h('span', { class: 'digit' }, part) : document.createTextNode(part)));

/* ---------- Hero ---------- */
function renderHero() {
  const typed = h('span', { class: 'hero__typed' });
  const train = createGearTrain(heroTrain, { speed: 12 });
  const firstYear = Math.min(...ownRepos.map((r) => Number(year(r.createdAt))));

  mount(
    'hero',
    container(
      h(
        'div',
        { class: 'hero__grid' },
        h(
          'div',
          { class: 'hero__copy' },
          h('p', { class: 'hero__eyebrow' }, 'Est. ', String(firstYear), ' · Workshop of'),
          h('h1', { class: 'hero__title' }, ...brandName(profile.handle)),
          h('p', { class: 'hero__role' }, profile.role),
          h('p', { class: 'hero__tagline' }, typed, h('span', { class: 'hero__caret', 'aria-hidden': 'true' })),
          h('p', { class: 'hero__intro' }, profile.intro),
          h(
            'div',
            { class: 'hero__actions' },
            h('a', { class: 'btn btn--brass', href: '#workshop' }, icon('cog', 'btn__icon'), 'Tour the workshop'),
            h('a', { class: 'btn btn--ghost', href: profile.github, target: '_blank', rel: 'noopener' }, icon('github', 'btn__icon'), 'GitHub'),
          ),
          h(
            'dl',
            { class: 'hero__stats' },
            stat(String(ownRepos.length), 'public builds'),
            stat(String(new Date().getFullYear() - firstYear), 'years at the bench'),
            stat(String(frameworkRepos.Angular.filter((n) => byName.has(n)).length), 'Angular projects'),
          ),
        ),
        h('div', { class: 'hero__machine' }, h('div', { class: 'hero__halo', 'aria-hidden': 'true' }), train.svg),
      ),
    ),
    h('a', { class: 'hero__scroll', href: '#engine-room', 'aria-label': 'Scroll to the engine room' }, h('span', { 'aria-hidden': 'true' })),
  );
  typewriter(typed, profile.taglines);
}

function stat(value: string, label: string) {
  return h('div', { class: 'stat' }, h('dt', { class: 'stat__value' }, value), h('dd', { class: 'stat__label' }, label));
}

/* ---------- Engine room: core expertise ---------- */
function renderEngineRoom() {
  mount(
    'engine-room',
    container(
      sectionHeader('The Engine Room', 'What keeps the machine running', 'Three specialities I bring to every build.'),
      h(
        'div',
        { class: 'grid grid--3' },
        ...expertise.map((x) =>
          plate(
            'expertise',
            h('div', { class: 'expertise__icon' }, icon(x.icon)),
            h('p', { class: 'kicker' }, x.kicker),
            h('h3', { class: 'plate__title' }, x.title),
            h('p', { class: 'plate__body' }, x.body),
            h('ul', { class: 'rivet-list' }, ...x.points.map((p) => h('li', {}, p))),
          ),
        ),
      ),
    ),
  );
}

/* ---------- Creed: component reuse ---------- */
function renderCreed() {
  const corner = createGearTrain(cornerTrain, { speed: 10 });
  corner.svg.classList.add('creed__gears');

  const libCard = (l: { name: string; note: string }) =>
    h('li', { class: 'lib', 'data-reveal': '' }, h('span', { class: 'lib__name' }, l.name), h('span', { class: 'lib__note' }, l.note));

  mount(
    'creed',
    container(
      sectionHeader('Engineering Creed', creed.title),
      h(
        'div',
        { class: 'creed', 'data-reveal': '' },
        corner.svg,
        h('blockquote', { class: 'creed__quote' }, h('p', {}, creed.body)),
        h('h3', { class: 'creed__subhead' }, 'Component libraries I integrate'),
        h('ul', { class: 'lib-grid' }, ...creed.libraries.map(libCard)),
        h('h3', { class: 'creed__subhead' }, 'Styling frameworks'),
        h('ul', { class: 'lib-grid lib-grid--small' }, ...creed.styling.map(libCard)),
      ),
    ),
  );
}

/* ---------- Gauges: real readings from the repo snapshot ---------- */
function renderGauges() {
  const total = ownRepos.length;
  const langCount = (lang: string) => ownRepos.filter((r) => lang in r.languages).length;
  const readings = [
    { label: 'TypeScript', value: langCount('TypeScript') },
    { label: 'JavaScript', value: langCount('JavaScript') },
    { label: 'C#', value: langCount('C#') },
    ...Object.entries(frameworkRepos).map(([label, names]) => ({
      label,
      value: names.filter((n) => byName.get(n) && !byName.get(n)!.fork).length,
    })),
  ];

  mount(
    'gauges',
    container(
      sectionHeader(
        'Pressure Gauges',
        'Languages & frameworks',
        `Each dial reads how many of my ${total} public repositories use it, measured straight from GitHub.`,
      ),
      h('div', { class: 'gauge-grid' }, ...readings.map((r) => createGauge({ ...r, max: total, unit: 'repos' }))),
    ),
  );
}

/* ---------- Workshop: featured projects + full ledger ---------- */
function renderWorkshop() {
  const filters: ('All' | Tag)[] = ['All', 'Angular', 'MEAN', '.NET', 'Components', 'Vue', 'AI tooling'];
  const cards = featured
    .filter((f) => byName.has(f.repo))
    .map((f) => {
      const r = byName.get(f.repo)!;
      return h(
        'article',
        { class: 'project plate', 'data-reveal': '', 'data-tags': f.tags.join('|') },
        h('div', { class: 'project__cog', 'aria-hidden': 'true' }, icon('cog')),
        h('p', { class: 'project__meta' }, year(r.createdAt), r.fork ? ' · fork' : '', ' · ', topLanguages(r).join(' · ')),
        h('h3', { class: 'plate__title' }, f.title),
        h('p', { class: 'plate__body' }, f.blurb),
        h('div', { class: 'project__tags' }, ...f.tags.map(tag)),
        h('a', { class: 'project__link', href: r.url, target: '_blank', rel: 'noopener' }, 'View ', h('code', {}, r.name), ' →'),
      );
    });

  const buttons = filters.map((f, i) =>
    h('button', { class: 'chip', type: 'button', 'data-filter': f, 'aria-pressed': i === 0 ? 'true' : 'false' }, f),
  );
  const grid = h('div', { class: 'grid grid--projects' }, ...cards);

  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter!;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      for (const card of cards) {
        const show = f === 'All' || (card.dataset.tags ?? '').split('|').includes(f);
        if (show) {
          card.hidden = false;
          requestAnimationFrame(() => card.classList.remove('is-filtered'));
        } else {
          card.classList.add('is-filtered');
          window.setTimeout(() => card.classList.contains('is-filtered') && (card.hidden = true), 280);
        }
      }
    }),
  );

  const ledgerRows = [...repos]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r) =>
      h(
        'tr',
        {},
        h('td', { 'data-label': 'Year' }, year(r.createdAt)),
        h('td', { 'data-label': 'Repository' }, h('a', { href: r.url, target: '_blank', rel: 'noopener' }, r.name), r.fork ? h('span', { class: 'ledger__fork' }, 'fork') : null),
        h('td', { 'data-label': 'Languages' }, topLanguages(r).join(', ') || '—'),
        h('td', { 'data-label': 'Notes' }, r.description || '—'),
      ),
    );

  mount(
    'workshop',
    container(
      sectionHeader('The Workshop', 'Selected builds', 'Highlights from GitHub. Filter by the machinery involved.'),
      h('div', { class: 'chips', role: 'group', 'aria-label': 'Filter projects' }, ...buttons),
      grid,
      h(
        'details',
        { class: 'ledger', 'data-reveal': '' },
        h('summary', {}, `Open the full ledger · ${repos.length} public repositories`),
        h(
          'div',
          { class: 'ledger__scroll' },
          h(
            'table',
            {},
            h('thead', {}, h('tr', {}, h('th', {}, 'Year'), h('th', {}, 'Repository'), h('th', {}, 'Languages'), h('th', {}, 'Notes'))),
            h('tbody', {}, ...ledgerRows),
          ),
        ),
        h('p', { class: 'ledger__stamp' }, `Ledger compiled from GitHub on ${new Date(data.generatedAt).toLocaleDateString('en-CA')}`),
      ),
    ),
  );
}

/* ---------- Chronicle: timeline ---------- */
function renderChronicle() {
  mount(
    'chronicle',
    container(
      sectionHeader('The Chronicle', 'A decade at the bench'),
      h(
        'ol',
        { class: 'timeline' },
        ...chronicle.map((m) =>
          h(
            'li',
            { class: 'timeline__item', 'data-reveal': '' },
            h('span', { class: 'timeline__valve', 'aria-hidden': 'true' }),
            h('div', { class: 'timeline__card plate' }, h('p', { class: 'timeline__year' }, m.year), h('h3', { class: 'plate__title' }, m.title), h('p', { class: 'plate__body' }, m.body)),
          ),
        ),
      ),
    ),
  );
}

/* ---------- Inventions: interests ---------- */
function renderInventions() {
  mount(
    'inventions',
    container(
      sectionHeader('Future Inventions', 'On the drawing board', 'Where my curiosity is heading next.'),
      h(
        'div',
        { class: 'grid grid--4' },
        ...interests.map((x, i) =>
          h(
            'article',
            { class: 'blueprint', 'data-reveal': '' },
            h('span', { class: 'blueprint__no' }, `Fig. ${i + 1}`),
            h('h3', { class: 'blueprint__title' }, x.title),
            h('p', { class: 'blueprint__body' }, x.body),
          ),
        ),
      ),
    ),
  );
}

function renderFooter() {
  mount(
    'footer',
    container(
      h('p', { class: 'footer__signal' }, 'Send a signal to the workshop'),
      h('a', { class: 'btn btn--brass', href: profile.github, target: '_blank', rel: 'noopener' }, icon('github', 'btn__icon'), 'github.com/CodeMode1'),
      h('p', { class: 'footer__fine' }, `© ${new Date().getFullYear()} ${profile.handle} · Hand-built in TypeScript, powered by steam.`),
    ),
  );
}

renderHero();
renderEngineRoom();
renderCreed();
renderGauges();
renderWorkshop();
renderChronicle();
renderInventions();
renderFooter();

initNav(document.querySelector<HTMLElement>('.nav')!);
initReveals();
startSteam(document.querySelector<HTMLCanvasElement>('.steam')!);
document.body.classList.add('is-ready');
