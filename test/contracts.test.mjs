import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { staleBackend } from '../scripts/backend-contract.mjs';
import { ROLES, renderDefinition, saveDefinition, definitionPath, installGlobalDefinitions } from '../scripts/setup.mjs';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = path => readFileSync(join(root, path), 'utf8');
// Deliberately narrow template contract, not a replacement Herdsman YAML parser.
function template(text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(fm, 'frontmatter');
  const allowed = new Set(['name','description','systemPromptMode','tools','noExtensions','noSkills','agents','inheritProjectContext','model','thinking']);
  const fields = {};
  for (const line of fm[1].split('\n')) {
    const match = line.match(/^([a-zA-Z]+): (.+)$/);
    assert.ok(match, 'malformed field');
    assert.ok(allowed.has(match[1]), 'unknown field');
    assert.ok(!(match[1] in fields), 'duplicate field');
    fields[match[1]] = match[2];
  }
  assert.match(fields.name, /^pstack-[a-z-]+$/);
  assert.equal(fields.noExtensions, 'false');
  assert.equal(fields.noSkills, 'true');
  assert.deepEqual(JSON.parse(fields.agents), []);
  fields.tools = JSON.parse(fields.tools);
  return fields;
}
test('model-pinned leaf templates materialize at discoverable trusted project paths', t => {
  const temp = join(root, '.pi-herdsman/tmp'); mkdirSync(temp, { recursive: true });
  const cwd = mkdtempSync(join(temp, 'definitions-')); t.after(() => rmSync(cwd, { recursive: true, force: true }));
  for (const role of ROLES) {
    const text = renderDefinition(root, role);
    const path = saveDefinition(cwd, role, text);
    assert.equal(path, join(cwd, '.pi/agents', 'pstack-' + role + '.md'));
    const fields = template(readFileSync(path, 'utf8'));
    assert.match(fields.model, /^"openai-codex\/gpt-6-(?:sol|astra|luna)"$/);
    assert.match(fields.thinking, /^(?:low|medium|high|max)$/);
    assert.equal(fields.name, 'pstack-' + role);
  }
  assert.deepEqual(ROLES.map(role => {
    const { model, thinking } = template(read('definitions/pstack-' + role + '.md'));
    return [role, JSON.parse(model).replace('openai-codex/gpt-6-', ''), thinking];
  }), [
    ['investigator','luna','max'], ['poteto-agent','sol','medium'],
    ['bug-fix','sol','high'], ['perf-issue','astra','medium'],
    ['hillclimb','luna','max'], ['how-explorer','luna','max'],
    ['reviewer','sol','low'], ['researcher','sol','medium'],
    ['verifier','astra','medium'], ['verifier-sol','sol','medium'],
    ['advisor','sol','medium']
  ]);
});
test('all templates discover extensions while native tool allowlists remain role-specific', () => {
  for (const role of ['investigator', 'how-explorer', 'reviewer', 'researcher', 'advisor']) {
    assert.deepEqual(template(read('definitions/pstack-' + role + '.md')).tools, ['read','grep','find','ls']);
  }
  for (const role of ['poteto-agent','bug-fix','perf-issue','hillclimb'])
    assert.deepEqual(template(read('definitions/pstack-' + role + '.md')).tools, ['read','grep','find','ls','bash','edit','write','exec_command','write_stdin','exec','wait','notebook','new_context','history','notes']);
  for (const role of ['verifier','verifier-sol'])
    assert.deepEqual(template(read('definitions/pstack-' + role + '.md')).tools, ['read','grep','find','ls','bash','exec_command','write_stdin','exec','wait','notebook','new_context','history','notes']);
});
test('template contract rejects unknown, malformed and duplicate fields', () => {
  const text = read('definitions/pstack-reviewer.md');
  for (const changed of [text.replace('tools:', 'unsupported:'), text.replace('tools:', 'tools'), text.replace('noSkills: true', 'noSkills: true\nnoSkills: true')])
    assert.throws(() => template(changed));
});
test('setup refuses symlinked destination directories and existing definition files', t => {
  const temp = join(root, '.pi-herdsman/tmp'); mkdirSync(temp, { recursive: true });
  const cwd = mkdtempSync(join(temp, 'symlink-')); t.after(() => rmSync(cwd, { recursive: true, force: true }));
  mkdirSync(join(cwd, 'other'));
  symlinkSync(join(cwd, 'other'), join(cwd, '.pi'));
  assert.throws(() => saveDefinition(cwd, 'reviewer', 'text'), /Unsafe/);
});
test('global install refuses symlinked agent directory', t => {
  const temp = join(root, '.pi-herdsman/tmp'); mkdirSync(temp, { recursive: true });
  const cwd = mkdtempSync(join(temp, 'global-')); t.after(() => rmSync(cwd, { recursive: true, force: true }));
  mkdirSync(join(cwd, 'other'));
  symlinkSync(join(cwd, 'other'), join(cwd, 'agents'));
  assert.throws(() => installGlobalDefinitions(root, cwd), /Unsafe global definition directory/);
  assert.throws(() => readFileSync(join(cwd, 'other', 'pstack-reviewer.md'), 'utf8'), { code: 'ENOENT' });
});
test('global install preserves regular files but rejects profile path conflicts', t => {
  const temp = join(root, '.pi-herdsman/tmp'); mkdirSync(temp, { recursive: true });
  const cwd = mkdtempSync(join(temp, 'global-conflict-')); t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const dir = join(cwd, 'agents'); mkdirSync(dir);
  const profile = join(dir, 'pstack-investigator.md');
  mkdirSync(profile);
  assert.throws(() => installGlobalDefinitions(root, cwd), /Conflicting global profile/);
  rmSync(profile, { recursive: true });
  symlinkSync(join(cwd, 'target'), profile);
  assert.throws(() => installGlobalDefinitions(root, cwd), /Conflicting global profile/);
});
test('documented request uses only real delegation fields; instructions carry lifecycle limits', () => {
  const runtime = read('skills/poteto-mode/references/herdsman-runtime.md');
  const request = JSON.parse(runtime.match(/```json\n([\s\S]*?)\n```/)[1]);
  const allowed = ['definition','task','files','label'];
  assert.ok(Object.keys(request).every(k => allowed.includes(k)));
  assert.match(runtime, /JSON request to `agent_delegate`/);
  assert.deepEqual(Object.keys(request).sort(), ['definition','files','label','task']);
  assert.ok(ROLES.some(r => request.definition === 'pstack-' + r));
  assert.match(runtime, /There is no wait\/join\/collection call/);
  assert.match(runtime, /end the current turn and yield/);
  assert.match(runtime, /pass it unchanged through `files`/);
  assert.match(runtime, /exact returned Pi session/);
  assert.match(runtime, /available_tools/);
  assert.match(runtime, /bundled < trusted project < global/);
  assert.match(runtime, /same-name global definition overrides/);
  assert.match(runtime, /Unknown fields and malformed definitions fail discovery/);
});

test('backend scan rejects the reviewed stale isolation recipes', () => {
  for (const text of [
    'Background subagents inherit the requested cwd.',
    'Multiple `subagent` calls on the same branch need separate worktrees.',
    'git fetch && git reset --hard origin/<branch>',
    'agents.spawn({ cwd: project })',
    'Inspect `agent {"action":"list"}` for the roster.',
    'Use `agent` action `delegate` for new work.',
    'Follow current available_actions.'
  ]) assert.equal(staleBackend.test(text), true, text);
  assert.equal(staleBackend.test("Delegates inherit the controller's cwd; use external worktrees and separate lead sessions."), false);
});
test('PR opening preserves shared work and assigns review orchestration to the lead', () => {
  const pr = read('skills/poteto-mode/playbooks/opening-a-pr.md');
  assert.equal(staleBackend.test(pr), false);
  assert.match(pr, /external git worktree.*separate lead session/);
  assert.match(pr, /Preserve unrelated dirty work in place/);
  assert.match(pr, /After the implementation handoff, the lead runs `\/skill:no-comments` and `\/skill:interrogate`/);
  assert.match(pr, /required review skills\/rubrics explicitly through files/);
  assert.match(pr, /It does not launch reviewers/);
  assert.doesNotMatch(pr, /A subagent that opens a PR runs/);
  for (const name of ['autopilot-full', 'autopilot-stack']) {
    const workflow = read('skills/poteto-mode/playbooks/' + name + '.md');
    assert.match(workflow, /After each implementation handoff, the lead orchestrates no-comments, interrogate/);
    assert.match(workflow, /Leaves do not launch reviewers or watchers/);
  }
  assert.match(read('skills/poteto-mode/playbooks/multi-phase-plan.md'), /After the implementation handoff, the lead runs/);
});
test('read-only design candidates return results and the lead owns persistence', () => {
  const arena = read('skills/arena/SKILL.md');
  assert.match(arena, /Read-only pstack-advisor candidates return designs and rationales in their completion results; they do not write files/);
  assert.match(arena, /The lead persists those results/);
  assert.match(arena, /Reserve file-producing assignments for an appropriately authorized implementation-role writer/);
  assert.doesNotMatch(arena, /Each candidate writes to its own location/);
  for (const path of ['skills/architect/SKILL.md', 'skills/architect/references/runner-prompt.md']) {
    const workflow = read(path);
    assert.match(workflow, /Read-only advisors return the complete design package in their completion results/);
    assert.match(workflow, /lead persists authorized/);
    assert.match(workflow, /appropriately authorized.*writer/);
  }
  assert.deepEqual(template(read('definitions/pstack-advisor.md')).tools, ['read','grep','find','ls']);
});

test('all eleven profiles have task routes without widening leaf capabilities', () => {
  const runtime = read('skills/poteto-mode/references/herdsman-runtime.md');
  const mode = read('skills/poteto-mode/SKILL.md');
  for (const role of ROLES) {
    assert.match(runtime, new RegExp('`pstack-' + role + '`'), role);
    assert.match(mode, new RegExp('pstack-' + role + '\\b'), role);
  }
  for (const [playbook, role] of [['bug-fix','bug-fix'], ['perf-issue','perf-issue'], ['hillclimb','hillclimb'], ['feature','poteto-agent'], ['refactoring','poteto-agent']])
    assert.match(read('skills/poteto-mode/playbooks/' + playbook + '.md'), new RegExp('`pstack-' + role + '`'), playbook);
  assert.match(read('skills/how/SKILL.md'), /Herdsman definition: `pstack-how-explorer`/);
  assert.match(read('skills/setup-pstack/SKILL.md'), /eleven roles/);
  assert.match(mode, /A leaf's read-only profile cannot gain shell, file writes, MCP access, or controller tools/);
  assert.match(read('skills/why/SKILL.md'), /shipped `pstack-investigator` has no shell or `gh`/);
});

test('plan audit prompt gates replacement on evidence, control resolution and teardown', () => {
  const plan = read('skills/poteto-mode/playbooks/multi-phase-plan.md');
  const prompts = plan.split('\n').filter(line => line.startsWith('- [ ] Use this tick prompt, verbatim.'));
  assert.equal(prompts.length, 1);
  const prompt = prompts[0];
  assert.match(prompt, /Assess concrete evidence and required attention for direct-owned lanes only/);
  assert.match(prompt, /do not status-poll active agents or treat inactivity as proof of a hang/);
  assert.match(prompt, /use only current available_tools for that live agent/);
  assert.match(prompt, /Resolve pending controls and mailbox\/result-persistence issues.*before closing or replacing an assignment/);
  assert.match(prompt, /Confirm teardown of the old execution and release of its write ownership before any replacement; never create overlapping writers/);
  assert.match(prompt, /If evidence, control resolution or teardown is uncertain, report the blocker and do not replace the lane/);
  assert.doesNotMatch(prompt, /Probe every active lane|Stand down a stuck lane|dispatch its replacement now/);
});
