import * as path from 'path';
import * as vscode from 'vscode';
import { writeTextFile } from '../utils/fileWriter';
import { replacePlaceholders } from '../utils/placeholderReplacer';
import { getDefaultSettings } from '../config/settings';
import { generateBasicHardhatTest } from './testGenerator';
import { generateDeploymentScript } from './deploymentGenerator';

async function readTemplate(relativePath: string): Promise<string> {
  const ext = vscode.extensions.getExtension('VishalNandy17.retroc');
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
  const settings = getDefaultSettings();
  const tpl = await readTemplate(templateId);
  const withConfig = {
    ...placeholders,
    LICENSE: placeholders.LICENSE ?? settings.defaultLicense,
    SOLIDITY_VERSION: settings.allowVersionOverride
      ? (placeholders.SOLIDITY_VERSION ?? settings.defaultSolidityVersion)
      : '^0.8.24',
    INCLUDE_PAUSABLE: settings.includePausable ? 'true' : 'false',
    INCLUDE_ACCESS_CONTROL: settings.includeAccessControl ? 'true' : 'false',
    INCLUDE_NATSPEC: settings.includeNatSpec ? 'true' : 'false',
  };
  const contents = replacePlaceholders(tpl, withConfig);
  await writeTextFile(outputFileName, contents, 'contracts');
  vscode.window.showInformationMessage(`RetroC: Created contract ${outputFileName}`);

  // Auto hooks
  if (settings.autoGenerateTests) {
    const baseName = outputFileName.replace(/\.sol$/i, '');
    await generateBasicHardhatTest(baseName, settings.useTypeScript);
  }
  if (settings.deploymentScripts) {
    const baseName = outputFileName.replace(/\.sol$/i, '');
    await generateDeploymentScript(baseName);
  }
}


