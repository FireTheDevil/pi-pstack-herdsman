import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

test("bundled multi-phase-plan skeleton passes check-plan.mjs", (t) => {
	const playbook = readFileSync(join(here, "../playbooks/multi-phase-plan.md"), "utf8");
	const open = playbook.indexOf("````markdown\n");
	assert.notEqual(open, -1, "playbook is missing the skeleton fence");
	const start = open + "````markdown\n".length;
	const close = playbook.indexOf("````", start);
	assert.notEqual(close, -1, "playbook skeleton fence is unclosed");
	const tempRoot = join(here, "../../../.pi-herdsman/tmp");
	mkdirSync(tempRoot, { recursive: true });
	const dir = mkdtempSync(join(tempRoot, "check-plan-"));
	t.after(() => rmSync(dir, { recursive: true, force: true }));
	const file = join(dir, "plan.md");
	const skeleton = playbook.slice(start, close);
	writeFileSync(file, skeleton);
	const result = spawnSync(process.execPath, [join(here, "check-plan.mjs"), file], {
		encoding: "utf8",
	});
	assert.equal(result.status, 0, result.stderr + result.stdout);
	// Exercise the CLI against invalid plans, not just constants in its source.
	for (const [label, oldText, replacement, diagnostic] of [
		["cadence", "hourly", "30-minute", 'Program checklist lacks "hourly"'],
		["scheduler authority", "explicitly authorized scheduler", "scheduler", 'Program checklist lacks "explicitly authorized scheduler"'],
		["objective", "standing goal", "objective", 'Program checklist lacks "standing goal"'],
	]) {
		assert.ok(skeleton.includes(oldText), label);
		writeFileSync(file, skeleton.replace(oldText, replacement));
		const rejected = spawnSync(process.execPath, [join(here, "check-plan.mjs"), file], { encoding: "utf8" });
		assert.equal(rejected.status, 1, label + rejected.stderr);
		assert.ok(rejected.stderr.includes(diagnostic), rejected.stderr);
	}

});
