// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface IElixir is IERC721Upgradeable {
    function burnFrom(address account, uint256 amount) external;
    function getSteadyRequired(uint256 tokenId) external view returns(uint256, uint256); 
    function safeMint(address to, uint256 forgePrice, uint256 ratioOfSteady, address oracle, uint fees, uint amount) external;
}