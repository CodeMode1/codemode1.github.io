/**
 * Hand-written portfolio content. Repository facts (languages, dates,
 * descriptions) come from the generated repos.json snapshot instead.
 */

export type Tag = 'Angular' | 'MEAN' | '.NET' | 'Components' | 'Vue' | 'TypeScript' | 'AI tooling';

export const profile = {
  handle: 'CodeMode1',
  github: 'https://github.com/CodeMode1',
  role: 'Full-stack engineer · .NET & Angular',
  intro:
    'I build web applications end to end: ASP.NET and Node back ends, Angular front ends, ' +
    'live data over SignalR and dependable background work with Hangfire. ' +
    'I favour proven component libraries over hand-rolled widgets, so teams ship sooner and maintain less.',
  taglines: [
    'Forging real-time systems with SignalR',
    'Running the night shift with Hangfire',
    'Assembling UIs from proven components',
    'Crafting skills & agents for AI tooling',
  ],
};

export interface Expertise {
  icon: 'bolt' | 'clock' | 'stack';
  kicker: string;
  title: string;
  body: string;
  points: string[];
}

export const expertise: Expertise[] = [
  {
    icon: 'bolt',
    kicker: 'Real-time',
    title: 'Live data over SignalR & WebSockets',
    body: 'Servers push updates the moment they happen, so screens stay current without polling.',
    points: ['ASP.NET SignalR hubs', 'WebSocket transport', 'Live dashboards & notifications'],
  },
  {
    icon: 'clock',
    kicker: 'Background work',
    title: 'Dependable jobs with Hangfire',
    body: 'Slow or scheduled work moves off the request path into persistent, retryable jobs.',
    points: ['Fire-and-forget & delayed jobs', 'Recurring schedules', 'Automatic retries & monitoring'],
  },
  {
    icon: 'stack',
    kicker: 'Full stack',
    title: '.NET, Angular & the MEAN stack',
    body: 'From ASP.NET Core APIs with Angular clients to MongoDB, Express, Angular and Node.',
    points: ['ASP.NET Core & MVC', 'Angular (2 → modern)', 'MongoDB · Express · Node'],
  },
];

/** The architectural constraint the user asked to feature prominently. */
export const creed = {
  title: 'Reuse before you rebuild',
  body:
    'Where a proven client-side component fits, I integrate it rather than hand-roll it. ' +
    'Data grids, schedulers, pickers and dialogs from mature libraries arrive tested, accessible ' +
    'and documented, which speeds up development and keeps maintenance light.',
  libraries: [
    { name: 'AG Grid', note: 'High-volume data grids' },
    { name: 'Telerik Kendo UI', note: 'Grids, charts, scheduler' },
    { name: 'PrimeNG', note: 'Rich Angular component suite' },
    { name: 'Angular Material', note: 'Material Design building blocks' },
  ],
  styling: [
    { name: 'Bootstrap', note: 'Layout & utilities across many projects' },
    { name: 'Tailwind CSS', note: 'Utility-first styling' },
    { name: 'SCSS / Less', note: 'Structured stylesheets' },
  ],
};

export interface Interest {
  title: string;
  body: string;
}

export const interests: Interest[] = [
  { title: 'Docker', body: 'Reproducible containers from laptop to production.' },
  { title: 'Microservices', body: 'Small, independently deployable services with clear boundaries.' },
  { title: 'Skills & agents', body: 'Building skills and agents that put AI tooling to work.' },
  { title: 'Open source', body: 'Following, forking and contributing to community projects.' },
];

export interface Featured {
  repo: string;
  title: string;
  blurb: string;
  tags: Tag[];
}

/** Curated highlights. Each entry must match a public repo name in repos.json. */
export const featured: Featured[] = [
  {
    repo: 'SarahProject-Final',
    title: 'Client & Event Manager',
    blurb:
      'MEAN-stack single-page app managing clients, events, activities and resources through a ' +
      'Telerik Kendo UI agenda, with JWT authentication and Mongoose models.',
    tags: ['MEAN', 'Angular', 'Components', 'TypeScript'],
  },
  {
    repo: 'Kendo-UI-Angular2-Components-Demo',
    title: 'Kendo UI for Angular Showcase',
    blurb:
      'A tour of Telerik Kendo UI for Angular: grid, charts, date inputs, dropdowns, dialogs, ' +
      'layout, sortable and upload, server-rendered with ASP.NET Core.',
    tags: ['Components', 'Angular', '.NET', 'TypeScript'],
  },
  {
    repo: 'WineTracker',
    title: 'Wine Tracker',
    blurb:
      'Wine management app pairing an ASP.NET Core back end with an Angular client, ' +
      'OpenID Connect sign-in and Bootstrap styling.',
    tags: ['.NET', 'Angular', 'TypeScript'],
  },
  {
    repo: 'Angular2CoreSeed2',
    title: 'ASP.NET Core + Angular Seed',
    blurb: 'Starter combining ASP.NET Core and Angular with Identity and many-to-many data relationships.',
    tags: ['.NET', 'Angular', 'TypeScript'],
  },
  {
    repo: 'AotWebpackCompiler-V.Angular5',
    title: 'Angular 5 AOT Build',
    blurb: 'Ahead-of-time compilation for Angular 5 using angularCompilerOptions and @ngtools/webpack.',
    tags: ['Angular', '.NET', 'TypeScript'],
  },
  {
    repo: 'Ng2Messages',
    title: 'MEAN Messages',
    blurb: 'CRUD messaging app on the MEAN stack where only a message’s owner may edit or delete it.',
    tags: ['MEAN', 'Angular', 'TypeScript'],
  },
  {
    repo: 'angular-froala-wysiwyg',
    title: 'Angular Froala Editor (fork)',
    blurb: 'Fork of the Angular plugin for the Froala WYSIWYG rich-text editor, a third-party component integration.',
    tags: ['Components', 'Angular', 'TypeScript'],
  },
  {
    repo: 'vue-project',
    title: 'Vue 3 Playground',
    blurb: 'Vue 3 with Pinia, Vue Router, Vite and TypeScript, exploring a second component framework.',
    tags: ['Vue', 'TypeScript'],
  },
  {
    repo: 'tailwind-buddy',
    title: 'Tailwind Buddy (fork)',
    blurb: 'Fork of a helper for composing Tailwind CSS classes into reusable component variants.',
    tags: ['Components', 'Vue', 'TypeScript'],
  },
  {
    repo: 'Aurelia-Getting-Started',
    title: 'Aurelia Exploration',
    blurb: 'Aurelia with TypeScript, webpack and Jest, comparing another SPA framework.',
    tags: ['TypeScript'],
  },
  {
    repo: 'engineering-standards',
    title: 'Engineering Guardrails (fork)',
    blurb: 'Executable engineering standards and AI-assisted engineering practices.',
    tags: ['AI tooling'],
  },
  {
    repo: 'statusline',
    title: 'CLI Status Line (fork)',
    blurb: 'Custom status line for an AI coding CLI, written in PowerShell.',
    tags: ['AI tooling'],
  },
];

/** Framework readings for the gauges: public repos that use each framework. */
export const frameworkRepos: Record<string, string[]> = {
  Angular: [
    'Ng2Messages', 'Ng2Service', 'Ng2Routing', 'Ng2RecipeBook', 'Ng2Pipes', 'Ng2Heroes',
    'Ng2ngContent', 'Ng2Http', 'Ng2Forms', 'Ng2DataBinding', 'Ng2Auth', 'Ng2Attributes', 'APM',
    'Angular2CoreSeed', 'Angular2CoreSeed1', 'Angular2CoreSeed2', 'Kendo-UI-Angular2-Components-Demo',
    'AotWebpackCompiler-V.Angular5', 'angular-multiselect', 'SarahProject-Final', 'WineTracker',
    'baby-random-chooser',
  ],
  'MEAN / MEN': ['SarahProject-Final', 'Ng2Messages', 'MenNotes', 'ExpressLibraryApp'],
  '.NET': [
    'WineTracker', 'Angular2CoreSeed', 'Angular2CoreSeed1', 'Angular2CoreSeed2',
    'Kendo-UI-Angular2-Components-Demo', 'AotWebpackCompiler-V.Angular5', 'CarteRistourneMVC4',
  ],
};

export interface Milestone {
  year: string;
  title: string;
  body: string;
}

export const chronicle: Milestone[] = [
  { year: '2016', title: 'First gears turn', body: 'TypeScript and a Telerik scheduler power the first event-management builds.' },
  { year: '2017', title: 'Angular 2 meets ASP.NET Core', body: 'A dozen Angular study projects, MEAN apps, Core seeds and a Kendo UI showcase.' },
  { year: '2018', title: 'Ahead-of-time', body: 'Angular 5 AOT compilation wired through webpack.' },
  { year: '2020', title: 'MEAN in production shape', body: 'A full MEAN SPA as a final project, plus Flutter with Firebase auth.' },
  { year: '2021', title: 'Going real-time', body: 'ASP.NET SignalR pushes live updates to the browser.' },
  { year: '2022', title: 'Core + Angular + OIDC', body: 'Wine Tracker pairs ASP.NET Core with an Angular client and OpenID Connect.' },
  { year: '2025', title: 'New frameworks', body: 'Vue 3, Pinia, Vite and Tailwind join the toolbox, alongside LLM engineering notes.' },
  { year: '2026', title: 'Skills & agents', body: 'AI agents, skills, engineering guardrails and CLI tooling.' },
];
