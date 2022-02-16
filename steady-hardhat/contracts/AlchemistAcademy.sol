// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/IAccessControlEnumerableUpgradeable.sol";


import "./interfaces/IChyme.sol";
import "./Alchemist.sol";

import "hardhat/console.sol";

contract AlchemistAcademy is Initializable {

    mapping(address => IChyme.Chyme) public chymeList;
    
    address public elixirImpl;
    address public steadyImpl;
    address public alchemistImpl;
    address public steadyDAOToken;
    address public treasury;
    address public DAOAddress;

    uint256 public alchemistCounter;
    uint256 public constant CREATION_FEE = 0.00001 ether;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event Chymed(address chyme, uint256 fees, uint256 approvalStatus);
    event AlchemistForged(address indexed alchemist, address priceOracle, int256 forgePrice);

    function initialize
    (
        address _steadyDAOToken,
        address _steadyImpl, 
        address _elixirImpl,
        address _treasury,
        address _alchemistImpl,
        address _DAOAddress
    ) 
        public 
        initializer 
    {
        steadyImpl = _steadyImpl;
        elixirImpl = _elixirImpl;
        treasury = _treasury;
        alchemistImpl = _alchemistImpl;
        steadyDAOToken = _steadyDAOToken;
        DAOAddress = _DAOAddress;
    }

    ///@dev alchemist alchemists that can be used to split a chyme at a specific price
    function alchemist
    (
        address _chyme
    ) 
        external
        payable
        returns 
        (address) 
    {
        IChyme.Chyme memory chyme = chymeList[_chyme];
        require(chyme.DAOApproved == 1, "Ye Chyme is Impure!");
        require(msg.value >= CREATION_FEE);
        int256 forgePrice = priceFromOracle(chyme.oracleAddress);
        address alchemistDeployed = ClonesUpgradeable.clone(alchemistImpl);
        Alchemist(alchemistDeployed)
        .initialize(
            _chyme,
            steadyDAOToken,
            steadyImpl,
            elixirImpl,
            treasury,
            uint256(forgePrice), 
            alchemistCounter++); //TODO :Check on counter security
        IAccessControlEnumerableUpgradeable(steadyImpl).grantRole(MINTER_ROLE, alchemistDeployed);
        IAccessControlEnumerableUpgradeable(elixirImpl).grantRole(MINTER_ROLE, alchemistDeployed);
        emit AlchemistForged(alchemistDeployed, chyme.oracleAddress, forgePrice);
        //transfer the creation fee to the treasury
        // payable(DAOAddress).transfer(CREATION_FEE);
        // //transfer steady DAO tokens to the creator for this alchemist creation
        // if(chyme.reward > 0){
        //     IERC20Upgradeable(steadyDAOToken).transfer(msg.sender, chyme.reward);
        // }
        return alchemistDeployed;
    }

    function createNewChyme
    (
        uint8 _decimals,
        uint8 _ratioOfSteady,
        uint8 _fees,
        uint8 _approvalStatus,
        address _chyme, 
        address _oracleAddress,
        uint256 _timeToMaturity,
        uint256 _rewardAmount
    ) 
        external 
    {
        _onlyDAO();

        IChyme.Chyme memory chyme = IChyme.Chyme(
            _decimals,
            _ratioOfSteady,
            _fees,
            _approvalStatus,
            _oracleAddress,
            "",
            _rewardAmount,
            _timeToMaturity
        );
        chymeList[_chyme] = chyme;
        emit Chymed(_chyme, _fees, _approvalStatus);
    }

    /// @dev Oracle price for Chyme utilizing chainlink
    function priceFromOracle(address _priceOracle) public view returns (int256 price) {
        bytes memory payload = abi.encodeWithSignature("latestAnswer()");
        (, bytes memory returnData) = address(_priceOracle).staticcall(payload);
        (price) = abi.decode(returnData, (int256));
        require(price >= 1 && price <= 1000000000000000000000000000000, "Oracle price is out of range");
    }

    function _onlyDAO() internal view {
        require(msg.sender == DAOAddress, "Requires Governance!");
    }

    function getChymeInfo(address _chyme) public view returns 
    (
        address oracleAddress, 
        uint8 fees, 
        uint8 ratio,
        uint8 decimals,
        uint timeToMaturity
        ) {
        return
        (
            chymeList[_chyme].oracleAddress, 
            chymeList[_chyme].fees, 
            chymeList[_chyme].ratioOfSteady,
            chymeList[_chyme].decimals,  
            chymeList[_chyme].timeToMaturity
        );
    }
}