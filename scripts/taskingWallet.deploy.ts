import { ethers } from 'hardhat';

async function main() {
  const Factory = await ethers.getContractFactory('taskingWallet');
  const instance = await Factory.deploy();
  await instance.deployed();
  console.log('taskingWallet deployed to:', instance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
