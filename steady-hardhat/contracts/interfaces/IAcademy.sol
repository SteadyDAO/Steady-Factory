// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "./IChyme.sol";
interface IAcademy{
    function elixirImpl() external;
    function steadyImpl() external;
    function alchemistImpl() external;
    function steadyDAOToken() external;
    function DAOAddress() external;
    function chymeList(address _chyme) external returns (IChyme.Chyme memory);
    function getChymeInfo(address _chyme) external view returns (address oracleAddress, uint8 fees, uint8 ratio, uint8 decimals, uint timeToMaturity);
    function priceFromOracle(address _priceOracle) external view returns (int256 price);
}