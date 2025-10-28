import * as vscode from 'vscode';
import { generateERC20 } from './generateERC20';
import { generateERC721 } from './generateERC721';
import { generateERC1155 } from './generateERC1155';
import { generateDAO } from './generateDAO';
import { generateMultisig } from './generateMultisig';
import { generateStaking } from './generateStaking';
import { generateVesting } from './generateVesting';
import { generateTests, generateAllTests } from './generateTests';

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
    vscode.commands.registerCommand('retroc.openSettings', () =>
      vscode.commands.executeCommand('workbench.action.openSettings', '@ext:retroc'),
    ),
  ];

  context.subscriptions.push(...disposables);
}


