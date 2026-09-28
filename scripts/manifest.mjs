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
