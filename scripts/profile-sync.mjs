import { readFileSync, writeFileSync, mkdirSync, lstatSync, readdirSync, openSync, closeSync, fsyncSync, fstatSync, constants, renameSync, linkSync, unlinkSync, rmdirSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { hostname, homedir } from 'node:os';
import { createHash, randomUUID } from 'node:crypto';
export const ROLES = ['investigator', 'poteto-agent', 'bug-fix', 'perf-issue', 'hillclimb', 'how-explorer', 'reviewer', 'researcher', 'verifier', 'verifier-sol', 'advisor'];
export function globalAgentDir() {
  const configured = process.env.PI_CODING_AGENT_DIR;
  return configured ? configured.replace(/^~(?=\/|$)/, homedir()) : join(homedir(), '.pi', 'agent');
}

const digest = text => createHash('sha256').update(text).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const CONFIG = ['model', 'thinking', 'systemPromptMode', 'enabled', 'tools', 'excludeTools', 'permission', 'noTools', 'noBuiltinTools', 'skills', 'noSkills', 'inheritSkills', 'extensions', 'noExtensions', 'agents', 'inheritGlobalContext', 'inheritProjectContext'];
const CAPABILITIES = CONFIG.filter(key => key !== 'model' && key !== 'thinking');
const KNOWN = new Set(['name', 'description', ...CONFIG]);
const ARRAYS = new Set(['tools', 'excludeTools', 'skills', 'extensions', 'agents']);
const MAX_BYTES = 1024 * 1024;

class Hold extends Error {
  constructor(reason, units = [], reasonCode = null) { super(reason); this.units = units; this.reasonCode = reasonCode; }
}
function safeDirectory(path, create = false) {
  path = resolve(path);
  const parent = dirname(path);
  if (parent !== path) safeDirectory(parent, create);
  try {
    const stat = lstatSync(path);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Hold('Unsafe global definition directory: ' + path);
  } catch (error) {
    if (error.code !== 'ENOENT' || !create) throw error;
    try { mkdirSync(path, { mode: 0o700 }); flushDirectory(parent); } catch (race) { if (race.code !== 'EEXIST') throw race; }
    safeDirectory(path);
  }
  return path;
}
function snapshot(path) {
  safeDirectory(dirname(path));
  try {
    const stat = lstatSync(path);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Hold('Conflicting global profile or unsafe state file: ' + path);
    if (stat.size > MAX_BYTES) throw new Hold('Document exceeds size limit: ' + path);
    const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
    let bytes;
    try {
      const opened = fstatSync(fd);
      if (!opened.isFile() || opened.dev !== stat.dev || opened.ino !== stat.ino) throw new Hold('File identity changed while reading: ' + path);
      bytes = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(readFileSync(fd));
    } finally { closeSync(fd); }
    const after = lstatSync(path);
    if (!after.isFile() || after.isSymbolicLink() || !equal([stat.dev, stat.ino, stat.size, stat.mtimeMs, stat.ctimeMs], [after.dev, after.ino, after.size, after.mtimeMs, after.ctimeMs])) throw new Hold('File changed while reading: ' + path);
    if (Buffer.byteLength(bytes) > MAX_BYTES) throw new Hold('Document grew beyond size limit: ' + path);
    if (bytes.includes('\0')) throw new Hold('NUL bytes in document: ' + path);
    return { bytes, hash: digest(bytes), identity: [stat.dev, stat.ino, stat.size, stat.mtimeMs, stat.ctimeMs] };
  } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
const sameSnapshot = (a, b) => a === null ? b === null : b !== null && a.hash === b.hash && equal(a.identity, b.identity);
function flushDirectory(path) {
  const fd = openSync(path, 'r');
  try { fsyncSync(fd); } finally { closeSync(fd); }
}
function durableWrite(path, bytes) {
  const fd = openSync(path, 'wx', 0o600);
  try { writeFileSync(fd, bytes); fsyncSync(fd); } finally { closeSync(fd); }
  flushDirectory(dirname(path));
}
function publish(path, bytes, expected, onPublished = () => {}) {
  if (!sameSnapshot(expected, snapshot(path))) throw new Hold('File changed before publication: ' + path);
  const temp = join(dirname(path), '.pstack-sync-' + randomUUID());
  durableWrite(temp, bytes);
  try {
    if (!sameSnapshot(expected, snapshot(path))) throw new Hold('File changed before publication: ' + path);
    if (expected === null) linkSync(temp, path);
    else renameSync(temp, path);
    onPublished();
    flushDirectory(dirname(path));
  } finally {
    try { unlinkSync(temp); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}

function verifiedTemplateReader(bytes) {
  const header = bytes.match(/^---\n([\s\S]*?)\n---\n/);
  if (!header) throw new Hold('Unsupported shipped template');
  const frontmatter = {};
  for (const line of header[1].split('\n')) {
    const match = line.match(/^(\w+): (.+)$/);
    if (!match) throw new Hold('Host parser required for shipped layout');
    const value = match[2];
    frontmatter[match[1]] = /^[\["{]|^(?:true|false|null)$/.test(value) ? JSON.parse(value) : value;
  }
  return { frontmatter, body: bytes.slice(header[0].length).trim() };
}
function document(bytes, role, reader) {
  if (!reader) throw new Hold('Public Pi parser unavailable; restore host parser and restart');
  if (typeof bytes !== 'string' || Buffer.byteLength(bytes) > MAX_BYTES || bytes.includes('\0') || bytes.includes('\r') || bytes.startsWith('\uFEFF')) throw new Hold('Unsupported document encoding/layout');
  const header = bytes.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!header) throw new Hold('Unsupported document; complete frontmatter required');
  const lines = (header[1] + '\n').split(/(?<=\n)/);
  const blocks = new Map();
  let prefix = '', active;
  for (const line of lines) {
    if (!line) continue;
    const match = line.match(/^([a-zA-Z][a-zA-Z0-9]*):(?:\s|$)/);
    if (match) {
      if (!KNOWN.has(match[1]) || blocks.has(match[1])) throw new Hold('Unknown or duplicate frontmatter field', [match[1]]);
      active = match[1]; blocks.set(active, line);
    } else if (/^\S/.test(line) && !line.startsWith('#') && !(active && ARRAYS.has(active) && /^\]\s*(?:#.*)?$/.test(line.trimEnd()))) throw new Hold('Unsupported YAML layout');
    else if (active) blocks.set(active, blocks.get(active) + line);
    else prefix += line;
    if (/(?:^|[\s,[{])[&*!][\w]|<<:|[|>][+-]?\s*$/.test(line.replace(/"(?:[^"\\]|\\.)*"|'(?:[^']|'')*'/g, '').replace(/\s#.*$/, ''))) throw new Hold('Unsupported YAML constructs');
  }
  const parsed = reader(bytes);
  const fields = parsed.frontmatter;
  if (!fields || typeof fields !== 'object' || Array.isArray(fields) || Object.keys(fields).some(key => !blocks.has(key))) throw new Hold('Unsupported parsed frontmatter');
  if (fields.name !== 'pstack-' + role) throw new Hold('Role identity mismatch', ['name']);
  if ('description' in fields && typeof fields.description !== 'string') throw new Hold('Description must be a string', ['description']);
  for (const key of CONFIG) {
    if (!(key in fields)) continue;
    const value = fields[key];
    if (ARRAYS.has(key)) {
      if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !item.trim())) throw new Hold('Unsupported configuration value', [key]);
    } else if (key === 'permission') {
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Hold('Unsupported permission mapping', [key]);
    } else if (key === 'thinking') {
      if (value !== false && !['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'].includes(value)) throw new Hold('Unsupported thinking value', [key]);
    } else if (key === 'model') {
      if (typeof value !== 'string' || !value.trim()) throw new Hold('Unsupported model value', [key]);
    } else if (key === 'systemPromptMode') {
      if (!['append', 'replace'].includes(value)) throw new Hold('Unsupported system prompt mode', [key]);
    } else if (typeof value !== 'boolean') throw new Hold('Unsupported configuration value', [key]);
  }
  const body = bytes.slice(header[0].length);
  if (typeof parsed.body !== 'string' || parsed.body !== body.trim()) throw new Hold('Parser and raw document disagree');
  return { bytes, fields, blocks, prefix, body };
}
const unit = (fields, key) => key in fields ? { present: fields[key] } : { absent: true };
function merge(base, local, incoming, role, reader) {
  const changedCapabilities = CAPABILITIES.filter(key => !equal(unit(base.fields, key), unit(incoming.fields, key)));
  if (changedCapabilities.length) throw new Hold('Package capability-configuration change requires explicit review', changedCapabilities);
  const choose = (b, l, n, key) => {
    if (equal(l, b)) return 'incoming';
    if (equal(n, b) || equal(l, n)) return 'local';
    throw new Hold('Local and package changes conflict; reconcile this unit explicitly', [key]);
  };
  const description = choose(unit(base.fields, 'description'), unit(local.fields, 'description'), unit(incoming.fields, 'description'), 'description');
  const body = choose(base.body.trim(), local.body.trim(), incoming.body.trim(), 'body');
  const blocks = new Map(local.blocks);
  if (description === 'incoming' && !equal(unit(local.fields, 'description'), unit(incoming.fields, 'description'))) {
    const old = local.blocks.get('description');
    const tail = old ? old.slice(old.indexOf('\n') + 1) : '';
    if (tail.split('\n').some(line => line.trim() && !line.trim().startsWith('#'))) throw new Hold('Multiline description needs explicit reconciliation', ['description']);
    let comment = '';
    if (old) {
      const line = old.slice(0, old.indexOf('\n'));
      let quote = null;
      for (let i = line.indexOf(':') + 1; i < line.length; i++) {
        const ch = line[i];
        if (quote === '"' && ch === '\\') { i++; continue; }
        if (quote && ch === quote) { if (quote === "'" && line[i + 1] === "'") { i++; continue; } quote = null; }
        else if (!quote && (ch === '"' || ch === "'")) quote = ch;
        else if (!quote && ch === '#' && /\s/.test(line[i - 1])) { comment = ' ' + line.slice(i); break; }
      }
    }
    if ('description' in incoming.fields) blocks.set('description', 'description: ' + JSON.stringify(incoming.fields.description) + comment + '\n' + tail);
    else if (old) blocks.set('description', (comment ? comment.trimStart() + '\n' : '') + tail);
  }
  const candidate = '---\n' + local.prefix + [...blocks.values()].join('') + '---\n' + (body === 'incoming' && local.body.trim() !== incoming.body.trim() ? local.body.match(/^\s*/)[0] + incoming.body.trim() + local.body.match(/\s*$/)[0] : local.body);
  const proposed = document(candidate, role, reader);
  const changed = CONFIG.filter(key => !equal(unit(local.fields, key), unit(proposed.fields, key)));
  if (changed.length) throw new Hold('Proposed configuration differs from installed configuration', changed);
  if (body === 'incoming' && proposed.body !== local.body && proposed.body.split('\n').some(line => /^@(?:[./~\\]|[A-Za-z]:)/.test(line.trim()))) throw new Hold('New prompt instruction file references require explicit review', ['body']);
  return candidate;
}
export function catalog(root) {
  const path = join(root, 'scripts', 'profile-history.json');
  const data = JSON.parse(snapshot(path)?.bytes ?? 'null');
  if (data?.schema !== 1 || !/^[a-f0-9]{40}$/.test(data.sourceCommit) || typeof data.revision !== 'string' || !Array.isArray(data.predecessors) || !Array.isArray(data.history)) throw new Hold('Unsupported package history catalog');
  for (const ancestor of data.predecessors) {
    if (typeof ancestor.revision !== 'string' || !/^[a-f0-9]{64}$/.test(ancestor.hash)) throw new Hold('Invalid package predecessor');
  }
  const templates = {};
  for (const role of ROLES) {
    const bytes = snapshot(join(root, 'definitions', 'pstack-' + role + '.md'))?.bytes;
    if (!bytes || digest(bytes) !== data.templates?.[role]) throw new Hold('Package template hash mismatch', [role]);
    if (bytes.split('\n').some(line => /^@(?:[./~\\]|[A-Za-z]:)/.test(line.trim()))) throw new Hold('Package prompt instruction file references require explicit review', [role]);
    templates[role] = bytes;
  }
  for (const record of data.history) {
    if (!ROLES.includes(record.role) || typeof record.bytes !== 'string' || digest(record.bytes) !== record.sha256 || !Array.isArray(record.sources) || !record.sources.length || record.sources.some(source => !/^[a-f0-9]{40}$/.test(source.commit) || source.path !== 'definitions/pstack-' + record.role + '.md')) throw new Hold('Invalid historical template evidence');
  }
  return { ...data, templates, identity: { revision: data.revision, hash: digest(JSON.stringify([data.revision, data.predecessors, data.templates])) } };
}
function baseline(bytes, role) {
  const state = JSON.parse(bytes);
  if (state.schema !== 1 || state.role !== role || typeof state.template !== 'string' || digest(state.template) !== state.templateHash || typeof state.lastInstalled !== 'string' || digest(state.lastInstalled) !== state.lastInstalledHash || typeof state.package?.revision !== 'string' || !/^[a-f0-9]{64}$/.test(state.package.hash)) throw new Hold('Invalid baseline; inspect retained transaction backups');
  return state;
}
function relation(state, incoming) {
  if (equal(state.package, incoming.identity)) return;
  if (state.package.revision === incoming.identity.revision) throw new Hold('Same package revision has divergent template hashes');
  if (!incoming.predecessors.some(ancestor => equal(ancestor, state.package))) throw new Hold('Older or unrelated package cannot replace accepted baseline');
}
function plan(role, local, saved, incoming, reader) {
  const next = incoming.templates[role];
  const target = document(next, role, reader ?? verifiedTemplateReader);
  if (!local && saved) throw new Hold('Managed profile missing; restore from retained backup before synchronizing');
  let bytes = next, provenance = { kind: 'created' }, kind = 'created';
  if (local) {
    if (saved) {
      relation(saved, incoming);
      if (equal(saved.package, incoming.identity) && saved.template !== next) throw new Hold('Baseline bytes disagree with accepted package identity');
      if (saved.template === next && saved.lastInstalled === local.bytes) return { kind: 'unchanged' };
      const current = document(local.bytes, role, reader);
      bytes = merge(document(saved.template, role, reader), current, target, role, reader);
      provenance = saved.provenance;
      if (saved.template === next && bytes === local.bytes) return { kind: 'unchanged' };
      kind = bytes === local.bytes ? 'adopted' : 'updated';
    } else {
      const current = document(local.bytes, role, reader);
      let matches = [{ role, bytes: next, sources: [{ kind: 'package', package: incoming.identity, templateHash: digest(next), path: 'definitions/pstack-' + role + '.md' }] }, ...incoming.history.filter(record => record.role === role)]
        .map(record => ({ record, ancestor: document(record.bytes, role, reader) }))
        .filter(({ ancestor }) => ancestor.body.trim() === current.body.trim())
        .filter(({ ancestor }) => CAPABILITIES.every(key => equal(unit(ancestor.fields, key), unit(target.fields, key))));
      const installedMatches = matches.filter(({ ancestor }) => CAPABILITIES.every(key => !(key in ancestor.fields) || equal(unit(ancestor.fields, key), unit(current.fields, key))));
      if (installedMatches.length) matches = installedMatches;
      if (!matches.length) throw new Hold('No capability-compatible historical prompt instructions; compare package history and reconcile explicitly', ['body'], 'unmatched-shipped-prompt');
      const results = matches.map(({ record, ancestor }) => ({ record, bytes: merge(ancestor, current, target, role, reader) }));
      if (results.some(result => result.bytes !== results[0].bytes)) throw new Hold('Ambiguous historical ancestry', ['body']);
      bytes = results[0].bytes;
      provenance = { kind: 'compatible-body-baseline', candidates: results.map(result => ({ sources: result.record.sources, templateHash: digest(result.record.bytes) })) };
      kind = bytes === local.bytes ? 'adopted' : 'updated';
    }
  }
  return { kind, bytes, baseline: json({ schema: 1, role, package: incoming.identity, template: next, templateHash: digest(next), lastInstalled: bytes, lastInstalledHash: digest(bytes), provenance }) };
}

function recover(role, roleDir, profile, statePath, onPublished) {
  let recoveredPublication = null;
  const transactions = safeDirectory(join(roleDir, 'transactions'), true);
  for (const id of readdirSync(transactions).sort()) {
    if (!/^[a-f0-9-]{36}$/.test(id)) throw new Hold('Unknown transaction entry; inspect ' + transactions);
    const dir = safeDirectory(join(transactions, id));
    if (snapshot(join(dir, 'complete.json'))) continue;
    const journal = snapshot(join(dir, 'journal.json'));
    if (!journal) throw new Hold('Incomplete preparation; inspect and archive outside transactions/ ' + dir);
    const record = JSON.parse(journal.bytes);
    const target = snapshot(join(dir, 'target-profile.md'));
    const nextState = snapshot(join(dir, 'target-baseline.json'));
    const before = snapshot(join(dir, 'before-profile.md'));
    const beforeState = snapshot(join(dir, 'before-baseline.json'));
    if (record.schema !== 1 || record.role !== role || !target || !nextState || target.hash !== record.target || nextState.hash !== record.nextBaseline || (before?.hash ?? null) !== record.before || (beforeState?.hash ?? null) !== record.beforeBaseline) throw new Hold('Corrupt transaction evidence; inspect ' + dir);
    const proposedState = baseline(nextState.bytes, role);
    if (proposedState.lastInstalled !== target.bytes) throw new Hold('Transaction target disagrees with baseline; inspect ' + dir);
    const live = snapshot(profile), state = snapshot(statePath);
    const p = live?.hash ?? null, s = state?.hash ?? null;
    let outcome;
    if (p === record.before && s === record.beforeBaseline) outcome = 'abandoned-before-publication';
    else if (p === record.target && (s === record.beforeBaseline || s === record.nextBaseline)) {
      if (record.before !== record.target) {
        recoveredPublication = dir;
        onPublished({ kind: record.before === null ? 'created' : 'updated', backup: dir, recovered: true });
      }
      if (s !== record.nextBaseline) publish(statePath, nextState.bytes, state);
      outcome = 'recovered';
    } else throw new Hold('Unexpected profile/baseline content; preserve files and inspect ' + dir);
    durableWrite(join(dir, 'complete.json'), json({ outcome }));
  }
  return recoveredPublication;
}
function commit(role, roleDir, profile, statePath, local, state, planned, onPublished) {
  const dir = join(roleDir, 'transactions', randomUUID());
  safeDirectory(dir, true);
  if (local) durableWrite(join(dir, 'before-profile.md'), local.bytes);
  if (state) durableWrite(join(dir, 'before-baseline.json'), state.bytes);
  durableWrite(join(dir, 'target-profile.md'), planned.bytes);
  durableWrite(join(dir, 'target-baseline.json'), planned.baseline);
  durableWrite(join(dir, 'journal.json'), json({ schema: 1, role, before: local?.hash ?? null, beforeBaseline: state?.hash ?? null, target: digest(planned.bytes), nextBaseline: digest(planned.baseline) }));
  if (!sameSnapshot(local, snapshot(profile)) || !sameSnapshot(state, snapshot(statePath))) throw new Hold('Profile or baseline changed during preparation; inspect ' + dir);
  if (local?.bytes !== planned.bytes) publish(profile, planned.bytes, local, () => onPublished({ kind: local === null ? 'created' : 'updated', backup: dir, recovered: false }));
  publish(statePath, planned.baseline, state);
  durableWrite(join(dir, 'complete.json'), json({ outcome: 'committed' }));
  return dir;
}
const TRANSACTION_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const TRANSACTION_FILES = ['before-profile.md', 'before-baseline.json', 'target-profile.md', 'target-baseline.json', 'journal.json', 'complete.json'];
function ownedDirectory(path) {
  safeDirectory(path);
  const stat = lstatSync(path);
  if (typeof process.getuid !== 'function' || stat.uid !== process.getuid() || (stat.mode & 0o022) !== 0) throw new Error('Cleanup directory ownership cannot be verified: ' + path);
}
function cleanupFile(path) {
  const file = snapshot(path);
  if (file) {
    const stat = lstatSync(path);
    if (stat.uid !== process.getuid() || (stat.mode & 0o022) !== 0 || stat.nlink !== 1) throw new Error('Unsafe cleanup file ownership or links: ' + path);
  }
  return file;
}
function transactionFiles(dir) {
  ownedDirectory(dir);
  const files = {};
  for (const name of readdirSync(dir)) {
    if (!TRANSACTION_FILES.includes(name)) throw new Error('Unknown transaction content: ' + join(dir, name));
    files[name] = cleanupFile(join(dir, name));
    if (!files[name]) throw new Error('Transaction content disappeared: ' + join(dir, name));
  }
  return files;
}
function completedTransaction(role, dir) {
  const files = transactionFiles(dir);
  if (!files['complete.json']) return null;
  const completion = JSON.parse(files['complete.json'].bytes);
  const record = JSON.parse(files['journal.json']?.bytes ?? 'null');
  if (!equal(Object.keys(completion).sort(), ['outcome']) || !['committed', 'recovered', 'abandoned-before-publication'].includes(completion.outcome)
    || !record || !equal(Object.keys(record).sort(), ['before', 'beforeBaseline', 'nextBaseline', 'role', 'schema', 'target'])
    || record.schema !== 1 || record.role !== role
    || files['target-profile.md']?.hash !== record.target || files['target-baseline.json']?.hash !== record.nextBaseline
    || (files['before-profile.md']?.hash ?? null) !== record.before || (files['before-baseline.json']?.hash ?? null) !== record.beforeBaseline) throw new Error('Unverified completed transaction: ' + dir);
  const targetState = baseline(files['target-baseline.json'].bytes, role);
  if (targetState.lastInstalled !== files['target-profile.md'].bytes) throw new Error('Completed transaction target disagrees with baseline: ' + dir);
  if (files['before-baseline.json']) baseline(files['before-baseline.json'].bytes, role);
  const completed = lstatSync(join(dir, 'complete.json'), { bigint: true });
  return { dir, files, completedAt: completed.mtimeNs };
}
function drainCleanup(role, cleanup) {
  ownedDirectory(cleanup);
  for (const id of readdirSync(cleanup)) {
    if (!TRANSACTION_ID.test(id)) throw new Error('Unknown cleanup entry: ' + join(cleanup, id));
    const entry = join(cleanup, id);
    ownedDirectory(entry);
    const names = readdirSync(entry);
    if (names.some(name => !['receipt.json', 'transaction'].includes(name))) throw new Error('Unknown cleanup structure: ' + entry);
    if (!names.length) { rmdirSync(entry); flushDirectory(cleanup); continue; }
    const receipt = JSON.parse(cleanupFile(join(entry, 'receipt.json'))?.bytes ?? 'null');
    if (!receipt || receipt.schema !== 1 || receipt.role !== role || receipt.id !== id
      || !equal(Object.keys(receipt).sort(), ['files', 'id', 'role', 'schema'])
      || !receipt.files || Array.isArray(receipt.files) || typeof receipt.files !== 'object'
      || !['journal.json', 'complete.json', 'target-profile.md', 'target-baseline.json'].every(name => Object.hasOwn(receipt.files, name))
      || Object.entries(receipt.files).some(([name, hash]) => !TRANSACTION_FILES.includes(name) || typeof hash !== 'string' || !/^[a-f0-9]{64}$/.test(hash))) throw new Error('Unverified cleanup receipt: ' + entry);
    const moved = join(entry, 'transaction');
    if (names.includes('transaction')) {
      const files = transactionFiles(moved);
      if (Object.entries(files).some(([name, file]) => file.hash !== receipt.files[name])) throw new Error('Unexpected cleanup content; preserve ' + entry);
      // Flush the move before deleting any evidence, including on resumed cleanup.
      flushDirectory(join(dirname(cleanup), 'transactions'));
      flushDirectory(entry);
      for (const [name, file] of Object.entries(files)) {
        const path = join(moved, name);
        if (!sameSnapshot(file, snapshot(path))) throw new Error('Cleanup content changed: ' + path);
        unlinkSync(path);
      }
      flushDirectory(moved);
      rmdirSync(moved);
      flushDirectory(entry);
    }
    unlinkSync(join(entry, 'receipt.json'));
    flushDirectory(entry);
    rmdirSync(entry);
    flushDirectory(cleanup);
  }
}
function pruneCompleted(role, roleDir) {
  const transactions = join(roleDir, 'transactions');
  const completed = [];
  for (const id of readdirSync(transactions)) {
    if (!TRANSACTION_ID.test(id)) throw new Error('Unknown transaction entry; preserve ' + transactions);
    const evidence = completedTransaction(role, join(transactions, id));
    if (evidence) completed.push(evidence);
  }
  completed.sort((a, b) => a.completedAt > b.completedAt ? -1 : a.completedAt < b.completedAt ? 1 : 0);
  if (completed.length > 1 && completed[0].completedAt === completed[1].completedAt) throw new Error('Completed transaction timestamps tie; cannot select latest safely in ' + transactions);
  const cleanup = join(roleDir, 'cleanup');
  let existingCleanup = false;
  try { lstatSync(cleanup); existingCleanup = true; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (existingCleanup) drainCleanup(role, cleanup);
  if (completed.length < 2) return;
  safeDirectory(cleanup, true);
  ownedDirectory(cleanup);
  for (const evidence of completed.slice(1)) {
    const id = evidence.dir.slice(transactions.length + 1);
    const entry = join(cleanup, id);
    mkdirSync(entry, { mode: 0o700 });
    flushDirectory(cleanup);
    durableWrite(join(entry, 'receipt.json'), json({ schema: 1, role, id, files: Object.fromEntries(Object.entries(evidence.files).map(([name, file]) => [name, file.hash])) }));
    const current = transactionFiles(evidence.dir);
    if (!equal(Object.keys(current).sort(), Object.keys(evidence.files).sort())
      || Object.entries(current).some(([name, file]) => !sameSnapshot(evidence.files[name], file))) throw new Error('Completed transaction changed before cleanup: ' + evidence.dir);
    renameSync(evidence.dir, join(entry, 'transaction'));
    flushDirectory(transactions);
    flushDirectory(entry);
    drainCleanup(role, cleanup);
  }
}
function backupEvidence(roleDir, original) {
  const directoryExists = path => {
    try { safeDirectory(path); return true; }
    catch (error) { if (error.code === 'ENOENT') return false; throw error; }
  };
  try {
    if (directoryExists(original)) return { kind: 'retained', path: original };
    const entry = join(roleDir, 'cleanup', basename(original));
    const staged = join(entry, 'transaction');
    if (directoryExists(staged)) return { kind: 'staged', path: staged, receiptPath: join(entry, 'receipt.json') };
    if (directoryExists(entry) && snapshot(join(entry, 'receipt.json'))) return { kind: 'pruned', receiptPath: join(entry, 'receipt.json') };
    return { kind: 'pruned' };
  } catch (error) { return { kind: 'unavailable', reason: error.message }; }
}
function coordination(lock) {
  try {
    const owner = JSON.parse(snapshot(join(lock, 'owner.json'))?.bytes ?? 'null');
    if (owner?.host === hostname() && Number.isSafeInteger(owner.pid) && owner.pid > 0) {
      try { process.kill(owner.pid, 0); return { kind: 'busy', action: 'Another synchronizer owns ' + lock + '. Retry on next Lead startup.' }; }
      catch (error) { if (error.code !== 'ESRCH') return { kind: 'recovery-required', action: 'Cannot verify lock owner. Inspect ' + lock }; }
    }
  } catch {}
  return { kind: 'recovery-required', action: 'Inspect ' + lock + '. After verifying no synchronizer is running, archive the lock directory and restart Pi to recover retained transactions.' };
}
export function synchronizeGlobalProfiles({ packageRoot, agentDir = globalAgentDir(), parseFrontmatter } = {}) {
  const profiles = [];
  const report = { profiles, coordination: { kind: 'complete' }, restartRequired: false };
  let lock, owned = false;
  try {
    const incoming = catalog(packageRoot);
    const agents = safeDirectory(join(agentDir, 'agents'), true);
    const store = safeDirectory(join(agentDir, 'pstack-profile-sync'), true);
    lock = join(store, 'lock');
    try { mkdirSync(lock, { mode: 0o700 }); owned = true; }
    catch (error) { if (error.code !== 'EEXIST') throw error; safeDirectory(lock); report.coordination = coordination(lock); return report; }
    durableWrite(join(lock, 'owner.json'), json({ host: hostname(), pid: process.pid }));
    flushDirectory(store);
    for (const role of ROLES) {
      const path = join(agents, 'pstack-' + role + '.md');
      const roleDir = join(store, 'roles', role);
      const publications = [];
      const onPublished = publication => { publications.push(publication); report.restartRequired = true; };
      let result;
      try {
        safeDirectory(roleDir, true);
        const statePath = join(roleDir, 'baseline.json');
        const recovered = recover(role, roleDir, path, statePath, onPublished);
        const local = snapshot(path), state = snapshot(statePath);
        const planned = plan(role, local, state && baseline(state.bytes, role), incoming, parseFrontmatter);
        if (planned.kind === 'unchanged') result = recovered ? { kind: 'updated', role, path, backup: recovered, recovered: true, publications } : { kind: 'unchanged', role, path, publications };
        else {
          const backup = commit(role, roleDir, path, statePath, local, state, planned, onPublished);
          result = { kind: planned.kind, role, path, backup, publications };
        }
        try { pruneCompleted(role, roleDir); }
        catch (error) {
          result = { ...result, kind: 'failed', reason: 'Profile synchronization succeeded (' + result.kind + '), but backup cleanup failed: ' + error.message,
            action: 'Profile synchronization succeeded (' + result.kind + '). Inspect retained cleanup evidence at ' + roleDir + ': ' + error.message, evidencePath: roleDir, units: [] };
        }
      } catch (error) {
        result = { kind: error instanceof Hold ? 'held' : 'failed', role, path, publications, units: error.units ?? [], reason: error.message, reasonCode: error.reasonCode ?? null, action: error.message + '. Inspect retained state and backups at ' + roleDir, evidencePath: roleDir };
      }
      const evidenceByBackup = new Map();
      const reconcileBackup = record => {
        const original = record.backup;
        if (!evidenceByBackup.has(original)) evidenceByBackup.set(original, backupEvidence(roleDir, original));
        const evidence = evidenceByBackup.get(original);
        return { ...record, transactionId: basename(original), backup: evidence.path ?? null, backupEvidence: evidence };
      };
      result.publications = publications.map(reconcileBackup);
      if (result.backup) result = reconcileBackup(result);
      profiles.push(result);
    }
  } catch (error) { report.coordination = { kind: 'recovery-required', action: error.message }; }
  finally {
    if (owned) {
      try { unlinkSync(join(lock, 'owner.json')); rmdirSync(lock); flushDirectory(dirname(lock)); }
      catch (error) { report.coordination = { kind: 'recovery-required', action: 'Could not release ' + lock + ': ' + error.message }; }
    }
  }
  return report;
}

export function installMissingFacade(root, agentDir) {
  safeDirectory(join(agentDir, 'agents'), true);
  for (const role of ROLES) snapshot(join(agentDir, 'agents', 'pstack-' + role + '.md'));
  const report = synchronizeGlobalProfiles({ packageRoot: root, agentDir });
  if (report.coordination.kind !== 'complete') throw new Error(report.coordination.action);
  const failure = report.profiles.find(profile => profile.kind === 'failed');
  if (failure) throw new Error(failure.action);
  return report.profiles.filter(profile => profile.kind === 'created').map(profile => profile.path);
}
