import * as vscode from "vscode";
import { AutoSorter, AutoSortRule } from "./sorter";
import { registerWatcher } from "./watcher";

async function loadRules(): Promise<AutoSortRule[]> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  // 1. Try autosort.json in workspace root
  if (workspace) {
    const configUri = vscode.Uri.joinPath(workspace.uri, "autosort.json");
    try {
      const data = await vscode.workspace.fs.readFile(configUri);
      const json = JSON.parse(Buffer.from(data).toString("utf8"));
      if (Array.isArray(json.rules)) {
        return json.rules;
      }
    } catch {
      // ignore, fallback to settings
    }
  }

  // 2. Fallback to settings.json (autosort.rules)
  const cfg = vscode.workspace.getConfiguration("autosort");
  const rules = cfg.get<AutoSortRule[]>("rules", []);
  return rules;
}

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  let rules = await loadRules();
  const sorter = new AutoSorter(rules);

  if (!rules.length) {
    vscode.window.showInformationMessage(
      "AutoSort activated, but no rules found yet (autosort.json or autosort.rules)."
    );
  } else {
    vscode.window.showInformationMessage(
      `AutoSort activated with ${rules.length} rule(s).`
    );
  }

  // Watch regular files
  const watcher = registerWatcher(sorter);
  context.subscriptions.push(watcher);

  // Watch autosort.json itself for changes
  const workspace = vscode.workspace.workspaceFolders?.[0];
  if (workspace) {
    const configWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspace, "autosort.json")
    );

    const reload = async () => {
      rules = await loadRules();
      sorter.updateRules(rules);

      if (!rules.length) {
        vscode.window.setStatusBarMessage(
          "AutoSort: rules cleared (no rules found).",
          3000
        );
      } else {
        vscode.window.setStatusBarMessage(
          `AutoSort: reloaded ${rules.length} rule(s).`,
          3000
        );
      }
    };

    configWatcher.onDidCreate(reload);
    configWatcher.onDidChange(reload);
    configWatcher.onDidDelete(reload);

    context.subscriptions.push(configWatcher);
  }
}

export function deactivate(): void {
  // VS Code disposes subscriptions automatically
}
