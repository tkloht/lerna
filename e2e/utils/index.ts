import { exec } from "child_process";
import { ensureDirSync, readFileSync, removeSync } from "fs-extra";
import isCI from "is-ci";
import { dirSync } from "tmp";

export function getPublishedVersion(): string {
  process.env.PUBLISHED_VERSION =
    process.env.PUBLISHED_VERSION ||
    // fallback to latest if built package is missing
    "latest";
  return process.env.PUBLISHED_VERSION;
}

interface RunCmdOpts {
  silenceError?: boolean;
  env?: Record<string, string>;
  cwd?: string;
  silent?: boolean;
}

export const e2eRoot = isCI ? dirSync({ prefix: "lerna-e2e-" }).name : "/tmp/lerna-e2e";

export const e2eCwd = e2eRoot;
ensureDirSync(e2eCwd);

let projName: string;

export function uniq(prefix: string) {
  return `${prefix}${Math.floor(Math.random() * 10000000)}`;
}

export function createEmptyDirectoryForWorkspace(name: string): void {
  projName = name;
  const workspacePath = tmpProjPath();
  ensureDirSync(workspacePath);
}

export function removeWorkspace() {
  try {
    removeSync(tmpProjPath());
    // eslint-disable-next-line no-empty
  } catch {}
}

export function readFile(f: string) {
  const ff = f.startsWith("/") ? f : tmpProjPath(f);
  return readFileSync(ff, "utf-8");
}

export function runCommandAsync(
  command: string,
  opts: RunCmdOpts = {
    silenceError: false,
    env: undefined,
  }
): Promise<{ stdout: string; stderr: string; combinedOutput: string }> {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: tmpProjPath(),
        env: {
          ...(opts.env || process.env),
          FORCE_COLOR: "false",
        },
        encoding: "utf-8",
      },
      (err, stdout, stderr) => {
        if (!opts.silenceError && err) {
          reject(err);
        }
        resolve({
          stdout: stripConsoleColors(stdout),
          stderr: stripConsoleColors(stderr),
          combinedOutput: stripConsoleColors(`${stdout}${stderr}`),
        });
      }
    );
  });
}

export function runLernaInitAsync(args?: string) {
  const argsString = args ? ` ${args}` : "";

  /**
   * There is nothing about lerna init that is package manager specific, as no installation occurs
   * as part of the command, so we simply use npx here and resolve from verdaccio.
   */
  return runCommandAsync(
    `npx --registry=http://localhost:4872/ --yes lerna@${getPublishedVersion()} init${argsString}`
  );
}

/**
 * Remove log colors for fail proof string search
 * @param log
 * @returns
 */
function stripConsoleColors(log: string): string {
  // eslint-disable-next-line no-control-regex
  return log.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
}

export function tmpProjPath(path?: string) {
  return path ? `${e2eCwd}/${projName}/${path}` : `${e2eCwd}/${projName}`;
}
