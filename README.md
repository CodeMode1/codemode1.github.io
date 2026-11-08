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

### Version tags

After each successful deploy of `main`, the `tag` job tags the deployed commit with the next
semantic version. It reads every commit message (title and body) since the last `v*` tag, in
[Conventional Commits](https://www.conventionalcommits.org/) style, and applies the single
highest bump it finds:

| Bump | When | Example message | Result from `v1.0.2` |
| --- | --- | --- | --- |
| **Major** | A line starts with `BREAKING CHANGE:` or `BREAKING-CHANGE:`, or a title uses `!` after the type | `feat!: new layout`<br>`refactor(api)!: drop v1`<br>body line `BREAKING CHANGE: removed old URLs` | `v2.0.0` |
| **Minor** | A line starts with `feat:` or `feat(scope):` | `feat: dark mode toggle`<br>`feat(gauges): live repo counts` | `v1.1.0` |
| **Patch** | Anything else | `fix: gear alignment`<br>`ci: …`, `docs: …`, `chore: …`<br>`Update readme` | `v1.0.3` |

If there are no tags yet, it counts from `v0.0.0`. If the commit already has a `v*` tag, the job
skips tagging. A GitHub merge commit includes the PR title in its body, so a PR titled
`feat: …` produces a minor bump.
