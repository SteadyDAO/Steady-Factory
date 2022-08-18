// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;


import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/IAccessControlEnumerableUpgradeable.sol";

import "./interfaces/IChyme.sol";
import "./Alchemist.sol";
contract AlchemistAcademy is Initializable {
    mapping(address => IChyme.Chyme) public chymeList;
    
    address public treasury;
    address public steadyImpl;
    address public DAOAddress;
    address public alchemistImpl;

    string steady = "Steady_";
    string steadySymbol = "s";

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event Chymed(
        address chyme,
        uint256 fees,
        uint256 approvalStatus,
        string symbol
    );
    event AlchemistForged(
        address indexed alchemist,
        address priceOracle,
        uint8 fees,
        address steadyImplForChyme
    );

    function initialize(
        address _steadyImpl,
        address _treasury,
        address _alchemistImpl,
        address _DAOAddress
    ) public initializer {
        steadyImpl = _steadyImpl;
        treasury = _treasury;
        alchemistImpl = _alchemistImpl;
        DAOAddress = _DAOAddress;
    }

    function createNewChyme(IChyme.Chyme memory _iChyme, address _chyme) external {
        _onlyDAO();
        string memory symbol = IERC20Burnable(_chyme).symbol();
        address _steadyImplForChyme = createSteady(
            string(abi.encodePacked(steady, symbol)),
            string(abi.encodePacked(steadySymbol, symbol))
        );
        _iChyme.steadyImplForChyme = _steadyImplForChyme;
        IChyme.Chyme memory chyme = _iChyme;
        chymeList[_chyme] = chyme;
        emit Chymed(_chyme, _iChyme.fees, _iChyme.DAOApproved, symbol);
        // here we create the alchemist because it is just based on the chyme type
        _alchemist(_chyme); //generate a new alchemist that can issue accounts and create elixirs for this type of chyme
    }

    ///@dev alchemist creates a new vault. In the vault that can be used to split/merge a chyme at a specific price
    function _alchemist(address _chyme) internal returns (address) {
        IChyme.Chyme memory chyme = chymeList[_chyme]; //the type of erc20 that will be split
        require(chyme.DAOApproved == 1, "Ye Chyme is Impure!");
        address alchemistDeployed = ClonesUpgradeable.clone(alchemistImpl);
        Alchemist(alchemistDeployed).initialize(_chyme);
        (bool success, ) = chyme.steadyImplForChyme.call(
            abi.encodeWithSignature(
                "grantRole(bytes32,address)",
                MINTER_ROLE,
                alchemistDeployed
            )
        );
        require(success);

        emit AlchemistForged(
            alchemistDeployed,
            chyme.oracleAddress,
            chyme.fees,
            chyme.steadyImplForChyme
        );
        return alchemistDeployed;
    }

    function createSteady(string memory name, string memory symbol)
        internal
        returns (address steady_)
    {
        steady_ = ClonesUpgradeable.clone(steadyImpl);
        //here the original implementation is not inited, we need to ensure only we can init it
        (bool success,) = steady_.call(
            abi.encodeWithSignature(
                "initialize(string,string)",
                name,
                symbol
            )
        );
        require(success, "Failed to init");
        return steady_;
    }

    /// @dev Oracle price for Chyme utilizing chainlink
    function priceFromOracle(address _priceOracle)
        public
        view
        returns (int256 price)
    {
        bytes memory payload = abi.encodeWithSignature("latestAnswer()");
        (, bytes memory returnData) = address(_priceOracle).staticcall(payload);
        (price) = abi.decode(returnData, (int256));
        require(
            price >= 1 && price <= 1000000000000000000000000000000,
            "Oracle price is out of range"
        );
    }

    function _onlyDAO() internal view {
        require(msg.sender == DAOAddress, "Requires Governance!");
    }

    function getChymeInfo(address _chyme)
        public
        view
        returns (
            address oracleAddress,
            uint8 fees,
            uint8 decimals,
            uint256 timeToMaturity,
            string memory symbol,
            address steadyImplForChyme,
            address steadyDAOReward
        )
    {
        return (
            chymeList[_chyme].oracleAddress,
            chymeList[_chyme].fees,
            chymeList[_chyme].decimals,
            chymeList[_chyme].timeToMaturity,
            chymeList[_chyme].symbol,
            chymeList[_chyme].steadyImplForChyme,
            chymeList[_chyme].steadyDAOReward
        );
    }
    function setChymeInfo(address _chyme, IChyme.Chyme calldata _iChyme)
        external
        returns (bool success)
    {
        _onlyDAO();
        chymeList[_chyme] = _iChyme;
        return true;
        //TODO: Add event
    }
}