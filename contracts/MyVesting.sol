// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


import "@openzeppelin/contracts/security/Pausable.sol";


contract MyVesting is 
    Ownable
    
    , Pausable
    
    
    , ReentrancyGuard
    
{
    using SafeERC20 for IERC20;
    
    struct Schedule { 
        uint256 total; 
        uint256 released; 
        uint64 start; 
        uint64 cliff; 
        uint64 duration;
        bool revoked;
    }
    
    IERC20 public immutable token;
    mapping(address => Schedule) public schedules;
    address[] public beneficiaries;

    event VestingCreated(address indexed beneficiary, uint256 total, uint64 start, uint64 cliff, uint64 duration);
    event VestingRevoked(address indexed beneficiary, uint256 revokedAmount);
    event Released(address indexed beneficiary, uint256 amount);
    event BatchReleased(address[] beneficiaries, uint256[] amounts);

    constructor(IERC20 _token) {
        require(address(_token) != address(0), "invalid token");
        token = _token;
    }

    function create(address beneficiary, uint256 total, uint64 start, uint64 cliff, uint64 duration) external onlyOwner {
        require(beneficiary != address(0), "invalid beneficiary");
        require(total > 0, "total must be > 0");
        require(cliff <= duration, "cliff > duration");
        require(start >= block.timestamp, "start < now");
        require(schedules[beneficiary].total == 0, "exists");
        
        schedules[beneficiary] = Schedule({ 
            total: total, 
            released: 0, 
            start: start, 
            cliff: cliff, 
            duration: duration,
            revoked: false
        });
        
        beneficiaries.push(beneficiary);
        emit VestingCreated(beneficiary, total, start, cliff, duration);
    }

    function revoke(address beneficiary) external onlyOwner {
        Schedule storage s = schedules[beneficiary];
        require(s.total > 0, "schedule not found");
        require(!s.revoked, "already revoked");
        
        uint256 releasableAmount = releasable(beneficiary);
        uint256 revocableAmount = s.total - s.released - releasableAmount;
        
        require(revocableAmount > 0, "nothing to revoke");
        
        s.revoked = true;
        s.total = s.released + releasableAmount; // Reduce total to what's already vested
        
        emit VestingRevoked(beneficiary, revocableAmount);
    }

    function releasable(address beneficiary) public view returns (uint256) {
        Schedule memory s = schedules[beneficiary];
        if (s.total == 0 || s.revoked) return 0;
        if (block.timestamp < s.start + s.cliff) return 0;
        if (block.timestamp >= s.start + s.duration) return s.total - s.released;
        uint256 elapsed = block.timestamp - s.start;
        uint256 vested = (s.total * elapsed) / s.duration;
        return vested > s.released ? vested - s.released : 0;
    }

    function release(address beneficiary) external  whenNotPaused   nonReentrant  {
        uint256 amount = releasable(beneficiary);
        require(amount > 0, "no tokens to release");
        schedules[beneficiary].released += amount;
        token.safeTransfer(beneficiary, amount);
        emit Released(beneficiary, amount);
    }

    function releaseBatch(address[] memory _beneficiaries) external  whenNotPaused   nonReentrant  {
        require(_beneficiaries.length > 0, "empty array");
        uint256[] memory amounts = new uint256[](_beneficiaries.length);
        
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            address beneficiary = _beneficiaries[i];
            uint256 amount = releasable(beneficiary);
            if (amount > 0) {
                schedules[beneficiary].released += amount;
                token.safeTransfer(beneficiary, amount);
                amounts[i] = amount;
            }
        }
        
        emit BatchReleased(_beneficiaries, amounts);
    }

    function getBeneficiaries() external view returns (address[] memory) {
        return beneficiaries;
    }

    function getBeneficiariesCount() external view returns (uint256) {
        return beneficiaries.length;
    }
    
    
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
}


