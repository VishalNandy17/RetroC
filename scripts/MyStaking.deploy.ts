import { ethers } from 'hardhat';

async function main() {
  const Factory = await ethers.getContractFactory('MyStaking');
  const instance = await Factory.deploy();
  await instance.deployed();
  console.log('MyStaking deployed to:', instance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
