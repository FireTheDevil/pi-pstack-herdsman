import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const scriptsDirectory = import.meta.dir;
const nodeModulesDirectory = join(scriptsDirectory, "node_modules");
const commanderPackagePath = join(
  nodeModulesDirectory,
  "commander",
  "package.json"
);
const installKeyPath = join(
  nodeModulesDirectory,
  ".poteto-mode-tools-install-key"
);

function currentInstallKey(): string {
  return createHash("sha256")
    .update(readFileSync(join(scriptsDirectory, "package.json")))
    .update("\0")
    .update(readFileSync(join(scriptsDirectory, "bun.lock")))
    .digest("hex");
}

export function assertDependenciesInstalled(): void {
  const configured: unknown = JSON.parse(
    readFileSync(join(scriptsDirectory, "package.json"), "utf8")
  );
  const dependencies =
    configured !== null && typeof configured === "object" && "dependencies" in configured
      ? configured.dependencies
      : null;
  const expected =
    dependencies !== null && typeof dependencies === "object" && "commander" in dependencies
      ? dependencies.commander
      : null;
  const installed: unknown = existsSync(commanderPackagePath)
    ? JSON.parse(readFileSync(commanderPackagePath, "utf8"))
    : null;
  const version =
    installed !== null && typeof installed === "object" && "version" in installed
      ? installed.version
      : null;
  if (
    typeof expected !== "string" || version !== expected ||
    !existsSync(installKeyPath) ||
    readFileSync(installKeyPath, "utf8").trim() !== currentInstallKey()
  ) {
    throw new Error("Watcher requires pre-provisioned dependencies and a current install key. See README helper setup; no installation or restart was attempted");
  }
}
