// SPDX-License-Identifier: {{LICENSE}}
pragma solidity ^{{SOLIDITY_VERSION}};

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract {{VESTING_NAME}} is Ownable {
    struct Schedule { uint256 total; uint256 released; uint64 start; uint64 cliff; uint64 duration; }
    IERC20 public immutable token;
    mapping(address => Schedule) public schedules;

    constructor(IERC20 _token) { token = _token; }

    function create(address beneficiary, uint256 total, uint64 start, uint64 cliff, uint64 duration) external onlyOwner {
        require(schedules[beneficiary].total == 0, "exists");
        schedules[beneficiary] = Schedule({ total: total, released: 0, start: start, cliff: cliff, duration: duration });
    }

    function releasable(address beneficiary) public view returns (uint256) {
        Schedule memory s = schedules[beneficiary];
        if (block.timestamp < s.start + s.cliff) return 0;
        if (block.timestamp >= s.start + s.duration) return s.total - s.released;
        uint256 elapsed = block.timestamp - s.start;
        return (s.total * elapsed) / s.duration - s.released;
    }

    function release(address beneficiary) external {
        uint256 amount = releasable(beneficiary);
        schedules[beneficiary].released += amount;
        token.transfer(beneficiary, amount);
    }
}


