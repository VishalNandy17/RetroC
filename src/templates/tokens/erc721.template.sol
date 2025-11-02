// SPDX-License-Identifier: {{LICENSE}}
pragma solidity {{SOLIDITY_VERSION}};

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/* IF INCLUDE_PAUSABLE */
import "@openzeppelin/contracts/security/Pausable.sol";
/* ENDIF */
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract {{TOKEN_NAME}} is ERC721URIStorage, Ownable/* IF INCLUDE_PAUSABLE */, Pausable/* ENDIF */, IERC2981 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    // Royalty info
    address public royaltyReceiver;
    uint96 public royaltyFeeBps; // Basis points (e.g., 250 = 2.5%)

    constructor() ERC721("{{TOKEN_NAME}}", "{{TOKEN_SYMBOL}}") {
        royaltyReceiver = msg.sender;
        royaltyFeeBps = 250; // Default 2.5%
    }

    function mint(address to, string memory uri) public onlyOwner returns (uint256) {
        require(to != address(0), "mint to zero address");
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function setRoyaltyInfo(address receiver, uint96 feeBps) external onlyOwner {
        require(receiver != address(0), "invalid receiver");
        require(feeBps <= 1000, "fee too high"); // Max 10%
        royaltyReceiver = receiver;
        royaltyFeeBps = feeBps;
    }

    function royaltyInfo(uint256 /* tokenId */, uint256 salePrice) external view override returns (address, uint256) {
        uint256 royaltyAmount = (salePrice * royaltyFeeBps) / 10000;
        return (royaltyReceiver, royaltyAmount);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
    
    /* IF INCLUDE_PAUSABLE */
    function pause() public onlyOwner {
        _pause();
    }
    
    function unpause() public onlyOwner {
        _unpause();
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    /* ENDIF */
}


