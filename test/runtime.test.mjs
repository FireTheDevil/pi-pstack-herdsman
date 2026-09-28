import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, existsSync, rmSync, writeFileSync } from 'node:fs';

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import extension, { POTETO_HINT, isManagedAgent } from '../extensions/pstack-herdsman/index.ts';
import { stripSkillsByLocationPrefix } from '../extensions/pstack-herdsman/skill-strip.ts';
import { definitionPath, renderDefinition, saveDefinition, ROLES } from '../scripts/setup.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const tempRoot = join(root, '.pi-herdsman/tmp');
mkdirSync(tempRoot, { recursive: true });
function harness({ child = false, entries = [], confirm = false } = {}) {
  const cwd = mkdtempSync(join(tempRoot, 'pstack-herdsman-test-'));
  const handlers = new Map(), commands = new Map(), messages = [], notifications = [], statuses = [];
  const pi = {
    on(name, fn) { handlers.set(name, fn); },
    registerCommand(name, command) { commands.set(name, command); },
    appendEntry(customType, data) { entries.push({ type: 'custom', customType, data }); },
    sendUserMessage(...args) { messages.push(args); }
  };
  const ctx = { cwd, mode: 'tui', hasUI: true, isIdle: () => true,
    sessionManager: { getBranch: () => entries },
    getSystemPrompt: () => child ? 'base\n<active_agent name="pstack-poteto-agent"/>' : 'base',
    modelRegistry: { getAvailable: () => ['sol','astra','luna'].map(id => ({ provider: 'openai-codex', id: 'gpt-6-' + id })) },
    ui: { setStatus(...args) { statuses.push(args); }, notify(...args) { notifications.push(args); }, select: async (_, choices) => choices[0], confirm: async () => confirm }
  };
  extension(pi);
  return { cwd, ctx, entries, commands, messages, notifications, statuses,
    emit: async (name, event = {}) => {
      const prior = process.env.PI_CODING_AGENT_DIR;
      process.env.PI_CODING_AGENT_DIR = cwd;
      try { return await handlers.get(name)(event, ctx); }
      finally {
        if (prior === undefined) delete process.env.PI_CODING_AGENT_DIR;
        else process.env.PI_CODING_AGENT_DIR = prior;
      }
    },
    close: () => rmSync(cwd, { recursive: true, force: true })
  };
}

test('controller starts off and explicit command enables sticky status and hint', async t => {
  const h = harness(); t.after(h.close);
  assert.deepEqual([...h.commands.keys()].sort(), ['poteto-mode', 'pstack', 'setup-pstack']);
  await h.emit('session_start');
  assert.deepEqual(h.statuses.at(-1), ['pstack-mode', undefined]);
  assert.equal((await h.emit('before_agent_start', { systemPrompt: 'base' })).systemPrompt, 'base');
  assert.equal(h.entries.length, 0);
  await h.commands.get('poteto-mode').handler('', h.ctx);
  assert.deepEqual(h.statuses.at(-1), ['pstack-mode', 'pstack: poteto mode']);
  assert.equal((await h.emit('before_agent_start', { systemPrompt: 'base' })).systemPrompt, 'base\n\n' + POTETO_HINT);
  assert.equal(h.entries.at(-1).data.enabled, true);
  await h.emit('session_tree');
  assert.deepEqual(h.statuses.at(-1), ['pstack-mode', 'pstack: poteto mode']);
});
test('first session load installs missing global profiles without replacing existing ones', async t => {
  const h = harness(); t.after(h.close);
  const existing = join(h.cwd, 'agents', 'pstack-reviewer.md');
  mkdirSync(dirname(existing), { recursive: true });
  writeFileSync(existing, 'user-customized');
  await h.emit('session_start');
  assert.equal(readFileSync(existing, 'utf8'), 'user-customized');
  for (const role of ROLES) assert.ok(existsSync(join(h.cwd, 'agents', 'pstack-' + role + '.md')));
  assert.match(h.notifications.at(-1)[0], /Copied 10 missing pstack profiles globally\. Restart Pi/);
  const count = h.notifications.length;
  await h.emit('session_start');
  assert.equal(h.notifications.length, count);
  assert.equal(readFileSync(existing, 'utf8'), 'user-customized');
});
test('saved off survives session restoration and branch navigation', async t => {
  const h = harness(); t.after(h.close);
  await h.emit('session_start');
  await h.commands.get('poteto-mode').handler('off', h.ctx);
  for (const event of ['session_start', 'session_tree']) {
    await h.emit(event);
    assert.equal((await h.emit('before_agent_start', { systemPrompt: 'base' })).systemPrompt, 'base');
  }
  assert.equal(h.entries.length, 1);
});
test('command expansion queues correctly and direct skill input re-enables mode', async t => {
  const h = harness(); t.after(h.close);
  h.ctx.isIdle = () => false;
  await h.commands.get('poteto-mode').handler('fix parser', h.ctx);
  assert.deepEqual(h.messages[0], ['/skill:poteto-mode fix parser', { expandPromptTemplates: true, deliverAs: 'followUp' }]);
  await h.commands.get('poteto-mode').handler('off', h.ctx);
  await h.emit('input', { text: '/skill:poteto-mode inspect' });
  assert.equal(h.entries.at(-1).data.enabled, true);
});
test('Managed agents suppress controller state, commands and setup even with inherited on', async t => {
  const h = harness({ child: true, confirm: true, entries: [{ type: 'custom', customType: 'pstack-mode', data: { enabled: true } }] }); t.after(h.close);
  await h.emit('session_start');
  await h.emit('input', { text: '/skill:poteto-mode' });
  await h.commands.get('poteto-mode').handler('work', h.ctx);
  await h.commands.get('setup-pstack').handler('', h.ctx);
  assert.equal(h.entries.length, 1);
  assert.equal(h.messages.length, 0);
  assert.ok(!existsSync(definitionPath(h.cwd, 'investigator')));
  assert.ok(!existsSync(join(h.cwd, 'agents')));
  assert.equal((await h.emit('before_agent_start', { systemPrompt: 'base' })).systemPrompt, 'base');
});
test('catalog filter state is independent from Poteto state and rejects bad input', async t => {
  const h = harness(); t.after(h.close);
  await h.emit('session_start');
  await h.commands.get('poteto-mode').handler('', h.ctx);
  await h.commands.get('pstack').handler('off', h.ctx);
  assert.deepEqual(h.entries.at(-1), { type: 'custom', customType: 'pstack-herdsman-catalog', data: { enabled: false } });
  assert.match((await h.emit('before_agent_start', { systemPrompt: 'base' })).systemPrompt, /New task/);
  const length = h.entries.length;
  await h.commands.get('pstack').handler('typo', h.ctx);
  assert.equal(h.entries.length, length);
});
test('catalog filtering removes only package-owned skill entries', () => {
  const prompt = 'base\n<available_skills>\n  <skill><name>local</name><location>/pkg/skills/how/SKILL.md</location></skill>\n  <skill><name>other</name><location>/other/skills/how/SKILL.md</location></skill>\n</available_skills>\ntail';
  const result = stripSkillsByLocationPrefix(prompt, '/pkg/skills');
  assert.equal(result.removed, 1);
  assert.ok(!result.prompt.includes('/pkg/skills/'));
  assert.ok(result.prompt.includes('/other/skills/'));
  assert.ok(result.prompt.endsWith('\ntail'));
  assert.deepEqual(stripSkillsByLocationPrefix('no catalog', '/pkg'), { prompt: 'no catalog', removed: 0 });
});

test('system prompt interoperability tag is the managed identity, not ordinary text', () => {
  assert.equal(isManagedAgent('base\n<active_agent name="reviewer"/>'), true);
  assert.equal(isManagedAgent('base\n<active_agent name="reviewer"/>\n'), true);
  assert.equal(isManagedAgent('user mentioned active_agent'), false);
  assert.equal(isManagedAgent('inline <active_agent name="reviewer"/> example'), false);
});
test('setup previews complete definition, confirms, refuses overwrite and preserves other roles', async t => {
  const h = harness({ confirm: true }); t.after(h.close);
  let preview;
  h.ctx.ui.confirm = async (title, message) => { preview = message; return true; };
  await h.commands.get('setup-pstack').handler('reviewer', h.ctx);
  const path = definitionPath(h.cwd, 'reviewer');
  const saved = readFileSync(path, 'utf8');
  assert.match(saved, /name: pstack-reviewer/);
  assert.match(saved, /model: "openai-codex\/gpt-6-sol"/);
  assert.match(saved, /thinking: low/);
  assert.ok(preview.includes(saved));
  assert.ok(preview.includes(path));
  assert.match(preview, /Global same-name/);
  await h.commands.get('setup-pstack').handler('investigator', h.ctx);
  assert.equal(readFileSync(path, 'utf8'), saved);
  writeFileSync(path, 'existing definition');
  await h.commands.get('setup-pstack').handler('reviewer', h.ctx);
  assert.equal(readFileSync(path, 'utf8'), 'existing definition');
  assert.equal(h.notifications.at(-1)[1], 'error');
});
test('setup cancellation and headless use perform no writes', async t => {
  for (const stop of ['role', 'confirm', 'headless']) {
    const h = harness({ confirm: true }); t.after(h.close);
    let n = 0;
    h.ctx.ui.select = async (_, options) => (++n === 1 && stop === 'role' ? undefined : options[0]);
    h.ctx.ui.confirm = async () => stop !== 'confirm';
    h.ctx.hasUI = stop !== 'headless';
    await h.commands.get('setup-pstack').handler('', h.ctx);
    assert.ok(!existsSync(join(h.cwd, '.pi')), stop);
  }
});
test('setup rejects unsupported scope, unknown roles and unavailable configured model', async t => {
  const h = harness({ confirm: true }); t.after(h.close);
  for (const args of ['--global', '../outside', 'reviewer extra']) {
    await h.commands.get('setup-pstack').handler(args, h.ctx);
    assert.equal(h.notifications.at(-1)[1], 'error');
  }
  h.ctx.modelRegistry.getAvailable = () => [{ provider: 'openai-codex', id: 'gpt-6-astra' }];
  await h.commands.get('setup-pstack').handler('reviewer', h.ctx);
  assert.ok(!existsSync(join(h.cwd, '.pi')));
  assert.match(h.notifications.at(-1)[0], /Configured model unavailable/);
});
test('renderer validates role/model/thinking without writing', () => {
  for (const args of [['unknown','a/b','off'],['reviewer','invalid','off'],['reviewer','a/b','invalid']])
    assert.throws(() => renderDefinition(root, ...args));
  assert.match(renderDefinition(root, 'reviewer', 'a/b', 'high'), /thinking: high/);
});
test('branch change uses only active branch and invalid entries do not activate', async t => {
  const h = harness(); t.after(h.close);
  await h.commands.get('poteto-mode').handler('', h.ctx);
  h.ctx.sessionManager.getBranch = () => [{type:'custom', customType:'pstack-mode', data:{enabled:'true'}}];
  await h.emit('session_tree');
  assert.equal((await h.emit('before_agent_start', {systemPrompt:'base'})).systemPrompt, 'base');
});
test('no TUI status operations in headless mode', async t => {
  const h = harness(); t.after(h.close);
  h.ctx.mode = 'print'; h.ctx.hasUI = false;
  await h.emit('session_start');
  await h.commands.get('poteto-mode').handler('', h.ctx);
  assert.equal(h.statuses.length, 0);
});
