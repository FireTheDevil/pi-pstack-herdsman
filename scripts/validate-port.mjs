import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash, packageInventory } from './manifest.mjs';
import { staleBackend } from './backend-contract.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'PORT-MANIFEST.json'), 'utf8'));
const inventory = packageInventory(root, manifest);
const resources = inventory.resources;
const skills = resources.filter(path => path.endsWith('/SKILL.md'));
assert.equal(skills.length, 50);
assert.equal(resources.filter(path => path.includes('/playbooks/') && path.endsWith('.md')).length, 23);
for (const path of skills) {
  const text = readFileSync(join(root, path), 'utf8');
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(fm, path);
  assert.match(fm[1], /^disable-model-invocation: true$/m, path);
  assert.match(fm[1], /^name: [a-z0-9-]+$/m, path);
}
for (const path of resources.filter(path => path.endsWith('.md'))) {
  const text = readFileSync(join(root, path), 'utf8');
  assert.ok(!staleBackend.test(text), 'Stale backend: ' + path);
  for (const match of text.matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
    const href = match[1].split('#')[0];
    if (!href || href === 'url' || /^(?:[a-z]+:|\/)/i.test(href) || href.includes('<')) continue;
    const target = resolve(root, dirname(path), href);
    const rel = relative(root, target);
    assert.ok(!rel.startsWith('..') && !isAbsolute(rel), 'Link escapes: ' + path);
    assert.ok(existsSync(target), 'Broken link: ' + path + ' -> ' + href);
  }
}
const lock = JSON.parse(readFileSync(join(root, 'upstream.lock.json'), 'utf8'));
assert.deepEqual(manifest.upstream, lock, 'Current upstream metadata matches lock');
assert.equal(manifest.backend.inspectedVersion, lock.backend.inspectedVersion, 'Current backend target');
for (const name of ['benchmark-checklist', 'correct', 'principle-explain-the-number']) {
  const path = 'skills/' + name + '/SKILL.md';
  const text = readFileSync(join(root, path), 'utf8');
  assert.match(text, /^description: "[^\n]+"$/m, path);
  assert.match(text, /read-only/i, 'Read-only capability gate: ' + path);
  assert.match(text, /authoriz/i, 'Assignment authority gate: ' + path);
  assert.match(text, /gap|inconclusive/i, 'Missing evidence gate: ' + path);
  const record = manifest.resources.find(r => r.destination === path);
  assert.equal(record.sourceRepository, lock.originalUpstream.repository, path);
  assert.equal(record.sourceCommit, lock.reviewedUpstream.pstackChangeCommit, path);
  assert.match(record.sourceSha256, /^[a-f0-9]{64}$/, path);
}
assert.ok(!resources.some(path => path.startsWith('skills/make-bot-ui/')), 'User excluded make-bot-ui');
assert.deepEqual(manifest.resources.map(r => r.destination).sort(), resources.sort(), 'Complete provenance inventory');
for (const record of manifest.resources) {
  assert.equal(hash(join(root, record.destination)), record.destinationSha256, record.destination);
  assert.equal(record.disposition, record.sourceSha256 === record.destinationSha256 ? 'adopted' : 'adapted');
}
for (const record of manifest.generated) assert.equal(hash(join(root, record.path)), record.sha256, record.path);
assert.deepEqual(manifest.generated.map(record => record.path).sort(), inventory.generated, 'Complete generated inventory');
for (const path of inventory.paths.filter(path => /\.(?:ts|mjs)$/.test(path) && !path.startsWith('skills/') && !path.startsWith('test/'))) {
  const text = readFileSync(join(root, path), 'utf8');
  assert.ok(!/(?:from\s+|import\s*\()["'][^"']*\.\.\/pi-pstack/.test(text), path);
}
assert.match(readFileSync(join(root, 'skills/poteto-mode/SKILL.md'), 'utf8'), /ordinary replies.*without loading unslop/i);
assert.match(readFileSync(join(root, 'skills/poteto-mode/SKILL.md'), 'utf8'), /Reuse that text/);
assert.match(readFileSync(join(root, 'skills/typescript-best-practices/SKILL.md'), 'utf8'), /writing|modifying/i);
const runtime = readFileSync(join(root, 'skills/poteto-mode/references/herdsman-runtime.md'), 'utf8');
assert.match(runtime, /There is no wait\/join\/collection call/);
assert.match(runtime, /exact returned Pi session/);
assert.match(runtime, /available_tools/);
console.log(JSON.stringify({ skills: skills.length, playbooks: 23, resources: resources.length, validation: 'metadata, links, backend, complete hashes, standalone imports' }));
