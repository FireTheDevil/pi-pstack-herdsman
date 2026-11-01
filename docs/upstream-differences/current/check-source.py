#!/usr/bin/env python3
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
contracts = json.loads((HERE / "restorations.json").read_text())
assert len(contracts["files"]) == 17
assert len({row["path"] for row in contracts["files"]}) == 17
assert sum(not row["deltas"] for row in contracts["files"]) == 14
failures = []
checks = 0

for row in contracts["files"]:
    path = row["path"]
    text = (ROOT / path).read_bytes().decode("utf-8")
    for delta in reversed(row["deltas"]):
        if text.count(delta["local"]) != 1:
            failures.append(path + ": missing or duplicated declared host delta")
        else:
            text = text.replace(delta["local"], delta["upstream"], 1)
    checks += 1
    if hashlib.sha256(text.encode()).hexdigest() != row["upstreamSha256"]:
        failures.append(path + ": not exact upstream after declared host deltas")
    if len(sys.argv) == 2:
        source = subprocess.check_output(
            ["git", "--git-dir=" + sys.argv[1], "show",
             contracts["upstreamCommit"] + ":pstack/" + path],
            env={**os.environ, "GIT_NO_LAZY_FETCH": "1"},
        )
        checks += 1
        if hashlib.sha256(source).hexdigest() != row["upstreamSha256"]:
            failures.append(path + ": source Git object mismatch")

for row in json.loads((HERE / "acceptance.json").read_text()):
    text = (ROOT / row["path"]).read_text()
    checks += 1
    missing = [phrase for phrase in row.get("includes", []) if phrase not in text]
    forbidden = [phrase for phrase in row.get("excludes", []) if phrase in text]
    if missing or forbidden:
        failures.append(row["id"] + " " + row["path"] + ": missing=" +
                        repr(missing) + " forbidden=" + repr(forbidden))

for failure in failures:
    print("FAIL " + failure)
print(str(checks) + " source checks; " + str(len(failures)) + " failures.")
print("Source contracts only. No model efficacy or live runtime certification.")
sys.exit(bool(failures))
