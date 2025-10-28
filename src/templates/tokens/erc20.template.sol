// SPDX-License-Identifier: {{LICENSE}}
pragma solidity {{SOLIDITY_VERSION}};

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
/* IF INCLUDE_PAUSABLE */
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
/* ENDIF */
/* IF INCLUDE_ACCESS_CONTROL */
import "@openzeppelin/contracts/access/AccessControl.sol";
/* ENDIF */

contract {{TOKEN_NAME}} is ERC20
/* IF INCLUDE_PAUSABLE */, ERC20Pausable/* ENDIF */
/* IF INCLUDE_ACCESS_CONTROL */, AccessControl/* ENDIF */
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("{{TOKEN_NAME}}", "{{TOKEN_SYMBOL}}") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _mint(msg.sender, {{INITIAL_SUPPLY}} * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public /* IF INCLUDE_ACCESS_CONTROL */onlyRole(MINTER_ROLE)/* ENDIF */ {
        _mint(to, amount);
    }

    /* IF INCLUDE_PAUSABLE */
    function pause() public /* IF INCLUDE_ACCESS_CONTROL */onlyRole(MINTER_ROLE)/* ENDIF */ { _pause(); }
    function unpause() public /* IF INCLUDE_ACCESS_CONTROL */onlyRole(MINTER_ROLE)/* ENDIF */ { _unpause(); }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20/* IF INCLUDE_PAUSABLE */, ERC20Pausable/* ENDIF */)
    {
        super._update(from, to, value);
    }
    /* ENDIF */
}


