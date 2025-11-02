// SPDX-License-Identifier: {{LICENSE}}
pragma solidity {{SOLIDITY_VERSION}};

import "@openzeppelin/contracts/governance/TimelockController.sol";

/// @title {{TIMELOCK_NAME}}Timelock
/// @notice Timelock controller for delayed execution of governance proposals
/* IF INCLUDE_NATSPEC */
/// @dev All operations are subject to a minimum delay period before execution
/* ENDIF */
contract {{TIMELOCK_NAME}}Timelock is TimelockController {
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}


