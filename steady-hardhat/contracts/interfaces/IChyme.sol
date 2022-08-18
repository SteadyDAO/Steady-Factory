// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;
interface IChyme{
    struct Chyme{
        uint8 decimals;
        uint8 fees;
        uint8 DAOApproved;
        address oracleAddress;
        address steadyImplForChyme;
        string symbol;
        uint256 timeToMaturity;
        address steadyDAOReward;// A reward system per chyme
    }
}
