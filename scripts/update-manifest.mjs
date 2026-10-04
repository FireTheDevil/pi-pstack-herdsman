import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { files, hash, packageInventory } from './manifest.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'PORT-MANIFEST.json');
const source = process.argv[2];
const previous = JSON.parse(readFileSync(path, 'utf8'));
const prior = source ? JSON.parse(readFileSync(join(resolve(source), 'PORT-MANIFEST.json'), 'utf8')) : undefined;
const manifest = source ? {
  ...previous,
  version: 1,
  source: 'Local pi-pstack-fabric working tree. Historical intermediate only; not a runtime dependency.',
  upstream: JSON.parse(readFileSync(join(root, 'upstream.lock.json'), 'utf8')),
  backend: { package: 'pi-herdsman', inspectedVersion: '0.19.1', mode: 'split agent_* API' },
  resources: files(resolve(source), 'skills').map(path => ({
    sourcePath: path,
    sourceSha256: hash(join(source, path)),
    priorLineage: prior.resources.find(r => r.destination === path),
    destination: path.replace('fabric-runtime.md', 'herdsman-runtime.md')
  }))
} : previous;
const inventory = packageInventory(root, manifest);
for (const record of manifest.resources) {
  record.destinationSha256 = hash(join(root, record.destination));
  record.disposition = record.sourceSha256 === record.destinationSha256 ? 'adopted' : 'adapted';
}
const removed = manifest.generated.filter(record => !inventory.generated.includes(record.path));
if (removed.length > 0) {
  const history = manifest.generatedHistory ?? [];
  manifest.generatedHistory = [...history, ...removed.filter(record => !history.some(prior => prior.path === record.path && prior.sha256 === record.sha256))];
}
manifest.generated = inventory.generated.map(path => ({ path, sha256: hash(join(root, path)) }));
writeFileSync(path, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ resources: manifest.resources.length, adopted: manifest.resources.filter(r => r.disposition === 'adopted').length, generated: manifest.generated.length }));
