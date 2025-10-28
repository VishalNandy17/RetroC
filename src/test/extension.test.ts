import * as assert from 'assert';
import * as vscode from 'vscode';

describe('RetroC Extension', () => {
  it('activates the extension', async () => {
    const ext = vscode.extensions.getExtension('yourusername.retroc');
    assert.ok(ext, 'Extension not found');
    await ext!.activate();
    assert.ok(true);
  });
});


