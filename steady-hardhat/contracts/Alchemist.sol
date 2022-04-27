// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./interfaces/IERC20Burnable.sol";
import "./interfaces/IElixir.sol";

import "./interfaces/IChyme.sol";
import "./interfaces/IAcademy.sol";
import "./interfaces/ISteadyDAORewards.sol";

/// @title Split and Merge Token Chyme
contract Alchemist is ReentrancyGuard, Initializable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using SafeERC20Upgradeable for IERC20Burnable;

    address public chyme;
    address public steadyDAOToken;
    address public academy;
    address public steadyImpl;
    address public elixirImpl;
    address public treasury;
    address public steadyDAORewards;
    uint256 public forgePrice;
    uint256 public alchemistId;

    event Split(address indexed source, uint256 splitAmount, uint256 poolId);
    event Merge(address indexed source, uint256 mergedAmount, uint256 price);

    struct TokenInfo {
        uint256 balance;
        uint256 amount;
    }

    function initialize
    (
        address _chyme,
        address _steadyImpl,
        address _elixirImpl,
        address _treasury,
        uint256 _forgePrice,
        uint256 _alchemistId,
        address _steadyDAORewards
    ) 
        public 
        initializer 
    {
        __Alchemist_init
            (
                _chyme,  
                _steadyImpl, 
                _elixirImpl, 
                _treasury, 
                _forgePrice, 
                _alchemistId,
                _steadyDAORewards
            );
    }

    function __Alchemist_init(
        address _chyme,
        address _steadyImpl,
        address _elixirImpl,
        address _treasury,
        uint256 _forgePrice,
        uint256 _alchemistId,
        address _steadyDAORewards
    )  internal {
        chyme = _chyme;
        forgePrice = _forgePrice;
        alchemistId = _alchemistId;
        academy = msg.sender;
        steadyImpl = _steadyImpl;
        elixirImpl = _elixirImpl;
        treasury = _treasury;
        steadyDAORewards = _steadyDAORewards;
    }

    /// @notice This splits an amount of Chyme into two parts one is Steady tokens which takes the ratio of $ value
    /// @dev The rest is in Elixir NFT's which takes all the volatility of the commodity
    function split(uint256 amount) 
        external 
        nonReentrant() 
        returns (bool) 
    {
        require(amount >= 10); //minimum amount that can be split is 10 units
        IERC20Burnable steady = IERC20Burnable(address(steadyImpl));
        IElixir elixir = IElixir(address(elixirImpl));
        (,uint fees,uint ratioOfSteady,uint8 decimals,uint durationForMaturity) = IAcademy(address(academy)).getChymeInfo(chyme);
        uint divisor = 10 ** decimals;
        //two operands with decimals specified to token so ** 2 and 100 for ratioOfSteady to decimal conversion
        uint256 sChymeAmt = ((amount * ratioOfSteady * uint256(forgePrice)) / (100 * (divisor * divisor))) * (10 ** 18);
        //transfer the Chyme tokens to the splitter contract
        IERC20Upgradeable(address(chyme)).safeTransferFrom(msg.sender, address(this), amount);
        ISteadyDAORewards(steadyDAORewards).performAction(ISteadyDAORewards.actionType.SPLIT, sChymeAmt, fees);
        steady.mint(msg.sender, sChymeAmt);
        elixir.safeMint(msg.sender, chyme, forgePrice, amount, block.timestamp + durationForMaturity);
        emit Split(msg.sender, amount, alchemistId);
        return true;
    }

    /// @notice This closes a given Elixir NFT
    function merge(uint256 tokenId) 
        external 
        nonReentrant() 
        returns (bool) 
    {
        TokenInfo memory _steady;
        uint chymeAmountToMerge;
        uint timeToMaturity;
        IERC20Burnable steady = IERC20Burnable(address(steadyImpl));
        IElixir elixir = IElixir(address(elixirImpl));
        address chymeBeneficiary = elixir.ownerOf(tokenId);
        (,uint fees,uint ratioOfSteady,,) = IAcademy(address(academy)).getChymeInfo(chyme);
        (_steady.amount, chymeAmountToMerge, timeToMaturity) = elixir.getSteadyRequired(tokenId);
        _steady.balance = steady.balanceOf(msg.sender);
        
        require(_steady.amount <= _steady.balance, "Need more Steady");
        
        if(timeToMaturity > block.timestamp){
            require(chymeBeneficiary == msg.sender, "Ye have no elixir!");
            //approve Chyme from this address to the msg.sender proportional to the total value
            IERC20Upgradeable(chyme).safeIncreaseAllowance(chymeBeneficiary, chymeAmountToMerge);
        }
        else {// the maturity time has expired anyone can now call to mature this chyme
            //approve Chyme from this address to the chymeBeneficiary proportional to the value in elixir
            IERC20Upgradeable(chyme).safeIncreaseAllowance(chymeBeneficiary, chymeAmountToMerge * (100 - ratioOfSteady) / 100);
            //approve Chyme from this address to the msg.sender proportional to the value in steady
            IERC20Upgradeable(chyme).safeIncreaseAllowance(msg.sender, chymeAmountToMerge * ratioOfSteady / 100);
        }
        ISteadyDAORewards(steadyDAORewards).performAction(ISteadyDAORewards.actionType.MERGE, _steady.amount, fees);
        steady.burnFrom(msg.sender, _steady.amount);
        elixir.burn(tokenId);
        emit Merge(msg.sender, chymeAmountToMerge, forgePrice);
        return true;
    }

    function getChyme() public view returns (address){
        return chyme;
    }
}
