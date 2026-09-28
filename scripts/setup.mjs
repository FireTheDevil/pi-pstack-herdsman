import { readFileSync, mkdirSync, writeFileSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
export const ROLES = ['investigator', 'poteto-agent', 'bug-fix', 'perf-issue', 'hillclimb', 'how-explorer', 'reviewer', 'researcher', 'verifier', 'verifier-sol', 'advisor'];
export const THINKING = ['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'];
export function definitionPath(cwd, role) {
  if (!ROLES.includes(role)) throw new Error('Unknown role: ' + role);
  return join(cwd, '.pi', 'agents', 'pstack-' + role + '.md');
}
export function renderDefinition(root, role, model, thinking) {
  definitionPath(root, role);
  const template = readFileSync(join(root, 'definitions', 'pstack-' + role + '.md'), 'utf8');
  model ??= JSON.parse(template.match(/^model: (.+)$/m)?.[1] ?? 'null');
  thinking ??= template.match(/^thinking: (.+)$/m)?.[1];
  if (typeof model !== 'string' || !/^[^\s/]+\/[^\s]+$/.test(model)) throw new Error('Select an available provider/model');
  if (!THINKING.includes(thinking)) throw new Error('Invalid thinking');
  return template.replace(/^model: .+$/m, 'model: ' + JSON.stringify(model)).replace(/^thinking: .+$/m, 'thinking: ' + thinking);
}
export function saveDefinition(cwd, role, content) {
  const path = definitionPath(cwd, role);
  // Refuse redirects outside the confirmed project destination.
  for (const dir of [join(cwd, '.pi'), join(cwd, '.pi', 'agents')]) {
    try { if (!lstatSync(dir).isDirectory() || lstatSync(dir).isSymbolicLink()) throw new Error('Unsafe setup directory: ' + dir); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  mkdirSync(join(cwd, '.pi', 'agents'), { recursive: true });
  writeFileSync(path, content, { flag: 'wx' });
  return path;
}
