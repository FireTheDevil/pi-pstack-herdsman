import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, lstatSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { catalog, ROLES } from './profile-sync.mjs';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const identity = data => ({ revision: data.revision, hash: digest(JSON.stringify([data.revision, data.predecessors, data.templates])) });
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const profilePath = role => 'definitions/pstack-' + role + '.md';
const catalogPath = 'scripts/profile-history.json';

// Only consult Git in this package's own checkout, never an enclosing repository.
function profileBaselines(root) {
  if (!existsSync(join(root, '.git'))) return [];
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  assert.equal(resolve(git(['rev-parse', '--show-toplevel']).trim()), resolve(root), 'Profile Git root mismatch');
  const commits = git(['log', '--format=%H', '--', catalogPath]).trim().split('\n').filter(Boolean);
  return commits.map(commit => ({
    commit,
    data: JSON.parse(git(['show', commit + ':' + catalogPath])),
    read: role => git(['show', commit + ':' + profilePath(role)])
  }));
}

export function checkProfiles(root) {
  const current = catalog(root); // Same byte/schema checks as conservative runtime sync.
  const baselines = profileBaselines(root);
  for (const baseline of baselines) {
    const previous = identity(baseline.data);
    if (previous.revision === current.identity.revision) {
      assert.equal(previous.hash, current.identity.hash, 'Same profile revision has divergent catalog identity; run npm run profiles:refresh');
    }
  }
  const latest = baselines[0];
  if (latest && !same(identity(latest.data), current.identity)) {
    assert.ok(current.predecessors.some(entry => same(entry, identity(latest.data))), 'Missing Git baseline predecessor; run npm run profiles:refresh');
  }
  return current;
}

export function refreshProfiles(root) {
  const path = join(root, catalogPath);
  const original = readFileSync(path, 'utf8');
  const data = JSON.parse(original);
  assert.equal(data.schema, 1, 'Unsupported profile catalog');
  assert.match(data.revision, /^profile-sync-[1-9][0-9]*$/, 'Unsupported profile revision');
  assert.ok(Array.isArray(data.predecessors) && Array.isArray(data.history), 'Invalid profile catalog');
  const templates = Object.fromEntries(ROLES.map(role => [role, hash(join(root, profilePath(role)))]));
  const baselines = profileBaselines(root);
  const currentIdentity = identity(data);
  const predecessors = [...data.predecessors];
  const addPredecessor = entry => {
    if (!predecessors.some(previous => same(previous, entry))) predecessors.push(entry);
  };
  for (const baseline of baselines) {
    const entry = identity(baseline.data);
    if (!same(entry, currentIdentity)) addPredecessor(entry);
    for (const ancestor of baseline.data.predecessors) addPredecessor(ancestor);
  }
  const divergent = baselines.some(baseline => baseline.data.revision === data.revision && !same(identity(baseline.data), currentIdentity));
  const changed = !same(data.templates, templates) || !same(predecessors, data.predecessors) || divergent;
  if (changed) {
    // Never claim a working-tree snapshot has a source commit. Changed refreshes
    // require Git so superseded shipped bytes can be preserved truthfully.
    assert.ok(baselines.length, 'Profile changes require a Git checkout with catalog history; refresh in the source repository');
    addPredecessor(currentIdentity);
    const revisions = [data.revision, ...baselines.map(entry => entry.data.revision), ...predecessors.map(entry => entry.revision)];
    const numbers = revisions.map(revision => {
      assert.match(revision, /^profile-sync-[1-9][0-9]*$/, 'Unsupported historical profile revision');
      return Number(revision.slice('profile-sync-'.length));
    });
    data.revision = 'profile-sync-' + (Math.max(...numbers) + 1);
    data.predecessors = predecessors;
    data.templates = templates;
    for (const baseline of [...baselines].reverse()) {
      for (const role of ROLES) {
        const bytes = baseline.read(role);
        const sha256 = digest(bytes);
        assert.equal(sha256, baseline.data.templates[role], 'Git catalog does not match its committed profile: ' + baseline.commit + ' ' + role);
        const source = { commit: baseline.commit, path: profilePath(role) };
        let record = data.history.find(entry => entry.role === role && entry.sha256 === sha256);
        if (!record) {
          record = { role, sha256, bytes, sources: [] };
          data.history.push(record);
        }
        assert.equal(record.bytes, bytes, 'Historical profile bytes mismatch');
        if (!record.sources.some(entry => same(entry, source))) record.sources.push(source);
      }
    }
    const next = JSON.stringify(data, null, 2) + '\n';
    writeFileSync(path, next);
    try { checkProfiles(root); }
    catch (error) { writeFileSync(path, original); throw error; }
  } else {
    checkProfiles(root);
  }
  console.log(JSON.stringify({ profileRevision: data.revision, changed }));
}

export const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
export function files(root, prefix = '') {
  return readdirSync(join(root, prefix)).sort().flatMap(name => {
    const path = prefix ? prefix + '/' + name : name;
    if (['node_modules', '.git', '.pi-herdsman'].includes(name) || name.endsWith('.tgz')) return [];
    const stat = lstatSync(join(root, path));
    if (stat.isSymbolicLink()) throw new Error('Symlink not allowed in package resources: ' + path);
    return stat.isDirectory() ? files(root, path) : [path];
  });
}
function exactPaths(paths, category) {
  assert.ok(Array.isArray(paths), category + ' must be an array');
  for (const path of paths) {
    assert.ok(typeof path === 'string' && path.split('/').every(part => /^[a-zA-Z0-9._-]+$/.test(part) && part !== '.' && part !== '..'), 'Not an exact package path: ' + path);
  }
  assert.equal(new Set(paths).size, paths.length, 'Duplicate ' + category);
  return [...paths].sort();
}
export function packageInventory(root, manifest) {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const paths = exactPaths(pkg.files, 'package files');
  for (const required of ['package.json', 'README.md', 'LICENSE', 'PORT-MANIFEST.json']) assert.ok(paths.includes(required), 'Missing package member: ' + required);
  for (const path of paths) {
    const parts = path.split('/');
    for (let i = 1; i <= parts.length; i++) {
      const stat = lstatSync(join(root, ...parts.slice(0, i)));
      assert.ok(!stat.isSymbolicLink(), 'Symlink in package path: ' + path);
      assert.ok(i === parts.length ? stat.isFile() : stat.isDirectory(), 'Not a regular package file: ' + path);
    }
  }
  const resources = exactPaths(manifest.resources.map(record => record.destination), 'resource destinations');
  const recordedGenerated = exactPaths(manifest.generated.map(record => record.path), 'generated paths');
  assert.deepEqual(resources, paths.filter(path => path.startsWith('skills/')), 'Shipped resource provenance');
  assert.deepEqual(resources, files(root, 'skills').sort(), 'Physical resource provenance');
  for (const path of recordedGenerated) assert.ok(path !== 'PORT-MANIFEST.json' && !resources.includes(path), 'Overlapping manifest category: ' + path);
  const generated = paths.filter(path => path !== 'PORT-MANIFEST.json' && !resources.includes(path));
  return { paths, resources, generated };
}
