import * as vscode from 'vscode';
import * as path from 'path';
import { getDefaultSettings } from '../config/settings';
import { isValidFileName, sanitizeFileName } from './validator';

export async function writeTextFile(fileName: string, content: string, base: 'contracts' | 'test' | 'scripts') {
  // Validate and sanitize filename to prevent path traversal
  if (!isValidFileName(fileName)) {
    fileName = sanitizeFileName(fileName);
    vscode.window.showWarningMessage(`Invalid filename provided. Using sanitized name: ${fileName}`);
  }

  const settings = getDefaultSettings();
  const baseDir = base === 'contracts' ? settings.contractsDirectory : base === 'test' ? settings.testsDirectory : settings.scriptsDirectory;
  
  // Sanitize base directory name
  const sanitizedBaseDir = baseDir.replace(/[<>:"|?*\x00-\x1f]/g, '_').replace(/\.\./g, '').replace(/[\/\\]/g, '_') || 'output';
  
  const workspace = vscode.workspace.workspaceFolders?.[0];
  if (!workspace) {
    throw new Error('Open a workspace folder to generate files');
  }

  // Use path.join and resolve to prevent directory traversal
  const workspacePath = workspace.uri.fsPath;
  const resolvedDir = path.resolve(workspacePath, sanitizedBaseDir);
  
  // Ensure the resolved directory is within the workspace
  if (!resolvedDir.startsWith(path.resolve(workspacePath))) {
    throw new Error('Invalid directory path detected. Operation aborted for security.');
  }

  const dirUri = vscode.Uri.file(resolvedDir);
  await vscode.workspace.fs.createDirectory(dirUri);
  
  const resolvedFile = path.resolve(resolvedDir, fileName);
  
  // Final check: ensure file is within the resolved directory
  if (!resolvedFile.startsWith(resolvedDir)) {
    throw new Error('Invalid file path detected. Operation aborted for security.');
  }

  const fileUri = vscode.Uri.file(resolvedFile);
  await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
}


