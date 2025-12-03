import * as vscode from "vscode";
import { AutoSorter } from "./sorter";

export function registerWatcher(sorter: AutoSorter): vscode.FileSystemWatcher {
  const watcher = vscode.workspace.createFileSystemWatcher("**/*");

  watcher.onDidCreate((uri: vscode.Uri) => {
    sorter.sort(uri);
  });

  return watcher;
}
