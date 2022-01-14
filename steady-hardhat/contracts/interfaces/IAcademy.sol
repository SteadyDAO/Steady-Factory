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
}