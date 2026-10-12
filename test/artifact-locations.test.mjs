import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { hash } from '../scripts/manifest.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const configPath = 'config/artifact-locations.md';
const consumers = [
  'skills/poteto-mode/playbooks/orchestrate.md',
  'skills/poteto-mode/playbooks/pause-safely.md',
  'skills/show-me-your-work/SKILL.md',
];

test('three workflows read one shared configuration without duplicating its root', () => {
  for (const path of consumers) {
    const text = read(path);
    const link = text.match(/Read \[artifact locations\]\(([^)]+)\)/);
    assert.ok(link, path);
    assert.equal(resolve(root, dirname(path), link[1]), resolve(root, configPath), path);
    assert.doesNotMatch(text, /\.pi-herdsman\//, path);
    assert.match(text, /explicit paths and existing adequate artifacts/, path);
  }
  const orchestrate = read(consumers[0]);
  assert.doesNotMatch(orchestrate, /current agent's store \(path in the system prompt\)/);
  assert.match(orchestrate, /CLI still requires `--store <resolved-store-path>` or `ORCH_STORE`/);
  assert.match(orchestrate, /chosen absolute path on every invocation/);
  assert.match(orchestrate, /does not read the configuration/);
  assert.doesNotMatch(read(consumers[1]), /\/tmp\//);
  assert.doesNotMatch(read(consumers[2]), /\.audit\/|`decisions.tsv` in the work dir/);
});

test('configuration defines project-relative defaults and authority/storage boundaries', () => {
  const config = read(configPath);
  for (const row of [
    '| Project base | Active project\'s cwd/workspace, not the installed skill package |',
    '| Artifact root | `.pi-herdsman/`, relative to the project base |',
    '| Decision log | `<artifact-root>/decisions.tsv` |',
    '| Concurrent task decision log | `<artifact-root>/decisions/<task-slug>.tsv` |',
    '| Resume note | `<artifact-root>/resume/<slug>-resume.md` |',
    '| Handoff note | `<artifact-root>/handoffs/<slug>.md` |',
    '| Orchestrate store | `<artifact-root>/orchestrate/<project-slug>/` |',
  ]) assert.ok(config.includes(row), row);
  for (const boundary of [
    /not a Herdsman agent definition/,
    /No runtime parser or automatic enforcement reads this file/,
    /explicit user or assignment paths first.*Otherwise reuse existing adequate artifacts/s,
    /Orchestrate's `decisions.tsv`.*takes precedence/s,
    /Do not resolve them against this configuration file or the installed skill package/,
    /only with write authority.*grants no write authority/s,
    /read-only agent returns its evidence to its owner/,
    /Do not automatically migrate, rename, or delete/,
    /ordinary working artifacts untracked/,
    /Preserve approved permanent audits.*approved locations and tracking/,
    /does not change git configuration or grant commit authority/,
    /canonical files and exact result refs unchanged through `files`/,
    /does not move or configure Herdsman runtime result\/session storage/,
  ]) assert.match(config, boundary);
});

test('configuration ships as an exact generated member, with a README link', () => {
  const pkg = JSON.parse(read('package.json'));
  const manifest = JSON.parse(read('PORT-MANIFEST.json'));
  assert.equal(pkg.files.filter(path => path === configPath).length, 1);
  assert.equal(manifest.resources.some(record => record.destination === configPath), false);
  const generated = manifest.generated.filter(record => record.path === configPath);
  assert.equal(generated.length, 1);
  assert.equal(generated[0].sha256, hash(resolve(root, configPath)));
  assert.match(read('README.md'), /\[Artifact locations\]\(config\/artifact-locations.md\).*central model-readable configuration/s);
  assert.match(read('README.md'), /not runtime-enforced settings/);
});
