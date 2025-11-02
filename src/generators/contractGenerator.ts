import * as path from 'path';
import * as vscode from 'vscode';
import { writeTextFile } from '../utils/fileWriter';
import { replacePlaceholders } from '../utils/placeholderReplacer';
import { getDefaultSettings } from '../config/settings';
import { generateBasicHardhatTest, generateBasicFoundryTest } from './testGenerator';
import { generateDeploymentScript } from './deploymentGenerator';
import { generateContractReadme } from './readmeGenerator';

async function readTemplate(relativePath: string): Promise<string> {
  const ext = vscode.extensions.getExtension('VishalNandy17.retroc');
  const extensionPath = ext?.extensionPath;
  
  // List of possible template paths to try (in order of priority)
  const possiblePaths: string[] = [];
  
  if (extensionPath) {
    // 1. Try dist/templates (packaged extension - templates copied by webpack)
    // This is the primary path for packaged extensions
    possiblePaths.push(path.join(extensionPath, 'dist', 'templates', `${relativePath}.template.sol`));
    // 2. Try templates at root of dist (alternative structure)
    possiblePaths.push(path.join(extensionPath, 'templates', `${relativePath}.template.sol`));
    // 3. Try src/templates (development mode fallback)
    possiblePaths.push(path.join(extensionPath, 'src', 'templates', `${relativePath}.template.sol`));
  }
  
  // 4. Try workspace folder (development mode when running with F5)
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    // Try dist/templates first in workspace (after build)
    possiblePaths.push(path.join(workspacePath, 'dist', 'templates', `${relativePath}.template.sol`));
    // Then src/templates (source files)
    possiblePaths.push(path.join(workspacePath, 'src', 'templates', `${relativePath}.template.sol`));
  }

  // Try each path in order
  for (const templatePath of possiblePaths) {
    try {
      const bytes = await vscode.workspace.fs.readFile(vscode.Uri.file(templatePath));
      return Buffer.from(bytes).toString('utf8');
    } catch (err) {
      // Continue to next path
      continue;
    }
  }

  // If none of the paths worked, show a detailed error with extension path info
  const triedPaths = possiblePaths.map(p => `  - ${p}`).join('\n');
  const extensionInfo = extensionPath ? `Extension path: ${extensionPath}` : 'Extension not found';
  const msg = `RetroC: Template not found: ${relativePath}.template.sol\n\n${extensionInfo}\n\nTried paths:\n${triedPaths}`;
  vscode.window.showErrorMessage(msg);
  throw new Error(msg);
}

export async function generateContract(
  templateId: string,
  outputFileName: string,
  placeholders: Record<string, string>,
) {
  try {
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
      INCLUDE_REENTRANCY_GUARD: settings.includeReentrancyGuard ? 'true' : 'false',
      INCLUDE_NATSPEC: settings.includeNatSpec ? 'true' : 'false',
      ENABLE_GAS_OPTIMIZATIONS: settings.enableGasOptimizations ? 'true' : 'false',
    };
    const contents = replacePlaceholders(tpl, withConfig);
    await writeTextFile(outputFileName, contents, 'contracts');
    vscode.window.showInformationMessage(`RetroC: Created contract ${outputFileName}`);

    // Auto hooks
    if (settings.autoGenerateTests) {
      try {
        const baseName = outputFileName.replace(/\.sol$/i, '');
        if (settings.testFramework === 'foundry') {
          await generateBasicFoundryTest(baseName);
        } else {
          await generateBasicHardhatTest(baseName, settings.useTypeScript);
        }
      } catch (err) {
        vscode.window.showWarningMessage(`RetroC: Failed to auto-generate test file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
    if (settings.deploymentScripts) {
      try {
        const baseName = outputFileName.replace(/\.sol$/i, '');
        await generateDeploymentScript(baseName);
      } catch (err) {
        vscode.window.showWarningMessage(`RetroC: Failed to auto-generate deployment script: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
    if (settings.generateReadme) {
      try {
        const baseName = outputFileName.replace(/\.sol$/i, '');
        await generateContractReadme(baseName, outputFileName);
      } catch (err) {
        vscode.window.showWarningMessage(`RetroC: Failed to auto-generate README: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate contract';
    throw new Error(`Contract generation failed: ${message}`);
  }
}


