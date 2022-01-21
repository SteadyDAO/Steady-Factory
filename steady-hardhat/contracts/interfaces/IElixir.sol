// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface IERC721Burnable is IERC721Upgradeable {
    function burnFrom(address account, uint256 amount) external;
     function safeMint(address to, uint256 forgePrice, address oracle, uint fees, uint amount) external;
}