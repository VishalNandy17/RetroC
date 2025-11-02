import { ethers } from 'hardhat';

async function main() {
  const Factory = await ethers.getContractFactory('MyVesting');
  const instance = await Factory.deploy();
  await instance.deployed();
  console.log('MyVesting deployed to:', instance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
