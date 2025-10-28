import * as path from 'path';
import * as vscode from 'vscode';
import { writeTextFile } from '../utils/fileWriter';
import { replacePlaceholders } from '../utils/placeholderReplacer';

async function readTemplate(relativePath: string): Promise<string> {
  const ext = vscode.extensions.getExtension('yourusername.retroc');
  const base = ext?.extensionPath ?? vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!base) throw new Error('Cannot resolve template base path');
  const templatePath = path.join(base, 'src', 'templates', `${relativePath}.template.sol`);
  const bytes = await vscode.workspace.fs.readFile(vscode.Uri.file(templatePath));
  return Buffer.from(bytes).toString('utf8');
}

export async function generateContract(
  templateId: string,
  outputFileName: string,
  placeholders: Record<string, string>,
) {
  const tpl = await readTemplate(templateId);
  const contents = replacePlaceholders(tpl, placeholders);
  await writeTextFile(outputFileName, contents, 'contracts');
  vscode.window.showInformationMessage(`RetroC: Created contract ${outputFileName}`);
}


