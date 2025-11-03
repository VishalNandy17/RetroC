import * as vscode from 'vscode';
import { generateERC20 } from './generateERC20';
import { generateERC721 } from './generateERC721';
import { generateERC1155 } from './generateERC1155';
import { generateDAO } from './generateDAO';
import { generateMultisig } from './generateMultisig';
import { generateStaking } from './generateStaking';
import { generateVesting } from './generateVesting';
import { generateTests, generateAllTests } from './generateTests';
import { generateDeployment } from './generateDeployment';
import { generateReadmeForCurrent } from './generateReadme';
import { generateAllReadmes } from './generateAllReadmes';
import { insertHeader } from './insertHeader';
import { previewTemplate } from './previewTemplate';
import { scanSecurityWorkspace, scanSecurityCurrent, fixReentrancyCurrent, fixLowLevelCallCurrent, securityReportWorkspace, securityReportCurrent } from './scanSecurity';

export function registerCommands(context: vscode.ExtensionContext) {
  const disposables: vscode.Disposable[] = [
    vscode.commands.registerCommand('retroc.generateERC20', generateERC20),
    vscode.commands.registerCommand('retroc.generateERC721', generateERC721),
    vscode.commands.registerCommand('retroc.generateERC1155', generateERC1155),
    vscode.commands.registerCommand('retroc.generateDAO', generateDAO),
    vscode.commands.registerCommand('retroc.generateMultisig', generateMultisig),
    vscode.commands.registerCommand('retroc.generateStaking', generateStaking),
    vscode.commands.registerCommand('retroc.generateVesting', generateVesting),
    vscode.commands.registerCommand('retroc.generateTests', generateTests),
    vscode.commands.registerCommand('retroc.generateAllTests', generateAllTests),
    vscode.commands.registerCommand('retroc.generateDeployment', generateDeployment),
    vscode.commands.registerCommand('retroc.openSettings', () =>
      vscode.commands.executeCommand('workbench.action.openSettings', '@ext:retroc'),
    ),
    vscode.commands.registerCommand('retroc.generateReadme', generateReadmeForCurrent),
    vscode.commands.registerCommand('retroc.generateAllReadmes', generateAllReadmes),
    vscode.commands.registerCommand('retroc.insertHeader', insertHeader),
    vscode.commands.registerCommand('retroc.previewTemplate', previewTemplate),
    vscode.commands.registerCommand('retroc.scanSecurityWorkspace', scanSecurityWorkspace),
    vscode.commands.registerCommand('retroc.scanSecurityCurrent', scanSecurityCurrent),
    vscode.commands.registerCommand('retroc.fixReentrancyCurrent', fixReentrancyCurrent),
    vscode.commands.registerCommand('retroc.fixLowLevelCallCurrent', fixLowLevelCallCurrent),
    vscode.commands.registerCommand('retroc.securityReportWorkspace', securityReportWorkspace),
    vscode.commands.registerCommand('retroc.securityReportCurrent', securityReportCurrent),
  ];

  context.subscriptions.push(...disposables);
}


