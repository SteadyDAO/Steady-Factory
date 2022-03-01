// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./interfaces/ISteadyDAORewards.sol";
///@title Sample Game Rewards contracts

contract SteadyDAOReward is ISteadyDAORewards {
  event PerformedAction(actionType);

 function performAction( actionType action, uint256 , uint256 ) external override {
   emit PerformedAction(action);
 }
}