import * as vscode from 'vscode';
import { writeTextFile } from '../utils/fileWriter';
import { getDefaultSettings } from '../config/settings';

export async function generateTests() {
  const settings = getDefaultSettings();
  const contract = await vscode.window.showInputBox({ prompt: 'Contract name (without .sol)' });
  if (!contract) return;

  const ext = settings.useTypeScript ? 'ts' : 'js';
  const content = `import { expect } from 'chai';\n\ndescribe('${contract}', () => {\n  it('deploys', async () => {\n    expect(true).to.eq(true);\n  });\n});\n`;
  await writeTextFile(`${contract}.test.${ext}`, content, 'test');
  vscode.window.showInformationMessage(`RetroC: Created test ${contract}.test.${ext}`);
}

export async function generateAllTests() {
  await writeTextFile(`example.test.ts`, `describe('example', ()=>{});\n`, 'test');
  vscode.window.showInformationMessage('RetroC: Generated baseline tests');
}


