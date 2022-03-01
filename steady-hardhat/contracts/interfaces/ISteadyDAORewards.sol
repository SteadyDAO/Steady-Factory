// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

//This extension is used to create all the related game mechanics eg. check if splitter has NFT, NFT strength, then mint the required amounts etc
interface ISteadyDAORewards {
    enum actionType{ SPLIT, MERGE, STAKE, FUSE, BREED }
    function performAction( actionType action, uint256 steadyAmount, uint256 fees ) external;
}