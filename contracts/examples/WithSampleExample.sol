// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./../WithSample.sol";

contract WithSampleExample is ERC721, WithSample {
    uint256 private _tokenId = 0;

    constructor(
        uint256 time
    )
        ERC721("MyToken", "MT")
        WithSample(time)
    {}

    function mint () external afterSample returns (uint256) {
        _tokenId++;
        _safeMint(msg.sender, _tokenId);

        return _tokenId;
    }
}
