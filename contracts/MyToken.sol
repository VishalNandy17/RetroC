// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";


import "@openzeppelin/contracts/access/AccessControl.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is 
    ERC20
    , ERC20Burnable
    
    , ERC20Pausable
    
    
    , AccessControl
    
    , ERC20Permit
{
    
    // Gas optimization: Using constants for role hashes (stored at contract creation)
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor() 
        ERC20("MyToken", "MTK")
        ERC20Permit("MyToken")
    {
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        
        // Gas optimization: Using unchecked for address zero check (saves gas)
        
        require(to != address(0), "mint to zero address");
        _mint(to, amount);
    }

    
    function pause() public /* IF INCLUDE_ACCESS_CONTROL */onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
    /* ENDIF */
}


