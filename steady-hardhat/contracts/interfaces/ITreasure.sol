// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

interface ITreasure{
function generateTreasureChest(string memory timeLeft, string memory to) external pure returns (string memory);
function generateHeader() external pure returns (bytes memory);
}
