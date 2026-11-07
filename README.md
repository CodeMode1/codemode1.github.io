# codemode1.github.io

Steampunk-themed portfolio for **CodeMode1**, live at <https://codemode1.github.io>.

Built with **TypeScript + Vite**, no UI framework: the visuals (interlocking SVG gear
trains, steam particles, pressure gauges) are small reusable components in `src/components/`.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dev dependencies |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run fetch-repos` | Re-sniff public GitHub repos into `src/data/repos.json` |

## Where things live

- `src/data/profile.ts`: hand-written content (expertise, creed, featured projects, timeline, interests)
- `src/data/repos.json`: generated snapshot of public repos (languages, dates, descriptions); private repos are skipped
- `src/components/gears.ts`: gear trains with real gear ratios and tooth meshing; scrolling winds them
- `src/components/gauge.ts`: pressure gauges fed by real repo counts
- `src/components/steam.ts`: canvas steam puffs
- `src/components/ui.ts`: plates, section headers, reveals, typewriter, nav
- `scripts/fetch-repos.ts`: the GitHub API sniffer

Animations respect `prefers-reduced-motion`.

## Deployment

`.github/workflows/deploy.yml` builds on every pull request and deploys `main` to GitHub Pages.
Pages must be set to **Source: GitHub Actions** (Settings → Pages) for the deploy job to publish.
