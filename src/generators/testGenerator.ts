import { writeTextFile } from '../utils/fileWriter';

export async function generateBasicHardhatTest(contractName: string, useTs: boolean) {
  const ext = useTs ? 'ts' : 'js';
  const content = `import { expect } from 'chai';\n\ndescribe('${contractName}', () => {\n  it('deploys', async () => {\n    expect(true).to.eq(true);\n  });\n});\n`;
  await writeTextFile(`${contractName}.test.${ext}`, content, 'test');
}


