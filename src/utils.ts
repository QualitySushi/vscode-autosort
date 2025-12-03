import * as vscode from "vscode";
import * as path from "path";

/**
 * Very simple glob-like matcher:
 * Currently supports patterns like "*.png", "*.log"
 */
export function matchesPattern(fileName: string, patterns: string[]): boolean {
  const lower = fileName.toLowerCase();

  return patterns.some((pattern) => {
    const p = pattern.toLowerCase().trim();

    // Only support "*.ext" for v0.1
    if (p.startsWith("*.")) {
      const ext = p.slice(1); // ".png"
      return lower.endsWith(ext);
    }

    // Fallback: exact match
    return lower === p;
  });
}

/**
 * Given a desired URI, returns a URI that does not collide by appending _1, _2, etc.
 */
export async function getNonConflictingUri(
  baseUri: vscode.Uri
): Promise<vscode.Uri> {
  let attempt = 0;
  let candidate = baseUri;

  while (true) {
    try {
      await vscode.workspace.fs.stat(candidate);
      // Exists → bump counter
      attempt++;

      const parsed = path.parse(baseUri.fsPath);
      const newName =
        attempt === 0
          ? `${parsed.name}${parsed.ext}`
          : `${parsed.name}_${attempt}${parsed.ext}`;

      candidate = vscode.Uri.file(path.join(parsed.dir, newName));
    } catch {
      // stat throws if not found → safe to use
      return candidate;
    }
  }
}
