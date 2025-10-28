import { writeTextFile } from '../utils/fileWriter';

export async function generateDeploymentScript(contractName: string) {
  const content = `import { ethers } from 'hardhat';

async function main() {
  const Factory = await ethers.getContractFactory('${contractName}');
  const instance = await Factory.deploy();
  await instance.deployed();
  console.log('${contractName} deployed to:', instance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;
  await writeTextFile(`${contractName}.deploy.ts`, content, 'scripts');
}


