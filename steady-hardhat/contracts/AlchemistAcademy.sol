// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;


import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";

import "./interfaces/IChyme.sol";
import "./Alchemist.sol";
import "./SteadyDaoToken.sol";
import "./ElixirNFT.sol";
// import "./interfaces/IERC20Burnable.sol";

import "hardhat/console.sol";

contract AlchemistAcademy is Initializable {

    mapping(address => IChyme.Chyme) public chymeList;
    
    address public elixirImpl;
    address public steadyImpl;
    address public alchemistImpl;
    address public steadyDAOToken;
    address payable public DAOAddress;

    uint256 public alchemistCounter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event Chymed(address chyme, uint256 fees, bool approvalStatus);
    event AlchemistForged(address alchemist, address priceOracle, int256 forgePrice);

    function initialize
    (
        address _steadyDAOToken,
        string memory uri, 
        string memory name, 
        string memory symbol,
        address payable _DAOAddress
    ) 
        public 
        initializer 
    {
        steadyImpl = address(new ERC20PresetMinterPauserUpgradeable());
        ERC20PresetMinterPauserUpgradeable(steadyImpl).initialize(name, symbol);
        
        elixirImpl = address(new Elixir("Elixir", "ELX"));
        
        alchemistImpl = address(new Alchemist());
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
        require(chyme.DAOApproved == true, "Ye Chyme is Impure!");
        require(msg.value >= 100);

        int256 forgePrice = priceFromOracle(chyme.oracleAddress);

        address alchemistDeployed = ClonesUpgradeable.clone(alchemistImpl);
        Alchemist(alchemistDeployed)
        .initialize(
            _chyme, 
            steadyImpl,
            elixirImpl,
            forgePrice, 
            alchemistCounter++);
        
        //so we will still have a single 
        
        IAccessControlEnumerableUpgradeable(steadyImpl).grantRole(MINTER_ROLE, alchemistDeployed);
        IAccessControlEnumerableUpgradeable(elixirImpl).grantRole(MINTER_ROLE, alchemistDeployed);

        emit AlchemistForged(alchemistDeployed, chyme.oracleAddress, forgePrice);
        DAOAddress.transfer(msg.value); //transfer the creation fee to the treasury
        if(chyme.reward > 0){
            IERC20Upgradeable(steadyDAOToken).transfer(msg.sender, chyme.reward);
        }
        return alchemistDeployed;
    }

    function createNewChyme
    (
        address _chyme, 
        address _oracleAddress,
        uint256 _fees,
        uint256 _rewardAmount,
        uint256 _timeToMaturity,
        bool _approvalStatus
    ) 
        external 
    {
        _onlyDAO();

        IChyme.Chyme memory chyme = IChyme.Chyme(
            _oracleAddress,
            "",
            _fees,
            _rewardAmount,
            _timeToMaturity,
            _approvalStatus
        );
        chymeList[_chyme] = chyme;
        emit Chymed(_chyme, _fees, _approvalStatus);
    }

    /// @dev Oracle price for Chyme utilizing chainlink
    function priceFromOracle(address _priceOracle) public view returns (int256 price) {
        // bytes memory payload = abi.encodeWithSignature("getLatestPrice()");
        bytes memory payload = abi.encodeWithSignature("latestAnswer()");
        (, bytes memory returnData) = address(_priceOracle).staticcall(payload);
        (price) = abi.decode(returnData, (int256));
        //minimumn price of 0.00000001 and max price of 1 Trillion
        require(price >= 1 && price <= 1000000000000000000000000000000, "Oracle price is out of range");
    }

    function _onlyDAO() private {
        require(msg.sender == DAOAddress, "Requires Governance!");
    }
}