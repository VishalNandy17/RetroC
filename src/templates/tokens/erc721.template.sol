// SPDX-License-Identifier: {{LICENSE}}
pragma solidity {{SOLIDITY_VERSION}};

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/* IF INCLUDE_PAUSABLE */
import "@openzeppelin/contracts/utils/Pausable.sol";
/* ENDIF */

contract {{TOKEN_NAME}} is ERC721URIStorage, Ownable/* IF INCLUDE_PAUSABLE */, Pausable/* ENDIF */ {
    uint256 private _tokenIdCounter;

    constructor() ERC721("{{TOKEN_NAME}}", "{{TOKEN_SYMBOL}}") {}

    function mint(address to, string memory uri) public onlyOwner returns (uint256) {
        _tokenIdCounter += 1;
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }
    /* IF INCLUDE_PAUSABLE */
    function pause() public onlyOwner { _pause(); }
    function unpause() public onlyOwner { _unpause(); }
    /* ENDIF */
}


