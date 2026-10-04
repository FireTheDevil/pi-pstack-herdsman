import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { test } from 'node:test';

const root = resolve(import.meta.dirname, '..');
const script = join(root, 'skills/show-me-your-work/scripts/log.sh');
const header = 'ts\tphase\tdecision\twhy\tevidence\tresult\n';
const row = '\tbuild\tchecked export\tverify result\tproof.json\tgreen\n';

for (const [label, initial] of [
  ['missing log', null],
  ['empty existing log', ''],
  ['existing rows', header + '2026-01-01T00:00:00Z\tstart\tprior run\tresume\tsession-a\topen\n'],
]) {
  test('decision log initializes and appends safely: ' + label, (t) => {
    const tempRoot = join(root, '.pi-herdsman/tmp');
    mkdirSync(tempRoot, { recursive: true });
    const dir = mkdtempSync(join(tempRoot, 'parity-log-'));
    t.after(() => rmSync(dir, { recursive: true, force: true }));
    const path = join(dir, 'decisions.tsv');
    if (initial !== null) writeFileSync(path, initial);
    const run = () => spawnSync('bash', [script, path, 'build', 'checked export', 'verify result', 'proof.json', 'green'], {
      encoding: 'utf8', timeout: 10000,
    });
    const first = run();
    assert.equal(first.status, 0, first.stderr);
    const afterFirst = readFileSync(path, 'utf8');
    const prefix = initial || header;
    assert.equal(afterFirst.slice(0, prefix.length), prefix, 'preserve header and prior rows byte-for-byte');
    const appended = afterFirst.slice(prefix.length);
    assert.match(appended, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ\t/);
    assert.equal(appended.slice(appended.indexOf('\t')), row);
    const second = run();
    assert.equal(second.status, 0, second.stderr);
    const afterSecond = readFileSync(path, 'utf8');
    assert.equal(afterSecond.slice(0, afterFirst.length), afterFirst, 'second append preserves the complete existing log');
    assert.equal(afterSecond.split('\n').filter(line => line === header.trimEnd()).length, 1, 'header appears only once');
    const secondRow = afterSecond.slice(afterFirst.length);
    assert.equal(secondRow.slice(secondRow.indexOf('\t')), row);
  });
}
