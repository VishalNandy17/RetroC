// SPDX-License-Identifier: {{LICENSE}}
pragma solidity {{SOLIDITY_VERSION}};

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/* IF INCLUDE_REENTRANCY_GUARD */
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
/* ENDIF */
/* IF INCLUDE_PAUSABLE */
import "@openzeppelin/contracts/security/Pausable.sol";
/* ENDIF */

contract {{STAKING_NAME}} is 
    Ownable
    /* IF INCLUDE_PAUSABLE */
    , Pausable
    /* ENDIF */
    /* IF INCLUDE_REENTRANCY_GUARD */
    , ReentrancyGuard
    /* ENDIF */
{
    using SafeERC20 for IERC20;
    
    IERC20 public immutable token;
    mapping(address => uint256) public staked;

    constructor(IERC20 _token) {
        require(address(_token) != address(0), "invalid token");
        token = _token;
    }

    function stake(uint256 amount) external /* IF INCLUDE_PAUSABLE */ whenNotPaused /* ENDIF */ /* IF INCLUDE_REENTRANCY_GUARD */ nonReentrant /* ENDIF */ {
        require(amount > 0, "amount = 0");
        token.safeTransferFrom(msg.sender, address(this), amount);
        staked[msg.sender] += amount;
    }

    function unstake(uint256 amount) external /* IF INCLUDE_PAUSABLE */ whenNotPaused /* ENDIF */ /* IF INCLUDE_REENTRANCY_GUARD */ nonReentrant /* ENDIF */ {
        require(staked[msg.sender] >= amount, "insufficient");
        staked[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);
    }
    
    /* IF INCLUDE_PAUSABLE */
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    /* ENDIF */
}


