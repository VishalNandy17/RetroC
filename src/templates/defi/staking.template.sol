// SPDX-License-Identifier: {{LICENSE}}
pragma solidity ^{{SOLIDITY_VERSION}};

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract {{STAKING_NAME}} is Ownable {
    IERC20 public immutable token;
    mapping(address => uint256) public staked;

    constructor(IERC20 _token) {
        token = _token;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "amount = 0");
        token.transferFrom(msg.sender, address(this), amount);
        staked[msg.sender] += amount;
    }

    function unstake(uint256 amount) external {
        require(staked[msg.sender] >= amount, "insufficient");
        staked[msg.sender] -= amount;
        token.transfer(msg.sender, amount);
    }
}


