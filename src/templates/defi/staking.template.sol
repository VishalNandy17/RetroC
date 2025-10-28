// SPDX-License-Identifier: {{LICENSE}}
pragma solidity {{SOLIDITY_VERSION}};

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/* IF INCLUDE_PAUSABLE */
import "@openzeppelin/contracts/utils/Pausable.sol";
/* ENDIF */

contract {{STAKING_NAME}} is Ownable/* IF INCLUDE_PAUSABLE */, Pausable/* ENDIF */ {
    IERC20 public immutable token;
    mapping(address => uint256) public staked;

    constructor(IERC20 _token) {
        token = _token;
    }

    function stake(uint256 amount) external /* IF INCLUDE_PAUSABLE */ whenNotPaused /* ENDIF */ {
        require(amount > 0, "amount = 0");
        token.transferFrom(msg.sender, address(this), amount);
        staked[msg.sender] += amount;
    }

    function unstake(uint256 amount) external /* IF INCLUDE_PAUSABLE */ whenNotPaused /* ENDIF */ {
        require(staked[msg.sender] >= amount, "insufficient");
        staked[msg.sender] -= amount;
        token.transfer(msg.sender, amount);
    }
    /* IF INCLUDE_PAUSABLE */
    function pause() public onlyOwner { _pause(); }
    function unpause() public onlyOwner { _unpause(); }
    /* ENDIF */
}


