import * as vscode from "vscode";
import * as path from "path";
import { matchesPattern, getNonConflictingUri } from "./utils";

export interface AutoSortRule {
  name?: string;
  patterns: string[];
  destination: string;
}

export class AutoSorter {
  private rules: AutoSortRule[];

  constructor(rules: AutoSortRule[]) {
    this.rules = rules;
  }

  updateRules(rules: AutoSortRule[]) {
    this.rules = rules;
  }

  async sort(uri: vscode.Uri): Promise<void> {
    const fileName = uri.fsPath.split(/[/\\]/).pop() ?? "";

    for (const rule of this.rules) {
      if (matchesPattern(fileName, rule.patterns)) {
        await this.applyRule(uri, rule);
        return;
      }
    }
  }

  private async applyRule(
    uri: vscode.Uri,
    rule: AutoSortRule
  ): Promise<void> {
    const workspace = vscode.workspace.workspaceFolders?.[0];
    if (!workspace) {
      return;
    }

    const workspaceRoot = workspace.uri.fsPath;
    const relPath = path
      .relative(workspaceRoot, uri.fsPath)
      .replace(/\\/g, "/"); // normalize

    const destPrefix = rule.destination.replace(/\\/g, "/").replace(/\/+$/, "");

    // 🔒 If the file is already inside the destination folder, do nothing
    if (relPath === destPrefix || relPath.startsWith(destPrefix + "/")) {
      return;
    }

    const destDir = vscode.Uri.joinPath(workspace.uri, rule.destination);

    // Ensure directory exists
    try {
      await vscode.workspace.fs.stat(destDir);
    } catch {
      await vscode.workspace.fs.createDirectory(destDir);
    }

    const fileName = uri.fsPath.split(/[/\\]/).pop() ?? "";
    const rawDest = vscode.Uri.joinPath(destDir, fileName);
    const safeDest = await getNonConflictingUri(rawDest);

    await vscode.workspace.fs.rename(uri, safeDest);

    const name = rule.name ?? "Unnamed rule";
    vscode.window.setStatusBarMessage(
      `AutoSort: "${fileName}" → ${rule.destination} (${name})`,
      3000
    );
  }
}
