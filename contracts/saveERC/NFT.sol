// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeanNFT is ERC721URIStorage, Ownable {

    constructor(address initialOwner) 
    Ownable(initialOwner) 
    ERC721("DeanNFT", "DTK") {

    }

    function mint(address _to, uint256 _tokenId, string calldata _uri) external onlyOwner {
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _uri);
    }
}





{
  "name": "Cars from the future",
  "description": "dog eating pizza",
  "image": "QmbY4DDqwuSFSZyP24aQnus5v45WXpX6JiWHSSs3f1o8DD"
}