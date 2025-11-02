import { writeTextFile } from '../utils/fileWriter';
import { getDefaultSettings } from '../config/settings';

export async function generateBasicHardhatTest(contractName: string, useTs: boolean) {
  const ext = useTs ? 'ts' : 'js';
  const settings = getDefaultSettings();
  
  const content = useTs 
    ? generateHardhatTestTypeScript(contractName, settings)
    : generateHardhatTestJavaScript(contractName, settings);
    
  await writeTextFile(`${contractName}.test.${ext}`, content, 'test');
}

export async function generateBasicFoundryTest(contractName: string) {
  const content = generateFoundryTest(contractName);
  await writeTextFile(`${contractName}.t.sol`, content, 'test');
}

function generateHardhatTestTypeScript(contractName: string, settings: any): string {
  return `import { expect } from "chai";
import { ethers } from "hardhat";
import { ${contractName} } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("${contractName}", function () {
  let contract: ${contractName};
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const Contract = await ethers.getContractFactory("${contractName}");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(contract.address).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should set the right owner", async function () {
      // Adjust based on your contract's owner implementation
      // expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Functions", function () {
    // Add function-specific tests here
  });

  describe("Security", function () {
    // Add security tests here
  });

  describe("Edge Cases", function () {
    // Add edge case tests here
  });
});
`;
}

function generateHardhatTestJavaScript(contractName: string, settings: any): string {
  return `const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("${contractName}", function () {
  let contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const Contract = await ethers.getContractFactory("${contractName}");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(contract.address).to.not.equal(ethers.constants.AddressZero);
    });
  });

  describe("Functions", function () {
    // Add function-specific tests here
  });

  describe("Security", function () {
    // Add security tests here
  });

  describe("Edge Cases", function () {
    // Add edge case tests here
  });
});
`;
}

function generateFoundryTest(contractName: string): string {
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/${contractName}.sol";

contract ${contractName}Test is Test {
    ${contractName} public contract;
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);

    function setUp() public {
        vm.prank(owner);
        contract = new ${contractName}();
    }

    function test_Deployment() public {
        assertTrue(address(contract) != address(0));
    }

    function testFuzz_Example(uint256 value) public {
        // Add fuzz tests here
    }
}
`;
}


