// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;
interface IChyme{
    struct Chyme{
        uint8 decimals;
        uint8 ratioOfSteady;
        uint8 fees;
        uint8 DAOApproved;
        address oracleAddress;
        string infoUri;
        uint256 reward;
        uint256 timeToMaturity;
    }
}
