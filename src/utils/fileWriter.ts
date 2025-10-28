import * as vscode from 'vscode';
import * as path from 'path';
import { getDefaultSettings } from '../config/settings';

export async function writeTextFile(fileName: string, content: string, base: 'contracts' | 'test' | 'scripts') {
  const settings = getDefaultSettings();
  const baseDir = base === 'contracts' ? settings.contractsDirectory : base === 'test' ? settings.testsDirectory : settings.scriptsDirectory;
  const workspace = vscode.workspace.workspaceFolders?.[0];
  if (!workspace) throw new Error('Open a workspace folder to generate files');
  const dirUri = vscode.Uri.file(path.join(workspace.uri.fsPath, baseDir));
  await vscode.workspace.fs.createDirectory(dirUri);
  const fileUri = vscode.Uri.file(path.join(dirUri.fsPath, fileName));
  await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
}


