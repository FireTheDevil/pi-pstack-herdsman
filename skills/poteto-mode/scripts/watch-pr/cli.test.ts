import { describe, expect, it } from "bun:test";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { type CliRuntime, main, parseArgs } from "./cli.ts";
import { fakeReader, passingCheck } from "./fakes.test-helper.ts";
import { renderJson, renderPretty } from "./render.ts";
import type { GitHubReader, WatcherVerdict } from "./types.ts";
import { parsePrNumber } from "./types.ts";

const silentIo = { stdout: () => {}, stderr: () => {} };

function testRuntime(reader: GitHubReader): {
  readonly runtime: CliRuntime;
  readonly stdout: string[];
  readonly stderr: string[];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    stdout,
    stderr,
    runtime: {
      reader,
      clock: {
        now: () => 0,
        observedAt: () => "2026-07-26T00:00:00.000Z",
        async sleep() {
          throw new Error("test unexpectedly slept");
        },
      },
      stdout: (value) => stdout.push(value),
      stderr: (value) => stderr.push(value),
    },
  };
}

describe("parseArgs", () => {
  it("uses the specified defaults", () => {
    expect(parseArgs([], silentIo)).toMatchObject({
      owner: null,
      repo: null,
      pr: null,
      mode: "single",
      stackPrs: [],
      statusOnly: false,
      pretty: false,
      polling: {
        interval: 60,
        sweepInterval: 300,
        timeout: 0,
        maxQueryErrors: 5,
        allowDraft: false,
      },
    });
  });

  it("parses a frozen queued stack bottom-to-top", () => {
    const parsed = parseArgs(
      [
        "--queued-stack",
        "--stack-prs",
        "#10, 11,#12",
        "--interval",
        "2.5",
        "--sweep-interval",
        "30",
        "--timeout",
        "0",
        "--max-query-errors",
        "3",
        "--allow-draft",
        "--pretty",
      ],
      silentIo
    );
    expect(parsed.mode).toBe("queued-stack");
    expect(parsed.stackPrs.map(Number)).toEqual([10, 11, 12]);
    expect(parsed.polling).toEqual({
      interval: 2.5,
      sweepInterval: 30,
      timeout: 0,
      maxQueryErrors: 3,
      allowDraft: true,
    });
    expect(parsed.pretty).toBe(true);
  });

  it("rejects every invalid mode and numeric shape as usage", async () => {
    const invalid = [
      ["--unknown"],
      ["--interval", "0"],
      ["--sweep-interval", "-1"],
      ["--timeout", "-1"],
      ["--max-query-errors", "1.5"],
      ["--stack", "--queued-stack"],
      ["--stop-at-frontier-ready"],
      ["--stack", "--stop-at-frontier-ready"],
      ["--queued-stack", "--status-only", "--stop-at-frontier-ready"],
      ["--stack-prs", "1,2"],
      ["--queued-stack", "--stack-prs", "1,1"],
    ];
    for (const argv of invalid) {
      const harness = testRuntime(fakeReader());
      expect(await main(argv, harness.runtime)).toBe(64);
      expect(harness.stdout).toEqual([]);
      expect(harness.stderr.join("")).toContain("error:");
    }
  });
});

describe("rendering", () => {
  const context = {
    owner: "owner",
    repo: "repo",
    number: parsePrNumber(1),
  };
  const status = {
    schemaVersion: 1,
    sequence: 1,
    observedAt: "2026-07-26T00:00:00.000Z",
    mode: "single",
    kind: "STATUS",
    terminal: true,
    exitCode: 0,
    reason: "status-only",
    rows: [
      {
        kind: "merged",
        context,
        facts: {
          context,
          mergeable: "MERGEABLE",
          mergeStateStatus: "CLEAN",
          reviewDecision: "APPROVED",
          headRefOid: "head",
          headRefName: "feature",
          baseRefName: "main",
          state: "MERGED",
          mergedAt: "now",
          isDraft: false,
        },
      },
    ],
  } satisfies WatcherVerdict;

  it("emits compact valid JSON by default", () => {
    const rendered = renderJson(status);
    expect(rendered.endsWith("\n")).toBe(true);
    expect(JSON.parse(rendered)).toEqual(status);
  });

  it("renders the Markdown table from the same verdict only", () => {
    const rendered = renderPretty(status);
    expect(rendered).toContain("| PR | CI | Review | Merge |");
    expect(rendered).toContain(
      "| [#1](https://github.com/owner/repo/pull/1) | \u2014 | \u2014 | ✅ merged |"
    );
  });
});

describe("main", () => {
  it("returns one genuine nonterminal frontier receipt without sleeping", async () => {
    const harness = testRuntime(fakeReader());
    const code = await main([
      "--owner", "owner", "--repo", "repo", "--queued-stack",
      "--stack-prs", "10,11", "--stop-at-frontier-ready",
    ], harness.runtime);
    expect(code).toBe(0);
    const events: unknown[] = harness.stdout.map(value => JSON.parse(value));
    expect(events).toHaveLength(3);
    expect(events[2]).toEqual({
      schemaVersion: 1, sequence: 3, observedAt: "2026-07-26T00:00:00.000Z",
      mode: "queued-stack", kind: "WAITING", terminal: false,
      frontier: { owner: "owner", repo: "repo", number: 10 },
      reason: { kind: "merge-queue", unmergedCount: 2 },
    });
    expect(harness.stderr).toEqual([]);
  });
  it("returns EX_USAGE 64 and writes usage errors only to stderr", async () => {
    const harness = testRuntime(fakeReader());
    expect(await main(["--interval", "0"], harness.runtime)).toBe(64);
    expect(harness.stdout).toEqual([]);
    expect(harness.stderr.join("")).toContain(
      "option '--interval <seconds>' argument '0' is invalid"
    );
  });

  it("bypasses the queue machine for queued-stack status-only", async () => {
    const reader = fakeReader();
    const harness = testRuntime(reader);
    const code = await main(
      [
        "--owner",
        "owner",
        "--repo",
        "repo",
        "--queued-stack",
        "--stack-prs",
        "1",
        "--status-only",
      ],
      harness.runtime
    );
    expect(code).toBe(0);
    expect(harness.stdout).toHaveLength(1);
    const verdict: unknown = JSON.parse(harness.stdout[0]);
    expect(verdict).toMatchObject({
      kind: "STATUS",
      terminal: true,
      exitCode: 0,
      mode: "queued-stack",
    });
    expect(harness.stdout[0]).not.toContain('"kind":"QUEUE"');
  });

  it("returns exit 4 for a hidden GitHub-side CI refusal", async () => {
    const reader = fakeReader({
      facts: { mergeStateStatus: "BLOCKED" },
      fastPath: { kind: "checks", checks: [passingCheck()] },
      commitRollups: [{ oid: "head", state: "FAILURE" }],
    });
    const harness = testRuntime(reader);
    const code = await main(
      ["--owner", "owner", "--repo", "repo", "--pr", "1"],
      harness.runtime
    );
    expect(code).toBe(4);
    expect(harness.stdout).toHaveLength(1);
    expect(JSON.parse(harness.stdout[0])).toMatchObject({
      kind: "BLOCKER",
      exitCode: 4,
      blocker: {
        kind: "failing-checks",
        ci: { kind: "ci-github-rejected" },
      },
    });
  });

  it("shows help without touching the reader", async () => {
    const reader = fakeReader();
    const harness = testRuntime(reader);
    expect(await main(["--help"], harness.runtime)).toBe(0);
    expect(harness.stdout.join("")).toContain("JSON (NDJSON while polling)");
    expect(reader.calls).toEqual([]);
  });
});

function processFixture() {
  const dir = mkdtempSync(join(tmpdir(), "pstack-watcher-"));
  const scripts = join(dir, "scripts");
  mkdirSync(scripts);
  const source = join(import.meta.dir, "..");
  for (const path of ["bootstrap.ts", "package.json", "bun.lock", "watch-pr"])
    cpSync(join(source, path), join(scripts, path), { recursive: true });
  const commander = dirname(fileURLToPath(import.meta.resolve("commander")));
  expect(JSON.parse(readFileSync(join(commander, "package.json"), "utf8")).version).toBe("14.0.0");
  cpSync(commander, join(scripts, "node_modules/commander"), { recursive: true, dereference: true });
  const key = createHash("sha256").update(readFileSync(join(scripts, "package.json"))).update("\0").update(readFileSync(join(scripts, "bun.lock"))).digest("hex");
  writeFileSync(join(scripts, "node_modules/.poteto-mode-tools-install-key"), key + "\n");
  const bin = join(dir, "bin");
  mkdirSync(bin);
  const log = join(dir, "forge.jsonl");
  const merged = join(dir, "merged");
  writeFileSync(join(bin, "gh"), `#!${process.execPath}
import { appendFileSync, existsSync } from "node:fs";
const args = process.argv.slice(2);
appendFileSync(${JSON.stringify(log)}, JSON.stringify({ pid: process.pid, args }) + "\\n");
let result;
if (args[0] === "pr" && args[1] === "view") {
  const done = existsSync(${JSON.stringify(merged)});
  result = { mergeable: "MERGEABLE", mergeStateStatus: "CLEAN", reviewDecision: "APPROVED", headRefOid: "head", headRefName: "feature", baseRefName: "main", state: done ? "MERGED" : "OPEN", mergedAt: done ? "now" : null, isDraft: false };
} else if (args[0] === "pr" && args[1] === "checks") {
  const pending = args[2] === "11";
  result = [{ name: "ci", state: pending ? "PENDING" : "SUCCESS", description: "", link: "", workflow: "", bucket: pending ? "pending" : "pass" }];
} else if (args[0] === "api" && args[1] === "graphql") {
  result = args.some(a => a.includes("ReviewThreads"))
    ? { data: { repository: { pullRequest: { reviewThreads: { nodes: [] } } } } }
    : { data: { repository: { pullRequest: { commits: { nodes: [{ commit: { oid: "head", statusCheckRollup: { state: "SUCCESS" } } }] } } } } };
} else { throw new Error("Forbidden forge operation: " + args.join(" ")); }
console.log(JSON.stringify(result));
`, { mode: 0o755 });
  const guard = join(dir, "no-install.mjs");
  const forbidden = join(dir, "forbidden-spawn");
  writeFileSync(guard, `import { writeFileSync } from "node:fs";
Bun.spawnSync = () => { writeFileSync(${JSON.stringify(forbidden)}, "spawn attempted"); throw new Error("install/restart forbidden in test"); };
`);
  return { dir, scripts, bin, log, merged, guard, forbidden };
}
function bytesIn(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? bytesIn(path) : [path + ":" + createHash("sha256").update(readFileSync(path)).digest("hex")];
  });
}
function isAlive(pid: number): boolean {
  try { process.kill(pid, 0); return true; } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ESRCH") return false;
    throw error;
  }
}
async function launchWatcher(fixture: ReturnType<typeof processFixture>, flags: string[], onOutput: (text: string, pid: number) => void = () => {}) {
  const child = spawn(process.execPath, ["--preload", fixture.guard, join(fixture.scripts, "watch-pr/watch-pr"), "--owner", "owner", "--repo", "repo", "--queued-stack", "--stack-prs", "10,11", "--interval", "0.02", ...flags], {
    cwd: fixture.dir, env: { ...process.env, PATH: fixture.bin + ":" + process.env.PATH }, stdio: ["ignore", "pipe", "pipe"],
  });
  const pid = child.pid;
  if (pid === undefined) throw new Error("watcher did not start");
  let stdout = "";
  let stderr = "";
  let timedOut = false;
  const watchdog = setTimeout(() => { timedOut = true; child.kill("SIGKILL"); }, 5_000);
  try {
    const code = await new Promise<number | null>((resolve, reject) => {
      child.stdout.on("data", chunk => { stdout += String(chunk); onOutput(stdout, pid); });
      child.stderr.on("data", chunk => { stderr += String(chunk); });
      child.on("error", reject);
      child.on("close", resolve);
    });
    expect(timedOut).toBe(false);
    expect(isAlive(pid)).toBe(false);
    const calls: { pid: number; args: string[] }[] = existsSync(fixture.log) ? readFileSync(fixture.log, "utf8").trim().split("\n").map(line => JSON.parse(line)) : [];
    for (const call of calls) {
      expect(isAlive(call.pid)).toBe(false);
      expect(call.args).not.toContain("merge");
    }
    const bootstrapAttempted = existsSync(fixture.forbidden);
    console.log(JSON.stringify({ fixture: flags, watcherPid: pid, forgePids: calls.map(c => c.pid), code, timedOut, cleaned: true, bootstrapAttempted }));
    expect(bootstrapAttempted).toBe(false);
    return { code, stdout, stderr, calls };
  } finally {
    clearTimeout(watchdog);
    if (isAlive(pid)) {
      child.kill("SIGKILL");
      await new Promise<void>(resolve => child.once("close", () => resolve()));
    }
  }
}

describe("real executable lifetime", () => {
  it("rejects bounded equals forms before bootstrap with missing dependencies", async () => {
    for (const flag of ["--stop-at-frontier-ready=true", "--stop-at-frontier-ready=", "--stop-at-frontier-ready=false"]) {
      const fixture = processFixture();
      try {
        rmSync(join(fixture.scripts, "node_modules"), { recursive: true });
        const before = bytesIn(fixture.dir);
        const result = await launchWatcher(fixture, [flag]);
        expect(result.code).toBe(64);
        expect(result.stderr).toContain("use --stop-at-frontier-ready exactly, without a value or abbreviation");
        expect(result.stdout).toBe("");
        expect(result.calls).toEqual([]);
        expect(bytesIn(fixture.dir)).toEqual(before);
      } finally { rmSync(fixture.dir, { recursive: true, force: true }); }
    }
  }, 10_000);

  it("rejects every bounded long-option prefix before bootstrap", async () => {
    const option = "--stop-at-frontier-ready";
    const prefixes = Array.from({ length: option.length - 3 }, (_, index) => option.slice(0, index + 3));
    for (const flag of [...prefixes, "--stop=false", option + "-extra"]) {
      const fixture = processFixture();
      try {
        rmSync(join(fixture.scripts, "node_modules"), { recursive: true });
        const before = bytesIn(fixture.dir);
        const result = await launchWatcher(fixture, [flag]);
        expect(result.code).toBe(64);
        expect(result.stderr).toContain("use --stop-at-frontier-ready exactly, without a value or abbreviation");
        expect(result.stdout).toBe("");
        expect(result.calls).toEqual([]);
        expect(bytesIn(fixture.dir)).toEqual(before);
      } finally { rmSync(fixture.dir, { recursive: true, force: true }); }
    }
  }, 10_000);

  it("rejects bounded-looking operands after any raw separator before bootstrap", async () => {
    const spellings = ["--stop-at-frontier-ready", "--stop-at-frontier-ready=true", "--stop-at-frontier-ready=", "--stop-at-frontier-ready=false", "--stop"];
    for (const flags of spellings.flatMap(flag => [["--", flag], ["--", "--", flag]])) {
      const fixture = processFixture();
      try {
        rmSync(join(fixture.scripts, "node_modules"), { recursive: true });
        const before = bytesIn(fixture.dir);
        const result = await launchWatcher(fixture, flags);
        expect(result.code).toBe(64);
        expect(result.stderr).toBe("error: use --stop-at-frontier-ready exactly, without a value or abbreviation, and before --\n");
        expect(result.stdout).toBe("");
        expect(result.calls).toEqual([]);
        expect(bytesIn(fixture.dir)).toEqual(before);
      } finally { rmSync(fixture.dir, { recursive: true, force: true }); }
    }
  }, 10_000);

  it("rejects bounded spellings after a raw separator consumed as a required value", async () => {
    for (const option of ["--owner", "--repo", "--pr", "--stack-prs", "--interval", "--sweep-interval", "--timeout", "--max-query-errors"]) {
      const fixture = processFixture();
      try {
        rmSync(join(fixture.scripts, "node_modules"), { recursive: true });
        const before = bytesIn(fixture.dir);
        const result = await launchWatcher(fixture, [option, "--", "--stop-at-frontier-ready"]);
        expect(result.code).toBe(64);
        expect(result.stderr).toBe("error: use --stop-at-frontier-ready exactly, without a value or abbreviation, and before --\n");
        expect(result.stdout).toBe("");
        expect(result.calls).toEqual([]);
        expect(bytesIn(fixture.dir)).toEqual(before);
      } finally { rmSync(fixture.dir, { recursive: true, force: true }); }
    }
  }, 10_000);

  it("exits at a clean unmerged frontier with upstack pending and no external merge", async () => {
    const fixture = processFixture();
    try {
      const result = await launchWatcher(fixture, ["--stop-at-frontier-ready"]);
      expect(result.code).toBe(0);
      expect(result.stderr).toBe("");
      const events: unknown[] = result.stdout.trim().split("\n").map(line => JSON.parse(line));
      expect(events).toHaveLength(3);
      expect(events[1]).toMatchObject({ kind: "STATUS", rows: [{ kind: "open", ci: { kind: "ci-clean" } }, { kind: "open", ci: { kind: "ci-pending" } }] });
      expect(events[2]).toMatchObject({ kind: "WAITING", terminal: false, mode: "queued-stack", frontier: { number: 10 }, reason: { kind: "merge-queue", unmergedCount: 2 } });
      expect(existsSync(fixture.merged)).toBe(false);
      expect(result.calls).toHaveLength(7);
    } finally { rmSync(fixture.dir, { recursive: true, force: true }); }
  }, 10_000);

  it("default queued mode remains alive at readiness and completes only after external fixture merges", async () => {
    const fixture = processFixture();
    let observedWaiting = false;
    try {
      const result = await launchWatcher(fixture, [], (text, pid) => {
        if (!observedWaiting && text.includes('"kind":"WAITING"')) {
          expect(isAlive(pid)).toBe(true);
          observedWaiting = true;
          writeFileSync(fixture.merged, "external fixture actor merged both PRs");
        }
      });
      expect(observedWaiting).toBe(true);
      expect(result.code).toBe(0);
      const events: unknown[] = result.stdout.trim().split("\n").map(line => JSON.parse(line));
      expect(events.at(-1)).toMatchObject({ kind: "COMPLETE", terminal: true, exitCode: 0 });
      expect(result.stdout).toContain('"kind":"ADVANCE"');
    } finally { rmSync(fixture.dir, { recursive: true, force: true }); }
  }, 10_000);

  it("rejects missing or stale dependencies without install, restart, writes, or forge calls", async () => {
    for (const mutation of ["missing", "stale-key", "wrong-version"]) {
      const fixture = processFixture();
      try {
        if (mutation === "missing") rmSync(join(fixture.scripts, "node_modules"), { recursive: true });
        if (mutation === "stale-key") writeFileSync(join(fixture.scripts, "node_modules/.poteto-mode-tools-install-key"), "stale\n");
        if (mutation === "wrong-version") writeFileSync(join(fixture.scripts, "node_modules/commander/package.json"), '{"version":"0.0.0"}');
        const before = bytesIn(fixture.dir);
        const result = await launchWatcher(fixture, ["--stop-at-frontier-ready"]);
        expect(result.code).not.toBe(0);
        expect(result.stderr).toContain("no installation or restart was attempted");
        expect(result.stdout).toBe("");
        expect(result.calls).toEqual([]);
        expect(bytesIn(fixture.dir)).toEqual(before);
      } finally { rmSync(fixture.dir, { recursive: true, force: true }); }
    }
  }, 10_000);

  it("rejects a conflicting bounded flag before querying the forge", async () => {
    const fixture = processFixture();
    try {
      const result = await launchWatcher(fixture, ["--stop-at-frontier-ready", "--status-only"]);
      expect(result.code).toBe(64);
      expect(result.calls).toEqual([]);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("conflicts with --status-only");
    } finally { rmSync(fixture.dir, { recursive: true, force: true }); }
  });
});
