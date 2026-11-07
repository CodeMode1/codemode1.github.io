/**
 * Sniffs the public GitHub repositories of a user and writes a snapshot to
 * src/data/repos.json. The site reads that snapshot at build time, so the
 * deployed page never calls the GitHub API (no rate limits, no tokens).
 *
 *   npm run fetch-repos
 *
 * Optional env: GH_USER (default CodeMode1), GITHUB_TOKEN (raises rate limit).
 * Private repositories are always skipped.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const USER = process.env.GH_USER ?? 'CodeMode1';
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/repos.json');

const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'codemode1-portfolio-build',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText} for ${path}`);
  return (await res.json()) as T;
}

interface ApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  fork: boolean;
  private: boolean;
  created_at: string;
  pushed_at: string;
  topics?: string[];
  stargazers_count: number;
}

interface ApiRepoFull {
  parent?: { full_name: string; html_url: string };
}

const list = await gh<ApiRepo[]>(`/users/${USER}/repos?per_page=100&type=owner&sort=pushed`);
const siteRepo = `${USER.toLowerCase()}.github.io`;

const repos = [];
for (const r of list) {
  if (r.private || r.name.toLowerCase() === siteRepo) continue;

  const languages = await gh<Record<string, number>>(`/repos/${USER}/${r.name}/languages`);
  let parent: { fullName: string; url: string } | undefined;
  if (r.fork) {
    const full = await gh<ApiRepoFull>(`/repos/${USER}/${r.name}`);
    if (full.parent) parent = { fullName: full.parent.full_name, url: full.parent.html_url };
  }

  repos.push({
    name: r.name,
    description: r.description ?? '',
    url: r.html_url,
    fork: r.fork,
    parent,
    createdAt: r.created_at,
    pushedAt: r.pushed_at,
    topics: r.topics ?? [],
    stars: r.stargazers_count,
    languages,
  });
}

await mkdir(dirname(OUT), { recursive: true });
await writeFile(
  OUT,
  JSON.stringify({ user: USER, generatedAt: new Date().toISOString(), repos }, null, 2) + '\n',
  'utf8',
);
console.log(`Wrote ${repos.length} public repositories to ${OUT}`);
