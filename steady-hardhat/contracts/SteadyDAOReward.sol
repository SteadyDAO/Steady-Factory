// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./interfaces/ISteadyDAORewards.sol";
///@title Sample Game Rewards contracts

contract SteadyDAOReward is ISteadyDAORewards {
  event PerformedAction(actionType);

 function performAction( actionType action, uint256 , uint256, address) external override {
   emit PerformedAction(action);
   //40 basis points for splitting in the underlying
   //20 basis points on the amount of the vault for merging the underlying
   //make tis payable and allow fees in ether
 }
}