import { readFileSync, mkdirSync, writeFileSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
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
export function globalAgentDir() {
  const configured = process.env.PI_CODING_AGENT_DIR;
  return configured ? configured.replace(/^~(?=\/|$)/, homedir()) : join(homedir(), '.pi', 'agent');
}
export function installGlobalDefinitions(root, agentDir = globalAgentDir()) {
  const dir = join(agentDir, 'agents');
  for (const path of [agentDir, dir]) {
    try { if (!lstatSync(path).isDirectory() || lstatSync(path).isSymbolicLink()) throw new Error('Unsafe global definition directory: ' + path); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  mkdirSync(dir, { recursive: true });
  const created = [];
  for (const role of ROLES) {
    const path = join(dir, 'pstack-' + role + '.md');
    try { writeFileSync(path, renderDefinition(root, role), { flag: 'wx' }); created.push(path); }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (!lstatSync(path).isFile()) throw new Error('Conflicting global profile: ' + path);
    }
  }
  return created;
}
