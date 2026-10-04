import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
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
  assert.deepEqual(resources, files(root, 'skills'), 'Physical resource provenance');
  for (const path of recordedGenerated) assert.ok(path !== 'PORT-MANIFEST.json' && !resources.includes(path), 'Overlapping manifest category: ' + path);
  const generated = paths.filter(path => path !== 'PORT-MANIFEST.json' && !resources.includes(path));
  return { paths, resources, generated };
}
