// SPDX-License-Identifier: {{LICENSE}}
pragma solidity {{SOLIDITY_VERSION}};

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/utils/IVotes.sol";

/// @title {{DAO_NAME}}DAO
/// @notice Simple on-chain governance using OpenZeppelin's Governor
/* IF INCLUDE_NATSPEC */
/// @dev Quorum is set to 4% by default; adjust according to your tokenomics
/* ENDIF */
contract {{DAO_NAME}}DAO is Governor, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {
    constructor(IVotes token)
        Governor("{{DAO_NAME}}DAO")
        GovernorVotes(token)
        GovernorVotesQuorumFraction(4)
    {}

    function votingDelay() public pure override returns (uint256) {
        return 1; // 1 block
    }

    function votingPeriod() public pure override returns (uint256) {
        return 45818; // ~1 week
    }

    function proposalThreshold() public pure override returns (uint256) {
        return 0;
    }
}


