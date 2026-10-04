import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'PORT-MANIFEST.json')));
const approved = [...manifest.resources.map(r => r.destination), ...manifest.generated.map(r => r.path).filter(p => !['.gitignore', '.pi-herdsman/adapter-handoff.md'].includes(p)), 'PORT-MANIFEST.json'].sort();
const readManifest = dir => JSON.parse(readFileSync(join(dir, 'PORT-MANIFEST.json')));
const refresh = dir => spawnSync(process.execPath, ['scripts/update-manifest.mjs'], { cwd: dir, encoding: 'utf8' });
const provenance = m => ({ ...m, resources: m.resources.map(({ destinationSha256, disposition, ...history }) => history), generated: undefined, generatedHistory: undefined });
function fixture(t) {
  const dir = mkdtempSync(join(root, '.pi-herdsman/tmp/package-inventory-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const path of approved) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    cpSync(join(root, path), join(dir, path));
  }
  return dir;
}
function savePackage(dir, paths) {
  const path = join(dir, 'package.json');
  const pkg = JSON.parse(readFileSync(path));
  pkg.files = paths;
  writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
}

test('refresh excludes user artifacts, preserves provenance, and is idempotent', t => {
  const dir = fixture(t);
  const before = readManifest(dir);
  const userFiles = ['.pi/config', 'plans/user.md', 'definitions/custom.md', '.pi-herdsman/note.md', 'skills/poteto-mode/scripts/node_modules/cache'];
  for (const path of userFiles) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), 'private bytes\n');
  }
  writeFileSync(join(dir, approved.find(p => p.endsWith('/SKILL.md'))), 'changed destination\n');
  const result = refresh(dir);
  assert.equal(result.status, 0, result.stderr);
  const after = readManifest(dir);
  assert.deepEqual(provenance(after), provenance(before));
  assert.deepEqual(after.generatedHistory, before.generatedHistory ?? before.generated.filter(r => ['.gitignore', '.pi-herdsman/adapter-handoff.md'].includes(r.path)));
  assert.deepEqual(after.generated.map(r => r.path), approved.filter(p => p !== 'PORT-MANIFEST.json' && !before.resources.some(r => r.destination === p)));
  for (const path of userFiles) assert.equal(readFileSync(join(dir, path), 'utf8'), 'private bytes\n');
  const bytes = readFileSync(join(dir, 'PORT-MANIFEST.json'));
  assert.equal(refresh(dir).status, 0);
  assert.deepEqual(readFileSync(join(dir, 'PORT-MANIFEST.json')), bytes);
});

test('checkout-only generated records become explicit idempotent history', t => {
  const dir = fixture(t);
  const m = readManifest(dir);
  const removed = { path: '.gitignore', sha256: 'a'.repeat(64) };
  m.generated.push(removed);
  const history = m.generatedHistory ?? [];
  writeFileSync(join(dir, 'PORT-MANIFEST.json'), JSON.stringify(m));
  assert.equal(refresh(dir).status, 0);
  assert.deepEqual(readManifest(dir).generatedHistory, [...history, removed]);
  assert.deepEqual(provenance(readManifest(dir)), provenance(m));
  const bytes = readFileSync(join(dir, 'PORT-MANIFEST.json'));
  assert.equal(refresh(dir).status, 0);
  assert.deepEqual(readFileSync(join(dir, 'PORT-MANIFEST.json')), bytes);
});

test('invalid membership fails before writing', t => {
  const invalid = [
    ['../escape'], ['/absolute'], ['scripts/'], ['scripts/*.mjs'], ['!README.md'], ['README.md', 'README.md'], ['missing.md'], ['./README.md'], ['scripts//manifest.mjs'], ['scripts/../README.md'], ['scripts\\manifest.mjs'],
  ];
  for (const paths of invalid) {
    const dir = fixture(t);
    savePackage(dir, paths);
    const before = readFileSync(join(dir, 'PORT-MANIFEST.json'));
    assert.notEqual(refresh(dir).status, 0, JSON.stringify(paths));
    assert.deepEqual(readFileSync(join(dir, 'PORT-MANIFEST.json')), before);
  }
  for (const mutation of ['symlink', 'symlink-leaf', 'missing', 'unrecorded', 'duplicate-resource', 'duplicate-generated', 'overlap', 'unshipped-resource']) {
    const dir = fixture(t);
    if (mutation === 'symlink') {
      rmSync(join(dir, 'definitions'), { recursive: true });
      symlinkSync(join(root, 'definitions'), join(dir, 'definitions'));
    } else if (mutation === 'symlink-leaf') {
      rmSync(join(dir, 'README.md'));
      symlinkSync(join(root, 'README.md'), join(dir, 'README.md'));
    } else if (mutation === 'missing') rmSync(join(dir, 'README.md'));
    else if (mutation === 'unrecorded') writeFileSync(join(dir, 'skills/local.md'), 'unrecorded');
    else if (mutation === 'unshipped-resource') savePackage(dir, approved.filter(p => p !== manifest.resources[0].destination));
    else {
      const m = readManifest(dir);
      if (mutation === 'duplicate-resource') m.resources.push(m.resources[0]);
      if (mutation === 'duplicate-generated') m.generated.push(m.generated[0]);
      if (mutation === 'overlap') m.generated.push({ path: m.resources[0].destination, sha256: m.resources[0].destinationSha256 });
      writeFileSync(join(dir, 'PORT-MANIFEST.json'), JSON.stringify(m));
    }
    const before = readFileSync(join(dir, 'PORT-MANIFEST.json'));
    assert.notEqual(refresh(dir).status, 0, mutation);
    assert.deepEqual(readFileSync(join(dir, 'PORT-MANIFEST.json')), before);
  }
});

test('npm tarball exactly matches approved files; extracted checks never call Git', t => {
  const dir = fixture(t);
  assert.equal(approved.length, 155);
  assert.deepEqual(JSON.parse(readFileSync(join(dir, 'package.json'))).files, approved);
  for (const path of ['definitions/custom.md', '.pi/config', 'scripts/private.md']) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), 'private bytes\n');
  }
  assert.equal(refresh(dir).status, 0);
  const packed = Object.values(JSON.parse(execFileSync('npm', ['pack', '.', '--ignore-scripts', '--json'], { cwd: dir, encoding: 'utf8' })))[0];
  assert.deepEqual(packed.files.map(r => r.path).sort(), approved);
  const members = execFileSync('tar', ['-tzf', join(dir, packed.filename)], { encoding: 'utf8' }).trim().split('\n').map(p => p.replace(/^package\//, '')).sort();
  assert.deepEqual(members, approved);
  for (const path of ['definitions/custom.md', '.pi/config', 'scripts/private.md']) assert.equal(readFileSync(join(dir, path), 'utf8'), 'private bytes\n');
  const isolated = mkdtempSync('/tmp/pstack-package-');
  t.after(() => rmSync(isolated, { recursive: true, force: true }));
  const noGit = join(isolated, 'bin');
  mkdirSync(noGit);
  symlinkSync(process.execPath, join(noGit, 'node'));
  const npm = execFileSync('which', ['npm'], { encoding: 'utf8' }).trim();
  for (const name of ['outside', 'unrelated']) {
    const target = join(isolated, name);
    mkdirSync(target);
    if (name === 'unrelated') execFileSync('git', ['init', '--quiet'], { cwd: target });
    execFileSync('tar', ['-xzf', join(dir, packed.filename), '-C', target]);
    const cwd = join(target, 'package');
    const result = spawnSync(npm, ['run', 'check', '--script-shell=/bin/sh'], { cwd, encoding: 'utf8', env: { ...process.env, PATH: noGit } });
    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.equal(existsSync(join(cwd, '.git')), false);
    for (const path of [manifest.resources[0].destination, 'README.md']) {
      const bytes = readFileSync(join(cwd, path));
      writeFileSync(join(cwd, path), 'tampered');
      assert.notEqual(spawnSync(process.execPath, ['scripts/validate-port.mjs'], { cwd, env: { ...process.env, PATH: noGit } }).status, 0);
      writeFileSync(join(cwd, path), bytes);
    }
  }
});
