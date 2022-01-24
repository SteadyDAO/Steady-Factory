// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;
interface IChyme{
    struct Chyme{
        address oracleAddress;
        string infoUri;
        uint256 fees;
        uint256 reward;
        uint256 timeToMaturity;
        uint256 DAOApproved;
        uint256 ratioOfSteady;
    }
}
