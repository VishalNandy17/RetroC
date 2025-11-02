// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


import "@openzeppelin/contracts/security/Pausable.sol";


contract MyStaking is 
    Ownable
    
    , Pausable
    
    
    , ReentrancyGuard
    
{
    using SafeERC20 for IERC20;
    
    IERC20 public immutable token;
    IERC20 public immutable rewardToken;
    
    struct StakeInfo {
        uint256 amount;
        uint256 lockUntil;
        uint256 lastRewardTime;
        uint256 pendingRewards;
    }
    
    mapping(address => StakeInfo) public stakes;
    
    uint256 public apyBps; // APY in basis points (e.g., 500 = 5%)
    uint256 public lockPeriod; // Lock period in seconds (0 = no lock)
    uint256 public constant YEAR_SECONDS = 365 days;
    uint256 public constant BASIS_POINTS = 10000;

    event Staked(address indexed user, uint256 amount, uint256 lockUntil);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event APYUpdated(uint256 newAPY);

    constructor(IERC20 _token, IERC20 _rewardToken, uint256 _apyBps, uint256 _lockPeriodSeconds) {
        require(address(_token) != address(0), "invalid token");
        require(address(_rewardToken) != address(0), "invalid reward token");
        token = _token;
        rewardToken = _rewardToken;
        apyBps = _apyBps;
        lockPeriod = _lockPeriodSeconds;
    }

    function stake(uint256 amount) external  whenNotPaused   nonReentrant  {
        require(amount > 0, "amount = 0");
        
        // Update pending rewards before new stake
        _updateRewards(msg.sender);
        
        token.safeTransferFrom(msg.sender, address(this), amount);
        StakeInfo storage stakeInfo = stakes[msg.sender];
        
        stakeInfo.amount += amount;
        stakeInfo.lastRewardTime = block.timestamp;
        if (lockPeriod > 0) {
            stakeInfo.lockUntil = block.timestamp + lockPeriod;
        }
        
        emit Staked(msg.sender, amount, stakeInfo.lockUntil);
    }

    function unstake(uint256 amount) external  whenNotPaused   nonReentrant  {
        StakeInfo storage stakeInfo = stakes[msg.sender];
        require(stakeInfo.amount >= amount, "insufficient staked");
        require(block.timestamp >= stakeInfo.lockUntil, "still locked");
        
        // Update and claim rewards before unstaking
        _updateRewards(msg.sender);
        _claimRewards();
        
        stakeInfo.amount -= amount;
        token.safeTransfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }

    function claimRewards() external  nonReentrant  {
        _updateRewards(msg.sender);
        _claimRewards();
    }

    function _updateRewards(address user) internal {
        StakeInfo storage stakeInfo = stakes[user];
        if (stakeInfo.amount == 0 || stakeInfo.lastRewardTime == 0) return;
        
        uint256 timeElapsed = block.timestamp - stakeInfo.lastRewardTime;
        if (timeElapsed == 0) return;
        
        // Calculate rewards: amount * APY * timeElapsed / YEAR_SECONDS
        uint256 newRewards = (stakeInfo.amount * apyBps * timeElapsed) / (YEAR_SECONDS * BASIS_POINTS);
        stakeInfo.pendingRewards += newRewards;
        stakeInfo.lastRewardTime = block.timestamp;
    }

    function _claimRewards() internal {
        StakeInfo storage stakeInfo = stakes[msg.sender];
        uint256 rewards = stakeInfo.pendingRewards;
        require(rewards > 0, "no rewards");
        
        stakeInfo.pendingRewards = 0;
        rewardToken.safeTransfer(msg.sender, rewards);
        
        emit RewardsClaimed(msg.sender, rewards);
    }

    function getPendingRewards(address user) external view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[user];
        if (stakeInfo.amount == 0 || stakeInfo.lastRewardTime == 0) {
            return stakeInfo.pendingRewards;
        }
        
        uint256 timeElapsed = block.timestamp - stakeInfo.lastRewardTime;
        uint256 newRewards = (stakeInfo.amount * apyBps * timeElapsed) / (YEAR_SECONDS * BASIS_POINTS);
        return stakeInfo.pendingRewards + newRewards;
    }

    function calculateAPY(uint256 principal) external view returns (uint256) {
        return (principal * apyBps) / BASIS_POINTS;
    }

    function setAPY(uint256 newAPYBps) external onlyOwner {
        require(newAPYBps <= 10000, "APY too high"); // Max 100%
        apyBps = newAPYBps;
        emit APYUpdated(newAPYBps);
    }

    function setLockPeriod(uint256 newLockPeriod) external onlyOwner {
        lockPeriod = newLockPeriod;
    }

    function emergencyExit() external  nonReentrant  {
        StakeInfo storage stakeInfo = stakes[msg.sender];
        require(stakeInfo.amount > 0, "nothing staked");
        
        // Forfeit rewards on emergency exit
        stakeInfo.pendingRewards = 0;
        uint256 amount = stakeInfo.amount;
        stakeInfo.amount = 0;
        
        token.safeTransfer(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }
    
    
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
}


