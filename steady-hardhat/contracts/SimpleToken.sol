// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// inspired by woofy: https://etherscan.io/address/0xd0660cd418a64a1d44e9214ad8e459324d8157f1#code

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleToken is ERC20, Ownable {
    constructor() ERC20("SimpleToken", "STT") {
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }
//TODO:Access control
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}