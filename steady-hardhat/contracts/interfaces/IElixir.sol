// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface IElixir is IERC721Upgradeable {
    function burn(uint256 tokenId) external;
    function getSteadyRequired(uint256 tokenId) external view returns(uint256, uint256); 
    function safeMint( address _to, address _chyme, uint256 _forgePrice, uint256 _amount, uint256 _timeToMaturity ) external;
}