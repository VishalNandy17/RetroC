// SPDX-License-Identifier: {{LICENSE}}
pragma solidity {{SOLIDITY_VERSION}};

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/* IF INCLUDE_PAUSABLE */
import "@openzeppelin/contracts/security/Pausable.sol";
/* ENDIF */

contract ERC1155_{{BASE_URI}} is ERC1155, Ownable/* IF INCLUDE_PAUSABLE */, Pausable/* ENDIF */ {
    constructor() ERC1155("") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        require(account != address(0), "mint to zero address");
        require(amount > 0, "amount must be > 0");
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        require(to != address(0), "mint to zero address");
        require(ids.length == amounts.length, "ids/amounts length mismatch");
        require(ids.length > 0, "empty arrays");
        _mintBatch(to, ids, amounts, data);
    }

    /* IF INCLUDE_PAUSABLE */
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    /* ENDIF */
}


