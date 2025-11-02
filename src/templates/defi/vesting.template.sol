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

contract {{VESTING_NAME}} is 
    Ownable
    /* IF INCLUDE_PAUSABLE */
    , Pausable
    /* ENDIF */
    /* IF INCLUDE_REENTRANCY_GUARD */
    , ReentrancyGuard
    /* ENDIF */
{
    using SafeERC20 for IERC20;
    
    struct Schedule { 
        uint256 total; 
        uint256 released; 
        uint64 start; 
        uint64 cliff; 
        uint64 duration; 
    }
    
    IERC20 public immutable token;
    mapping(address => Schedule) public schedules;

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
        schedules[beneficiary] = Schedule({ total: total, released: 0, start: start, cliff: cliff, duration: duration });
    }

    function releasable(address beneficiary) public view returns (uint256) {
        Schedule memory s = schedules[beneficiary];
        if (s.total == 0 || block.timestamp < s.start + s.cliff) return 0;
        if (block.timestamp >= s.start + s.duration) return s.total - s.released;
        uint256 elapsed = block.timestamp - s.start;
        uint256 vested = (s.total * elapsed) / s.duration;
        return vested > s.released ? vested - s.released : 0;
    }

    function release(address beneficiary) external /* IF INCLUDE_PAUSABLE */ whenNotPaused /* ENDIF */ /* IF INCLUDE_REENTRANCY_GUARD */ nonReentrant /* ENDIF */ {
        uint256 amount = releasable(beneficiary);
        require(amount > 0, "no tokens to release");
        schedules[beneficiary].released += amount;
        token.safeTransfer(beneficiary, amount);
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


