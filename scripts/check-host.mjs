import assert from 'node:assert/strict';
import { accessSync, constants, readFileSync, mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const [piPath, herdsmanPath] = process.argv.slice(2);
if (!piPath || !herdsmanPath) throw new Error('Usage: node scripts/check-host.mjs <installed-pi-root> <installed-herdsman-root>');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const piRoot = resolve(piPath), host = resolve(herdsmanPath);
const policy = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).peerDependencies;
const versions = [];
for (const [name, installedRoot] of [['pi-herdsman', host], ['@earendil-works/pi-coding-agent', piRoot]]) {
  const version = JSON.parse(readFileSync(join(installedRoot, 'package.json'), 'utf8')).version;
  const range = policy[name];
  const bounds = /^>=(\d+\.\d+\.\d+) <(\d+\.\d+\.\d+)$/.exec(range);
  assert.ok(bounds, `Unsupported declared host range for ${name}: ${range}`);
  assert.match(version, /^\d+\.\d+\.\d+$/, `${name} ${version} must be a stable version within ${range}`);
  const parts = version.split('.').map(Number);
  const [lower, upper] = bounds.slice(1).map(bound => {
    const target = bound.split('.').map(Number);
    return parts.map((part, i) => part - target[i]).find(delta => delta !== 0) ?? 0;
  });
  assert.ok(lower >= 0 && upper < 0, `${name} ${version} outside ${range}; revalidate contracts for other releases`);
  versions.push(version);
}
const [version, piVersion] = versions;
const schema = readFileSync(join(host, 'docs/reference/agent-definition-schema.md'), 'utf8');
assert.match(schema, /active_agent name=/);
assert.match(readFileSync(join(host, 'dist/index.js'), 'utf8'), /args\.push\("--append-system-prompt", `<active_agent name="\$\{agent\.name\}"\/>`\)/, 'Herdsman must still append the <active_agent> marker the extension uses for leaf detection');
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
const piLoader = join(piRoot, 'dist/core/extensions/loader.js');
const piSkills = join(piRoot, 'dist/core/skills.js');
for (const path of [piLoader, piSkills]) {
  try {
    assert.ok(statSync(path).isFile(), 'not a regular file');
    accessSync(path, constants.R_OK);
  } catch (cause) {
    throw new Error(`Missing or unreadable Pi module ${path}. Pass a built/installed @earendil-works/pi-coding-agent package root with readable dist files.`, { cause });
  }
}
const { loadExtensions } = await import(pathToFileURL(piLoader));
const { loadSkillsFromDir } = await import(pathToFileURL(piSkills));
const tmp = join(root, '.pi-herdsman/tmp');
mkdirSync(tmp, { recursive: true });
const isolated = mkdtempSync(join(tmp, 'host-'));
try {
  const loaded = await loadExtensions([join(root, 'extensions/pstack-herdsman/index.ts')], isolated);
  assert.deepEqual(loaded.errors, []);
  assert.equal(loaded.extensions.length, 1);
  assert.deepEqual([...loaded.extensions[0].commands.keys()].sort(), ['poteto-mode', 'pstack-status', 'setup-pstack']);
  const skills = loadSkillsFromDir({ dir: join(root, 'skills'), source: 'local' });
  assert.equal(skills.skills.length, 55);
  assert.deepEqual(skills.diagnostics, []);
  assert.ok(skills.skills.every(s => s.disableModelInvocation));
  console.log(JSON.stringify({ piVersion, herdsmanVersion: version, extensionLoad: 'passed', skillsLoaded: skills.skills.length, backendDocumentationContracts: 'passed', liveDelegation: false, definitionDiscoveryRuntime: 'not exercised' }));
} finally { rmSync(isolated, { recursive: true, force: true }); }
