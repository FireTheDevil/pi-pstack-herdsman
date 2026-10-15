import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const [piPath, herdsmanPath] = process.argv.slice(2);
if (!piPath || !herdsmanPath) throw new Error('Usage: node scripts/check-host.mjs <installed-pi-root> <installed-herdsman-root>');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const piRoot = resolve(piPath), host = resolve(herdsmanPath);
const version = JSON.parse(readFileSync(join(host, 'package.json'), 'utf8')).version;
assert.match(version, /^0\.25\.(?:[1-9]\d*)$/, 'Requires Herdsman >=0.25.1 <0.26.0; revalidate contracts for other releases');
const piVersion = JSON.parse(readFileSync(join(piRoot, 'package.json'), 'utf8')).version;
assert.match(piVersion, /^1\.1\.\d+$/, 'Requires Pi >=1.1.0 <1.2.0');
const schema = readFileSync(join(host, 'docs/reference/agent-definition-schema.md'), 'utf8');
assert.match(schema, /active_agent name=/);
assert.match(schema, /bundled < project < global/);
assert.match(schema, /Unknown frontmatter fields fail validation/);
assert.match(schema, /exclusion wins over an allowlist/);
const api = readFileSync(join(host, 'docs/reference/agent.md'), 'utf8');
for (const name of ['list_agents', 'delegate_agent', 'continue_agent', 'steer_agent', 'interrupt_agent', 'reply_agent', 'close_agent', 'inspect_agent', 'read_agent_transcript']) {
  assert.ok(api.includes('## `' + name + '`'), 'Documented canonical tool: ' + name);
}
assert.match(api, /Continuation always creates a new agent generation/);
assert.match(api, /terminal result is delivered once and the agent is cleaned up/);
assert.match(api, /No selectors or other fields are accepted/);
assert.match(api, /`session`, `task`, and optional `files`/);
assert.match(api, /available_tools/);
assert.match(api, /Each tool accepts only its operation's fields/);
const { loadExtensions } = await import(pathToFileURL(join(piRoot, 'dist/core/extensions/loader.js')));
const { loadSkillsFromDir } = await import(pathToFileURL(join(piRoot, 'dist/core/skills.js')));
const tmp = join(root, '.pi-herdsman/tmp');
mkdirSync(tmp, { recursive: true });
const isolated = mkdtempSync(join(tmp, 'host-'));
try {
  const loaded = await loadExtensions([join(root, 'extensions/pstack-herdsman/index.ts')], isolated);
  assert.deepEqual(loaded.errors, []);
  assert.equal(loaded.extensions.length, 1);
  assert.deepEqual([...loaded.extensions[0].commands.keys()].sort(), ['poteto-mode', 'pstack-status', 'setup-pstack']);
  const skills = loadSkillsFromDir({ dir: join(root, 'skills'), source: 'local' });
  assert.equal(skills.skills.length, 52);
  assert.deepEqual(skills.diagnostics, []);
  assert.ok(skills.skills.every(s => s.disableModelInvocation));
  console.log(JSON.stringify({ piVersion, herdsmanVersion: version, extensionLoad: 'passed', skillsLoaded: skills.skills.length, backendDocumentationContracts: 'passed', liveDelegation: false, definitionDiscoveryRuntime: 'not exercised' }));
} finally { rmSync(isolated, { recursive: true, force: true }); }
